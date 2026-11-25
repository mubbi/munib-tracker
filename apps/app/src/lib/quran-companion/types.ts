/**
 * Qur'an Companion (recitation practice) — shared types.
 *
 * Feature: docs/FEATURES.md (NF-2.38). Everything in this folder that
 * does not need a microphone is pure TypeScript so Jest covers it.
 */

/** Modes the person can pick on the hub (and store as the default). */
export type PracticeMode = "follow" | "check" | "hide-words" | "hide-ayahs";

/** Modes a finished session can be recorded under. */
export type SessionMode = PracticeMode | "revision";

export type EngineId = "tilawa-zipformer" | "tilawa-fastconformer";

/** Practice state of one study word. Parallel array to the study words (§6). */
export type WordState =
  | "idle"
  | "upcoming"
  | "matched"
  | "uncertain"
  | "confirmedMismatch"
  | "corrected";

/** Why a word was marked "try again". Only the engine can raise these. */
export type MismatchReason = "missing" | "wrong" | "vowel" | "skipped-ayah";

/** Inclusive ayah range inside one surah. A passage never crosses a surah (D10). */
export type Passage = { surah: number; ayahStart: number; ayahEnd: number };

/**
 * App-owned events. The engine adapter maps the engine's own messages onto these
 * (`map-tilawa-event.ts`); word indexes here are **engine** word indexes (0-based
 * within the ayah). The reducer maps them onto study words through §6 alignment.
 */
export type CompanionEvent =
  | { type: "started" }
  | {
      type: "position";
      surah: number;
      ayah: number;
      /** Engine word the tracker is on. */
      engineWord: number;
      totalWords: number;
      /** Engine words the tracker heard (ok or unsure verdicts). */
      matched: number[];
    }
  | { type: "uncertain"; surah: number; ayah: number; engineWord: number; words: number }
  | {
      type: "confirmedMismatch";
      surah: number;
      ayah: number;
      engineWord: number;
      /** Engine words the issue covers, from `engineWord`. */
      words: number;
      reason: MismatchReason;
    }
  /** Spoken but not in the ayah (repetition notes). Summary list only — never a fake glyph. */
  | { type: "extra"; surah: number; ayah: number; engineWord: number }
  /**
   * Free recitation only (recite-to-find, D68): the engine is confident this
   * ayah was recited (`verse_match`). Never emitted for practice sessions.
   */
  | { type: "verseMatch"; surah: number; ayah: number; confidence: number }
  /** Free recitation only: ranked guesses before a lock-in (`verse_candidate`). */
  | {
      type: "verseCandidates";
      candidates: VerseCandidateGuess[];
      /** The engine considers the top guess settled. */
      stable: boolean;
      /** Sent while flushing the end of the take. */
      final: boolean;
    }
  /** Free recitation only: the ordered ayahs heard over the whole take (`final_sequence`). */
  | { type: "verseSequence"; verses: { surah: number; ayah: number; confidence: number }[] }
  | { type: "completed" }
  | { type: "failed"; code: PracticeErrorCode };

/** One engine guess for free recitation (`verse_candidate` entry). */
export type VerseCandidateGuess = {
  surah: number;
  ayah: number;
  /** Last ayah when the guess spans several (FastConformer). */
  ayahEnd?: number;
  /** 0..1 as reported by the engine. */
  confidence: number;
};

/** Stable codes → i18n copy (`error-codes.ts`), also the Sentry `code` tag. */
export type PracticeErrorCode =
  | "no-connection"
  | "not-enough-space"
  | "checksum-mismatch"
  | "download-failed"
  | "download-cancelled"
  | "model-missing"
  | "engine-init-failed"
  | "out-of-memory"
  | "runtime-unsupported"
  | "mic-denied"
  | "mic-unavailable"
  | "capture-failed"
  | "interrupted"
  | "engine-runtime"
  | "unknown";

export type FeedbackTiming = "ayah" | "live" | "end";
export type HearBeforeRecite = "off" | "once" | "every-ayah";
export type StartFrom = "lastPractice" | "lastRead" | "ask";
export type RangePreset = "ayah" | "next5" | "surah" | "page";
export type DailyRevisionLimit = 5 | 10 | 20;

export type LastPassage = Passage & { mode: PracticeMode };

export type PracticeView = "ayah" | "page" | "mushaf";

export type QuranCompanionPrefs = {
  schemaVersion: 1;
  defaultMode: PracticeMode;
  rangePreset: RangePreset;
  feedbackTiming: FeedbackTiming;
  showTajweedColors: boolean;
  /** How the session lays out the passage: one ayah, a text page, or the 604-page mushaf. */
  practiceView: PracticeView;
  hearBeforeRecite: HearBeforeRecite;
  autoAdvance: boolean;
  keepAwake: boolean;
  startFrom: StartFrom;
  dailyRevisionLimit: DailyRevisionLimit;
  includeHifzReview: boolean;
  revisionReminder: boolean;
  coachDismissed: boolean;
  engineChoice: EngineId;
  wifiOnlyDownload: boolean;
  /** Phase 6: when the person agreed to the pronunciation listener sheet. */
  pronunciationConsentAt?: string;
  /**
   * NF-3.24 (D20): words a pronunciation check marks "Listen again" feed the
   * NF-3.15 tajweed coaching plan as example words. On by default; Settings ›
   * Qur'an › Practice turns it off.
   */
  feedCoachingFromAssessment: boolean;
  /**
   * NF-3.15: when the revision reminder fires and a tajweed coaching item is
   * due, its text also mentions the sound to practise. On by default; only
   * matters while `revisionReminder` is on.
   */
  tajweedInRevisionReminder: boolean;
  /**
   * D68: ayahs recited in a finished session count toward today's Qur'an
   * reading log and the personal khatm (`reading-credit.ts`). On by default;
   * Settings › Qur'an › Practice turns it off.
   */
  logToReadingLog: boolean;
  /** Last companion passage. Independent of the reader's last-read. */
  lastPassage?: LastPassage;
};

export type PracticeSummary = {
  id: string;
  mode: SessionMode;
  surah: number;
  ayahStart: number;
  ayahEnd: number;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  engine: EngineId | "none";
  engineVersion: string;
  matched: number;
  uncertain: number;
  confirmedMismatch: number;
  corrected: number;
  notReached: number;
  /** Ayah numbers inside the range to try again. */
  weakAyahs: number[];
  /** True when the engine could not confirm mismatches (copy says "not sure"). */
  mismatchesUnconfirmed?: boolean;
  /**
   * NF-3.24 pronunciation check: the state of each checked study word (0-based,
   * Quran.com word order). Word states only — never audio, GOP values or
   * transcripts. Older clients ignore it.
   */
  pronunciation?: {
    words: Array<{
      surah: number;
      ayah: number;
      word: number;
      state: "clear" | "listen-again" | "not-sure";
    }>;
  };
  /**
   * D68: ayahs of a live session heard well enough to count as read
   * (`reading-credit.ts` rule). Pronunciation rows derive theirs from `words`.
   */
  heardAyahs?: number[];
  /**
   * D68: ayahs this session actually added to that day's reading log (set when
   * it is saved). Later sessions the same day skip them, so an ayah is logged
   * once per day.
   */
  loggedAyahs?: number[];
};

/** Stored value of `quranPracticeSessions`. An object so a clear survives sync. */
export type PracticeHistory = {
  schemaVersion: 1;
  /** Set by "Delete practice history". Items ending at or before this are dropped on merge. */
  clearedAt?: string;
  items: PracticeSummary[];
};

export type MemorizationStatus = "learning" | "practising" | "needs_revision";

export type MemorizationRecord = {
  status: MemorizationStatus;
  successStreak: number;
  /** 0 | 1 | 3 | 7 | 14 | 30 */
  intervalDays: number;
  /** Local calendar day, YYYY-MM-DD. */
  nextReviewAt: string;
  lastAttemptAt: string;
  lastSuccessAt?: string;
  lapses: number;
  /** Every write sets this. Used by `mergeMemorization`. */
  updatedAt: string;
};

/** In-memory map. Keys are `hifzKey(surah, ayah)`. */
export type MemorizationRecords = Record<string, MemorizationRecord>;

/**
 * Compact on-disk record. A full hafiz has 6,236 records, and the app's safe
 * AsyncStorage row limit is 1 MB, so dates are epoch seconds and keys are one
 * letter (≈75 bytes per record, ≈470 KB for the whole Qur'an). See
 * `memorization-codec.ts`.
 */
export type StoredMemorizationRecord = {
  /** status: l = learning, p = practising, r = needs_revision */
  s: "l" | "p" | "r";
  /** successStreak */
  k: number;
  /** intervalDays */
  i: number;
  /** nextReviewAt (YYYY-MM-DD, local) */
  n: string;
  /** lastAttemptAt (epoch seconds) */
  a: number;
  /** lastSuccessAt (epoch seconds) */
  w?: number;
  /** lapses */
  l: number;
  /** updatedAt (epoch seconds) */
  u: number;
};

/** Stored value of `quranMemorization`. */
export type MemorizationMap = {
  schemaVersion: 1;
  records: Record<string, StoredMemorizationRecord>;
};

/** Outcome of one ayah inside a finished take, as the ladder sees it. */
export type AyahOutcome = "success" | "lapse" | "neutral";
