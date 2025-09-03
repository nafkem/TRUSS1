import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserActions } from '../hook/useUserActions';
import { useAdminActions } from '../hook/useAdminActions';

const DeveloperPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [sellerToVerify, setSellerToVerify] = useState('');
  
  const { 
    registerAsUser, 
    getUserData, 
    isLoading, 
    error, 
    userData 
  } = useUserActions();

  const { 
    verifySeller, 
    isLoading: adminLoading, 
  } = useAdminActions();

  const handleRegister = () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('Please enter first and last name');
      return;
    }
    registerAsUser(firstName, lastName);
  };

  const handleVerifySeller = () => {
    if (!sellerToVerify.trim()) {
      alert('Please enter a seller address');
      return;
    }
    verifySeller(sellerToVerify.trim());
  };

  const quickActions = [
    {
      label: '🚀 Go to Sell Page',
      path: '/sell',
      description: 'Test the new product listing flow'
    },
    {
      label: '📦 View Listings', 
      path: '/listing',
      description: 'Check existing product listings'
    },
    {
      label: '🛒 View Cart',
      path: '/cart',
      description: 'Test shopping cart functionality'
    }
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-4 right-4 z-[9999] bg-red-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-red-700 text-sm font-medium"
      >
        {isVisible ? '❌ Hide Tools' : '🔧 Dev Tools'}
      </button>

      {/* Panel Content */}
      {isVisible && (
        <div 
          className="fixed top-16 right-4 z-[9998] bg-yellow-300 p-4 rounded-md shadow-lg border-2 border-red-500 w-80 max-h-96 overflow-y-auto"
          style={{ display: 'block' }}
        >
          <h2 className="text-lg font-bold mb-3 text-gray-800 border-b-2 border-red-500 pb-2">
            🚨 DEV TOOLS 🚨
          </h2>
          
          <p className="text-sm text-gray-700 mb-4 font-bold">
            Testing E-commerce Flow
          </p>

          {/* User Status Display */}
          {userData ? (
            <div className="bg-green-200 p-3 rounded-md mb-4 border-2 border-green-500">
              <h3 className="font-semibold text-gray-800 text-sm mb-2">✅ User Status</h3>
              <div className="text-xs text-gray-700 space-y-1">
                <p>🆔 ID: {userData.userId.toString()}</p>
                <p>👤 Type: {userData._userType === 0 ? 'Buyer' : 'Seller'}</p>
                <p>✅ Status: {userData.verificationStatus === 0 ? 'Not Verified' : 'Verified'}</p>
              </div>
            </div>
          ) : (
            <div className="bg-blue-200 p-3 rounded-md mb-4 border-2 border-blue-500">
              <p className="text-sm text-gray-700">👤 Click below to check user status</p>
            </div>
          )}

          {/* ADMIN TOOLS - ADD THIS SECTION */}
          <div className="bg-orange-200 p-3 rounded-md mb-4 border-2 border-orange-500">
            <h3 className="font-semibold text-gray-800 text-sm mb-2">🛠️ Admin Tools</h3>
            <p className="text-xs text-orange-700 mb-2">
              Admin: 0x56c928...EC856
            </p>
            <input
              type="text"
              placeholder="Seller Address to Verify"
              value={sellerToVerify}
              onChange={(e) => setSellerToVerify(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
              disabled={adminLoading}
            />
            <button
              onClick={handleVerifySeller}
              disabled={adminLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white p-2 rounded text-sm disabled:opacity-50"
            >
              {adminLoading ? "Verifying..." : "Verify Seller"}
            </button>
          </div>

          {/* Registration Form */}
          <div className="bg-white p-3 rounded-md mb-4 border-2 border-blue-500">
            <h3 className="font-semibold text-gray-800 text-sm mb-2">👤 Register User</h3>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
              disabled={isLoading}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
              disabled={isLoading}
            />
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded text-sm disabled:opacity-50"
            >
              {isLoading ? "Registering..." : "Register User"}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3 mb-4">
            <h3 className="font-semibold text-gray-800 text-sm mb-2">📍 Quick Navigation</h3>
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                onClick={() => setIsVisible(false)}
                className="block w-full bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-md border-2 border-blue-500 transition-colors duration-200"
              >
                <span className="font-medium text-sm block">{action.label}</span>
                <span className="text-gray-600 text-xs block mt-1">{action.description}</span>
              </Link>
            ))}
          </div>

          {/* Check User Status Button */}
          <button
            onClick={getUserData}
            disabled={isLoading}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-md border-2 border-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            <span className="font-medium text-sm block">
              {isLoading ? '⏳ Loading...' : '👤 Check My Status'}
            </span>
            <span className="text-purple-100 text-xs block mt-1">
              Fetch user data from blockchain
            </span>
          </button>

          {/* Connection Status */}
          <div className="bg-green-500 p-3 rounded-md border-2 border-green-700">
            <p className="text-white text-xs font-bold">
              🌐 Connected to: Base Sepolia Testnet
            </p>
          </div>

          {error && (
            <div className="mt-3 bg-red-500 p-3 rounded-md border-2 border-red-700">
              <p className="text-white text-xs font-bold">❌ Error: {error}</p>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="w-full mt-4 bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-md text-sm font-bold border-2 border-black"
          >
            ❌ Close Panel
          </button>
        </div>
      )}
    </>
  );
};

export default DeveloperPanel;