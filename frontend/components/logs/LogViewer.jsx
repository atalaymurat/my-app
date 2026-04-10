"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "@/utils/axios";
import useLogSocket from "@/hooks/useLogSocket";
import LogStats from "./LogStats";
import LogFilters from "./LogFilters";
import LogTable from "./LogTable";
import LogDetailModal from "./LogDetailModal";
import ConnectionStatus from "./ConnectionStatus";

const DEFAULT_FILTERS = { service: "all", level: "all", startDate: "", endDate: "", search: "", page: 1 };

function exportCSV(logs) {
  const header = "timestamp,level,message,requestId,userId\n";
  const rows = logs.map((l) =>
    [l.timestamp, l.level, `"${l.message?.replace(/"/g, '""')}"`, l.meta?.requestId || "", l.meta?.userId || ""].join(",")
  ).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `logs-${Date.now()}.csv`;
  a.click();
}

export default function LogViewer() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [liveEnabled, setLiveEnabled] = useState(true);
  const [flashIds, setFlashIds] = useState(new Set());
  const isPage1NoFilter = filters.page === 1 && filters.level === "all" && !filters.search && !filters.startDate;

  const handleNewLogs = useCallback((entries) => {
    if (!isPage1NoFilter) return;
    setLogs((prev) => {
      const ids = new Set(prev.map((l) => l._id));
      const fresh = entries.filter((e) => !ids.has(e._id));
      if (!fresh.length) return prev;
      setFlashIds(new Set(fresh.map((e) => e._id)));
      setTimeout(() => setFlashIds(new Set()), 1000);
      return [...fresh, ...prev].slice(0, 200);
    });
    setStats((s) => s ? { ...s, total24h: (s.total24h || 0) + entries.length } : s);
  }, [isPage1NoFilter]);

  const { status } = useLogSocket({ enabled: liveEnabled, onNewLogs: handleNewLogs });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v && v !== "all"));
      const { data } = await axios.get("/api/logs", { params });
      setLogs(data.logs);
      setTotalPages(data.totalPages);
    } catch (_) {}
    setLoading(false);
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/logs/stats");
      setStats(data);
    } catch (_) {}
  }, []);

  useEffect(() => { fetchLogs(); fetchStats(); }, [fetchLogs, fetchStats]);

  const updateFilters = (patch) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <div className="text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Sistem Logları</h1>
          <ConnectionStatus status={status} />
        </div>
        <div className="flex gap-3 items-center">
          <label className="flex items-center gap-2 text-sm text-stone-400 cursor-pointer">
            <input type="checkbox" checked={liveEnabled} onChange={(e) => setLiveEnabled(e.target.checked)} className="accent-amber-500" />
            Canlı izleme
          </label>
          <button onClick={() => { fetchLogs(); fetchStats(); }} className="text-sm border border-stone-700 rounded-lg px-3 py-1.5 hover:border-amber-500 text-stone-300 transition-colors">
            ↻ Yenile
          </button>
          <button onClick={() => exportCSV(logs)} className="text-sm bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg px-3 py-1.5 hover:bg-amber-500/20 transition-colors">
            CSV İndir
          </button>
        </div>
      </div>

      <LogStats stats={stats} />
      <LogFilters filters={filters} onChange={updateFilters} onClear={() => setFilters(DEFAULT_FILTERS)} />

      {loading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => <div key={i} className="h-10 bg-stone-800 rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <LogTable logs={logs} onRowClick={setSelectedLog} flashIds={flashIds} />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => updateFilters({ page: i + 1 })}
              className={`w-8 h-8 rounded-lg text-sm transition-colors ${filters.page === i + 1 ? "bg-amber-500 text-stone-900 font-bold" : "bg-stone-800 text-stone-400 hover:bg-stone-700"}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}
