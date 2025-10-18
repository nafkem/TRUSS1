// src/page/checkout/index.tsx
import { useState, useEffect } from "react";
import { useCart } from '../../context/CartContext';
import { useWallet } from '../../context/walletContext';
import { toast } from 'sonner';
//import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
//import { getEcommerceContract } from "../../contracts";
import { ecommerceService } from '../../contracts/ecommerce/ecommerceService';
import { escrowService } from '../../contracts/escrow/escrowService';

type PaymentMethod = "ETH" | "USDT" | "USDC";

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { account } = useWallet();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ETH");
  const [processing, setProcessing] = useState(false);
  const [acceptedTokens, setAcceptedTokens] = useState<string[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(true);

  // Load accepted tokens from escrow contract
  useEffect(() => {
    const loadAcceptedTokens = async () => {
      try {
        setLoadingTokens(true);
        const tokens = await escrowService.getAcceptedTokens();
        setAcceptedTokens(tokens);

        if (tokens.length > 0) {
          for (const token of tokens) {
            const isAccepted = await escrowService.isAccepted(token);
            console.log(`Token ${token} accepted:`, isAccepted);
          }
        }
      } catch (error) {
        console.error("❌ Error loading accepted tokens:", error);
        toast.error("Failed to load payment options");
      } finally {
        setLoadingTokens(false);
      }
    };

    if (account) loadAcceptedTokens();
  }, [account]);

  const handleContinueShopping = () => navigate('/products');
  const handleBackToCart = () => navigate('/cart');

  const handleProceedToPayment = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setProcessing(true);
      toast.info('🦊 Processing payment with MetaMask...');

      if (paymentMethod === "ETH") {
        await handleEthPayment();
      } else {
        await handleStablecoinPayment();
      }

      await clearCart();
      toast.success('✅ Payment successful! Order confirmed.');
      navigate('/order-confirmation');
    } catch (err: any) {
      console.error('❌ Payment error:', err);
      const errorMessage = err?.reason || err?.message || 'Payment failed. Please try again.';
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setProcessing(false);
    }
  };

  // ETH payment handler — uses ecommerceService.checkOutWithNative(payToken: string, value: string)
  const handleEthPayment = async () => {
    try {
      const isEthAccepted = await escrowService.isAccepted("ETH");
      if (!isEthAccepted) throw new Error("ETH is not accepted for payments");

      const usdValue = Number(cartTotal);
      if (!usdValue || usdValue <= 0) throw new Error("Invalid cart total");

      // Temporary conversion — replace with on-chain oracle or API for production
      const ethRate = 3000; // 1 ETH = $3000
      const cartTotalInEth = usdValue / ethRate;

      console.log(`💸 Paying $${usdValue} (~${cartTotalInEth} ETH)`);

      // Call service using the original service signature (value as string)
      const result: any = await ecommerceService.checkOutWithNative("ETH", cartTotalInEth.toString());

      // result expected to be { tx, receipt } per your existing service
      if (result?.tx && typeof result.tx.wait === "function") {
        toast.info('⏳ Waiting for blockchain confirmation...');
        await result.tx.wait();
        console.log("✅ ETH payment confirmed on blockchain!");
      } else {
        console.warn("Unexpected checkout response:", result);
        throw new Error("Unexpected checkout response");
      }
    } catch (error) {
      console.error("ETH payment failed:", error);
      throw error;
    }
  };

  const handleStablecoinPayment = async () => {
    try {
      const isAccepted = await escrowService.isAccepted(paymentMethod);
      if (!isAccepted) {
        throw new Error(`${paymentMethod} is not accepted for payments. Available tokens: ${acceptedTokens.join(', ')}`);
      }

      console.log(`💸 Paying $${cartTotal} with ${paymentMethod}`);

      // Existing service call (assumes it returns { tx, receipt })
      const result: any = await ecommerceService.checkOutWithUSD(paymentMethod);

      if (result?.tx && typeof result.tx.wait === "function") {
        toast.info('⏳ Waiting for blockchain confirmation...');
        await result.tx.wait();
        console.log(`✅ ${paymentMethod} payment confirmed on blockchain!`);
      } else {
        console.warn("Unexpected checkout response:", result);
        throw new Error("Unexpected checkout response");
      }
    } catch (error) {
      console.error("Stablecoin payment failed:", error);
      throw error;
    }
  };

  const getAvailablePaymentMethods = () => {
    const methods: PaymentMethod[] = [];
    if (acceptedTokens.includes("ETH")) methods.push("ETH");
    if (acceptedTokens.includes("USDT")) methods.push("USDT");
    if (acceptedTokens.includes("USDC")) methods.push("USDC");
    return methods;
  };

  const availableMethods = getAvailablePaymentMethods();

  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `http://localhost:3001${imageUrl}`;
    return `http://localhost:3001/uploads/${imageUrl}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12 bg-white rounded-lg shadow border">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some products to checkout!</p>
          <button onClick={handleContinueShopping} className="bg-neutral-800 text-white px-6 py-3 rounded-lg hover:bg-neutral-700">
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
        <button onClick={handleBackToCart} className="text-blue-600 hover:text-blue-800 font-medium">← Back to Cart</button>
      </div>

      {/* Debug Info */}
      {acceptedTokens.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700"><strong>Debug Info:</strong> Accepted tokens: {acceptedTokens.join(', ')}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Summary */}
        <div className="bg-white rounded-lg shadow-lg border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {cartItems.map((item: any) => {
              const imageUrl = getImageUrl(item.image);
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
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 mr-3 border hidden">📦</div>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 mr-3 border">📦</div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
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
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-green-600">${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Method */}
        <div className="bg-white rounded-lg shadow-lg border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
          
          {loadingTokens ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading payment options...</p>
            </div>
          ) : availableMethods.length === 0 ? (
            <div className="text-center py-8 bg-yellow-50 rounded-lg">
              <div className="text-2xl mb-2">⚠️</div>
              <h3 className="font-semibold text-yellow-800">No Payment Methods Available</h3>
              <p className="text-sm text-yellow-600 mt-1">No tokens are currently accepted for payments.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {availableMethods.includes("ETH") && (
                  <label className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "ETH" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"}`}>
                    <div className="flex items-center">
                      <input type="radio" name="payment" value="ETH" checked={paymentMethod === "ETH"} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="w-4 h-4 text-blue-600 mr-3" />
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">Ξ</div>
                      <div>
                        <h3 className="font-semibold">Pay with Ethereum</h3>
                        <p className="text-sm text-gray-600">Pay directly with ETH</p>
                      </div>
                    </div>
                  </label>
                )}

                {availableMethods.filter(token => token !== "ETH").map((token) => (
                  <label key={token} className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === token ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400"}`}>
                    <div className="flex items-center">
                      <input type="radio" name="payment" value={token} checked={paymentMethod === token} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="w-4 h-4 text-green-600 mr-3" />
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">$</div>
                      <div>
                        <h3 className="font-semibold">Pay with {token}</h3>
                        <p className="text-sm text-gray-600">Secure stablecoin payment</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6">
                <button onClick={handleProceedToPayment} disabled={!account || processing} className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold text-lg transition-colors">
                  {processing ? (
                    <span className="flex items-center justify-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>Processing...</span>
                  ) : !account ? 'Connect Wallet to Pay' : `Pay with ${paymentMethod} - $${cartTotal.toFixed(2)}`}
                </button>
                {!account && <p className="text-center text-sm text-gray-600 mt-3">Please connect your wallet to complete payment</p>}
              </div>
            </>
          )}

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center text-sm text-blue-700"><span className="mr-2">🔒</span><span>Powered by blockchain escrow - Funds held securely until delivery</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
