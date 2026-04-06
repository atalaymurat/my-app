"use client";
import { useFormikContext } from "formik";

const DOC_TYPES = ["Teklif", "Proforma", "Sipariş", "Sözleşme"];
const DOC_TYPE_MAP = { Teklif: 'offer', Proforma: 'proforma', Sipariş: 'contract', Sözleşme: 'contract' };
const SECTION = "rounded-xl border border-stone-700 overflow-hidden";
const HEADER = "px-4 py-2.5 bg-stone-900/70 border-b border-stone-700";
const LABEL = "text-[10px] font-bold uppercase tracking-widest text-stone-400";

function Toggle({ label, fieldName, activeColor }) {
  const { values, setFieldValue } = useFormikContext();
  const on = values[fieldName];
  return (
    <button type="button" onClick={() => setFieldValue(fieldName, !on)}
      className={`flex items-center gap-2.5 w-full px-4 py-3 rounded-xl border transition-colors ${on ? `${activeColor} text-white` : "bg-stone-800 border-stone-700 text-stone-400"}`}>
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
  const currentType = DOC_TYPE_MAP[values.docType] || 'offer';
  const editableTerms = values.offerTerms?.filter(t => t.isEditable && t.isVisible && t.visibleIn?.includes(currentType)) || [];
  const updateTerm = (key, val) => setFieldValue('offerTerms', values.offerTerms.map(t => t.key === key ? { ...t, value: val } : t));

  return (
    <div className="flex flex-col gap-3">
      <div className={SECTION}>
        <div className={HEADER}><p className={LABEL}>Doküman Tipi</p></div>
        <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DOC_TYPES.map(type => (
            <button key={type} type="button" onClick={() => setFieldValue("docType", type)}
              className={`py-2 rounded-lg border text-xs font-bold transition-colors ${values.docType === type ? "bg-blue-600 border-blue-500 text-white shadow-sm shadow-blue-900/50" : "bg-stone-800 border-stone-600 text-stone-400 hover:border-stone-500 hover:text-stone-300"}`}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {editableTerms.length > 0 && (
        <div className={SECTION}>
          <div className={HEADER}><p className={LABEL}>Satış Koşulları</p></div>
          <div className="p-3">
            {editableTerms.map(term => (
              <div key={term.key} className="mb-3">
                <p className="text-xs font-semibold text-stone-400 mb-1.5">{term.label}</p>
                {term.options.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {term.options.map(opt => (
                      <button key={opt} type="button"
                        onClick={() => updateTerm(term.key, term.value ? `${term.value}, ${opt}` : opt)}
                        className="px-2.5 py-1 text-xs rounded-md border bg-stone-900 border-stone-600 text-stone-400 hover:border-stone-400 hover:text-stone-200 transition-colors">
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
                <textarea rows={2} value={term.value ?? ""} onChange={e => updateTerm(term.key, e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-900 border border-stone-600 rounded-lg text-stone-200 focus:outline-none focus:border-stone-400 resize-none" />
              </div>
            ))}
            <p className="text-[10px] text-stone-500 mt-1">Garanti, servis koşulları ve diğer sabit metinler firma ayarlarından otomatik eklenir.</p>
          </div>
        </div>
      )}

      <div className={SECTION}>
        <div className={HEADER}><p className={LABEL}>Vergi & Görünüm</p></div>
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-stone-800 border border-stone-700">
            <span className="text-sm font-semibold text-stone-300 flex-1">KDV Oranı</span>
            <div className="flex items-center gap-2">
              <input type="number" min={0} max={100} value={values.vatRate}
                onChange={e => setFieldValue("vatRate", Number(e.target.value))}
                className="w-16 px-2 py-1.5 text-sm text-center bg-stone-900 border border-stone-600 rounded-lg text-stone-200 focus:outline-none focus:border-stone-400" />
              <span className="text-sm font-bold text-stone-400">%</span>
            </div>
          </div>
          <Toggle label="KDV Göster" fieldName="showVat" activeColor="bg-amber-700 border-amber-600" />
          <Toggle label="Toplamları Göster" fieldName="showTotals" activeColor="bg-emerald-700 border-emerald-600" />
        </div>
      </div>

      <div className="mt-auto flex gap-2 pt-1">
        <button type="button" onClick={onPrev} className="flex-1 py-3 rounded-xl border border-stone-700 text-sm font-semibold text-stone-400 hover:bg-stone-800 transition-colors">← Geri</button>
        <button type="button" onClick={onNext} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-500 text-sm font-bold text-white transition-colors shadow-lg shadow-blue-900/20">Özete Geç →</button>
      </div>
    </div>
  );
}
