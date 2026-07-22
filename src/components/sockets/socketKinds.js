import { Terminal, Flame, Github, Cloud, Cpu, Database, Plug } from "lucide-react";

export const SOCKET_KINDS = {
  wsl: { label: "WSL / OS", icon: Terminal, text: "text-emerald-400", border: "border-emerald-500/40", bg: "bg-emerald-500/10" },
  forge: { label: "Forge", icon: Flame, text: "text-amber-400", border: "border-amber-500/40", bg: "bg-amber-500/10" },
  github: { label: "GitHub", icon: Github, text: "text-violet-400", border: "border-violet-500/40", bg: "bg-violet-500/10" },
  cloudflare: { label: "Cloudflare", icon: Cloud, text: "text-orange-400", border: "border-orange-500/40", bg: "bg-orange-500/10" },
  gpu: { label: "GPU Offloader", icon: Cpu, text: "text-cyan-400", border: "border-cyan-500/40", bg: "bg-cyan-500/10" },
  database: { label: "Database", icon: Database, text: "text-sky-400", border: "border-sky-500/40", bg: "bg-sky-500/10" },
  custom: { label: "Custom", icon: Plug, text: "text-zinc-300", border: "border-zinc-600/60", bg: "bg-zinc-700/20" },
};

export const kindOf = (kind) => SOCKET_KINDS[kind] || SOCKET_KINDS.custom;