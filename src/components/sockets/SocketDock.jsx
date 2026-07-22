import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { saveConnSecrets } from "@/lib/connectionVault";
import AddConnectionDialog from "@/components/sockets/AddConnectionDialog";
import ConnectionCard from "@/components/sockets/ConnectionCard";
import HistoryLog from "@/components/sockets/HistoryLog";

export default function SocketDock() {
  const [connections, setConnections] = useState(null);
  const [events, setEvents] = useState([]);

  const load = async () => {
    const [conns, evts] = await Promise.all([
      base44.entities.BridgeConnection.list("-updated_date", 100),
      base44.entities.ConnectionEvent.list("-created_date", 40),
    ]);
    setConnections(conns.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)));
    setEvents(evts);
  };

  useEffect(() => { load(); }, []);

  const create = async ({ token, cfId, cfSecret, ...meta }) => {
    const record = await base44.entities.BridgeConnection.create(meta);
    if (token || cfId || cfSecret) saveConnSecrets(record.id, { token, cfId, cfSecret });
    load();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-mono text-zinc-500 max-w-xl">
          Socket keychain — register any endpoint (WSL, GitHub bridge, Cloudflare tunnel, GPU offloader…) once,
          then bridge back in with one press. Endpoints live in your database; keys stay in this browser's vault.
        </p>
        <AddConnectionDialog onCreate={create} />
      </div>

      {!connections ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-zinc-800 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      ) : connections.length === 0 ? (
        <p className="text-zinc-600 text-center py-16 font-mono text-sm">Empty dock — register your first socket.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map((c) => (
            <ConnectionCard key={c.id} conn={c} onChanged={load} />
          ))}
        </div>
      )}

      <HistoryLog events={events} />
    </div>
  );
}