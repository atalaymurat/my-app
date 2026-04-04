"use client";
import { useState } from "react";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";

const COUNTRIES = [
  { code: "tr", label: "Türkiye" },
  { code: "de", label: "Almanya" },
  { code: "it", label: "İtalya" },
  { code: "us", label: "ABD" },
  { code: "tw", label: "Tayvan" },
  { code: "cn", label: "Çin" },
  { code: "jp", label: "Japonya" },
  { code: "kr", label: "Güney Kore" },
];

export default function MakeForm({ initial = {}, onSuccess }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial.name || "",
    country: initial.country || "tr",
    description: initial.description || "",
    logo: initial.logo || "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(initial.logo || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let logoUrl = form.logo;

      if (logoFile) {
        const fd = new FormData();
        fd.append("image", logoFile);
        const { data: up } = await axios.post("/api/upload?folder=makes", fd);
        logoUrl = up.url;
      }

      const payload = { ...form, logo: logoUrl };

      if (initial._id) {
        await axios.patch(`/api/make/${initial._id}`, payload);
      } else {
        await axios.post("/api/make", payload);
      }

      onSuccess?.();
      router.push("/shield/make");
    } catch (err) {
      setError(err.response?.data?.error || "Hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">

      {/* Logo */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-2">Logo</label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-stone-900 border border-stone-700 flex items-center justify-center overflow-hidden">
            {logoPreview
              ? <img src={logoPreview} alt="logo" className="w-full h-full object-contain p-1" />
              : <span className="text-stone-600 text-2xl font-black">{form.name?.charAt(0)?.toUpperCase() || "?"}</span>
            }
          </div>
          <label className="cursor-pointer px-3 py-2 bg-stone-900 border border-stone-700 text-stone-300 text-sm rounded-lg hover:border-amber-600 transition-colors">
            Görsel Seç
            <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
          </label>
          {logoPreview && (
            <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(null); set("logo", ""); }}
              className="text-xs text-red-400 hover:text-red-300">
              Kaldır
            </button>
          )}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">Marka Adı *</label>
        <input required value={form.name} onChange={e => set("name", e.target.value)}
          className="w-full bg-stone-900 border border-stone-700 text-stone-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-600"
        />
      </div>

      {/* Country */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">Ülke</label>
        <select value={form.country} onChange={e => set("country", e.target.value)}
          className="w-full bg-stone-900 border border-stone-700 text-stone-300 text-sm rounded-lg px-3 py-2">
          {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">Açıklama</label>
        <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3}
          className="w-full bg-stone-900 border border-stone-700 text-stone-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-600 resize-none"
        />
      </div>

      {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={saving}
          className="px-5 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors">
          {saving ? "Kaydediliyor..." : initial._id ? "Güncelle" : "Kaydet"}
        </button>
        <button type="button" onClick={() => router.push("/shield/make")}
          className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-semibold rounded-lg transition-colors">
          İptal
        </button>
      </div>
    </form>
  );
}
