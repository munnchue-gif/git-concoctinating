import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Radio, Trash2 } from "lucide-react";
import NeonSlider from "@/components/deck/NeonSlider";
import NeonToggle from "@/components/deck/NeonToggle";
import NeonButton from "@/components/deck/NeonButton";
import AddControlDialog from "@/components/deck/AddControlDialog";

export default function ControlDeck() {
  const [controls, setControls] = useState(null);
  const [removeMode, setRemoveMode] = useState(false);

  const load = async () => setControls(await base44.entities.ForgeControl.list("created_date", 200));

  useEffect(() => {
    load();
    const unsubscribe = base44.entities.ForgeControl.subscribe((event) => {
      setControls((prev) => {
        if (!prev) return prev;
        if (event.type === "create") return prev.some((c) => c.id === event.data.id) ? prev : [...prev, event.data];
        if (event.type === "update") return prev.map((c) => (c.id === event.data.id ? event.data : c));
        if (event.type === "delete") return prev.filter((c) => c.id !== event.data.id);
        return prev;
      });
    });
    return unsubscribe;
  }, []);

  const setValue = async (control, value) => {
    setControls((prev) => prev.map((c) => (c.id === control.id ? { ...c, value } : c)));
    await base44.entities.ForgeControl.update(control.id, { value });
  };

  const create = async (data) => {
    await base44.entities.ForgeControl.create(data);
  };

  const remove = async (control) => {
    setControls((prev) => prev.filter((c) => c.id !== control.id));
    await base44.entities.ForgeControl.delete(control.id);
  };

  const sections = [...new Set((controls || []).map((c) => c.section || "Fabric"))];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-cyan-400 text-sm font-mono mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to the board
        </Link>

        <header className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Radio className="h-6 w-6 text-cyan-400 animate-pulse" />
              <h1 className="font-heading text-3xl tracking-tight">
                Control Deck <span className="text-zinc-500 font-light">· live</span>
              </h1>
            </div>
            <p className="text-zinc-500 text-sm font-mono">
              Codeless operator console — every move syncs in real time. Your Forge reads this deck through the bridge.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRemoveMode((v) => !v)}
              className={`rounded-full border px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                removeMode ? "border-red-500/60 bg-red-500/10 text-red-400" : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
              }`}
            >
              {removeMode ? "Done removing" : "Remove"}
            </button>
            <AddControlDialog onCreate={create} />
          </div>
        </header>

        {!controls ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-zinc-800 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        ) : controls.length === 0 ? (
          <p className="text-zinc-600 text-center py-24 font-mono text-sm">Empty deck — snap on your first control.</p>
        ) : (
          <div className="space-y-10">
            {sections.map((sec) => (
              <div key={sec}>
                <h2 className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800/80 pb-2">
                  {sec}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {controls
                    .filter((c) => (c.section || "Fabric") === sec)
                    .map((c) => (
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}