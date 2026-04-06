"use client";
import { useState, useRef } from "react";
import { useFormikContext, useField } from "formik";
import { InputMask } from "@react-input/mask";
import axios from "@/utils/axios";

function PhoneInput({ name }) {
  const [field, , helpers] = useField(name);
  const isTyping = useRef(false);

  const parse = (val) => {
    if (!val) return { cc: "90", local: "" };
    if (val.includes(":")) { const [cc, local] = val.split(":"); return { cc: cc || "90", local: local || "" }; }
    const d = val.replace(/\D/g, "");
    return { cc: d.slice(0, 2) || "90", local: d.slice(2) };
  };

  const toMasked = (digits) => {
    const d = digits.replace(/\D/g, "").slice(0, 10);
    let out = "";
    for (let i = 0; i < d.length; i++) {
      if (i === 3 || i === 6 || i === 8) out += " ";
      out += d[i];
    }
    return out;
  };

  const init = parse(field.value);
  const [cc, setCc] = useState(init.cc);
  const [localMasked, setLocalMasked] = useState(toMasked(init.local));

  return (
    <div className="flex gap-1">
      <div className="flex items-center">
        <span className="px-2 py-[6px] bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500 text-sm">+</span>
        <input
          type="text" value={cc} autoComplete="off"
          onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 3); setCc(v); isTyping.current = true; helpers.setValue(v + ":" + localMasked.replace(/\D/g, "")); }}
          className="w-10 px-1 py-[6px] border border-gray-300 rounded-r-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent text-gray-500"
        />
      </div>
      <InputMask
        mask="___ ___ __ __" replacement={{ _: /\d/ }} placeholder="___ ___ __ __"
        value={localMasked} autoComplete="off"
        onChange={(e) => { const v = e.target.value; setLocalMasked(v); isTyping.current = true; helpers.setValue(cc + ":" + v.replace(/\D/g, "")); }}
        className="flex-1 px-2 py-[6px] border border-gray-300 rounded-md text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
      />
    </div>
  );
}

function LinkedCard({ values, onClear }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 bg-emerald-950/30 border border-emerald-800/50 rounded-xl">
      <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center">
        <span className="text-sm font-bold text-emerald-400">{values.contactName?.[0]?.toUpperCase()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-emerald-300 truncate">{values.contactName}</p>
        <p className="text-xs text-stone-500 truncate">{[values.contactPhone, values.contactEmail].filter(Boolean).join(" · ")}</p>
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

export default function ContactFields() {
  const { values, setFieldValue } = useFormikContext();
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timerRef = useRef(null);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setFieldValue("contactName", val);
    setFieldValue("contactId", "");
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (val.length < 2) { setResults([]); setShowDropdown(false); return; }
      try {
        const { data } = await axios.get(`/api/contact/find?search=${val}`);
        if (data.success) { setResults(data.contacts); setShowDropdown(data.contacts.length > 0); }
      } catch { setResults([]); }
    }, 300);
  };

  const handleSelect = (contact) => {
    setFieldValue("contactId", contact._id);
    setFieldValue("contactName", contact.name);
    setFieldValue("contactPhone", contact.phones?.[0] || "");
    setFieldValue("contactEmail", contact.emails?.[0] || "");
    setShowDropdown(false); setResults([]);
  };

  const handleClear = () => {
    setFieldValue("contactId", ""); setFieldValue("contactName", "");
    setFieldValue("contactPhone", ""); setFieldValue("contactEmail", "");
    setResults([]); setShowDropdown(false);
  };

  return (
    <div className="rounded-xl border border-stone-700 overflow-hidden mt-4">
      <div className="px-4 py-2 border-b border-stone-700 bg-stone-900/60 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">İletişim Kişisi</p>
        {values.contactId && (
          <span className="text-xs text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />Bağlı
          </span>
        )}
      </div>

      <div className="p-3 space-y-2">
        {values.contactId ? (
          <LinkedCard values={values} onClear={handleClear} />
        ) : (
          <>
            {/* İsim arama */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Kişi Ara / İsim</label>
              <input
                type="text" value={values.contactName} onChange={handleSearchChange} autoComplete="off"
                onFocus={() => results.length && setShowDropdown(true)}
                className="w-full px-2 py-[6px] border border-gray-300 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
              />
              {showDropdown && (
                <div className="absolute z-20 left-0 right-0 mt-1 rounded-xl border border-stone-700 bg-stone-900 shadow-xl overflow-hidden">
                  {results.map((c) => (
                    <div key={c._id} onClick={() => handleSelect(c)}
                      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-stone-800 transition-colors">
                      <div className="w-7 h-7 rounded-full bg-stone-700 flex items-center justify-center shrink-0">
                        <span className="text-xs text-stone-300 font-semibold">{c.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-stone-200 font-medium truncate">{c.name}</p>
                        <p className="text-xs text-stone-500 truncate">{[c.phones?.[0], c.emails?.[0]].filter(Boolean).join(" · ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Telefon + Email tek satır */}
            <div className="grid md:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Telefon</label>
                <PhoneInput name="contactPhone" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">E-posta</label>
                <input
                  type="email" value={values.contactEmail} autoComplete="off"
                  onChange={(e) => setFieldValue("contactEmail", e.target.value)}
                  className="w-full px-2 py-[6px] border border-gray-300 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
