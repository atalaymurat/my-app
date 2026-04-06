"use client";
import { useEffect, useState } from "react";

export default function MessageBlock({ message, duration = 5000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) { setVisible(false); return; }
    setVisible(true);
    if (!duration) return;
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [message, duration]);

  if (!message || !visible) return null;

  const isError = message.type === "error";
  const isWarning = message.type === "warning";

  return (
    <div className={`my-3 rounded-xl border px-4 py-3 flex items-start gap-3 transition-all ${
      isError    ? "bg-red-950/40 border-red-800/60 text-red-300" :
      isWarning  ? "bg-amber-950/40 border-amber-700/60 text-amber-300" :
                   "bg-emerald-950/40 border-emerald-700/60 text-emerald-300"
    }`} role="alert">
      {/* İkon */}
      <div className="shrink-0 mt-0.5">
        {isError ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        ) : isWarning ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        )}
      </div>
      {/* Metin */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug">{message.text}</p>
        {message.detail && <p className="text-xs mt-0.5 opacity-75">{message.detail}</p>}
      </div>
    </div>
  );
}
