import { base44 } from "@/api/base44Client";

const GRADE_ENUM = ["GREEN", "YELLOW", "RED", "PURPLE", "ORANGE"];

const SCHEMA = {
  type: "object",
  properties: {
    overall_grade: { type: "string", enum: GRADE_ENUM },
    code_grade: { type: "string", enum: GRADE_ENUM },
    structure_grade: { type: "string", enum: GRADE_ENUM },
    security_grade: { type: "string", enum: GRADE_ENUM },
    install_grade: { type: "string", enum: GRADE_ENUM },
    summary: { type: "string" },
    review: { type: "string" },
    how_tos: { type: "array", items: { type: "string" } },
    preinstall_issues: { type: "array", items: { type: "string" } },
    next_bricks: { type: "array", items: { type: "string" } },
  },
  required: ["overall_grade", "code_grade", "structure_grade", "security_grade", "install_grade", "summary", "review"],
};

const MAX_CHARS = 60000;

export async function gradeFile(file) {
  const raw = await file.text();
  const content = raw.slice(0, MAX_CHARS);

  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are the reviewing organ of THE FORGE — a modular, security-first local AI fabric. Its laws: deaf-by-default isolation, one door (a signing Gate) for every privileged action, nothing bare (raw models must be wrapped/sealed), bonded-not-fused, nothing thrown away.

Review the following file thoroughly. Grade each dimension with EXACTLY one of: GREEN (solid, tested-quality), YELLOW (works but needs a look), RED (weak, broken, or missing essentials), PURPLE (revolutionary idea, seed-stage), ORANGE (needs custom work to fit).

Dimensions:
- code_grade: correctness, error handling, clarity
- structure_grade: modularity, LEGO snap-on/off separation, interfaces
- security_grade: fit with the Forge laws (one door, no bare access, replay/injection safety)
- install_grade: PREINSTALL READINESS — dependencies, environment assumptions, anything that would break a fresh install on Pop!_OS Linux
- overall_grade: your holistic verdict

Also produce:
- summary: 2-3 sentences — a quick once-over so an operator instantly understands what this file is and does
- review: an honest, specific written review (strengths, weak spots, what part of the fabric it serves)
- how_tos: short practical "how to use / how to integrate" steps
- preinstall_issues: concrete issues to fix BEFORE installing (missing deps, hardcoded paths, version pins, permissions) — empty array if none
- next_bricks: the upgrade steps, in priority order

FILE NAME: ${file.name}
FILE CONTENT:
\`\`\`
${content}
\`\`\``,
    response_json_schema: SCHEMA,
  });

  return base44.entities.FileReview.create({
    file_name: file.name,
    overall_grade: result.overall_grade,
    code_grade: result.code_grade,
    structure_grade: result.structure_grade,
    security_grade: result.security_grade,
    install_grade: result.install_grade,
    summary: result.summary,
    review: result.review,
    how_tos: result.how_tos || [],
    preinstall_issues: result.preinstall_issues || [],
    next_bricks: result.next_bricks || [],
  });
}