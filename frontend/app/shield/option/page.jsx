"use client";
import SuperadminGuard from "@/components/guards/SuperadminGuard";
import OptionPage from "@/components/option/OptionPage";

export default function OptionIndex() {
  return (
    <SuperadminGuard>
      <div className="text-white">
        <OptionPage />
      </div>
    </SuperadminGuard>
  );
}

