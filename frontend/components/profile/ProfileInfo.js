// ProfileInfo.js
"use client";
import Image from "next/image";
import { localeDate } from "../../lib/helpers";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import EmailVerification from "./EmailVerification";

const ProfileInfo = () => {
  const { user, loading, checkSession, authChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      if (!authChecked) {
        const sessionUser = await checkSession();
        if (!sessionUser) {
          router.push("/auth");
        }
      }
    };
    verifySession();
  }, [authChecked, checkSession, router]);

  if (loading) {
    return <div className="p-8">Loading authentication status...</div>;
  }
  if (!user) {
    router.push("/auth");
    return null;
  }
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div className="text-gray-600">
          <div className="text-2xl font-bold">
            Welcome, {user?.name || user?.email}
          </div>
          <div className="text-sm">
            {user.isAdmin ? "Admin" : "User"} since {localeDate(user.createdAt)}
          </div>
        </div>

        {user?.profilePicture && (
          <Image
            src={user.profilePicture}
            width={100}
            height={100}
            alt={user.name}
            priority={true} // Critical for LCP elements
            className="rounded-xl justify-self-end"
            quality={75} // Optimal balance between quality and size
            unoptimized={false} // Let Next.js optimize the image
          />
        )}
      </div>
      <EmailVerification user={user} isVerified={user.emailVerified} />
    </>
  );
};

export default ProfileInfo;
