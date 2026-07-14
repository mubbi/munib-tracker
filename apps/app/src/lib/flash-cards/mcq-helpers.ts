import type { StudyMcq, StudySourceId } from "./types";

/** Truncate for option labels; keep whole words when possible. */
export function truncateText(text: string, max = 110): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  const slice = cleaned.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  const base = lastSpace > max * 0.55 ? slice.slice(0, lastSpace) : slice;
  return `${base.trimEnd()}…`;
}

/** Fisher–Yates shuffle (mutates a copy). */
export function shuffleArray<T>(items: readonly T[], random = Math.random): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const a = next[i];
    const b = next[j];
    if (a === undefined || b === undefined) continue;
    next[i] = b;
    next[j] = a;
  }
  return next;
}

/** Pick up to `count` unique distractors different from `correct`. */
export function pickDistractors(
  correct: string,
  pool: readonly string[],
  count = 3,
  random = Math.random,
): string[] {
  const unique = [
    ...new Set(
      pool.map((item) => item.trim()).filter((item) => item.length > 0 && item !== correct),
    ),
  ];
  return shuffleArray(unique, random).slice(0, count);
}

type BuildMcqInput = {
  id: string;
  sourceId: StudySourceId;
  prompt: string;
  correct: string;
  distractorPool: readonly string[];
  explanation: string;
  categoryLabelKey?: string;
  random?: () => number;
};

/**
 * Builds a 4-option MCQ when enough distractors exist; otherwise returns null.
 */
export function buildMcq(input: BuildMcqInput): StudyMcq | null {
  const correct = truncateText(input.correct.trim(), 140);
  if (!correct || !input.prompt.trim()) return null;

  const distractors = pickDistractors(
    correct,
    input.distractorPool.map((d) => truncateText(d, 140)),
    3,
    input.random,
  );
  if (distractors.length < 3) return null;

  const options = shuffleArray([correct, ...distractors], input.random);
  const correctIndex = options.indexOf(correct);
  if (correctIndex < 0) return null;

  return {
    id: input.id,
    sourceId: input.sourceId,
    prompt: input.prompt.trim(),
    options,
    correctIndex,
    explanation: truncateText(input.explanation.trim(), 280),
    categoryLabelKey: input.categoryLabelKey,
  };
}

/** De-dupe by id, keeping first occurrence. */
export function dedupeMcqs(items: readonly StudyMcq[]): StudyMcq[] {
  const seen = new Set<string>();
  const out: StudyMcq[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

/** Cap a shuffled subset for finite section quizzes. */
export function sampleMcqs(
  items: readonly StudyMcq[],
  size: number,
  random = Math.random,
): StudyMcq[] {
  if (items.length <= size) return shuffleArray(items, random);
  return shuffleArray(items, random).slice(0, size);
}
