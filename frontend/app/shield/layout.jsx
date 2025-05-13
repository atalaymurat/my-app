"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ShieldLayout({ children }) {
  const { user, loading, checkSession, authChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      // Eğer auth kontrolü yapılmadıysa, tetikle
      if (!authChecked) {
        const sessionUser = await checkSession();
        if (!sessionUser) {
          router.push("/auth"); // Giriş sayfasına yönlendir
        }
      }
    };
    verify();
  }, [authChecked, checkSession, router]);

  if (loading || !authChecked) {
    return <div className="p-8">Kontrol ediliyor...</div>; // Yüklenme ekranı
  }

  if (!user) {
    return null; // Henüz yönlendirme yapılmadan önce bir şey gösterme
  }

  return <>{children}</>;
}
