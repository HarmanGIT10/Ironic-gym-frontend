// src/pages/AdminDashboardPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AddProductForm from '../components/AddProductForm'; 
import AdminProductList from '../components/AdminProductList'; 
import AdminOrderList from '../components/AdminOrderList'; 
export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  
  // 2. State to toggle between "Products" and "Orders"
  const [activeTab, setActiveTab] = useState("products"); 

  const handleLogout = () => {
    logout();
    window.location.href = "/auth";
  };

  const onProductAdded = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Check if user data is still loading (from AuthContext)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading admin data...</p>
      </div>
    );
  }

  return (
    <>
      {/* Admin Header */}
      <header className="bg-gray-900 text-white shadow-md">
        <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div>
              <span className="mr-4">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Log Out
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto max-w-7xl p-6">
        
        {/* 3. TABS for Products and Orders */}
        <div className="mb-6 border-b border-gray-300">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("products")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "products"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Manage Products
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "orders"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Manage Orders
            </button>
          </nav>
        </div>

        {/* 4. Show content based on activeTab */}

        {/* --- PRODUCTS TAB --- */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white shadow-lg rounded-xl p-6 border">
                <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
                <AddProductForm onProductAdded={onProductAdded} />
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white shadow-lg rounded-xl p-6 border">
                <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
                <AdminProductList refreshKey={refreshKey} />
              </div>
            </div>
          </div>
        )}

        {/* --- ORDERS TAB --- */}
        {activeTab === "orders" && (
          <div className="bg-white shadow-lg rounded-xl p-6 border">
            <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
            <AdminOrderList />
          </div>
        )}

      </main>
    </>
  );
}