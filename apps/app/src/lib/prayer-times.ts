import type { PrayerId, SunnahPrayer, TimeFormat } from "@munib-tracker/shared/types";
import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from "adhan";
import type { SymbolViewProps } from "expo-symbols";

import { formatDisplayTime } from "./time";

/**
 * On-device prayer-time calculation with the `adhan` library (already a
 * dependency, pure JS, offline). All six daily markers are derived from the
 * user's coordinates and the chosen calculation method + asr madhab.
 */

/** The six markers shown in the hero row, in chronological order. */
export type PrayerSlotId = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

/** Keys of `adhan`'s built-in calculation methods. */
export type CalculationMethodKey = keyof typeof CalculationMethod;

/** Asr shadow-length madhab. */
export type MadhabKey = "shafi" | "hanafi";

export interface Coords {
  latitude: number;
  longitude: number;
}

export interface PrayerSlot {
  id: PrayerSlotId;
  /** Absolute time for this marker on the requested day. */
  date: Date;
}

export interface NextPrayer {
  id: PrayerSlotId;
  date: Date;
  /** Whole minutes from `now` until this marker (never negative). */
  minutesUntil: number;
  /** Index of the next upcoming marker, or -1 when it is tomorrow's Fajr. */
  activeIndex: number;
  /**
   * Index (into `PRAYER_SLOT_ORDER`) of the marker whose window is currently
   * running — the latest one that has already begun. This is what the hero
   * highlights: a card stays lit from its own time until the next marker
   * arrives, rather than jumping ahead to the upcoming prayer. Before today's
   * Fajr it is Isha (the previous night's window is still in effect).
   */
  currentIndex: number;
}

export const PRAYER_SLOT_ORDER: PrayerSlotId[] = [
  "fajr",
  "sunrise",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];

/** SF Symbols / Material icons per marker (mirrors the tracker's iconography). */
export const PRAYER_SLOT_ICONS: Record<PrayerSlotId, SymbolViewProps["name"]> = {
  fajr: { ios: "sunrise.fill", android: "wb_twilight", web: "wb_twilight" },
  sunrise: { ios: "sun.horizon.fill", android: "wb_sunny", web: "wb_sunny" },
  dhuhr: { ios: "sun.max.fill", android: "light_mode", web: "light_mode" },
  asr: { ios: "cloud.sun.fill", android: "wb_cloudy", web: "wb_cloudy" },
  maghrib: { ios: "sunset.fill", android: "wb_twilight", web: "wb_twilight" },
  isha: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
};

export const DEFAULT_CALCULATION_METHOD: CalculationMethodKey = "MuslimWorldLeague";
export const DEFAULT_MADHAB: MadhabKey = "shafi";

function buildParameters(method: CalculationMethodKey, madhab: MadhabKey) {
  const factory = CalculationMethod[method] ?? CalculationMethod[DEFAULT_CALCULATION_METHOD];
  const params = factory();
  params.madhab = madhab === "hanafi" ? Madhab.Hanafi : Madhab.Shafi;
  return params;
}

/** Computes the raw `adhan` prayer times for a coordinate + day. */
export function computePrayerTimes(
  coords: Coords,
  date: Date,
  method: CalculationMethodKey = DEFAULT_CALCULATION_METHOD,
  madhab: MadhabKey = DEFAULT_MADHAB,
): PrayerTimes {
  return new PrayerTimes(
    new Coordinates(coords.latitude, coords.longitude),
    date,
    buildParameters(method, madhab),
  );
}

/** The six ordered markers for the given day. */
export function prayerSlots(times: PrayerTimes): PrayerSlot[] {
  return [
    { id: "fajr", date: times.fajr },
    { id: "sunrise", date: times.sunrise },
    { id: "dhuhr", date: times.dhuhr },
    { id: "asr", date: times.asr },
    { id: "maghrib", date: times.maghrib },
    { id: "isha", date: times.isha },
  ];
}

/**
 * The next upcoming marker relative to `now`. After Isha it rolls over to
 * tomorrow's Fajr (so the countdown keeps working through the night).
 */
export function nextPrayer(
  coords: Coords,
  now: Date,
  method: CalculationMethodKey = DEFAULT_CALCULATION_METHOD,
  madhab: MadhabKey = DEFAULT_MADHAB,
): NextPrayer {
  const today = computePrayerTimes(coords, now, method, madhab);
  const upcoming = today.nextPrayer(now);

  // The currently running window: the latest marker that has already begun.
  // Slots are chronological, so the last one at or before `now` wins; before Fajr
  // nothing today has started yet, so the previous night's Isha is still active.
  const slots = prayerSlots(today);
  let currentIndex = PRAYER_SLOT_ORDER.length - 1;
  for (let i = 0; i < slots.length; i += 1) {
    if (slots[i].date.getTime() <= now.getTime()) currentIndex = i;
    else break;
  }

  let id: PrayerSlotId;
  let date: Date;
  let activeIndex: number;

  if (upcoming === "none") {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const next = computePrayerTimes(coords, tomorrow, method, madhab);
    id = "fajr";
    date = next.fajr;
    activeIndex = -1;
  } else {
    id = upcoming;
    date = today.timeForPrayer(upcoming) ?? today.fajr;
    activeIndex = PRAYER_SLOT_ORDER.indexOf(id);
  }

  const minutesUntil = Math.max(0, Math.round((date.getTime() - now.getTime()) / 60000));
  return { id, date, minutesUntil, activeIndex, currentIndex };
}

/** Formats a marker time for display using the user's clock preference. */
export function formatPrayerTime(date: Date, timeFormat: TimeFormat = "24"): string {
  return formatDisplayTime(date, timeFormat);
}

/**
 * Compact human duration for a whole-minute count, e.g. 27 → "27m", 95 → "1h 35m".
 * Used for the "next prayer in {{time}}" countdown line and the schedule card.
 */
export function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  const hrs = Math.floor(total / 60);
  const mins = total % 60;
  if (hrs <= 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

/**
 * Fraction (0..1) of the current prayer window that has already elapsed, given
 * the start of the running window and the next marker. Clamped so it stays a
 * valid progress value even at the exact boundaries.
 */
export function windowProgress(windowStart: Date, windowEnd: Date, now: Date): number {
  const total = windowEnd.getTime() - windowStart.getTime();
  if (total <= 0) return 0;
  const elapsed = now.getTime() - windowStart.getTime();
  return Math.min(1, Math.max(0, elapsed / total));
}

/** Minutes after sunrise when Ishraq begins (sun at a spear's length). */
export const ISHRAQ_AFTER_SUNRISE_MINUTES = 20;
/** Minutes before Dhuhr when the Duha window closes. */
export const DUHA_END_BEFORE_ZUHR_MINUTES = 15;
/** Minutes after Isha when Witr is commonly prayed. */
export const WITR_AFTER_ISHA_MINUTES = 20;

export type ScheduleKind = "obligatory" | "optional" | "marker";

export type DailyScheduleEntryId = PrayerSlotId | SunnahPrayer | "witr";

export interface DailyScheduleEntry {
  id: DailyScheduleEntryId;
  kind: ScheduleKind;
  /** Absolute instant shown in the schedule; absent for flexible prayers. */
  at?: Date;
  /** Whether this entry's window is currently running. */
  active: boolean;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

/** Last third of the night — the preferred Tahajjud window. */
export function lastThirdOfNight(maghrib: Date, fajr: Date): Date {
  const nightMs = fajr.getTime() - maghrib.getTime();
  return new Date(fajr.getTime() - nightMs / 3);
}

export function ishraqTime(sunrise: Date): Date {
  return addMinutes(sunrise, ISHRAQ_AFTER_SUNRISE_MINUTES);
}

export function duhaWindow(
  sunrise: Date,
  dhuhr: Date,
): { start: Date; end: Date; recommended: Date } {
  const start = ishraqTime(sunrise);
  const end = addMinutes(dhuhr, -DUHA_END_BEFORE_ZUHR_MINUTES);
  const midpoint = start.getTime() + (end.getTime() - start.getTime()) / 2;
  return { start, end, recommended: new Date(midpoint) };
}

export function witrTime(isha: Date): Date {
  return addMinutes(isha, WITR_AFTER_ISHA_MINUTES);
}

/** Upcoming Tahajjud marker: pre-dawn tonight or the one before tomorrow's Fajr. */
export function tahajjudTime(
  now: Date,
  today: PrayerTimes,
  tomorrowFajr: Date,
  yesterdayMaghrib: Date,
): Date {
  if (now.getTime() < today.fajr.getTime()) {
    return lastThirdOfNight(yesterdayMaghrib, today.fajr);
  }
  return lastThirdOfNight(today.maghrib, tomorrowFajr);
}

export interface PrayerTimeMap {
  [key: string]: string | undefined;
}

/** Computed HH:mm (or flexible label key) for every tracked prayer on a day. */
export function buildPrayerTimeMap(
  coords: Coords,
  now: Date,
  method: CalculationMethodKey = DEFAULT_CALCULATION_METHOD,
  madhab: MadhabKey = DEFAULT_MADHAB,
  flexibleLabel = "Any time",
  timeFormat: TimeFormat = "24",
): Record<PrayerId, string> {
  const today = computePrayerTimes(coords, now, method, madhab);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowTimes = computePrayerTimes(coords, tomorrow, method, madhab);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayTimes = computePrayerTimes(coords, yesterday, method, madhab);

  const duha = duhaWindow(today.sunrise, today.dhuhr);

  return {
    fajr: formatPrayerTime(today.fajr, timeFormat),
    dhuhr: formatPrayerTime(today.dhuhr, timeFormat),
    asr: formatPrayerTime(today.asr, timeFormat),
    maghrib: formatPrayerTime(today.maghrib, timeFormat),
    isha: formatPrayerTime(today.isha, timeFormat),
    witr: formatPrayerTime(witrTime(today.isha), timeFormat),
    tahajjud: formatPrayerTime(
      tahajjudTime(now, today, tomorrowTimes.fajr, yesterdayTimes.maghrib),
      timeFormat,
    ),
    ishraq: formatPrayerTime(ishraqTime(today.sunrise), timeFormat),
    duha: formatPrayerTime(duha.recommended, timeFormat),
    tahiyyatul_masjid: flexibleLabel,
    hajat_istikhara: flexibleLabel,
  };
}

/**
 * Full chronological schedule for the home card: obligatory markers, sunnah
 * prayers with computed times, and flexible optional prayers at the end.
 */
export function buildDailySchedule(
  coords: Coords,
  now: Date,
  method: CalculationMethodKey = DEFAULT_CALCULATION_METHOD,
  madhab: MadhabKey = DEFAULT_MADHAB,
): DailyScheduleEntry[] {
  const today = computePrayerTimes(coords, now, method, madhab);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowTimes = computePrayerTimes(coords, tomorrow, method, madhab);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayTimes = computePrayerTimes(coords, yesterday, method, madhab);

  const tahajjudAt = tahajjudTime(now, today, tomorrowTimes.fajr, yesterdayTimes.maghrib);
  const ishraqAt = ishraqTime(today.sunrise);
  const duha = duhaWindow(today.sunrise, today.dhuhr);
  const witrAt = witrTime(today.isha);
  const fajrEnd = today.fajr.getTime();
  const duhaEnd = duha.end.getTime();
  const witrEnd = tomorrowTimes.fajr.getTime();
  const nowMs = now.getTime();

  const entries: DailyScheduleEntry[] = [
    {
      id: "tahajjud",
      kind: "optional",
      at: tahajjudAt,
      active: nowMs >= tahajjudAt.getTime() && nowMs < fajrEnd,
    },
    { id: "fajr", kind: "obligatory", at: today.fajr, active: false },
    { id: "sunrise", kind: "marker", at: today.sunrise, active: false },
    {
      id: "ishraq",
      kind: "optional",
      at: ishraqAt,
      active: nowMs >= ishraqAt.getTime() && nowMs < duhaEnd,
    },
    {
      id: "duha",
      kind: "optional",
      at: duha.recommended,
      active: nowMs >= duha.start.getTime() && nowMs < duhaEnd,
    },
    { id: "dhuhr", kind: "obligatory", at: today.dhuhr, active: false },
    { id: "asr", kind: "obligatory", at: today.asr, active: false },
    { id: "maghrib", kind: "obligatory", at: today.maghrib, active: false },
    { id: "isha", kind: "obligatory", at: today.isha, active: false },
    {
      id: "witr",
      kind: "obligatory",
      at: witrAt,
      active: nowMs >= witrAt.getTime() && nowMs < witrEnd,
    },
    { id: "tahiyyatul_masjid", kind: "optional", active: false },
    { id: "hajat_istikhara", kind: "optional", active: false },
  ];

  // Highlight the obligatory/marker window that is currently running.
  const next = nextPrayer(coords, now, method, madhab);
  const slotActive = new Set<PrayerSlotId>();
  if (next.currentIndex >= 0) slotActive.add(PRAYER_SLOT_ORDER[next.currentIndex]);

  return entries.map((entry) => {
    if (entry.id === "witr") {
      return { ...entry, active: nowMs >= witrAt.getTime() && nowMs < witrEnd };
    }
    if (entry.kind === "optional" && entry.at) return entry;
    if (entry.kind === "obligatory" || entry.kind === "marker") {
      const slotId = entry.id as PrayerSlotId;
      if (PRAYER_SLOT_ORDER.includes(slotId)) {
        return { ...entry, active: slotActive.has(slotId) };
      }
    }
    return entry;
  });
}

/**
 * The next timed schedule entry after `now` — earliest future instant, not
 * first in display order (Tahajjud is listed first but may be hours away).
 */
export function nextScheduleEntry(
  schedule: DailyScheduleEntry[],
  now: Date,
): DailyScheduleEntry | undefined {
  const nowMs = now.getTime();
  let next: DailyScheduleEntry | undefined;
  let nextAt = Number.POSITIVE_INFINITY;

  for (const entry of schedule) {
    if (!entry.at) continue;
    const atMs = entry.at.getTime();
    if (atMs <= nowMs) continue;
    if (atMs < nextAt) {
      next = entry;
      nextAt = atMs;
    }
  }

  return next;
}

/** Absolute fire time for a schedulable prayer reminder. */
export function prayerReminderTime(
  prayerId: PrayerId,
  times: PrayerTimes,
  tomorrowFajr: Date,
  yesterdayMaghrib: Date,
  now: Date,
): Date | null {
  switch (prayerId) {
    case "fajr":
      return times.fajr;
    case "dhuhr":
      return times.dhuhr;
    case "asr":
      return times.asr;
    case "maghrib":
      return times.maghrib;
    case "isha":
      return times.isha;
    case "witr":
      return witrTime(times.isha);
    case "tahajjud":
      return tahajjudTime(now, times, tomorrowFajr, yesterdayMaghrib);
    case "ishraq":
      return ishraqTime(times.sunrise);
    case "duha":
      return duhaWindow(times.sunrise, times.dhuhr).recommended;
    case "tahiyyatul_masjid":
    case "hajat_istikhara":
      return null;
    default:
      return null;
  }
}
