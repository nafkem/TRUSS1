import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Simple product type that matches what we save in backend
interface Product {
  _id: string;
  productId: string;
  title: string;
  description: string;
  price: string;
  seller: string;
  sellerId: string;
  image: string;
  waranteeDuration: string;
  expectedDeliveryTime: string;
  createdAt: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products from backend (where images are stored)
  const loadProducts = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:3001/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to load products');
      }
      
      const productsData = await response.json();
      setProducts(productsData);
      
      toast.success(`Loaded ${productsData.length} products`);
      
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Format warranty display
  const getWarrantyText = (warrantySeconds: string) => {
    const days = Number(warrantySeconds) / (24 * 60 * 60);
    if (days > 0) {
      return `${days} day warranty`;
    }
    return "No warranty";
  };

  // Format delivery date
  const getDeliveryDate = (timestamp: string) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-neutral-700 text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="mt-2 opacity-90">
          Browse all available products
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      )}

      {/* No Products State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow border">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
          <p className="text-gray-600">
            No products have been added yet. Be the first to add one!
          </p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <div className="h-48 bg-gray-100 overflow-hidden">
                {product.image ? (
                  <img
                    src={`http://localhost:3001${product.image}`}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-4xl text-gray-400">📦</div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Title and Price */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800 flex-1">
                    {product.title}
                  </h3>
                  <span className="text-xl font-bold text-green-600 ml-2">
                    ${product.price}
                  </span>
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Product Details */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Warranty:</span>
                    <span className="font-medium">
                      {getWarrantyText(product.waranteeDuration)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="font-medium">
                      {getDeliveryDate(product.expectedDeliveryTime)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Seller:</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {product.seller.slice(0, 6)}...{product.seller.slice(-4)}
                    </span>
                  </div>
                </div>

                {/* Buy Button */}
                <Link
                  to={`/product/${product._id}`}  // ← Change from product.productId to product._id
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-center block"
                  >
                  Buy Now - ${product.price}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Count */}
      {!loading && products.length > 0 && (
        <div className="mt-6 text-center text-gray-600">
          <p>Showing {products.length} product(s)</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;