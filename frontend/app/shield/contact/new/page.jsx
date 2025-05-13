// app/contact/new/page.jsx
"use client";
import NewForm from "@/components/contact/form";

export default function NewContact() {
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
