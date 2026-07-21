import React, { useState } from "react";
import { bridgeFetch } from "@/lib/forgeBridge";
import { Copy, Check, Zap, Loader2 } from "lucide-react";

const STEPS = [
  {
    title: "Start the Forge bridge on your PC",
    detail: "On the Pop!_OS machine, boot the kernel + bridge so it listens locally (see docs/TRANSPORT.md in the repo).",
    cmd: "python -m forge_ng.bridge",
  },
  {
    title: "Open the Cloudflare tunnel",
    detail: "This gives your local bridge a public HTTPS address protected by Cloudflare Access.",
    cmd: "cloudflared tunnel run forge",
  },
  {
    title: "Fill in the connection form above",
    detail: "Paste the tunnel URL plus your CF Access Client ID and Secret, then hit Save & connect.",
  },
];

export default function ConnectionGuide() {
  const [copied, setCopied] = useState(null);
  const [test, setTest] = useState({ state: "idle" });

  const copy = (cmd, i) => {
    navigator.clipboard.writeText(cmd);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  };

  const runTest = async () => {
    setTest({ state: "running" });
    try {
      const health = await bridgeFetch("/health");
      setTest({ state: "ok", msg: `Bridge is up · booted: ${health.booted ? "yes" : "no"} · contract ${health.contract_version || "?"}` });
    } catch (e) {
      setTest({ state: "fail", msg: e.message });
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-4">
      <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">Getting connected · 3 steps</p>
      <ol className="space-y-3">
        {STEPS.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-500/40 text-cyan-400 text-xs font-mono">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-zinc-200">{s.title}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{s.detail}</p>
              {s.cmd && (
                <button
                  onClick={() => copy(s.cmd, i)}
                  className="mt-1.5 inline-flex items-center gap-2 rounded-md bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs font-mono text-emerald-400 hover:border-zinc-600 transition-colors"
                >
                  {s.cmd}
                  {copied === i ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3 text-zinc-600" />}
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>
      <div className="flex items-center gap-3 pt-1 border-t border-zinc-800/60">
        <button
          onClick={runTest}
          disabled={test.state === "running"}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
        >
          {test.state === "running" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
          Test connection
        </button>
        {test.msg && (
          <p className={`mt-3 text-xs font-mono ${test.state === "ok" ? "text-emerald-400" : "text-red-400"}`}>{test.msg}</p>
        )}
      </div>
    </div>
  );
}