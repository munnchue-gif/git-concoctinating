import React from "react";
import { base44 } from "@/api/base44Client";
import { Trash2 } from "lucide-react";

export default function TaskRow({ task, onChanged }) {
  const toggle = async () => {
    await base44.entities.ForgeTask.update(task.id, { status: task.status === "done" ? "open" : "done" });
    onChanged();
  };
  const remove = async () => {
    await base44.entities.ForgeTask.delete(task.id);
    onChanged();
  };

  return (
    <div className={`flex items-start gap-3 rounded-lg border p-3 ${task.status === "done" ? "border-zinc-800/60 bg-zinc-900/30 opacity-60" : "border-zinc-800 bg-zinc-900/60"}`}>
      <input type="checkbox" checked={task.status === "done"} onChange={toggle} className="mt-1 accent-amber-400" />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-mono text-zinc-200 ${task.status === "done" ? "line-through" : ""}`}>{task.title}</p>
        {task.detail && <p className="text-xs font-mono text-zinc-500 mt-0.5">{task.detail}</p>}
        {task.source && <p className="text-[10px] font-mono text-zinc-600 mt-1 uppercase tracking-wider">{task.source}</p>}
      </div>
      <button onClick={remove} className="text-zinc-600 hover:text-red-400 transition-colors" aria-label="Delete task">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}