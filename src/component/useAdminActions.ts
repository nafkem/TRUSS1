import { useState } from 'react';
import { getBrowserProvider } from '../shared/providers';
import { getUserContract } from '../contracts/user/contract'; 

export const useAdminActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifySeller = async (sellerAddress: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("1. Getting provider and signer...");
      const provider = getBrowserProvider();
      
      console.log("2. Getting USER contract instance...");
      const userContract = await getUserContract(provider);

      console.log("3. Verifying seller:", sellerAddress);
      const transaction = await userContract.verifySeller(sellerAddress);

      console.log("✅ Verification transaction sent! Hash:", transaction.hash);
      
      console.log("4. Waiting for confirmation...");
      const receipt = await transaction.wait();
      
      console.log("🎉 Seller verified successfully!", receipt);
      alert("Seller verified successfully!");
      
      return receipt;

    } catch (err: any) {
      console.error("❌ Verification failed:", err);
      const errorMsg = err.reason || err.message || "Verification failed";
      setError(errorMsg);
      alert(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return { verifySeller, isLoading, error };
};