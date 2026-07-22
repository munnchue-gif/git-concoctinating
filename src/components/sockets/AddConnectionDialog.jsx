import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { SOCKET_KINDS } from "@/components/sockets/socketKinds";

const fieldCls = "bg-zinc-900 border-zinc-800 text-zinc-100";
const EMPTY = { name: "", kind: "wsl", url: "", notes: "", token: "", cfId: "", cfSecret: "" };

export default function AddConnectionDialog({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim() || !form.url.trim()) return;
    await onCreate(form);
    setOpen(false);
    setForm(EMPTY);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/80 text-accent-foreground font-semibold gap-2">
          <Plus className="h-4 w-4" /> New socket
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader><DialogTitle className="font-heading">Register a socket</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-zinc-500 uppercase">Name</label>
              <Input className={fieldCls} placeholder="e.g. GPU Offloader" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-mono text-zinc-500 uppercase">Kind</label>
              <Select value={form.kind} onValueChange={(v) => set("kind", v)}>
                <SelectTrigger className={fieldCls}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(SOCKET_KINDS).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs font-mono text-zinc-500 uppercase">Endpoint URL</label>
            <Input className={fieldCls} placeholder="https://…" value={form.url} onChange={(e) => set("url", e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input className={fieldCls} type="password" placeholder="Token (optional)" value={form.token} onChange={(e) => set("token", e.target.value)} />
            <Input className={fieldCls} placeholder="CF Client ID" value={form.cfId} onChange={(e) => set("cfId", e.target.value)} />
            <Input className={fieldCls} type="password" placeholder="CF Secret" value={form.cfSecret} onChange={(e) => set("cfSecret", e.target.value)} />
          </div>
          <p className="text-[10px] font-mono text-zinc-600">Keys stay in this browser's vault only — never stored in the database.</p>
          <div>
            <label className="text-xs font-mono text-zinc-500 uppercase">Notes</label>
            <Textarea className={fieldCls} rows={2} placeholder="What lives on the other end?" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
          <Button onClick={submit} className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-semibold">Register socket</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}