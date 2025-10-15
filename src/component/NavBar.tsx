// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { isMetaMaskAvailable, shortenAddress } from '../shared/utils';
import { getCurrentAddress } from '../shared/providers';

export function Navbar() {
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    checkUserConnection();
  }, []);

  const checkUserConnection = async () => {
    if (isMetaMaskAvailable()) {
      try {
        const address = await getCurrentAddress();
        setUserAddress(address);
      } catch (error) {
        // User not connected, that's fine
      }
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">My dApp</h1>
        
        <div className="flex items-center space-x-4">
          {userAddress ? (
            <span className="bg-gray-700 px-3 py-1 rounded">
              {shortenAddress(userAddress)}
            </span>
          ) : (
            <span className="text-yellow-300">Connect Wallet</span>
          )}
          
          <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
            Menu
          </button>
        </div>
      </div>
    </nav>
  );
}