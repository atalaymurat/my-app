"use client";
import NewForm from "@/components/company/NewForm";

export default function NewCompany() {
  return (
    <div className="p-8 flex flex-col gap-4 overflow-hidden w-full">
      <div className="font-bold text-2xl text-white">
        Firma veya Şahıs Şirket Kaydı Oluştur...
      </div>
      <NewForm />
    </div>
  );
}
