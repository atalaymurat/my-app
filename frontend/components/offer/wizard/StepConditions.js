"use client";
import { useFormikContext } from "formik";

const DOC_TYPES = ["Teklif", "Proforma", "Sipariş", "Sözleşme"];

function Toggle({ label, fieldName, activeColor }) {
  const { values, setFieldValue } = useFormikContext();
  const on = values[fieldName];
  return (
    <button type="button" onClick={() => setFieldValue(fieldName, !on)}
      className={`flex items-center gap-2.5 w-full px-4 py-3 rounded-xl border transition-colors ${
        on ? `${activeColor} text-white` : "bg-stone-800 border-stone-700 text-stone-400"
      }`}>
      <div className={`w-9 h-5 rounded-full border flex items-center transition-all ${on ? "bg-white/20 border-white/30" : "bg-stone-700 border-stone-600"}`}>
        <div className={`w-3.5 h-3.5 rounded-full mx-0.5 transition-all duration-200 ${on ? "translate-x-4 bg-white" : "translate-x-0 bg-stone-500"}`} />
      </div>
      <span className="text-sm font-semibold">{label}</span>
      <span className={`ml-auto text-xs font-bold uppercase tracking-widest ${on ? "opacity-70" : "opacity-40"}`}>{on ? "Açık" : "Kapalı"}</span>
    </button>
  );
}

export default function StepConditions({ onPrev, onNext }) {
  const { values, setFieldValue } = useFormikContext();

  return (
    <div className="flex flex-col gap-3">
      {/* Doküman Tipi */}
      <div className="rounded-xl border border-stone-700 overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-900/70 border-b border-stone-700">
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Doküman Tipi</p>
        </div>
        <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DOC_TYPES.map(type => (
            <button key={type} type="button" onClick={() => setFieldValue("docType", type)}
              className={`py-2 rounded-lg border text-xs font-bold transition-colors ${
                values.docType === type
                  ? "bg-blue-600 border-blue-500 text-white shadow-sm shadow-blue-900/50"
                  : "bg-stone-800 border-stone-600 text-stone-400 hover:border-stone-500 hover:text-stone-300"
              }`}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* KDV & Görünüm */}
      <div className="rounded-xl border border-stone-700 overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-900/70 border-b border-stone-700">
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Vergi & Görünüm</p>
        </div>
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-stone-800 border border-stone-700">
            <span className="text-sm font-semibold text-stone-300 flex-1">KDV Oranı</span>
            <div className="flex items-center gap-2">
              <input type="number" min={0} max={100} value={values.vatRate}
                onChange={(e) => setFieldValue("vatRate", Number(e.target.value))}
                className="w-16 px-2 py-1.5 text-sm text-center bg-stone-900 border border-stone-600 rounded-lg text-stone-200 focus:outline-none focus:border-stone-400" />
              <span className="text-sm font-bold text-stone-400">%</span>
            </div>
          </div>
          <Toggle label="KDV Göster" fieldName="showVat" activeColor="bg-amber-700 border-amber-600" />
          <Toggle label="Toplamları Göster" fieldName="showTotals" activeColor="bg-emerald-700 border-emerald-600" />
        </div>
      </div>

      {/* Navigasyon */}
      <div className="mt-auto flex gap-2 pt-1">
        <button type="button" onClick={onPrev}
          className="flex-1 py-3 rounded-xl border border-stone-700 text-sm font-semibold text-stone-400 hover:bg-stone-800 transition-colors">
          ← Geri
        </button>
        <button type="button" onClick={onNext}
          className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-500 text-sm font-bold text-white transition-colors shadow-lg shadow-blue-900/20">
          Özete Geç →
        </button>
      </div>
    </div>
  );
}
