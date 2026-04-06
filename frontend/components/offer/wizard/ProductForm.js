"use client";
import { useEffect } from "react";
import { useFormikContext } from "formik";
import { formPrice } from "@/lib/helpers";
import { useOfferItems } from "../useProductMasters";
import { useLineItemHandlers } from "../useLineItemHandlers";
import FormikControl from "@/components/formik/FormikControl";

function SectionLabel({ children }) {
  return <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">{children}</p>;
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

export default function ProductForm({ idx }) {
  const { values, setFieldValue } = useFormikContext();
  const { items, makes, loading } = useOfferItems();
  const { handleMakeSelect, handleProductSelect, handleVariantSelect } = useLineItemHandlers(items, makes);

  const item = values.lineItems[idx];

  // Edit modda: items yüklenince productValue'ya göre makeId'yi otomatik doldur
  useEffect(() => {
    if (!item || item.selectedMakeId || !item.productValue || !items.length) return;
    const master = items.find(o => o.value === String(item.productValue));
    if (master?.makeId) {
      setFieldValue(`lineItems.${idx}.selectedMakeId`, master.makeId);
      setFieldValue(`lineItems.${idx}.makeName`, master.makeName || "");
    }
  }, [items, item?.productValue]);

  if (loading) return <div className="text-stone-500 text-sm py-6 text-center">Ürünler yükleniyor...</div>;

  if (!item) return null;

  const filteredItems = item.selectedMakeId ? items.filter(p => p.makeId === item.selectedMakeId) : [];
  const master = items.find(o => o.value === item.productValue);
  const variants = master?.variants || [];

  const recalcPrice = (selectedOptions) => {
    const base = { list: item.variantPriceList || 0, offer: item.variantPriceOffer || 0, net: item.variantPriceNet || 0 };
    const optTotal = (key) => selectedOptions.reduce((s, o) => s + (o[key] || 0) * (o.quantity || 1), 0);
    setFieldValue(`lineItems.${idx}.priceList`, base.list + optTotal("listPrice"));
    setFieldValue(`lineItems.${idx}.priceOffer`, base.offer + optTotal("offerPrice"));
    setFieldValue(`lineItems.${idx}.priceNet`, base.net + optTotal("netPrice"));
  };

  const handleOptionToggle = (option) => {
    const cur = item.selectedOptions || [];
    const exists = cur.find(o => o.value === option.value);
    const updated = exists
      ? cur.filter(o => o.value !== option.value)
      : [...cur, { value: option.value, label: option.label, listPrice: option.listPrice, offerPrice: option.offerPrice, netPrice: option.netPrice, currency: option.currency, desc: option.desc, image: option.image || "", quantity: 1 }];
    setFieldValue(`lineItems.${idx}.selectedOptions`, updated);
    recalcPrice(updated);
  };

  return (
    <div className="space-y-4">
      {/* Marka */}
      <div>
        <SectionLabel>Marka Seç</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {makes.map(mk => (
            <button key={mk.value} type="button" onClick={() => handleMakeSelect(idx, mk.value)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
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
          <SectionLabel>Ürün Seç</SectionLabel>
          <div className="rounded-xl border border-stone-600 divide-y divide-stone-700 overflow-hidden">
            {filteredItems.map(product => {
              const sel = item.productValue === product.value;
              return (
                <label key={product.value} className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors ${sel ? "bg-blue-900/25 border-l-2 border-l-blue-500" : "hover:bg-stone-700/30"}`}>
                  <input type="radio" className="sr-only" checked={sel} onChange={() => handleProductSelect(idx, product.value)} />
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-stone-800 border border-stone-700 overflow-hidden flex items-center justify-center">
                    {product.image ? <img src={product.image} alt={product.label} className="w-full h-full object-cover" />
                      : <svg className="w-4 h-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${sel ? "text-white" : "text-stone-200"}`}>{product.label}</p>
                    {product.desc && <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{product.desc}</p>}
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
            {variants.map(v => {
              const val = String(v._id); const sel = item.selectedVariantId === val;
              return (
                <label key={val} className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors ${sel ? "bg-blue-900/25 border-l-2 border-l-blue-500" : "hover:bg-stone-700/30"}`}>
                  <input type="radio" className="sr-only" checked={sel} onChange={() => handleVariantSelect(idx, val)} />
                  <RadioDot checked={sel} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${sel ? "text-white" : "text-stone-200"}`}>{v.modelType}</p>
                    {v.code && <p className="text-xs font-mono text-stone-500 mt-0.5">{v.code}</p>}
                  </div>
                  {v.priceList > 0 && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${sel ? "bg-blue-900/50 text-blue-200 border-blue-600/50" : "bg-stone-700 text-stone-300 border-stone-600"}`}>
                      {formPrice(v.priceList)} {master?.currency}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Opsiyonlar */}
      {item.selectedVariantId && item.options?.length > 0 && (
        <div>
          <SectionLabel>Opsiyonel Özellikler</SectionLabel>
          <div className="rounded-xl border border-stone-600 divide-y divide-stone-700 overflow-hidden">
            {item.options.map(option => {
              const selected = item.selectedOptions?.find(o => o.value === option.value);
              const isChecked = !!selected;
              return (
                <div key={option.value} className={`flex items-center gap-3 px-3 py-3 transition-colors ${isChecked ? "bg-stone-800/50" : "hover:bg-stone-700/20"}`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => handleOptionToggle(option)}>
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-stone-800 border border-stone-700 overflow-hidden flex items-center justify-center">
                      {option.image ? <img src={option.image} alt={option.label} className="w-full h-full object-cover" />
                        : <svg className="w-4 h-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isChecked ? "text-white" : "text-stone-200"}`}>{option.label}</p>
                      <span className={`text-xs font-semibold ${isChecked ? "text-emerald-400" : "text-stone-500"}`}>+{formPrice(option.listPrice)} {option.currency}</span>
                    </div>
                  </div>
                  {isChecked && (
                    <input type="number" min="1" value={selected?.quantity ?? 1}
                      onChange={(e) => {
                        const updated = item.selectedOptions.map(o => o.value === option.value ? { ...o, quantity: Number(e.target.value) } : o);
                        setFieldValue(`lineItems.${idx}.selectedOptions`, updated);
                        recalcPrice(updated);
                      }}
                      className="w-14 px-2 py-1 text-sm bg-stone-900 border border-stone-600 rounded-lg text-white text-center focus:outline-none focus:border-emerald-500" />
                  )}
                  <div className="shrink-0 cursor-pointer" onClick={() => handleOptionToggle(option)}>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isChecked ? "bg-emerald-500 border-emerald-500" : "border-stone-600"}`}>
                      {isChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fiyat + Adet */}
      {item.selectedVariantId && (
        <div>
          <SectionLabel>Fiyatlandırma</SectionLabel>
          <div className="rounded-xl border border-stone-600 overflow-hidden">
            {/* Mobile: dikey yığın  |  sm+: 3 kolon */}
            <div className="flex flex-col md:flex-row md:divide-x divide-stone-700 divide-y md:divide-y-0">
              <div className="flex-1 p-3 border-t-2 border-stone-500">
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1">Liste</p>
                <FormikControl control="price" name={`lineItems.${idx}.priceList`} currency={item.currency} />
              </div>
              <div className="flex-1 p-3 border-t-2 border-amber-500">
                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mb-1">Teklif</p>
                <FormikControl control="price" name={`lineItems.${idx}.priceOffer`} currency={item.currency} />
              </div>
              <div className="flex-1 p-3 border-t-2 border-emerald-500">
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mb-1">Net</p>
                <FormikControl control="price" name={`lineItems.${idx}.priceNet`} currency={item.currency} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-0 border-t border-stone-700 divide-x divide-stone-700">
              {/* Döviz seçici */}
              <div className="p-3">
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-2">Döviz</p>
                <div className="flex gap-1.5 flex-wrap">
                  {["EUR","USD","TRY","GBP","CHF"].map(cur => (
                    <button key={cur} type="button"
                      onClick={() => setFieldValue(`lineItems.${idx}.currency`, cur)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                        item.currency === cur
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "bg-stone-800 border-stone-600 text-stone-400 hover:border-stone-400 hover:text-stone-200"
                      }`}>
                      {cur}
                    </button>
                  ))}
                </div>
              </div>
              {/* Adet stepper */}
              <div className="p-3">
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-2">Adet</p>
                <div className="flex items-center gap-2">
                  <button type="button"
                    onClick={() => setFieldValue(`lineItems.${idx}.quantity`, Math.max(1, (item.quantity || 1) - 1))}
                    className="w-8 h-8 rounded-lg bg-stone-800 border border-stone-600 hover:bg-stone-700 hover:border-stone-500 flex items-center justify-center text-stone-300 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-stone-100 tabular-nums">
                    {item.quantity || 1}
                  </span>
                  <button type="button"
                    onClick={() => setFieldValue(`lineItems.${idx}.quantity`, (item.quantity || 1) + 1)}
                    className="w-8 h-8 rounded-lg bg-stone-800 border border-stone-600 hover:bg-stone-700 hover:border-stone-500 flex items-center justify-center text-stone-300 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <FormikControl control="textArea" label="Not" name={`lineItems.${idx}.notes`} />
          </div>
        </div>
      )}
    </div>
  );
}
