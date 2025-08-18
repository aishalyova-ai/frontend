import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Decode JWT and extract user info
  const decodeToken = useCallback((token) => {
    try {
      const decoded = jwtDecode(token);

      // Debug: Log decoded content
      console.log("Decoded token:", decoded);

      // Check expiration: exp is seconds → Date.now() is ms
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.warn("Token expired");
        return null;
      }

      return {
        id: decoded.userId || decoded.id,   // ✅ FIXED: prioritize userId
        email: decoded.sub,
        roles: decoded.roles || [],
      };
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  }, []);

  // Login and save token
  const login = useCallback(async (newToken) => {
    try {
      localStorage.setItem('jwtToken', newToken);
      const decodedUser = decodeToken(newToken);

      if (decodedUser) {
        setUser(decodedUser);
        setToken(newToken);
      } else {
        console.error("Decoded user invalid → clearing token");
        localStorage.removeItem('jwtToken');
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.error("Login error:", err);
      localStorage.removeItem('jwtToken');
      setUser(null);
      setToken(null);
    }
  }, [decodeToken]);

  // Logout: clear everything
  const logout = useCallback(() => {
    localStorage.removeItem('jwtToken');
    setUser(null);
    setToken(null);
  }, []);

  // Load from localStorage on first load
  useEffect(() => {
    const stored = localStorage.getItem('jwtToken');
    if (stored) {
      const decodedUser = decodeToken(stored);
      if (decodedUser) {
        setUser(decodedUser);
        setToken(stored);
      } else {
        localStorage.removeItem('jwtToken');
      }
    }
    setAuthLoading(false);
  }, [decodeToken]);

  return (
    <AuthContext.Provider value={{ user, token, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
