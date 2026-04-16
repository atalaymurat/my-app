"use client";
import { Suspense } from "react";
import SuperadminGuard from "@/components/guards/SuperadminGuard";
import LogViewer from "@/components/logs/LogViewer";
import SystemHealth from "@/components/health/SystemHealth";

export default function LogsPage() {
  return (
    <SuperadminGuard>
      <Suspense fallback={<div className="p-8 text-stone-400">Yükleniyor...</div>}>
        <div className="px-6 pt-6">
          <SystemHealth />
        </div>
        <LogViewer />
      </Suspense>
    </SuperadminGuard>
  );
}
