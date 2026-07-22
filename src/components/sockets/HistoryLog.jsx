import React from "react";
import { History } from "lucide-react";
import { kindOf } from "@/components/sockets/socketKinds";

export default function HistoryLog({ events }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-widest text-zinc-500">
        <History className="h-3.5 w-3.5" /> Connection memory
      </div>
      {!events?.length ? (
        <p className="text-zinc-600 font-mono text-xs py-4">No bridge history yet — every connect attempt lands here.</p>
      ) : (
        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {events.map((e) => {
            const k = kindOf(e.kind);
            const Icon = k.icon;
            return (
              <div key={e.id} className="flex items-center gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-2">
                <Icon className={`h-3.5 w-3.5 shrink-0 ${k.text}`} />
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${e.status === "ok" ? "bg-emerald-400" : "bg-red-500"}`} />
                <span className="text-xs text-zinc-300 truncate">{e.connection_name}</span>
                <span className="text-[10px] font-mono text-zinc-600 truncate flex-1">{e.detail}</span>
                <span className="text-[10px] font-mono text-zinc-600 shrink-0">{new Date(e.created_date).toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}