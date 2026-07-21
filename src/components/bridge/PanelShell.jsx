import React from "react";
import { AlertTriangle } from "lucide-react";

export default function PanelShell({ loading, error, empty, emptyText, children }) {
  if (loading)
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-zinc-800 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  if (error)
    return (
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-300">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <div>
          <p className="font-mono text-xs uppercase tracking-wider mb-1">Forge unreachable</p>
          <p className="text-zinc-400 text-xs font-mono break-all">{String(error.message || error)}</p>
        </div>
      </div>
    );
  if (empty)
    return <p className="text-zinc-600 text-center py-16 font-mono text-sm">{emptyText || "Nothing here yet."}</p>;
  return children;
}