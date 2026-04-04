"use client";
import FormikControl from "../formik/FormikControl";
import { useFormikContext } from "formik";

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

      {/* Başlık */}
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
            <button key={mk.value} type="button" onClick={() => setFieldValue("make", mk.value)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                values.make === mk.value ? "bg-amber-600 border-amber-500 text-white" : "bg-stone-800 border-stone-600 text-stone-300 hover:border-amber-500"
              }`}>
              {mk.logo && <img src={mk.logo} alt={mk.label} className="w-4 h-4 object-contain" />}
              {mk.label}
            </button>
          ))}
        </div>
      </Section>

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
            <FormikControl control="price" name="priceList" />
          </div>
          <div className="flex flex-col gap-1 p-3 border-t-2 border-t-amber-500 border-b border-stone-800 md:border-b-0">
            <span className="text-xs text-amber-500 font-medium">Teklif Fiyatı</span>
            <FormikControl control="price" name="priceOffer" />
          </div>
          <div className="flex flex-col gap-1 p-3 border-t-2 border-t-emerald-500">
            <span className="text-xs text-emerald-500 font-medium">Net Fiyat</span>
            <FormikControl control="price" name="priceNet" />
          </div>
        </div>
      </Section>

    </div>
  );
};
export default FormFields;
