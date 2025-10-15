import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import { toast } from "sonner";
import { productService } from "../../contracts/product/productService";

const DebugViewProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [backendProducts, setBackendProducts] = useState<any[]>([]);
  const [blockchainProducts, setBlockchainProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDebugData();
  }, [id]);

  const loadDebugData = async () => {
    try {
      setLoading(true);

      // Load backend products
      const backendResponse = await fetch('http://localhost:3001/api/products');
      const backendData = await backendResponse.json();
      setBackendProducts(backendData);
      console.log("🔍 BACKEND PRODUCTS:", backendData);

      // Load blockchain products
      const blockchainData = await productService.getAllProducts();
      setBlockchainProducts(blockchainData);
      console.log("🔗 BLOCKCHAIN PRODUCTS:", blockchainData);

      // Try to find matches
      console.log("🎯 TRYING TO MATCH PRODUCTS:");
      
      backendData.forEach((backendProduct: any) => {
        const match = blockchainData.find((blockchainProduct: any) => 
          backendProduct.title.toLowerCase() === blockchainProduct.title.toLowerCase()
        );
        
        if (match) {
          console.log("✅ MATCH FOUND:");
          console.log("   Backend:", backendProduct.title, "ID:", backendProduct.productId);
          console.log("   Blockchain:", match.title, "ID:", match.productId);
        } else {
          console.log("❌ NO MATCH for:", backendProduct.title);
        }
      });

    } catch (error) {
      console.error("Debug error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading debug data...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product Mapping Debug</h1>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Backend Products */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Backend Products ({backendProducts.length})</h2>
          <div className="space-y-2">
            {backendProducts.map((product) => (
              <div key={product._id} className="border p-2 rounded">
                <p><strong>Title:</strong> {product.title}</p>
                <p><strong>Backend ID:</strong> {product.productId}</p>
                <p><strong>Mongo ID:</strong> {product._id}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain Products */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Blockchain Products ({blockchainProducts.length})</h2>
          <div className="space-y-2">
            {blockchainProducts.map((product) => (
              <div key={product.productId} className="border p-2 rounded">
                <p><strong>Title:</strong> {product.title}</p>
                <p><strong>Blockchain ID:</strong> {product.productId}</p>
                <p><strong>Price:</strong> {product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={() => navigate("/products")}
        className="mt-6 bg-neutral-800 text-white px-4 py-2 rounded"
      >
        Back to Products
      </button>
    </div>
  );
};

export default DebugViewProduct;