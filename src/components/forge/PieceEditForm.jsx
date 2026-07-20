import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GRADES } from "@/components/forge/gradeConfig";

const fieldCls = "bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-amber-500/50";

export default function PieceEditForm({ piece, onSave, onCancel, saving }) {
  const [form, setForm] = useState({ ...piece });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-mono text-zinc-500 uppercase">Name</label>
          <Input className={fieldCls} value={form.name || ""} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-mono text-zinc-500 uppercase">Grade</label>
          <Select value={form.grade} onValueChange={(v) => set("grade", v)}>
            <SelectTrigger className={fieldCls}><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.keys(GRADES).map((g) => (
                <SelectItem key={g} value={g}>{GRADES[g].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {[
        ["what_it_is", "What it is"],
        ["serves", "What part it serves"],
        ["gaps", "Weak spots / gaps"],
        ["next_brick", "Upgrade / next brick"],
      ].map(([k, label]) => (
        <div key={k}>
          <label className="text-xs font-mono text-zinc-500 uppercase">{label}</label>
          <Textarea className={fieldCls} rows={2} value={form[k] || ""} onChange={(e) => set(k, e.target.value)} />
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form)} disabled={saving} className="bg-amber-600 hover:bg-amber-500 text-zinc-950 font-semibold">
          {saving ? "Saving…" : "Save"}
        </Button>
        <Button variant="ghost" onClick={onCancel} className="text-zinc-400 hover:text-zinc-100">Cancel</Button>
      </div>
    </div>
  );
}