
// InfoBlock.js
import React from "react";

export function InfoBlock({ title, children }) {
  return (
    <div className="text-stone-300 py-2">
      <div className="font-semibold text-lg">{title}</div>
      <div className="text-stone-500 whitespace-pre-line">{children}</div>
    </div>
  );
}