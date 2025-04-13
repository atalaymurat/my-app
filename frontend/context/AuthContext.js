"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/lib/firebase"; // Still needed for signOut and getting idToken
import { signOut as firebaseSignOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import axios from "axios";

// Configure axios client
// Ensure baseURL points to your backend correctly in different environments
const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BACKEND_URL // Make sure this env var is set in production
      : "http://localhost:5000", // Your backend URL for development
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Create the context
const AuthContext = createContext();

// Create the provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  const checkSession = async () => {
    if (authChecked) return user;
    
    setLoading(true);
    try {
      const response = await apiClient.get("/api/user", {
        validateStatus: (status) => status < 500,
      });

      // Log response for debugging
      console.log("Session check response:", {
        status: response.status,
        data: response.data,
      });

      // Handle successful authentication
      if (response.status === 200 && response.data?.success && response.data.user) {
        const userData = response.data.user;
        setUser(userData);
        setAuthChecked(true);
        return userData;
      }

      // Handle unauthorized access
      if (response.status === 401 || response.status === 403) {
        console.log("Session invalid or expired");
        await handleInvalidSession();
        setAuthChecked(true);
        return null;
      }

      // Handle other error cases
      if (response.status >= 400) {
        console.error("Session check failed with status:", response.status);
        setUser(null);
        setAuthChecked(true);
        return null;
      }

      // Default case - no user data
      setUser(null);
      setAuthChecked(true);
      return null;
    } catch (error) {
      console.error("Session check error:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
      });

      // Handle network errors
      if (!error.response) {
        console.warn("Network error during session check");
        return user;
      }

      // Handle server errors
      if (error.response.status >= 500) {
        console.error("Server error during session check");
        return user;
      }

      // Handle other errors
      setUser(null);
      setAuthChecked(true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to handle invalid sessions
  const handleInvalidSession = async () => {
    try {
      await apiClient.post("/api/logout");
      setUser(null);
      console.log("Session cleared successfully");
    } catch (logoutError) {
      console.error("Failed to clear session:", logoutError);
    }
  };

  // Run checkSession once when the AuthProvider mounts to determine initial state
  useEffect(() => {
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

  const login = async (idToken) => {
    if (!idToken) {
      console.error("Login function called without an idToken.");
      return false;
    }
    setLoading(true);
    try {
      // Send the Firebase ID token to your backend's login endpoint
      const response = await apiClient.post("/api/login", { idToken });

      // Check if backend confirms success and provides user data
      if (response.data?.success && response.data.user) {
        setUser(response.data.user); // Set user state with data from backend
        setLoading(false);
        return true; // Indicate success
      } else {
        // Handle cases where backend indicates failure despite a 2xx response
        throw new Error(response.data?.error || "Backend login failed.");
      }
    } catch (error) {
      console.error(
        "Frontend Login error:",
        error.response?.data || error.message
      );
      setUser(null); // Clear user state on login failure
      // Optional: Consider signing out from Firebase client-side if backend login fails
      // await firebaseSignOut(auth);
      setLoading(false);
      return false; // Indicate failure
    }
  };

  /**
   * Logs the user out.
   * Signs out from Firebase client-side.
   * Calls the backend logout endpoint to clear the session cookie.
   * Clears the local user state.
   */
  const signOut = async () => {
    setLoading(true);
    try {
      // 1. Sign out from Firebase on the client
      await firebaseSignOut(auth);
      // 2. Call your backend's logout endpoint to clear the session cookie
      await apiClient.post("/api/logout");
      // 3. Clear the user state locally
      setUser(null);
      // 4. Redirect to login or home page
      router.push("/auth"); // Adjust redirect path as needed
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      // Attempt to clear local state even if backend/firebase logout fails
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // The value provided to consuming components
  const value = {
    user,
    loading,
    login,
    signOut,
    checkSession,
    authChecked,
  };

  // Provide the context value to children components
  // Show nothing or a loader while the initial check is loading
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Check for undefined instead of !context
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
