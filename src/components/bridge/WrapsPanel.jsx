import React, { useEffect, useState } from "react";
import { bridgeFetch } from "@/lib/forgeBridge";
import PanelShell from "./PanelShell";
import { Package, Lock, Recycle } from "lucide-react";

export default function WrapsPanel() {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    bridgeFetch("/wraps")
      .then((data) => setState({ wraps: Array.isArray(data) ? data : data.wraps || [] }))
      .catch((error) => setState({ error }));
  }, []);

  const { wraps, loading, error } = state;

  return (
    <PanelShell loading={loading} error={error} empty={wraps && wraps.length === 0} emptyText="WrapStore is empty.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(wraps || []).map((w) => (
          <div key={w.id} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-mono text-zinc-200">{w.id}</span>
            </div>
            <p className="text-xs font-mono text-zinc-500 break-all mb-2">{w.fingerprint}</p>
            <div className="flex gap-2">
              {w.sealed && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                  <Lock className="h-3 w-3" /> SEALED
                </span>
              )}
              {w.reclaimed && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-400">
                  <Recycle className="h-3 w-3" /> RECLAIMED
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}