// app/contact/new/page.jsx
"use client";
import ContactForm from "@/components/contact/form";

export default function NewContact() {
  return (
    <div className="p-8 flex flex-col gap-4 overflow-hidden w-full">
      <div className="font-bold text-2xl text-white">Yeni Kişi</div>
      <ContactForm />
    </div>
  );
}
