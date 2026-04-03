"use client";
import FormikControl from "../formik/FormikControl";
import { FieldArray, useFormikContext } from "formik";
import { useState, useEffect } from "react";
import axios from "@/utils/axios";

const EMPTY_VARIANT = { modelType: "", code: "", priceNet: "", priceOffer: "", priceList: "", stock: "", technicalSpecs: [{ key: "", value: "" }] };
const EMPTY_SPEC = { key: "", value: "" };

function SectionLabel({ children }) {
  return <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">{children}</p>;
}

function PillButton({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
        active
          ? "bg-blue-600 border-blue-500 text-white shadow-sm shadow-blue-900/50"
          : "bg-stone-800 border-stone-600 text-stone-300 hover:border-blue-500 hover:text-white"
      }`}>
      {children}
    </button>
  );
}

const FormFields = ({ loading, makes }) => {
  const { values, setFieldValue } = useFormikContext();
  const [options, setOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    if (!values.make) { setOptions([]); setFieldValue("options", []); return; }
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        const { data } = await axios.get(`/api/option/make/${values.make}`);
        if (data.success) setOptions(data.options.map((opt) => ({ value: opt._id, label: opt.title })));
      } catch { /* ignore */ }
      finally { setLoadingOptions(false); }
    };
    fetchOptions();
    setFieldValue("options", []);
  }, [values.make]);

  return (
    <div className="space-y-4">

      {/* Marka */}
      <div className="rounded-xl border border-stone-700 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-stone-700 bg-stone-900/60">
          <SectionLabel>Marka</SectionLabel>
        </div>
        <div className="p-4">
          {loading ? (
            <p className="text-stone-500 text-xs">Yükleniyor...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {makes.map((mk) => (
                <PillButton key={mk.value} active={values.make === mk.value} onClick={() => setFieldValue("make", mk.value)}>
                  {mk.label}
                </PillButton>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Temel Bilgiler */}
      <div className="rounded-xl border border-stone-700 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-stone-700 bg-stone-900/60">
          <SectionLabel>Temel Bilgiler</SectionLabel>
        </div>
        <div className="p-4 space-y-3">
          <FormikControl control="input" type="text" label="Model Ailesi" name="model" />
          <FormikControl control="input" type="text" label="Alt Başlık" name="caption" />
        </div>
      </div>

      {/* Durum & Döviz */}
      <div className="rounded-xl border border-stone-700 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-stone-700 bg-stone-900/60">
          <SectionLabel>Durum</SectionLabel>
        </div>
        <div className="p-4">
          <div className="flex gap-2">
            {[{ label: "Yeni", value: "new" }, { label: "Kullanılmış", value: "used" }, { label: "Sıfırlanmış", value: "refurbished" }].map((opt) => (
              <PillButton key={opt.value} active={values.condition === opt.value} onClick={() => setFieldValue("condition", opt.value)}>
                {opt.label}
              </PillButton>
            ))}
          </div>
        </div>
      </div>

      {/* Döviz */}
      <div className="rounded-xl border border-stone-700 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-stone-700 bg-stone-900/60">
          <SectionLabel>Döviz</SectionLabel>
        </div>
        <div className="p-4">
          <div className="flex gap-2">
            {[{ label: "TL", value: "TRY" }, { label: "EUR", value: "EUR" }, { label: "USD", value: "USD" }].map((opt) => (
              <PillButton key={opt.value} active={values.currency === opt.value} onClick={() => setFieldValue("currency", opt.value)}>
                {opt.label}
              </PillButton>
            ))}
          </div>
        </div>
      </div>

      {/* Opsiyonlar */}
      {loadingOptions ? (
        <p className="text-stone-500 text-xs px-2">Opsiyonlar yükleniyor...</p>
      ) : options.length > 0 && (
        <div className="rounded-xl border border-stone-700 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-stone-700 bg-stone-900/60">
            <SectionLabel>Opsiyonlar</SectionLabel>
          </div>
          <div className="p-4">
            <FormikControl control="checkboxGroup" label="" name="options" options={options} />
          </div>
        </div>
      )}

      {/* Varyantlar */}
      <FieldArray name="variants">
        {({ push, remove }) => (
          <div className="space-y-3">
            {values.variants.map((variant, index) => {
              const num = String(index + 1).padStart(2, "0");
              return (
                <div key={index} className="rounded-xl border border-stone-700 border-l-4 border-l-amber-500 overflow-hidden">
                  {/* Variant header */}
                  <div className="flex items-center gap-3 px-4 py-2.5 border-b border-stone-700 bg-stone-800/40">
                    <span className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-600/40">
                      {num}
                    </span>
                    <p className="flex-1 text-sm font-semibold text-stone-200 truncate">
                      {variant.modelType || <span className="text-stone-500 italic font-normal">Varyant başlığı girilmedi</span>}
                    </p>
                    {values.variants.length > 1 && (
                      <button type="button" onClick={() => remove(index)}
                        className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-stone-600 hover:border-red-700 text-stone-400 hover:text-red-400 bg-stone-800 hover:bg-red-950/30 transition-colors flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        Sil
                      </button>
                    )}
                  </div>

                  {/* Variant body */}
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <FormikControl control="input" type="text" label="Model Tipi" name={`variants.${index}.modelType`} />
                      <FormikControl control="input" type="text" label="Model Kodu" name={`variants.${index}.code`} />
                    </div>
                    <FormikControl control="input" type="number" label="Stok Adedi" name={`variants.${index}.stock`} />

                    {/* Prices */}
                    <div className="rounded-xl border border-stone-700 overflow-hidden">
                      <div className="px-3 py-2 border-b border-stone-700 bg-stone-900/60">
                        <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Fiyatlandırma</p>
                      </div>
                      <div className="grid grid-cols-3 divide-x divide-stone-700">
                        <div className="flex flex-col gap-1 p-3 border-t-2 border-t-stone-500">
                          <span className="text-xs text-stone-500 font-medium">Liste</span>
                          <FormikControl control="price" name={`variants.${index}.priceList`} />
                        </div>
                        <div className="flex flex-col gap-1 p-3 border-t-2 border-t-amber-500">
                          <span className="text-xs text-amber-500 font-medium">Teklif</span>
                          <FormikControl control="price" name={`variants.${index}.priceOffer`} />
                        </div>
                        <div className="flex flex-col gap-1 p-3 border-t-2 border-t-emerald-500">
                          <span className="text-xs text-emerald-500 font-medium">Net</span>
                          <FormikControl control="price" name={`variants.${index}.priceNet`} />
                        </div>
                      </div>
                    </div>

                    {/* Teknik Specs */}
                    <FieldArray name={`variants.${index}.technicalSpecs`}>
                      {({ push: pushSpec, remove: removeSpec }) => (
                        <div className="rounded-xl border border-stone-700 overflow-hidden">
                          <div className="px-4 py-2.5 border-b border-stone-700 bg-stone-900/60">
                            <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Teknik Veriler</p>
                          </div>
                          <div className="p-3 space-y-2">
                            {variant.technicalSpecs?.map((_spec, idx) => (
                              <div key={idx} className="flex gap-2 items-end">
                                <div className="flex-1">
                                  <FormikControl control="input" type="text" label="Tanım" name={`variants.${index}.technicalSpecs.${idx}.key`} />
                                </div>
                                <div className="flex-1">
                                  <FormikControl control="input" type="text" label="Değer" name={`variants.${index}.technicalSpecs.${idx}.value`} />
                                </div>
                                {variant.technicalSpecs.length > 1 && (
                                  <button type="button" onClick={() => removeSpec(idx)}
                                    className="mb-1 px-2 py-1.5 text-xs rounded-lg border border-stone-600 hover:border-red-700 text-stone-400 hover:text-red-400 bg-stone-800 transition-colors">
                                    ✕
                                  </button>
                                )}
                              </div>
                            ))}
                            <button type="button" onClick={() => pushSpec({ ...EMPTY_SPEC })}
                              className="w-full flex items-center justify-center gap-1 py-2 rounded-lg border border-dashed border-stone-700 text-xs font-medium text-stone-500 hover:border-stone-500 hover:text-stone-300 hover:bg-stone-800/30 transition-colors">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                              Spec Ekle
                            </button>
                          </div>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                </div>
              );
            })}

            {/* Varyant Ekle */}
            <button type="button" onClick={() => push({ ...EMPTY_VARIANT, technicalSpecs: [{ ...EMPTY_SPEC }] })}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-stone-600 text-xs font-semibold text-stone-500 hover:border-stone-400 hover:text-stone-300 hover:bg-stone-800/30 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Varyant Ekle
            </button>
          </div>
        )}
      </FieldArray>
    </div>
  );
};
export default FormFields;
