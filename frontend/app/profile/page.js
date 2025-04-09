// app/profile/page.js - Updated for backend session management
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileInfo from "../../components/ProfileInfo";
import EmailVerification from "../../components/EmailVerification";
import LoadingSpinner from "../../components/Loading"; // Create this component if you haven't already
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const apiClient = axios.create({
    baseURL:
      process.env.NODE_ENV === "development"
        ? "http://localhost:5000"
        : process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await apiClient.get("/api/user-profile", {
          withCredentials: true, // Important for cookies
        });

        if (!response.status === 200) {
          // If not authenticated, redirect to auth page
          router.push("/auth");
          return;
        }

        const data = await response.data;
        console.log("DATA:::" , data)
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  const isVerified = user.email_verified || false;

  return (
    <div className="p-8">
      <div className="text-2xl font-semibold">Profile Page</div>
      <ProfileInfo user={user} />
      <EmailVerification user={user} isVerified={isVerified} />
    </div>
  );
}
