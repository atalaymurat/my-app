"use client";
import { useEffect, useState } from "react";
import Pagination from "../Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/utils/axios";
import OfferTable from "./OfferTable";

const STATUS_TABS = [
  { value: "",          label: "Tümü" },
  { value: "open",      label: "Açık" },
  { value: "won",       label: "Kazanıldı" },
  { value: "lost",      label: "Kaybedildi" },
  { value: "cancelled", label: "İptal" },
];

const OfferPage = () => {
  const [offers, setOffers]       = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const router      = useRouter();
  const searchParams = useSearchParams();
  const currentPage  = parseInt(searchParams.get("page") || "1", 10);
  const activeStatus = searchParams.get("status") || "";

  useEffect(() => {
    const params = new URLSearchParams({ page: currentPage, limit: 10 });
    if (activeStatus) params.set("status", activeStatus);
    axios.get(`/api/offer?${params}`)
      .then(({ data }) => { setOffers(data.records); setTotalPages(data.totalPages || 1); })
      .catch(() => {});
  }, [currentPage, activeStatus]);

  const goTab = (status) => {
    const q = new URLSearchParams({ page: 1 });
    if (status) q.set("status", status);
    router.push(`/shield/offer?${q}`);
  };

  const goPage = (p) => {
    const q = new URLSearchParams({ page: p });
    if (activeStatus) q.set("status", activeStatus);
    router.push(`/shield/offer?${q}`);
  };

  return (
    <div className="text-white max-w-4xl mx-auto px-2 sm:px-4 py-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.push("/shield/profile")}
          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-400 hover:text-stone-200 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-black text-stone-100 flex-1">Teklifler</h1>
        <button onClick={() => router.push("/shield/offer/new")}
          className="w-8 h-8 rounded-lg bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 mb-4 bg-stone-900 border border-stone-800 rounded-lg p-1">
        {STATUS_TABS.map((tab) => (
          <button key={tab.value} onClick={() => goTab(tab.value)}
            className={`flex-1 text-xs font-semibold px-2 py-1.5 rounded-md transition-colors ${
              activeStatus === tab.value
                ? "bg-stone-700 text-stone-100"
                : "text-stone-500 hover:text-stone-300"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {!offers
        ? <div className="text-stone-500 text-sm">Yükleniyor...</div>
        : offers.length === 0
          ? <div className="text-stone-400 text-sm">Kayıt bulunamadı.</div>
          : <OfferTable offers={offers} />
      }

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goPage} />
      )}
    </div>
  );
};

export default OfferPage;
