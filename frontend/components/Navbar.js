"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // Import the auth context
import Image from "next/image";

export default function Navbar() {
  const { user, loading, signOut, authChecked } = useAuth(); // Use the auth context
  const router = useRouter();

  // Add debugging to see what's happening

  // Show a minimal navbar during initial loading
  if (loading && !authChecked) {
    return (
      <nav className="bg-zinc-800 p-4 text-white flex justify-between items-center">
        <div className="text-3xl font-semibold">Postiva</div>
        <div className="w-6 h-6 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
      </nav>
    );
  }

  return (
    <nav className="bg-zinc-900 p-4 text-white flex justify-between items-center select-none">
      <div
        className="text-3xl font-semibold hover:cursor-pointer select-none"
        onClick={() => router.push("/")}
      >
        Postiva
      </div>

      {user && !loading ? (
        <div className="flex items-center space-x-4">
          <Link href="/profile">
            <div className="px-2 py-1">
              {(user?.profilePicture && (
                <Image
                  src={user.profilePicture}
                  width={40}
                  height={40}
                  alt={user.name}
                  priority={true} // Critical for LCP elements
                  className="rounded-full"
                  quality={75} // Optimal balance between quality and size
                  unoptimized={false} // Let Next.js optimize the image
                />
              )) ||
                user.name ||
                user.email ||
                "Profile"}
            </div>
          </Link>
          <button
            onClick={signOut} // Use the signOut function from context
            className="bg-red-500 px-2 py-2 rounded-sm hover:bg-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.9}
              stroke="currentColor"
              className="size-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            </svg>
          </button>
        </div>
      ) : (
        !loading && (
          <div className="flex space-x-4">
            <button
              onClick={() => router.push("/auth")}
              className="bg-blue-500 px-2 py-2 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        )
      )}
    </nav>
  );
}
