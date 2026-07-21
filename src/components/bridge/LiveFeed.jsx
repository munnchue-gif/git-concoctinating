import React, { useEffect, useRef, useState } from "react";
import { feedUrl } from "@/lib/forgeBridge";
import { Radio } from "lucide-react";

export default function LiveFeed() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("connecting");
  const esRef = useRef(null);

  useEffect(() => {
    const url = feedUrl();
    if (!url) {
      setStatus("unconfigured");
      return;
    }
    const es = new EventSource(url);
    esRef.current = es;
    es.onopen = () => setStatus("live");
    es.onerror = () => setStatus("disconnected");
    es.onmessage = (e) => {
      let data;
      try { data = JSON.parse(e.data); } catch { data = { raw: e.data }; }
      setEvents((prev) => [{ ts: Date.now(), data }, ...prev].slice(0, 200));
    };
    return () => es.close();
  }, []);

  const dot = { live: "bg-emerald-400", connecting: "bg-yellow-400", disconnected: "bg-red-500", unconfigured: "bg-zinc-600" }[status];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-widest text-zinc-400">
        <span className={`h-2 w-2 rounded-full ${dot} ${status === "live" ? "animate-pulse" : ""}`} />
        <Radio className="h-3.5 w-3.5" /> Overseer tap · {status}
      </div>
      {events.length === 0 ? (
        <p className="text-zinc-600 text-center py-16 font-mono text-sm">
          {status === "unconfigured" ? "Set your bridge URL in settings to open the feed." : "Waiting for findings + heartbeat ticks…"}
        </p>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {events.map((e, i) => (
            <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
              <p className="text-[10px] font-mono text-zinc-600 mb-1">{new Date(e.ts).toLocaleTimeString()}</p>
              <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap break-all">{JSON.stringify(e.data, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}