import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Radio, Trash2 } from "lucide-react";
import useControls from "@/components/deck/useControls";
import NeonSlider from "@/components/deck/NeonSlider";
import NeonToggle from "@/components/deck/NeonToggle";
import NeonButton from "@/components/deck/NeonButton";
import AddControlDialog from "@/components/deck/AddControlDialog";

export default function BoardControlStrip() {
  const { controls, setValue, create, remove } = useControls();
  const [removeMode, setRemoveMode] = useState(false);

  return (
    <section className="mb-10 rounded-2xl border border-accent/30 bg-card/60 p-5 shadow-[0_0_30px_-12px_hsl(var(--accent))]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-accent">
          <Radio className="h-4 w-4 animate-pulse" /> Bridge controls · live sync
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRemoveMode((v) => !v)}
            className={`rounded-full border px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
              removeMode ? "border-red-500/60 bg-red-500/10 text-red-400" : "border-border text-muted-foreground hover:border-accent/40"
            }`}
          >
            {removeMode ? "Done" : "Remove"}
          </button>
          <AddControlDialog onCreate={create} />
          <Link to="/deck" className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-accent transition-colors">
            Full deck →
          </Link>
        </div>
      </div>
      {!controls ? (
        <p className="text-muted-foreground text-center py-8 font-mono text-sm">Powering up consoles…</p>
      ) : controls.length === 0 ? (
        <p className="text-muted-foreground text-center py-8 font-mono text-sm">No controls on the bridge yet — snap one on.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {controls.map((c) => (
            <div key={c.id} className="relative">
              {removeMode && (
                <button
                  onClick={() => remove(c)}
                  className="absolute -top-2 -right-2 z-10 rounded-full bg-red-600 p-1.5 text-white hover:bg-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              {c.kind === "slider" && <NeonSlider control={c} onChange={(v) => setValue(c, v)} />}
              {c.kind === "toggle" && <NeonToggle control={c} onChange={(v) => setValue(c, v)} />}
              {c.kind === "button" && <NeonButton control={c} onChange={(v) => setValue(c, v)} />}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}