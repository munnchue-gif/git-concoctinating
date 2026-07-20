import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Pencil, Code2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import GradeBadge from "@/components/forge/GradeBadge";
import PieceEditForm from "@/components/forge/PieceEditForm";

const Section = ({ label, children, accent }) => (
  <div className="border-t border-zinc-800/80 pt-5">
    <h2 className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">{label}</h2>
    <p className={`leading-relaxed ${accent ? "text-amber-400 font-mono text-sm" : "text-zinc-300"}`}>{children}</p>
  </div>
);

export default function PieceDetail() {
  const { id } = useParams();
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: piece, isLoading } = useQuery({
    queryKey: ["forgePiece", id],
    queryFn: () => base44.entities.ForgePiece.get(id),
  });

  const mutation = useMutation({
    mutationFn: (form) =>
      base44.entities.ForgePiece.update(id, {
        name: form.name,
        grade: form.grade,
        what_it_is: form.what_it_is,
        serves: form.serves,
        gaps: form.gaps,
        next_brick: form.next_brick,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forgePiece", id] });
      queryClient.invalidateQueries({ queryKey: ["forgePieces"] });
      setEditing(false);
    },
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-amber-400 text-sm font-mono mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to the board
        </Link>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-zinc-800 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : !piece ? (
          <p className="text-zinc-500 font-mono text-center py-24">Piece not found.</p>
        ) : editing ? (
          <PieceEditForm piece={piece} saving={mutation.isPending} onSave={(f) => mutation.mutate(f)} onCancel={() => setEditing(false)} />
        ) : (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                  <span className="font-mono text-xs">{String(piece.order || 0).padStart(2, "0")}</span>
                  {piece.piece_type === "Code" ? <Code2 className="h-4 w-4" /> : <Lightbulb className="h-4 w-4" />}
                  <span className="text-[11px] uppercase tracking-widest">{piece.piece_type}</span>
                </div>
                <h1 className="font-heading text-3xl md:text-4xl tracking-tight">{piece.name}</h1>
              </div>
              <div className="flex items-center gap-3 shrink-0 pt-1">
                <GradeBadge grade={piece.grade} />
                <Button size="icon" variant="ghost" onClick={() => setEditing(true)} className="text-zinc-500 hover:text-amber-400">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Section label="What it is">{piece.what_it_is || "—"}</Section>
            <Section label="What part it serves">{piece.serves || "—"}</Section>
            <Section label="Weak spots / gaps">{piece.gaps || "—"}</Section>
            <Section label="Upgrade · next brick" accent>→ {piece.next_brick || "—"}</Section>
          </div>
        )}
      </div>
    </div>
  );
}