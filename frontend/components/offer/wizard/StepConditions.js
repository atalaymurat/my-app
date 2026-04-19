"use client";
import { useFormikContext } from "formik";

const DOC_TYPE_MAP = { Teklif: 'offer', Proforma: 'proforma', Sipariş: 'contract', Sözleşme: 'contract' };

const TYPE_CFG = {
  Teklif:   { active: "bg-blue-600/20 border-blue-500/50 text-blue-200",    dot: "bg-blue-400" },
  Proforma: { active: "bg-violet-600/20 border-violet-500/50 text-violet-200", dot: "bg-violet-400" },
  Sipariş:  { active: "bg-emerald-600/20 border-emerald-500/50 text-emerald-200", dot: "bg-emerald-400" },
  Sözleşme: { active: "bg-amber-600/20 border-amber-500/50 text-amber-200",  dot: "bg-amber-400" },
};

const SECTION = "rounded-xl border border-stone-700 overflow-hidden";
const HEADER  = "px-4 py-2.5 bg-stone-900/70 border-b border-stone-700 flex items-center justify-between";
const LABEL   = "text-[10px] font-bold uppercase tracking-widest text-stone-400";

function Toggle({ label, fieldName, activeColor }) {
  const { values, setFieldValue } = useFormikContext();
  const on = values[fieldName];
  return (
    <button type="button" onClick={() => setFieldValue(fieldName, !on)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border transition-all ${
        on ? `${activeColor} shadow-sm` : "bg-stone-800/50 border-stone-700 text-stone-400"
      }`}>
      <div className={`relative w-9 h-5 rounded-full border transition-colors ${
        on ? "bg-white/20 border-white/20" : "bg-stone-700 border-stone-600"
      }`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full shadow transition-all duration-200 ${
          on ? "left-4 bg-white" : "left-0.5 bg-stone-500"
        }`} />
      </div>
      <span className="text-sm font-semibold">{label}</span>
      <span className={`ml-auto text-[10px] font-bold uppercase tracking-widest ${on ? "opacity-60" : "opacity-30"}`}>
        {on ? "Açık" : "Kapalı"}
      </span>
    </button>
  );
}

export default function StepConditions({ onPrev, onNext }) {
  const { values, setFieldValue } = useFormikContext();
  const currentType  = DOC_TYPE_MAP[values.docType] || 'offer';
  const editableTerms = values.offerTerms?.filter(
    t => t.isEditable && t.isVisible && t.visibleIn?.includes(currentType)
  ) || [];
  const updateTerm = (key, val) =>
    setFieldValue('offerTerms', values.offerTerms.map(t => t.key === key ? { ...t, value: val } : t));

  return (
    <div className="flex flex-col gap-3">

      {/* Top row: responsive — stacked on mobile, side-by-side on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        {/* Doküman Tipi */}
        <div className={SECTION}>
          <div className={HEADER}>
            <p className={LABEL}>Doküman Tipi</p>
            <span className="text-[10px] font-semibold text-stone-500">{values.docType}</span>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {Object.keys(TYPE_CFG).map(type => {
              const cfg = TYPE_CFG[type];
              const active = values.docType === type;
              return (
                <button key={type} type="button" onClick={() => setFieldValue("docType", type)}
                  className={`flex items-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    active
                      ? `${cfg.active} shadow-sm`
                      : "bg-stone-800 border-stone-700 text-stone-500 hover:border-stone-600 hover:text-stone-300"
                  }`}>
                  <span className={`w-2 h-2 rounded-full shrink-0 transition-colors ${active ? cfg.dot : "bg-stone-600"}`} />
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vergi & Görünüm */}
        <div className={SECTION}>
          <div className={HEADER}>
            <p className={LABEL}>Vergi & Görünüm</p>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-stone-800/50 border border-stone-700">
              <span className="text-sm font-semibold text-stone-300 flex-1">KDV Oranı</span>
              <div className="flex items-center gap-1.5">
                <button type="button"
                  onClick={() => setFieldValue("vatRate", Math.max(0, values.vatRate - 1))}
                  className="w-7 h-7 rounded-lg bg-stone-700 hover:bg-stone-600 border border-stone-600 text-stone-300 font-bold flex items-center justify-center transition-colors text-base leading-none">
                  −
                </button>
                <span className="w-12 text-center text-sm font-bold text-stone-100">{values.vatRate}%</span>
                <button type="button"
                  onClick={() => setFieldValue("vatRate", Math.min(100, values.vatRate + 1))}
                  className="w-7 h-7 rounded-lg bg-stone-700 hover:bg-stone-600 border border-stone-600 text-stone-300 font-bold flex items-center justify-center transition-colors text-base leading-none">
                  +
                </button>
              </div>
            </div>
            <Toggle label="KDV Göster"       fieldName="showVat"    activeColor="bg-amber-700/30 border-amber-600/60 text-amber-200" />
            <Toggle label="Toplamları Göster" fieldName="showTotals" activeColor="bg-emerald-700/30 border-emerald-600/60 text-emerald-200" />
          </div>
        </div>
      </div>

      {/* Satış Koşulları — full width */}
      {editableTerms.length > 0 && (
        <div className={SECTION}>
          <div className={HEADER}>
            <p className={LABEL}>Satış Koşulları</p>
            <span className="text-[10px] font-semibold text-stone-500">{editableTerms.length} madde</span>
          </div>
          <div className="p-3 space-y-3">
            {editableTerms.map(term => (
              <div key={term.key}>
                <p className="text-xs font-semibold text-stone-400 mb-1.5">{term.label}</p>
                {term.options?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {term.options.map(opt => (
                      <button key={opt} type="button"
                        onClick={() => updateTerm(term.key, term.value ? `${term.value}, ${opt}` : opt)}
                        className="px-2.5 py-1 text-xs rounded-lg border bg-stone-900 border-stone-600 text-stone-400 hover:border-stone-400 hover:text-stone-200 transition-colors">
                        + {opt}
                      </button>
                    ))}
                  </div>
                )}
                <textarea rows={2} value={term.value ?? ""} onChange={e => updateTerm(term.key, e.target.value)}
                  placeholder="Koşul metnini girin..."
                  className="w-full px-3 py-2 text-sm bg-stone-900 border border-stone-600 rounded-xl text-stone-200 placeholder-stone-600 focus:outline-none focus:border-stone-400 resize-none" />
              </div>
            ))}
            <p className="text-[10px] text-stone-600">Sabit metinler (garanti, servis vb.) firma ayarlarından otomatik eklenir.</p>
          </div>
        </div>
      )}

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
