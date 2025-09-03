import React, { useState } from 'react';
import { useProductActions } from '../../hook/useProductActions';

const SellProductPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    unitPrice: '',
    waranteeDuration: '365', // default 1 year in days
    expectedDeliveryTime: '72' // default 3 days in hours
  });

  const { listProduct, isLoading, error } = useProductActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await listProduct({
      title: formData.title,
      unitPrice: parseFloat(formData.unitPrice),
      waranteeDuration: parseInt(formData.waranteeDuration),
      expectedDeliveryTime: parseInt(formData.expectedDeliveryTime)
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">List a Product</h1>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-blue-700">
          <strong>Note:</strong> Seller verification required before listing products.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Product Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
            placeholder="Enter product title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Price (ETH) *</label>
          <input
            type="number"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            step="0.001"
            min="0.001"
            className="w-full p-2 border border-gray-300 rounded"
            required
            placeholder="0.00"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Warranty Duration (Days) *</label>
          <input
            type="number"
            name="waranteeDuration"
            value={formData.waranteeDuration}
            onChange={handleChange}
            min="1"
            className="w-full p-2 border border-gray-300 rounded"
            required
            placeholder="365"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Expected Delivery Time (Hours) *</label>
          <input
            type="number"
            name="expectedDeliveryTime"
            value={formData.expectedDeliveryTime}
            onChange={handleChange}
            min="1"
            className="w-full p-2 border border-gray-300 rounded"
            required
            placeholder="72"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Listing Product...' : 'List Product'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default SellProductPage;