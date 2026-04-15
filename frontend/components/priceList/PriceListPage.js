"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/utils/axios";
import { useAuth } from "@/context/AuthContext";
import Pagination from "../Pagination";
import PriceListTable from "./PriceListTable";

const STATUS_TABS = [
  { value: "", label: "Tümü" },
  { value: "draft", label: "Taslak" },
  { value: "published", label: "Yayında" },
  { value: "archived", label: "Arşiv" },
];

export default function PriceListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const isSuperAdmin = user?.roles?.includes("superadmin");
  const [priceLists, setPriceLists] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const activeStatus = searchParams.get("status") || "";

  useEffect(() => {
    if (!isSuperAdmin) return;

    setLoading(true);
    const params = new URLSearchParams({ page: String(currentPage), limit: "10" });
    if (activeStatus) params.set("status", activeStatus);

    axios.get(`/api/price-list?${params}`)
      .then(({ data }) => {
        setPriceLists(data.records || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => {
        setPriceLists([]);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [currentPage, activeStatus, isSuperAdmin]);

  const goTab = (status) => {
    const q = new URLSearchParams({ page: "1" });
    if (status) q.set("status", status);
    router.push(`/shield/price-list?${q}`);
  };

  const goPage = (page) => {
    const q = new URLSearchParams({ page: String(page) });
    if (activeStatus) q.set("status", activeStatus);
    router.push(`/shield/price-list?${q}`);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu fiyat listesi ve tüm versiyonları silinecek. Emin misiniz?")) return;
    try {
      await axios.delete(`/api/price-list/${id}`);
      setPriceLists((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Silinemedi.");
    }
  };

  if (!isSuperAdmin) {
    return <div className="p-8 text-stone-400">Bu sayfaya erişim yetkiniz yok.</div>;
  }

  return (
    <div className="text-white max-w-5xl mx-auto px-2 sm:px-4 py-4">
      <div className="flex items-center gap-3 px-4 py-4">
        <button
          onClick={() => router.push("/shield/profile")}
          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-black text-stone-100 flex-1">Fiyat Listeleri</h1>
        <button
          onClick={() => router.push("/shield/price-list/new")}
          className="w-8 h-8 rounded-lg bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      <div className="flex gap-1 mb-4 bg-stone-900 border border-stone-800 rounded-lg p-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => goTab(tab.value)}
            className={`flex-1 text-xs font-semibold px-2 py-1.5 rounded-md transition-colors ${
              activeStatus === tab.value ? "bg-stone-700 text-stone-100" : "text-stone-500 hover:text-stone-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-stone-500 text-sm">Yükleniyor...</div>
      ) : priceLists.length === 0 ? (
        <div className="text-stone-400 text-sm">Kayıt bulunamadı.</div>
      ) : (
        <PriceListTable priceLists={priceLists} onDelete={handleDelete} />
      )}

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goPage} />
      )}
    </div>
  );
}
