// src/pages/PaymentCancelPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        
        {/* X Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-2">Payment Canceled</h1>
        <p className="text-gray-600 mb-8">
          Your payment was not completed. Your cart has been saved if you'd like to try again.
        </p>
        
        <Link
          to="/" // Links back to the homepage
          className="block w-full btn-primary px-6 py-3 rounded-full text-sm sm:text-base"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  );
}