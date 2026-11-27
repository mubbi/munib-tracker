import type { AchievementStats } from "../achievements/types";
import type { AyahNote, PrayerLog, VoluntaryFastEntry } from "../types/index";

/**
 * Builds a {@link PrayerLog} for tests with sensible defaults. Pass `overrides`
 * to tweak any field (e.g. `source`, `notes`, `updatedAt`) without restating the
 * whole shape. Keeps prayer-log fixtures consistent across the utils test suites.
 */
export function makePrayerLog(
  date: string,
  prayerId: PrayerLog["prayerId"],
  status: PrayerLog["status"],
  overrides: Partial<PrayerLog> = {},
): PrayerLog {
  return {
    id: `${date}-${prayerId}`,
    prayerId,
    date,
    status,
    updatedAt: `${date}T00:00:00.000Z`,
    source: "manual",
    ...overrides,
  };
}

/** Builds zeroed {@link AchievementStats} (no qaza/roza debt tracked) with optional overrides. */
export function makeAchievementStats(overrides: Partial<AchievementStats> = {}): AchievementStats {
  return {
    streak: 0,
    prayersCompleted: 0,
    zikrCompleted: 0,
    perfectDays: 0,
    qazaDebt: null,
    rozaDebt: null,
    ...overrides,
    bestStreak: Math.max(overrides.bestStreak ?? 0, overrides.streak ?? 0),
  };
}

/** Builds a live {@link AyahNote} (2:255, empty body) for the quran-notes suites. */
export function makeAyahNote(id: string, overrides: Partial<AyahNote> = {}): AyahNote {
  return {
    id,
    surah: 2,
    ayah: 255,
    body: "",
    tags: [],
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
    ...overrides,
  };
}

/** Builds a voluntary-fast log entry (NF-3.2) for tests. */
export function makeFastEntry(
  status: VoluntaryFastEntry["status"] = "fasted",
  overrides: Partial<VoluntaryFastEntry> = {},
): VoluntaryFastEntry {
  return { status, updatedAt: "2026-01-01T00:00:00.000Z", ...overrides };
}

/**
 * Deterministic Hijri calendar for pure tests: `anchor` (YYYY-MM-DD) is 1
 * Muharram of `year`, and every year repeats `monthLengths` (12 entries of
 * 29/30). Returns a `toHijri(dateKey)` usable as an injected Hijri engine.
 */
export function makeHijriCalendar(
  anchor: string,
  year: number,
  monthLengths: readonly number[],
): (dateKey: string) => { year: number; month: number; day: number } {
  const yearLength = monthLengths.reduce((sum, n) => sum + n, 0);
  const dayMs = 24 * 60 * 60 * 1000;
  const toUtc = (key: string) => {
    const [y, m, d] = key.split("-").map(Number) as [number, number, number];
    return Date.UTC(y, m - 1, d);
  };
  const anchorMs = toUtc(anchor);
  return (dateKey) => {
    let offset = Math.round((toUtc(dateKey) - anchorMs) / dayMs);
    let hYear = year;
    while (offset < 0) {
      offset += yearLength;
      hYear -= 1;
    }
    while (offset >= yearLength) {
      offset -= yearLength;
      hYear += 1;
    }
    let month = 1;
    for (const length of monthLengths) {
      if (offset < length) break;
      offset -= length;
      month += 1;
    }
    return { year: hYear, month, day: offset + 1 };
  };
}
