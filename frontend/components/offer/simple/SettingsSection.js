"use client";
import { useFormikContext } from "formik";
import FormikControl from "@/components/formik/FormikControl";
import { DOC_TYPES } from "./constants";

export default function SettingsSection() {
  const { values, setFieldValue } = useFormikContext();

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-950/50 overflow-hidden">
      <div className="px-5 py-3.5 bg-stone-900/40 border-b border-stone-800">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-500">Ayarlar</p>
      </div>
      <div className="p-5 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">Doküman Tipi</p>
          <div className="grid grid-cols-2 gap-3">
            {DOC_TYPES.map((type) => (
              <button key={type} type="button" onClick={() => setFieldValue("docType", type)}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${values.docType === type ? "bg-blue-600 border-blue-500 text-white" : "bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-600"}`}>
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <FormikControl control="input" type="number" label="KDV (%)" name="vatRate" />
          <div className="flex items-center gap-3">
            <input type="checkbox" id="showVat" checked={values.showVat}
              onChange={(e) => setFieldValue("showVat", e.target.checked)}
              className="w-5 h-5 rounded border-stone-700 cursor-pointer" />
            <label htmlFor="showVat" className="text-sm text-stone-300 cursor-pointer">KDV'yi Göster</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="showTotals" checked={values.showTotals}
              onChange={(e) => setFieldValue("showTotals", e.target.checked)}
              className="w-5 h-5 rounded border-stone-700 cursor-pointer" />
            <label htmlFor="showTotals" className="text-sm text-stone-300 cursor-pointer">Toplamları Göster</label>
          </div>
        </div>
      </div>
    </div>
  );
}
