"use client";
import { useState, useEffect } from "react";
import axiosOrg from "@/utils/axiosOrg";
import axios from "@/utils/axios";

function Toggle({ label, value, onChange, activeColor }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center gap-2.5 w-full px-4 py-2 rounded-lg border transition-colors text-sm ${
        value
          ? `${activeColor} text-white`
          : "bg-stone-800 border-stone-700 text-stone-400"
      }`}
    >
      <div
        className={`w-7 h-4 rounded-full border flex items-center transition-all ${value ? "bg-white/20 border-white/30" : "bg-stone-700 border-stone-600"}`}
      >
        <div
          className={`w-2.5 h-2.5 rounded-full mx-0.5 transition-all duration-200 ${value ? "translate-x-3 bg-white" : "translate-x-0 bg-stone-500"}`}
        />
      </div>
      <span className="font-semibold">{label}</span>
    </button>
  );
}

export default function OfferTermsPanel() {
  const [org, setOrg] = useState(null);
  const [terms, setTerms] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [newOptions, setNewOptions] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosOrg.get("/me");
        console.log("[OfferTerms] /me response:", data);
        setOrg(data);
        setTerms(data.offerDefaults || []);
      } catch (err) {
        setMsg({ type: "error", text: "Ayarlar yüklenemedi." });
      }
    })();
  }, []);

  const updateTerm = (key, field, value) => {
    setTerms((prev) =>
      prev.map((t) => (t.key === key ? { ...t, [field]: value } : t)),
    );
  };

  const addOption = (termKey) => {
    const val = newOptions[termKey]?.trim();
    if (!val) return;

    setTerms((prev) =>
      prev.map((t) => {
        if (t.key !== termKey) return t;
        const opts = t.options || [];
        if (opts.length >= 10) return t;
        return { ...t, options: [...opts, val] };
      }),
    );
    setNewOptions((prev) => ({ ...prev, [termKey]: "" }));
  };

  const removeOption = (termKey, optIdx) => {
    setTerms((prev) =>
      prev.map((t) =>
        t.key === termKey
          ? { ...t, options: t.options.filter((_, i) => i !== optIdx) }
          : t,
      ),
    );
  };

  const save = async () => {
    if (!org) return;
    setSaving(true);
    try {
      const { data } = await axios.patch(`/api/org/${org._id}/offer-defaults`, {
        offerDefaults: terms,
      });
      setMsg({ type: "success", text: "Kaydedildi." });
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Hata oluştu.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!org) return <div className="text-stone-400 text-sm">Yükleniyor...</div>;

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-950/80 p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">
        Satış Koşulları Şablonu
      </p>

      <div className="space-y-4">
        {terms.map((term) => (
          <div
            key={term.key}
            className="rounded-xl border border-stone-800 bg-stone-900/50 p-3.5"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2.5">
              {term.label}
            </p>

            {(term.options || []).length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {term.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 px-2 py-0.5 text-xs rounded border bg-stone-900 border-stone-600 text-stone-300"
                    >
                      {opt}
                      <button
                        type="button"
                        onClick={() => removeOption(term.key, idx)}
                        className="ml-1 text-stone-500 hover:text-stone-400 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {term.options.length < 10 && (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Yeni seçenek"
                      value={newOptions[term.key] || ""}
                      onChange={(e) =>
                        setNewOptions((prev) => ({
                          ...prev,
                          [term.key]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && addOption(term.key)
                      }
                      className="flex-1 px-3 py-1.5 text-xs rounded border bg-stone-900 border-stone-700 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-stone-500"
                    />
                    <button
                      type="button"
                      onClick={() => addOption(term.key)}
                      className="px-3 py-1.5 text-xs font-semibold rounded border bg-stone-800 border-stone-600 text-stone-300 hover:border-stone-500 hover:text-stone-200 transition-colors"
                    >
                      Ekle
                    </button>
                  </div>
                )}

                {term.options.length >= 10 && (
                  <p className="text-[10px] text-amber-600">
                    Maksimum 10 seçenek.
                  </p>
                )}
              </div>
            )}

            <div className="mb-2.5">
              <textarea
                rows={3}
                value={term.value ?? ""}
                onChange={(e) => updateTerm(term.key, "value", e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border bg-stone-900 border-stone-700 text-stone-200 focus:outline-none focus:border-stone-500 resize-none"
              />
            </div>

            <div className="flex items-center gap-2 mb-2.5">
              <Toggle
                label="Dokümanlarda Göster"
                value={term.isVisible ?? true}
                onChange={(v) => updateTerm(term.key, "isVisible", v)}
                activeColor="bg-emerald-700 border-emerald-600"
              />
            </div>

            <Toggle
              label="Teklifte Düzenlenebilir"
              value={term.isEditable ?? false}
              onChange={(v) => updateTerm(term.key, "isEditable", v)}
              activeColor="bg-blue-700 border-blue-600"
            />
          </div>
        ))}
      </div>

      {msg && (
        <div
          className={`mt-4 px-4 py-2.5 rounded-lg text-xs font-semibold ${
            msg.type === "success"
              ? "bg-emerald-900/30 border border-emerald-700 text-emerald-300"
              : "bg-red-900/30 border border-red-700 text-red-300"
          }`}
        >
          {msg.text}
        </div>
      )}

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-5 w-full py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-amber-600 hover:bg-amber-500 border border-amber-600 text-white"
      >
        {saving ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </div>
  );
}
