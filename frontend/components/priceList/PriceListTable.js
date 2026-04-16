"use client";

import { useRouter } from "next/navigation";
import { localeDate } from "@/lib/helpers";

const STATUS_STYLE = {
  draft: "bg-stone-800 text-stone-400 border-stone-600",
  published: "bg-emerald-900/40 text-emerald-400 border-emerald-700/50",
  archived: "bg-stone-900/60 text-stone-500 border-stone-700",
};

const STATUS_LABEL = {
  draft: "Taslak",
  published: "Yayında",
  archived: "Arşiv",
};

const STATUS_BORDER = {
  draft: "border-l-stone-500",
  published: "border-l-emerald-500",
  archived: "border-l-stone-600",
};

function ActionButton({ title, onClick, children, tone = "default" }) {
  const toneClass = tone === "danger"
    ? "text-stone-400 hover:text-red-400"
    : "text-stone-400 hover:text-amber-400";

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`${toneClass} transition-colors cursor-pointer`}
    >
      {children}
    </button>
  );
}

export default function PriceListTable({ priceLists, onDelete, readOnly = false }) {
  const router = useRouter();

  return (
    <div className="space-y-3 py-2">
      {priceLists.map((pl) => (
        <div
          key={pl._id}
          onClick={() => router.push(`/shield/price-list/${pl._id}`)}
          className={`rounded-xl border border-stone-700 border-l-4 ${STATUS_BORDER[pl.status] || STATUS_BORDER.draft} overflow-hidden bg-stone-950/60 cursor-pointer hover:bg-stone-900/50 transition-colors`}
        >
          <div className="px-4 pt-3 pb-2.5 border-b border-stone-800">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm font-semibold text-stone-100 truncate">{pl.title}</h2>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLE[pl.status] || STATUS_STYLE.draft}`}>
                    {STATUS_LABEL[pl.status] || "Taslak"}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-stone-700 bg-stone-800 text-stone-300">
                    {pl.currency}
                  </span>
                  {pl.currentVersion > 0 && (
                    <span className="text-[10px] font-semibold text-stone-400 bg-stone-800 border border-stone-700 px-1.5 py-0.5 rounded-full">
                      v{pl.currentVersion}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-stone-800 border border-stone-700 overflow-hidden shrink-0 flex items-center justify-center">
                    {pl.make?.logo ? (
                      <img src={pl.make.logo} alt={pl.make?.name || "Marka"} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-stone-400">
                        {pl.make?.name?.charAt(0)?.toUpperCase() || "M"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-stone-300 truncate">{pl.make?.name || "Marka yok"}</p>
                    <p className="text-[11px] text-stone-500">{localeDate(pl.updatedAt)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 shrink-0 pt-1">
                <ActionButton
                  title="Detay"
                  onClick={(event) => {
                    event.stopPropagation();
                    router.push(`/shield/price-list/${pl._id}`);
                  }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12S5.25 5.25 12 5.25 21.75 12 21.75 12 18.75 18.75 12 18.75 2.25 12 2.25 12Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </ActionButton>
                {!readOnly && (
                  <ActionButton
                    title="Sil"
                    tone="danger"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(pl._id);
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h12m-9.75 0V6a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 .75.75v1.5m-9 0v9.75A1.5 1.5 0 0 0 9 18.75h6a1.5 1.5 0 0 0 1.5-1.5V7.5m-6 3v4.5m3-4.5v4.5" />
                    </svg>
                  </ActionButton>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
