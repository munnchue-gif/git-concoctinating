import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative group rounded-lg border border-zinc-800 bg-black/60 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800/80 bg-zinc-900/60">
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">{lang || "bash"}</span>
        <button onClick={copy} className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 hover:text-amber-400 transition-colors">
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-zinc-300 whitespace-pre">{code}</pre>
    </div>
  );
}