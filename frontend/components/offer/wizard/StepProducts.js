"use client";
import { useState, useEffect } from "react";
import { useFormikContext } from "formik";
import { formPrice } from "@/lib/helpers";
import ProductForm from "./ProductForm";

const EMPTY_ITEM = {
  title: "", productValue: "", selectedPriceListId: "", selectedMakeId: "", selectedVariantId: "",
  makeName: "", variantCode: "", variantModel: "",
  variantPriceList: 0, variantPriceOffer: 0, variantPriceNet: 0,
  priceList: "", priceOffer: "", priceNet: "", currency: "",
  options: [], selectedOptions: [], quantity: 1, notes: "",
};

function ProductSummaryCard({ item, idx, onEdit, onRemove, canRemove }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-800/60 border border-stone-700">
      <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border ${
        item.title ? "bg-amber-500/20 border-amber-600/40 text-amber-400" : "bg-stone-700 border-stone-600 text-stone-500"
      }`}>
        {String(idx + 1).padStart(2, "0")}
      </div>
      <div className="flex-1 min-w-0">
        {item.title ? (
          <>
            <p className="text-sm font-bold text-stone-100 truncate capitalize">{item.title}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
              {item.priceOffer > 0 && (
                <span className="text-xs text-amber-400 font-semibold">{formPrice(item.priceOffer)} {item.currency}</span>
              )}
              {item.quantity > 1 && (
                <span className="text-xs text-stone-500">× {item.quantity}</span>
              )}
              {item.selectedOptions?.length > 0 && (
                <span className="text-xs text-stone-500">{item.selectedOptions.length} opsiyon</span>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-stone-500 italic">Ürün seçilmedi</p>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button type="button" onClick={onEdit}
          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-stone-600 hover:border-blue-600 text-stone-400 hover:text-blue-400 bg-stone-800 hover:bg-blue-950/30 transition-colors">
          Düzenle
        </button>
        {canRemove && (
          <button type="button" onClick={onRemove}
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-stone-600 hover:border-red-700 text-stone-400 hover:text-red-400 bg-stone-800 hover:bg-red-950/30 transition-colors">
            Sil
          </button>
        )}
      </div>
    </div>
  );
}

export default function StepProducts({ onPrev, onNext }) {
  const { values, setFieldValue } = useFormikContext();
  const [activeIdx, setActiveIdx] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(""), 3000);
    return () => clearTimeout(t);
  }, [error]);

  const items = values.lineItems;
  const activeItem = items[activeIdx];

  const getItemError = (item) => {
    if (!item?.selectedPriceListId) return "Fiyat listesi seçilmedi";
    if (!item?.productValue) return "Ürün seçilmedi";
    if (!item?.selectedVariantId) return "Varyant seçilmedi";
    return null;
  };

  const activeError = getItemError(activeItem);

  const addProduct = () => {
    if (activeError) { setError(activeError); return; }
    const newItems = [...items, { ...EMPTY_ITEM }];
    setFieldValue("lineItems", newItems);
    setActiveIdx(newItems.length - 1);
    setShowSummary(false);
    setError("");
  };

  const removeProduct = (idx) => {
    const updated = items.filter((_, i) => i !== idx);
    setFieldValue("lineItems", updated.length > 0 ? updated : [{ ...EMPTY_ITEM }]);
    if (activeIdx >= updated.length) setActiveIdx(Math.max(0, updated.length - 1));
    setError("");
  };

  const handleNext = () => {
    if (!items.some(item => item.title)) { setError("En az bir ürün seçmelisiniz."); return; }
    onNext();
  };

  const handleShowSummary = () => {
    if (activeError) { setError(activeError); return; }
    setShowSummary(true);
    setError("");
  };

  if (showSummary) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-bold text-stone-200">
            Eklenen Ürünler
            <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-600/30">
              {items.filter(i => i.title).length}
            </span>
          </p>
          <button type="button" onClick={addProduct}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-dashed border-stone-500 hover:border-blue-500 text-stone-400 hover:text-blue-400 transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Ürün Ekle
          </button>
        </div>

        {items.map((item, idx) => (
          <ProductSummaryCard key={idx} item={item} idx={idx}
            onEdit={() => { setActiveIdx(idx); setShowSummary(false); }}
            onRemove={() => removeProduct(idx)}
            canRemove={items.length > 1} />
        ))}

        <div className="mt-auto flex gap-2 pt-2">
          <button type="button" onClick={() => setShowSummary(false)}
            className="flex-1 py-3 rounded-xl border border-stone-700 text-sm font-semibold text-stone-400 hover:bg-stone-800 transition-colors">
            ← Geri
          </button>
          <button type="button" onClick={handleNext}
            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-500 text-sm font-bold text-white transition-colors shadow-lg shadow-blue-900/40">
            Kondisyonlar →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-600/30 flex items-center justify-center text-xs font-black text-amber-400">
            {String(activeIdx + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="text-sm font-bold text-stone-200 leading-tight">
              {activeItem?.title || "Ürün Seçimi"}
            </p>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest">
              {items.length > 1 ? `${activeIdx + 1} / ${items.length} ürün` : "Ürün 1"}
            </p>
          </div>
        </div>
        {items.length > 1 && (
          <div className="flex gap-1">
            {items.map((it, i) => (
              <button key={i} type="button" onClick={() => setActiveIdx(i)}
                className={`w-6 h-6 rounded-md text-[10px] font-bold border transition-colors ${
                  i === activeIdx ? "bg-amber-500 border-amber-400 text-white" :
                  it.title ? "bg-stone-700 border-stone-600 text-stone-300" : "bg-stone-800 border-stone-700 text-stone-600"
                }`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <ProductForm idx={activeIdx} />

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-950/40 border border-red-800/50">
          <svg className="w-3.5 h-3.5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-xs font-semibold text-red-400">{error}</p>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2 pt-1">
        <button type="button" onClick={addProduct}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-stone-600 text-xs font-bold text-stone-400 hover:border-blue-500 hover:text-blue-400 hover:bg-stone-800/30 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Başka Ürün Ekle
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={activeIdx > 0 ? () => { setActiveIdx(activeIdx - 1); setError(""); } : onPrev}
            className="flex-1 py-3 rounded-xl border border-stone-700 text-sm font-semibold text-stone-400 hover:bg-stone-800 transition-colors">
            ← Geri
          </button>
          <button type="button" onClick={handleShowSummary}
            className="flex-1 py-3 rounded-xl bg-stone-700 hover:bg-stone-600 border border-stone-600 text-sm font-bold text-white transition-colors shadow-sm">
            Özeti Gör →
          </button>
        </div>
      </div>
    </div>
  );
}
