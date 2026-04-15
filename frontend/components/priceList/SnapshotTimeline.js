"use client";

import { useAuth } from "@/context/AuthContext";
import { localeDate } from "@/lib/helpers";

const STATUS_STYLE = {
  draft: "bg-stone-800 text-stone-400 border-stone-600",
  published: "bg-emerald-900/40 text-emerald-400 border-emerald-700/50",
  superseded: "bg-stone-900/60 text-stone-600 border-stone-700",
};

const STATUS_LABEL = {
  draft: "Taslak",
  published: "Yayında",
  superseded: "Eski",
};

function StatusBadge({ status }) {
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${STATUS_STYLE[status] || STATUS_STYLE.draft}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

export default function SnapshotTimeline({ snapshots, onPublish, onEdit, actionLoading }) {
  const { user } = useAuth();
  const isSuperAdmin = user?.roles?.includes("superadmin");

  if (!isSuperAdmin) {
    return <div className="p-8 text-stone-400">Bu sayfaya erişim yetkiniz yok.</div>;
  }

  if (!snapshots.length) {
    return (
      <div className="rounded-xl border border-stone-700 p-6 text-center">
        <p className="text-sm text-stone-500">Henüz snapshot oluşturulmamış.</p>
        <p className="text-xs text-stone-600 mt-1">Yukarıdaki "Yeni Snapshot" butonuyla başlayın.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {snapshots.map((snap) => (
        <div
          key={snap._id}
          className={`rounded-xl border overflow-hidden border-l-4 ${
            snap.status === "published"
              ? "border-l-emerald-500 border-stone-700"
              : snap.status === "draft"
                ? "border-l-blue-500 border-stone-700"
                : "border-l-stone-600 border-stone-800"
          }`}
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-stone-900/40">
            <span
              className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border ${
                snap.status === "published"
                  ? "bg-emerald-500/20 border-emerald-600/40 text-emerald-400"
                  : snap.status === "draft"
                    ? "bg-blue-500/20 border-blue-600/40 text-blue-400"
                    : "bg-stone-800 border-stone-700 text-stone-500"
              }`}
            >
              v{snap.version}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={snap.status} />
                {snap.notes && <p className="text-xs text-stone-500 truncate">{snap.notes}</p>}
              </div>
              <div className="flex items-center gap-3 mt-0.5 text-[10px] text-stone-600 flex-wrap">
                <span>{localeDate(snap.createdAt)}</span>
                {snap.publishedAt && <span>Yayın: {localeDate(snap.publishedAt)}</span>}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {snap.summary && (
                <div className="flex gap-1.5 flex-wrap justify-end">
                  <span className="text-[10px] text-stone-500 bg-stone-800 border border-stone-700 px-1.5 py-0.5 rounded">
                    {snap.summary.totalProducts} ürün
                  </span>
                  <span className="text-[10px] text-stone-500 bg-stone-800 border border-stone-700 px-1.5 py-0.5 rounded">
                    {snap.summary.totalVariants} varyant
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {snap.status === "draft" && (
                <>
                  <button
                    onClick={() => onEdit(snap._id)}
                    disabled={actionLoading}
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-blue-700/50 hover:border-blue-500 text-blue-400 hover:text-blue-300 bg-blue-950/30 hover:bg-blue-900/40 transition-colors disabled:opacity-50"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => onPublish(snap._id)}
                    disabled={actionLoading}
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-emerald-700/50 hover:border-emerald-500 text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 hover:bg-emerald-900/40 transition-colors disabled:opacity-50"
                  >
                    Yayınla
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
