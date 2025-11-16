import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import './ProfilePage.css'; 

export default function ProfilePage() {
  const { user, token } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null); 
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Fetch user data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch profile");
        }

        const profile = await res.json();
        const profileData = {
          name: profile.name || "",
          phone: profile.phone || "",
          addressLine1: profile.addressLine1 || "",
          addressLine2: profile.addressLine2 || "",
          city: profile.city || "",
          postalCode: profile.postalCode || "",
          country: profile.country || "",
        };
        setFormData(profileData);
        setOriginalData(profileData); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setLoading(false); 
    }
  }, [token]);

  // 2. Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, ''); 
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 3. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update profile");
      }
      
      setMessage("Profile updated successfully!");
      setOriginalData(formData); 
      setIsEditing(false); 
    } catch (err) {
      setError(err.message);
    }
  };

  // 4. Handle Cancel button
  const handleCancel = () => {
    setFormData(originalData); 
    setIsEditing(false); 
    setError("");
    setMessage("");
  };

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-lg text-gray-700">Loading your profile...</p>
      </div>
    );
  }
  
  // This is the base style for all inputs
  const baseInputStyle = "mt-1 block w-full border rounded-md shadow-sm p-3 transition-all duration-300";

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-lg text-gray-600 mb-8">Manage your account and shipping information.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN (Profile Card) --- */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-xl p-6 text-center border">
              <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold">{getInitials(formData.name)}</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{formData.name || "User Name"}</h2>
              
              <div className="border-t my-6"></div>
              <div className="space-y-4 text-left">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span className="text-sm text-gray-700">{user?.email}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span className="text-sm text-gray-700">{formData.phone || "No phone added"}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-sm text-gray-700">{formData.city || "No location added"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN (Form) --- */}
          <div className="lg:col-span-2">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              <div className="bg-white shadow-lg rounded-xl p-8 border">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text" name="name" id="name"
                      value={formData.name}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={`${baseInputStyle} ${
                        isEditing 
                        ? 'border-gray-300 ring-2 ring-black' // Editing style
                        : 'bg-gray-50 border-gray-100 shadow-none' // Read-only style
                      }`}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel" name="phone" id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={`${baseInputStyle} ${
                        isEditing 
                        ? 'border-gray-300 ring-2 ring-black' 
                        : 'bg-gray-50 border-gray-100 shadow-none'
                      }`}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white shadow-lg rounded-xl p-8 border">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Shipping Address</h3>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
                    <input
                      type="text" name="addressLine1" id="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={`${baseInputStyle} ${
                        isEditing 
                        ? 'border-gray-300 ring-2 ring-black' 
                        : 'bg-gray-50 border-gray-100 shadow-none'
                      }`}
                    />
                  </div>
                  <div>
                    <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
                    <input
                      type="text" name="addressLine2" id="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={`${baseInputStyle} ${
                        isEditing 
                        ? 'border-gray-300 ring-2 ring-black' 
                        : 'bg-gray-50 border-gray-100 shadow-none'
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text" name="city" id="city"
                        value={formData.city}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={`${baseInputStyle} ${
                          isEditing 
                          ? 'border-gray-300 ring-2 ring-black' 
                          : 'bg-gray-50 border-gray-100 shadow-none'
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                      <input
                        type="text" name="postalCode" id="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={`${baseInputStyle} ${
                          isEditing 
                          ? 'border-gray-300 ring-2 ring-black' 
                          : 'bg-gray-50 border-gray-100 shadow-none'
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                      <input
                        type="text" name="country" id="country"
                        value={formData.country}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={`${baseInputStyle} ${
                          isEditing 
                          ? 'border-gray-300 ring-2 ring-black' 
                          : 'bg-gray-50 border-gray-100 shadow-none'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* --- MESSAGES & BUTTONS --- */}
              <div className="flex items-center justify-between">
                <div className="min-h-[1.5em]">
                  {message && <p className="text-green-600">{message}</p>}
                  {error && <p className="text-red-600">{error}</p>}
                </div>

                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="btn-primary btn-shiny px-8 py-3 rounded-full text-sm sm:text-base"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn-secondary px-6 py-3 rounded-full text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary btn-shiny px-8 py-3 rounded-full text-sm sm:text-base"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}