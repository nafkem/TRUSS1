import { useState } from "react";
import { getProductContract } from "../contracts/product/contract";
import { ethers } from "ethers";

export const useProductActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listProduct = async (productData: {
    title: string;
    price: number;              // normal price input
    warrantyDuration: number;   // in days
    deliveryDateTime: string;   // datetime-local string
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("1. Getting contract instance...");
      const productContract = await getProductContract();

      console.log("2. Converting price to Wei...");
      const priceInWei = ethers.parseEther(productData.price.toString());

      console.log("3. Converting date → unix timestamp...");
      const expectedDeliveryTime = Math.floor(new Date(productData.deliveryDateTime).getTime() / 1000);

      console.log("4. Warranty → seconds...");
      const waranteeDuration = productData.warrantyDuration * 24 * 60 * 60;

      console.log("5. Calling listProduct...");
      const tx = await productContract.listProduct(
        priceInWei,
        productData.title,
        waranteeDuration,
        expectedDeliveryTime
      );

      console.log("✅ Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("🎉 Product listed:", receipt);

      alert("Product listed successfully!");
      return receipt;
    } catch (err: any) {
      console.error("❌ Failed to list product:", err);
      const errorMsg = err.reason || err.message || "Failed to list product";
      setError(errorMsg);
      alert(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return { listProduct, isLoading, error };
};
