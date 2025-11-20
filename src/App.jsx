import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useState, useEffect } from "react"; // 1. Import hooks

// Import your pages
import AuthPage from "./pages/Authpage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";

import AdminDashboardPage from "./pages/AdminDashboardPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage"; 
import PaymentCancelPage from "./pages/PaymentCancelPage"; 
import MyOrdersPage from "./pages/MyOrdersPage";

import ProductDetailsPage from './pages/ProductDetailsPage';






// Import your persistent components
import Navbar from "./components/Navbar";
import CartSystem from "./components/Cartsystem";

// Main layout for your whole site
function MainLayout({ products, loading, error }) { // 2. Accept products
  return (
    <>
      {/* 3. Pass products to Navbar for search */}
      <Navbar allProducts={products} /> 
      <CartSystem />
      <main>
        {/* 4. Pass products, loading, and error to Outlet */}
        <Outlet context={{ products, loading, error }} /> 
      </main>
    </>
  );
}

// ... (ProtectedRoute and AdminRoute are unchanged) ...
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
}
function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}


export default function App() {
  // 5. Fetch all products here, in the main App
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://ironic-gym-backend.onrender.com/api/products");
        if (!res.ok) {
          throw new Error("Failed to fetch products from the database.");
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []); // Runs once when App loads


  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Route 1: Auth Page (No Navbar) */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Route 2: Admin Dashboard (No Main Navbar) */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          
          {/* Route 3: All Public and Private User Pages */}
          {/* 6. Pass product data to the layout */}
          <Route element={<MainLayout products={products} loading={loading} error={error} />}>
            
            {/* HomePage no longer fetches its own data */}
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={ <ProtectedRoute> <MyOrdersPage /> </ProtectedRoute> }
            />
            
            <Route path="/success" element={<PaymentSuccessPage />} />
            <Route path="/cancel" element={<PaymentCancelPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
