import type { StudyMcq, StudySourceId } from "./types";

/** Collapse whitespace for MCQ strings (options stay full-length). */
export function normalizeMcqText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Truncate for prompts/explanations; keep whole words when possible. */
export function truncateText(text: string, max = 110): string {
  const cleaned = normalizeMcqText(text);
  if (cleaned.length <= max) return cleaned;
  const slice = cleaned.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  const base = lastSpace > max * 0.55 ? slice.slice(0, lastSpace) : slice;
  return `${base.trimEnd()}…`;
}

/** Flash-card length budgets (≈1–4 lines on a phone). */
export const FLASH_PROMPT_MAX = 140;
export const FLASH_OPTION_MAX = 95;
export const FLASH_EXPLANATION_MAX = 170;

const SENTENCE_BREAK = /(?<=[.!?])\s+(?=[A-Z"“‘'(])/;

/**
 * Shorten long copy for flash cards: keep whole leading sentences that fit in `max`;
 * if even the first sentence is too long, cut at a clause break or word and add “…”.
 */
export function condenseText(text: string, max = FLASH_OPTION_MAX): string {
  const cleaned = normalizeMcqText(text);
  if (cleaned.length <= max) return cleaned;

  let acc = "";
  for (const sentence of cleaned.split(SENTENCE_BREAK)) {
    const next = acc ? `${acc} ${sentence}` : sentence;
    if (next.length > max) break;
    acc = next;
  }
  if (acc.length >= max * 0.35) return acc;

  const slice = cleaned.slice(0, max - 1);
  const clause = Math.max(
    slice.lastIndexOf("; "),
    slice.lastIndexOf(" — "),
    slice.lastIndexOf(": "),
    slice.lastIndexOf(", "),
  );
  if (clause > max * 0.45) return `${slice.slice(0, clause).trimEnd()}…`;
  const space = slice.lastIndexOf(" ");
  const base = space > max * 0.5 ? slice.slice(0, space) : slice;
  return `${base.replace(/[\s,;:—–-]+$/, "")}…`;
}

/** True when a card is short enough to read at a glance. */
export function isCompactCard(card: {
  prompt: string;
  options: readonly string[];
  explanation?: string;
}): boolean {
  return (
    card.prompt.length <= FLASH_PROMPT_MAX + 30 &&
    card.options.every((option) => option.length <= FLASH_OPTION_MAX + 5)
  );
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
  // Flash cards must be quick to read: condense every option to a short phrase.
  const correct = condenseText(input.correct, FLASH_OPTION_MAX);
  if (!correct || !input.prompt.trim()) return null;
  if (input.prompt.trim().length > FLASH_PROMPT_MAX + 30) return null;

  const distractors = pickDistractors(
    correct,
    input.distractorPool.map((d) => condenseText(d, FLASH_OPTION_MAX)),
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
    explanation: condenseText(input.explanation, FLASH_EXPLANATION_MAX),
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
