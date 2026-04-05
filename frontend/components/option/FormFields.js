"use client";
import { useState, useEffect } from "react";
import FormikControl from "../formik/FormikControl";
import { useFormikContext } from "formik";
import axios from "@/utils/axios";

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-stone-700 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-stone-700 bg-stone-900/60">
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{title}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function PillButton({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
        active ? "bg-amber-600 border-amber-500 text-white" : "bg-stone-800 border-stone-600 text-stone-300 hover:border-amber-500"
      }`}>
      {children}
    </button>
  );
}

const CURRENCIES = ["TRY", "EUR", "USD", "GBP"];

const FormFields = ({ makes, imagePreview, onImageChange, onImageRemove }) => {
  const { values, setFieldValue } = useFormikContext();
  const [masters, setMasters] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(false);

  useEffect(() => {
    if (!values.make) { setMasters([]); setFieldValue("products", []); return; }
    setLoadingMasters(true);
    axios.get(`/api/master/masterbymake/${values.make}`)
      .then(({ data }) => {
        if (data.success) setMasters(data.masters.map(m => ({ value: m._id, label: m.title })));
      })
      .catch(() => {})
      .finally(() => setLoadingMasters(false));
  }, [values.make]);

  const toggleProduct = (id) => {
    const cur = values.products || [];
    const updated = cur.includes(id) ? cur.filter(p => p !== id) : [...cur, id];
    setFieldValue("products", updated);
  };

  return (
    <div className="space-y-3">

      {/* Görsel */}
      <Section title="Görsel">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-stone-900 border border-stone-700 flex items-center justify-center overflow-hidden flex-shrink-0">
            {imagePreview
              ? <img src={imagePreview} alt="opsiyon" className="w-full h-full object-cover" />
              : <svg className="w-8 h-8 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            }
          </div>
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer px-3 py-2 bg-stone-900 border border-stone-700 text-stone-300 text-sm rounded-lg hover:border-amber-600 transition-colors">
              Görsel Seç
              <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && onImageChange(e.target.files[0])} className="hidden" />
            </label>
            {imagePreview && (
              <button type="button" onClick={onImageRemove} className="text-xs text-red-400 hover:text-red-300">Kaldır</button>
            )}
          </div>
        </div>
      </Section>

      {/* Opsiyon Bilgileri */}
      <Section title="Opsiyon Bilgileri">
        <div className="space-y-3">
          <FormikControl control="input" type="text" label="Başlık" name="title" />
          <FormikControl control="textArea" label="Açıklama" name="description" />
        </div>
      </Section>

      {/* Marka */}
      <Section title="Marka">
        <div className="flex flex-wrap gap-2">
          {makes.map((mk) => (
            <button key={mk.value} type="button"
              onClick={() => { setFieldValue("make", mk.value); setFieldValue("products", []); }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                values.make === mk.value ? "bg-amber-600 border-amber-500 text-white" : "bg-stone-800 border-stone-600 text-stone-300 hover:border-amber-500"
              }`}>
              {mk.logo && <img src={mk.logo} alt={mk.label} className="w-4 h-4 object-contain" />}
              {mk.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Master Ürünler */}
      {values.make && (
        <Section title="Ürünler">
          {loadingMasters ? (
            <p className="text-xs text-stone-500">Yükleniyor...</p>
          ) : masters.length === 0 ? (
            <p className="text-xs text-stone-500 italic">Bu markaya ait ürün bulunamadı.</p>
          ) : (
            <div className="space-y-1.5">
              {masters.map((m) => {
                const selected = (values.products || []).includes(m.value);
                return (
                  <button key={m.value} type="button" onClick={() => toggleProduct(m.value)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-colors ${
                      selected
                        ? "bg-amber-950/30 border-amber-700/50 text-amber-300"
                        : "bg-stone-800/60 border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300"
                    }`}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      selected ? "bg-amber-500 border-amber-500" : "border-stone-500"
                    }`}>
                      {selected && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs font-semibold truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>
          )}
          {(values.products?.length > 0) && (
            <p className="text-[10px] text-amber-500 font-semibold mt-2">
              {values.products.length} ürün seçildi
            </p>
          )}
        </Section>
      )}

      {/* Döviz */}
      <Section title="Döviz">
        <div className="flex gap-2">
          {CURRENCIES.map((c) => (
            <PillButton key={c} active={values.currency === c} onClick={() => setFieldValue("currency", c)}>{c}</PillButton>
          ))}
        </div>
      </Section>

      {/* Fiyatlar */}
      <Section title="Fiyatlandırma">
        <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x divide-stone-700 rounded-lg overflow-hidden border border-stone-700">
          <div className="flex flex-col gap-1 p-3 border-t-2 border-t-stone-500 border-b border-stone-800 md:border-b-0">
            <span className="text-xs text-stone-500 font-medium">Liste Fiyatı</span>
            <FormikControl control="price" name="priceList" currency={values.currency} />
          </div>
          <div className="flex flex-col gap-1 p-3 border-t-2 border-t-amber-500 border-b border-stone-800 md:border-b-0">
            <span className="text-xs text-amber-500 font-medium">Teklif Fiyatı</span>
            <FormikControl control="price" name="priceOffer" currency={values.currency} />
          </div>
          <div className="flex flex-col gap-1 p-3 border-t-2 border-t-emerald-500">
            <span className="text-xs text-emerald-500 font-medium">Net Fiyat</span>
            <FormikControl control="price" name="priceNet" currency={values.currency} />
          </div>
        </div>
      </Section>

    </div>
  );
};
export default FormFields;
