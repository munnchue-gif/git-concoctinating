import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { NEON } from "@/components/deck/deckColors";

const fieldCls = "bg-zinc-900 border-zinc-800 text-zinc-100";

export default function AddControlDialog({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", kind: "toggle", section: "Fabric", color: "cyan", min: 0, max: 100, step: 1 });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim()) return;
    await onCreate({ ...form, min: Number(form.min), max: Number(form.max), step: Number(form.step), value: 0 });
    setOpen(false);
    setForm({ name: "", kind: "toggle", section: "Fabric", color: "cyan", min: 0, max: 100, step: 1 });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-semibold gap-2">
          <Plus className="h-4 w-4" /> New control
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader><DialogTitle className="font-heading">Snap on a new control</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-mono text-zinc-500 uppercase">Name</label>
            <Input className={fieldCls} placeholder="e.g. Tap Sensitivity" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-mono text-zinc-500 uppercase">Type</label>
              <Select value={form.kind} onValueChange={(v) => set("kind", v)}>
                <SelectTrigger className={fieldCls}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="slider">Slider</SelectItem>
                  <SelectItem value="toggle">Toggle</SelectItem>
                  <SelectItem value="button">Button</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-mono text-zinc-500 uppercase">Section</label>
              <Input className={fieldCls} value={form.section} onChange={(e) => set("section", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-mono text-zinc-500 uppercase">Neon</label>
              <Select value={form.color} onValueChange={(v) => set("color", v)}>
                <SelectTrigger className={fieldCls}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.keys(NEON).map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          {form.kind === "slider" && (
            <div className="grid grid-cols-3 gap-3">
              {["min", "max", "step"].map((k) => (
                <div key={k}>
                  <label className="text-xs font-mono text-zinc-500 uppercase">{k}</label>
                  <Input type="number" className={fieldCls} value={form[k]} onChange={(e) => set(k, e.target.value)} />
                </div>
              ))}
            </div>
          )}
          <Button onClick={submit} className="w-full bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-semibold">Snap it on</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}