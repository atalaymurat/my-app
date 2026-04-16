"use client";
import SuperadminGuard from "@/components/guards/SuperadminGuard";
import MasterPage from "@/components/master/MasterPage";

export default function MasterIndex() {
  return (
    <SuperadminGuard>
      <div className="text-white">
        <MasterPage />
      </div>
    </SuperadminGuard>
  );
}
