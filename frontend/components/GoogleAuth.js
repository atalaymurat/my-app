"use client";

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setCookie } from "cookies-next"; // Cookie yönetimi için

const GoogleAuth = ({ setAuthError }) => {
  const router = useRouter(); // Initialize router
  const [isSubmitting, setIsSubmitting] = useState(false); // Track login submission state

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setIsSubmitting(true); // Set loading state to true when login starts

    try {
      await signInWithPopup(auth, provider);
      // Kullanıcı başarıyla giriş yaptıktan sonra token alalım
      const userToken = await auth.currentUser.getIdToken();

      // Token'ı cookie'ye kaydediyoruz
      setCookie("token", userToken, { maxAge: 60 * 60 * 24 * 7 }); // 1 hafta geçerlilik

      router.push("/"); // Redirect after successful Google login
    } catch (err) {
      console.error("Error with Google login:", err);
      setAuthError("Failed to login with Google.");
    } finally {
      setIsSubmitting(false); // Reset loading state after the login process
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
            <span className="">Loging in to Google...</span>
          </>
        ) : (
          <>
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              className="w-5 h-5 mr-2"
              alt="Google Icon"
            />
            <span className="">Login with Google</span>
          </>
        )}
      </button>
    </div>
  );
};

export default GoogleAuth;
