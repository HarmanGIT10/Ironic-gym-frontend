import React from 'react';
import OrderTimeline from './OrderTimeline'; // We will create this next

// Helper function to format price
function formatPrice(priceInCents) {
  return `$${(priceInCents / 100).toFixed(2)} CAD`;
}

// Helper function to format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function OrderCard({ order }) {
  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      {/* --- Order Header --- */}
      <div className="p-6 bg-gray-50 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Order ID: {order.id}</h2>
          <p className="text-sm text-gray-600">Ordered on: {formatDate(order.createdAt)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-lg font-semibold text-gray-900">{formatPrice(order.totalPrice)}</p>
        </div>
      </div>

      {/* --- Order Items --- */}
      <div className="p-6 space-y-4">
        {order.orderItems.map((item, index) => (
          <div key={item.product + index} className="flex items-center space-x-4">
            <img 
              src={item.cartImageUrl} 
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover border border-gray-200"
            />
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="text-right flex-1 text-gray-700">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      {/* --- Order Timeline --- */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <OrderTimeline 
          status={order.status} 
          deliveryDate={order.deliveredAt} 
        />
      </div>
    </div>
  );
}