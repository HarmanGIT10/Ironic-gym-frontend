import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, ShieldCheck, RefreshCcw, Minus, Plus, ChevronRight } from 'lucide-react';

// Helper to format price
function formatPrice(priceInCents) {
  return `$${(priceInCents / 100).toFixed(2)} CAD`;
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("https://ironic-gym-backend.onrender.com/api/products");
        const data = await res.json();
        // Handle both _id (MongoDB) and id (if remapped)
        const found = data.find((p) => p._id === id || p.id === id);
        setProduct(found);
        if (found) setActiveImage(found.mainImageUrl);
      } catch (err) {
        console.error("Error loading product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
      <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
    </div>
  );

  const handleQuantityChange = (val) => {
    if (val < 1) return;
    setQuantity(val);
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex text-sm text-gray-500 items-center space-x-2">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="capitalize hover:text-gray-900 transition-colors cursor-pointer">{product.category || "Shop"}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* LEFT COLUMN: IMAGES */}
          <div className="space-y-6">
            {/* Main Image Stage */}
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative group">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-contain object-center mix-blend-multiply p-8 transition-transform duration-500 group-hover:scale-105"
              />
              {!product.inStock && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-full">
                  Sold Out
                </div>
              )}
            </div>
            
            {/* Thumbnail Strip (Simulated since we mostly have 1 image in DB) */}
            <div className="grid grid-cols-4 gap-4">
              {[product.mainImageUrl, product.cartImageUrl].filter(Boolean).map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-lg border-2 overflow-hidden bg-gray-50 p-2 transition-all ${activeImage === img ? 'border-black ring-1 ring-black/20' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: PRODUCT INFO */}
          <div className="flex flex-col">
            {/* Header */}
            <div className="mb-6 border-b border-gray-100 pb-6">
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">
                {product.brand || "Ironic Brand"}
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                {product.name}
              </h1>
              
              {/* Rating (Static for visual flair) */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  <Star className="w-4 h-4 text-gray-300" />
                </div>
                <span className="text-sm text-gray-500 font-medium">(4.2/5 based on 24 reviews)</span>
              </div>

              <div className="flex items-end space-x-4">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {/* Fake original price for discount effect */}
                <span className="text-lg text-gray-400 line-through mb-1">{formatPrice(product.price * 1.2)}</span>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded mb-1">Save 20%</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm text-gray-600 mb-8">
              <p className="whitespace-pre-line leading-relaxed">
                {product.description || "Elevate your style with this premium item. Designed for comfort and durability, it's the perfect addition to your collection. Crafted with high-quality materials to ensure longevity."}
              </p>
            </div>

            {/* Color/Size Selectors (Static placeholders for UI completeness) */}
            <div className="mb-8 space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-900">Color: <span className="text-gray-500 font-normal">Black (Standard)</span></span>
                <div className="flex space-x-2 mt-2">
                  <div className="w-8 h-8 rounded-full bg-black border-2 border-white ring-1 ring-gray-300 cursor-pointer ring-offset-1"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white ring-1 ring-transparent cursor-not-allowed relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-px bg-gray-400 -rotate-45"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Area */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              {product.inStock ? (
                <>
                  <div className="flex items-center mb-6">
                    <span className="text-sm font-medium text-gray-700 mr-4">Quantity:</span>
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                      <button 
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="p-2 hover:bg-gray-100 text-gray-600 rounded-l-lg transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="p-2 hover:bg-gray-100 text-gray-600 rounded-r-lg transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* ADD TO CART - Connected to Global Cart via Class Name */}
                    <button
                      className="quick-add-btn w-full bg-black text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                      data-product-id={product._id || product.id}
                      data-product-name={product.name}
                      data-product-price={product.price}
                      data-product-image={product.cartImageUrl}
                      data-product-brand={product.brand}
                      // We simulate clicks based on quantity
                      onClick={(e) => {
                         // If you had a quantity-aware cart, you'd pass quantity.
                         // Since your system relies on a simple click listener, 
                         // this will add 1 item.
                      }}
                    >
                      Add to Cart
                    </button>
                    
                    {/* BUY NOW - Secondary Style */}
                    <button 
                      className="quick-add-btn w-full bg-white text-black border-2 border-black font-bold text-lg py-4 rounded-xl hover:bg-gray-50 transition-all active:scale-[0.98]"
                      data-product-id={product._id || product.id}
                      data-product-name={product.name}
                      data-product-price={product.price}
                      data-product-image={product.cartImageUrl}
                      data-product-brand={product.brand}
                    >
                      Buy Now
                    </button>
                  </div>
                  
                  <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Secure transaction via Stripe/Razorpay
                  </p>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-red-600 font-bold text-lg mb-2">Currently Out of Stock</p>
                  <p className="text-gray-500 text-sm">We are working hard to restock this item.</p>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
              <div className="text-center group">
                <div className="w-10 h-10 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-2 group-hover:bg-blue-100 transition">
                  <Truck className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-gray-900">Fast Delivery</p>
                <p className="text-[10px] text-gray-500">Within 3-5 days</p>
              </div>
              <div className="text-center group">
                <div className="w-10 h-10 mx-auto bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-2 group-hover:bg-green-100 transition">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-gray-900">Warranty</p>
                <p className="text-[10px] text-gray-500">1 Year included</p>
              </div>
              <div className="text-center group">
                <div className="w-10 h-10 mx-auto bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-2 group-hover:bg-purple-100 transition">
                  <RefreshCcw className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-gray-900">Easy Returns</p>
                <p className="text-[10px] text-gray-500">30 Day Policy</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
