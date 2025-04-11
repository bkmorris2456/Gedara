// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToAuthChanges, getCurrentUser } from '../firebase';

// Create context
const AuthContext = createContext();

// Context provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Get current authenticated user
  const getUser = () => {
    return getCurrentUser();
    }
    // All authentication-related data & functions to share across the app
  const contextValue = {
        user,
        loading,
        getUser,
        isLoggedIn: !!user,
    };

    return (
        <AuthContext.Provider value={contextValue}>
        {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};