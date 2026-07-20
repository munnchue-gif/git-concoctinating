import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, Lightbulb } from "lucide-react";
import GradeBadge from "@/components/forge/GradeBadge";
import { GRADES } from "@/components/forge/gradeConfig";

export default function PieceCard({ piece, index }) {
  const g = GRADES[piece.grade] || GRADES.YELLOW;
  const TypeIcon = piece.piece_type === "Code" ? Code2 : Lightbulb;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
    >
      <Link
        to={`/piece/${piece.id}`}
        className={`group block h-full rounded-xl border ${g.border} bg-zinc-900/60 p-5 transition-all duration-300 hover:bg-zinc-900 hover:-translate-y-1 hover:${g.glow}`}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-zinc-500">
            <span className="font-mono text-xs">{String(piece.order || 0).padStart(2, "0")}</span>
            <TypeIcon className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase tracking-widest">{piece.piece_type}</span>
          </div>
          <GradeBadge grade={piece.grade} small />
        </div>
        <h3 className="font-heading text-lg text-zinc-100 mb-1.5 group-hover:text-amber-300 transition-colors">
          {piece.name}
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{piece.what_it_is}</p>
        {piece.next_brick && (
          <p className="mt-3 text-xs font-mono text-amber-500/80 line-clamp-1">→ {piece.next_brick}</p>
        )}
      </Link>
    </motion.div>
  );
}