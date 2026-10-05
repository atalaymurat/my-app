"use client";
import { Suspense } from "react";
import UsersPage from "@/components/users/UsersPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Sayfa yükleniyor...</div>}>
      <UsersPage />
    </Suspense>
  );
}
