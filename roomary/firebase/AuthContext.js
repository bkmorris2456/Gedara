import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from '../config'; // Import Firebase app instance
const auth = getAuth(app); // Get the authentication instance

// Create a context to provide auth data across the app
export const AuthContext = createContext();

// Context provider component to wrap around the app and manage auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores the current authenticated user
  const [authLoading, setAuthLoading] = useState(true); // Controls loading state while auth initializes

  useEffect(() => {
    // Subscribe to Firebase auth state changes (runs once on mount)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user if authenticated
      setAuthLoading(false); // Mark initialization complete
    });

    // Cleanup subscription when component unmounts
    return unsubscribe;
  }, []);

  return (
    // Provide user and setUser to the entire app via context
    <AuthContext.Provider value={{ user, setUser }}>
      {/* Prevent rendering children until auth state is known */}
      {!authLoading && children}
    </AuthContext.Provider>
  );
};
