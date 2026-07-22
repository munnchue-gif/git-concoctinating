import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { getBridgeConfig, saveBridgeConfig, bridgeFetch } from "@/lib/forgeBridge";
import { getConnSecrets, hasConnSecrets, deleteConnSecrets } from "@/lib/connectionVault";
import { kindOf } from "@/components/sockets/socketKinds";
import { Plug, Pin, Trash2, Loader2, KeyRound } from "lucide-react";

const DOT = { ok: "bg-emerald-400", fail: "bg-red-500", unknown: "bg-zinc-600" };

export default function ConnectionCard({ conn, onChanged, onBridged }) {
  const [busy, setBusy] = useState(false);
  const k = kindOf(conn.kind);
  const Icon = k.icon;

  const bridge = async () => {
    setBusy(true);
    const prev = getBridgeConfig();
    const secrets = getConnSecrets(conn.id);
    // Sockets without their own vaulted keys reuse the current live credentials
    saveBridgeConfig({
      url: conn.url,
      token: secrets.token || prev.token,
      cfId: secrets.cfId || prev.cfId,
      cfSecret: secrets.cfSecret || prev.cfSecret,
    });
    let status = "ok", detail = "Bridged and health check passed";
    try {
      const health = await bridgeFetch("/health");
      detail = `Bridged · booted: ${health.booted ? "yes" : "no"}`;
    } catch (e) {
      status = "fail";
      detail = e.message;
      saveBridgeConfig(prev); // don't clobber a working connection with a dead one
    }
    await Promise.all([
      base44.entities.BridgeConnection.update(conn.id, {
        last_status: status,
        last_connected: new Date().toISOString(),
        times_connected: (conn.times_connected || 0) + (status === "ok" ? 1 : 0),
      }),
      base44.entities.ConnectionEvent.create({ connection_id: conn.id, connection_name: conn.name, kind: conn.kind, status, detail }),
    ]);
    setBusy(false);
    onChanged();
    if (status === "ok") onBridged?.();
  };

  const togglePin = async () => {
    await base44.entities.BridgeConnection.update(conn.id, { pinned: !conn.pinned });
    onChanged();
  };

  const remove = async () => {
    deleteConnSecrets(conn.id);
    await base44.entities.BridgeConnection.delete(conn.id);
    onChanged();
  };

  return (
    <div className={`rounded-xl border ${k.border} bg-zinc-900/60 p-4`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className={`h-4 w-4 shrink-0 ${k.text}`} />
          <span className="text-sm text-zinc-100 truncate">{conn.name}</span>
          {hasConnSecrets(conn.id) && <KeyRound className="h-3 w-3 shrink-0 text-amber-400" title="Keys in this browser's vault" />}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`h-2 w-2 rounded-full ${DOT[conn.last_status] || DOT.unknown}`} />
          <button onClick={togglePin} className={conn.pinned ? "text-amber-400" : "text-zinc-600 hover:text-zinc-400"}>
            <Pin className="h-3.5 w-3.5" />
          </button>
          <button onClick={remove} className="text-zinc-600 hover:text-red-400">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <p className="text-[11px] font-mono text-zinc-500 truncate mb-1">{conn.url}</p>
      {conn.notes && <p className="text-xs text-zinc-500 mb-2 line-clamp-2">{conn.notes}</p>}
      <div className="flex items-center justify-between gap-2 mt-2">
        <span className="text-[10px] font-mono text-zinc-600">
          {conn.times_connected ? `${conn.times_connected}× bridged` : "never bridged"}
          {conn.last_connected ? ` · last ${new Date(conn.last_connected).toLocaleString()}` : ""}
        </span>
        <button
          onClick={bridge}
          disabled={busy}
          className={`inline-flex items-center gap-1.5 rounded-full border ${k.border} ${k.bg} px-3 py-1 text-[11px] font-mono uppercase tracking-wider ${k.text} hover:opacity-80 transition-opacity disabled:opacity-40`}
        >
          {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plug className="h-3 w-3" />} Bridge in
        </button>
      </div>
    </div>
  );
}