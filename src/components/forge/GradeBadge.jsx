import React from "react";
import { GRADES } from "@/components/forge/gradeConfig";

export default function GradeBadge({ grade, small }) {
  const g = GRADES[grade] || GRADES.YELLOW;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${g.border} ${g.bg} ${g.text} ${
        small ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      } font-mono tracking-wider uppercase`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${g.dot} animate-pulse`} />
      {grade}
    </span>
  );
}