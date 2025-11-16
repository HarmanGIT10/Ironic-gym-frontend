// src/components/BillingAddressModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function BillingAddressModal({ show, onClose, onConfirm, isLoading }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Function to fetch profile data and fill the form
  const fetchProfileData = async () => {
    setLoadingProfile(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const profile = await res.json();
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        addressLine1: profile.addressLine1 || "",
        addressLine2: profile.addressLine2 || "",
        city: profile.city || "",
        postalCode: profile.postalCode || "",
        country: profile.country || "",
      });
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
    setLoadingProfile(false);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle the "Confirm & Pay" button click
  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(formData); // Send the completed address data back to CartSystem
  };

  if (!show) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Billing Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 text-3xl">&times;</button>
        </div>

        {/* "Use Profile" Button */}
        <button
          onClick={fetchProfileData}
          disabled={loadingProfile}
          className="w-full btn-secondary px-4 py-2 rounded-lg text-sm mb-4"
        >
          {loadingProfile ? "Loading..." : "Use My Profile Address"}
        </button>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
            <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary px-6 py-3 rounded-full text-sm sm:text-base mt-6 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Confirm & Proceed to Payment"}
          </button>
        </form>
      </div>
    </>
  );
}