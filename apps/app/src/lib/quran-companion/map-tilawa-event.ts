import type { CompanionEvent, MismatchReason } from "./types";

/**
 * Maps `@tilawa/core` `WorkerOutbound` messages onto the app's {@link CompanionEvent}
 * union (§8). Kept free of any `@tilawa/core` import so Jest and the reader bundle
 * never load the engine — the shapes below mirror the pinned 0.4.0 typings.
 *
 * Verified against the real engine on desktop (see §17 of the spec):
 * - correct recitation of 1:1–1:7, 2:255, 9:1 and 2:1 raises no `correction` issue;
 * - skipping 1:3 inside an expected 1:1–1:5 raises `possible_skipped_ayah`;
 * - audio with a word cut out raises no issue, but leaves a gap in `matched_indices`
 *   — which the reducer shows as "not sure", never red.
 */

/** The subset of `WorkerOutbound` this adapter reads. Anything else is ignored. */
export type TilawaMessage =
  | {
      type: "word_progress";
      surah: number;
      ayah: number;
      word_index: number;
      total_words: number;
      matched_indices: number[];
    }
  | {
      type: "correction";
      state: {
        phase: "idle" | "error" | "retrying" | "corrected";
        issue: {
          surah: number;
          ayah: number;
          word: number;
          wordIndex: number;
          kind:
            | "possible_omission"
            | "possible_substitution"
            | "possible_vowel"
            | "possible_repetition"
            | "possible_skipped_ayah"
            | "unclear_ayah";
          words?: number;
        } | null;
      };
      totalWords: number;
    }
  | {
      type: "correction_note";
      issue: { surah: number; ayah: number; word: number; kind: string; words?: number };
    }
  | { type: "error"; message: string }
  | { type: string; [key: string]: unknown };

export type MapOptions = {
  /**
   * Whether this engine build's correction issues may paint a word "try again".
   * Comes from `constants/recitation-models.ts` (per engine version). When false,
   * issues degrade to "not sure".
   */
  confirmedMismatchEnabled: boolean;
};

const REASONS: Record<string, MismatchReason | undefined> = {
  possible_omission: "missing",
  possible_substitution: "wrong",
  possible_vowel: "vowel",
  possible_skipped_ayah: "skipped-ayah",
};

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Returns the app event for one engine message, or `null` to drop it. Never
 * invents a mismatch from a short `matched_indices` list.
 */
export function mapTilawaEvent(message: TilawaMessage, options: MapOptions): CompanionEvent | null {
  switch (message.type) {
    case "word_progress": {
      const m = message as Extract<TilawaMessage, { type: "word_progress" }>;
      if (!isNumber(m.surah) || !isNumber(m.ayah) || !isNumber(m.word_index)) return null;
      return {
        type: "position",
        surah: m.surah,
        ayah: m.ayah,
        engineWord: m.word_index,
        totalWords: isNumber(m.total_words) ? m.total_words : 0,
        matched: Array.isArray(m.matched_indices) ? m.matched_indices.filter(isNumber) : [],
      };
    }
    case "correction": {
      const m = message as Extract<TilawaMessage, { type: "correction" }>;
      const issue = m.state?.phase === "error" ? m.state.issue : null;
      if (!issue || !isNumber(issue.surah) || !isNumber(issue.ayah) || !isNumber(issue.word)) {
        return null;
      }
      const words = isNumber(issue.words) && issue.words > 0 ? issue.words : 1;
      if (issue.kind === "possible_repetition") {
        return { type: "extra", surah: issue.surah, ayah: issue.ayah, engineWord: issue.word };
      }
      const reason = REASONS[issue.kind];
      if (!reason || !options.confirmedMismatchEnabled) {
        // unclear_ayah, unknown kinds, or a build without proven issues → "not sure".
        return {
          type: "uncertain",
          surah: issue.surah,
          ayah: issue.ayah,
          engineWord: issue.word,
          words,
        };
      }
      return {
        type: "confirmedMismatch",
        surah: issue.surah,
        ayah: issue.ayah,
        engineWord: issue.word,
        words,
        reason,
      };
    }
    case "correction_note": {
      const m = message as Extract<TilawaMessage, { type: "correction_note" }>;
      const issue = m.issue;
      if (!issue || !isNumber(issue.surah) || !isNumber(issue.ayah) || !isNumber(issue.word)) {
        return null;
      }
      if (issue.kind === "possible_repetition") {
        return { type: "extra", surah: issue.surah, ayah: issue.ayah, engineWord: issue.word };
      }
      return null;
    }
    default:
      return null;
  }
}
