import { useEffect, useState, useRef } from "react";
import { useFormikContext } from "formik";
import axios from "@/utils/axios";
import FormikControl from "../formik/FormikControl";
import LineItems from "./LineItems";
import ContactFields from "@/components/company/ContactFields";

function CompanyLinkedCard({ values, onClear }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 bg-blue-950/30 border border-blue-800/50 rounded-xl">
      <div className="shrink-0 w-8 h-8 rounded-full bg-blue-900/60 border border-blue-700/50 flex items-center justify-center">
        <span className="text-sm font-bold text-blue-400">{values.title?.[0]?.toUpperCase()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-blue-300 truncate">{values.title}</p>
        <p className="text-xs text-stone-500 truncate">
          {[values.domain, values.city].filter(Boolean).join(" · ")}
        </p>
      </div>
      <button type="button" onClick={onClear}
        className="shrink-0 w-7 h-7 rounded-lg bg-stone-800 hover:bg-red-900/50 border border-stone-700 hover:border-red-700/50 flex items-center justify-center transition-colors">
        <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function FormFields() {
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { values, setFieldValue } = useFormikContext();
  const skipEffectRef = useRef(false);

  useEffect(() => {
    if (skipEffectRef.current) { skipEffectRef.current = false; return; }
    const fetch = async () => {
      if (!values.search || values.search.length < 2) { setSearchResults([]); return; }
      try {
        const { data } = await axios.get(`/api/company/find?search=${values.search}`);
        if (data.success) { setSearchResults(data.companies); setShowDropdown(true); }
        else { setSearchResults([]); setShowDropdown(false); }
      } catch { setShowDropdown(false); }
    };
    const t = setTimeout(fetch, 300);
    return () => clearTimeout(t);
  }, [values.search]);

  const onSelectCompany = (company) => {
    skipEffectRef.current = true;
    setFieldValue("companyId", company.id);
    setFieldValue("title", company.title);
    setFieldValue("vatTitle", company.vatTitle);
    setFieldValue("email", company.email);
    setFieldValue("domain", company.domain);
    setFieldValue("city", company.city);
    setFieldValue("line1", company.line1);
    setFieldValue("line2", company.line2);
    setFieldValue("country", company.country);
    setFieldValue("district", company.district);
    setFieldValue("search", "");
    setShowDropdown(false);
    setSearchResults([]);
  };

  const onClearCompany = () => {
    setFieldValue("companyId", "");
    setFieldValue("title", "");
    setFieldValue("vatTitle", "");
    setFieldValue("email", "");
    setFieldValue("domain", "");
    setFieldValue("city", "");
    setFieldValue("line1", "");
    setFieldValue("line2", "");
    setFieldValue("country", "");
    setFieldValue("district", "");
    setFieldValue("search", "");
    setSearchResults([]);
    setShowDropdown(false);
  };

  return (
    <>
      {/* ── Firma + Adres Kartı ────────────────────────── */}
      <div className="rounded-xl border border-stone-700 overflow-hidden mb-3">

        {/* Header */}
        <div className="px-4 py-2.5 border-b border-stone-700 bg-stone-900/60 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Firma</p>
          {values.companyId && (
            <span className="text-xs text-blue-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />Bağlı
            </span>
          )}
        </div>

        <div className="p-3 space-y-2">
          {values.companyId ? (
            <CompanyLinkedCard values={values} onClear={onClearCompany} />
          ) : (
            <>
              {/* Arama */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Firma ara..."
                  autoComplete="off"
                  value={values.search}
                  onChange={(e) => setFieldValue("search", e.target.value)}
                  onFocus={() => searchResults.length && setShowDropdown(true)}
                  className="w-full px-3 py-[6px] rounded-lg bg-stone-800 border border-stone-600 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-stone-400"
                />
                {showDropdown && (
                  <div className="absolute z-20 left-0 right-0 mt-1 rounded-xl border border-stone-700 bg-stone-900 shadow-xl overflow-hidden">
                    {searchResults.map((c) => (
                      <div key={c.id} onClick={() => onSelectCompany(c)}
                        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-stone-800 transition-colors">
                        <div className="w-7 h-7 rounded-full bg-stone-700 flex items-center justify-center shrink-0">
                          <span className="text-xs text-stone-300 font-semibold">{c.title?.[0]?.toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-stone-200 font-medium truncate">{c.title}</p>
                          <p className="text-xs text-stone-500">{[c.city, c.country].filter(Boolean).join(", ")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Firma Detayları */}
              <div className="space-y-1 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <FormikControl control="input" type="text" label="Firma Adı" name="title" />
                  <FormikControl control="input" type="text" label="Tam Unvan" name="vatTitle" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <FormikControl control="input" type="email" label="Email" name="email" />
                  <FormikControl control="input" type="text" label="Web" name="domain" />
                </div>

                {/* Adres */}
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 pt-2 pb-1">Adres</p>
                <div className="grid grid-cols-2 gap-2">
                  <FormikControl control="input" type="text" label="Mahalle / Sokak" name="line1" />
                  <FormikControl control="input" type="text" label="Bina / Kapı No" name="line2" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <FormikControl control="input" type="text" label="İlçe" name="district" />
                  <FormikControl control="input" type="text" label="Şehir" name="city" />
                  <FormikControl control="input" type="text" label="Ülke" name="country" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <ContactFields />
      <LineItems />

      {/* ── Ayarlar Kartı ── */}
      <div className="rounded-xl border border-stone-700 overflow-hidden mt-3">
        <div className="px-4 py-2 border-b border-stone-700 bg-stone-900/60">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Vergi & Görünüm</p>
        </div>
        <div className="px-4 py-3 flex items-center gap-4">

          {/* KDV Oranı */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-stone-400 whitespace-nowrap">KDV %</label>
            <input
              type="number" min={0} max={100}
              value={values.vatRate}
              onChange={(e) => setFieldValue("vatRate", Number(e.target.value))}
              className="w-16 px-2 py-1.5 text-sm text-center bg-stone-800 border border-stone-600 rounded-lg text-stone-200 focus:outline-none focus:border-stone-400"
            />
          </div>

          <div className="h-6 w-px bg-stone-700" />

          {/* KDV Göster toggle */}
          <button type="button" onClick={() => setFieldValue("showVat", !values.showVat)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              values.showVat
                ? "bg-amber-900/40 border-amber-700/50 text-amber-400"
                : "bg-stone-800 border-stone-700 text-stone-500"
            }`}>
            <div className={`w-3.5 h-3.5 rounded-full border-2 transition-colors ${values.showVat ? "border-amber-400 bg-amber-400" : "border-stone-600 bg-transparent"}`} />
            KDV Göster
          </button>

          {/* Toplamları Göster toggle */}
          <button type="button" onClick={() => setFieldValue("showTotals", !values.showTotals)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              values.showTotals
                ? "bg-emerald-900/40 border-emerald-700/50 text-emerald-400"
                : "bg-stone-800 border-stone-700 text-stone-500"
            }`}>
            <div className={`w-3.5 h-3.5 rounded-full border-2 transition-colors ${values.showTotals ? "border-emerald-400 bg-emerald-400" : "border-stone-600 bg-transparent"}`} />
            Toplamları Göster
          </button>

        </div>
      </div>
    </>
  );
}
