import React, { useEffect, useState, useRef } from 'react'; // 1. Import useRef
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PaymentSuccessPage() {
  const { token, authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);

  // 2. THIS IS THE NEW "GATE"
  // We use a ref, which persists across re-renders
  // and won't cause loops like state does.
  const orderCreationHasRun = useRef(false);

  useEffect(() => {
    const createOrder = async () => {
      try {
        const orderData = JSON.parse(localStorage.getItem("orderData"));
        if (!orderData) throw new Error("No order data found.");

        const res = await fetch("https://ironic-gym-backend.onrender.com/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderItems: orderData.cart,
            shippingAddress: orderData.shippingAddress,
            totalPrice: orderData.totalPrice,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to save order");
        }

        const createdOrder = await res.json();
        setOrderId(createdOrder._id);
        localStorage.removeItem("orderData");
        setError("");

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // 3. THE NEW LOGIC
    if (authLoading) {
      return; // Wait for auth to be ready
    }

    // If auth is loaded AND we have a token...
    if (token) {
      // ...AND our "gate" is still closed (it hasn't run yet)
      if (orderCreationHasRun.current === false) {
        orderCreationHasRun.current = true; // Close the gate
        createOrder(); // Run the function
      }
    } else if (!token) {
      // Auth is loaded, but no token. This is a real error.
      setError("You must be logged in to finalize an order.");
      setLoading(false);
    }
    
  }, [token, authLoading]); // 4. The ref is NOT in the dependency array
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        
        {loading ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Processing Your Order...</h1>
            <p>Please wait, we are creating your order receipt.</p>
          </>
        ) : error ? (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mt-6 mb-4">Error Creating Order</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <p className="text-sm text-gray-500">Your payment was successful, but we had trouble creating a receipt. Please contact support with your email.</p>
            <Link to="/" className="block w-full btn-secondary mt-4 px-6 py-3 rounded-full text-sm">
              Back to Home
            </Link>
          </>
        ) : (
          <>
            {/* Checkmark Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">
              Your order has been created.
            </p>
            
            <div className="space-y-4">
              <Link
                to="/orders" // Links to the "My Orders" page
                className="block w-full btn-primary px-6 py-3 rounded-full text-sm sm:text-base"
              >
                View Your Orders
              </Link>
              <Link
                to="/" // Links back to the homepage
                className="block w-full btn-secondary px-6 py-3 rounded-full text-sm sm:text-base"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}