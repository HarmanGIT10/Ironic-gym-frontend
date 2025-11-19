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
    year: "numeric", month: "long", day: "numeric", hour: '2-digit', minute: '2-digit'
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

  if (loading) return <p className="text-center text-gray-600 p-10">Loading all orders...</p>;
  if (error) return <p className="text-red-600 text-center p-10">{error}</p>;

  return (
    <div className="space-y-8">
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
            
            {/* --- HEADER: ID & STATUS --- */}
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</span>
                <p className="text-lg font-bold text-gray-900 font-mono">{order._id}</p>
                <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Status Badge (Visual only) */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                  ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                    order.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' : 
                    order.status === 'Accepted' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-200 text-gray-800'}`}>
                  {order.status}
                </span>

                {/* Status Dropdown */}
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  className="text-sm border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-2 focus:ring-black focus:border-black outline-none"
                >
                  <option value="Received">Received</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* --- BODY: GRID LAYOUT --- */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* COLUMN 1: CUSTOMER & SHIPPING INFO */}
              <div className="space-y-6">
                 <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase mb-2 border-b pb-1">Customer Details</h4>
                    <p className="text-sm font-semibold text-gray-800">{order.shippingAddress.name}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.email}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                 </div>

                 <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase mb-2 border-b pb-1">Shipping Address</h4>
                    <p className="text-sm text-gray-600">{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && <p className="text-sm text-gray-600">{order.shippingAddress.addressLine2}</p>}
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                 </div>
              </div>

              {/* COLUMN 2: ORDER ITEMS (With Images) */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase mb-2 border-b pb-1">Order Items</h4>
                
                {/* List of Items */}
                <div className="space-y-3">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {/* Product Image */}
                      <img 
                        src={item.cartImageUrl || "https://placehold.co/100x100?text=No+Image"} 
                        alt={item.name}
                        className="w-14 h-14 rounded-md object-cover border border-gray-200 mr-4"
                      />
                      
                      {/* Item Details */}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                        <div className="flex items-center text-xs text-gray-500 space-x-3 mt-1">
                           <span>Size: <span className="font-medium text-gray-700">{item.size}</span></span>
                           <span>Qty: <span className="font-medium text-gray-700">{item.quantity}</span></span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                        <p className="text-xs text-gray-500">{formatPrice(item.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Total Price Row */}
                <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                   <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-xl font-bold text-gray-900">{formatPrice(order.totalPrice)}</p>
                   </div>
                </div>
              </div>

            </div>

            {/* --- FOOTER: DELIVERY DATE --- */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
               <div>
                  {order.deliveredAt ? (
                     <p className="text-sm text-green-700 font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Delivered on: {formatDate(order.deliveredAt)}
                     </p>
                  ) : (
                     <p className="text-sm text-gray-500 italic">Delivery date pending...</p>
                  )}
               </div>

               {/* Date Editor Logic */}
               {(order.status === "Dispatched" || order.status === "Completed") && (
                  <div>
                    {editingDateId === order._id ? (
                      <div className="flex items-center space-x-2">
                        <input 
                          type="date"
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className="text-sm border border-gray-300 rounded-md p-1"
                        />
                        <button 
                          onClick={() => handleDateUpdate(order._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => { setEditingDateId(null); setDeliveryDate(""); }}
                          className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          setEditingDateId(order._id);
                          setDeliveryDate(getHtmlDate(order.deliveredAt));
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                      >
                        {order.deliveredAt ? "Change Date" : "Set Delivery Date"}
                      </button>
                    )}
                  </div>
               )}
            </div>

          </div>
        ))
      )}
    </div>
  );
}
