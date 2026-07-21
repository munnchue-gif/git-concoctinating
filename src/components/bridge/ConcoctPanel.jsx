import React, { useState } from "react";
import { bridgeFetch } from "@/lib/forgeBridge";
import { FlaskConical, Gavel } from "lucide-react";

const EXAMPLE = `{
  "id": "draft-001",
  "kind": "shape",
  "spec": {}
}`;

export default function ConcoctPanel() {
  const [shapeText, setShapeText] = useState(EXAMPLE);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const preview = async () => {
    let shape;
    try {
      shape = JSON.parse(shapeText);
    } catch {
      setResult({ error: "Draft isn't valid JSON — fix it before sending." });
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const res = await bridgeFetch("/concoct/preview", { method: "POST", body: JSON.stringify({ shape }) });
      setResult(res);
    } catch (error) {
      setResult({ error: error.message });
    }
    setBusy(false);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <p className="text-xs font-mono text-zinc-500">
        Drop a drafted shape into the Concoctinator arena — observe-mode only. It gets fitted and judged, never promoted.
      </p>
      <textarea
        value={shapeText}
        onChange={(e) => setShapeText(e.target.value)}
        rows={8}
        spellCheck={false}
        className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm font-mono text-zinc-200 focus:border-violet-500/60 outline-none"
      />
      <button
        onClick={preview}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-5 py-2 text-sm font-mono uppercase tracking-wider text-violet-400 hover:bg-violet-500/20 transition-colors disabled:opacity-40"
      >
        <FlaskConical className="h-4 w-4" /> {busy ? "Judging…" : "Preview draft"}
      </button>
      {result && (
        result.error ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs font-mono text-amber-300 break-all">
            {result.error}
          </div>
        ) : (
          <div className="rounded-xl border border-violet-500/40 bg-violet-500/5 p-4">
            <div className="flex items-center gap-2 mb-2 text-sm font-mono uppercase tracking-wider text-violet-400">
              <Gavel className="h-4 w-4" /> Judgment · promoted: {String(result.promoted)}
            </div>
            <pre className="text-xs font-mono text-zinc-400 whitespace-pre-wrap break-all">{JSON.stringify(result.judgment, null, 2)}</pre>
          </div>
        )
      )}
    </div>
  );
}