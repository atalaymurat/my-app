"use client";
import { useState } from "react";
import { formPrice, localeDate } from "@/lib/helpers";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";

const TYPE_STYLE = {
  Teklif: "bg-amber-900/40 text-amber-400 border-amber-700/50",
  Proforma: "bg-blue-900/40 text-blue-400 border-blue-700/50",
  Fatura: "bg-emerald-900/40 text-emerald-400 border-emerald-700/50",
  Sipariş: "bg-violet-900/40 text-violet-400 border-violet-700/50",
  Sözleşme: "bg-rose-900/40 text-rose-400 border-rose-700/50",
};
const TYPE_BORDER = {
  Teklif: "border-l-amber-500",
  Proforma: "border-l-blue-500",
  Fatura: "border-l-emerald-500",
  Sipariş: "border-l-violet-500",
  Sözleşme: "border-l-rose-500",
};
const STATUS_STYLE = {
  open:      "bg-stone-800 text-stone-400 border-stone-600",
  won:       "bg-emerald-900/40 text-emerald-400 border-emerald-700/50",
  lost:      "bg-red-900/40 text-red-400 border-red-700/50",
  cancelled: "bg-stone-900/60 text-stone-500 border-stone-700",
};
const STATUS_LABEL = { open: "Açık", won: "Kazanıldı", lost: "Kaybedildi", cancelled: "İptal" };

function TotalsSection({ v }) {
  if (!v.showTotals || !v.totalsByCurrency) return null;
  const entries = Object.entries(v.totalsByCurrency);

  return (
    <div className="px-4 py-2 border-t border-stone-800 flex flex-wrap gap-x-4 gap-y-1 items-center">
      {entries.map(([currency, totals]) => (
        <div key={currency} className="flex items-center gap-2 text-xs">
          <span className="text-stone-600 font-mono text-[10px] uppercase">{currency}</span>
          <span className="text-stone-500">
            {formPrice(totals.priceListTotal)}
          </span>
          <span className="text-stone-700">›</span>
          <span className="text-amber-400 font-semibold">
            {formPrice(totals.priceOfferTotal)}
          </span>
          {v.showVat && totals.priceVat > 0 && (
            <>
              <span className="text-stone-700">+</span>
              <span className="text-stone-500">{formPrice(totals.priceVat)} KDV</span>
            </>
          )}
          <span className="text-stone-700">=</span>
          <span className="text-emerald-400 font-bold">{formPrice(totals.priceGrandTotal)}</span>
        </div>
      ))}
    </div>
  );
}

function DocTypeBadge({ type }) {
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${TYPE_STYLE[type] || TYPE_STYLE.Teklif}`}>
      {type}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLE[status] || STATUS_STYLE.open}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

const downloadPdf = async (offerId) => {
  try {
    const res = await axios.get(`/api/pdf/${offerId}`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `offer-${offerId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch {
    alert("PDF indirilemedi.");
  }
};

const viewPdf = (offerId) =>
  window.open(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pdf/${offerId}`,
    "_blank",
  );

const deleteOffer = async (offerId) => {
  if (!confirm("Bu teklif silinecek. Emin misiniz?")) return false;
  await axios.delete(`/api/offer/${offerId}`);
  return true;
};

export default function OfferTable({ offers: initialOffers }) {
  const router = useRouter();
  const [offers, setOffers] = useState(initialOffers);

  const handleDelete = async (offerId) => {
    const deleted = await deleteOffer(offerId);
    if (deleted) setOffers((prev) => prev.filter((o) => o._id !== offerId));
  };

  const handleStatusChange = async (offerId, status) => {
    try {
      await axios.patch(`/api/offer/${offerId}/status`, { status });
      setOffers((prev) => prev.map((o) => o._id === offerId ? { ...o, status } : o));
    } catch {
      alert("Durum güncellenemedi.");
    }
  };

  return (
    <div className="space-y-3 py-2">
      {offers?.map((off) => {
        const v = off.versions[off.versions.length - 1];
        const vCount = off.versions.length;
        const currentDocType = off.currentDocType || v.docType;

        // Versiyonlardan tekrarsız sıralı docType zinciri çıkar
        const lifecycle = (off.versions || []).reduce((acc, ver) => {
          if (acc[acc.length - 1] !== ver.docType) acc.push(ver.docType);
          return acc;
        }, []);
        const hasLifecycle = lifecycle.length > 1;

        return (
          <div
            key={off._id}
            className={`rounded-xl border border-stone-700 border-l-4 ${TYPE_BORDER[currentDocType] || TYPE_BORDER.Teklif} overflow-hidden bg-stone-950/60`}
          >
            {/* ── Header ── */}
            <div className="px-4 pt-3 pb-2.5 border-b border-stone-800">
              {/* Üst satır: docCode, versiyon, status, tarihler */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-stone-200 tracking-tight">
                  {v.docCode}
                </span>
                {vCount > 1 && (
                  <span className="text-[10px] font-semibold text-stone-500 bg-stone-800 border border-stone-700 px-1.5 py-0.5 rounded-full">
                    v{vCount}
                  </span>
                )}
                {off.offerType === "simple" ? (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border bg-stone-800 text-stone-400 border-stone-600">
                    Serbest Kalem
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border bg-indigo-900/40 text-indigo-400 border-indigo-700/50">
                    Katalog
                  </span>
                )}
                <StatusBadge status={off.status || "open"} />
                <div className="ml-auto flex items-center gap-3 text-xs text-stone-500">
                  <span>{localeDate(v.docDate)}</span>
                  {v.validDate && (
                    <span className="text-stone-600">→ {localeDate(v.validDate)}</span>
                  )}
                </div>
              </div>
              {/* Alt satır: lifecycle / tek tip */}
              <div className="flex items-center gap-1 mt-1.5">
                {lifecycle.map((type, i) => (
                  <div key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-stone-600 text-[10px]">→</span>}
                    <DocTypeBadge type={type} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Firma ── */}
            <div className="px-4 py-2.5 flex items-center gap-2.5 border-b border-stone-800/60">
              <div className="w-7 h-7 rounded-full bg-blue-900/60 border border-blue-700/50 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-blue-400">
                  {off.company?.title?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-200 capitalize leading-none">
                  {off.company?.title}
                </p>
                {off.company?.addresses?.[0]?.city && (
                  <p className="text-xs text-stone-500 mt-0.5">
                    {off.company.addresses[0].city}
                  </p>
                )}
              </div>
            </div>

            {/* ── Line Items ── */}
            <div className="divide-y divide-stone-800/60">
              {[...(v.lineItems || [])].sort((a, b) =>
                (a.priceOfferTotal?.currency || "").localeCompare(b.priceOfferTotal?.currency || "")
              ).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-stone-800 border border-stone-700 overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-5 h-5 text-stone-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-200 capitalize truncate">
                      {item.title}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-stone-500 truncate mt-0.5">
                        {item.notes}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-stone-500">
                      {item.quantity > 1 && (
                        <span>
                          {formPrice(item.priceOffer)} × {item.quantity} ={" "}
                        </span>
                      )}
                      <span className="text-emerald-400 font-semibold">
                        {formPrice(item.priceOfferTotal?.value)}{" "}
                        {item.priceOfferTotal?.currency}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Totals ── */}
            <TotalsSection v={v} />

            {/* ── Actions ── */}
            <div className="px-4 py-2.5 border-t border-stone-800/60 flex gap-6 justify-end items-center">
              {/* Kazanıldı */}
              {off.status !== "won" && (
                <button onClick={() => handleStatusChange(off._id, "won")} title="Kazanıldı olarak işaretle"
                  className="text-stone-400 hover:text-emerald-400 transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              )}
              {/* Kaybedildi */}
              {off.status !== "lost" && off.status !== "cancelled" && (
                <button onClick={() => handleStatusChange(off._id, "lost")} title="Kaybedildi olarak işaretle"
                  className="text-stone-400 hover:text-red-400 transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              )}
              {/* Yeniden Aç */}
              {off.status !== "open" && (
                <button onClick={() => handleStatusChange(off._id, "open")} title="Yeniden Aç"
                  className="text-stone-400 hover:text-amber-400 transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </button>
              )}
              {/* Edit */}
              <button
                onClick={() => router.push(off.offerType === "simple" ? `/shield/offer/${off._id}/edit-quick` : `/shield/offer/${off._id}/edit`)}
                title="Düzenle"
                className="text-stone-400 hover:text-blue-400 transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
                  />
                </svg>
              </button>
              {/* PDF indir */}
              <button
                onClick={() => downloadPdf(off._id)}
                title="PDF İndir"
                className="text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </button>
              {/* PDF görüntüle */}
              <button
                onClick={() => viewPdf(off._id)}
                title="PDF Görüntüle"
                className="text-stone-400 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </button>
              {/* Sil */}
              <button
                onClick={() => handleDelete(off._id)}
                title="Sil"
                className="text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
