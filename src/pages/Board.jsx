import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Flame, Terminal, Radio, BookOpen, ScanSearch } from "lucide-react";
import { Link } from "react-router-dom";
import PieceCard from "@/components/forge/PieceCard";
import { GRADES, GRADE_ORDER } from "@/components/forge/gradeConfig";

export default function Board() {
  const [filter, setFilter] = useState("ALL");
  const { data: pieces, isLoading } = useQuery({
    queryKey: ["forgePieces"],
    queryFn: () => base44.entities.ForgePiece.list("order", 100),
  });

  const list = (pieces || []).filter((p) => filter === "ALL" || p.grade === filter);
  const counts = (pieces || []).reduce((acc, p) => ({ ...acc, [p.grade]: (acc[p.grade] || 0) + 1 }), {});

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-10">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
              <Flame className="h-7 w-7 text-amber-500" />
              <h1 className="font-heading text-3xl md:text-4xl tracking-tight">
                THE FORGE <span className="text-amber-500">·</span>{" "}
                <span className="text-zinc-400 font-light">Command Board</span>
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                to="/deck"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-cyan-400 hover:bg-cyan-500/20 transition-colors"
              >
                <Radio className="h-3.5 w-3.5" /> Control Deck
              </Link>
              <Link
                to="/review"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              >
                <ScanSearch className="h-3.5 w-3.5" /> Review Bay
              </Link>
              <Link
                to="/cheatsheet"
                className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/40 bg-fuchsia-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-fuchsia-400 hover:bg-fuchsia-500/20 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" /> Cheat Sheet
              </Link>
              <Link
                to="/install"
                className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-amber-400 hover:bg-amber-500/20 transition-colors"
              >
                <Terminal className="h-3.5 w-3.5" /> Install Guide
              </Link>
            </div>
          </div>
          <p className="text-zinc-500 text-sm font-mono">
            {pieces?.length || 0} pieces on the board · every organ graded, nothing thrown away
          </p>
        </header>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilter("ALL")}
            className={`rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors ${
              filter === "ALL"
                ? "border-amber-500/60 bg-amber-500/10 text-amber-400"
                : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
            }`}
          >
            All
          </button>
          {GRADE_ORDER.map((gr) => {
            const g = GRADES[gr];
            return (
              <button
                key={gr}
                onClick={() => setFilter(filter === gr ? "ALL" : gr)}
                className={`rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors ${
                  filter === gr ? `${g.border} ${g.bg} ${g.text}` : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
                }`}
              >
                {gr} {counts[gr] ? `· ${counts[gr]}` : ""}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-zinc-800 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : list.length === 0 ? (
          <p className="text-zinc-600 text-center py-24 font-mono text-sm">No pieces match this grade.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((p, i) => (
              <PieceCard key={p.id} piece={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}