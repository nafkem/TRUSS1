import { useEffect, useState } from "react";
import { productService } from "../../contracts/product/productService";
import { toast } from "sonner";

interface Product {
  productId: number;
  sellerId: number;
  unitPrice: number;
  waranteeDuration: number;
  title: string;
  whenToExpectDelivery: number;
}

const Listing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const rawProducts = await productService.getProducts(0, 100);

      const productList: Product[] = rawProducts.map((p: any) => ({
        productId: Number(p.productId),
        sellerId: Number(p.sellerId),
        title: p.title,
        unitPrice: Number(p.unitPrice),
        waranteeDuration: Number(p.waranteeDuration),
        whenToExpectDelivery: Number(p.whenToExpectDelivery),
      }));

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

  const formatPrice = (price: number) => (price / 1e8).toFixed(2);
  const formatDelivery = (timestamp: number) => new Date(timestamp * 1000).toLocaleString();

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
              <p>Delivery: {formatDelivery(product.whenToExpectDelivery)}</p>
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
