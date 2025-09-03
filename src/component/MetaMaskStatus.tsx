// src/components/MetaMaskStatus.tsx
import { useState, useEffect } from 'react';
import { getEthereumSafe, isMetaMaskAvailable, shortenAddress } from '../shared/utils';

export function MetaMaskStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [shortAddress, setShortAddress] = useState<string>('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (isMetaMaskAvailable()) {
      const ethereum = getEthereumSafe();
      
      // Check if already connected
      try {
        const accounts = await ethereum?.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
          setShortAddress(shortenAddress(accounts[0]));
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (!isMetaMaskAvailable()) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const ethereum = getEthereumSafe();
      const accounts = await ethereum?.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        setIsConnected(true);
        setAddress(accounts[0]);
        setShortAddress(shortenAddress(accounts[0]));
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  if (!isMetaMaskAvailable()) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        ⚠️ Please install MetaMask to use this dApp
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded">
      {isConnected ? (
        <div>
          <p>✅ Connected: {shortAddress}</p>
          <p>Address: {address}</p>
        </div>
      ) : (
        <button 
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Connect MetaMask
        </button>
      )}
    </div>
  );
}