import { useCart } from '../../context/CartContext';
import { useWallet } from '../../context/walletContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const { account } = useWallet();
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const handleProceedToPayment = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      toast.info('Processing payment...');
      
      // For now, just show success and navigate
      // We'll add actual payment integration in the next step
      setTimeout(() => {
        toast.success('✅ Payment successful!');
        navigate('/order-confirmation'); // We'll create this page next
      }, 2000);
      
    } catch (err: any) {
      console.error('❌ Payment error:', err);
      toast.error('❌ Payment failed. Please try again.');
    }
  };

  // ✅ FIX: Better image URL formatting
  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return null;
    
    // If it's already a full URL, use it directly
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // If it's a relative path, prepend the backend URL
    if (imageUrl.startsWith('/')) return `http://localhost:3001${imageUrl}`;
    
    // If it's just a filename, assume it's in the backend
    return `http://localhost:3001/uploads/${imageUrl}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12 bg-white rounded-lg shadow border">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some products to checkout!</p>
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <button
          onClick={handleBackToCart}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Summary */}
        <div className="bg-white rounded-lg shadow-lg border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => {
              const imageUrl = getImageUrl(item.image);
              console.log('Image URL for', item.title, ':', imageUrl); // Debug log
              
              return (
                <div key={item.productId} className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center">
                    {imageUrl ? (
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg mr-3 border"
                          onError={(e) => {
                            console.log('Image failed to load:', imageUrl);
                            e.currentTarget.style.display = 'none';
                            // Show fallback
                            const fallback = e.currentTarget.nextSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div 
                          className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 mr-3 border hidden"
                          style={{ display: 'none' }}
                        >
                          📦
                        </div>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 mr-3 border">
                        📦
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-xs text-gray-500">ID: {item.productId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">${item.price} each</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-semibold">$0.00</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-green-600">${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Method */}
        <div className="bg-white rounded-lg shadow-lg border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
          
          <div className="space-y-4">
            <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50 cursor-pointer">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  Ξ
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700">Pay with Ethereum</h3>
                  <p className="text-sm text-gray-600">Pay directly with ETH</p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer opacity-50">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  $
                </div>
                <div>
                  <h3 className="font-semibold">Pay with Stablecoin</h3>
                  <p className="text-sm text-gray-600">USDC, DAI, etc. (Coming Soon)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleProceedToPayment}
              disabled={!account}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold text-lg transition-colors"
            >
              {!account ? 'Connect Wallet to Pay' : 'Pay Now with ETH'}
            </button>
            
            {!account && (
              <p className="text-center text-sm text-gray-600 mt-3">
                Please connect your wallet to complete payment
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}