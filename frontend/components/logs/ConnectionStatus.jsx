"use client";

const CONFIG = {
  connected:    { dot: "bg-green-400 animate-ping-once", label: "Canlı izleme aktif",  color: "text-green-400",  border: "border-green-500/30", bg: "bg-green-500/10" },
  connecting:   { dot: "bg-yellow-400 animate-pulse",    label: "Bağlanıyor...",        color: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-500/10" },
  disconnected: { dot: "bg-red-500",                     label: "Bağlantı kesildi",     color: "text-red-400",    border: "border-red-500/30",    bg: "bg-red-500/10" },
};

export default function ConnectionStatus({ status }) {
  const c = CONFIG[status] || CONFIG.disconnected;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${c.bg} ${c.border} ${c.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
