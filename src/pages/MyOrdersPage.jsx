import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import OrderCard from '../components/OrderCard';
import './OrderPage.css';

const TABS = ['All Orders', 'Received', 'Accepted', 'Dispatched', 'Completed'];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        setError("You must be logged in to view orders.");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("https://ironic-gym-backend.onrender.com/api/orders/myorders", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  // Filter orders based on the active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'All Orders') return true;
    return order.status === activeTab;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
        <p className="text-lg text-gray-600 mb-8">Track and manage your past orders.</p>

        {/* Filter Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex flex-wrap gap-4" aria-label="Tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 text-sm font-medium transition-colors duration-200
                  ${activeTab === tab
                    ? 'border-b-2 border-black text-black'
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Orders List */}
        <div className="animate-fadeIn space-y-8">
          {loading && (
            <div className="bg-white shadow-lg rounded-xl p-8 border text-center">
              <p className="text-gray-600">Loading your orders...</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-white shadow-lg rounded-xl p-8 border text-center">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && filteredOrders.length > 0 && (
            filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          )}

          {!loading && !error && filteredOrders.length === 0 && (
            <div className="bg-white shadow-lg rounded-xl p-8 border text-center">
              <p className="text-gray-600">You have no orders in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}