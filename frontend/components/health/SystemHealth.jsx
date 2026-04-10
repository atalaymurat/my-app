"use client";
import { useState, useEffect, useRef } from "react";
import axios from "@/utils/axios";
import ServiceStatus from "./ServiceStatus";

export default function SystemHealth() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetch = async () => {
    try {
      const { data: res } = await axios.get("/api/health");
      setData(res);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    fetch();
    intervalRef.current = setInterval(fetch, 30000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const healthyCount = data?.services?.filter((s) => s.status === "healthy").length ?? 0;
  const total = data?.services?.length ?? 0;
  const allHealthy = data?.allHealthy;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-stone-300 uppercase tracking-wider">
            Sistem Durumu
          </h2>
          {!loading && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                allHealthy
                  ? "bg-green-500/15 text-green-400 border border-green-500/30"
                  : "bg-red-500/15 text-red-400 border border-red-500/30"
              }`}
            >
              {allHealthy ? `${healthyCount}/${total} servis çalışıyor` : `${total - healthyCount} servis sorunlu`}
            </span>
          )}
        </div>
        <button
          onClick={fetch}
          className="text-xs text-stone-500 hover:text-amber-400 transition-colors"
        >
          ↻ Yenile
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-stone-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data?.services?.map((s) => (
            <ServiceStatus key={s.name} service={s} />
          ))}
        </div>
      )}
    </div>
  );
}
