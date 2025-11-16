import { useEffect, useState, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../context/AuthContext";
import BillingAddressModal from "./BillingAddressModal";

// Helper function
function formatPrice(priceInCents) {
    return `$${(priceInCents / 100).toFixed(2)} CAD`;
}

export default function CartSystem() {
    const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
    const [cart, setCart] = useState(() => {
      try {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        return [];
      }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
      localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const openCart = () => { setIsCartOpen(true); setError(null); };
    const closeCart = () => setIsCartOpen(false);

    const addToCart = useCallback((product) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        openCart();
    }, []);

    const updateItemQuantity = (id, newQuantity) => {
        const quantity = parseInt(newQuantity, 10);
        if (quantity < 1) {
            setCart((prev) => prev.filter(item => item.id !== id));
        } else {
            setCart((prev) => prev.map(item =>
                item.id === id ? { ...item, quantity: quantity } : item
            ));
        }
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter(item => item.id !== id));
    };

    const handleCheckout = async () => {
        setError(null);
        setIsLoading(true);
        try {
            if (!token) throw new Error("You must be signed in to check out. Please go to the Auth page.");
            if (cart.length === 0) throw new Error("Your cart is empty.");

            const profileRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
              headers: { "Authorization": `Bearer ${token}` },
            });
            if (!profileRes.ok) throw new Error("Could not verify your profile. Please log in again.");
            const profile = await profileRes.json();
            if (!profile.addressLine1 || !profile.city || !profile.postalCode || !profile.country) {
              throw new Error("Please complete your full address in your Profile before checking out.");
            }

            setIsLoading(false);
            setIsCartOpen(false);
            setIsBillingModalOpen(true);
        } catch (error) {
            console.error("Checkout validation error:", error.message);
            setError(error.message);
            setIsLoading(false);
        }
    };

    const handleConfirmBilling = async (billingAddress) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/create-checkout-session`, {
                method: "POST",
                headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ products: cart })
            });

            if (!res.ok) {
                const errorJson = await res.json();
                throw new Error(errorJson.error || "Failed to create checkout session.");
            }

            const session = await res.json();
            
            localStorage.setItem("orderData", JSON.stringify({
              cart: cart.map(item => ({
                name: item.name,
                brand: item.brand || "", // This will now have the brand
                quantity: item.quantity,
                price: item.price,
                product: item.id,
                cartImageUrl: item.image
              })),
              shippingAddress: billingAddress,
              totalPrice: subtotal,
            }));
            
            localStorage.removeItem("cart");
            setCart([]);
            window.location.href = session.url;

        } catch (err) {
            setError(err.message); 
            setIsBillingModalOpen(false); 
            setIsCartOpen(true);
        }
        setIsLoading(false);
    };

    // --- "Bridge" to External HTML ---
    useEffect(() => {
        const handleQuickAdd = (e) => {
            const btn = e.target.closest(".quick-add-btn");
            if (!btn) return;
            e.preventDefault();
            
            // 👇 --- THIS IS THE FIX ---
            const product = {
                id: btn.dataset.productId,
                name: btn.dataset.productName,
                price: parseInt(btn.dataset.productPrice, 10),
                image: btn.dataset.productImage,
                brand: btn.dataset.productBrand // 3. READ THE BRAND
            };
            addToCart(product);
        };
        document.body.addEventListener("click", handleQuickAdd);
        
        const cartToggle = document.getElementById("cart-toggle");
        cartToggle?.addEventListener("click", openCart);

        const cartCountEls = [document.getElementById('cart-count'), document.getElementById('cart-modal-count')];
        cartCountEls.forEach(el => {
            if (el) el.textContent = totalItems;
        });

        return () => {
            document.body.removeEventListener("click", handleQuickAdd);
            cartToggle?.removeEventListener("click", openCart);
        };
    }, [addToCart, totalItems, openCart]);

    // --- Slider Logic (Unchanged) ---
    useEffect(() => {
        // ... (all your slider logic is unchanged) ...
    }, []); 

    // --- RENDER THE MODAL ---
    return (
        <>
            <BillingAddressModal 
              show={isBillingModalOpen}
              onClose={() => setIsBillingModalOpen(false)}
              onConfirm={handleConfirmBilling}
              isLoading={isLoading}
            />
            
            {/* Overlay */}
            <div
                id="cart-modal-overlay"
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity ${isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={closeCart}
            ></div>

            {/* Cart Modal */}
            <div
                id="cart-modal"
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 text-white shadow-2xl z-50 flex flex-col transition-transform ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h2 className="text-xl font-medium">Your Cart ({totalItems})</h2>
                    <button
                        id="cart-close-btn"
                        className="text-gray-400 hover:text-white text-3xl"
                        onClick={closeCart}
                    >
                        &times;
                    </button>
                </div>

                {/* Items Container */}
                <div id="cart-items-container" className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <p id="cart-empty-msg" className="text-gray-400 text-center">Your cart is empty.</p>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex items-start space-x-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-800 flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-base font-medium text-white truncate">{item.name}</h4>
                                    <p className="text-base text-gray-300 mt-1">{formatPrice(item.price)}</p>
                                    <div className="flex items-center space-x-2 mt-3">
                                        <button
                                            className="quantity-change w-7 h-7 flex items-center justify-center rounded-full bg-gray-700 text-lg text-gray-300 hover:bg-gray-600"
                                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            min="1"
                                            className="quantity-input w-12 h-7 bg-gray-800 border border-gray-700 text-white text-center rounded focus:outline-none focus:ring-1 focus:ring-white"
                                            onChange={(e) => updateItemQuantity(item.id, e.target.value)}
                                        />
                                        <button
                                            className="quantity-change w-7 h-7 flex items-center justify-center rounded-full bg-gray-700 text-lg text-gray-300 hover:bg-gray-600"
                                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end h-full">
                                    <p className="text-base text-white font-medium">{formatPrice(item.price * item.quantity)}</p>
                                    <button
                                        className="text-xs text-red-500 hover:text-red-400 mt-auto"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer (Subtotal & Checkout) */}
                <div className="p-6 border-t border-gray-700">
                    
                    {error && (
                        <div 
                            id="cart-error-msg" 
                            className="bg-red-900/50 border border-red-700 text-red-300 text-sm p-3 rounded-lg mb-4"
                        >
                            {error}
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg text-gray-300">Subtotal:</span>
                        <span id="cart-subtotal" className="text-xl font-medium text-white">{formatPrice(subtotal)}</span>
                    </div>
                    <button
                        id="checkout-btn"
                        className="payment-btn btn w-full bg-white text-black py-3 px-6 rounded-lg font-bold text-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        onClick={handleCheckout}
                        disabled={isLoading} 
                    >
                        {isLoading ? "Checking..." : "Checkout"}
                    </button>
                </div>
            </div>
        </>
    );
}