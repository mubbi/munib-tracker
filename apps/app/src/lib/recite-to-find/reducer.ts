import type { CompanionEvent, PracticeErrorCode } from "@/lib/quran-companion/types";

/**
 * Recite to find (D68): turns the on-device listener's free-recitation events
 * into a short, ranked, de-duplicated list of ayahs. Pure, so Jest covers it.
 *
 * Evidence per ayah, from weakest to strongest:
 * - `verseCandidates` — the engine's guesses before it locks on;
 * - `position` — the tracker is following this ayah and heard some of its
 *   words (score grows with the share heard);
 * - `verseMatch` / `verseSequence` — the engine confirmed the ayah.
 *
 * Each take has an id (`take`): events the hook tags with an older take — the
 * tail a slow `engine.stop()` flushes after the next take began — are dropped.
 * `live` is the tracker's latest position (ayah + engine words heard), which
 * the panel shows as live feedback while listening.
 *
 * Neighbouring ayahs of one surah that were both heard well merge into one
 * passage candidate ("Al-Baqarah 255–256"). Ranking is by strength band first,
 * then by when the ayah was first heard, so the list does not reshuffle on every
 * engine frame.
 */

export type ReciteStatus = "idle" | "listening" | "found" | "nothing" | "error";

export type CandidateStrength = "strong" | "likely" | "possible";

export type ReciteCandidate = {
  /** Stable React key: surah and first ayah. */
  key: string;
  surah: number;
  ayah: number;
  /** Last ayah of a merged passage (equal to `ayah` for one ayah). */
  ayahEnd: number;
  /** 0..1 */
  score: number;
  strength: CandidateStrength;
  /** The engine confirmed at least one ayah of it. */
  confirmed: boolean;
};

type Evidence = {
  surah: number;
  ayah: number;
  score: number;
  confirmed: boolean;
  /** Order the ayah was first heard in (monotonic per take). */
  firstSeen: number;
};

/** The tracker's latest position in this take: the ayah and the engine words heard in it. */
export type ReciteLive = {
  surah: number;
  ayah: number;
  /** Engine word indexes heard (sorted, unique). */
  matched: number[];
  totalWords: number;
};

export type ReciteState = {
  status: ReciteStatus;
  /** Id of the current (or last) take; events tagged with another take are ignored. */
  take: number;
  live: ReciteLive | null;
  evidence: Record<string, Evidence>;
  /** Next `firstSeen` value. */
  seq: number;
  error: PracticeErrorCode | null;
  candidates: ReciteCandidate[];
};

export type ReciteAction =
  /** A new take; `take` defaults to the previous id + 1. */
  | { type: "start"; take?: number }
  /** `take` (when given) must be the current take, or the event is stale and dropped. */
  | { type: "event"; event: CompanionEvent; take?: number }
  /** The take ended (user stop, auto stop, or the engine's `completed`). */
  | { type: "finish" }
  | { type: "fail"; code: PracticeErrorCode }
  | { type: "reset" };

/** At most this many candidates are shown. */
export const MAX_CANDIDATES = 5;
/** Below this an ayah is never shown. */
export const MIN_SCORE = 0.3;
export const STRONG_SCORE = 0.75;
export const LIKELY_SCORE = 0.55;

/** A tracker lock with no words heard yet. */
const POSITION_BASE = 0.45;
/** Extra score for a fully heard ayah while tracking (unconfirmed). */
const POSITION_COVERAGE = 0.4;
/** Floor of a confirmed ayah; the engine's confidence fills the rest. */
const CONFIRMED_BASE = 0.7;
/** Guesses before lock-in are discounted; a stable top guess a little less. */
const CANDIDATE_WEIGHT = 0.8;
const STABLE_TOP_WEIGHT = 0.9;

export function createReciteState(): ReciteState {
  return { status: "idle", take: 0, live: null, evidence: {}, seq: 0, error: null, candidates: [] };
}

const ayahKey = (surah: number, ayah: number) => `${surah}:${ayah}`;

function round(n: number): number {
  return Math.round(Math.max(0, Math.min(1, n)) * 1000) / 1000;
}

export function strengthOf(score: number): CandidateStrength {
  if (score >= STRONG_SCORE) return "strong";
  if (score >= LIKELY_SCORE) return "likely";
  return "possible";
}

const BAND: Record<CandidateStrength, number> = { strong: 2, likely: 1, possible: 0 };

type Observation = { surah: number; ayah: number; score: number; confirmed: boolean };

function observe(state: ReciteState, list: Observation[]): ReciteState {
  let evidence = state.evidence;
  let seq = state.seq;
  let changed = false;
  for (const o of list) {
    if (!Number.isInteger(o.surah) || !Number.isInteger(o.ayah) || o.ayah < 1) continue;
    const key = ayahKey(o.surah, o.ayah);
    const prev = evidence[key];
    const score = round(Math.max(prev?.score ?? 0, o.score));
    const confirmed = (prev?.confirmed ?? false) || o.confirmed;
    if (prev && prev.score === score && prev.confirmed === confirmed) continue;
    if (!changed) {
      evidence = { ...evidence };
      changed = true;
    }
    evidence[key] = {
      surah: o.surah,
      ayah: o.ayah,
      score,
      confirmed,
      firstSeen: prev?.firstSeen ?? seq++,
    };
  }
  if (!changed) return state;
  return { ...state, evidence, seq, candidates: rankCandidates(evidence) };
}

/** Engine event → observations. Events that say nothing about "which ayah" → []. */
function observationsOf(event: CompanionEvent): Observation[] {
  switch (event.type) {
    case "position": {
      const heard = new Set(event.matched).size;
      // A cursor on an ayah with no word heard yet says nothing about it.
      if (heard === 0) return [];
      const coverage = event.totalWords > 0 ? Math.min(1, heard / event.totalWords) : 0;
      return [
        {
          surah: event.surah,
          ayah: event.ayah,
          score: POSITION_BASE + POSITION_COVERAGE * coverage,
          confirmed: false,
        },
      ];
    }
    case "verseMatch":
      return [
        {
          surah: event.surah,
          ayah: event.ayah,
          score: CONFIRMED_BASE + (1 - CONFIRMED_BASE) * event.confidence,
          confirmed: true,
        },
      ];
    case "verseSequence":
      return event.verses.map((v) => ({
        surah: v.surah,
        ayah: v.ayah,
        score: CONFIRMED_BASE + (1 - CONFIRMED_BASE) * v.confidence,
        confirmed: true,
      }));
    case "verseCandidates": {
      const out: Observation[] = [];
      event.candidates.forEach((c, rank) => {
        const weight = event.stable && rank === 0 ? STABLE_TOP_WEIGHT : CANDIDATE_WEIGHT;
        const end = Math.max(c.ayah, c.ayahEnd ?? c.ayah);
        for (let a = c.ayah; a <= end; a++) {
          out.push({ surah: c.surah, ayah: a, score: c.confidence * weight, confirmed: false });
        }
      });
      return out;
    }
    default:
      return [];
  }
}

/**
 * Evidence → ranked candidates. Consecutive ayahs of one surah that are both
 * likely or better merge into a passage; weak ayahs stay on their own.
 */
export function rankCandidates(evidence: Record<string, Evidence>): ReciteCandidate[] {
  const items = Object.values(evidence)
    .filter((e) => e.score >= MIN_SCORE)
    .sort((a, b) => a.surah - b.surah || a.ayah - b.ayah);

  type Run = ReciteCandidate & { firstSeen: number };
  const runs: Run[] = [];
  for (const e of items) {
    const last = runs[runs.length - 1];
    const joins =
      last &&
      last.surah === e.surah &&
      last.ayahEnd === e.ayah - 1 &&
      last.score >= LIKELY_SCORE &&
      e.score >= LIKELY_SCORE;
    if (joins) {
      last.ayahEnd = e.ayah;
      last.score = Math.max(last.score, e.score);
      last.confirmed = last.confirmed || e.confirmed;
      last.firstSeen = Math.min(last.firstSeen, e.firstSeen);
      last.strength = strengthOf(last.score);
      continue;
    }
    runs.push({
      key: `${e.surah}:${e.ayah}`,
      surah: e.surah,
      ayah: e.ayah,
      ayahEnd: e.ayah,
      score: e.score,
      strength: strengthOf(e.score),
      confirmed: e.confirmed,
      firstSeen: e.firstSeen,
    });
  }

  return runs
    .sort(
      (a, b) =>
        BAND[b.strength] - BAND[a.strength] ||
        Number(b.confirmed) - Number(a.confirmed) ||
        a.firstSeen - b.firstSeen ||
        a.surah - b.surah ||
        a.ayah - b.ayah,
    )
    .slice(0, MAX_CANDIDATES)
    .map(({ firstSeen: _firstSeen, ...candidate }) => candidate);
}

export function reciteReducer(state: ReciteState, action: ReciteAction): ReciteState {
  switch (action.type) {
    case "start":
      return { ...createReciteState(), status: "listening", take: action.take ?? state.take + 1 };
    case "reset":
      return { ...createReciteState(), take: state.take };
    case "fail":
      return { ...state, status: "error", error: action.code };
    case "finish":
      if (state.status !== "listening") return state;
      return { ...state, status: state.candidates.length ? "found" : "nothing" };
    case "event": {
      const { event } = action;
      // A previous take's tail (flushed after this take began) never leaks in.
      if (action.take != null && action.take !== state.take) return state;
      if (event.type === "failed") return { ...state, status: "error", error: event.code };
      if (event.type === "completed") return reciteReducer(state, { type: "finish" });
      // Late events after the take ended (or before it began) are ignored.
      if (state.status !== "listening") return state;
      const next = observe(state, observationsOf(event));
      return event.type === "position" ? withLive(next, event) : next;
    }
    default:
      return state;
  }
}

/** Track the latest heard position (a cursor with no word heard says nothing). */
function withLive(
  state: ReciteState,
  event: Extract<CompanionEvent, { type: "position" }>,
): ReciteState {
  const matched = [...new Set(event.matched)].filter((i) => i >= 0).sort((a, b) => a - b);
  if (matched.length === 0) return state;
  const prev = state.live;
  if (
    prev &&
    prev.surah === event.surah &&
    prev.ayah === event.ayah &&
    prev.totalWords === event.totalWords &&
    prev.matched.length === matched.length &&
    prev.matched.every((v, i) => v === matched[i])
  ) {
    return state;
  }
  return {
    ...state,
    live: { surah: event.surah, ayah: event.ayah, matched, totalWords: event.totalWords },
  };
}

/** True once the engine has confirmed an ayah (used to end a take on a pause). */
export function hasConfirmedMatch(state: ReciteState): boolean {
  return state.candidates.some((c) => c.confirmed);
}
