// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

// Helper function to format price
function formatPrice(priceInCents) {
  return `$${(priceInCents / 100).toFixed(2)} CAD`;
}

const Navbar = ({ allProducts }) => {
  const { user, logout } = useAuth();
  
  // State for UI Toggles
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Hamburger state

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Search logic
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    const results = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, allProducts]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    window.location.href = "/auth";
  };

  const handleSearchClick = () => {
    setSearchTerm("");
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="navbar-glass sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* ================= LEFT SIDE ================= */}
            <div className="flex items-center space-x-4 md:space-x-10">
              
              {/* HAMBURGER ICON (Mobile Only) */}
              <button 
                className="md:hidden text-gray-900 hover:text-gray-600 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>

              {/* BRAND */}
              <a href="/" className="navbar-brand text-xl md:text-2xl font-bold uppercase tracking-wider text-black hover:text-gray-700 transition-colors">
                IRONIC
              </a>

              {/* DESKTOP NAV LINKS (Hidden on Mobile) */}
              <div className="hidden md:flex space-x-6">
                <a href="/#shop-categories" className="navbar-link text-sm font-medium text-gray-900 hover:text-gray-600">Shop</a>
                <a href="/#best-sellers" className="navbar-link text-sm font-medium text-gray-900 hover:text-gray-600">Best Sellers</a>
                <a href="/orders" className="navbar-underline navbar-link text-sm font-medium text-gray-900 hover:text-gray-600">Orders</a>
              </div>
            </div>

            {/* ================= RIGHT SIDE ================= */}
            <div className="flex items-center space-x-3 md:space-x-5">

              {/* SEARCH ICON (Visible on Mobile & Desktop) */}
              <div className="relative flex items-center">
                <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-600 hover:text-gray-900">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>

                {/* SEARCH INPUT & DROPDOWN (Desktop/Overlay) */}
                {isSearchOpen && (
                  <>
                   {/* Simple Input for Desktop (expands) */}
                    <div className="absolute right-0 top-8 md:static md:top-auto"> 
                       <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="ml-2 p-2 w-40 md:w-auto border border-gray-300 rounded-md text-sm shadow-lg md:shadow-none"
                        autoFocus
                      />
                    </div>

                    {/* DROPDOWN RESULTS */}
                    {searchTerm && (
                      <div className="search-dropdown absolute top-10 right-0 mt-2 w-72 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto" onMouseLeave={() => setIsSearchOpen(false)}>
                        {searchResults.length > 0 ? (
                          <div className="p-2 space-y-2">
                            {searchResults.map(product => (
                              <a key={product._id} href={`/#${product._id}`} onClick={handleSearchClick} className="flex items-center p-2 rounded-md hover:bg-gray-100">
                                {/* Show Image in Dropdown */}
                                <img src={product.cartImageUrl} alt={product.name} className="w-12 h-12 rounded-md object-cover mr-3" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                  <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
                                </div>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="p-4 text-sm text-gray-500">No products found.</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* DESKTOP AUTH BUTTONS (Hidden on Mobile) */}
              <div className="hidden md:block">
                {user ? (
                  <div className="relative">
                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="text-gray-600 hover:text-gray-900 flex items-center">
                      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </button>
                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50" onMouseLeave={() => setIsProfileOpen(false)}>
                        <div className="px-4 py-2 text-sm text-gray-700">Signed in as<br /><strong>{user.name || user.email}</strong></div>
                        <div className="border-t border-gray-100"></div>
                        <a href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">Your Profile</a>
                        <a href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">Orders</a>
                        <div className="border-t border-gray-100"></div>
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Log out</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <a href="/auth?mode=signin" className="text-sm text-gray-600 hover:text-gray-900">Sign In</a>
                    <a href="/auth?mode=signup" className="nav-signup-btn text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">Sign Up</a>
                  </div>
                )}
              </div>

              {/* CART ICON (Visible on All) */}
              <a onClick={(e) => e.preventDefault()} id="cart-toggle" className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span className="ml-1 text-sm font-medium">Cart(<span id="cart-count">0</span>)</span>
              </a>

            </div>
          </div>
        </nav>
      </header>

      {/* ================= MOBILE SIDEBAR MENU ================= */}
      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="p-5 h-full flex flex-col">
          
          {/* Header: Brand + Close Button */}
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-bold uppercase tracking-wider">IRONIC</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-500 hover:text-black p-2 rounded-full hover:bg-gray-100 transition"
            >
              {/* CROSS ICON */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Mobile Search Input */}
          <div className="mb-8">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-5 h-5 absolute right-3 top-3.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            {/* Mobile Search Results List (Simple) */}
            {searchTerm && (
               <div className="mt-2 max-h-40 overflow-y-auto border-t border-gray-100">
                  {searchResults.map(product => (
                    <a key={product._id} href={`/#${product._id}`} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-gray-700 border-b border-gray-50">
                      {product.name}
                    </a>
                  ))}
               </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-4 mb-8 flex-grow">
            <a href="/#shop-categories" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link text-lg font-medium text-gray-900">Shop</a>
            <a href="/#best-sellers" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link text-lg font-medium text-gray-900">Best Sellers</a>
            <a href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link text-lg font-medium text-gray-900">Orders</a>
          </div>

          {/* Mobile Auth Buttons (Bottom) */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3 mb-4">
                   <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                   </div>
                   <div>
                      <p className="text-sm font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                   </div>
                </div>
                <a href="/profile" className="block w-full text-center py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 mobile-btn-anim">Profile</a>
                <button onClick={handleLogout} className="block w-full text-center py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 mobile-btn-anim">Log Out</button>
              </>
            ) : (
              <>
                <a href="/auth?mode=signin" className="block w-full text-center py-3 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 mobile-btn-anim">Sign In</a>
                <a href="/auth?mode=signup" className="block w-full text-center py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 mobile-btn-anim">Sign Up</a>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;
