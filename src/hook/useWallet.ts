// src/hooks/useWallet.ts
import { useState, useEffect } from 'react';
import { isMetaMaskAvailable, getEthereumSafe } from '../shared/utils';
import { getCurrentAddress } from '../shared/providers';

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkConnection();
    
    // Listen for account changes
    const ethereum = getEthereumSafe();
    if (ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        } else {
          setAddress('');
          setIsConnected(false);
        }
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const checkConnection = async () => {
    if (!isMetaMaskAvailable()) return;

    try {
      const currentAddress = await getCurrentAddress();
      setAddress(currentAddress);
      setIsConnected(true);
    } catch (error) {
      // Not connected
      setIsConnected(false);
    }
  };

  const connect = async () => {
    setLoading(true);
    try {
      const ethereum = getEthereumSafe();
      const accounts = await ethereum?.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    isConnected,
    address,
    loading,
    connect,
    isMetaMaskAvailable: isMetaMaskAvailable()
  };
}