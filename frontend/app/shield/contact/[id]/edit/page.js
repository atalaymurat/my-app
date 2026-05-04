"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/utils/axios";
import ContactForm from "@/components/contact/form";
import MessageBlock from "@/components/messageBlock";
import DebugJson from "@/components/DebugJson";

const EditContactPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [contact, setContact] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getContact = async () => {
      try {
        const { data } = await axios.get(`/api/contact/${id}`);
        setContact(data.record || data.contact);
      } catch (err) {
        setError({
          type: "error",
          text: "Kişi bilgisi yüklenemedi.",
          detail: err.response?.data?.message || "Lütfen tekrar deneyin.",
        });
      }
    };
    getContact();
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl px-3 py-4 sm:px-4">
        <MessageBlock message={error} duration={0} />
      </div>
    );
  }

  if (!contact) return <div className="p-4 text-sm text-stone-400">Kişi yükleniyor...</div>;

  return (
    <div className="flex w-full flex-col gap-4 py-4">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-3 sm:px-4">
        <div>
          <p className="text-xs font-semibold uppercase text-stone-500">Kişi</p>
          <h1 className="text-xl font-black text-stone-100">Kişi Düzenle</h1>
        </div>
        <button
          type="button"
          onClick={() => router.push("/shield/contact")}
          className="rounded-lg border border-stone-700 px-3 py-2 text-sm font-semibold text-stone-300 transition-colors hover:bg-stone-800"
        >
          Listeye Dön
        </button>
      </div>
      <ContactForm contact={contact} />
      <div className="mx-auto w-full max-w-4xl px-3 sm:px-4">
        <DebugJson data={contact} />
      </div>
    </div>
  );
};

export default EditContactPage;
