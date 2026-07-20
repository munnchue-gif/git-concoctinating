import React, { useState } from "react";
import { Zap } from "lucide-react";
import { NEON } from "@/components/deck/deckColors";

export default function NeonButton({ control, onChange }) {
  const c = NEON[control.color] || NEON.cyan;
  const [flash, setFlash] = useState(false);

  const fire = () => {
    onChange((control.value ?? 0) + 1);
    setFlash(true);
    setTimeout(() => setFlash(false), 400);
  };

  return (
    <button
      onClick={fire}
      className={`w-full rounded-xl border ${c.border} p-4 text-left transition-all duration-150 active:scale-[0.97] ${
        flash ? `${c.bg} ${c.glow} ring-2 ${c.ring}` : "bg-zinc-900/70 hover:bg-zinc-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">{control.name}</span>
        <Zap className={`h-4 w-4 ${c.text}`} />
      </div>
      <p className={`mt-2 font-mono text-sm ${c.text}`}>FIRE · sent {control.value ?? 0}×</p>
    </button>
  );
}