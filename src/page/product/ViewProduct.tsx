import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "../../context/CartContext";
import { productService } from "../../contracts/product/productService";
import { useWallet } from "../../context/walletContext";

type CombinedProduct = {
  productId: string;
  sellerId: string;
  title: string;
  price: string;
  unitPrice: bigint;
  waranteeDuration: string;
  expectedDeliveryTime: string;
  whenToExpectDelivery: bigint;
  
  // Backend data
  _id?: string;
  description?: string;
  image?: string;
  seller?: string;
  createdAt?: string;
};

export default function ViewProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { account } = useWallet();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<CombinedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const getWarrantyText = (warrantySeconds: string) => {
    try {
      const seconds = Number(warrantySeconds);
      if (isNaN(seconds) || seconds === 0) return "No warranty";
      
      const days = seconds / (24 * 60 * 60);
      if (days >= 365) {
        const years = days / 365;
        return `${Math.round(years)} year${years > 1 ? 's' : ''} warranty`;
      } else if (days >= 30) {
        const months = days / 30;
        return `${Math.round(months)} month${months > 1 ? 's' : ''} warranty`;
      } else if (days >= 1) {
        return `${Math.round(days)} day${days > 1 ? 's' : ''} warranty`;
      } else {
        return "No warranty";
      }
    } catch {
      return "No warranty";
    }
  };

  const getDeliveryDate = (timestamp: string) => {
    try {
      const seconds = Number(timestamp);
      if (isNaN(seconds) || seconds === 0) return "Delivery time not specified";
      
      const date = new Date(seconds * 1000);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Invalid date";
    }
  };

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id) {
      toast.error("Product ID is missing");
      navigate("/products");
      return;
    }

    try {
      setLoading(true);
      console.log("🔍 Loading product with ID:", id);

      // Get data from both sources with proper error handling
      const [backendResponse, blockchainProducts] = await Promise.allSettled([
        fetch('http://localhost:3001/api/products')
          .then(res => {
            if (!res.ok) {
              throw new Error(`Backend error: ${res.status}`);
            }
            return res.json();
          })
          .catch(error => {
            console.warn("⚠️ Backend unavailable:", error);
            return [];
          }),
        productService.getAllProducts().catch(error => {
          console.warn("⚠️ Blockchain unavailable:", error);
          return [];
        })
      ]);

      // Handle backend response
      const backendProducts = backendResponse.status === 'fulfilled' 
        ? backendResponse.value 
        : [];
      
      // Handle blockchain response  
      const blockchainProductsData = blockchainProducts.status === 'fulfilled'
        ? blockchainProducts.value
        : [];

      console.log("📦 Backend products:", backendProducts?.length || 0);
      console.log("🔗 Blockchain products:", blockchainProductsData.length);

      let foundProduct: CombinedProduct | null = null;

      // STRATEGY 1: Find by backend _id (this is what ProductList passes)
      const backendProduct = backendProducts?.find((p: any) => p._id === id);
      
      if (backendProduct) {
        console.log("✅ Found backend product:", backendProduct.title);
        
        // Try to find matching blockchain product by title
        const blockchainProduct = blockchainProductsData.find((bp: any) => 
          bp.title?.toLowerCase().includes(backendProduct.title?.toLowerCase() || '') ||
          backendProduct.title?.toLowerCase().includes(bp.title?.toLowerCase() || '')
        );

        if (blockchainProduct) {
          foundProduct = { 
            ...blockchainProduct, 
            ...backendProduct,
            // Ensure critical fields exist with proper defaults
            productId: blockchainProduct.productId || backendProduct.productId || "0",
            sellerId: blockchainProduct.sellerId || backendProduct.sellerId || "1",
            title: backendProduct.title || blockchainProduct.title || "Unknown Product",
            price: backendProduct.price || "0",
            unitPrice: blockchainProduct.unitPrice || BigInt(0),
            waranteeDuration: blockchainProduct.waranteeDuration || backendProduct.waranteeDuration || "0",
            expectedDeliveryTime: blockchainProduct.expectedDeliveryTime?.toString() || backendProduct.expectedDeliveryTime?.toString() || "0",
            whenToExpectDelivery: blockchainProduct.whenToExpectDelivery || BigInt(backendProduct.expectedDeliveryTime || 0)
          };
          console.log("✅ Found blockchain match by title");
        } else {
          // Use backend data with placeholder blockchain fields
          foundProduct = {
            productId: backendProduct.productId || "0",
            sellerId: backendProduct.sellerId || "1",
            title: backendProduct.title || "Unknown Product",
            price: backendProduct.price || "0",
            unitPrice: BigInt(0),
            waranteeDuration: backendProduct.waranteeDuration || "0",
            expectedDeliveryTime: backendProduct.expectedDeliveryTime?.toString() || "0",
            whenToExpectDelivery: BigInt(backendProduct.expectedDeliveryTime || 0),
            ...backendProduct
          };
          console.log("⚠️ Using backend data only (no blockchain match)");
        }
      }

      // STRATEGY 2: If not found in backend, try blockchain directly
      if (!foundProduct && blockchainProductsData.length > 0) {
        const blockchainProduct = blockchainProductsData.find((bp: any) => bp.productId === id);
        if (blockchainProduct) {
          foundProduct = {
            ...blockchainProduct,
            productId: blockchainProduct.productId || "0",
            sellerId: blockchainProduct.sellerId || "1",
            title: blockchainProduct.title || "Unknown Product",
            price: blockchainProduct.unitPrice ? blockchainProduct.unitPrice.toString() : "0",
            unitPrice: blockchainProduct.unitPrice || BigInt(0),
            waranteeDuration: blockchainProduct.waranteeDuration || "0",
            expectedDeliveryTime: blockchainProduct.expectedDeliveryTime?.toString() || "0",
            whenToExpectDelivery: blockchainProduct.whenToExpectDelivery || BigInt(0)
          };
          console.log("✅ Found blockchain product directly");
        }
      }

      if (!foundProduct) {
        throw new Error("Product not found in any data source");
      }

      setProduct(foundProduct);
      toast.success("✅ Product loaded!");

    } catch (err: any) {
      console.error("❌ Final error:", err);
      toast.error(err.message || "Product not found");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!account) {
      toast.error("⚠️ Please connect your wallet first");
      return;
    }

    if (!product) return;

    try {
      setAddingToCart(true);
      
      // Format image URL
      let imageUrl = product.image;
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `http://localhost:3001${product.image}`;
      }

      // Add to LOCAL cart
      await addToCart({
        productId: product.productId,
        title: product.title,
        price: product.price,
        image: imageUrl,
        sellerId: product.sellerId,
        quantity: 1
      });

      toast.success(`✅ ${product.title} added to cart!`);
      
      // ✅ AUTO-NAVIGATE TO CART PAGE AFTER SUCCESS
      setTimeout(() => {
        navigate('/cart');
      }, 1000);

    } catch (err: any) {
      console.error("❌ Error adding to cart:", err);
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  // FIXED: Proper undefined check for unitPrice
  const hasRealBlockchainData = product?.unitPrice !== undefined && 
                               product?.unitPrice > BigInt(0) && 
                               product?.productId !== "0";

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12 bg-white rounded-lg shadow border">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Product Not Found</h3>
          <button
            onClick={() => navigate("/products")}
            className="bg-neutral-800 text-white px-6 py-2 rounded-lg hover:bg-neutral-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <button onClick={() => navigate("/")} className="hover:text-neutral-800">Home</button>
        <span>›</span>
        <button onClick={() => navigate("/products")} className="hover:text-neutral-800">Products</button>
        <span>›</span>
        <span className="text-neutral-800 font-medium">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Product Image & Actions */}
        <div className="bg-white rounded-lg shadow-lg border p-6">
          {/* Product Image */}
          <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
            {product.image ? (
              <img
                src={`http://localhost:3001${product.image}`}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fixed image fallback - simpler approach
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  // Create fallback element if it doesn't exist
                  const fallback = target.nextSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div className="text-6xl text-gray-400" style={{ display: product.image ? 'none' : 'flex' }}>📦</div>
          </div>

          {/* Product Title & Price */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-4xl font-bold text-green-600">
              ${product.price}
            </span>
            {hasRealBlockchainData ? (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                🔗 On Blockchain
              </span>
            ) : (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                ⚠️ Backend Only
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !account}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-bold text-lg"
            >
              {addingToCart ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Adding...
                </span>
              ) : !account ? (
                "Connect Wallet to Add to Cart"
              ) : hasRealBlockchainData ? (
                "🛒 Add to Blockchain Cart"
              ) : (
                "🛒 Add to Local Cart"
              )}
            </button>
          </div>

          {!account && (
            <p className="text-center text-sm text-gray-600 mt-3">
              Connect your wallet to add items to cart
            </p>
          )}
        </div>

        {/* Right Column - Product Details */}
        <div className="space-y-6">
          {/* Product Description */}
          <div className="bg-white rounded-lg shadow-lg border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Description</h2>
            {product.description ? (
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            ) : (
              <p className="text-gray-500 italic">No description provided.</p>
            )}
          </div>

          {/* Product Information */}
          <div className="bg-white rounded-lg shadow-lg border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Product ID:</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {product.productId}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Price:</span>
                <span className="font-bold text-green-600">${product.price}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Warranty:</span>
                <span className="font-medium">{getWarrantyText(product.waranteeDuration)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Expected Delivery:</span>
                <span className="text-sm text-gray-700">
                  {getDeliveryDate(product.expectedDeliveryTime)}
                </span>
              </div>

              {product.seller && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Seller:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {product.seller.slice(0, 6)}...{product.seller.slice(-4)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}