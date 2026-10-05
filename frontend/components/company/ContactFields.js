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
    <div className="flex gap-2">
      <div className="flex items-center">
        <span className="px-3 py-3 bg-stone-800 border border-r-0 border-stone-700 rounded-l-xl text-stone-500 text-sm">+</span>
        <input
          type="text" value={cc} autoComplete="off"
          onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 3); setCc(v); isTyping.current = true; helpers.setValue(v + ":" + localMasked.replace(/\D/g, "")); }}
          className="w-12 px-2 py-3 border border-stone-700 rounded-r-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-stone-300 bg-stone-800 transition-colors"
        />
      </div>
      <InputMask
        mask="___ ___ __ __" replacement={{ _: /\d/ }} placeholder="___ ___ __ __"
        value={localMasked} autoComplete="off"
        onChange={(e) => { const v = e.target.value; setLocalMasked(v); isTyping.current = true; helpers.setValue(cc + ":" + v.replace(/\D/g, "")); }}
        className="flex-1 px-3 py-3 border border-stone-700 rounded-xl text-sm text-stone-300 bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
      />
    </div>
  );
}

function LinkedCard({ values, onClear }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl">
      <div className="shrink-0 w-12 h-12 rounded-full bg-emerald-900/30 border border-emerald-800/50 flex items-center justify-center">
        <span className="text-base font-bold text-emerald-400">{values.contactName?.[0]?.toUpperCase()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-emerald-300 truncate">{values.contactName}</p>
        <p className="text-xs text-stone-500 truncate mt-1">{[values.contactPhone, values.contactEmail].filter(Boolean).join(" · ")}</p>
      </div>
      <button type="button" onClick={onClear}
        className="shrink-0 w-9 h-9 rounded-lg bg-stone-800 hover:bg-red-900/40 border border-stone-700 hover:border-red-700/50 flex items-center justify-center transition-colors">
        <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function getContactDisplayName(contact = {}) {
  return contact.displayName || "";
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
    const displayName = getContactDisplayName(contact);

    setFieldValue("contactId", contact._id);
    setFieldValue("contactName", displayName);
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
    <div className="rounded-2xl border border-stone-800 bg-stone-950/50 overflow-hidden">
      <div className="px-5 py-3.5 bg-stone-900/40 border-b border-stone-800 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-500">İletişim Kişisi</p>
        {values.contactId && (
          <span className="text-xs text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />Bağlı
          </span>
        )}
      </div>

      <div className="p-5 space-y-4">
        {values.contactId ? (
          <LinkedCard values={values} onClear={handleClear} />
        ) : (
          <>
            <div className="relative">
              <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">Kişi Ara / İsim</label>
              <input
                type="text" value={values.contactName} onChange={handleSearchChange} autoComplete="off"
                onFocus={() => results.length && setShowDropdown(true)}
                className="w-full px-4 py-3 rounded-xl border border-stone-700 bg-stone-800/50 text-sm text-stone-300 placeholder-stone-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              {showDropdown && (
                <div className="absolute z-20 left-0 right-0 mt-2 rounded-xl border border-stone-700 bg-stone-900 shadow-2xl overflow-hidden max-h-72 overflow-y-auto">
                  {results.map((c) => (
                    <div key={c._id} onClick={() => handleSelect(c)}
                      className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-stone-800 transition-colors border-b border-stone-800 last:border-0">
                      <div className="w-9 h-9 rounded-lg bg-stone-700 flex items-center justify-center shrink-0">
                        <span className="text-sm text-stone-300 font-semibold">{getContactDisplayName(c)?.[0]?.toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-stone-200 font-semibold truncate">{getContactDisplayName(c)}</p>
                        <p className="text-xs text-stone-500 truncate mt-0.5">{[c.phones?.[0], c.emails?.[0]].filter(Boolean).join(" · ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">Telefon</label>
                <PhoneInput name="contactPhone" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">E-posta</label>
                <input
                  type="email" value={values.contactEmail} autoComplete="off"
                  onChange={(e) => setFieldValue("contactEmail", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-700 bg-stone-800/50 text-sm text-stone-300 placeholder-stone-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
