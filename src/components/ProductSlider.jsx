import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';

export default function ProductSlider({ title, products, placeholderText }) {
  const [showArrows, setShowArrows] = useState(false);
  const sliderRef = useRef(null);

  // This effect checks if the content is wider than the container
  useEffect(() => {
    const checkOverflow = () => {
      if (sliderRef.current) {
        const { scrollWidth, clientWidth } = sliderRef.current;
        setShowArrows(scrollWidth > clientWidth);
      }
    };

    // Check when the component mounts and when products change
    checkOverflow();

    // Also re-check if the window resizes
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [products]); // Re-run when products change

  // This handles the "next" and "prev" button clicks
  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300; // How many pixels to scroll
      if (direction === 'prev') {
        sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section id={title.toLowerCase()} className="py-16 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-medium text-gray-900 text-center mb-12">{title}</h2>
      <div className="relative slider-wrapper">
        
        {/* The "showArrows" state controls if this button is rendered at all.
            The "hidden" class makes it invisible until the CSS hover rule activates. */}
        {showArrows && (
          <button
            onClick={() => handleScroll('prev')}
            className="slider-arrow prev-arrow absolute top-1/2 -translate-y-1/2 left-2 z-10 bg-white bg-opacity-90 text-gray-900 p-2 rounded-full shadow-md border border-gray-200 transition-opacity duration-300 hidden"
          >
            <span className="sr-only">Previous</span>
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
        )}
        
        {/* We add the 'ref' to our slider container so React can measure it */}
        <div ref={sliderRef} className="slider-container">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                priceInCents={product.price}
                mainImageUrl={product.mainImageUrl}
                cartImageUrl={product.cartImageUrl}
                reviewCount={0}
                inStock={product.inStock}
                brand={product.brand}
              />
            ))
          ) : (
            <p className="w-full text-center text-gray-500">{placeholderText}</p>
          )}
        </div>
        
        {/* The "showArrows" state controls this button too */}
        {showArrows && (
          <button
            onClick={() => handleScroll('next')}
            className="slider-arrow next-arrow absolute top-1/2 -translate-y-1/2 right-2 z-10 bg-white bg-opacity-90 text-gray-900 p-2 rounded-full shadow-md border border-gray-200 transition-opacity duration-300 hidden"
          >
            <span className="sr-only">Next</span>
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        )}
      </div>
    </section>
  );
}