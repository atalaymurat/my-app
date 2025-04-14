// app/auth/reset-password/page.jsx
"use client";

import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [resetStatus, setResetStatus] = useState(""); // State to track status
  const [authError, setAuthError] = useState(""); // Error state
  const router = useRouter(); // Initialize router

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleResetPassword = async (values) => {
    try {
      await sendPasswordResetEmail(auth, values.email);
      setResetStatus("Password reset email sent successfully.");
      setAuthError("");
      setTimeout(() => {
        router.push("/auth");
      }, 4000);
    } catch (err) {
      console.error("Error sending reset password email:", err);
      setAuthError("Failed to send reset email. Please try again.");
      setResetStatus("");
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4 rounded-2xl w-full">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:w-xl space-y-4">
        <h1 className="text-2xl font-bold text-center">Reset Your Password</h1>

        {/* Show success or error messages */}
        {resetStatus && (
          <div className="text-green-800 text-center mb-4 font-semibold text-lg">
            {resetStatus}
          </div>
        )}
        {authError && (
          <div className="text-red-500 text-center mb-4">{authError}</div>
        )}

        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={handleResetPassword}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-400 rounded-md"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={
                  isSubmitting
                    ? "w-full bg-red-500 text-whit py-2 rounded-md"
                    : "w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                }
              >
                {isSubmitting ? "Sending..." : "Send Reset Email"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm text-gray-600">
          Remember your password?{" "}
          <button
            onClick={() => router.push("/auth")}
            className="text-blue-600 underline hover:cursor-pointer"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
