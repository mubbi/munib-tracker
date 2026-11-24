import type { TajweedRuleId, TajweedSegment } from "@munib-tracker/shared/types";

import { alignPracticeWords, foldArabicWord } from "./align-words";

/** One coloured (or plain) run inside a study word. */
export type TajweedWordRun = { text: string; rule?: TajweedRuleId };

type MarkupWord = { text: string; runs: TajweedWordRun[] };

function pushRun(runs: TajweedWordRun[], text: string, rule: TajweedRuleId | undefined) {
  const last = runs[runs.length - 1];
  if (last && last.rule === rule) last.text += text;
  else runs.push(rule ? { text, rule } : { text });
}

/** Split parsed tajweed markup into words, keeping each word's coloured runs. */
export function markupWordRuns(segments: readonly TajweedSegment[]): MarkupWord[] {
  const words: MarkupWord[] = [];
  let current: MarkupWord = { text: "", runs: [] };
  const flush = () => {
    // Marks-only tokens (waqf signs) are dropped, as the study row drops them.
    if (current.text && foldArabicWord(current.text).length > 0) words.push(current);
    current = { text: "", runs: [] };
  };
  for (const segment of segments) {
    for (const part of segment.text.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        flush();
        continue;
      }
      current.text += part;
      pushRun(current.runs, part, segment.rule ?? undefined);
    }
  }
  flush();
  return words;
}

/**
 * Tajweed colouring for the practice word row, one entry per study word, so the
 * ayah is shown once (no separate tajweed block above the interactive row).
 *
 * Words are matched with the practice aligner, the same mapping tajweed
 * coaching uses (`studyWordTajweed`). The study text is always what is drawn:
 * - a 1:1 match whose markup text is identical gets the markup's letter-level runs;
 * - any other match (a join / split, or a spelling difference) colours the
 *   whole word with the first rule it contains;
 * - a word with no rule, or no match, is `null` (plain — never a guessed rule).
 */
export function studyWordTajweedRuns(
  segments: readonly TajweedSegment[] | null | undefined,
  studyWords: readonly string[],
): (TajweedWordRun[] | null)[] {
  if (!segments?.length) return studyWords.map(() => null);
  const markup = markupWordRuns(segments);
  const { studyToEngine, engineToStudy } = alignPracticeWords(
    "",
    studyWords,
    markup.map((w) => w.text),
  );
  return studyWords.map((word, s) => {
    const sources = studyToEngine[s] ?? [];
    const only = sources.length === 1 ? sources[0] : undefined;
    const source = only != null ? markup[only] : undefined;
    if (source && engineToStudy[only as number]?.length === 1 && source.text === word) {
      return source.runs.some((run) => run.rule) ? source.runs.map((run) => ({ ...run })) : null;
    }
    for (const m of sources) {
      const rule = markup[m]?.runs.find((run) => run.rule)?.rule;
      if (rule) return [{ text: word, rule }];
    }
    return null;
  });
}
