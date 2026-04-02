"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/utils/axios";
import ContactTable from "@/components/contact/contactTable";
import Pagination from "@/components/Pagination";
import PageLinks from "../templates/PageLinks";

const ContactPage = () => {
  const [contacts, setContacts] = React.useState(null);
  const [totalPages, setTotalPages] = React.useState(1);
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const router = useRouter();

  const handleDelete = async (co) => {
    if (!confirm(`"${co.uName}" silinsin mi?`)) return;
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
    const getContacts = async () => {
      try {
        const { data } = await axios.get(
          `/api/contact?page=${currentPage}&limit=10`
        );
        setContacts(data.contacts);
        setTotalPages(data.totalPages);
        console.log("CONTACTS", JSON.stringify(data.contacts, null, 2));
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    getContacts();
  }, [currentPage]);


  if (!contacts) {
    return <div className="p-8 h-full">Loading data from server...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="flex-1">
        <PageLinks
          links={[{ href: "/shield/contact/new", label: "Yeni Kişi Ekle" }]}
        />
        <ContactTable contacts={contacts} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          router.push(`/shield/contact?page=${page}`);
        }}
      />
    </div>
  );
};

export default ContactPage;
