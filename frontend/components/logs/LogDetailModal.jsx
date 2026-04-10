"use client";
import { LEVEL_COLORS } from "./LogTable";

export default function LogDetailModal({ log, onClose }) {
  if (!log) return null;

  const copy = () => navigator.clipboard.writeText(JSON.stringify(log, null, 2));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-stone-700">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${LEVEL_COLORS[log.level]}`}>
              {log.level?.toUpperCase()}
            </span>
            <span className="text-stone-300 text-sm">{new Date(log.timestamp).toLocaleString("tr-TR")}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={copy} className="text-xs text-stone-400 hover:text-amber-400 transition-colors">
              Kopyala
            </button>
            <button onClick={onClose} className="text-stone-400 hover:text-white text-lg leading-none">×</button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <p className="text-xs text-stone-500 mb-1">Mesaj</p>
            <p className="text-stone-200 text-sm">{log.message}</p>
          </div>

          {log.meta && (
            <div>
              <p className="text-xs text-stone-500 mb-1">Meta</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(log.meta)
                  .filter(([k]) => k !== "stack")
                  .map(([k, v]) => (
                    <div key={k} className="bg-stone-800 rounded-lg p-2">
                      <p className="text-xs text-stone-500">{k}</p>
                      <p className="text-stone-300 text-sm truncate">{String(v)}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {log.meta?.stack && (
            <div>
              <p className="text-xs text-stone-500 mb-1">Stack Trace</p>
              <pre className="bg-stone-950 text-red-400 text-xs rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
                {log.meta.stack}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
