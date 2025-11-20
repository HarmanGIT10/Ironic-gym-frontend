// src/components/AddProductForm.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AddProductForm({ onProductAdded }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    brand: "",
    quantity: "",
    category: "Tee", 
    isBestSeller: false,
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // These states are correct
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [cartImageUrl, setCartImageUrl] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 👇 --- THE FIX IS INSIDE THIS FUNCTION --- 👇
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("https://ironic-gym-backend.onrender.com/api/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData, // This has name, price, brand, etc.
          price: Math.round(formData.price * 100), 
          
          // --- ADD THESE TWO LINES ---
          // You were missing these, so the backend
          // was receiving 'undefined' for the images.
          mainImageUrl: mainImageUrl,
          cartImageUrl: cartImageUrl,
          // ---------------------------
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      setSuccess("Product added successfully!");
      setFormData({
         name: "", price: "", brand: "", quantity: "",
         category: "Tee", isBestSeller: false, description: "" 
      });
      
      // Also clear the image URL inputs
      setMainImageUrl("");
      setCartImageUrl("");
      
      if (onProductAdded) {
        onProductAdded(data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* These inputs are correct */}
      <div>
        <label>Main Image URL</label>
        <input
          type="text"
          value={mainImageUrl}
          onChange={(e) => setMainImageUrl(e.target.value)}
          placeholder="https://imgur.com/your-image.jpg"
          required
        />
      </div>
      <div>
        <label>Cart Image URL (Thumbnail)</label>
        <input
          type="text"
          value={cartImageUrl}
          onChange={(e) => setCartImageUrl(e.target.value)}
          placeholder="https://imgur.com/your-image-thumb.jpg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Enter product details..."
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      {/* ...rest of your form (name, price, brand, etc.) ... */}

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text" name="name" value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price ($)</label>
          <input
            type="number" name="price" value={formData.price}
            onChange={handleChange}
            placeholder="e.g., 29.99"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number" name="quantity" value={formData.quantity}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Brand</label>
        <input
          type="text" name="brand" value={formData.brand}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          name="category" value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="Tee">Tee</option>
          <option value="Hoodie">Hoodie</option>
          <option value="Shorts">Shorts</option>
          <option value="Accessory">Accessory</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox" name="isBestSeller" checked={formData.isBestSeller}
          onChange={handleChange}
          className="h-4 w-4 text-black border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">
          Mark as Best Seller
        </label>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <button
        type="submit"
        className="w-full btn-primary px-4 py-2 rounded-lg"
      >
        Add Product
      </button>
    </form>
  );
}
