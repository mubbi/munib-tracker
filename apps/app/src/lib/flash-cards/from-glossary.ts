import { buildMcq } from "./mcq-helpers";
import type { StudyMcq, StudySourceId, TermLike } from "./types";

/** Term ↔ definition recognition cards. */
export function mcqsFromGlossary(
  sourceId: StudySourceId,
  terms: readonly TermLike[],
  categoryLabelKey?: string,
): StudyMcq[] {
  if (terms.length < 4) return [];

  const definitions = terms.map((t) => t.definition);
  const labels = terms.map((t) => t.term);
  const out: StudyMcq[] = [];

  for (const entry of terms) {
    if (!entry.term.trim() || !entry.definition.trim()) continue;

    const meaning = buildMcq({
      id: `${sourceId}:glossary-meaning:${entry.id}`,
      sourceId,
      prompt: `What does “${entry.term}” mean?`,
      correct: entry.definition,
      distractorPool: definitions,
      explanation: entry.definition,
      categoryLabelKey,
    });
    if (meaning) out.push(meaning);

    const term = buildMcq({
      id: `${sourceId}:glossary-term:${entry.id}`,
      sourceId,
      prompt: `Which term means: “${entry.definition}”?`,
      correct: entry.term,
      distractorPool: labels,
      explanation: entry.definition,
      categoryLabelKey,
    });
    if (term) out.push(term);
  }

  return out;
}
