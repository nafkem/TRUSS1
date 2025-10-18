import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWallet } from '../../context/walletContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Define proper types for cart items
interface CartItem {
  productId: string;
  title: string;
  price: string;
  quantity: number;
  image?: string;
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { account } = useWallet();
  const navigate = useNavigate();
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'eth' | 'stablecoin'>('eth');

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

    if (selectedPayment === 'stablecoin') {
      toast.info('Stablecoin payments coming soon!');
      return;
    }

    try {
      setProcessingPayment(true);
      toast.info('Processing payment with ETH...');
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('✅ Payment successful!');
      
      // Clear cart after successful payment
      clearCart();
      
      // Navigate to order confirmation
      navigate('/order-confirmation', { 
        state: { 
          amount: cartTotal,
          paymentMethod: 'ETH',
          items: cartItems.length
        } 
      });
      
    } catch (err: any) {
      console.error('❌ Payment error:', err);
      toast.error('❌ Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const formatImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:3001${imageUrl}`;
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
            {(cartItems as CartItem[]).map((item: CartItem) => {
              const imageUrl = formatImageUrl(item.image);
              const price = parseFloat(item.price);
              const quantity = item.quantity || 0;
              const itemTotal = price * quantity;

              return (
                <div key={item.productId} className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded-lg mr-3"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 mr-3">
                        📦
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">Qty: {quantity}</p>
                      <p className="text-xs text-gray-500">ID: {item.productId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${itemTotal.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">${price.toFixed(2)} each</p>
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
            {/* ETH Payment Option */}
            <div 
              onClick={() => setSelectedPayment('eth')}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedPayment === 'eth' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  Ξ
                </div>
                <div>
                  <h3 className={`font-semibold ${
                    selectedPayment === 'eth' ? 'text-blue-700' : 'text-gray-900'
                  }`}>
                    Pay with Ethereum
                  </h3>
                  <p className="text-sm text-gray-600">Pay directly with ETH</p>
                </div>
              </div>
            </div>

            {/* Stablecoin Payment Option */}
            <div 
              onClick={() => toast.info('Stablecoin payments coming soon!')}
              className="border rounded-lg p-4 cursor-pointer opacity-50 hover:opacity-70 transition-opacity"
            >
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
              disabled={!account || processingPayment}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold text-lg transition-colors"
            >
              {processingPayment ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing...
                </span>
              ) : !account ? (
                'Connect Wallet to Pay'
              ) : (
                `Pay Now with ${selectedPayment === 'eth' ? 'ETH' : 'Stablecoin'}`
              )}
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