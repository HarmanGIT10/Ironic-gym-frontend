// AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) || null
  );
  // --- ADD THIS LINE ---
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);

  const login = (userData, userToken) => { // <-- Now accepts a token
    setUser(userData);
    setToken(userToken); // <-- Save token in state
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", userToken); // <-- Save token in session
  };

  const logout = () => {
    setUser(null);
    setToken(null); // <-- Clear token from state
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token"); // <-- Clear token from session
  };

  return (
    // --- ADD TOKEN HERE ---
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);