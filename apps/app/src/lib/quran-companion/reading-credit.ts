import { getLocalDateString } from "@munib-tracker/shared/utils";
import { QURAN_TOTAL_AYAHS } from "@/lib/khatm";
import { GLOBAL_OFFSETS, getPageStarts } from "@/lib/quran-meta";
import { READING_MIN_ACTIVE_SECONDS } from "@/lib/quran-reading-session";

import type { AyahPracticeState, SessionState } from "./reduce-session";
import type { PracticeHistory, PracticeSummary } from "./types";

/**
 * D68: practice → daily reading log + personal khatm progress (opt-out via
 * `quran.practice.logToReadingLog`). Pure rules; the store applies them once,
 * when a finished session is saved (`quranPracticeStore.addSummary`).
 *
 * **Counting rule.** An ayah counts as read when the listener actually heard at
 * least two thirds of its study words in the session's latest take:
 * - live sessions (follow / check / hide / revision): a word is heard when it is
 *   `matched`, `corrected`, or a confirmed mismatch of kind `wrong` / `vowel`
 *   (something was recited there). "Not sure", not reached, `missing` and
 *   `skipped-ayah` words do not count. Listen-only sessions (no engine) never
 *   earn ayahs — nothing was recited.
 * - pronunciation checks: `clear` and `listen-again` words are heard (recited,
 *   only the pronunciation was flagged); `not-sure` words are not.
 *
 * **Idempotency.** Keyed on the session id: a session already in the practice
 * history is never credited again (re-render, re-open, duplicate save). Within a
 * local day the credit is per distinct ayah: the ayahs a day's earlier sessions
 * already logged (`loggedAyahs` on their stored rows) are not logged twice, so
 * revising the same ayah three times reads as one ayah in the day's log.
 *
 * **Khatm counts once per cycle (D72).** The personal khatm keeps a record of
 * the ayahs practice already credited to the running cycle (`practiceCredited`
 * in the khatm blob, `lib/khatm-practice-credit.ts`). Every creditable ayah of
 * a session is offered to khatm, but only ayahs not yet in that record count
 * (`planKhatmCredit`); the daily reading log still counts them every day.
 */

/** An ayah counts when heard words ≥ HEARD_NUM / HEARD_DEN of its study words. */
export const CREDIT_HEARD_NUM = 2;
export const CREDIT_HEARD_DEN = 3;

/** True when `heard` of `total` study words is enough for the ayah to count. */
export function ayahHeardEnough(heard: number, total: number): boolean {
  if (!(total > 0) || !(heard > 0)) return false;
  return heard * CREDIT_HEARD_DEN >= total * CREDIT_HEARD_NUM;
}

/** Heard study words in one live-session ayah row (see the counting rule above). */
export function heardWordCount(a: AyahPracticeState): number {
  let heard = 0;
  a.states.forEach((state, i) => {
    if (state === "matched" || state === "corrected") heard += 1;
    else if (state === "confirmedMismatch") {
      const reason = a.reasons[i];
      if (reason === "wrong" || reason === "vowel") heard += 1;
    }
  });
  return heard;
}

/**
 * Ayahs of a live session that earn reading credit, ascending. Stored on the
 * summary as `heardAyahs` by `buildPracticeSummary`.
 */
export function creditableSessionAyahs(
  state: SessionState,
  visited: Iterable<number>,
  engineRan: boolean,
): number[] {
  if (!engineRan) return [];
  const out: number[] = [];
  for (const ayah of new Set(visited)) {
    const a = state.ayahs[ayah];
    if (!a?.alignment || a.takes === 0 || !a.reached) continue;
    if (ayahHeardEnough(heardWordCount(a), a.words.length)) out.push(ayah);
  }
  return out.sort((x, y) => x - y);
}

/** Ayahs of a pronunciation-check row that earn credit (from its stored word states). */
export function creditablePronunciationAyahs(summary: PracticeSummary): number[] {
  const words = summary.pronunciation?.words;
  if (!Array.isArray(words)) return [];
  const perAyah = new Map<number, { heard: number; total: number }>();
  for (const w of words) {
    if (!w || w.surah !== summary.surah) continue;
    const row = perAyah.get(w.ayah) ?? { heard: 0, total: 0 };
    row.total += 1;
    if (w.state === "clear" || w.state === "listen-again") row.heard += 1;
    perAyah.set(w.ayah, row);
  }
  return [...perAyah.entries()]
    .filter(([, c]) => ayahHeardEnough(c.heard, c.total))
    .map(([ayah]) => ayah)
    .sort((x, y) => x - y);
}

function inRange(summary: PracticeSummary, ayahs: readonly unknown[]): number[] {
  const out = new Set<number>();
  for (const a of ayahs) {
    if (typeof a !== "number" || !Number.isInteger(a)) continue;
    if (a < summary.ayahStart || a > summary.ayahEnd) continue;
    out.add(a);
  }
  return [...out].sort((x, y) => x - y);
}

/** Ayahs a finished session earns, from its stored row (live or pronunciation). */
export function creditableAyahs(summary: PracticeSummary): number[] {
  if (Array.isArray(summary.heardAyahs)) return inRange(summary, summary.heardAyahs);
  return inRange(summary, creditablePronunciationAyahs(summary));
}

/** 1…6236 position of `surah:ayah` in the mushaf; `null` when unknown. */
export function globalAyah(surah: number, ayah: number): number | null {
  const offset = GLOBAL_OFFSETS[surah];
  if (offset == null || !Number.isInteger(ayah) || ayah < 1) return null;
  const g = offset + ayah;
  return g <= QURAN_TOTAL_AYAHS ? g : null;
}

/** Local day (YYYY-MM-DD) a session ended on, or `null` for a bad timestamp. */
export function sessionDate(summary: PracticeSummary): string | null {
  const ended = new Date(summary.endedAt);
  return Number.isNaN(ended.getTime()) ? null : getLocalDateString(ended);
}

/** Global ayah numbers the day's earlier sessions already logged (other than `exceptId`). */
export function loggedAyahsOn(
  history: PracticeHistory,
  date: string,
  exceptId?: string,
): Set<number> {
  const out = new Set<number>();
  for (const item of history.items) {
    if (!item || item.id === exceptId || !Array.isArray(item.loggedAyahs)) continue;
    if (sessionDate(item) !== date) continue;
    for (const ayah of item.loggedAyahs) {
      const g = globalAyah(item.surah, ayah);
      if (g != null) out.add(g);
    }
  }
  return out;
}

export type ReadingCreditPlan = {
  sessionId: string;
  /** Local day the session ended on. */
  date: string;
  surah: number;
  /** Ayahs newly logged today by this session (ascending, inside the passage). */
  ayahs: number[];
  /**
   * Every creditable ayah of the session (ascending, inside the passage), offered
   * to a personal khatm — which skips the ones its cycle already counted (D72).
   */
  khatmAyahs: number[];
  /** Active practice time added to the day's log. */
  seconds: number;
};

/**
 * What a finished session adds to the reading log, or `null` when nothing:
 * setting off, already recorded (same id in `history`), a bad timestamp, or no
 * new ayah and less than {@link READING_MIN_ACTIVE_SECONDS} of practice.
 */
export function planReadingCredit(input: {
  summary: PracticeSummary;
  /** Practice history BEFORE this session is saved. */
  history: PracticeHistory;
  enabled: boolean;
}): ReadingCreditPlan | null {
  const { summary, history } = input;
  if (!input.enabled || !summary?.id) return null;
  if (history.items.some((item) => item?.id === summary.id)) return null;
  const date = sessionDate(summary);
  if (!date) return null;
  const before = loggedAyahsOn(history, date, summary.id);
  const khatmAyahs = creditableAyahs(summary).filter((a) => globalAyah(summary.surah, a) != null);
  const ayahs = khatmAyahs.filter((a) => !before.has(globalAyah(summary.surah, a) as number));
  const seconds = Math.max(0, Math.floor((summary.durationMs || 0) / 1000));
  if (khatmAyahs.length === 0 && seconds < READING_MIN_ACTIVE_SECONDS) return null;
  return { sessionId: summary.id, date, surah: summary.surah, ayahs, khatmAyahs, seconds };
}

/** Global [first, last] ayah numbers of each mushaf page (Madinah 604). */
let pageRanges: Array<{ page: number; first: number; last: number }> | null = null;
function getPageRanges(): Array<{ page: number; first: number; last: number }> {
  if (pageRanges) return pageRanges;
  const starts = getPageStarts()
    .map((s) => ({ page: s.page, first: globalAyah(s.surah, s.ayah) }))
    .filter((s): s is { page: number; first: number } => s.first != null)
    .sort((a, b) => a.first - b.first);
  pageRanges = starts.map((s, i) => ({
    page: s.page,
    first: s.first,
    last: (starts[i + 1]?.first ?? QURAN_TOTAL_AYAHS + 1) - 1,
  }));
  return pageRanges;
}

/** Index into {@link getPageRanges} of the page holding global ayah `g`, or -1. */
function pageIndexOf(g: number): number {
  const ranges = getPageRanges();
  let lo = 0;
  let hi = ranges.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const r = ranges[mid];
    if (g < r.first) hi = mid - 1;
    else if (g > r.last) lo = mid + 1;
    else return mid;
  }
  return -1;
}

/**
 * Mushaf pages a credit completes for a page-unit khatm (D72): pages touched by
 * the `fresh` global ayahs whose every ayah is now in `creditedAfter` (the cycle
 * record including `fresh`). A page counts once per cycle: an already-complete
 * page has no fresh ayah on it.
 */
export function pagesCompleted(fresh: readonly number[], creditedAfter: ReadonlySet<number>) {
  const ranges = getPageRanges();
  const touched = new Set<number>();
  for (const g of fresh) {
    const idx = pageIndexOf(g);
    if (idx >= 0) touched.add(idx);
  }
  let complete = 0;
  for (const idx of touched) {
    const r = ranges[idx];
    let full = true;
    for (let g = r.first; g <= r.last; g++) {
      if (!creditedAfter.has(g)) {
        full = false;
        break;
      }
    }
    if (full) complete += 1;
  }
  return complete;
}

/** What a session may add to a personal khatm cycle (D72). */
export type KhatmCreditPlan = {
  /** Global ayahs not yet credited to this cycle (ascending) — recorded as credited. */
  fresh: number[];
  /** Khatm units (ayahs, or pages completed) the fresh ayahs add. */
  units: number;
};

/**
 * D72: the khatm part of a credit. Only ayahs practice hasn't already credited
 * to the running cycle count; an ayah-unit plan adds one unit per fresh ayah, a
 * page-unit plan one unit per page whose every ayah is now credited.
 */
export function planKhatmCredit(input: {
  surah: number;
  ayahs: readonly number[];
  /** Global ayahs practice already credited to this cycle. */
  credited: ReadonlySet<number>;
  unit: "ayah" | "page";
}): KhatmCreditPlan {
  const fresh = new Set<number>();
  for (const a of input.ayahs) {
    const g = globalAyah(input.surah, a);
    if (g != null && !input.credited.has(g)) fresh.add(g);
  }
  const sorted = [...fresh].sort((x, y) => x - y);
  if (sorted.length === 0) return { fresh: [], units: 0 };
  if (input.unit === "ayah") return { fresh: sorted, units: sorted.length };
  const after = new Set(input.credited);
  for (const g of sorted) after.add(g);
  return { fresh: sorted, units: pagesCompleted(sorted, after) };
}

/** What the summary screen shows for the session that was just saved. */
export type ReadingCreditResult = {
  sessionId: string;
  /** Ayahs added to today's reading log (0 when only time was added). */
  ayahs: number;
  /** Set when a personal khatm plan moved forward. */
  khatm: {
    added: number;
    unit: "ayah" | "page";
    percent: number;
    /** D72: every heard ayah was already counted in this khatm cycle (`added` is 0). */
    alreadyCounted?: true;
  } | null;
};
