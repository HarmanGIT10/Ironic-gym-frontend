// src/components/AdminOrderList.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Helper function to format price
function formatPrice(priceInCents) {
    return `$${(priceInCents / 100).toFixed(2)} CAD`;
}
// Helper function to format date
function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function AdminOrderList() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. ADD NEW STATE ---
  const [editingDateId, setEditingDateId] = useState(null); // Which order are we editing?
  const [deliveryDate, setDeliveryDate] = useState(""); // The date from the input

  // Fetch all orders
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://ironic-gym-backend.onrender.com/api/orders", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchAllOrders();
    }
  }, [token]);

  // Function to handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await fetch(`https://ironic-gym-backend.onrender.com/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      const updatedOrder = await res.json();
      setOrders(orders.map(o => (o._id === orderId ? updatedOrder : o)));

    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // --- 2. ADD NEW FUNCTION TO SAVE DELIVERY DATE ---
  const handleDateUpdate = async (orderId) => {
    try {
      const res = await fetch(`https://ironic-gym-backend.onrender.com/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ deliveredAt: deliveryDate }), // Send the new date
      });

      if (!res.ok) throw new Error("Failed to update delivery date");
      
      const updatedOrder = await res.json();
      setOrders(orders.map(o => (o._id === orderId ? updatedOrder : o)));
      
      // Close the date picker
      setEditingDateId(null);
      setDeliveryDate("");

    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };
  
  // Helper to get the date in YYYY-MM-DD format for the input
  const getHtmlDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split('T')[0];
  }

  if (loading) return <p>Loading all orders...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="bg-gray-50 p-4 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Col 1: Order Details */}
              <div>
                <p className="text-xs font-medium text-gray-500">Order ID</p>
                <p className="font-bold">{order._id}</p>
                <p className="text-xs font-medium text-gray-500 mt-2">Date</p>
                <p>{formatDate(order.createdAt)}</p>
              </div>

              {/* Col 2: Customer Details */}
              <div>
                <p className="text-xs font-medium text-gray-500">Customer</p>
                <p className="font-bold">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.email}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>

              {/* Col 3: Items & Delivery Date */}
              <div>
                <p className="text-xs font-medium text-gray-500">Items</p>
                <ul className="list-disc list-inside">
                  {order.orderItems.map((item, index) => (
                    <li key={index} className="text-sm">
                      {item.quantity} x {item.name}
                    </li>
                  ))}
                </ul>
                <p className="font-bold mt-2">Total: {formatPrice(order.totalPrice)}</p>
                
                {/* --- 3. SHOW DELIVERY DATE --- */}
                {order.deliveredAt && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-500">Delivery On:</p>
                    <p className="font-medium text-green-700">{formatDate(order.deliveredAt)}</p>
                  </div>
                )}
              </div>

              {/* Col 4: Status & Date Update */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Update Status</p>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="Received">Received</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Completed">Completed</option>
                </select>
                
                {/* --- 4. SHOW DATE PICKER --- */}
                {/* Only show this if the order is Dispatched OR Completed */}
                {(order.status === "Dispatched" || order.status === "Completed") && (
                  <div className="mt-4">
                    {editingDateId === order._id ? (
                      // Show the input field
                      <div className="space-y-2">
                        <input 
                          type="date"
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                        <button 
                          onClick={() => handleDateUpdate(order._id)}
                          className="w-full text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                        >
                          Save Date
                        </button>
                      </div>
                    ) : (
                      // Show the button
                      <button 
                        onClick={() => {
                          setEditingDateId(order._id);
                          setDeliveryDate(getHtmlDate(order.deliveredAt));
                        }}
                        className="w-full text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                      >
                        {order.deliveredAt ? "Edit Date" : "Set Delivery Date"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}