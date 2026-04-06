"use client";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import axios from "@/utils/axios";

const COUNTRIES = [
  { code: "tr", label: "Türkiye" }, { code: "de", label: "Almanya" },
  { code: "it", label: "İtalya" }, { code: "us", label: "ABD" },
  { code: "tw", label: "Tayvan" }, { code: "cn", label: "Çin" },
  { code: "jp", label: "Japonya" }, { code: "kr", label: "Güney Kore" },
];

export default function InlineMakeCreate({ onSuccess, onCancel }) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("tr");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // ESC ile kapat
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = useCallback(async () => {
    if (!name.trim()) { setError("Marka adı zorunlu"); return; }
    setSaving(true);
    setError(null);
    try {
      let logoUrl = "";
      if (logoFile) {
        const fd = new FormData();
        fd.append("image", logoFile);
        const { data: up } = await axios.post("/api/upload?folder=makes", fd);
        logoUrl = up.url;
      }
      const { data } = await axios.post("/api/make", { name: name.trim(), country, logo: logoUrl });
      if (data.success && data.make) {
        onSuccess({ value: data.make._id, label: data.make.name, logo: data.make.logo || "" });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Hata oluştu");
    } finally {
      setSaving(false);
    }
  }, [name, country, logoFile, onSuccess]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-stone-100">Yeni Marka Ekle</p>
          <button type="button" onClick={onCancel}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-500 hover:text-stone-200 hover:bg-stone-800 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center overflow-hidden shrink-0">
            {logoPreview
              ? <img src={logoPreview} alt="logo" className="w-full h-full object-cover" />
              : <span className="text-stone-500 text-xl font-black">{name?.charAt(0)?.toUpperCase() || "?"}</span>
            }
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="cursor-pointer px-3 py-1.5 text-xs bg-stone-800 border border-stone-700 text-stone-300 rounded-lg hover:border-amber-600 transition-colors">
              Logo Seç
              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            </label>
            {logoPreview && (
              <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(null); }}
                className="text-xs text-red-400 hover:text-red-300 text-left">Kaldır</button>
            )}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-1">Marka Adı *</label>
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="örn. Bosch"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="w-full bg-stone-800 border border-stone-700 text-stone-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-600 transition-colors"
          />
        </div>

        {/* Country */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-1">Ülke</label>
          <select value={country} onChange={e => setCountry(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 text-stone-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-600">
            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex gap-2 pt-1">
          <button type="button" onClick={handleSave} disabled={saving}
            className="flex-1 py-2 text-sm font-bold bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl transition-colors">
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button type="button" onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition-colors">
            İptal
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
