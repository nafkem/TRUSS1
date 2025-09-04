// src/shared/providers.ts
import { BrowserProvider, JsonRpcProvider } from "ethers";
import { NETWORKS } from "./networkUtils";

// Safe Ethereum provider access
export function getEthereum(): any {
  if (typeof window === "undefined") {
    throw new Error("Browser environment required");
  }

  if (!window.ethereum) {
    throw new Error("MetaMask not found. Please install it.");
  }

  return window.ethereum;
}

// Always return fresh provider
export function getBrowserProvider(): BrowserProvider {
  return new BrowserProvider(getEthereum());
}

// For backend/direct RPC
export function getJsonRpcProvider(rpcUrl: string): JsonRpcProvider {
  return new JsonRpcProvider(rpcUrl);
}

// Detect if current chain is Base Sepolia
export async function isBaseSepolia(): Promise<boolean> {
  try {
    const provider = getBrowserProvider();
    const network = await provider.getNetwork();
    return network.chainId === BigInt(NETWORKS.baseSepolia.chainId);
  } catch {
    return false;
  }
}

// Ensure we are connected to Base Sepolia
export async function ensureBaseSepoliaNetwork(): Promise<void> {
  const ethereum = getEthereum();
  const chainIdHex = "0x" + NETWORKS.baseSepolia.chainId.toString(16);

  try {
    if (!(await isBaseSepolia())) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdHex }],
        });
      } catch (error: any) {
        if (error.code === 4902) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainIdHex,
                chainName: NETWORKS.baseSepolia.name,
                rpcUrls: [NETWORKS.baseSepolia.rpcUrl],
                nativeCurrency: NETWORKS.baseSepolia.nativeCurrency,
                blockExplorerUrls: NETWORKS.baseSepolia.blockExplorerUrls,
              },
            ],
          });
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    throw new Error(
      `Network setup failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// Get current connected address
export async function getCurrentAddress(): Promise<string> {
  const provider = getBrowserProvider();
  const signer = await provider.getSigner();
  return await signer.getAddress();
}

// Get current network
export async function getCurrentNetwork() {
  const provider = getBrowserProvider();
  return await provider.getNetwork();
}
