"use client";

export const LEVEL_COLORS = {
  error: "bg-red-500/20 text-red-400 border border-red-500/30",
  warn:  "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  info:  "bg-green-500/20 text-green-400 border border-green-500/30",
  http:  "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  debug: "bg-stone-500/20 text-stone-400 border border-stone-500/30",
};

const SERVICE_BADGES = {
  backend:      "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "auth-service": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "pdf-service":  "bg-orange-500/15 text-orange-400 border-orange-500/30",
};

const SERVICE_LABELS = {
  backend: "Backend",
  "auth-service": "Auth",
  "pdf-service": "PDF",
};

function relativeTime(date) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "az önce";
  if (m < 60) return `${m}dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}sa önce`;
  return `${Math.floor(h / 24)}g önce`;
}

export default function LogTable({ logs, onRowClick, flashIds = new Set() }) {
  if (!logs?.length) {
    return <div className="text-stone-500 text-sm p-8 text-center">Log bulunamadı.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-stone-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-stone-800 text-stone-400 text-xs uppercase">
            <th className="px-4 py-3 text-left">Zaman</th>
            <th className="px-4 py-3 text-left">Servis</th>
            <th className="px-4 py-3 text-left">Seviye</th>
            <th className="px-4 py-3 text-left">Mesaj</th>
            <th className="px-4 py-3 text-left">Request ID</th>
            <th className="px-4 py-3 text-left">User</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log._id}
              onClick={() => onRowClick(log)}
              className={`border-t border-stone-800 hover:bg-stone-800/50 cursor-pointer transition-colors ${flashIds.has(log._id) ? "animate-pulse bg-amber-500/10" : ""}`}
            >
              <td className="px-4 py-3 text-stone-400 whitespace-nowrap" title={new Date(log.timestamp).toLocaleString("tr-TR")}>
                {relativeTime(log.timestamp)}
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${SERVICE_BADGES[log.service] || "bg-stone-500/15 text-stone-400 border-stone-500/30"}`}>
                  {SERVICE_LABELS[log.service] || log.service || "—"}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LEVEL_COLORS[log.level] || ""}`}>
                  {log.level?.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3 text-stone-200 max-w-xs truncate">{log.message}</td>
              <td className="px-4 py-3 text-stone-500 font-mono text-xs">{log.meta?.requestId || "—"}</td>
              <td className="px-4 py-3 text-stone-500 text-xs">{log.meta?.userId || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
