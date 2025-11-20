import React from 'react';
import './ProductCard.css';
// Helper function to format price
function formatPrice(priceInCents) {
    return `$${(priceInCents / 100).toFixed(2)} CAD`;
}

// 1. Add 'brand' to the props list
export default function ProductCard({ id, name, priceInCents, mainImageUrl, cartImageUrl, reviewCount, inStock, brand }) {
  return (
    <div id={id} className="slider-item product-card group bg-white border border-gray-200 rounded-lg overflow-hidden">
      <Link to={`/product/${id}`} className="block">
        <div className="w-full h-[300px] overflow-hidden rounded-md">
          <img
            src={mainImageUrl}
            alt={name}
            className="w-full h-full object-contain object-center transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          
          {/* 2. ADDED THE BRAND HERE */}
          <p className="text-sm text-gray-500 mb-1 truncate">{brand || 'Brand'}</p>
          
          <h4 className="text-base font-medium text-gray-900 truncate">{name}</h4>
          <p className="mt-1 text-base text-gray-700">{formatPrice(priceInCents)}</p>
         

          {inStock ? (
            <button
              className="quick-add-btn btn-secondary w-full text-center mt-3 py-2 px-4 rounded-lg text-sm"
              data-product-id={id}
              data-product-name={name}
              data-product-price={priceInCents}
              data-product-image={cartImageUrl}
              data-product-brand={brand} // 3. Pass brand to cart
            >
              Quick Add
            </button>
          ) : (
            <button
              className="w-full text-center mt-3 py-2 px-4 rounded-lg text-sm bg-gray-200 text-gray-500 cursor-not-allowed"
              disabled
            >
              Out of Stock
            </button>
          )}

        </div>
      </a>
    </div>
  );
}
