// src/components/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase'; 
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// AuthProvider Component
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle async auth state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only after auth state is determined */}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
