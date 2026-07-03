import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from "adhan";
import type { SymbolViewProps } from "expo-symbols";

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

/** Formats a marker time for display (24-hour "HH:mm" by default). */
export function formatPrayerTime(date: Date, hour12 = false): string {
  return date.toLocaleTimeString([], {
    hour: hour12 ? "numeric" : "2-digit",
    minute: "2-digit",
    hour12,
  });
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
