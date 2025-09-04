// src/hook/useUserActions.ts
import { useState } from 'react';

import { getCurrentAddress } from '../shared/providers';

import { getUserContract } from '../contracts/user/contract'; 

export const useUserActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const registerAsUser = async (firstName: string, lastName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("1. Getting provider and signer...");
      
      console.log("2. Getting USER contract instance...");
      const userContract = await getUserContract();

      console.log("3. Calling register() with parameters...");
      const transaction = await userContract.register(
        lastName,   // _lastName
        firstName    // _firstName
      );

      console.log("✅ Registration transaction sent! Hash:", transaction.hash);
      
      console.log("4. Waiting for confirmation...");
      const receipt = await transaction.wait();
      
      console.log("🎉 Registration confirmed in block:", receipt.blockNumber);
      alert("Successfully registered as a user!");
      return receipt;

    } catch (err: any) {
      console.error("❌ Registration failed:", err);
      const errorMsg = err.reason || err.message || "Registration failed. Check the console for details.";
      setError(errorMsg);
      alert(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("1. Getting provider and signer...");
      
      console.log("2. Getting USER contract instance...");

      console.log("2. Getting USER contract instance...");
      const userContract = await getUserContract();
      const userAddress = await getCurrentAddress();

      const data = await userContract.getUserData(userAddress);

      console.log("✅ User data retrieved:", data);
      setUserData(data);
      return data;
    } catch (err: any) {
      console.error("❌ Failed to get user data:", err);
      const errorMsg = err.reason || err.message || "Failed to get user data";
      setError(errorMsg);
      alert(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    registerAsUser, 
    getUserData, 
    isLoading, 
    error, 
    userData 
  };
};