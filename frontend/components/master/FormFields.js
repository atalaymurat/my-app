"use client";
import FormikControl from "../formik/FormikControl";
import { FieldArray, useFormikContext } from "formik";
import { useState, useEffect } from "react";
import axios from "@/utils/axios";

const EMPTY_VARIANT = { modelType: "", code: "", priceNet: "", priceOffer: "", priceList: "", stock: "", technicalSpecs: [{ key: "", value: "" }] };
const EMPTY_SPEC = { key: "", value: "" };

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
        active ? "bg-amber-600 border-amber-500 text-white" : "bg-stone-800 border-stone-600 text-stone-300 hover:border-amber-500 hover:text-white"
      }`}>
      {children}
    </button>
  );
}

function OptionCard({ option, checked, onChange }) {
  return (
    <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all select-none ${
      checked ? "border-amber-500 bg-amber-900/15" : "border-stone-700 bg-stone-900/40 hover:border-stone-600"
    }`}>
      {/* Checkbox */}
      <div className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition-colors ${
        checked ? "bg-amber-500 border-amber-500" : "border-stone-600 bg-stone-800"
      }`}>
        {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
      </div>
      {/* Görsel */}
      <div className="w-[45px] h-[45px] rounded bg-stone-800 border border-stone-700 flex-shrink-0 overflow-hidden">
        {option.image
          ? <img src={option.image} alt={option.label} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-stone-600 text-[10px] font-bold">{option.label?.charAt(0)?.toUpperCase()}</div>
        }
      </div>
      {/* Bilgi */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold leading-tight truncate ${checked ? "text-amber-300" : "text-stone-300"}`}>{option.label}</p>
        {option.description && <p className="text-[10px] text-stone-500 leading-tight truncate">{option.description}</p>}
      </div>
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
    </label>
  );
}

const FormFields = ({ loading, makes, isEdit, imagePreview, onImageChange, onImageRemove }) => {
  const { values, setFieldValue } = useFormikContext();
  const [options, setOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [prevMake, setPrevMake] = useState(null);

  useEffect(() => {
    if (!values.make) { setOptions([]); setFieldValue("options", []); return; }
    setLoadingOptions(true);
    axios.get(`/api/option/make/${values.make}`)
      .then(({ data }) => { if (data.success) setOptions(data.options.map((o) => ({ value: o._id, label: o.title, image: o.image || "", description: o.description || "" }))); })
      .catch(() => {})
      .finally(() => setLoadingOptions(false));
    // Kullanıcı make'i değiştirdiyse sıfırla, ilk yüklemede değil
    if (prevMake !== null && prevMake !== values.make) setFieldValue("options", []);
    setPrevMake(values.make);
  }, [values.make]);

  const toggleOption = (val) => {
    const cur = values.options || [];
    setFieldValue("options", cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]);
  };

  return (
    <div className="space-y-3">

      {/* Ürün Görseli */}
      <Section title="Ürün Görseli">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-stone-900 border border-stone-700 flex items-center justify-center overflow-hidden flex-shrink-0">
            {imagePreview
              ? <img src={imagePreview} alt="ürün" className="w-full h-full object-contain p-1" />
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

      {/* Marka — sadece yeni formda */}
      {!isEdit && <Section title="Marka">
        {loading ? <p className="text-stone-500 text-xs">Yükleniyor...</p> : (
          <div className="flex flex-wrap gap-2">
            {makes.map((mk) => (
              <button key={mk.value} type="button" onClick={() => setFieldValue("make", mk.value)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  values.make === mk.value ? "bg-amber-600 border-amber-500 text-white" : "bg-stone-800 border-stone-600 text-stone-300 hover:border-amber-500"
                }`}>
                {mk.logo && <img src={mk.logo} alt={mk.label} className="w-4 h-4 object-contain" />}
                {mk.label}
              </button>
            ))}
          </div>
        )}
      </Section>}

      {/* Temel Bilgiler */}
      <Section title="Temel Bilgiler">
        <div className="space-y-3">
          <FormikControl control="input" type="text" label="Model Ailesi" name="model" />
          <FormikControl control="input" type="text" label="Alt Başlık" name="caption" />
        </div>
      </Section>

      {/* Durum & Döviz */}
      <Section title="Durum">
        <div className="flex flex-wrap gap-2">
          {[{ label: "Yeni", value: "new" }, { label: "Kullanılmış", value: "used" }, { label: "Sıfırlanmış", value: "refurbished" }].map((o) => (
            <PillButton key={o.value} active={values.condition === o.value} onClick={() => setFieldValue("condition", o.value)}>{o.label}</PillButton>
          ))}
        </div>
      </Section>

      <Section title="Döviz">
        <div className="flex gap-2">
          {[{ label: "TL", value: "TRY" }, { label: "EUR", value: "EUR" }, { label: "USD", value: "USD" }].map((o) => (
            <PillButton key={o.value} active={values.currency === o.value} onClick={() => setFieldValue("currency", o.value)}>{o.label}</PillButton>
          ))}
        </div>
      </Section>

      {/* Opsiyonlar */}
      {loadingOptions ? (
        <p className="text-stone-500 text-xs px-2">Opsiyonlar yükleniyor...</p>
      ) : options.length > 0 && (
        <Section title={`Opsiyonlar (${values.options?.length || 0}/${options.length})`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
            {options.map((opt) => (
              <OptionCard key={opt.value} option={opt}
                checked={values.options?.includes(opt.value)}
                onChange={() => toggleOption(opt.value)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Varyantlar */}
      <FieldArray name="variants">
        {({ push, remove }) => (
          <div className="space-y-3">
            {values.variants.map((variant, index) => (
              <div key={index} className="rounded-xl border border-stone-700 border-l-4 border-l-amber-500 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-2.5 border-b border-stone-700 bg-stone-800/40">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-600/40 shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="flex-1 text-sm font-semibold text-stone-200 truncate">
                    {variant.modelType || <span className="text-stone-500 italic font-normal">Varyant başlığı girilmedi</span>}
                  </p>
                  {values.variants.length > 1 && (
                    <button type="button" onClick={() => remove(index)}
                      className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-stone-600 hover:border-red-700 text-stone-400 hover:text-red-400 bg-stone-800 hover:bg-red-950/30 transition-colors">
                      Sil
                    </button>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  {/* Model tipi + kodu — tek kolon mobil, 2 kolon md+ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormikControl control="input" type="text" label="Model Tipi" name={`variants.${index}.modelType`} />
                    <FormikControl control="input" type="text" label="Model Kodu" name={`variants.${index}.code`} />
                  </div>
                  <FormikControl control="input" type="number" label="Stok Adedi" name={`variants.${index}.stock`} />

                  {/* Fiyatlandırma — tek kolon mobil, 3 kolon md+ */}
                  <div className="rounded-xl border border-stone-700 overflow-hidden">
                    <div className="px-3 py-2 border-b border-stone-700 bg-stone-900/60">
                      <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Fiyatlandırma</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x divide-stone-700">
                      <div className="flex flex-col gap-1 p-3 border-t-2 border-t-stone-500 border-b border-stone-800 md:border-b-0">
                        <span className="text-xs text-stone-500 font-medium">Liste Fiyatı</span>
                        <FormikControl control="price" name={`variants.${index}.priceList`} />
                      </div>
                      <div className="flex flex-col gap-1 p-3 border-t-2 border-t-amber-500 border-b border-stone-800 md:border-b-0">
                        <span className="text-xs text-amber-500 font-medium">Teklif Fiyatı</span>
                        <FormikControl control="price" name={`variants.${index}.priceOffer`} />
                      </div>
                      <div className="flex flex-col gap-1 p-3 border-t-2 border-t-emerald-500">
                        <span className="text-xs text-emerald-500 font-medium">Net Fiyat</span>
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
                              <div className="flex-1"><FormikControl control="input" type="text" label="Tanım" name={`variants.${index}.technicalSpecs.${idx}.key`} /></div>
                              <div className="flex-1"><FormikControl control="input" type="text" label="Değer" name={`variants.${index}.technicalSpecs.${idx}.value`} /></div>
                              {variant.technicalSpecs.length > 1 && (
                                <button type="button" onClick={() => removeSpec(idx)}
                                  className="mb-1 px-2 py-1.5 text-xs rounded-lg border border-stone-600 hover:border-red-700 text-stone-400 hover:text-red-400 bg-stone-800 transition-colors">✕</button>
                              )}
                            </div>
                          ))}
                          <button type="button" onClick={() => pushSpec({ ...EMPTY_SPEC })}
                            className="w-full flex items-center justify-center gap-1 py-2 rounded-lg border border-dashed border-stone-700 text-xs font-medium text-stone-500 hover:border-stone-500 hover:text-stone-300 transition-colors">
                            + Spec Ekle
                          </button>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => push({ ...EMPTY_VARIANT, technicalSpecs: [{ ...EMPTY_SPEC }] })}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-stone-600 text-xs font-semibold text-stone-500 hover:border-stone-400 hover:text-stone-300 hover:bg-stone-800/30 transition-colors">
              + Varyant Ekle
            </button>
          </div>
        )}
      </FieldArray>
    </div>
  );
};
export default FormFields;
