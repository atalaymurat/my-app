"use client";

const STEPS = [
  { label: "Firma & Kişi", icon: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
  { label: "Ürünler",      icon: "M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" },
  { label: "Kondisyon",    icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5h6" },
  { label: "Özet",         icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
];

export default function ProgressBar({ currentStep }) {
  return (
    <div className="flex items-start gap-0 mb-6 select-none">
      {STEPS.map((step, i) => {
        const done   = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={i} className="flex items-start flex-1">
            {/* Step node */}
            <div className="flex flex-col items-center gap-1.5 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                done   ? "bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-900/40" :
                active ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/50" :
                         "bg-stone-800 border-stone-600"
              }`}>
                {done ? (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className={`w-4 h-4 ${active ? "text-white" : "text-stone-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                  </svg>
                )}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest text-center leading-tight ${
                done ? "text-emerald-500" : active ? "text-blue-400" : "text-stone-600"
              }`}>{step.label}</span>
            </div>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div className="flex-1 mt-[18px] mx-1">
                <div className={`h-0.5 w-full transition-all duration-500 rounded-full ${done ? "bg-emerald-500" : "bg-stone-700"}`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
