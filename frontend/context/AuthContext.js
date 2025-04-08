// context/AuthContext.js - Updated with better loading state handling

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { useRouter } from "next/navigation";

// Create context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  // Check session status on mount
  useEffect(() => {
    let isMounted = true;
    
    const checkSession = async () => {
      try {
        console.log("Checking session with backend...");
        // Call your backend API to check session status
        const response = await fetch('http://localhost:5000/api/user-profile', {
          credentials: 'include',
        }) ;

        // Only update state if component is still mounted
        if (!isMounted) return;

        if (response.ok) {
          const data = await response.json();
          console.log("User data received:", data.user);
          setUser(data.user);
        } else {
          console.log("No valid session found");
          setUser(null);
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) {
          setLoading(false);
          setAuthChecked(true);
        }
      }
    };

    // Listen to Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Firebase auth state changed:", firebaseUser ? "logged in" : "logged out");
      
      if (!firebaseUser) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
          setAuthChecked(true);
        }
      } else {
        // If Firebase says we're logged in, verify with backend
        checkSession();
      }
    });

    // Initial session check
    checkSession();

    // Cleanup function
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Login function that handles the slow response
  const login = async (idToken) => {
    setLoading(true);
    try {
      // Send the ID token to your backend to create a session cookie
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ idToken }) ,
      });
      
      if (!response.ok) {
        throw new Error('Failed to create session');
      }
      
      // Get user profile after successful login
      const profileResponse = await fetch('http://localhost:5000/api/user-profile', {
        credentials: 'include',
      }) ;
      
      if (profileResponse.ok) {
        const data = await profileResponse.json();
        setUser(data.user);
      }
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  // Logout function
  const signOut = async () => {
    setLoading(true);
    try {
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      // Call backend to clear session cookie
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
      }) ;
      
      setUser(null);
      router.push('/auth');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    authChecked,
    login,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
