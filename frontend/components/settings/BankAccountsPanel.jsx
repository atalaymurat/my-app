"use client";
import { useState, useEffect } from "react";
import axiosOrg from "@/utils/axiosOrg";
import axios from "@/utils/axios";

const CURRENCIES = ["TRY", "USD", "EUR"];

const empty = () => ({
  bankName: "", currency: "TRY", iban: "", swiftCode: "", accountHolder: "", isActive: true,
});

export default function BankAccountsPanel() {
  const [org, setOrg] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosOrg.get("/me");
        setOrg(data);
        setAccounts(data.bankAccounts || []);
      } catch {
        setMsg({ type: "error", text: "Hesaplar yüklenemedi." });
      }
    })();
  }, []);

  const save = async (next) => {
    if (!org) return;
    setSaving(true);
    try {
      await axios.patch(`/api/org/${org._id}/bank-accounts`, { bankAccounts: next });
      setAccounts(next);
      setMsg({ type: "success", text: "Kaydedildi." });
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Hata oluştu." });
    } finally {
      setSaving(false);
    }
  };

  const addAccount = () => {
    if (!form.bankName.trim() || !form.iban.trim()) {
      setMsg({ type: "error", text: "Banka adı ve IBAN zorunludur." });
      return;
    }
    const next = [...accounts, { ...form }];
    setForm(empty());
    save(next);
  };

  const toggle = (idx) => {
    const next = accounts.map((a, i) =>
      i === idx ? { ...a, isActive: !a.isActive } : a
    );
    save(next);
  };

  const remove = (idx) => {
    save(accounts.filter((_, i) => i !== idx));
  };

  if (!org) return <div className="text-stone-400 text-sm">Yükleniyor...</div>;

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-950/80 p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">
        Banka Hesapları
      </p>

      {/* Existing accounts */}
      {accounts.length > 0 && (
        <div className="mb-5 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-stone-800">
                {["Banka", "Para Birimi", "IBAN", "SWIFT", "Hesap Sahibi", "Aktif", ""].map((h) => (
                  <th key={h} className="pb-2 pr-4 text-left font-semibold text-stone-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accounts.map((a, i) => (
                <tr key={i} className="border-b border-stone-800/50">
                  <td className="py-2.5 pr-4 text-stone-200 font-medium">{a.bankName}</td>
                  <td className="py-2.5 pr-4 text-stone-400">{a.currency}</td>
                  <td className="py-2.5 pr-4 text-stone-300 font-mono">{a.iban}</td>
                  <td className="py-2.5 pr-4 text-stone-400 font-mono">{a.swiftCode || "—"}</td>
                  <td className="py-2.5 pr-4 text-stone-400">{a.accountHolder || "—"}</td>
                  <td className="py-2.5 pr-4">
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      className={`w-7 h-4 rounded-full border flex items-center transition-all ${
                        a.isActive ? "bg-emerald-600 border-emerald-500" : "bg-stone-700 border-stone-600"
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full mx-0.5 bg-white transition-all duration-200 ${a.isActive ? "translate-x-3" : "translate-x-0"}`} />
                    </button>
                  </td>
                  <td className="py-2.5">
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="text-stone-600 hover:text-red-400 transition-colors font-bold text-sm"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add form */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">
          Yeni Hesap Ekle
        </p>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            placeholder="Banka Adı *"
            value={form.bankName}
            onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
            className="px-3 py-2 text-xs rounded border bg-stone-900 border-stone-700 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-stone-500"
          />
          <select
            value={form.currency}
            onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
            className="px-3 py-2 text-xs rounded border bg-stone-900 border-stone-700 text-stone-200 focus:outline-none focus:border-stone-500"
          >
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            placeholder="IBAN *"
            value={form.iban}
            onChange={(e) => setForm((f) => ({ ...f, iban: e.target.value }))}
            className="px-3 py-2 text-xs rounded border bg-stone-900 border-stone-700 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-stone-500 font-mono"
          />
          <input
            placeholder="SWIFT / BIC"
            value={form.swiftCode}
            onChange={(e) => setForm((f) => ({ ...f, swiftCode: e.target.value }))}
            className="px-3 py-2 text-xs rounded border bg-stone-900 border-stone-700 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-stone-500 font-mono"
          />
        </div>
        <input
          placeholder="Hesap Sahibi (opsiyonel)"
          value={form.accountHolder}
          onChange={(e) => setForm((f) => ({ ...f, accountHolder: e.target.value }))}
          className="w-full px-3 py-2 text-xs rounded border bg-stone-900 border-stone-700 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-stone-500 mb-3"
        />
        <button
          type="button"
          onClick={addAccount}
          disabled={saving}
          className="w-full py-2 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 border border-amber-600 text-white transition-colors disabled:opacity-50"
        >
          {saving ? "Kaydediliyor..." : "Hesap Ekle"}
        </button>
      </div>

      {msg && (
        <div className={`mt-4 px-4 py-2.5 rounded-lg text-xs font-semibold ${
          msg.type === "success"
            ? "bg-emerald-900/30 border border-emerald-700 text-emerald-300"
            : "bg-red-900/30 border border-red-700 text-red-300"
        }`}>
          {msg.text}
        </div>
      )}
    </div>
  );
}
