"use client";
import { useFormikContext, FieldArray } from "formik";
import FormikControl from "@/components/formik/FormikControl";
import { CURRENCIES } from "./constants";

export default function LineItemsSection() {
  const { values, setFieldValue, errors, touched } = useFormikContext();

  const formatPrice = (value) => {
    if (!value) return "";
    const numStr = value.toString().replace(/\./g, "");
    const num = parseInt(numStr, 10);
    if (isNaN(num)) return value;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePriceChange = (idx, e) => {
    const rawValue = e.target.value.replace(/\./g, "");
    const num = parseInt(rawValue, 10);
    setFieldValue(`lineItems.${idx}.priceOffer`, isNaN(num) ? "" : num);
  };

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-950/50 overflow-hidden">
      <div className="px-5 py-3.5 bg-stone-900/40 border-b border-stone-800">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-500">Ürünler / Hizmetler</p>
      </div>
      <div className="p-5 space-y-4">
        <FieldArray name="lineItems">
          {({ push, remove }) => (
            <>
              {values.lineItems.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-stone-700 bg-stone-900/40 overflow-hidden">
                  <div className="p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-600/30 flex items-center justify-center text-xs font-black text-amber-400">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <FormikControl control="input" type="text" label="" name={`lineItems.${idx}.title`} placeholder="Ürün / Hizmet Adı" />
                      </div>
                      {values.lineItems.length > 1 && (
                        <button type="button" onClick={() => remove(idx)}
                          className="shrink-0 w-8 h-8 rounded-lg bg-stone-800 hover:bg-red-900/40 text-stone-400 hover:text-red-400 transition-colors flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">Ürün Fotoğrafı</label>
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-stone-700">
                            <img src={item.image} alt="Ürün" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setFieldValue(`lineItems.${idx}.image`, "")}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-900/80 text-white flex items-center justify-center text-xs hover:bg-red-800 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <label className="w-20 h-20 rounded-lg border-2 border-dashed border-stone-700 flex items-center justify-center cursor-pointer hover:border-stone-600 transition-colors">
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/jpg"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setFieldValue(`lineItems.${idx}.image`, reader.result);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <svg className="w-6 h-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </label>
                        )}
                        <p className="text-xs text-stone-500">Opsiyonel - PDF'te gösterilir</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">Fiyat</label>
                        <input type="text" value={formatPrice(item.priceOffer)}
                          onChange={(e) => handlePriceChange(idx, e)}
                          placeholder="0"
                          className="w-full px-4 py-3 rounded-xl bg-stone-800/50 border border-stone-700 text-sm text-stone-300 placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">Para Birimi</label>
                        <select
                          value={item.currency}
                          onChange={(e) => setFieldValue(`lineItems.${idx}.currency`, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-stone-800/50 border border-stone-700 text-sm text-stone-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        >
                          {CURRENCIES.map((cur) => (
                            <option key={cur} value={cur}>{cur}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">Adet</label>
                        <input type="number" min="1" value={item.quantity}
                          onChange={(e) => setFieldValue(`lineItems.${idx}.quantity`, e.target.value)}
                          placeholder="1"
                          className="w-full px-4 py-3 rounded-xl bg-stone-800/50 border border-stone-700 text-sm text-stone-300 placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="border-t border-stone-700 pt-4">
                      <FormikControl control="input" type="text" label="" name={`lineItems.${idx}.notes`} placeholder="Not (opsiyonel)" />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button"
                onClick={() => push({ title: "", priceOffer: "", currency: "EUR", quantity: 1, notes: "", image: "" })}
                className="w-full py-3 px-4 rounded-xl border border-dashed border-stone-700 text-sm font-semibold text-stone-400 hover:border-stone-600 hover:text-stone-300 transition-colors">
                + Ürün/Hizmet Ekle
              </button>
              {touched.lineItems && typeof errors.lineItems === "string" && (
                <p className="text-xs text-red-400 mt-2">{errors.lineItems}</p>
              )}
            </>
          )}
        </FieldArray>
      </div>
    </div>
  );
}
