"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, loading } = useAuth();

  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth"); // Redirect to login/signup page after logout
  };


  return (
    <nav className="bg-black p-4 text-white flex justify-between items-center">
      <div
        className="text-xl font-semibold hover:cursor-pointer"
        onClick={() => router.push("/")}
      >
        Postiva
      </div>

      {user && !loading ? (
        <div className="flex items-center space-x-4">
          <Link href="/profile">
            <div className="px-2 py-1">
              {user.displayName || user.email || "Profile"}
            </div>
          </Link>
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
