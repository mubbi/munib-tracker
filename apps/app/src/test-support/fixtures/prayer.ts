import type { PrayerId, PrayerLog } from "@munib-tracker/shared/types";
import type { DayActivity } from "@munib-tracker/shared/utils";

import type { ScheduleItem } from "@/hooks/use-home-hero";

/** A manual prayer log for `2026-07-06` (completed Fajr) unless overridden. */
export function buildPrayerLog(overrides: Partial<PrayerLog> = {}): PrayerLog {
  return {
    id: `log-${overrides.prayerId ?? "fajr"}-${overrides.date ?? "2026-07-06"}`,
    prayerId: "fajr",
    date: "2026-07-06",
    status: "completed",
    updatedAt: "2026-07-06T05:30:00.000Z",
    source: "manual",
    ...overrides,
  };
}

/** Display times for every tracked prayer (the shape `usePrayerTimesForDate` returns). */
export function buildPrayerTimes(
  overrides: Partial<Record<PrayerId, string>> = {},
): Record<PrayerId, string> {
  return {
    fajr: "05:00",
    dhuhr: "12:30",
    asr: "16:00",
    maghrib: "19:10",
    isha: "20:30",
    witr: "20:45",
    tahajjud: "03:00",
    ishraq: "06:40",
    duha: "09:00",
    tahiyyatul_masjid: "12:00",
    hajat_istikhara: "21:00",
    ...overrides,
  } as Record<PrayerId, string>;
}

/** One day's aggregated tracker activity (no prayers logged unless overridden). */
export function buildDayActivity(overrides: Partial<DayActivity> = {}): DayActivity {
  return {
    date: "2026-07-06",
    completed: 0,
    missed: 0,
    qaza: 0,
    delayed: 0,
    total: 0,
    level: 0,
    ...overrides,
  };
}

/** One row of the home/schedule timeline (`useHomeHero().schedule`). */
export function buildScheduleItem(
  overrides: Partial<ScheduleItem> & Pick<ScheduleItem, "id">,
): ScheduleItem {
  const { id } = overrides;
  return {
    name: id.charAt(0).toUpperCase() + id.slice(1),
    time: "12:00",
    kind: "obligatory",
    active: false,
    status: "upcoming",
    atMs: 0,
    ...overrides,
    id,
  };
}
