"use client";
import { useState, useRef, useEffect } from "react";
import { useFormikContext } from "formik";
import axios from "@/utils/axios";
import FormikControl from "@/components/formik/FormikControl";
import ContactFields from "@/components/company/ContactFields";

function FieldError({ name }) {
  const { errors, touched } = useFormikContext();
  if (!touched[name] || !errors[name]) return null;
  return <p className="text-xs text-red-400 mt-1">{errors[name]}</p>;
}

function CompanyLinkedCard({ values, onClear }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-blue-950/30 border border-blue-800/40 rounded-xl">
      <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center">
        <span className="text-base font-black text-blue-300">{values.title?.[0]?.toUpperCase()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-blue-200 truncate">{values.title}</p>
        <p className="text-xs text-stone-500 truncate mt-0.5">
          {[values.domain, values.city, values.country].filter(Boolean).join(" · ")}
        </p>
      </div>
      <button type="button" onClick={onClear}
        className="shrink-0 w-7 h-7 rounded-lg bg-stone-800 hover:bg-red-900/40 border border-stone-700 hover:border-red-700/50 flex items-center justify-center transition-colors">
        <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function StepCompany() {
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { values, setFieldValue } = useFormikContext();
  const skipRef = useRef(false);

  useEffect(() => {
    if (skipRef.current) { skipRef.current = false; return; }
    if (!values.search || values.search.length < 2) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const { data } = await axios.get(`/api/company/find?search=${values.search}`);
        if (data.success) { setSearchResults(data.companies); setShowDropdown(true); }
      } catch { setShowDropdown(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [values.search]);

  const onSelect = (c) => {
    skipRef.current = true;
    ["companyId","title","vatTitle","email","domain","city","line1","line2","country","district"]
      .forEach(k => setFieldValue(k, c[k === "companyId" ? "id" : k] || ""));
    setFieldValue("search", ""); setShowDropdown(false); setSearchResults([]);
  };

  const onClear = () => {
    ["companyId","title","vatTitle","email","domain","city","line1","line2","country","district","search"]
      .forEach(k => setFieldValue(k, ""));
    setShowDropdown(false); setSearchResults([]);
  };

  return (
    <div className="space-y-3">
      {/* Firma Kartı */}
      <div className="rounded-xl border border-stone-700 overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-900/70 border-b border-stone-700 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Firma</p>
          {values.companyId && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />Bağlı
            </span>
          )}
        </div>
        <div className="p-3 space-y-3">
          {values.companyId ? (
            <CompanyLinkedCard values={values} onClear={onClear} />
          ) : (
            <>
              {/* Arama */}
              <div className="relative">
                <input type="text" placeholder="Firma ara veya yeni ekle..." autoComplete="off"
                  value={values.search}
                  onChange={(e) => setFieldValue("search", e.target.value)}
                  onFocus={() => searchResults.length && setShowDropdown(true)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-600 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-blue-500 transition-colors" />
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 rounded-xl border border-stone-700 bg-stone-900 shadow-2xl overflow-hidden">
                    {searchResults.map((c) => (
                      <div key={c.id} onClick={() => onSelect(c)}
                        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-stone-800 transition-colors border-b border-stone-800 last:border-0">
                        <div className="w-7 h-7 rounded-lg bg-stone-700 flex items-center justify-center shrink-0">
                          <span className="text-xs text-stone-300 font-bold">{c.title?.[0]?.toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-stone-200 font-semibold truncate">{c.title}</p>
                          <p className="text-xs text-stone-500">{[c.city, c.country].filter(Boolean).join(", ")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Firma bilgileri — mobile: tek kolon, sm: 2 kolon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <FormikControl control="input" type="text" label="Firma Adı *" name="title" />
                  <FieldError name="title" />
                </div>
                <FormikControl control="input" type="text" label="Tam Unvan" name="vatTitle" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <FormikControl control="input" type="email" label="Email" name="email" />
                <FormikControl control="input" type="text" label="Web / Domain" name="domain" />
              </div>

              {/* Adres */}
              <div className="pt-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">Adres</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <FormikControl control="input" type="text" label="Mahalle / Sokak" name="line1" />
                  <FormikControl control="input" type="text" label="Bina / Kapı No" name="line2" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-0">
                  <FormikControl control="input" type="text" label="İlçe" name="district" />
                  <div>
                    <FormikControl control="input" type="text" label="Şehir *" name="city" />
                    <FieldError name="city" />
                  </div>
                  <div>
                    <FormikControl control="input" type="text" label="Ülke *" name="country" />
                    <FieldError name="country" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* İletişim Kişisi */}
      <ContactFields />
    </div>
  );
}
