// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; 
// Helper function to format price
function formatPrice(priceInCents) {
  return `$${(priceInCents / 100).toFixed(2)} CAD`;
}

// Placeholder image helper
const getPlaceholderImage = (text) =>
  `https://placehold.co/100x100/f0f0f0/333333?text=${text.replace(/\s+/g, '+')}`;

const Navbar = ({ allProducts }) => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    window.location.href = "/auth";
  };

  const handleSearchClick = () => {
    setSearchTerm("");
    setIsSearchOpen(false);
  };

  return (
    <header className="navbar-glass sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* LEFT SIDE */}
          <div className="flex items-center space-x-10">

            {/* Brand */}
            <a
              href="/"
              className="navbar-brand text-2xl font-bold uppercase tracking-wider text-black hover:text-gray-700 transition-colors"
            >
              IRONIC
            </a>

            {/* Nav links */}
            <div className="hidden md:flex space-x-6">
              <a href="/#shop-categories" className="navbar-link text-sm font-medium text-gray-900 hover:text-gray-600">
                Shop
              </a>
              <a href="/#best-sellers" className="navbar-link text-sm font-medium text-gray-900 hover:text-gray-600">
                Best Sellers
              </a>
              <a href="/orders" className="navbar-underline navbar-link text-sm font-medium text-gray-900 hover:text-gray-600">
                Orders
              </a>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-5">

            {/* SEARCH */}
            <div className="relative flex items-center">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              {isSearchOpen && (
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ml-2 p-2 border border-gray-300 rounded-md text-sm"
                  autoFocus
                />
              )}

              {/* SEARCH DROPDOWN */}
              {isSearchOpen && searchTerm && (
                <div
                  className="search-dropdown absolute top-full right-0 mt-2 w-72 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto"
                  onMouseLeave={() => setIsSearchOpen(false)}
                >
                  {searchResults.length > 0 ? (
                    <div className="p-2 space-y-2">
                      {searchResults.map(product => (
                        <a
                          key={product._id}
                          href={`/#${product._id}`}
                          onClick={handleSearchClick}
                          className="flex items-center p-2 rounded-md hover:bg-gray-100"
                        >
                          <img
                            src={product.cartImageUrl} alt={product.name}
                            
                            className="w-12 h-12 rounded-md object-cover mr-3"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="p-4 text-sm text-gray-500">
                      No products found for "{searchTerm}"
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* AUTH LOGIC */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </button>

                {isProfileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50"
                    onMouseLeave={() => setIsProfileOpen(false)}
                  >
                    <div className="px-4 py-2 text-sm text-gray-700">
                      Signed in as<br />
                      <strong>{user.name || user.email}</strong>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Your Profile
                    </a>

                    <a
                      href="/orders"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Orders
                    </a>

                    <div className="border-t border-gray-100"></div>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a href="/auth?mode=signin" className="text-sm text-gray-600 hover:text-gray-900">
                  Sign In
                </a>
                <a
                  href="/auth?mode=signup"
                  className=" nav-signup-btn text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                >
                  Sign Up
                </a>
              </div>
            )}

            {/* CART ICON */}
            <a
              onClick={(e) => e.preventDefault()}
              id="cart-toggle"
              className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>

              <span className="ml-1 text-sm font-medium">
                Cart(<span id="cart-count">0</span>)
              </span>
            </a>

          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
