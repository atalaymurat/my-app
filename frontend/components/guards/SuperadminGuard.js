"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuperadminGuard({ children }) {
  const { user, loading, authChecked } = useAuth();
  const router = useRouter();
  const isSuperAdmin = user?.roles?.includes("superadmin");

  useEffect(() => {
    if (!loading && authChecked && !isSuperAdmin) {
      router.replace("/shield/profile");
    }
  }, [loading, authChecked, isSuperAdmin, router]);

  if (loading || !authChecked) {
    return <div className="text-stone-400 py-12 text-center text-sm">Kontrol ediliyor...</div>;
  }

  if (!isSuperAdmin) {
    return null;
  }

  return <>{children}</>;
}
