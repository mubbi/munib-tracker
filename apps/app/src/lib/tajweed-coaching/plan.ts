import type {
  TajweedCoachingCategory,
  TajweedCoachingPlan,
  TajweedCoachingState,
  TajweedPlanItem,
  TajweedWordCard,
  TajweedWordRef,
} from "@munib-tracker/shared/types";

import type { PracticeHistory } from "@/lib/quran-companion/types";

import type { StudyWordTajweed } from "./ayah-words";
import {
  DRILL_HEAD_IDS,
  isDrillHead,
  LISTEN_CATEGORIES,
  planItemKey,
  RULE_CATEGORY,
} from "./categories";
import { recentTryAgainRate } from "./progress";

/**
 * NF-3.15 Phase A "Coaching plan from your practice" (+ Phase B word cards).
 *
 * Inputs are the person's own practice: weak ayahs from the last sessions, the
 * revision queue, and (D20, unless they opted out) the words NF-3.24 marked
 * "Listen again". Nothing here judges tajweed: weak ayahs come from word
 * mismatches, so the plan only says which sounds those ayahs CONTAIN.
 */

/** A flagged word handed over by NF-3.24 (`getFlaggedWords`). */
export type CoachingFlaggedWord = { surah: number; ayah: number; word: number; at: string };

export type CoachingAyahSource = "weak" | "due" | "flagged";
export type CoachingAyah = { surah: number; ayah: number; source: CoachingAyahSource };

/** Sessions read for weak ayahs. */
export const PLAN_SESSIONS = 10;
/** Revision-queue rows read. */
export const PLAN_DUE_ROWS = 20;
/** Ayahs a plan is built from (keeps the markup / word fetches small). */
export const PLAN_MAX_AYAHS = 40;
/** "Pick the top 3 drills" (+ up to two listen-and-repeat cards). */
export const PLAN_DRILLS = 3;
export const PLAN_LISTEN_CARDS = 2;
export const PLAN_EXAMPLE_WORDS = 4;
export const PLAN_WORD_CARDS = 5;

export const ayahKey = (surah: number, ayah: number) => `${surah}:${ayah}`;

/**
 * Ayahs to build the plan from, in priority order and de-duplicated: weak
 * ayahs of the most recent sessions first, then flagged-word ayahs, then the
 * revision queue.
 */
export function collectCoachingAyahs(input: {
  history: PracticeHistory;
  due: readonly { surah: number; ayah: number }[];
  flagged: readonly CoachingFlaggedWord[];
}): CoachingAyah[] {
  const out: CoachingAyah[] = [];
  const seen = new Set<string>();
  const add = (surah: number, ayah: number, source: CoachingAyahSource) => {
    const key = ayahKey(surah, ayah);
    if (seen.has(key) || out.length >= PLAN_MAX_AYAHS) return;
    seen.add(key);
    out.push({ surah, ayah, source });
  };
  const sessions = [...input.history.items]
    .sort((a, b) => (a.endedAt < b.endedAt ? 1 : a.endedAt > b.endedAt ? -1 : 0))
    .slice(0, PLAN_SESSIONS);
  for (const session of sessions) {
    for (const ayah of session.weakAyahs ?? []) add(session.surah, ayah, "weak");
  }
  for (const word of input.flagged) add(word.surah, word.ayah, "flagged");
  for (const row of input.due.slice(0, PLAN_DUE_ROWS)) add(row.surah, row.ayah, "due");
  return out;
}

/** Per category: how many (word, rule) occurrences the plan's ayahs contain. */
export function countOccurrences(
  ayahs: readonly CoachingAyah[],
  wordData: ReadonlyMap<string, readonly StudyWordTajweed[]>,
): Map<TajweedCoachingCategory, number> {
  const counts = new Map<TajweedCoachingCategory, number>();
  const bump = (c: TajweedCoachingCategory) => counts.set(c, (counts.get(c) ?? 0) + 1);
  for (const { surah, ayah } of ayahs) {
    for (const word of wordData.get(ayahKey(surah, ayah)) ?? []) {
      for (const rule of word.rules) {
        const category = RULE_CATEGORY[rule];
        if (category) bump(category);
      }
      if (word.categories.includes("gemination")) bump("gemination");
    }
  }
  return counts;
}

function wordHas(
  wordData: ReadonlyMap<string, readonly StudyWordTajweed[]>,
  ref: TajweedWordRef,
  category: TajweedCoachingCategory,
): boolean {
  return !!wordData
    .get(ayahKey(ref.surah, ref.ayah))
    ?.[ref.wordIndex]?.categories.includes(category);
}

/** Example words: the person's flagged words first (newest), then words of their ayahs. */
function exampleWords(
  category: TajweedCoachingCategory,
  ayahs: readonly CoachingAyah[],
  flagged: readonly CoachingFlaggedWord[],
  wordData: ReadonlyMap<string, readonly StudyWordTajweed[]>,
): TajweedWordRef[] {
  const out: TajweedWordRef[] = [];
  const seen = new Set<string>();
  const add = (ref: TajweedWordRef) => {
    const key = `${ref.surah}:${ref.ayah}:${ref.wordIndex}`;
    if (seen.has(key) || out.length >= PLAN_EXAMPLE_WORDS) return;
    if (!wordHas(wordData, ref, category)) return;
    seen.add(key);
    out.push(ref);
  };
  for (const f of flagged) add({ surah: f.surah, ayah: f.ayah, wordIndex: f.word });
  // One word per ayah first so the examples spread over the person's ayahs.
  for (const pass of [0, 1]) {
    for (const { surah, ayah } of ayahs) {
      const words = wordData.get(ayahKey(surah, ayah)) ?? [];
      let taken = 0;
      for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
        if (pass === 0 && taken > 0) break;
        const before = out.length;
        add({ surah, ayah, wordIndex });
        if (out.length > before) taken++;
      }
    }
  }
  return out;
}

export type BuildPlanInput = {
  ayahs: readonly CoachingAyah[];
  /** `surah:ayah` → per study word tajweed (from `studyWordTajweed`). */
  wordData: ReadonlyMap<string, readonly StudyWordTajweed[]>;
  /** NF-3.24 flagged words (already `[]` when the person opted out). */
  flagged: readonly CoachingFlaggedWord[];
  state: TajweedCoachingState;
  /** NF-3.24 spike S4: per-word windows reliable → Phase B word cards (D24). */
  alignmentReliable: boolean;
  now: Date;
};

/**
 * Rank and build the plan. `score(head) = occurrences × (1 + recentTryAgainRate)`;
 * the top {@link PLAN_DRILLS} heads become drills, the most frequent rules with
 * no head become listen-and-repeat cards. Returns null when the ayahs contain
 * nothing to coach.
 */
export function buildCoachingPlan(input: BuildPlanInput): TajweedCoachingPlan | null {
  const occurrences = countOccurrences(input.ayahs, input.wordData);
  const score = (c: TajweedCoachingCategory) => {
    const occ = occurrences.get(c) ?? 0;
    return isDrillHead(c) ? occ * (1 + recentTryAgainRate(input.state.heads[c])) : occ;
  };
  const rank = (list: readonly TajweedCoachingCategory[], limit: number) =>
    list
      .filter((c) => (occurrences.get(c) ?? 0) > 0)
      .map((c, order) => ({ c, s: score(c), order }))
      .sort((a, b) => b.s - a.s || a.order - b.order)
      .slice(0, limit)
      .map((x) => x.c);

  const items: TajweedPlanItem[] = [
    ...rank(DRILL_HEAD_IDS, PLAN_DRILLS),
    ...rank(LISTEN_CATEGORIES, PLAN_LISTEN_CARDS),
  ].map((category) => ({
    head: planItemKey(category),
    words: exampleWords(category, input.ayahs, input.flagged, input.wordData),
    occurrences: occurrences.get(category) ?? 0,
  }));

  const wordCards: TajweedWordCard[] = [];
  if (input.alignmentReliable) {
    const seen = new Set<string>();
    for (const f of input.flagged) {
      const key = `${f.surah}:${f.ayah}:${f.word}`;
      if (seen.has(key) || wordCards.length >= PLAN_WORD_CARDS) continue;
      seen.add(key);
      const categories = input.wordData.get(ayahKey(f.surah, f.ayah))?.[f.word]?.categories ?? [];
      if (categories.length) {
        wordCards.push({
          surah: f.surah,
          ayah: f.ayah,
          wordIndex: f.word,
          categories: [...categories],
        });
      }
    }
  }

  if (!items.length && !wordCards.length) return null;
  const plan: TajweedCoachingPlan = { createdAt: input.now.toISOString(), items };
  if (wordCards.length) plan.wordCards = wordCards;
  return plan;
}

/** True when the practice history has a session newer than the stored plan. */
export function planIsStale(
  plan: TajweedCoachingPlan | undefined,
  history: PracticeHistory,
): boolean {
  if (!plan) return history.items.length > 0;
  return history.items.some((s) => s.endedAt > plan.createdAt);
}
