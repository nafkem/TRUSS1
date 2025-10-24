import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
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

// localStorage keys
const CART_STORAGE_KEY = 'ecommerce_cart';

// Helper functions for localStorage
const saveCartToStorage = (cartItems: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error('❌ Error saving cart to localStorage:', error);
  }
};

const loadCartFromStorage = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      return JSON.parse(storedCart);
    }
  } catch (error) {
    console.error('❌ Error loading cart from localStorage:', error);
  }
  return [];
};

// Cart reducer implementation (updated to sync with localStorage)
const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;

  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cartItems.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        newState = {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          cartTotal: state.cartTotal + (parseFloat(action.payload.price) * action.payload.quantity)
        };
      } else {
        newState = {
          ...state,
          cartItems: [...state.cartItems, action.payload],
          cartTotal: state.cartTotal + (parseFloat(action.payload.price) * action.payload.quantity)
        };
      }
      break;
    }

    case 'REMOVE_FROM_CART': {
      const itemToRemove = state.cartItems.find(item => item.productId === action.payload);
      if (!itemToRemove) return state;
      
      const removeTotal = parseFloat(itemToRemove.price) * itemToRemove.quantity;
      
      newState = {
        ...state,
        cartItems: state.cartItems.filter(item => item.productId !== action.payload),
        cartTotal: state.cartTotal - removeTotal
      };
      break;
    }

    case 'UPDATE_QUANTITY': {
      const itemToUpdate = state.cartItems.find(item => item.productId === action.payload.productId);
      if (!itemToUpdate) return state;

      const oldItemTotal = parseFloat(itemToUpdate.price) * itemToUpdate.quantity;
      const newItemTotal = parseFloat(itemToUpdate.price) * action.payload.quantity;

      newState = {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        cartTotal: state.cartTotal - oldItemTotal + newItemTotal
      };
      break;
    }

    case 'CLEAR_CART':
      newState = {
        ...state,
        cartItems: [],
        cartTotal: 0
      };
      break;

    case 'SET_CART': {
      const calculatedTotal = action.payload.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
      }, 0);
      
      newState = {
        ...state,
        cartItems: action.payload,
        cartTotal: calculatedTotal
      };
      break;
    }

    case 'SET_LOADING':
      newState = {
        ...state,
        isLoading: action.payload
      };
      break;

    default:
      return state;
  }

  // Save to localStorage after every cart modification
  if (action.type !== 'SET_LOADING') {
    saveCartToStorage(newState.cartItems);
  }

  return newState;
};

// Initial state with localStorage loading
const getInitialState = (): CartState => {
  const cartItems = loadCartFromStorage();
  const cartTotal = cartItems.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity);
  }, 0);

  return {
    cartItems,
    cartTotal,
    isLoading: false
  };
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, getInitialState());
  const { account } = useWallet();

  // Sync cart when account changes (optional)
  useEffect(() => {
    if (account) {
      // You can add logic here to merge localStorage cart with blockchain cart if needed
      console.log('🔄 Account changed, cart loaded from localStorage');
    }
  }, [account]);

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
      console.log("✅ Successfully added to blockchain cart and localStorage");
      
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
      console.log("✅ Successfully removed from blockchain cart and localStorage");
      
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
      
      console.log("✅ Successfully updated blockchain cart quantity and localStorage");
      
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
      console.log("✅ Successfully cleared blockchain cart and localStorage");
      
    } catch (error) {
      console.error('❌ Error clearing blockchain cart:', error);
      throw error;
    }
  };

  const refreshCart = async () => {
    console.log("🔄 Refresh cart - Loading from localStorage");
    const cartItems = loadCartFromStorage();
    dispatch({ type: 'SET_CART', payload: cartItems });
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