// app/profile/page.js
"use client";
import { useAuth } from "../../context/AuthContext";
import ProfileInfo from "../../components/ProfileInfo";
import EmailVerification from "../../components/EmailVerification";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
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
    <div className="p-8 flex flex-col gap-4">

      <ProfileInfo user={user} />
      <EmailVerification 
        user={user} 
        isVerified={user.emailVerified} 
      />
    </div>
  );
}