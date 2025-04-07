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
    <div className="flex items-center justify-center bg-gray-100 p-4 rounded-2xl w-full">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xl space-y-4">
        <h1 className="text-2xl font-bold text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        {/* Display error message if there is one */}
        {authError && <div className="text-red-500 text-center mb-4">{authError}</div>}

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
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 hover:cursor-pointer"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 underline hover:cursor-pointer"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
