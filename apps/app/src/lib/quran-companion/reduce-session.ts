import { studyIndexesFor, type WordAlignment } from "./align-words";
import type {
  AyahOutcome,
  CompanionEvent,
  FeedbackTiming,
  MismatchReason,
  PracticeErrorCode,
  WordState,
} from "./types";

/**
 * Pure session reducer: `(state, event) → state` (§8). Word states are a
 * parallel array on the study words so the row never reflows (§6).
 */

export type AyahPracticeState = {
  ayah: number;
  /** Study words exactly as displayed. */
  words: string[];
  /** Engine → study mapping. `null` when no engine runs (listen-only). */
  alignment: WordAlignment | null;
  states: WordState[];
  reasons: (MismatchReason | null)[];
  /** Per study word: was it already heard when the engine flagged it? Used for self-correction. */
  heardWhenFlagged: boolean[];
  /** Study word the reciter is on (accent underline). */
  activeIndex: number | null;
  /** Any engine position arrived for this ayah in the current take. */
  reached: boolean;
  /** Takes recorded on this ayah (retry starts a new one). */
  takes: number;
  /** Spoken words that are not in the ayah (summary list only). */
  extras: number;
};

export type SessionStatus = "idle" | "listening" | "settled" | "failed";

export type SessionState = {
  status: SessionStatus;
  failure: PracticeErrorCode | null;
  ayahs: Record<number, AyahPracticeState>;
};

export function createAyahState(
  ayah: number,
  words: string[],
  alignment: WordAlignment | null,
): AyahPracticeState {
  return {
    ayah,
    words,
    alignment,
    states: words.map(() => (alignment ? "upcoming" : "idle")),
    reasons: words.map(() => null),
    heardWhenFlagged: words.map(() => false),
    activeIndex: null,
    reached: false,
    takes: 0,
    extras: 0,
  };
}

export function createSessionState(ayahs: AyahPracticeState[] = []): SessionState {
  return {
    status: "idle",
    failure: null,
    ayahs: Object.fromEntries(ayahs.map((a) => [a.ayah, a])),
  };
}

/** Add (or replace) one ayah's row, e.g. when its study words finish loading. */
export function withAyah(state: SessionState, ayah: AyahPracticeState): SessionState {
  return { ...state, ayahs: { ...state.ayahs, [ayah.ayah]: ayah } };
}

/** A new take on `ayah`: clears its marks, keeps the words and alignment. */
export function beginTake(state: SessionState, ayah: number): SessionState {
  const current = state.ayahs[ayah];
  if (!current) return { ...state, status: "listening", failure: null };
  const fresh = createAyahState(ayah, current.words, current.alignment);
  fresh.takes = current.takes + 1;
  return { ...withAyah(state, fresh), status: "listening", failure: null };
}

function updateAyah(
  state: SessionState,
  ayah: number,
  fn: (a: AyahPracticeState) => AyahPracticeState,
): SessionState {
  const current = state.ayahs[ayah];
  if (!current) return state;
  return withAyah(state, fn(current));
}

function applyPosition(
  a: AyahPracticeState,
  event: Extract<CompanionEvent, { type: "position" }>,
): AyahPracticeState {
  if (!a.alignment) return a;
  const states = [...a.states];
  const matchedStudy = studyIndexesFor(a.alignment, event.matched);
  for (const s of matchedStudy) {
    const prev = states[s];
    if (prev === "confirmedMismatch") {
      // Heard again after the flag — a self-correction, but only if the engine had
      // not already heard it when it raised the issue.
      if (!a.heardWhenFlagged[s]) states[s] = "corrected";
    } else if (prev !== "corrected") {
      states[s] = "matched";
    }
  }
  // Words before the furthest heard word that the tracker did not hear inside the
  // spoken span stay "not sure" — never red without an engine issue (§8).
  const furthest = matchedStudy.length ? Math.max(...matchedStudy) : -1;
  for (let s = 0; s < furthest; s++) {
    if (states[s] === "upcoming") states[s] = "uncertain";
  }
  const active = studyIndexesFor(a.alignment, [event.engineWord]);
  return {
    ...a,
    states,
    reached: true,
    activeIndex: active.length ? active[0] : a.activeIndex,
  };
}

function applyMismatch(
  a: AyahPracticeState,
  event: Extract<CompanionEvent, { type: "confirmedMismatch" }>,
): AyahPracticeState {
  if (!a.alignment) return a;
  const engineWords = Array.from(
    { length: Math.max(1, event.words) },
    (_, k) => event.engineWord + k,
  );
  const study = studyIndexesFor(a.alignment, engineWords);
  if (!study.length) return a; // unmapped → stays neutral
  const states = [...a.states];
  const reasons = [...a.reasons];
  const heard = [...a.heardWhenFlagged];
  for (const s of study) {
    heard[s] = states[s] === "matched";
    states[s] = "confirmedMismatch";
    reasons[s] = event.reason;
  }
  return { ...a, states, reasons, heardWhenFlagged: heard, reached: true };
}

function applyUncertain(
  a: AyahPracticeState,
  event: Extract<CompanionEvent, { type: "uncertain" }>,
): AyahPracticeState {
  if (!a.alignment) return a;
  const engineWords = Array.from(
    { length: Math.max(1, event.words) },
    (_, k) => event.engineWord + k,
  );
  const states = [...a.states];
  for (const s of studyIndexesFor(a.alignment, engineWords)) {
    if (states[s] === "upcoming" || states[s] === "matched") states[s] = "uncertain";
  }
  return { ...a, states, reached: true };
}

export function reduceSession(state: SessionState, event: CompanionEvent): SessionState {
  switch (event.type) {
    case "started":
      return { ...state, status: "listening", failure: null };
    case "position":
      return updateAyah(state, event.ayah, (a) => applyPosition(a, event));
    case "confirmedMismatch":
      return updateAyah(state, event.ayah, (a) => applyMismatch(a, event));
    case "uncertain":
      return updateAyah(state, event.ayah, (a) => applyUncertain(a, event));
    case "extra":
      return updateAyah(state, event.ayah, (a) => ({ ...a, extras: a.extras + 1 }));
    case "completed":
      return { ...state, status: "settled" };
    case "failed":
      return { ...state, status: "failed", failure: event.code };
    default:
      return state;
  }
}

export type WordCounts = {
  matched: number;
  uncertain: number;
  confirmedMismatch: number;
  corrected: number;
  notReached: number;
};

export function countWords(a: AyahPracticeState): WordCounts {
  const counts: WordCounts = {
    matched: 0,
    uncertain: 0,
    confirmedMismatch: 0,
    corrected: 0,
    notReached: 0,
  };
  for (const s of a.states) {
    if (s === "matched") counts.matched += 1;
    else if (s === "uncertain") counts.uncertain += 1;
    else if (s === "confirmedMismatch") counts.confirmedMismatch += 1;
    else if (s === "corrected") counts.corrected += 1;
    else if (s === "upcoming") counts.notReached += 1;
  }
  return counts;
}

/** Fraction of study words left "not sure" at or above which a take does not advance the ladder. */
export const UNCERTAIN_CAP = 0.1;

/**
 * Ladder outcome of the latest take on one ayah (§10): advance only when the
 * ayah was fully reached, no confirmed mismatch, and few "not sure" words.
 * A confirmed mismatch is a lapse. Anything else (including listen-only) is neutral.
 */
export function ayahOutcome(a: AyahPracticeState): AyahOutcome {
  if (!a.alignment || a.takes === 0 || !a.reached) return "neutral";
  const c = countWords(a);
  if (c.confirmedMismatch > 0) return "lapse";
  if (c.notReached > 0) return "neutral";
  const total = a.words.length || 1;
  if (c.uncertain / total >= UNCERTAIN_CAP) return "neutral";
  return "success";
}

/**
 * What the session screen paints for each word, given the feedback timing (§9.2).
 * The reducer always holds the truth; this only decides when it is shown.
 */
export function visibleWordStates(
  a: AyahPracticeState,
  timing: FeedbackTiming,
  takeActive: boolean,
): WordState[] {
  if (!a.alignment) return a.states;
  if (timing === "end") return a.states.map(() => "idle");
  if (takeActive && timing === "ayah") {
    return a.states.map((s) =>
      s === "confirmedMismatch" ? "upcoming" : s === "corrected" ? "matched" : s,
    );
  }
  return a.states;
}

/** Study indexes to show in the "Try N words again" line (corrected words never appear). */
export function tryAgainIndexes(a: AyahPracticeState): number[] {
  const out: number[] = [];
  a.states.forEach((s, i) => {
    if (s === "confirmedMismatch") out.push(i);
  });
  return out;
}
