import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Helper
function formatPrice(priceInCents) {
  return `$${(priceInCents / 100).toFixed(2)} CAD`;
}

export default function ProductDetailsPage() {
  const { id } = useParams(); // Get ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Note: You might need to create a route for GET /api/products/:id in backend
        // If you don't have one, you can fetch all and find by ID (easier for now)
        const res = await fetch("https://ironic-gym-backend.onrender.com/api/products"); 
        const data = await res.json();
        const found = data.find((p) => p._id === id || p.id === id);
        setProduct(found);
      } catch (err) {
        console.error("Error loading product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!product) return <div className="p-10 text-center">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* LEFT: IMAGE */}
        <div className="flex justify-center bg-white border border-gray-200 rounded-lg p-4">
          <img 
            src={product.mainImageUrl} 
            alt={product.name} 
            className="max-h-[500px] object-contain" 
          />
        </div>

        {/* RIGHT: DETAILS */}
        <div>
          <p className="text-sm text-blue-600 font-bold uppercase tracking-wide mb-1">
            {product.brand || "Ironic Brand"}
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            {product.name}
          </h1>
          
          <div className="text-2xl font-bold text-gray-900 mb-6">
            {formatPrice(product.price)}
          </div>

          {/* 👇 DESCRIPTION SECTION */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">About this item</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description || "No description available for this product."}
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
             {/* You can add your Add To Cart logic here */}
             <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full shadow-sm">
               Add to Cart
             </button>
             <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-sm">
               Buy Now
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
