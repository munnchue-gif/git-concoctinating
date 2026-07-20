import React from "react";
import { NEON } from "@/components/deck/deckColors";

export default function NeonToggle({ control, onChange }) {
  const c = NEON[control.color] || NEON.cyan;
  const on = (control.value ?? 0) >= 1;
  return (
    <button
      onClick={() => onChange(on ? 0 : 1)}
      className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
        on ? `${c.border} ${c.bg} ${c.glow}` : "border-zinc-800 bg-zinc-900/70"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">{control.name}</span>
        <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? c.fill : "bg-zinc-700"}`}>
          <span className={`inline-block h-4 w-4 rounded-full bg-zinc-950 transition-transform ${on ? "translate-x-6" : "translate-x-1"}`} />
        </span>
      </div>
      <p className={`mt-2 font-mono text-sm ${on ? c.text : "text-zinc-600"}`}>{on ? "ENGAGED" : "OFF"}</p>
    </button>
  );
}