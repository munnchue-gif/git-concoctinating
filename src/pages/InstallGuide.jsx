import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Terminal } from "lucide-react";
import CodeBlock from "@/components/forge/CodeBlock";
import { INSTALL_STEPS } from "@/components/forge/installSteps";

export default function InstallGuide() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-amber-400 text-sm font-mono mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to the board
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="h-6 w-6 text-amber-500" />
            <h1 className="font-heading text-3xl tracking-tight">
              Install Guide <span className="text-zinc-500 font-light">· Pop!_OS bare metal</span>
            </h1>
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed">
            From green tests to a living resident process: environment, NPU wiring, kernel bootstrap,
            real-seat binding, and boot-on-startup. Copy each block in order. Bootstrap code snippets
            are templates — adapt import paths and signatures to your exact forge_ng code.
          </p>
        </header>

        <div className="space-y-10">
          {INSTALL_STEPS.map((step, i) => (
            <section key={i}>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-mono text-amber-500 text-sm">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="font-heading text-xl text-zinc-100">{step.title}</h2>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4 pl-8">{step.note}</p>
              <div className="space-y-3 pl-8">
                {step.blocks.map((b, j) => (
                  <CodeBlock key={j} code={b.code} lang={b.lang} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-14 border-t border-zinc-800 pt-6">
          <p className="text-xs font-mono text-zinc-600 leading-relaxed">
            Order matters: green tests (03) before boot (05), NPU visible (04) before real seat (06).
            If the NPU never shows up, the Forge still runs on HeuristicSeat — bonded, not fused.
          </p>
        </footer>
      </div>
    </div>
  );
}