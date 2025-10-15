// src/components/UserProfile.tsx
import { useState, useEffect } from 'react';
import { isMetaMaskAvailable, shortenAddress } from '../shared/utils';
import { getCurrentAddress, ensureBaseSepoliaNetwork } from '../shared/providers';

export function UserProfile() {
  const [userAddress, setUserAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserAddress();
  }, []);

  const loadUserAddress = async () => {
    if (!isMetaMaskAvailable()) return;

    try {
      const address = await getCurrentAddress();
      setUserAddress(address);
    } catch (error) {
      console.log('User not connected:', error);
    }
  };

  const connectAndRegister = async () => {
    setLoading(true);
    try {
      // Ensure correct network
      await ensureBaseSepoliaNetwork();
      
      // Get current address (this will trigger connection if not connected)
      const address = await getCurrentAddress();
      setUserAddress(address);

      // Now you can register the user with your contract
      // const userContract = await getUserContract();
      // await userContract.registerUser(userData);

    } catch (error) {
      console.error('Error connecting:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">User Profile</h2>
      
      {userAddress ? (
        <div>
          <p className="text-green-600">✅ Connected</p>
          <p className="text-sm text-gray-600">
            Address: {shortenAddress(userAddress)}
          </p>
          <button 
            onClick={() => navigator.clipboard.writeText(userAddress)}
            className="mt-2 px-3 py-1 bg-gray-200 text-xs rounded"
          >
            Copy Address
          </button>
        </div>
      ) : (
        <div>
          <p className="text-red-600 mb-2">Not connected</p>
          <button 
            onClick={connectAndRegister}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            {loading ? 'Connecting...' : 'Connect Wallet & Register'}
          </button>
        </div>
      )}
    </div>
  );
}