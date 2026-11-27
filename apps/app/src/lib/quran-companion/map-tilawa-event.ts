import type { CompanionEvent, MismatchReason, VerseCandidateGuess } from "./types";

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
  | {
      type: "verse_match";
      surah: number;
      ayah: number;
      confidence: number;
    }
  | {
      type: "verse_candidate";
      candidates: {
        surah: number;
        ayah: number;
        ayah_end?: number | null;
        confidence: number;
        rank?: number;
      }[];
      stable: boolean;
      final_flush: boolean;
    }
  | {
      type: "final_sequence";
      verses: { surah: number; ayah: number; confidence: number }[];
      confidence: number;
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
  /**
   * Free recitation (recite-to-find, D68): also map the engine's verse-level
   * messages (`verse_match`, `verse_candidate`, `final_sequence`). Off for
   * practice, whose reducer only reads word positions and issues.
   */
  verseEvents?: boolean;
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

function isAyahRef(value: { surah?: unknown; ayah?: unknown } | null | undefined): boolean {
  return (
    !!value &&
    isNumber(value.surah) &&
    isNumber(value.ayah) &&
    value.surah >= 1 &&
    value.surah <= 114 &&
    value.ayah >= 1
  );
}

/** Engine confidences are 0..1; clamp anything outside (or missing) into range. */
function unit(value: unknown): number {
  return isNumber(value) ? Math.max(0, Math.min(1, value)) : 0;
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
    case "verse_match": {
      if (!options.verseEvents) return null;
      const m = message as Extract<TilawaMessage, { type: "verse_match" }>;
      if (!isAyahRef(m)) return null;
      return { type: "verseMatch", surah: m.surah, ayah: m.ayah, confidence: unit(m.confidence) };
    }
    case "verse_candidate": {
      if (!options.verseEvents) return null;
      const m = message as Extract<TilawaMessage, { type: "verse_candidate" }>;
      const list = Array.isArray(m.candidates) ? m.candidates : [];
      const candidates: VerseCandidateGuess[] = list.filter(isAyahRef).map((c) => ({
        surah: c.surah,
        ayah: c.ayah,
        ...(isNumber(c.ayah_end) && c.ayah_end > c.ayah ? { ayahEnd: c.ayah_end } : {}),
        confidence: unit(c.confidence),
      }));
      if (!candidates.length) return null;
      return {
        type: "verseCandidates",
        candidates,
        stable: m.stable === true,
        final: m.final_flush === true,
      };
    }
    case "final_sequence": {
      if (!options.verseEvents) return null;
      const m = message as Extract<TilawaMessage, { type: "final_sequence" }>;
      const verses = (Array.isArray(m.verses) ? m.verses : [])
        .filter(isAyahRef)
        .map((v) => ({ surah: v.surah, ayah: v.ayah, confidence: unit(v.confidence) }));
      return { type: "verseSequence", verses };
    }
    default:
      return null;
  }
}
