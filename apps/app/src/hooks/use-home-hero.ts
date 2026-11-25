import type { AppLocale } from "@munib-tracker/shared/types";
import type { PrayerTimes } from "adhan";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { PrayerTime } from "@/components/prayer-times-hero";
import { useMadhhab } from "@/hooks/use-madhhab";
import { useNow } from "@/hooks/use-now";
import { type DualCalendarDates, formatDualCalendarDate } from "@/lib/calendar-format";
import { toAppLocale } from "@/lib/locale-bcp47";
import { computeLocationPrayerTimes, locationCalcExtras } from "@/lib/location";
import { moonPhase } from "@/lib/moon";
import {
  buildDailySchedule,
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
  witrTime,
} from "@/lib/prayer-times";
import { preferredWindows } from "@/lib/salah-phase/preferred-window";
import { type ScheduleEntryStatus, scheduleEntryStatus } from "@/lib/schedule-ui";
import {
  type CelestialPosition,
  celestialPosition,
  dayTimelinePosition,
  type SkyMarkers,
  type SkyPalette,
  skyPalette,
  skyPhaseForTime,
} from "@/lib/sky";
import { dayKeyInTimeZone, prayerDayAnchor, shiftPrayerDay } from "@/lib/time";
import { useLocation, useLocationStatus } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";

export interface HomeHeroData {
  location: string;
  displayDates: DualCalendarDates;
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
  /** Where the sun / moon sits in the hero sky right now. */
  celestial: CelestialPosition;
  /** Position (0..1) of "now" along the prayer row's day timeline. */
  dayProgress: number;
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
  /**
   * Pre-localized preferred-time hint for Fajr / Asr / Isha (NF-3.0a), e.g.
   * "Preferred (Hanafi): 5:45 – 6:15", or a neutral note in all-views mode.
   */
  preferred?: string;
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

  const locale: AppLocale = toAppLocale(i18n.language ?? "en");

  const dayKey = dayKeyOf(now, location.timeZone);

  // Day-scoped adhan objects: stable for the whole local calendar day at a given
  // location. Recomputing these is the expensive part, so they are memoized here
  // and everything below reuses them.
  // biome-ignore lint/correctness/useExhaustiveDependencies: dayKey is the calendar-day proxy for `now`; recompute only when the day (or location) changes, not every tick.
  const day = useMemo(() => {
    const coords = { latitude: location.latitude, longitude: location.longitude };
    const anchor = prayerDayAnchor(now, location.timeZone);
    const today = computeLocationPrayerTimes(location, anchor);
    const tomorrowTimes = computeLocationPrayerTimes(location, shiftPrayerDay(anchor, 1));
    const yesterdayTimes = computeLocationPrayerTimes(location, shiftPrayerDay(anchor, -1));
    const slots = prayerSlots(today);
    const boundaries = scheduleBoundaries(today, tomorrowTimes, yesterdayTimes, now);
    // Sky-phase markers are day-stable; build them once so the per-tick palette
    // lookup below is a cheap `skyPhaseForTime(now, markers)` call.
    const markers = Object.fromEntries(slots.map((s) => [s.id, s.date])) as unknown as SkyMarkers;
    return { coords, today, tomorrow: tomorrowTimes, slots, boundaries, markers };
  }, [location, dayKey]);

  // Preferred-time sub-bands (Fajr isfar/taghlis, Asr, Isha) — day-stable, and
  // re-derived when the user's madhhab (salah domain) changes.
  const madhhab = useMadhhab();
  const preferredLabels = useMemo(() => {
    const tz = location.timeZone;
    const salahSchool = madhhab.schoolFor("salah");
    const salahRules = madhhab.rules("salah");
    const windows = preferredWindows(
      {
        fajr: day.today.fajr,
        sunrise: day.today.sunrise,
        asr: day.today.asr,
        maghrib: day.today.maghrib,
        isha: day.today.isha,
        nextFajr: day.tomorrow.fajr,
      },
      salahRules,
    );
    const labels: Record<string, string> = {};
    for (const [prayer, window] of Object.entries(windows)) {
      if (!window) continue;
      labels[prayer] =
        window.kind === "allViews" || salahSchool == null
          ? t("prayerWindow.preferred.allViews")
          : t("prayerWindow.preferred.band", {
              school: t(`fiqh.school.${salahSchool}`),
              start: formatPrayerTime(window.start, timeFormat, tz),
              end: formatPrayerTime(window.end, timeFormat, tz),
            });
    }
    return labels;
  }, [day, madhhab, location.timeZone, timeFormat, t]);

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
      ...(preferredLabels[entry.id] ? { preferred: preferredLabels[entry.id] } : null),
    }));

    return {
      next,
      schedule,
      nextScheduleId: nextEntry?.id ?? null,
      nextEntryAt: nextEntry?.at ?? null,
    };
  }, [
    day,
    crossingKey,
    location.method,
    location.madhab,
    location.timeZone,
    timeFormat,
    t,
    preferredLabels,
  ]);

  // Minute-scoped layer: the clock, countdown, live progress, and sky/moon. These
  // are cheap scalars derived from the memoized selection + day objects each tick.
  return useMemo(() => {
    const { next, nextEntryAt } = selection;
    const tz = location.timeZone;

    // `minutesUntil` is recomputed live from the memoized `next.date` so the
    // countdown ticks every minute without re-running the adhan selection.
    const minutesUntil = Math.max(0, Math.round((next.date.getTime() - now.getTime()) / 60000));
    const scheduleMinutesUntil = nextEntryAt
      ? Math.max(0, Math.round((nextEntryAt.getTime() - now.getTime()) / 60000))
      : minutesUntil;
    const nextIn = t("hero.nextIn", { time: formatDuration(scheduleMinutesUntil, t) });

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
      location: location.source === "default" ? t("location.defaultLabel") : location.label,
      displayDates: formatDualCalendarDate(now, defaultCalendar, locale, location.timeZone),
      currentTime: formatPrayerTime(now, timeFormat, tz),
      countdown,
      prayers,
      activeIndex: next.currentIndex,
      now,
      sky,
      moonLabel,
      southernHemisphere: location.latitude < 0,
      celestial: celestialPosition(now, day.markers),
      dayProgress: dayTimelinePosition(now, day.markers),
      nextIn,
      nextScheduleId: selection.nextScheduleId,
      schedule: selection.schedule,
    };
  }, [day, selection, prayers, now, locale, timeFormat, defaultCalendar, location, status, t]);
}
