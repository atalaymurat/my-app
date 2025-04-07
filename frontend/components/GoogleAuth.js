"use client";

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const GoogleAuth = ({setAuthError}) => {
  const router = useRouter(); // Initialize router

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      // İlk önce çıkış yapalım
      await signOut(auth);
      await signInWithPopup(auth, provider);
      router.push("/"); // Redirect after successful Google login
    } catch (err) {
      console.error("Error with Google login:", err);
      setAuthError("Failed to login with Google.");
    }
  };

  return (
    <div>
      <button
        className="w-full text-center py-2 my-3 border border-gray-500 flex items-center justify-center rounded-lg hover:border-slate-400 hover:text-gray-900 hover:shadow transition duration-150 hover:cursor-pointer"
        onClick={handleGoogleLogin}
      >
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          className="w-5 h-5 mr-2"
          alt="Google Icon"
        />
        <span className="">Login with Google</span>
      </button>
    </div>
  );
};

export default GoogleAuth;
