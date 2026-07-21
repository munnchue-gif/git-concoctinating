import React, { useEffect, useState } from "react";
import { bridgeFetch } from "@/lib/forgeBridge";
import PanelShell from "./PanelShell";
import { Link2 } from "lucide-react";

export default function LedgerPanel() {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    bridgeFetch("/ledger?since=0")
      .then((data) => setState({ entries: Array.isArray(data) ? data : data.entries || [] }))
      .catch((error) => setState({ error }));
  }, []);

  const { entries, loading, error } = state;

  return (
    <PanelShell loading={loading} error={error} empty={entries && entries.length === 0} emptyText="Ledger is empty.">
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        {(entries || []).map((e, i) => (
          <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 flex items-start gap-3">
            <Link2 className="h-3.5 w-3.5 text-cyan-400 mt-1 shrink-0" />
            <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap break-all flex-1">
              {typeof e === "string" ? e : JSON.stringify(e, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}