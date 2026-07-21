import React, { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

export default function DropZone({ onFiles, busy }) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);

  const handle = (files) => {
    if (!busy && files?.length) onFiles([...files]);
  };

  return (
    <div
      onClick={() => !busy && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files); }}
      className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
        over
          ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_-8px_rgba(34,211,238,0.5)]"
          : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-500"
      } ${busy ? "opacity-60 cursor-wait" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => { handle(e.target.files); e.target.value = ""; }}
      />
      <UploadCloud className={`mx-auto h-10 w-10 mb-3 ${over ? "text-cyan-400" : "text-zinc-500"}`} />
      <p className="font-mono text-sm text-zinc-300">
        {busy ? "Reviewing… hold the door" : "Drop files here — or click to pick"}
      </p>
      <p className="text-xs text-zinc-600 mt-1 font-mono">
        code · configs · docs — each file gets a full once-over before it touches the fabric
      </p>
    </div>
  );
}