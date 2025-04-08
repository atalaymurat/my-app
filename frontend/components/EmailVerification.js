// EmailVerification.js
"use client";
import { useState } from "react";
import { sendEmailVerification, reload } from "firebase/auth";

const EmailVerification = ({ user, isVerified }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleSendVerification = async () => {
    if (user) {
      try {
        await sendEmailVerification(user);
        setEmailSent(true);
        setError("");
      } catch (error) {
        console.error("Error sending verification email:", error);
        setError("Failed to send verification email. Please try again later.");
      }
    }
  };

  const handleReloadUser = async () => {
    if (user) {
      try {
        await reload(user);
        // Assuming you have a way to update isVerified here
      } catch (err) {
        console.error("Error refreshing user data:", err);
        setError("Something went wrong...");
      }
    }
  };

  return (
    <>
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
    </>
  );
};

export default EmailVerification;
