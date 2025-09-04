// src/shared/networkUtils.ts
import { BrowserProvider } from "ethers";

export type NetworkConfig = {
  chainId: number;
  rpcUrl: string;
  name: string;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls?: string[];
};

// Centralized network configs
export const NETWORKS: Record<string, NetworkConfig> = {
  baseSepolia: {
    chainId: 84532,
    rpcUrl: "https://sepolia.base.org",
    name: "Base Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://sepolia.basescan.org"],
  },
  sepolia: {
    chainId: 11155111,
    rpcUrl: "https://rpc.sepolia.org",
    name: "Ethereum Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
};

// Request MetaMask to switch/add chain
export async function switchToNetwork(network: keyof typeof NETWORKS): Promise<void> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not detected");
  }

  const net = NETWORKS[network];
  const hexChainId = "0x" + net.chainId.toString(16);

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexChainId }],
    });
  } catch (error: any) {
    // Chain not added? Add it
    if (error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: hexChainId,
            chainName: net.name,
            nativeCurrency: net.nativeCurrency,
            rpcUrls: [net.rpcUrl],
            blockExplorerUrls: net.blockExplorerUrls,
          },
        ],
      });
    } else {
      throw error;
    }
  }
}

// Check if connected to a specific network
export async function isNetwork(network: keyof typeof NETWORKS): Promise<boolean> {
  try {
    const provider = new BrowserProvider(window.ethereum!);
    const currentNetwork = await provider.getNetwork();
    return currentNetwork.chainId === BigInt(NETWORKS[network].chainId);
  } catch {
    return false;
  }
}
