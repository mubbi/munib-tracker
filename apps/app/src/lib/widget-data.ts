import type { AppLocale, CalendarMode, TimeFormat } from "@munib-tracker/shared/types";

import { formatCalendarDate } from "./calendar-format";
import { locationCalcExtras, type StoredLocation } from "./location";
import { formatPrayerTime, nextPrayer, PRAYER_SLOT_ORDER } from "./prayer-times";

/**
 * Home-screen widget + Live Activity data (NF-1.18 / NF-1.19). Computed entirely
 * on-device from the `adhan` engine + stored location — no network. The native
 * WidgetKit / App Widget / ActivityKit targets read this precomputed JSON from
 * the shared app group (see `docs/NATIVE_SURFACES.md`); this module is the single
 * source of truth for what they show, so the widget and the in-app hero never
 * disagree.
 */
export interface WidgetPayload {
  /** Truncated location label. */
  location: string;
  /** Next prayer slot id (fajr…isha). */
  nextPrayerId: string;
  /** Localized next-prayer time string (respects the user's clock format). */
  nextPrayerTime: string;
  /** Exact next-prayer instant (epoch ms) for ActivityKit countdown. */
  nextPrayerAtMs: number;
  /** Whole minutes until the next prayer. */
  minutesUntil: number;
  /** Formatted date in the user's preferred calendar. */
  displayDate: string;
  /** Today's obligatory progress, e.g. "3/5" (optional). */
  progress?: string;
  /** ISO instant this payload was built. */
  updatedAt: string;
}

/**
 * Builds the widget payload for the given location + clock. `completedFard` (0–5)
 * is optional so the caller can include today's progress when available.
 */
export function buildWidgetPayload(
  location: StoredLocation,
  locale: AppLocale = "en",
  now: Date = new Date(),
  completedFard?: number,
  calendar: CalendarMode = "hijri",
  timeFormat: TimeFormat = "24",
): WidgetPayload {
  const next = nextPrayer(
    { latitude: location.latitude, longitude: location.longitude },
    now,
    location.method,
    location.madhab,
    location.timeZone,
    locationCalcExtras(location),
  );

  return {
    location: location.label,
    nextPrayerId: next.id,
    nextPrayerTime: formatPrayerTime(next.date, timeFormat, location.timeZone),
    nextPrayerAtMs: next.date.getTime(),
    minutesUntil: next.minutesUntil,
    displayDate: formatCalendarDate(now, calendar, locale, undefined, location.timeZone),
    progress:
      completedFard != null ? `${completedFard}/${PRAYER_SLOT_ORDER.length - 1}` : undefined,
    updatedAt: now.toISOString(),
  };
}
