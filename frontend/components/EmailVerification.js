"use client";
import { useState } from "react";
import { sendEmailVerification, reload } from "firebase/auth";

const EmailVerification = ({ user, isVerified }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getErrorMessage = (error) => {
    switch (error.code) {
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      case "auth/user-not-found":
        return "User not found. Please sign in again.";
      default:
        return "Failed to send verification email. Please try again.";
    }
  };

  const handleSendVerification = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    
    try {
      await sendEmailVerification(user, {
        handleCodeInApp: true,
        url: `${window.location.origin}/auth?verified=true`,
      });
      setEmailSent(true);
      setSuccessMessage("Verification email sent! Check your inbox.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReloadUser = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError("");
    try {
      await reload(user);
      // Small delay to ensure Firebase updates
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage("Status updated successfully!");
    } catch (err) {
      console.error("Error refreshing user data:", err);
      setError("Failed to refresh status. Please reload the page.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isVerified && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium mb-3">
            Your email address is not verified.
          </p>
          
          <button
            onClick={handleSendVerification}
            disabled={emailSent || isLoading}
            className={`px-4 py-2 text-white rounded-md transition ${
              emailSent
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700" +
                  (isLoading ? " opacity-70 cursor-wait" : " cursor-pointer")
            }`}
          >
            {isLoading ? "Sending..." : 
             emailSent ? "Email Sent" : "Send Verification Email"}
          </button>
          
          {emailSent && (
            <>
              <button
                onClick={handleReloadUser}
                disabled={isLoading}
                className="ml-3 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition disabled:opacity-70 disabled:cursor-wait"
              >
                {isLoading ? "Checking..." : "I've Verified My Email"}
              </button>
              <p className="mt-2 text-sm text-gray-600">
                Didn't receive the email? Check your spam folder.
              </p>
            </>
          )}
          
          {error && (
            <p className="mt-2 text-red-600 font-medium text-sm">{error}</p>
          )}
          {successMessage && (
            <p className="mt-2 text-green-600 font-medium text-sm">
              {successMessage}
            </p>
          )}
        </div>
      )}

      {isVerified && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-medium flex items-center">
            <span className="mr-2">✓</span> Email successfully verified
          </p>
        </div>
      )}
    </>
  );
};

export default EmailVerification;