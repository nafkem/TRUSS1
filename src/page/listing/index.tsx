import { useEffect, useState } from "react";
import { productService } from "../../contracts/product/productService";
import { toast } from "sonner";

// TS type matching contract Product struct
interface Product {
  productId: number;
  sellerId: number;
  unitPrice: number;           // USD * 1e8 (or contract decimal)
  waranteeDuration: number;    // in seconds
  title: string;
  whenToExpectDelivery: number; // block timestamp + offset
}

const Listing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // fetch all products (adjust start/end as needed)
      const productList: Product[] = await productService.getProducts(0, 100);
      setProducts(productList);
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      toast.error(`❌ Failed to fetch products: ${err.reason || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    // convert contract price back to USD (depends on decimals used in contract)
    return (price / 1e8).toFixed(2);
  };

  const formatDelivery = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Product Listings</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.productId} className="border p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p>Price: ${formatPrice(product.unitPrice)}</p>
              <p>
                Delivery: {formatDelivery(product.whenToExpectDelivery)}
              </p>
              <p>
                Warranty:{" "}
                {product.waranteeDuration > 0
                  ? `${product.waranteeDuration / (24 * 60 * 60)} days`
                  : "No warranty"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Listing;
