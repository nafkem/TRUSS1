import { useEffect, useState } from "react";
import { toast } from "sonner";
import { productService } from "../contracts/product/productService";
import { useWallet } from "../context/walletContext";
import { handleBuy } from "../component/fetchProducts";

interface DisplayProduct {
  productId: string;
  sellerId: string;
  title: string;
  price: string;
  waranteeDuration: string;
  expectedDeliveryTime: string;
}

// Props control whether to show all products or just current user’s
interface Props {
  myListings?: boolean;
}

const ProductGrid = ({ myListings = false }: Props) => {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const { account } = useWallet();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const all = await productService.getProducts(0, 100);

     const filtered = myListings
  ? all.filter(
      (p: { sellerId: string }) =>
        account && p.sellerId.toLowerCase() === account.toLowerCase()
    )
  : all;


      setProducts(filtered);
    } catch (err: any) {
      console.error("❌ Error fetching products:", err);
      toast.error(`Failed to load: ${err?.reason || err?.message || "unknown"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account || !myListings) {
      loadProducts();
    }
  }, [account, myListings]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {myListings ? "My Product Listings" : "Live Products"}
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>{myListings ? "You haven’t listed any products yet." : "No products available."}</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <li
              key={p.productId}
              className="border p-4 rounded-lg shadow-md"
            >
              <h3 className="font-bold">{p.title}</h3>
              <p className="mt-2">
                Price: <span className="font-semibold">{p.price}</span>
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Seller: {p.sellerId.slice(0, 6)}...{p.sellerId.slice(-4)}
              </p>

              <p className="text-sm mt-1">
                Warranty: {Number(p.waranteeDuration) / (24 * 60 * 60)} days
              </p>

              <p className="text-sm mt-1">
                Delivery ETA:{" "}
                {new Date(Number(p.expectedDeliveryTime) * 1000).toLocaleString()}
              </p>

              {!myListings && (
                <div className="mt-3">
                  <button
                    onClick={() => handleBuy(productService, p, account)}
                    className="bg-neutral-800 text-white px-4 py-2 rounded-lg hover:bg-neutral-900"
                  >
                    Buy
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductGrid;
