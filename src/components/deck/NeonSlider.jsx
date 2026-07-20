import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { NEON } from "@/components/deck/deckColors";

export default function NeonSlider({ control, onChange }) {
  const c = NEON[control.color] || NEON.cyan;
  const [local, setLocal] = useState(control.value ?? 0);
  useEffect(() => setLocal(control.value ?? 0), [control.value]);

  return (
    <div className={`rounded-xl border ${c.border} bg-zinc-900/70 p-4 ${c.glow}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">{control.name}</span>
        <span className={`font-mono text-lg ${c.text}`}>{local}</span>
      </div>
      <Slider
        value={[local]}
        min={control.min ?? 0}
        max={control.max ?? 100}
        step={control.step ?? 1}
        onValueChange={([v]) => setLocal(v)}
        onValueCommit={([v]) => onChange(v)}
        className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-2 [&_[role=slider]]:bg-zinc-950"
      />
      <div className="flex justify-between mt-1.5 text-[10px] font-mono text-zinc-600">
        <span>{control.min ?? 0}</span>
        <span>{control.max ?? 100}</span>
      </div>
    </div>
  );
}