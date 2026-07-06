import type { AppLocale } from "@munib-tracker/shared/types";
import type { PrayerTimes } from "adhan";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { PrayerTime } from "@/components/prayer-times-hero";
import { useNow } from "@/hooks/use-now";
import { formatCalendarDate } from "@/lib/calendar-format";
import { locationCalcExtras } from "@/lib/location";
import { moonPhase } from "@/lib/moon";
import {
  buildDailySchedule,
  computePrayerTimes,
  duhaWindow,
  formatDuration,
  formatPrayerTime,
  ishraqWindow,
  nextPrayer,
  nextScheduleEntry,
  PRAYER_SLOT_ICONS,
  prayerSlots,
  type ScheduleKind,
  tahajjudTime,
  windowProgress,
  witrTime,
} from "@/lib/prayer-times";
import { type ScheduleEntryStatus, scheduleEntryStatus } from "@/lib/schedule-ui";
import { type SkyMarkers, type SkyPalette, skyPalette, skyPhaseForTime } from "@/lib/sky";
import { dayKeyInTimeZone, prayerDayAnchor, shiftPrayerDay } from "@/lib/time";
import { useLocation, useLocationStatus } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";

export interface HomeHeroData {
  location: string;
  displayDate: string;
  currentTime: string;
  countdown: string;
  prayers: PrayerTime[];
  /** Index of the prayer whose window is currently running (the highlighted card). */
  activeIndex: number;
  /** Live clock, used to draw the current moon phase. */
  now: Date;
  /** Time-of-day palette for the hero background. */
  sky: SkyPalette;
  /** Localized accessibility label for the moon phase glyph. */
  moonLabel: string;
  /** Mirror moon lit side for observers south of the equator. */
  southernHemisphere: boolean;
  /** Fraction (0..1) of the current prayer window that has elapsed. */
  windowProgress: number;
  /** Pre-localized "in {{time}}" until the next marker, e.g. "in 27m". */
  nextIn: string;
  /** Schedule entry id of the next upcoming timed marker. */
  nextScheduleId: string | null;
  /** Full daily schedule with obligatory, optional, and marker entries. */
  schedule: ScheduleItem[];
}

export interface ScheduleItem {
  id: string;
  name: string;
  time: string;
  kind: ScheduleKind;
  /** Whether this marker's window is the one currently running. */
  active: boolean;
  /** Visual state for timeline styling. */
  status: ScheduleEntryStatus;
  /** Epoch ms for timed entries; null for flexible markers. */
  atMs: number | null;
}

/**
 * Every boundary instant on the current day at which the "next prayer" and the
 * schedule's active-window flags can flip: the six markers plus each sunnah
 * window's start/end edge. Counting how many of these lie at or before `now`
 * yields a key that changes only when the clock actually crosses a boundary —
 * so the adhan-heavy derivations below re-run a handful of times a day rather
 * than on every one-minute tick.
 */
function scheduleBoundaries(
  today: PrayerTimes,
  tomorrow: PrayerTimes,
  yesterday: PrayerTimes,
  now: Date,
): number[] {
  const slots = prayerSlots(today);
  const ishraq = ishraqWindow(today.sunrise, today.dhuhr);
  const duha = duhaWindow(today.sunrise, today.dhuhr);
  const tahajjud = tahajjudTime(now, today, tomorrow.fajr, yesterday.maghrib);
  const boundaries = slots.map((slot) => slot.date.getTime());
  boundaries.push(
    tahajjud.getTime(),
    ishraq.start.getTime(),
    ishraq.end.getTime(),
    duha.start.getTime(),
    duha.end.getTime(),
    witrTime(today.isha).getTime(),
    tomorrow.fajr.getTime(),
  );
  return boundaries;
}

/** Local calendar-day key for prayer-time recomputation. Uses the selected city's timezone when set. */
function dayKeyOf(date: Date, timeZone?: string): string {
  return dayKeyInTimeZone(date, timeZone);
}

/**
 * Derives everything the prayer-times hero renders from the stored location and
 * the live clock. Prayer times are computed on-device via `adhan`; the Hijri
 * date and countdown update as the clock ticks.
 *
 * The heavy adhan computations (the day's `PrayerTimes` objects and the derived
 * schedule/next-prayer selection) are split from the minute-scoped values: the
 * former recompute only when the calendar day, the location, or a prayer-window
 * boundary changes, while the clock, countdown, and sky palette recompute each
 * tick. This keeps the once-a-minute `useNow` tick from rebuilding ~8 adhan
 * `PrayerTimes` objects it doesn't need.
 */
export function useHomeHero(): HomeHeroData {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const status = useLocationStatus();
  const now = useNow();
  const timeFormat = usePreferences().timeFormat;
  const defaultCalendar = usePreferences().defaultCalendar;

  const base = i18n.language?.split("-")[0];
  const locale: AppLocale = base === "ar" || base === "ur" ? base : "en";

  const dayKey = dayKeyOf(now, location.timeZone);

  // Day-scoped adhan objects: stable for the whole local calendar day at a given
  // location. Recomputing these is the expensive part, so they are memoized here
  // and everything below reuses them.
  // biome-ignore lint/correctness/useExhaustiveDependencies: dayKey is the calendar-day proxy for `now`; recompute only when the day (or location) changes, not every tick.
  const day = useMemo(() => {
    const coords = { latitude: location.latitude, longitude: location.longitude };
    const extras = locationCalcExtras(location);
    const anchor = prayerDayAnchor(now, location.timeZone);
    const today = computePrayerTimes(coords, anchor, location.method, location.madhab, extras);
    const tomorrowTimes = computePrayerTimes(
      coords,
      shiftPrayerDay(anchor, 1),
      location.method,
      location.madhab,
      extras,
    );
    const yesterdayTimes = computePrayerTimes(
      coords,
      shiftPrayerDay(anchor, -1),
      location.method,
      location.madhab,
      extras,
    );
    const slots = prayerSlots(today);
    const boundaries = scheduleBoundaries(today, tomorrowTimes, yesterdayTimes, now);
    // Sky-phase markers are day-stable; build them once so the per-tick palette
    // lookup below is a cheap `skyPhaseForTime(now, markers)` call.
    const markers = Object.fromEntries(slots.map((s) => [s.id, s.date])) as unknown as SkyMarkers;
    return { coords, today, slots, boundaries, markers };
  }, [location, dayKey]);

  // Prayer-row display times are day-stable (the formatted marker strings don't
  // change within a day), so they are keyed on the day + formatting inputs only.
  const prayers = useMemo<PrayerTime[]>(() => {
    const tz = location.timeZone;
    return day.slots.map((slot) => ({
      name: t(`prayers.${slot.id}`),
      time: formatPrayerTime(slot.date, timeFormat, tz),
      icon: PRAYER_SLOT_ICONS[slot.id],
    }));
  }, [day, timeFormat, location.timeZone, t]);

  // How many boundary instants have already passed. Changes only when the clock
  // crosses a prayer/window edge — the sole trigger for re-selecting the next
  // prayer and rebuilding the schedule.
  const crossingKey = day.boundaries.reduce((n, at) => (at <= now.getTime() ? n + 1 : n), 0);

  // Selection layer: which prayer is next and the schedule's active windows.
  // Recomputed only on a boundary crossing (or day/location/formatting change),
  // never on a plain minute tick.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `crossingKey` gates the boundary-sensitive parts; `now` is intentionally excluded so this doesn't re-run every tick.
  const selection = useMemo(() => {
    const { coords } = day;
    const tz = location.timeZone;
    const flexibleTime = t("home.scheduleAnyTime");
    const extras = locationCalcExtras(location);
    const next = nextPrayer(
      coords,
      now,
      location.method,
      location.madhab,
      location.timeZone,
      extras,
    );
    const rawSchedule = buildDailySchedule(
      coords,
      now,
      location.method,
      location.madhab,
      location.timeZone,
      extras,
    );
    const nextEntry = nextScheduleEntry(rawSchedule, now);

    const schedule: ScheduleItem[] = rawSchedule.map((entry) => ({
      id: entry.id,
      name: t(`prayers.${entry.id}`),
      time: entry.at ? formatPrayerTime(entry.at, timeFormat, tz) : flexibleTime,
      kind: entry.kind,
      active: entry.active,
      status: scheduleEntryStatus(entry.kind, entry.active, entry.at, now),
      atMs: entry.at?.getTime() ?? null,
    }));

    return {
      next,
      schedule,
      nextScheduleId: nextEntry?.id ?? null,
      nextEntryAt: nextEntry?.at ?? null,
      windowStart: day.slots[next.currentIndex]?.date ?? now,
    };
  }, [day, crossingKey, location.method, location.madhab, location.timeZone, timeFormat, t]);

  // Minute-scoped layer: the clock, countdown, live progress, and sky/moon. These
  // are cheap scalars derived from the memoized selection + day objects each tick.
  return useMemo(() => {
    const { next, windowStart, nextEntryAt } = selection;
    const tz = location.timeZone;

    const progress = windowProgress(windowStart, next.date, now);
    // `minutesUntil` is recomputed live from the memoized `next.date` so the
    // countdown ticks every minute without re-running the adhan selection.
    const minutesUntil = Math.max(0, Math.round((next.date.getTime() - now.getTime()) / 60000));
    const scheduleMinutesUntil = nextEntryAt
      ? Math.max(0, Math.round((nextEntryAt.getTime() - now.getTime()) / 60000))
      : minutesUntil;
    const nextIn = t("hero.nextIn", { time: formatDuration(scheduleMinutesUntil) });

    const sky = skyPalette(skyPhaseForTime(now, day.markers));
    const moon = moonPhase(now);
    const moonLabel = t("moon.aria", { phase: t(`moon.${moon.name}`) });

    const prayerName = t(`prayers.${next.id}`);
    const countdown =
      status === "loading" && location.updatedAt == null
        ? t("hero.locating")
        : minutesUntil >= 60
          ? t("hero.nextPrayerAwayHours", {
              prayer: prayerName,
              hours: Math.floor(minutesUntil / 60),
              min: minutesUntil % 60,
            })
          : t("hero.nextPrayerAway", { prayer: prayerName, min: minutesUntil });

    return {
      location: location.label,
      displayDate: formatCalendarDate(now, defaultCalendar, locale, undefined, location.timeZone),
      currentTime: formatPrayerTime(now, timeFormat, tz),
      countdown,
      prayers,
      activeIndex: next.currentIndex,
      now,
      sky,
      moonLabel,
      southernHemisphere: location.latitude < 0,
      windowProgress: progress,
      nextIn,
      nextScheduleId: selection.nextScheduleId,
      schedule: selection.schedule,
    };
  }, [day, selection, prayers, now, locale, timeFormat, defaultCalendar, location, status, t]);
}
