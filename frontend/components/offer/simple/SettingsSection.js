"use client";
import { useFormikContext } from "formik";
import FormikControl from "@/components/formik/FormikControl";
import { DOC_TYPES } from "./constants";

export default function SettingsSection() {
  const { values, setFieldValue } = useFormikContext();

  return (
    <div className="rounded-xl border border-stone-700 overflow-hidden">
      <div className="px-4 py-2.5 bg-stone-900/70 border-b border-stone-700">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Ayarlar</p>
      </div>
      <div className="p-4 sm:p-5 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">Doküman Tipi</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DOC_TYPES.map((type) => (
              <button key={type} type="button" onClick={() => setFieldValue("docType", type)}
                className={`py-2 px-2 rounded-lg border text-xs font-bold transition-colors ${values.docType === type ? "bg-blue-600 border-blue-500 text-white" : "bg-stone-800 border-stone-600 text-stone-400 hover:border-stone-500"}`}>
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <FormikControl control="input" type="number" label="KDV (%)" name="vatRate" />
          </div>
          <div className="flex items-center gap-2 sm:pt-5">
            <input type="checkbox" id="showVat" checked={values.showVat}
              onChange={(e) => setFieldValue("showVat", e.target.checked)}
              className="w-4 h-4 rounded border-stone-600 cursor-pointer" />
            <label htmlFor="showVat" className="text-sm text-stone-300 cursor-pointer">KDV'yi Göster</label>
          </div>
          <div className="flex items-center gap-2 sm:pt-5">
            <input type="checkbox" id="showTotals" checked={values.showTotals}
              onChange={(e) => setFieldValue("showTotals", e.target.checked)}
              className="w-4 h-4 rounded border-stone-600 cursor-pointer" />
            <label htmlFor="showTotals" className="text-sm text-stone-300 cursor-pointer">Toplamları Göster</label>
          </div>
        </div>
      </div>
    </div>
  );
}
