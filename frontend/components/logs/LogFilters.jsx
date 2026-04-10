"use client";
import { useEffect, useRef } from "react";

const SERVICES = [
  { value: "all", label: "Tüm Servisler" },
  { value: "backend", label: "Backend" },
  { value: "auth-service", label: "Auth Service" },
  { value: "pdf-service", label: "PDF Service" },
];

const LEVELS = ["all", "error", "warn", "info", "http", "debug"];

const RANGES = [
  { label: "Son 1 saat", value: "1h" },
  { label: "Son 24 saat", value: "24h" },
  { label: "Son 7 gün", value: "7d" },
  { label: "Tümü", value: "all" },
];

function getRangeDates(value) {
  const now = new Date();
  if (value === "1h") return { startDate: new Date(now - 3600000).toISOString(), endDate: "" };
  if (value === "24h") return { startDate: new Date(now - 86400000).toISOString(), endDate: "" };
  if (value === "7d") return { startDate: new Date(now - 7 * 86400000).toISOString(), endDate: "" };
  return { startDate: "", endDate: "" };
}

export default function LogFilters({ filters, onChange, onClear }) {
  const debounceRef = useRef(null);

  const handleSearch = (val) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange({ search: val, page: 1 }), 300);
  };

  const handleRange = (value) => {
    onChange({ ...getRangeDates(value), page: 1 });
  };

  const select =
    "bg-stone-800 border border-stone-700 text-stone-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500";

  return (
    <div className="flex flex-wrap gap-3 mb-4 items-center">
      <select
        className={select}
        value={filters.service || "all"}
        onChange={(e) => onChange({ service: e.target.value, page: 1 })}
      >
        {SERVICES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      <select
        className={select}
        value={filters.level || "all"}
        onChange={(e) => onChange({ level: e.target.value, page: 1 })}
      >
        {LEVELS.map((l) => (
          <option key={l} value={l}>{l === "all" ? "Tüm Seviyeler" : l.toUpperCase()}</option>
        ))}
      </select>

      <select className={select} onChange={(e) => handleRange(e.target.value)}>
        {RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
      </select>

      <input
        type="text"
        placeholder="Mesaj ara..."
        defaultValue={filters.search || ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="bg-stone-800 border border-stone-700 text-stone-200 text-sm rounded-lg px-3 py-2 w-52 focus:outline-none focus:border-amber-500"
      />

      <button
        onClick={onClear}
        className="text-xs text-stone-400 hover:text-amber-400 border border-stone-700 rounded-lg px-3 py-2 transition-colors"
      >
        Temizle
      </button>
    </div>
  );
}
