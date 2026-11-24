/**
 * NF-3.15 tajweed coaching (Quran Lab) — synced blob `tajweed_coaching`.
 *
 * Holds drill counts, spacing dates and the last coaching plan only: never
 * audio, transcripts, scores or GOP values. Word refs point into the Qur'an
 * corpus (0-based Quran.com study word index); the words are rendered by
 * reference, never stored as text.
 */

/** The three Quran Lab drill heads (`lib/quran-companion/pronunciation/judge.ts`). */
export type TajweedDrillHeadId = "qalqalah" | "ghunna" | "gemination";

/** Rule groups with no drill head: "listen and repeat" cards, never judged. */
export type TajweedListenCategory = "madd" | "ham_wasl" | "laam_shamsiyah" | "idgham_wo_ghunnah";

/** Every coaching category (drill heads + listen-only groups). */
export type TajweedCoachingCategory = TajweedDrillHeadId | TajweedListenCategory;

/** Plan item key: a drill head, or `listen:<category>` for a listen-and-repeat card. */
export type TajweedPlanItemKey = TajweedDrillHeadId | `listen:${TajweedListenCategory}`;

/** A word of the user's own practice, by reference. */
export interface TajweedWordRef {
  surah: number;
  ayah: number;
  /** 0-based study word index (Quran.com word order). */
  wordIndex: number;
}

/** One judged drill outcome kept for the recent try-again rate: m = matched, t = try again. */
export type TajweedRecentVerdict = "m" | "t";

export interface TajweedHeadProgress {
  attempts: number;
  matched: number;
  tryAgain: number;
  notSure: number;
  /** ISO time of the last attempt. */
  lastAt?: string;
  /** Local calendar day (YYYY-MM-DD) the head is due again. */
  nextDueAt?: string;
  /** Current rung of the revision ladder (0 / 1 / 3 / 7 / 14 / 30 days). */
  intervalDays?: number;
  /** Last judged outcomes, newest last (capped). Feeds `recentTryAgainRate`. */
  recent?: TajweedRecentVerdict[];
}

/** "I listened and repeated" on a listen card (self-reported, never judged). */
export interface TajweedListenProgress {
  count: number;
  lastAt?: string;
  nextDueAt?: string;
  intervalDays?: number;
}

export interface TajweedPlanItem {
  head: TajweedPlanItemKey;
  /** Example words from the user's own weak / flagged ayahs. */
  words: TajweedWordRef[];
  /** How often the sound appears in the ayahs the plan was built from. */
  occurrences?: number;
}

/**
 * Phase B: a word NF-3.24 marked "Listen again" that sits inside a tajweed
 * rule's span. Names the rule the word contains — never "you broke the rule".
 */
export interface TajweedWordCard extends TajweedWordRef {
  categories: TajweedCoachingCategory[];
}

export interface TajweedCoachingPlan {
  createdAt: string;
  items: TajweedPlanItem[];
  /** Phase B per-word cards (only when NF-3.24's alignment met its gate). */
  wordCards?: TajweedWordCard[];
}

export interface TajweedCoachingState {
  schemaVersion: 1;
  heads: Partial<Record<TajweedDrillHeadId, TajweedHeadProgress>>;
  listened?: Partial<Record<TajweedListenCategory, TajweedListenProgress>>;
  plan?: TajweedCoachingPlan;
}
