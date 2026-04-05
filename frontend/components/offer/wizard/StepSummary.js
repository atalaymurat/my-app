"use client";
import { useFormikContext } from "formik";
import { formPrice } from "@/lib/helpers";
import MessageBlock from "@/components/messageBlock";

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-stone-800 last:border-0">
      <span className="text-xs text-stone-500 shrink-0">{label}</span>
      <span className="text-xs text-stone-300 font-semibold text-right">{value}</span>
    </div>
  );
}

export default function StepSummary({ onPrev, message, isSubmitting }) {
  const { values } = useFormikContext();
  const filled = values.lineItems.filter(i => i.title);
  const totalList  = filled.reduce((s, i) => s + (Number(i.priceList)  || 0) * (i.quantity || 1), 0);
  const totalOffer = filled.reduce((s, i) => s + (Number(i.priceOffer) || 0) * (i.quantity || 1), 0);
  const totalNet   = filled.reduce((s, i) => s + (Number(i.priceNet)   || 0) * (i.quantity || 1), 0);
  const currency   = filled[0]?.currency || "";

  return (
    <div className="flex flex-col gap-3">

      {/* Firma & Kişi */}
      <div className="rounded-xl border border-stone-700 overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-900/70 border-b border-stone-700 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-900/50 border border-blue-700/40 flex items-center justify-center shrink-0">
            <span className="text-xs font-black text-blue-300">{values.title?.[0]?.toUpperCase() || "?"}</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Firma & Kişi</p>
        </div>
        <div className="px-4 py-1">
          <InfoRow label="Firma"    value={values.title} />
          <InfoRow label="Tam Unvan" value={values.vatTitle} />
          <InfoRow label="Şehir"    value={[values.city, values.country].filter(Boolean).join(", ")} />
          <InfoRow label="Kişi"     value={values.contactName} />
          <InfoRow label="Telefon"  value={values.contactPhone} />
          <InfoRow label="E-posta"  value={values.contactEmail} />
        </div>
      </div>

      {/* Ürünler */}
      <div className="rounded-xl border border-stone-700 overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-900/70 border-b border-stone-700 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Ürünler</p>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-600/30">
            {filled.length} adet
          </span>
        </div>
        <div className="divide-y divide-stone-800">
          {filled.map((item, i) => (
            <div key={i} className="px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0 w-5 h-5 rounded-md bg-amber-500/20 border border-amber-600/30 flex items-center justify-center text-[10px] font-black text-amber-400">
                    {i + 1}
                  </span>
                  <p className="text-sm font-semibold text-stone-200 truncate capitalize">{item.title}</p>
                </div>
                <div className="text-right shrink-0">
                  {item.priceOffer > 0 && (
                    <p className="text-sm font-bold text-amber-400">{formPrice(item.priceOffer)} {item.currency}</p>
                  )}
                  {item.quantity > 1 && (
                    <p className="text-[10px] text-stone-500">× {item.quantity} adet</p>
                  )}
                </div>
              </div>
              {item.selectedOptions?.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1 pl-7">
                  {item.selectedOptions.map((o, oi) => (
                    <span key={oi} className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 border border-stone-700 text-stone-400">
                      {o.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Kondisyonlar */}
      <div className="rounded-xl border border-stone-700 overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-900/70 border-b border-stone-700">
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Kondisyonlar</p>
        </div>
        <div className="px-4 py-1">
          <InfoRow label="Doküman Tipi" value={values.docType} />
          <InfoRow label="KDV"          value={`%${values.vatRate} — ${values.showVat ? "Göster" : "Gizle"}`} />
          <InfoRow label="Toplamlar"    value={values.showTotals ? "Göster" : "Gizle"} />
        </div>
      </div>

      {/* Fiyat Toplamları */}
      {totalOffer > 0 && (
        <div className="rounded-xl border border-stone-700 bg-stone-900/40 overflow-hidden">
          <div className="px-4 py-2.5 bg-stone-900/70 border-b border-stone-700">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Fiyat Özeti</p>
          </div>
          <div className="p-4 space-y-2">
            {totalList > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-500">Liste Toplam</span>
                <span className="text-sm font-semibold text-stone-400">{formPrice(totalList)} {currency}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-500">Teklif Toplam</span>
              <span className="text-sm font-bold text-amber-400">{formPrice(totalOffer)} {currency}</span>
            </div>
            {totalNet > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-500">Net Toplam</span>
                <span className="text-sm font-semibold text-emerald-400">{formPrice(totalNet)} {currency}</span>
              </div>
            )}
            {values.showVat && totalOffer > 0 && (
              <>
                <div className="h-px bg-stone-700 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-500">KDV (%{values.vatRate})</span>
                  <span className="text-sm font-semibold text-stone-300">
                    {formPrice(totalOffer * values.vatRate / 100)} {currency}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-stone-300">Genel Toplam</span>
                  <span className="text-base font-black text-white">
                    {formPrice(totalOffer * (1 + values.vatRate / 100))} {currency}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {message && <MessageBlock message={message} />}

      {/* Navigasyon */}
      <div className="mt-auto flex gap-2 pt-1">
        <button type="button" onClick={onPrev}
          className="flex-1 py-3 rounded-xl border border-stone-700 text-sm font-semibold text-stone-400 hover:bg-stone-800 transition-colors">
          ← Geri
        </button>
        <button type="submit" disabled={isSubmitting}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
            isSubmitting
              ? "bg-stone-700 border border-stone-600 text-stone-500 cursor-wait"
              : "bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white shadow-lg shadow-blue-900/30"
          }`}>
          {isSubmitting ? "Kaydediliyor..." : "Teklifi Gönder ✓"}
        </button>
      </div>
    </div>
  );
}
