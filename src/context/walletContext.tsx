import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ethers } from "ethers";
import productAbi from "../contracts/product/productAbi.json";
import { PRODUCT_CONTRACT_ADDRESS } from "../contracts/product/constant";

interface WalletContextType {
  isConnected: boolean;
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
  contract: ethers.Contract | null;
}

interface WalletProviderProps {
  children: ReactNode;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // 🔑 Initialize contract
  const initContract = async (provider: ethers.BrowserProvider) => {
    const signer = await provider.getSigner();
    return new ethers.Contract(PRODUCT_CONTRACT_ADDRESS, productAbi, signer);
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        if (typeof window.ethereum !== "undefined") {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });

          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const marketplace = await initContract(provider);
            setContract(marketplace);
          }
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkWalletConnection();

    if (window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);

          const provider = new ethers.BrowserProvider(window.ethereum as any);
          const marketplace = await initContract(provider);
          setContract(marketplace);
        } else {
          setAccount(null);
          setIsConnected(false);
          setContract(null);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  const connectWallet = async (): Promise<void> => {
    try {
      setIsLoading(true);

      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask is not installed");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const marketplace = await initContract(provider);
        setContract(marketplace);
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      throw new Error(error.message || "Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = (): void => {
    setAccount(null);
    setIsConnected(false);
    setContract(null);
  };

  const value: WalletContextType = {
    isConnected,
    account,
    connectWallet,
    disconnectWallet,
    isLoading,
    contract,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
