"use client";
import { useState, useEffect, useRef } from "react";
import { useFormikContext } from "formik";
import axios from "@/utils/axios";
import FormikControl from "@/components/formik/FormikControl";

export default function CompanySearch() {
  const { values, setFieldValue } = useFormikContext();
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const skipRef = useRef(false);

  useEffect(() => {
    if (skipRef.current) { skipRef.current = false; return; }
    if (!values.search || values.search.length < 2) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const { data } = await axios.get(`/api/company/find?search=${values.search}`);
        if (data.success) { setSearchResults(data.companies || []); setShowDropdown(true); }
      } catch { setShowDropdown(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [values.search]);

  const onSelect = (c) => {
    skipRef.current = true;
    ["companyId", "title", "vatTitle", "email", "domain", "city", "line1", "line2", "country", "district"].forEach(
      (k) => setFieldValue(k, c[k === "companyId" ? "id" : k] || "")
    );
    setFieldValue("search", "");
    setShowDropdown(false);
    setSearchResults([]);
  };

  const onClear = () => {
    ["companyId", "title", "vatTitle", "email", "domain", "city", "line1", "line2", "country", "district", "search"].forEach(
      (k) => setFieldValue(k, "")
    );
    setShowDropdown(false);
    setSearchResults([]);
  };

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-950/50 overflow-hidden">
      <div className="px-5 py-3.5 bg-stone-900/40 border-b border-stone-800 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-500">Firma</p>
        {values.companyId && <span className="text-xs font-semibold text-blue-400">✓ Bağlı</span>}
      </div>
      <div className="p-5 space-y-4">
        {values.companyId ? (
          <div className="flex items-center gap-4 p-4 bg-blue-950/20 border border-blue-900/40 rounded-xl">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-900/30 border border-blue-800/50 flex items-center justify-center">
              <span className="text-lg font-black text-blue-300">{values.title?.[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-blue-200 truncate">{values.title}</p>
              <p className="text-xs text-stone-500 truncate mt-1">
                {[values.domain, values.city, values.country].filter(Boolean).join(" · ")}
              </p>
            </div>
            <button type="button" onClick={onClear}
              className="shrink-0 w-9 h-9 rounded-lg bg-stone-800 hover:bg-red-900/40 border border-stone-700 hover:border-red-700/50 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <div className="relative">
              <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">Firma Ara</label>
              <input type="text" placeholder="Firma adı veya vergi no..." autoComplete="off"
                value={values.search}
                onChange={(e) => setFieldValue("search", e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                className="w-full px-4 py-3 rounded-xl bg-stone-800/50 border border-stone-700 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-2 rounded-xl border border-stone-700 bg-stone-900 shadow-2xl overflow-hidden max-h-72 overflow-y-auto">
                  {searchResults.map((c) => (
                    <div key={c.id} onClick={() => onSelect(c)}
                      className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-stone-800 transition-colors border-b border-stone-800 last:border-0">
                      <div className="w-9 h-9 rounded-lg bg-stone-700 flex items-center justify-center shrink-0">
                        <span className="text-sm text-stone-300 font-bold">{c.title?.[0]?.toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-stone-200 font-semibold truncate">{c.title}</p>
                        <p className="text-xs text-stone-500 mt-0.5">{[c.city, c.country].filter(Boolean).join(", ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <FormikControl control="input" type="text" label="Firma Adı *" name="title" />
              <FormikControl control="input" type="text" label="Tam Unvan" name="vatTitle" />
              <FormikControl control="input" type="email" label="Email" name="email" />
              <FormikControl control="input" type="text" label="Web / Domain" name="domain" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormikControl control="input" type="text" label="Şehir *" name="city" />
                <FormikControl control="input" type="text" label="Ülke *" name="country" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
