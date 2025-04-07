// app/auth/page.jsx
"use client";

import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import GoogleAuth from "../../components/GoogleAuth";
import Link from "next/link";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState(""); // State to store error message
  const router = useRouter(); // Initialize router


  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleAuth = async (values) => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, values.email, values.password);
      } else {
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
      }

      // Redirect to homepage ("/") after successful login/signup
      router.push("/");
    } catch (err) {
      console.error("Error signing in:", err);

      // Handle Firebase errors
      switch (err.code) {
        case "auth/user-not-found":
          setAuthError("No user found with this email.");
          break;
        case "auth/wrong-password":
          setAuthError("Incorrect password.");
          break;
        case "auth/email-already-in-use":
          setAuthError("This email is already in use.");
          break;
        case "auth/invalid-email":
          setAuthError("The email format is invalid.");
          break;
        default:
          setAuthError("An unexpected error occurred. Please try again.");
          break;
      }
    }
  };

  return (
    <div className="w-full flex items-center justify-center bg-gray-100 p-2 rounded-2xl">
      <div className="bg-white p-4 rounded-2xl shadow-xl w-md lg:w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        {/* Display error message if there is one */}
        {authError && (
          <div className="text-red-500 text-center mb-4">{authError}</div>
        )}

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleAuth}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-gray-400 rounded-md"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-gray-400 rounded-md"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white py-2 rounded-md hover:cursor-pointer ${
                  isSubmitting ? "bg-red-500" : "bg-blue-600"
                }`}
              >
                {isSubmitting ? "Submitting..." : isLogin ? "Login" : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Google login button */}
        <GoogleAuth setAuthError={setAuthError} />

        <p className="text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:cursor-pointer font-semibold"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
        <div className="text-sm flex flex-row space-x-2 w-full justify-center">
          <div className="text-gray-500">Do you forget your password?</div>
          <Link
            href="/auth/reset-password"
            className="text-blue-600 font-semibold"
          >
            Reset Password
          </Link>
        </div>
      </div>
    </div>
  );
}
