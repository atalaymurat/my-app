"use client";
import { Suspense } from "react";
import CompanyPage from "@/components/company/CompanyPage";

export default function CompanyIndex() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CompanyPage />
    </Suspense>
  );
}
