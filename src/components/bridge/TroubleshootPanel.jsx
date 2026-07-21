import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { bridgeFetch, getBridgeConfig } from "@/lib/forgeBridge";
import TaskRow from "@/components/bridge/TaskRow";
import { Wrench, Loader2 } from "lucide-react";

export default function TroubleshootPanel() {
  const [tasks, setTasks] = useState(null);
  const [diagnosing, setDiagnosing] = useState(false);

  const load = async () => setTasks(await base44.entities.ForgeTask.list("-created_date", 100));
  useEffect(() => { load(); }, []);

  const diagnose = async () => {
    setDiagnosing(true);
    let health = null, sections = null, bridgeError = null;
    try {
      [health, sections] = await Promise.all([bridgeFetch("/health"), bridgeFetch("/sections")]);
    } catch (e) {
      bridgeError = e.message;
    }
    const { url } = getBridgeConfig();
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a troubleshooting assistant for "The Forge" — a local AI kernel on a Pop!_OS PC, reached through a Cloudflare Tunnel bridge at a private URL. The web app is a read-only window into it.

Current probe results:
- Bridge URL configured: ${url ? "yes" : "no"}
- Bridge reachable: ${bridgeError ? `NO — error: ${bridgeError}` : "yes"}
- /health: ${JSON.stringify(health)}
- /sections: ${JSON.stringify(sections)}

Generate a short, concrete checklist of troubleshooting/next-step tasks for the operator (Eugene). If the bridge is unreachable, focus on: is the PC on, is the bridge process running on 127.0.0.1:8787, is cloudflared tunnel up (docs/TRANSPORT.md), are the CF Access service token headers correct in the app settings. If healthy, suggest verification tasks instead (check feed heartbeat, run the test suite, mint a read-only capability, check the ledger verifies). 3-6 tasks max, each with a one-line title and a short actionable detail.`,
      response_json_schema: {
        type: "object",
        properties: {
          tasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                detail: { type: "string" },
                source: { type: "string" }
              }
            }
          }
        }
      }
    });
    const newTasks = (res.tasks || []).map((t) => ({ ...t, status: "open" }));
    if (newTasks.length) await base44.entities.ForgeTask.bulkCreate(newTasks);
    await load();
    setDiagnosing(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400">
          <Wrench className="h-3.5 w-3.5 text-amber-400" /> Troubleshoot · tasks are saved for next time
        </div>
        <button
          onClick={diagnose}
          disabled={diagnosing}
          className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-amber-400 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
        >
          {diagnosing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {diagnosing ? "Probing bridge…" : "Diagnose now"}
        </button>
      </div>
      {tasks === null ? (
        <p className="text-zinc-600 text-center py-16 font-mono text-sm">Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <p className="text-zinc-600 text-center py-16 font-mono text-sm">No tasks yet — hit “Diagnose now” to probe the bridge and generate a checklist.</p>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {tasks.map((t) => <TaskRow key={t.id} task={t} onChanged={load} />)}
        </div>
      )}
    </div>
  );
}