"use client";
import { useFormikContext } from "formik";
import { DOC_TYPE_MAP } from "./constants";

export default function TermsSection() {
  const { values, setFieldValue } = useFormikContext();
  const currentType = DOC_TYPE_MAP[values.docType] || "offer";
  const terms = (values.offerTerms || []).filter(
    (t) => t.isEditable && t.isVisible && t.visibleIn?.includes(currentType)
  );
  if (!terms.length) return null;

  const update = (key, val) =>
    setFieldValue("offerTerms", values.offerTerms.map((t) => (t.key === key ? { ...t, value: val } : t)));

  return (
    <div className="rounded-xl border border-stone-700 overflow-hidden">
      <div className="px-4 py-2.5 bg-stone-900/70 border-b border-stone-700 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Satış Koşulları</p>
        <span className="text-[10px] text-stone-500 font-semibold">{terms.length} madde</span>
      </div>
      <div className="p-4 sm:p-5 space-y-3">
        {terms.map((term) => (
          <div key={term.key}>
            <p className="text-xs font-semibold text-stone-400 mb-1.5">{term.label}</p>
            {term.options?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {term.options.map((opt) => (
                  <button key={opt} type="button"
                    onClick={() => update(term.key, term.value ? `${term.value}, ${opt}` : opt)}
                    className="px-2.5 py-1 text-xs rounded-lg border bg-stone-900 border-stone-600 text-stone-400 hover:border-stone-400 hover:text-stone-200 transition-colors">
                    + {opt}
                  </button>
                ))}
              </div>
            )}
            <textarea rows={2} value={term.value ?? ""} onChange={(e) => update(term.key, e.target.value)}
              placeholder="Koşul metnini girin..."
              className="w-full px-3 py-2 text-sm bg-stone-900 border border-stone-600 rounded-xl text-stone-200 placeholder-stone-600 focus:outline-none focus:border-stone-400 resize-none" />
          </div>
        ))}
        <p className="text-[10px] text-stone-600">Sabit metinler (garanti, servis vb.) firma ayarlarından otomatik eklenir.</p>
      </div>
    </div>
  );
}
