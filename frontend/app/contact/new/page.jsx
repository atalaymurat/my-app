// app/contact/new/page.jsx
"use client";
import { useAuth } from "../../../context/AuthContext";
import { useEffect } from "react";
import NewForm from "../../../components/contact/form";
import { useRouter } from "next/navigation";

export default function NewContact() {
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
      <div className="overflow-hidden w-full">
        <div className="text-2xl font-semibold py-4 px-2 text-center">
          Kişi Kaydı Oluşturma Formu
        </div>
        <NewForm />
      </div>
    </>
  );
}
