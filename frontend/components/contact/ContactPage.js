"use client";
import React from "react";
import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/utils/axios";
import ContactTable from "@/components/contact/contactTable";
import Pagination from "@/components/Pagination";
import PageLinks from "../templates/PageLinks";
import MessageBlock from "@/components/messageBlock";
import GoogleCsvImportModal from "@/components/contact/GoogleCsvImportModal";
import KommoCsvImportModal from "@/components/contact/KommoCsvImportModal";
import DebugJson from "@/components/DebugJson";
import { useAuth } from "@/context/AuthContext";

const ContactPage = () => {
  const [contacts, setContacts] = React.useState(null);
  const [totalPages, setTotalPages] = React.useState(1);
  const [message, setMessage] = React.useState(null);
  const [googleImportOpen, setGoogleImportOpen] = React.useState(false);
  const [kommoImportOpen, setKommoImportOpen] = React.useState(false);
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const router = useRouter();
  const isSuperAdmin = user?.roles?.includes("superadmin");

  const getContacts = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `/api/contact?page=${currentPage}&limit=10`
      );
      setContacts(data.contacts || data.records || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Kişiler yüklenemedi.",
        detail: error.response?.data?.message || "Lütfen tekrar deneyin.",
      });
    }
  }, [currentPage]);

  const handleDelete = async (co) => {
    const displayName = co.displayName || "Bu kişi";
    if (!confirm(`"${displayName}" silinsin mi?`)) return;
    try {
      await axios.delete(`/api/contact/${co._id}`);
      setContacts((prev) => prev.filter((c) => c._id !== co._id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (co) => {
    router.push(`/shield/contact/${co._id}/edit`);
  };

  useEffect(() => {
    getContacts();
  }, [getContacts]);


  if (!contacts) {
    return <div className="p-8 h-full">Loading data from server...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="flex-1">
        <PageLinks
          links={[{ href: "/shield/contact/new", label: "Yeni Kişi Ekle" }]}
        />
        <div className="mx-2 mb-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setGoogleImportOpen(true)}
            className="rounded-lg border border-amber-700 bg-stone-900 px-4 py-2 text-sm font-bold text-amber-300 hover:bg-stone-800"
          >
            Google CSV Import
          </button>
          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => setKommoImportOpen(true)}
              className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-sm font-bold text-stone-200 hover:bg-stone-800"
            >
              Kommo CSV Import
            </button>
          )}
        </div>
        <div className="mx-2">
          <MessageBlock message={message} />
        </div>
        <ContactTable contacts={contacts} onEdit={handleEdit} onDelete={handleDelete} />
        <DebugJson data={{ contacts, totalPages, currentPage }} />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          router.push(`/shield/contact?page=${page}`);
        }}
      />
      <GoogleCsvImportModal
        open={googleImportOpen}
        onClose={() => setGoogleImportOpen(false)}
        onImported={async (result) => {
          const transferred = (result.created || 0) + (result.updated || 0);
          setMessage({
            type: result.failed ? "warning" : "success",
            text: `${transferred} kişi aktarıldı.`,
            detail: `Oluşturulan: ${result.created || 0}, Güncellenen: ${result.updated || 0}, Atlanan: ${result.skipped || 0}, Hatalı: ${result.failed || 0}`,
          });
          await getContacts();
        }}
      />
      {isSuperAdmin && (
        <KommoCsvImportModal
          open={kommoImportOpen}
          onClose={() => setKommoImportOpen(false)}
          onImported={async (result) => {
            const transferred = (result.created || 0) + (result.updated || 0);
            setMessage({
              type: result.failed ? "warning" : "success",
              text: `${transferred} kişi aktarıldı.`,
              detail: `Oluşturulan: ${result.created || 0}, Güncellenen: ${result.updated || 0}, Atlanan: ${result.skipped || 0}, Hatalı: ${result.failed || 0}`,
            });
            await getContacts();
          }}
        />
      )}
    </div>
  );
};

export default ContactPage;
