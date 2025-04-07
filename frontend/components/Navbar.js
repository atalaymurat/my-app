"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Check user authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/auth"); // Redirect to login/signup page after logout
  };

  return (
    <nav className="bg-red-400 p-4 text-white flex justify-between items-center">
      <div className="text-xl font-semibold hover:cursor-pointer" onClick={() => router.push("/")}>
        Postiva
      </div>

      {user ? (
        <div className="flex items-center space-x-4">
          <span>Welcome, {user.displayName || user.email || ""}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-2 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex space-x-4">
          <button
            onClick={() => router.push("/auth")}
            className="bg-blue-500 px-2 py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
}
