// app/profile/page.js
"use client";
import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { sendEmailVerification, reload } from "firebase/auth";
import Image from "next/image";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

export default function ProfilePage() {
  const { user, loading } = useProtectedRoute();
  const [emailSent, setEmailSent] = useState(false);
  const [isVerified, setIsVerified] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setIsVerified(user.emailVerified);
    }
  }, [user]);

  const handleSendVerification = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setEmailSent(true);
        setError("");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      setError("Failed to send verification email. Please try again later.");
    }
  };

  const handleReloadUser = async () => {
    try {
      if (auth.currentUser) {
        await reload(auth.currentUser);
        setIsVerified(auth.currentUser.emailVerified);
        setError("");
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
      setError("Something went wrong...", err);
    }
  };

  if (loading || !user) return null;
  if (loading) return <Loading />;

  return (
    <div className="p-8">
      <div className="text-2xl font-semibold">Profile Page</div>
      <div className="text-gray-600">Welcome, {user?.displayName || user?.email}</div>

      {user?.photoURL && (
        <Image
          src={user?.photoURL}
          width={100}
          height={100}
          alt={user?.displayName}
        />
      )}

      {!isVerified && (
        <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-yellow-800 font-medium">
            Your email is not verified.
          </p>
          <button
            onClick={handleSendVerification}
            disabled={emailSent}
            className={`mt-2 px-4 py-2 text-white rounded ${
              emailSent
                ? "bg-red-500"
                : "bg-blue-600 hover:cursor-pointer hover:bg-blue-700"
            }`}
          >
            {emailSent ? "Please Check Your Email" : "Send Verification Email"}
          </button>
          {emailSent && (
            <button
              onClick={handleReloadUser}
              className="ml-4 mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 hover:cursor-pointer"
            >
              Check After Confirm Email
            </button>
          )}
          {error && <p className="text-red-600 mt-2 font-medium">{error}</p>}
        </div>
      )}

      {isVerified && (
        <div className="mt-4 text-green-700 font-semibold">
          ✅ Email is verified
        </div>
      )}
    </div>
  );
}
