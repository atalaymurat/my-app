"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import MessageBlock from "@/components/messageBlock";
import { useAuth } from "@/context/AuthContext";

export default function SnapshotEditor({ snapshotId, priceListId, onClose, onSaved }) {
  const { user } = useAuth();
  const isSuperAdmin = user?.roles?.includes("superadmin");
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!isSuperAdmin) return;

    setLoading(true);
    axios.get(`/api/price-list/${priceListId}/snapshot/${snapshotId}`)
      .then(({ data }) => {
        if (data.success) setSnapshot(data.record);
      })
      .catch(() => setMessage({ text: "Snapshot yüklenemedi.", type: "error" }))
      .finally(() => setLoading(false));
  }, [priceListId, snapshotId, isSuperAdmin]);

  const handleVariantPrice = (itemIdx, variantIdx, field, value) => {
    setSnapshot((prev) => {
      const updated = {
        ...prev,
        items: prev.items.map((item, i) => {
          if (i !== itemIdx) return item;
          return {
            ...item,
            variants: item.variants.map((v, vi) => {
              if (vi !== variantIdx) return v;
              return { ...v, [field]: value };
            }),
          };
        }),
      };
      return updated;
    });
  };

  const handleOptionPrice = (itemIdx, optIdx, field, value) => {
    setSnapshot((prev) => {
      const updated = {
        ...prev,
        items: prev.items.map((item, i) => {
          if (i !== itemIdx) return item;
          return {
            ...item,
            options: item.options.map((o, oi) => {
              if (oi !== optIdx) return o;
              return { ...o, [field]: value };
            }),
          };
        }),
      };
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        items: snapshot.items.map((item) => ({
          sourceMasterProduct: String(item.sourceMasterProduct),
          sortOrder: item.sortOrder,
          variants: item.variants.map((v) => ({
            sourceVariantId: v.sourceVariantId,
            priceList: v.priceList || 0,
            priceOffer: v.priceOffer || 0,
            priceNet: v.priceNet || 0,
          })),
          options: item.options.map((o) => ({
            sourceOption: String(o.sourceOption),
            priceList: o.priceList || 0,
            priceOffer: o.priceOffer || 0,
            priceNet: o.priceNet || 0,
          })),
        })),
      };
      const { data } = await axios.patch(`/api/price-list/${priceListId}/snapshot/${snapshotId}/items`, payload);
      if (data.success) {
        setMessage({ text: "Fiyatlar kaydedildi.", type: "success" });
        onSaved?.();
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Kayıt başarısız.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (!isSuperAdmin) {
    return <div className="p-8 text-stone-400">Bu sayfaya erişim yetkiniz yok.</div>;
  }

  if (loading) {
    return <div className="rounded-xl border border-stone-700 p-6 text-sm text-stone-500">Snapshot yükleniyor...</div>;
  }

  if (snapshot && snapshot.status !== "draft") {
    return (
      <div className="rounded-xl border border-stone-700 p-6 text-center">
        <p className="text-sm text-stone-400">Sadece taslak snapshot düzenlenebilir.</p>
        <button onClick={onClose} className="mt-3 text-xs text-stone-500 hover:text-stone-300">Kapat</button>
      </div>
    );
  }

  if (!snapshot) {
    return <div className="rounded-xl border border-stone-700 p-6 text-sm text-stone-500">Snapshot bulunamadı.</div>;
  }

  return (
    <div className="rounded-xl border border-stone-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-stone-900/60 border-b border-stone-700">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-400 bg-blue-500/20 border border-blue-600/40 px-2 py-0.5 rounded-lg">
            v{snapshot.version}
          </span>
          <p className="text-sm font-bold text-stone-200">Fiyat Düzenleme</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 border border-blue-500 text-xs font-bold text-white transition-colors disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-stone-600 text-xs font-semibold text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {message && <MessageBlock message={message} />}

        {snapshot.items.map((item, itemIdx) => (
          <div key={itemIdx} className="rounded-xl border border-stone-700 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-stone-900/40 border-b border-stone-800">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-stone-800 border border-stone-700 overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-stone-500">{item.title?.charAt(0)?.toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-stone-200 truncate capitalize">{item.title}</p>
                {item.caption && <p className="text-xs text-stone-500 truncate">{item.caption}</p>}
              </div>
              <span className="text-[10px] text-stone-500 bg-stone-800 border border-stone-700 px-1.5 py-0.5 rounded">
                {item.currency}
              </span>
            </div>

            {item.variants?.length > 0 && (
              <div className="divide-y divide-stone-800">
                <div className="px-4 py-2 bg-stone-900/30">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Varyantlar</p>
                </div>
                {item.variants.map((variant, vIdx) => (
                  <div key={vIdx} className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-stone-300">{variant.modelType}</span>
                      {variant.code && <span className="text-[10px] font-mono text-stone-600">{variant.code}</span>}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-stone-500 font-medium block mb-1">Liste</label>
                        <input
                          type="number"
                          value={variant.priceList || ""}
                          onChange={(e) => handleVariantPrice(itemIdx, vIdx, "priceList", Number(e.target.value))}
                          className="w-full px-2 py-1.5 text-sm bg-stone-800 border border-stone-600 rounded-lg text-stone-200 focus:outline-none focus:border-stone-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-amber-500 font-medium block mb-1">Teklif</label>
                        <input
                          type="number"
                          value={variant.priceOffer || ""}
                          onChange={(e) => handleVariantPrice(itemIdx, vIdx, "priceOffer", Number(e.target.value))}
                          className="w-full px-2 py-1.5 text-sm bg-stone-800 border border-amber-700/50 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-emerald-500 font-medium block mb-1">Net</label>
                        <input
                          type="number"
                          value={variant.priceNet || ""}
                          onChange={(e) => handleVariantPrice(itemIdx, vIdx, "priceNet", Number(e.target.value))}
                          className="w-full px-2 py-1.5 text-sm bg-stone-800 border border-emerald-700/50 rounded-lg text-stone-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {item.options?.length > 0 && (
              <div className="divide-y divide-stone-800">
                <div className="px-4 py-2 bg-stone-900/30 border-t border-stone-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Opsiyonlar</p>
                </div>
                {item.options.map((opt, oIdx) => (
                  <div key={oIdx} className="px-4 py-3">
                    <p className="text-xs font-semibold text-stone-300 mb-2">{opt.title}</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-stone-500 font-medium block mb-1">Liste</label>
                        <input
                          type="number"
                          value={opt.priceList || ""}
                          onChange={(e) => handleOptionPrice(itemIdx, oIdx, "priceList", Number(e.target.value))}
                          className="w-full px-2 py-1.5 text-sm bg-stone-800 border border-stone-600 rounded-lg text-stone-200 focus:outline-none focus:border-stone-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-amber-500 font-medium block mb-1">Teklif</label>
                        <input
                          type="number"
                          value={opt.priceOffer || ""}
                          onChange={(e) => handleOptionPrice(itemIdx, oIdx, "priceOffer", Number(e.target.value))}
                          className="w-full px-2 py-1.5 text-sm bg-stone-800 border border-amber-700/50 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-emerald-500 font-medium block mb-1">Net</label>
                        <input
                          type="number"
                          value={opt.priceNet || ""}
                          onChange={(e) => handleOptionPrice(itemIdx, oIdx, "priceNet", Number(e.target.value))}
                          className="w-full px-2 py-1.5 text-sm bg-stone-800 border border-emerald-700/50 rounded-lg text-stone-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
