import { useCart } from '../../context/CartContext';
import { useWallet } from '../../context/walletContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, isLoading, refreshCart } = useCart();
  const { account, isConnected } = useWallet();
  const navigate = useNavigate();

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item from cart');
    }
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemoveItem(productId);
      return;
    }
    
    try {
      await updateQuantity(productId, newQuantity);
      toast.success('Quantity updated');
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleCheckout = () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    navigate('/checkout');
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleRefreshCart = async () => {
    try {
      await refreshCart();
      toast.success('Cart refreshed');
    } catch (error) {
      toast.error('Failed to refresh cart');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-2xl font-bold text-gray-800 mb-4">Loading Cart...</div>
          <p className="text-gray-600">Fetching your cart items from blockchain</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12 bg-white rounded-lg shadow border">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <div className="space-x-4">
            <button
              onClick={handleContinueShopping}
              className="bg-neutral-800 text-white px-6 py-3 rounded-lg hover:bg-neutral-700"
            >
              Browse Products
            </button>
            {isConnected && (
              <button
                onClick={handleRefreshCart}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Refresh Cart
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleContinueShopping}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Continue Shopping
          </button>
          <button
            onClick={handleRefreshCart}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Refresh Cart
          </button>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-800 font-medium border border-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg border mb-6">
        {cartItems.map((item) => (
          <div key={item.productId} className="flex items-center p-6 border-b last:border-b-0">
            {item.image && (
              <img
                src={item.image.startsWith('http') ? item.image : `http://localhost:3001${item.image}`}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-lg mr-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
 
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-1">Seller ID: {item.sellerId}</p>
              <p className="text-green-600 font-bold">${item.price}</p>
            </div>
            
            <div className="flex items-center space-x-3 mr-4">
              <button
                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                disabled={isLoading}
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                disabled={isLoading}
              >
                +
              </button>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-900">
                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => handleRemoveItem(item.productId)}
                className="text-red-500 hover:text-red-700 text-sm mt-1"
                disabled={isLoading}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-lg border p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold">Total:</span>
          <span className="text-2xl font-bold text-green-600">${cartTotal.toFixed(2)}</span>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleCheckout}
            disabled={!account || isLoading}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold text-lg transition-colors"
          >
            {!account ? 'Connect Wallet to Checkout' : isLoading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
          
          {!account && (
            <p className="text-center text-sm text-gray-600">
              Please connect your wallet to complete checkout
            </p>
          )}
        </div>
      </div>
    </div>
  );
}