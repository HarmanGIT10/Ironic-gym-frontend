import React from 'react';
import './OrderTimeline.css'; // We need this for the truck animation
import truckLogo from "./trucklogo.png";

// Truck SVG Icon
const TruckIcon = () => (
  <svg
    className="w-6 h-6 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2.05 0.05a2 2 0 011.95.69l1.1 1.26a2 2 0 003.01 0l1.1-1.26a2 2 0 011.95-.69L13 16z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 16h5l4 3H1m-4-3v-3a1 1 0 011-1h2a1 1 0 011 1v3z"
    />
  </svg>
);

// Matches your backend `enum`
const STATUSES = ['Received', 'Accepted', 'Dispatched', 'Completed'];

export default function OrderTimeline({ status, deliveryDate }) {
  const currentStatusIndex = STATUSES.indexOf(status);

  // Calculate the truck's position percentage
  let truckPercentage = 0;
  if (currentStatusIndex === 1) { // Accepted
    truckPercentage = 33.3;
  } else if (currentStatusIndex === 2) { // Dispatched
    truckPercentage = 66.6;
  } else if (currentStatusIndex >= 3) { // Completed
    truckPercentage = 100;
  }

  // Determine the delivery text
  let deliveryText;
  if (deliveryDate) {
    deliveryText = `Delivered on ${new Date(deliveryDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`;
  } else if (status === 'Completed') {
    deliveryText = 'Delivered';
  } else {
    // This is the default text you wanted
    deliveryText = "Est. delivery: 7-10 business days";
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-lg font-medium text-gray-900">{status}</p>
        <p className="text-sm text-gray-600">{deliveryText}</p>
      </div>

      <div className="relative pt-10">
        {/* Truck Icon */}
        <div
          className="order-truck" // Use CSS class for animation
          style={{
            left: `calc(${truckPercentage}% - 20px)`, // -20px to center the 40px icon
          }}
        >
          <img
             src={truckLogo}
            alt="truck"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Timeline Bar */}
        <div className="relative">
          {/* Background Bar */}
          <div className="timeline-background absolute top-1/2 left-0 w-full h-1 bg-gray-200 rounded-full"></div>

          {/* Progress Bar */}
          <div
            className="order-progress-bar" // Use CSS class for animation
            style={{
              width: `${truckPercentage}%`,
            }}
          ></div>
        </div>

        {/* Status Points */}
        <div className="relative flex justify-between mt-8">
          {STATUSES.map((step, index) => (
            <div key={step} className="text-center" style={{ width: '25%' }}>
              <div
                className={`w-4 h-4 rounded-full mx-auto mb-2 border-2 transition-colors duration-500 ${index <= currentStatusIndex ? 'bg-black border-black' : 'bg-white border-gray-300'
                  }`}
              ></div>
              <p
                className={`text-xs font-medium transition-colors duration-500 ${index <= currentStatusIndex ? 'text-black' : 'text-gray-400'
                  }`}
              >
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}