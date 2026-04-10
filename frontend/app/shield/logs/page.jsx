"use client";
import { Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import LogViewer from "@/components/logs/LogViewer";
import SystemHealth from "@/components/health/SystemHealth";

export default function LogsPage() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-stone-400">Yükleniyor...</div>;

  if (!user?.roles?.includes("superadmin")) {
    return <div className="p-8 text-stone-500">Bu sayfaya erişim yetkiniz yok.</div>;
  }

  return (
    <Suspense fallback={<div className="p-8 text-stone-400">Yükleniyor...</div>}>
      <div className="px-6 pt-6">
        <SystemHealth />
      </div>
      <LogViewer />
    </Suspense>
  );
}
