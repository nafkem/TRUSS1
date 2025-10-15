// src/types/global.d.ts
import { BrowserProvider } from 'ethers';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      selectedAddress?: string;
      chainId?: string;
      isConnected?: boolean; // ← ADD THIS LINEs
    };
  }
}

// This ensures this file is treated as a module
export {};