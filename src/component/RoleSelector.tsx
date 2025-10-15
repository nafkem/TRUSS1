import React from 'react';
import { useUserActions } from '../hook/useUserActions';

const RoleSelector: React.FC = () => {
  const { userData } = useUserActions();

  if (!userData) return null;

  const userType = userData._userType === 0 ? 'Buyer' : 'Seller';
  const isVerified = userData.verificationStatus === 1;

  return (
    <div className="fixed top-20 left-4 z-40 bg-white p-3 rounded-md shadow-lg border border-gray-300">
      <h3 className="font-bold text-gray-800 text-sm mb-2">👤 Current Role</h3>
      
      <div className="flex items-center gap-2 mb-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          userType === 'Seller' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {userType}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {isVerified ? 'Verified' : 'Unverified'}
        </span>
      </div>

      <p className="text-xs text-gray-600">
        {userType === 'Seller' && !isVerified && '📍 Requires admin verification'}
        {userType === 'Seller' && isVerified && '✅ Can list products'}
        {userType === 'Buyer' && '🛒 Can browse and purchase'}
      </p>
    </div>
  );
};

export default RoleSelector;