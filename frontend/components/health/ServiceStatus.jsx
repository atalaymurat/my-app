"use client";

const SERVICE_LABELS = {
  backend: "Backend API",
  "auth-service": "Auth Service",
  "pdf-service": "PDF Service",
};

function StatusDot({ healthy }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      {healthy && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      )}
      <span
        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
          healthy ? "bg-green-400" : "bg-red-500"
        }`}
      />
    </span>
  );
}

export default function ServiceStatus({ service }) {
  const healthy = service.status === "healthy";

  return (
    <div className="bg-stone-800 border border-stone-700 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-stone-200 text-sm font-medium">
          {SERVICE_LABELS[service.name] || service.name}
        </span>
        <StatusDot healthy={healthy} />
      </div>

      <div className="flex items-center gap-3 text-xs text-stone-500">
        <span className={healthy ? "text-green-400" : "text-red-400"}>
          {healthy ? "Çalışıyor" : "Sorunlu"}
        </span>
        {service.responseTime > 0 && (
          <span>{service.responseTime}ms</span>
        )}
      </div>

      {service.meta && (
        <div className="flex gap-3 text-xs text-stone-600 mt-1">
          <span>DB: {service.meta.db}</span>
          <span>RAM: {service.meta.memoryMB}MB</span>
          <span>Uptime: {Math.floor(service.meta.uptime / 60)}dk</span>
        </div>
      )}

      {service.error && (
        <p className="text-xs text-red-400 truncate" title={service.error}>
          {service.error}
        </p>
      )}
    </div>
  );
}
