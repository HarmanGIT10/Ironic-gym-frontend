// src/components/AdminProductList.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminProductList({ refreshKey }) {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newQuantity, setNewQuantity] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://ironic-gym-backend-11.vercel.app/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [refreshKey]); // Re-fetch when refreshKey changes

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      const res = await fetch(`https://ironic-gym-backend-11.vercel.app/api/products/${productId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  const handleUpdateStock = async (product) => {
    try {
      const res = await fetch(`https://ironic-gym-backend-11.vercel.app/api/products/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...product,
          quantity: newQuantity,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update stock");
      }
      const updatedProduct = await res.json();
      setProducts(products.map((p) => (p._id === product._id ? updatedProduct : p)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  const startEditing = (product) => {
    setEditingId(product._id);
    setNewQuantity(product.quantity);
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      {products.length === 0 ? (
        <p>No products found. Try adding one!</p>
      ) : (
        products.map((product) => (
          <div key={product._id} className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <img

                src={product.cartImageUrl || product.mainImageUrl || 'https://via.placeholder.com/80'}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-md border bg-gray-200"
              />
              <div>
                <p className="font-bold">{product.name}</p>
                <p className="text-sm text-gray-600">
                  {product.brand} | Category: {product.category}
                </p>
                <p className="text-sm text-gray-600">
                  Stock: <span className="font-medium">{product.quantity}</span>
                </p>
              </div>
              <div className="flex space-x-2">
                {editingId === product._id ? (
                  <button
                    onClick={() => handleUpdateStock(product)}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(product)}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                  >
                    Update Stock
                  </button>
                )}

                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-sm bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            {editingId === product._id && (
              <div className="mt-4 flex items-center space-x-2">
                <label className="text-sm font-medium">New Quantity:</label>
                <input
                  type="number"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className="border border-gray-300 rounded-md shadow-sm p-1 w-20"
                />
                <button
                  onClick={() => setEditingId(null)}
                  className="text-sm text-gray-600"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}