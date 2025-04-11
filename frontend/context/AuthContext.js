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
  console.log("AUTH PROVIDER NODE ENV", process.env.NODE_ENV)
  console.log("AUTH PROVIDER BACKEND URL", process.env.NEXT_PUBLIC_BACKEND_URL)
  const [user, setUser] = useState(null); // Holds the user profile from *your backend*
  const [loading, setLoading] = useState(true); // Indicates if initial session check is running
  const router = useRouter();

  /**
   * Checks the backend session status by calling the /api/user endpoint.
   * Updates the local user state based on the response.
   * @returns {Promise<object|null>} The user object from backend or null.
   */
  const checkSession = async () => {
    setLoading(true); // Indicate loading state during check
    try {
      const response = await apiClient.get("/api/user", {
        validateStatus: (status) => status < 500, // Don't throw for 401/403
      });

      console.log("Session check response:", response); // Debug log

      if (response.data?.success && response.data.user) {
        setUser(response.data.user);
        return response.data.user;
      }

      // Handle cases where success is false or user data missing
      console.warn("Session exists but no user data:", response.data);
      setUser(null);
      return null;
    } catch (error) {
      console.error("Session check failed:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
      });

      // Clear user state on any error
      setUser(null);

      // Specific handling for network vs server errors
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          console.log("Attempting to clear invalid session...");
          try {
            await apiClient.post("/api/logout");
            console.log("Session cleared successfully");
          } catch (logoutError) {
            console.error("Logout failed:", logoutError);
          }
        }
      } else if (error.request) {
        // Request was made but no response
        console.warn("No response from server - network issue?");
      } else {
        // Something else happened
        console.error("Configuration error:", error.message);
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  // Run checkSession once when the AuthProvider mounts to determine initial state
  useEffect(() => {
    console.log("AuthProvider mounted, checking initial session...");
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Logs the user in by sending the Firebase ID token to the backend.
   * The backend verifies the token, creates/finds the user, sets the session cookie,
   * and returns the user profile.
   * @param {string} idToken - The Firebase ID token obtained after Firebase login.
   * @returns {Promise<boolean>} True if login succeeded, false otherwise.
   */
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
    user, // The current user object (from backend) or null
    loading, // Boolean indicating if initial auth check is in progress
    login, // Function to log in via backend
    signOut, // Function to log out
    checkSession, // Expose if manual re-check is needed elsewhere
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
