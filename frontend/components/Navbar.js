"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // Import the auth context
import Image from "next/image";

export default function Navbar() {
  const { user, loading, signOut, authChecked } = useAuth(); // Use the auth context
  const router = useRouter();

  // Add debugging to see what's happening
  console.log("Navbar user state:", user, loading, authChecked);

  // Show a minimal navbar during initial loading
  if (loading && !authChecked) {
    return (
      <nav className="bg-black p-4 text-white flex justify-between items-center">
        <div className="text-xl font-semibold">Postiva</div>
        <div className="w-6 h-6 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
      </nav>
    );
  }

  return (
    <nav className="bg-black p-4 text-white flex justify-between items-center select-none">
      <div
        className="text-xl font-semibold hover:cursor-pointer select-none"
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
            className="bg-red-500 px-2 py-2 rounded-md hover:bg-red-600"
          >
            Logout
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
