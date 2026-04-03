import { useEffect } from "react";
import { FieldArray, useFormikContext } from "formik";
import { formPrice } from "@/lib/helpers";
import { useOfferItems } from "./useProductMasters";
import { useLineItemHandlers } from "./useLineItemHandlers";
import { LineItem } from "./LineItem";
import axios from "@/utils/axios";

const EMPTY_LINE_ITEM = {
  title: "", productValue: "", selectedMakeId: "", selectedVariantId: "",
  makeName: "", variantCode: "", variantModel: "",
  variantPriceList: 0, variantPriceOffer: 0, variantPriceNet: 0,
  priceList: "", priceOffer: "", priceNet: "", currency: "",
  options: [], selectedOptions: [], quantity: 1, notes: "", condition: "",
};

function ImagePlaceholder() {
  return (
    <div className="shrink-0 w-9 h-9 rounded-lg bg-stone-700 border border-stone-600 flex items-center justify-center">
      <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3 3h18" />
      </svg>
    </div>
  );
}

function RadioDot({ checked }) {
  return (
    <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
      checked ? "border-blue-400 bg-blue-500" : "border-stone-500 bg-stone-800"
    }`}>
      {checked && <div className="w-2 h-2 rounded-full bg-white" />}
    </div>
  );
}

function SectionLabel({ children }) {
  return <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">{children}</p>;
}

export default function LineItemsFields() {
  const { items, makes, loading } = useOfferItems();
  const { values, setFieldValue } = useFormikContext();
  const { handleMakeSelect, handleProductSelect, handleVariantSelect } = useLineItemHandlers(items, makes);

  useEffect(() => {
    values.lineItems.forEach(async (item, idx) => {
      const isDBItem = !!item.title && !item.selectedMakeId;
      if (isDBItem && item.productValue && (!item.options || item.options.length === 0)) {
        try {
          const { data } = await axios.get(`/api/option/list/${item.productValue}`);
          if (data.list?.length > 0) setFieldValue(`lineItems.${idx}.options`, data.list);
        } catch {}
      }
    });
  }, []);

  if (loading) return <div className="text-stone-400 px-2 py-4 text-sm">Yükleniyor...</div>;

  return (
    <FieldArray name="lineItems">
      {({ push, remove }) => (
        <div className="my-2 space-y-2">

          {values.lineItems.map((item, idx) => {
            const isDBItem    = !!item.title && !item.selectedMakeId;
            const showDetails = !!item.title && !isDBItem;
            const filteredItems = item.selectedMakeId ? items.filter((p) => p.makeId === item.selectedMakeId) : [];
            const master    = items.find((o) => o.value === item.productValue);
            const variants  = master?.variants || [];
            const canRemove = values.lineItems.length > 1;
            const num       = String(idx + 1).padStart(2, "0");

            return (
              <div key={idx} className={`rounded-xl overflow-hidden border-l-4 ${
                isDBItem
                  ? "border-l-stone-600 border border-stone-700 bg-stone-900"
                  : "border-l-amber-500 border border-stone-600 bg-stone-800/60"
              }`}>

                {/* ── Item header ── */}
                <div className={`flex items-center gap-3 px-4 py-2.5 border-b ${
                  isDBItem ? "border-stone-700/60 bg-stone-800/40" : "border-stone-600/60 bg-stone-700/30"
                }`}>
                  {/* Numara */}
                  <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isDBItem ? "bg-stone-700 text-stone-400" : "bg-amber-500/20 text-amber-400 border border-amber-600/40"
                  }`}>{num}</span>

                  {/* Başlık */}
                  <div className="flex-1 min-w-0">
                    {item.title
                      ? <p className="text-sm font-semibold text-stone-200 truncate capitalize">{item.title}</p>
                      : <p className="text-sm text-stone-500 italic">Ürün seçilmedi</p>
                    }
                  </div>

                  {/* Durum + Aksiyonlar */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isDBItem
                      ? <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 bg-stone-800 border border-stone-700 px-2 py-0.5 rounded-full">Kilitli</span>
                      : item.selectedVariantId
                        ? <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-950/40 border border-amber-800/50 px-2 py-0.5 rounded-full">Düzenleniyor</span>
                        : <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 bg-stone-800/60 border border-stone-700 px-2 py-0.5 rounded-full">Seçim</span>
                    }
                    {isDBItem && (
                      <button type="button"
                        onClick={() => {
                          const m = items.find((p) => p.value === item.productValue);
                          setFieldValue(`lineItems.${idx}.selectedMakeId`, m?.makeId || "_");
                          setFieldValue(`lineItems.${idx}.makeName`, m?.makeName || "");
                        }}
                        className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-stone-600 hover:border-amber-600 text-stone-400 hover:text-amber-400 bg-stone-800 hover:bg-amber-950/30 transition-colors">
                        Değiştir
                      </button>
                    )}
                    {canRemove && (
                      <button type="button" onClick={() => remove(idx)}
                        className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-stone-600 hover:border-red-700 text-stone-400 hover:text-red-400 bg-stone-800 hover:bg-red-950/30 transition-colors flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        Sil
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Seçim akışı ── */}
                {!isDBItem && (
                  <div className="p-4 space-y-4">

                    {/* Marka */}
                    <div>
                      <SectionLabel>Marka</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {makes.map((mk) => (
                          <button key={mk.value} type="button"
                            onClick={() => handleMakeSelect(idx, mk.value)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                              item.selectedMakeId === mk.value
                                ? "bg-blue-600 border-blue-500 text-white shadow-sm shadow-blue-900/50"
                                : "bg-stone-800 border-stone-600 text-stone-300 hover:border-blue-500 hover:text-white"
                            }`}>
                            {mk.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ürün */}
                    {item.selectedMakeId && (
                      <div>
                        <SectionLabel>Ürün</SectionLabel>
                        <div className="rounded-xl border border-stone-600 divide-y divide-stone-700 overflow-hidden">
                          {filteredItems.map((product) => {
                            const sel = item.productValue === product.value;
                            return (
                              <label key={product.value}
                                className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                                  sel ? "bg-blue-900/25 border-l-2 border-l-blue-500" : "hover:bg-stone-700/40"
                                }`}>
                                <input type="radio" className="sr-only"
                                  name={`lineItems.${idx}.productValue`} value={product.value}
                                  checked={sel} onChange={() => handleProductSelect(idx, product.value)} />
                                <ImagePlaceholder />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-semibold leading-snug ${sel ? "text-white" : "text-stone-200"}`}>{product.label}</p>
                                  {product.desc && <p className="text-xs text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">{product.desc}</p>}
                                </div>
                                <RadioDot checked={sel} />
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Varyant */}
                    {item.productValue && variants.length > 0 && (
                      <div>
                        <SectionLabel>Model / Varyant</SectionLabel>
                        <div className="rounded-xl border border-stone-600 divide-y divide-stone-700 overflow-hidden">
                          {variants.map((v) => {
                            const val = String(v._id);
                            const sel = item.selectedVariantId === val;
                            return (
                              <label key={val}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                                  sel ? "bg-blue-900/25 border-l-2 border-l-blue-500" : "hover:bg-stone-700/40"
                                }`}>
                                <input type="radio" className="sr-only"
                                  name={`lineItems.${idx}.selectedVariantId`} value={val}
                                  checked={sel} onChange={() => handleVariantSelect(idx, val)} />
                                <RadioDot checked={sel} />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-semibold ${sel ? "text-white" : "text-stone-200"}`}>{v.modelType}</p>
                                  {v.code && <p className="text-xs text-stone-500 mt-0.5 font-mono">{v.code}</p>}
                                  {v.desc && <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">{v.desc}</p>}
                                </div>
                                {v.priceList > 0 && (
                                  <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg border ${
                                    sel
                                      ? "bg-blue-900/50 text-blue-200 border-blue-600/50"
                                      : "bg-stone-700 text-stone-300 border-stone-600"
                                  }`}>{formPrice(v.priceList)} {master?.currency}</span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Fiyat / Opsiyon / Not ── */}
                {showDetails && (
                  <div className="border-t border-stone-600/60">
                    <LineItem index={idx} item={item} />
                  </div>
                )}

              </div>
            );
          })}

          {/* Ürün Ekle */}
          <button type="button" onClick={() => push({ ...EMPTY_LINE_ITEM })}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-stone-600 text-xs font-semibold text-stone-500 hover:border-stone-400 hover:text-stone-300 hover:bg-stone-800/30 transition-colors mt-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Ürün Ekle
          </button>
        </div>
      )}
    </FieldArray>
  );
}
