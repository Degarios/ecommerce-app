import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../../firebase"; // Import your Firebase authentication instance

// Create context for authentication
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap the application with authentication context
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase authentication state change listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup function
  }, []);

  // Function to log in user
  const login = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  // Function to sign out user
  const logout = () => {
    return auth.signOut();
  };

  // Function to sign up user
  const signup = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  const value = {
    currentUser,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
