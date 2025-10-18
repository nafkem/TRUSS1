import { useLocation, useNavigate } from 'react-router-dom';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount, paymentMethod, items } = location.state || {
    amount: 0,
    paymentMethod: 'ETH',
    items: 0
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleViewOrders = () => {
    navigate('/order');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen flex items-center justify-center">
      <div className="text-center py-12 bg-white rounded-lg shadow border w-full">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 mx-auto max-w-md">
          <p className="text-green-800 font-semibold mb-2">Payment Successful</p>
          <p className="text-green-700">
            ${amount} paid with {paymentMethod}
          </p>
          <p className="text-green-600 text-sm mt-1">
            {items} item{items !== 1 ? 's' : ''} purchased
          </p>
        </div>

        <p className="text-gray-600 mb-2">
          Thank you for your purchase! Your order has been received.
        </p>
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
          The seller will now prepare your items for shipment. 
          You will be notified when your order ships. 
          You can track your order status in the Orders section.
        </p>
        
        <div className="space-y-3 max-w-xs mx-auto">
          <button
            onClick={handleContinueShopping}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={handleViewOrders}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
}