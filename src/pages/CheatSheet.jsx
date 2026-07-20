import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { CHEAT_SECTIONS } from "@/components/forge/cheatSheet";
import { NEON } from "@/components/deck/deckColors";

export default function CheatSheet() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-amber-400 text-sm font-mono mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to the board
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-6 w-6 text-amber-500" />
            <h1 className="font-heading text-3xl tracking-tight">
              Cheat Sheet <span className="text-zinc-500 font-light">· how to use THE FORGE</span>
            </h1>
          </div>
          <p className="text-zinc-500 text-sm">One page, everything an operator needs. Hand this to your client.</p>
        </header>

        <div className="space-y-8">
          {CHEAT_SECTIONS.map((sec) => {
            const c = NEON[sec.color] || NEON.cyan;
            return (
              <section key={sec.title} className={`rounded-xl border ${c.border} bg-zinc-900/50 p-5`}>
                <h2 className={`font-heading text-lg mb-4 ${c.text}`}>{sec.title}</h2>
                <dl className="space-y-3">
                  {sec.items.map(([term, def]) => (
                    <div key={term} className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-4">
                      <dt className="font-mono text-sm text-zinc-200">{term}</dt>
                      <dd className="text-sm text-zinc-400 leading-relaxed">{def}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}