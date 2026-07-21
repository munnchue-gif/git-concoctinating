import React, { useState } from "react";
import { ChevronDown, FileCode2, Trash2, AlertTriangle, Wrench, ListChecks } from "lucide-react";
import GradeBadge from "@/components/forge/GradeBadge";
import { GRADES } from "@/components/forge/gradeConfig";

const DIMS = [
  ["code_grade", "Code"],
  ["structure_grade", "Structure"],
  ["security_grade", "Security"],
  ["install_grade", "Install"],
];

const ListBlock = ({ icon: Icon, label, items, tone }) =>
  !items?.length ? null : (
    <div>
      <h4 className={`flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest mb-2 ${tone}`}>
        <Icon className="h-3.5 w-3.5" /> {label}
      </h4>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-zinc-300 leading-relaxed pl-4 relative">
            <span className="absolute left-0 text-zinc-600">·</span>{it}
          </li>
        ))}
      </ul>
    </div>
  );

export default function ReviewCard({ review, onDelete }) {
  const [open, setOpen] = useState(false);
  const g = GRADES[review.overall_grade] || GRADES.YELLOW;

  return (
    <div className={`rounded-xl border ${g.border} bg-zinc-900/60 overflow-hidden`}>
      <button onClick={() => setOpen((v) => !v)} className="w-full p-4 text-left">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <FileCode2 className={`h-5 w-5 shrink-0 ${g.text}`} />
            <span className="font-mono text-sm text-zinc-100 truncate">{review.file_name}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <GradeBadge grade={review.overall_grade} />
            <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} />
          </div>
        </div>
        <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{review.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DIMS.map(([key, label]) => {
            const dg = GRADES[review[key]];
            return dg ? (
              <span key={key} className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${dg.border} ${dg.bg} ${dg.text}`}>
                {label}: {review[key]}
              </span>
            ) : null;
          })}
        </div>
      </button>

      {open && (
        <div className="border-t border-zinc-800/80 p-4 space-y-5">
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">The Review</h4>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{review.review}</p>
          </div>
          <ListBlock icon={AlertTriangle} label="Preinstall issues — fix before it touches the fabric" items={review.preinstall_issues} tone="text-red-400" />
          <ListBlock icon={Wrench} label="How to use / integrate" items={review.how_tos} tone="text-cyan-400" />
          <ListBlock icon={ListChecks} label="Next bricks" items={review.next_bricks} tone="text-amber-400" />
          <button
            onClick={() => onDelete(review)}
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-600 hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove review
          </button>
        </div>
      )}
    </div>
  );
}