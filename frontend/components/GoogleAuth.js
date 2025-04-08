"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const GoogleAuth = ({ setAuthError }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setIsSubmitting(true);

    try {
      // Get authentication result from Firebase
      const result = await signInWithPopup(auth, provider);
      
      // Get the ID token
      const idToken = await result.user.getIdToken();
      
      // Use the login function from AuthContext
      const success = await login(idToken);
      
      if (success) {
        // If successful, redirect
        router.push("/");
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      console.error("Error with Google login:", err);
      setAuthError("Failed to login with Google.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button
        className="w-full text-center py-2 my-3 border border-gray-500 flex items-center justify-center rounded-lg hover:border-slate-400 hover:text-gray-900 hover:shadow transition duration-150 hover:cursor-pointer"
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              className="w-5 h-5 mr-2"
              alt="Google Icon"
            />
            <span className="">Logging in to Google...</span>
          </>
        )  : (
          <>
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              className="w-5 h-5 mr-2"
              alt="Google Icon"
            />
            <span className="">Login with Google</span>
          </>
        ) }
      </button>
    </div>
  );
};

export default GoogleAuth;
