import React, { useState } from "react";
import { getBridgeConfig, saveBridgeConfig } from "@/lib/forgeBridge";
import { Plug } from "lucide-react";

export default function BridgeSettings({ onSaved }) {
  const [cfg, setCfg] = useState(getBridgeConfig());

  const save = () => {
    saveBridgeConfig(cfg);
    onSaved?.();
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400">
        <Plug className="h-3.5 w-3.5 text-cyan-400" /> Bridge connection · stored only in this browser
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          value={cfg.url}
          onChange={(e) => setCfg({ ...cfg, url: e.target.value })}
          placeholder="Forge bridge URL (e.g. https://forge.yourtunnel.com)"
          className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500/60 outline-none"
        />
        <input
          value={cfg.token}
          onChange={(e) => setCfg({ ...cfg, token: e.target.value })}
          type="password"
          placeholder="Access token (optional)"
          className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500/60 outline-none"
        />
        <input
          value={cfg.cfId || ""}
          onChange={(e) => setCfg({ ...cfg, cfId: e.target.value })}
          placeholder="CF Access Client ID (service token)"
          className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500/60 outline-none"
        />
        <input
          value={cfg.cfSecret || ""}
          onChange={(e) => setCfg({ ...cfg, cfSecret: e.target.value })}
          type="password"
          placeholder="CF Access Client Secret"
          className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500/60 outline-none"
        />
      </div>
      <button
        onClick={save}
        className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-cyan-400 hover:bg-cyan-500/20 transition-colors"
      >
        Save & connect
      </button>
    </div>
  );
}