"use client";
import { Suspense } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CompanyPage from "@/components/company/CompanyPage";

export default function CompanyIndex() {
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

  if (loading || !authChecked) {
    return <div>Loading....</div>;
  }
  if (!user) {
    router.push("/auth");
    return null;
  }
  if (user) {
    return (
      <Suspense fallback={<div className="p-8">Loading...</div>}>
        <CompanyPage />
      </Suspense>
    );
  }
}
