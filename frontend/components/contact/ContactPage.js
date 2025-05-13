"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import ContactTable from "@/components/contact/contactTable";
import Pagination from "@/components/Pagination";
import PageLinks from "../templates/PageLinks";

const ContactPage = () => {
  const [contacts, setContacts] = React.useState(null);
  const [totalPages, setTotalPages] = React.useState(1);
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const router = useRouter();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const { data } = await apiClient.get(
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
    <div>
      <div>
        <PageLinks
          links={[{ href: "/shield/contact/new", label: "Yeni Kişi Ekle" }]}
        />
        <ContactTable contacts={contacts} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            router.push(`shield/contact?page=${page}`);
          }}
        />
      </div>
    </div>
  );
};

export default ContactPage;
