import { useState } from 'react';

import { getProductContract } from '../contracts/product/contract'; 
import { ethers } from 'ethers';

export const useProductActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listProduct = async (productData: {
    title: string;
    unitPrice: number; // in ETH
    waranteeDuration: number; // in days
    expectedDeliveryTime: number; // in hours
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("1. Getting provider and signer...");
      
      console.log("2. Getting PRODUCT contract instance...");
      const productContract = await getProductContract();

      console.log("3. Converting price to wei...");
      const priceInWei = ethers.parseEther(productData.unitPrice.toString());
      
      console.log("4. Calling listProduct contract function...");
      // EXACT function signature from your ABI:
      const transaction = await productContract.listProduct(
        priceInWei,                    // _unitprice (uint256 in wei)
        productData.title,             // _title (string)
        productData.waranteeDuration,  // _waranteeDuration (uint256)
        productData.expectedDeliveryTime // _expectedDeliveryTime (uint256)
      );

      console.log("✅ Product listing transaction sent! Hash:", transaction.hash);
      
      console.log("5. Waiting for confirmation...");
      const receipt = await transaction.wait();
      
      console.log("🎉 Product listed successfully!", receipt);
      alert("Product listed successfully! Awaiting admin verification.");
      
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