"use client";
import { Suspense } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { localeDate } from "@/lib/helpers";
import Link from "next/link";

// Wrap the main component in Suspense
export default function CompanyIndex() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyIndexContent />
    </Suspense>
  );
}

function CompanyIndexContent() {
  const { user, loading, checkSession, authChecked } = useAuth();
  const [companies, setCompanies] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const apiClient = axios.create({
    baseURL:
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BACKEND_URL // Make sure this env var is set in production
        : "http://localhost:5000", // Your backend URL for development
    withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
    headers: {
      "Content-Type": "application/json",
    },
  });
  useEffect(() => {
    const getCompanies = async () => {
      try {
        const { data } = await apiClient.get(
          `/api/company?page=${currentPage}&limit=10`
        );
        setCompanies(data.companies);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    getCompanies();
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

  const handlePageChange = (newPage) => {
    router.push(`/company?page=${newPage}`);
  };

  if (loading || !authChecked) {
    return <div className="p-8 h-full">Loading authentication status...</div>;
  }
  if (!companies) {
    return <div className="p-8 h-full">Loading data from server...</div>;
  }
  if (!user) {
    router.push("/auth");
    return null;
  }

  return (
    <div className="p-8 flex flex-col gap-4 w-full">
      <div className="grid grid-cols-4 gap-2">
        <Link href="/company/new">
          <div className="btn-purple">Firma Oluştur</div>
        </Link>
      </div>
      <div className="border rounded-xl p-2">
        <div className="text-2xl font-bold py-4">Firmalar</div>
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-2 bg-black text-white border-b py-2 px-2 rounded-t-xl font-semibold">
          <div>Firma / No</div>
          <div>Web / Email</div>
          <div>Şehir / Ülke</div>
        </div>
        {/* Table Content */}
        <div>
          {companies.map((co, index) => (
            <div
              className="grid grid-cols-4 gap-2 border-b py-2 px-2"
              key={index}
            >
              <div>
                <div className="flex flex-row items-center">
                  {co.favicon ? (
                    <img
                      src={co.favicon}
                      alt="logo"
                      className="w-5 h-5 object-contain mr-2"
                    />
                  ) : (
                    <div className="w-5 h-5 mr-2"> </div>
                  )}
                  <div className="flex flex-col">
                    <div>{co.title}</div>
                    <div className="text-xs">{localeDate(co.createdAt)}</div>
                  </div>
                </div>
              </div>
              <div>
                <div>{co.web}</div>
                <div className="text-xs">{co.email}</div>
              </div>
              <div>
                <div>{co.addresses[0].city}</div>
                <div className="text-xs">{co.addresses[0].country}</div>
              </div>
              <div>edit</div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Önceki
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 border rounded ${
                currentPage === page ? "bg-blue-500 text-white" : ""
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Sonraki
          </button>
        </div>
      </div>
      <pre>{JSON.stringify(companies[0], null, 2)}</pre>
    </div>
  );
}
