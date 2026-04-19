"use client";
import { useFormikContext, FieldArray } from "formik";
import FormikControl from "@/components/formik/FormikControl";
import { CURRENCIES } from "./constants";

export default function LineItemsSection() {
  const { values, setFieldValue, errors, touched } = useFormikContext();

  return (
    <div className="rounded-xl border border-stone-700 overflow-hidden">
      <div className="px-4 py-2.5 bg-stone-900/70 border-b border-stone-700">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Ürünler / Hizmetler</p>
      </div>
      <div className="p-4 sm:p-5 space-y-3">
        <FieldArray name="lineItems">
          {({ push, remove }) => (
            <>
              {values.lineItems.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-stone-700 bg-stone-900/40 overflow-hidden">
                  {/* Desktop */}
                  <div className="hidden sm:block p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-md bg-amber-500/20 border border-amber-600/30 flex items-center justify-center text-[10px] font-black text-amber-400">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <FormikControl control="input" type="text" label="" name={`lineItems.${idx}.title`} placeholder="Ürün / Hizmet Adı" />
                      </div>
                      {values.lineItems.length > 1 && (
                        <button type="button" onClick={() => remove(idx)}
                          className="shrink-0 w-7 h-7 rounded-lg bg-stone-800 hover:bg-red-900/40 text-stone-400 hover:text-red-400 transition-colors flex items-center justify-center text-lg">
                          −
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-[1fr_auto_100px] gap-3 items-center">
                      <div>
                        <label className="text-[10px] text-stone-500 font-bold uppercase mb-1.5 block">Fiyat</label>
                        <input type="number" step="0.01" value={item.priceOffer}
                          onChange={(e) => setFieldValue(`lineItems.${idx}.priceOffer`, e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 placeholder-stone-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-colors"
                        />
                      </div>
                      <div className="flex gap-1">
                        {CURRENCIES.map((cur) => (
                          <button key={cur} type="button"
                            onClick={() => setFieldValue(`lineItems.${idx}.currency`, cur)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${item.currency === cur ? "bg-blue-600 border-blue-500 text-white" : "bg-stone-800 border-stone-700 text-stone-500 hover:text-stone-300"}`}>
                            {cur}
                          </button>
                        ))}
                      </div>
                      <div>
                        <label className="text-[10px] text-stone-500 font-bold uppercase mb-1.5 block">Adet</label>
                        <input type="number" min="1" value={item.quantity}
                          onChange={(e) => setFieldValue(`lineItems.${idx}.quantity`, e.target.value)}
                          placeholder="1"
                          className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 placeholder-stone-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="border-t border-stone-600 pt-3">
                      <FormikControl control="input" type="text" label="" name={`lineItems.${idx}.notes`} placeholder="Not (opsiyonel)" />
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="sm:hidden space-y-2 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="shrink-0 w-6 h-6 rounded-md bg-amber-500/20 border border-amber-600/30 flex items-center justify-center text-[10px] font-black text-amber-400">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <FormikControl control="input" type="text" label="" name={`lineItems.${idx}.title`} placeholder="Ürün / Hizmet Adı" />
                      </div>
                      {values.lineItems.length > 1 && (
                        <button type="button" onClick={() => remove(idx)}
                          className="shrink-0 w-7 h-7 rounded-lg bg-stone-800 hover:bg-red-900/40 text-stone-400 hover:text-red-400 transition-colors flex items-center justify-center text-lg">
                          −
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase mb-1.5 block">Fiyat</label>
                        <input type="number" step="0.01" value={item.priceOffer}
                          onChange={(e) => setFieldValue(`lineItems.${idx}.priceOffer`, e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 placeholder-stone-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-colors"
                        />
                      </div>
                      <div className="flex gap-1">
                        {CURRENCIES.map((cur) => (
                          <button key={cur} type="button"
                            onClick={() => setFieldValue(`lineItems.${idx}.currency`, cur)}
                            className={`px-1.5 py-1.5 rounded text-[10px] font-bold border transition-colors ${item.currency === cur ? "bg-blue-600 border-blue-500 text-white" : "bg-stone-800 border-stone-700 text-stone-500 hover:text-stone-300"}`}>
                            {cur}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold uppercase mb-1.5 block">Adet</label>
                      <input type="number" min="1" value={item.quantity}
                        onChange={(e) => setFieldValue(`lineItems.${idx}.quantity`, e.target.value)}
                        placeholder="1"
                        className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 placeholder-stone-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-colors"
                      />
                    </div>
                    <div className="border-t border-stone-600 pt-2">
                      <FormikControl control="input" type="text" label="" name={`lineItems.${idx}.notes`} placeholder="Not (opsiyonel)" />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button"
                onClick={() => push({ title: "", priceOffer: "", currency: "EUR", quantity: 1, notes: "" })}
                className="w-full py-2 px-3 rounded-lg border border-dashed border-stone-600 text-sm font-semibold text-stone-400 hover:border-stone-500 hover:text-stone-300 transition-colors">
                + Ürün/Hizmet Ekle
              </button>
              {touched.lineItems && typeof errors.lineItems === "string" && (
                <p className="text-xs text-red-400 mt-1">{errors.lineItems}</p>
              )}
            </>
          )}
        </FieldArray>
      </div>
    </div>
  );
}
