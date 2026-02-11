// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
 // src/context/AuthContext.jsx
useEffect(() => {
  try {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    // ✅ Check for undefined/null strings
    if (storedUser && storedUser !== 'undefined' && storedToken && storedToken !== 'undefined') {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  } catch (error) {
    console.error('Error loading auth data:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
  setLoading(false);
}, []);

  // context/AuthContext.jsx
const login = (userData, userToken) => {
  console.log('=== AuthContext Login Called ===');
  console.log('User:', userData);
  console.log('Token:', userToken);
  
  setUser(userData);
  setIsLoggedIn(true);
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', userToken);
  
  console.log('Token saved:', localStorage.getItem('token'));
};

  // Signup function
  const signup = (userData, token) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};