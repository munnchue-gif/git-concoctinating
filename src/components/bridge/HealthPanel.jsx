import React, { useEffect, useState } from "react";
import { bridgeFetch } from "@/lib/forgeBridge";
import PanelShell from "./PanelShell";
import { HeartPulse } from "lucide-react";

export default function HealthPanel() {
  const [state, setState] = useState({ loading: true });

  const load = async () => {
    try {
      const [health, sections] = await Promise.all([bridgeFetch("/health"), bridgeFetch("/sections")]);
      setState({ health, sections });
    } catch (error) {
      setState({ error });
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  const { health, sections, loading, error } = state;
  const secList = Array.isArray(sections) ? sections : sections?.sections || [];

  return (
    <PanelShell loading={loading} error={error}>
      {health && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Stat label="Booted" value={health.booted ? "YES" : "NO"} good={health.booted} />
            <Stat label="Tests" value={health.tests_ok ? "GREEN" : "FAILING"} good={health.tests_ok} />
            <Stat label="Uptime" value={`${Math.floor((health.uptime_s || 0) / 60)}m`} good />
            <Stat label="Organs" value={(health.organs || []).length} good />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {secList.map((s, i) => (
              <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <HeartPulse className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-sm font-mono text-zinc-200">{s.id || s.name || String(s)}</span>
                </div>
                {s.status && <p className="text-xs font-mono text-zinc-500">{s.status}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </PanelShell>
  );
}

function Stat({ label, value, good }) {
  return (
    <div className={`rounded-lg border px-4 py-2 ${good ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"}`}>
      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">{label}</p>
      <p className={`text-lg font-mono ${good ? "text-emerald-400" : "text-red-400"}`}>{value}</p>
    </div>
  );
}