/**
 * Aggregate-only Qur'an practice stats for the ops console.
 *
 * Inputs are the synced blobs (`sync_records.data`, stored as `{ "value": … }`)
 * for signed-in users — guests never sync. Outputs are counts and shares only:
 * no user ids, no per-user rows, no ayah text. Malformed or newer-schema blobs
 * are skipped, never thrown on, so one odd client cannot break the page.
 *
 * Shapes mirror `apps/app/src/lib/quran-companion/types.ts` (schemaVersion 1).
 */

export const PRACTICE_ENTITIES = {
  prefs: "quran_companion_prefs",
  sessions: "quran_practice_sessions",
  memorization: "quran_memorization",
} as const;

export type Count = { label: string; value: number };

export type PracticeSessionStats = {
  /** Signed-in users with at least one stored session summary. */
  users: number;
  /** Stored summaries (each user keeps their newest 30). */
  stored: number;
  last7Days: number;
  last30Days: number;
  /** Sessions per day, oldest first, for the last 14 days (local to the server). */
  dailyLast14: number[];
  /** Median session length in seconds, last 30 days. */
  medianDurationSec: number | null;
  /** Mean ayahs per session, last 30 days. */
  meanAyahs: number | null;
  modes: Count[];
  engines: Count[];
  /** Top surahs by session count, last 30 days. */
  topSurahs: Count[];
  listener: {
    /** Sessions with a listener (engine ≠ "none"), last 30 days. */
    sessions: number;
    /** Sessions where the listener heard no words at all. */
    nothingHeard: number;
    /** Word shares across those sessions (0–1). */
    heardShare: number | null;
    notSureShare: number | null;
    tryAgainShare: number | null;
    notReachedShare: number | null;
  };
};

export type PracticePrefsStats = {
  users: number;
  defaultModes: Count[];
  engineChoices: Count[];
  feedbackTiming: Count[];
  dailyLimits: Count[];
  hearBeforeRecite: Count[];
  revisionReminderOn: number;
  wifiOnlyOn: number;
  autoAdvanceOn: number;
  pronunciationConsented: number;
};

const MODE_LABEL: Record<string, string> = {
  follow: "Follow",
  check: "Check",
  "hide-words": "Hide words",
  "hide-ayahs": "Hide ayahs",
  revision: "Revision",
};
const ENGINE_LABEL: Record<string, string> = {
  "tilawa-zipformer": "Recommended (Zipformer)",
  "tilawa-fastconformer": "Alternate (FastConformer)",
  none: "Listen only (no listener)",
};
const TIMING_LABEL: Record<string, string> = {
  ayah: "After each ayah",
  live: "While reciting",
  end: "At the end",
};
const HEAR_LABEL: Record<string, string> = {
  off: "Off",
  once: "Once",
  "every-ayah": "Every ayah",
};

const DAY_MS = 86_400_000;

/** `{ value }` wrapper → the blob, or null. Accepts a parsed object or a JSON string. */
export function unwrapBlob(data: unknown): Record<string, unknown> | null {
  let parsed = data;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return null;
    }
  }
  if (!parsed || typeof parsed !== "object") return null;
  const value = (parsed as { value?: unknown }).value;
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const version = (value as { schemaVersion?: unknown }).schemaVersion;
  if (typeof version === "number" && version > 1) return null;
  return value as Record<string, unknown>;
}

function num(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : 0;
}

function tally(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function toCounts(map: Map<string, number>, labels?: Record<string, string>): Count[] {
  return [...map.entries()]
    .map(([key, value]) => ({ label: labels?.[key] ?? key, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function share(part: number, whole: number): number | null {
  return whole > 0 ? part / whole : null;
}

type SessionItem = {
  id: string;
  mode: string;
  surah: number;
  ayahStart: number;
  ayahEnd: number;
  endedAt: number;
  durationMs: number;
  engine: string;
  matched: number;
  corrected: number;
  uncertain: number;
  confirmedMismatch: number;
  notReached: number;
};

function readSessions(blob: Record<string, unknown>): SessionItem[] {
  const items = Array.isArray(blob.items) ? blob.items : [];
  const clearedAt = typeof blob.clearedAt === "string" ? Date.parse(blob.clearedAt) : Number.NaN;
  const out: SessionItem[] = [];
  for (const raw of items) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const endedAt = typeof r.endedAt === "string" ? Date.parse(r.endedAt) : Number.NaN;
    const surah = num(r.surah);
    if (!Number.isFinite(endedAt) || surah < 1 || surah > 114) continue;
    if (Number.isFinite(clearedAt) && endedAt <= clearedAt) continue;
    out.push({
      id: typeof r.id === "string" ? r.id : "",
      mode: typeof r.mode === "string" ? r.mode : "unknown",
      surah,
      ayahStart: num(r.ayahStart),
      ayahEnd: num(r.ayahEnd),
      endedAt,
      durationMs: num(r.durationMs),
      engine: typeof r.engine === "string" ? r.engine : "unknown",
      matched: num(r.matched),
      corrected: num(r.corrected),
      uncertain: num(r.uncertain),
      confirmedMismatch: num(r.confirmedMismatch),
      notReached: num(r.notReached),
    });
  }
  return out;
}

/** Session stats from every user's `quran_practice_sessions` blob. */
export function summarizeSessions(blobs: unknown[], now: Date): PracticeSessionStats {
  const nowMs = now.getTime();
  const since7 = nowMs - 7 * DAY_MS;
  const since30 = nowMs - 30 * DAY_MS;
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const dayZero = startOfToday.getTime() - 13 * DAY_MS;

  let users = 0;
  let stored = 0;
  let last7 = 0;
  let last30 = 0;
  const daily = new Array<number>(14).fill(0);
  const durations: number[] = [];
  let ayahTotal = 0;
  const modes = new Map<string, number>();
  const engines = new Map<string, number>();
  const surahs = new Map<string, number>();
  let listenerSessions = 0;
  let nothingHeard = 0;
  let heard = 0;
  let notSure = 0;
  let tryAgain = 0;
  let notReached = 0;

  for (const data of blobs) {
    const blob = unwrapBlob(data);
    if (!blob) continue;
    const items = readSessions(blob);
    if (!items.length) continue;
    users++;
    stored += items.length;
    for (const s of items) {
      if (s.endedAt > nowMs) continue;
      if (s.endedAt >= since7) last7++;
      if (s.endedAt >= dayZero) {
        const day = Math.floor((s.endedAt - dayZero) / DAY_MS);
        if (day >= 0 && day < 14) daily[day]++;
      }
      if (s.endedAt < since30) continue;
      last30++;
      durations.push(s.durationMs / 1000);
      ayahTotal += Math.max(1, s.ayahEnd - s.ayahStart + 1);
      tally(modes, s.mode);
      tally(engines, s.engine);
      tally(surahs, `Surah ${s.surah}`);
      if (s.engine !== "none") {
        listenerSessions++;
        const h = s.matched + s.corrected;
        if (h + s.uncertain + s.confirmedMismatch === 0) nothingHeard++;
        heard += h;
        notSure += s.uncertain;
        tryAgain += s.confirmedMismatch;
        notReached += s.notReached;
      }
    }
  }

  const words = heard + notSure + tryAgain + notReached;
  return {
    users,
    stored,
    last7Days: last7,
    last30Days: last30,
    dailyLast14: daily,
    medianDurationSec: median(durations),
    meanAyahs: last30 ? ayahTotal / last30 : null,
    modes: toCounts(modes, MODE_LABEL),
    engines: toCounts(engines, ENGINE_LABEL),
    topSurahs: toCounts(surahs).slice(0, 10),
    listener: {
      sessions: listenerSessions,
      nothingHeard,
      heardShare: share(heard, words),
      notSureShare: share(notSure, words),
      tryAgainShare: share(tryAgain, words),
      notReachedShare: share(notReached, words),
    },
  };
}

/** Preference mix from every user's `quran_companion_prefs` blob. */
export function summarizePrefs(blobs: unknown[]): PracticePrefsStats {
  let users = 0;
  const defaultModes = new Map<string, number>();
  const engineChoices = new Map<string, number>();
  const feedbackTiming = new Map<string, number>();
  const dailyLimits = new Map<string, number>();
  const hearBeforeRecite = new Map<string, number>();
  let revisionReminderOn = 0;
  let wifiOnlyOn = 0;
  let autoAdvanceOn = 0;
  let pronunciationConsented = 0;

  for (const data of blobs) {
    const p = unwrapBlob(data);
    if (!p) continue;
    users++;
    if (typeof p.defaultMode === "string") tally(defaultModes, p.defaultMode);
    if (typeof p.engineChoice === "string") tally(engineChoices, p.engineChoice);
    if (typeof p.feedbackTiming === "string") tally(feedbackTiming, p.feedbackTiming);
    if (typeof p.dailyRevisionLimit === "number") {
      tally(dailyLimits, `${p.dailyRevisionLimit} a day`);
    }
    if (typeof p.hearBeforeRecite === "string") tally(hearBeforeRecite, p.hearBeforeRecite);
    if (p.revisionReminder === true) revisionReminderOn++;
    if (p.wifiOnlyDownload !== false) wifiOnlyOn++;
    if (p.autoAdvance !== false) autoAdvanceOn++;
    if (typeof p.pronunciationConsentAt === "string") pronunciationConsented++;
  }

  return {
    users,
    defaultModes: toCounts(defaultModes, MODE_LABEL),
    engineChoices: toCounts(engineChoices, ENGINE_LABEL),
    feedbackTiming: toCounts(feedbackTiming, TIMING_LABEL),
    dailyLimits: toCounts(dailyLimits),
    hearBeforeRecite: toCounts(hearBeforeRecite, HEAR_LABEL),
    revisionReminderOn,
    wifiOnlyOn,
    autoAdvanceOn,
    pronunciationConsented,
  };
}

/** Format a 0–1 share as a whole percent, or an em dash when there is no data. */
export function formatShare(value: number | null): string {
  return value == null ? "—" : `${Math.round(value * 100)}%`;
}
