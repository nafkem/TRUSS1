import { useCart } from '../../context/CartContext';
import { useWallet } from '../../context/walletContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal} = useCart();
  const { account } = useWallet();
  const navigate = useNavigate();

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast.success('Item removed from cart');
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }
    // Add your checkout logic here
    toast.info('Proceeding to checkout...');
     navigate('/checkout'); // Uncomment if you have a checkout page
  };

  
  const handleContinueShopping = () => {
    navigate('/products');
  };

  // ✅ Use the pre-calculated cartTotal instead of recalculating
  // const totalPrice = cartTotal; // You can use cartTotal directly

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12 bg-white rounded-lg shadow border">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <button
            onClick={handleContinueShopping}
            className="bg-neutral-800 text-white px-6 py-3 rounded-lg hover:bg-neutral-700"
          >
            Browse Products
          </button>
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
            onClick={clearCart}
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
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
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
            disabled={!account}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold text-lg transition-colors"
          >
            {!account ? 'Connect Wallet to Checkout' : 'Proceed to Checkout'}
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