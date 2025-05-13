"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading, checkSession, authChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      if (!authChecked) {
        const sessionUser = await checkSession();
        if (!sessionUser) {
          router.push("/auth");
        }
      }
    };
    verify();
  }, [authChecked, checkSession, router]);

  if (loading || !authChecked) return <div>Loading...</div>;
  if (!user) return null;

  return children;
}