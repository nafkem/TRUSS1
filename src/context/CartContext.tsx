import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { useWallet } from './walletContext';

export interface CartItem {
  productId: string;
  title: string;
  price: string;
  image?: string;
  quantity: number;
  blockchainAdded: boolean;
  sellerId?: string;
}

interface CartContextType {
  // State
  cartItems: CartItem[];
  isLoading: boolean;
  
  // Actions
  addToCart: (product: Omit<CartItem, 'quantity' | 'blockchainAdded'>) => Promise<void>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed values
  cartTotal: number;
  itemCount: number;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { account } = useWallet();

  // Load cart from localStorage when account changes
  useEffect(() => {
    if (account) {
      try {
        const savedCart = localStorage.getItem(`cart_${account}`);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
        }
      } catch (error) {
        console.error('❌ Error loading cart from storage:', error);
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [account]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (account && cartItems.length > 0) {
      try {
        localStorage.setItem(`cart_${account}`, JSON.stringify(cartItems));
      } catch (error) {
        console.error('❌ Error saving cart to storage:', error);
      }
    }
  }, [cartItems, account]);

  /**
   * Add product to cart or increment quantity if already exists
   */
  const addToCart = async (product: Omit<CartItem, 'quantity' | 'blockchainAdded'>): Promise<void> => {
    try {
      setIsLoading(true);
      
      const existingItem = cartItems.find(item => item.productId === product.productId);
      
      if (existingItem) {
        // Increment quantity
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.productId === product.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
        toast.success(`➕ ${product.title} quantity updated`);
      } else {
        // Add new item
        const newItem: CartItem = {
          ...product,
          quantity: 1,
          blockchainAdded: false
        };
        
        setCartItems(prevItems => [...prevItems, newItem]);
        toast.success(`🛒 ${product.title} added to cart`);
      }
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove item from cart completely
   */
  const removeFromCart = (productId: string): void => {
    const item = cartItems.find(item => item.productId === productId);
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
    
    if (item) {
      toast.info(`🗑️ ${item.title} removed from cart`);
    }
  };

  /**
   * Update quantity of specific item
   */
  const updateQuantity = (productId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  /**
   * Clear entire cart
   */
  const clearCart = (): void => {
    setCartItems([]);
    toast.info('🧹 Cart cleared');
  };

  /**
   * Check if product is already in cart
   */
  const isInCart = (productId: string): boolean => {
    return cartItems.some(item => item.productId === productId);
  };

  /**
   * Get quantity of specific product in cart
   */
  const getItemQuantity = (productId: string): number => {
    const item = cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  /**
   * Calculate total price of all items in cart
   */
  const cartTotal = cartItems.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity);
  }, 0);

  /**
   * Calculate total number of items in cart
   */
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value: CartContextType = {
    // State
    cartItems,
    isLoading,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    
    // Computed values
    cartTotal,
    itemCount,
    getItemQuantity,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Custom hook to use cart context
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};