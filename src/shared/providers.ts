import { BrowserProvider, JsonRpcProvider } from "ethers";
import { getEthereum, isBaseSepolia, withRetry } from "./utils";

// Singleton provider instance
let browserProvider: BrowserProvider | null = null;

export function getBrowserProvider(): BrowserProvider {
  const ethereum = getEthereum();
  
  // Reuse existing provider instance
  if (!browserProvider) {
    browserProvider = new BrowserProvider(ethereum);
  }
  
  return browserProvider;
}

export function getJsonRpcProvider(rpcUrl: string): JsonRpcProvider {
  return new JsonRpcProvider(rpcUrl);
}

// Network check utility with retry
export async function ensureBaseSepoliaNetwork(): Promise<void> {
  const ethereum = getEthereum();

  // Check current network with retry logic
  const isCorrectNetwork = await withRetry(async () => {
    const currentIsBaseSepolia = await isBaseSepolia();
    return currentIsBaseSepolia;
  });

  if (!isCorrectNetwork) {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x14A34' }]
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x14A34',
            chainName: 'Base Sepolia',
            rpcUrls: ['https://sepolia.base.org'],
            nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
            blockExplorerUrls: ['https://sepolia.basescan.org']
          }]
        });
      } else {
        throw error;
      }
    }
  }
}

// Get the current signer address
export async function getCurrentAddress(): Promise<string> {
  const provider = getBrowserProvider();
  const signer = await provider.getSigner();
  return await signer.getAddress();
}

// Get the current network
export async function getCurrentNetwork() {
  const provider = getBrowserProvider();
  return await provider.getNetwork();
}