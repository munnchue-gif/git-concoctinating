import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, ScanSearch, Loader2 } from "lucide-react";
import DropZone from "@/components/review/DropZone";
import ReviewCard from "@/components/review/ReviewCard";
import { gradeFile } from "@/components/review/reviewGrader";

export default function ReviewBay() {
  const [reviews, setReviews] = useState(null);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    base44.entities.FileReview.list("-created_date", 100).then(setReviews);
  }, []);

  const handleFiles = async (files) => {
    setQueue(files.map((f) => f.name));
    for (const file of files) {
      const created = await gradeFile(file);
      setReviews((prev) => [created, ...(prev || [])]);
      setQueue((prev) => prev.filter((n) => n !== file.name));
    }
  };

  const handleDelete = async (review) => {
    setReviews((prev) => prev.filter((r) => r.id !== review.id));
    await base44.entities.FileReview.delete(review.id);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 text-sm font-mono mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to the board
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ScanSearch className="h-6 w-6 text-emerald-400" />
            <h1 className="font-heading text-3xl tracking-tight">
              Review Bay <span className="text-zinc-500 font-light">· the once-over</span>
            </h1>
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Drop any file and it gets the full rubric — code, structure, security, and install-readiness graded
            separately — plus a written review, integration how-tos, and preinstall issues caught before they bite.
          </p>
        </header>

        <DropZone onFiles={handleFiles} busy={queue.length > 0} />

        {queue.length > 0 && (
          <div className="mt-4 space-y-2">
            {queue.map((name) => (
              <div key={name} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                <span className="font-mono text-sm text-zinc-400">Grading {name}…</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {reviews === null ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-zinc-800 border-t-emerald-400 rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 && queue.length === 0 ? (
            <p className="text-zinc-600 text-center py-16 font-mono text-sm">No reviews yet — drop the first file.</p>
          ) : (
            reviews.map((r) => <ReviewCard key={r.id} review={r} onDelete={handleDelete} />)
          )}
        </div>
      </div>
    </div>
  );
}