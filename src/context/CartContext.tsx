import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ecommerceService } from '../contracts/ecommerce/ecommerceService';
import { useWallet } from '../context/walletContext';
import { userService } from '../contracts/user/userService';

// Define CartItem interface
export interface CartItem {
  productId: string;
  title: string;
  price: string;
  quantity: number;
  image?: string;
  sellerId: string;
}

interface CartState {
  cartItems: CartItem[];
  cartTotal: number;
  isLoading: boolean;
}

interface CartContextType extends CartState {
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Define action types
type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean };

// Cart reducer implementation
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cartItems.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          cartTotal: state.cartTotal + (parseFloat(action.payload.price) * action.payload.quantity)
        };
      }
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
        cartTotal: state.cartTotal + (parseFloat(action.payload.price) * action.payload.quantity)
      };
    }

    case 'REMOVE_FROM_CART': {
      const itemToRemove = state.cartItems.find(item => item.productId === action.payload);
      if (!itemToRemove) return state;
      
      const removeTotal = parseFloat(itemToRemove.price) * itemToRemove.quantity;
      
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.productId !== action.payload),
        cartTotal: state.cartTotal - removeTotal
      };
    }

    case 'UPDATE_QUANTITY': {
      const itemToUpdate = state.cartItems.find(item => item.productId === action.payload.productId);
      if (!itemToUpdate) return state;

      const oldItemTotal = parseFloat(itemToUpdate.price) * itemToUpdate.quantity;
      const newItemTotal = parseFloat(itemToUpdate.price) * action.payload.quantity;

      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        cartTotal: state.cartTotal - oldItemTotal + newItemTotal
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
        cartTotal: 0
      };

    case 'SET_CART': {
      const calculatedTotal = action.payload.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
      }, 0);
      
      return {
        ...state,
        cartItems: action.payload,
        cartTotal: calculatedTotal
      };
    }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    default:
      return state;
  }
};

// Initial state
const initialState: CartState = {
  cartItems: [],
  cartTotal: 0,
  isLoading: false
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { account } = useWallet();

  // Get REAL user ID from user contract
  const getUserIdFromAddress = async (address: string): Promise<bigint> => {
    if (!address) {
      console.error("❌ No address provided");
      return BigInt(0);
    }
    
    try {
      console.log("🔍 Getting user data for address:", address);
      const userData = await userService.getUserData(address);
      console.log("📋 User data from contract:", userData);
      
      const userId = userData.userId;
      
      if (!userId || userId === 0) {
        console.error("❌ User not registered or user ID is 0 for address:", address);
        return BigInt(0);
      }
      
      const userIdBigInt = BigInt(userId);
      console.log("✅ Found user ID:", userIdBigInt.toString());
      return userIdBigInt;
      
    } catch (error) {
      console.error('❌ Error getting user ID from contract:', error);
      return BigInt(0);
    }
  };

  const addToCart = async (item: CartItem) => {
    if (!account) {
      throw new Error("Please connect your wallet first");
    }

    try {
      console.log("➕ Adding to blockchain cart:", item);
      
      // Get user ID for blockchain operations
      const userId = await getUserIdFromAddress(account);
      if (userId === BigInt(0)) {
        throw new Error("User not registered on blockchain");
      }

      console.log("🔗 Calling blockchain: addProductToCart...");
      
      // ✅ THIS WILL TRIGGER METAMASK POPUP
      const result = await ecommerceService.addProductToCart(item.productId, item.quantity);
      
      console.log("⏳ Waiting for transaction confirmation...");
      
      // Wait for transaction to be mined
      if (result && result.tx) {
        await result.tx.wait();
        console.log("✅ Blockchain transaction confirmed!");
      }

      // Only update local state AFTER blockchain success
      dispatch({ type: 'ADD_TO_CART', payload: item });
      console.log("✅ Successfully added to blockchain cart");
      
    } catch (error) {
      console.error('❌ Error adding to blockchain cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!account) {
      throw new Error("Please connect your wallet first");
    }

    try {
      console.log("➖ Removing from blockchain cart:", productId);
      
      // Get user ID for blockchain operations
      const userId = await getUserIdFromAddress(account);
      if (userId === BigInt(0)) {
        throw new Error("User not registered on blockchain");
      }

      console.log("🔗 Calling blockchain: removeProductFromCart...");
      
      // ✅ THIS WILL TRIGGER METAMASK POPUP
      const result = await ecommerceService.removeProductFromCart(productId);
      
      console.log("⏳ Waiting for transaction confirmation...");
      
      // Wait for transaction to be mined
      if (result && result.tx) {
        await result.tx.wait();
        console.log("✅ Blockchain transaction confirmed!");
      }

      // Only update local state AFTER blockchain success
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
      console.log("✅ Successfully removed from blockchain cart");
      
    } catch (error) {
      console.error('❌ Error removing from blockchain cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      console.log("✏️ Updating blockchain cart quantity:", productId, "→", quantity);
      
      if (quantity < 1) {
        await removeFromCart(productId);
        return;
      }

      // For blockchain, we need to remove and re-add with new quantity
      await removeFromCart(productId);
      await addToCart({
        productId,
        title: "", // These will be filled from existing item
        price: "0", 
        sellerId: "0",
        quantity,
        image: ""
      });
      
      console.log("✅ Successfully updated blockchain cart quantity");
      
    } catch (error) {
      console.error('❌ Error updating quantity:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!account) {
      throw new Error("Please connect your wallet first");
    }

    try {
      console.log("🗑️ Clearing blockchain cart");
      
      // Get user ID for blockchain operations
      const userId = await getUserIdFromAddress(account);
      if (userId === BigInt(0)) {
        throw new Error("User not registered on blockchain");
      }

      console.log("🔗 Calling blockchain: clearCart...");
      
      // ✅ THIS WILL TRIGGER METAMASK POPUP
      const result = await ecommerceService.clearCart();
      
      console.log("⏳ Waiting for transaction confirmation...");
      
      // Wait for transaction to be mined
      if (result && result.tx) {
        await result.tx.wait();
        console.log("✅ Blockchain transaction confirmed!");
      }

      // Only update local state AFTER blockchain success
      dispatch({ type: 'CLEAR_CART' });
      console.log("✅ Successfully cleared blockchain cart");
      
    } catch (error) {
      console.error('❌ Error clearing blockchain cart:', error);
      throw error;
    }
  };

  const refreshCart = async () => {
    console.log("🔄 Refresh cart - Not implemented for blockchain");
    // For now, we'll keep cart state local
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        cartTotal: state.cartTotal,
        isLoading: state.isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};