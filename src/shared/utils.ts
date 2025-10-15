// Utility functions for safe Ethereum access

/**
 * Safely gets the Ethereum provider, throws error if not available
 */
export function getEthereum(): NonNullable<typeof window.ethereum> {
  if (typeof window === 'undefined') {
    throw new Error("Browser environment required");
  }
  
  if (!window.ethereum) {
    throw new Error("MetaMask not found. Please install it.");
  }
  
  return window.ethereum;
}

/**
 * Safely gets the Ethereum provider, returns undefined if not available
 */
export function getEthereumSafe(): typeof window.ethereum | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  
  return window.ethereum;
}

/**
 * Checks if MetaMask is installed and available
 */
export function isMetaMaskAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.ethereum;
}

/**
 * Gets the current chain ID from MetaMask
 */
export async function getChainId(): Promise<string> {
  const ethereum = getEthereum();
  try {
    return await ethereum.request({ method: 'eth_chainId' });
  } catch (error) {
    console.error('Failed to get chain ID:', error);
    throw error;
  }
}

/**
 * Gets the current connected accounts
 */
export async function getAccounts(): Promise<string[]> {
  const ethereum = getEthereum();
  try {
    return await ethereum.request({ method: 'eth_accounts' });
  } catch (error) {
    console.error('Failed to get accounts:', error);
    throw error;
  }
}

/**
 * Requests account access from user
 */
export async function requestAccounts(): Promise<string[]> {
  const ethereum = getEthereum();
  try {
    return await ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    console.error('Failed to request accounts:', error);
    throw error;
  }
}

/**
 * Adds event listener for Ethereum events
 */
export function onEthereumEvent(
  event: string, 
  callback: (...args: any[]) => void
): void {
  const ethereum = getEthereumSafe();
  if (ethereum) {
    ethereum.on(event, callback);
  }
}

/**
 * Removes event listener for Ethereum events
 */
export function removeEthereumListener(
  event: string, 
  callback: (...args: any[]) => void
): void {
  const ethereum = getEthereumSafe();
  if (ethereum) {
    ethereum.removeListener(event, callback);
  }
}

/**
 * Checks if connected to Base Sepolia network
 */
export async function isBaseSepolia(): Promise<boolean> {
  try {
    const chainId = await getChainId();
    return chainId === '0x14A34'; // Base Sepolia chain ID
  } catch (error) {
    return false;
  }
}

/**
 * Shortens an Ethereum address for display
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Converts hex string to number
 */
export function hexToNumber(hex: string): number {
  return parseInt(hex, 16);
}

/**
 * Converts number to hex string
 */
export function numberToHex(number: number): string {
  return `0x${number.toString(16)}`;
}

/**
 * Delays execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await delay(delayMs);
      return withRetry(operation, retries - 1, delayMs * 2);
    }
    throw error;
  }
}