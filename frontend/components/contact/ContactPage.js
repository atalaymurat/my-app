"use client";
import React from "react";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import ContactTable from "@/components/contact/contactTable";
import Pagination from "@/components/Pagination";
import Link from "next/link";

const ContactPage = () => {
  const { user, loading, checkSession, authChecked } = useAuth();
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

  useEffect(() => {
    const verifySession = async () => {
      if (!authChecked) {
        const sessionUser = await checkSession();
        if (!sessionUser) {
          router.push("/auth");
        }
      }
    };
    verifySession();
  }, [authChecked, checkSession, router]);

  if (loading || !authChecked) {
    return <div className="p-8">Loading authentication status...</div>;
  }
  if (!user) {
    router.push("/auth");
    return null;
  }
  if (!contacts) {
    return <div className="p-8 h-full">Loading data from server...</div>;
  }

  return (
    <div>
      <div className="overflow-hidden w-full px-2 py-4">
        <div className="grid md:grid-cols-3 gap-2">
          <Link href="/contact/new">
            <div className="btn-purple mt-2">Kişi +</div>
          </Link>
        </div>
        <ContactTable contacts={contacts} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            router.push(`/contact?page=${page}`);
          }}
        />
      </div>
    </div>
  );
};

export default ContactPage;
