import React, { useState } from "react";
import { bridgeFetch } from "@/lib/forgeBridge";
import { KeyRound, ShieldCheck, ShieldX } from "lucide-react";

const OPS = ["npu.eval", "hopper.spawn", "coupler.mount", "net.egress", "fabric.conform", "fabric.splice", "fabric.reclaim"];
const PRESET_CAVEATS = ["read_only", "expires_in:60"];

export default function MintPanel() {
  const [op, setOp] = useState(OPS[0]);
  const [target, setTarget] = useState("");
  const [caveats, setCaveats] = useState(["read_only", "expires_in:60"]);
  const [customCaveat, setCustomCaveat] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const toggleCaveat = (c) =>
    setCaveats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const mint = async () => {
    setBusy(true);
    setResult(null);
    const all = [...caveats, ...(customCaveat.trim() ? [customCaveat.trim()] : [])];
    try {
      const res = await bridgeFetch("/mint", { method: "POST", body: JSON.stringify({ op, target, caveats: all }) });
      setResult(res);
    } catch (error) {
      setResult({ error: error.message });
    }
    setBusy(false);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <p className="text-xs font-mono text-zinc-500">
        Requests a narrowed, gate-signed capability. The Forge decides — the App just renders the verdict.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          value={op}
          onChange={(e) => setOp(e.target.value)}
          className="rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm font-mono text-zinc-200 focus:border-amber-500/60 outline-none"
        >
          {OPS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="target — section or wrap id"
          className="rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500/60 outline-none"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {PRESET_CAVEATS.map((c) => (
          <button
            key={c}
            onClick={() => toggleCaveat(c)}
            className={`rounded-full px-3 py-1 text-xs font-mono border transition-colors ${
              caveats.includes(c)
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
            }`}
          >
            {c}
          </button>
        ))}
        <input
          value={customCaveat}
          onChange={(e) => setCustomCaveat(e.target.value)}
          placeholder="custom caveat e.g. only_section:<id>"
          className="rounded-full bg-zinc-950 border border-zinc-800 px-3 py-1 text-xs font-mono text-zinc-300 placeholder:text-zinc-600 focus:border-emerald-500/60 outline-none w-64"
        />
      </div>
      <button
        onClick={mint}
        disabled={busy || !target.trim()}
        className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-5 py-2 text-sm font-mono uppercase tracking-wider text-amber-400 hover:bg-amber-500/20 transition-colors disabled:opacity-40"
      >
        <KeyRound className="h-4 w-4" /> {busy ? "Minting…" : "Request grant"}
      </button>
      {result && <MintResult result={result} />}
    </div>
  );
}

function MintResult({ result }) {
  if (result.error)
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs font-mono text-amber-300 break-all">
        {result.error}
      </div>
    );
  const allowed = result.allowed;
  return (
    <div className={`rounded-xl border p-4 ${allowed ? "border-emerald-500/40 bg-emerald-500/5" : "border-red-500/40 bg-red-500/5"}`}>
      <div className={`flex items-center gap-2 mb-2 text-sm font-mono uppercase tracking-wider ${allowed ? "text-emerald-400" : "text-red-400"}`}>
        {allowed ? <ShieldCheck className="h-4 w-4" /> : <ShieldX className="h-4 w-4" />}
        Gate decision: {allowed ? "ALLOWED" : "DENIED"}
      </div>
      {result.finding && (
        <pre className="text-xs font-mono text-zinc-400 whitespace-pre-wrap break-all">{JSON.stringify(result.finding, null, 2)}</pre>
      )}
    </div>
  );
}