"use client";
import { Suspense } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { localeDate } from "@/lib/helpers";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import Pagination from "@/components/Pagination";
import CompanyListSkeleton from "@/components/skeleton/CompanyListSkeleton";
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
    return <CompanyListSkeleton />;
  }
  if (!companies) {
    return <CompanyListSkeleton />;
  }
  if (!user) {
    router.push("/auth");
    return null;
  }
  if (companies.length > 0) {
    return (
      <div className="p-1 md:p-4 flex flex-col gap-4 w-full bg-black h-full min-h-screen">
        <div className="grid md:grid-cols-3 gap-2">
          <Link href="/company/new">
            <div className="btn-purple mt-2">Add ++</div>
          </Link>
        </div>
        <div className="border rounded-xl p-2 bg-zinc-900 text-white">
          <div className="text-2xl font-bold py-4 px-1">Companies</div>
          {/* Table Header */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-400 border-b py-2 px-1 text-sm rounded-t-xl font-semibold">
            <div>Title / Date</div>
            <div className="hidden md:block">Domains / Email</div>
            <div className="block">City / Country</div>
          </div>
          {/* Table Content */}
          <div className="">
            {companies.map((co, index) => (
              <div
                className="grid grid-cols-2 md:grid-cols-3 gap-2 border-b py-2 px-2"
                key={index}
              >
                <div>
                  <div className="flex flex-row items-center">
                    {co.favicon ? (
                      <img
                        src={company.favicon}
                        alt="logo"
                        className="w-5 h-5 object-contain mr-2"
                      />
                    ) : (
                      <div className="w-5 h-5 mr-2"> </div>
                    )}
                    <div className="flex flex-col">
                      <div>{co.customTitle}</div>
                      <div className="text-xs">{localeDate(co.createdAt)}</div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block">
                  <div>
                    {co.userDomains?.slice(0, 5).map((d, i) => (
                      <div key={i} className="text-xs">
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs">
                    {co.userEmails?.slice(0, 5).map((e, i) => (
                      <div key={i}>
                        <div className="text-xs">{e}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="">
                  {co.addresses?.map((a, i) => (
                    <div key={i} className="text-xs">
                      {a.city} {a.country}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        <pre>{/* JSON.stringify(companies[0], null, 2) */}</pre>
      </div>
    );
  }
}
