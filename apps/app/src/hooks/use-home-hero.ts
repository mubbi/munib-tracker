import type { AppLocale } from "@munib-tracker/shared/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { PrayerTime } from "@/components/prayer-times-hero";
import { useNow } from "@/hooks/use-now";
import { formatHijriDate } from "@/lib/hijri";
import { moonPhase } from "@/lib/moon";
import {
  computePrayerTimes,
  formatDuration,
  formatPrayerTime,
  nextPrayer,
  PRAYER_SLOT_ICONS,
  prayerSlots,
  windowProgress,
} from "@/lib/prayer-times";
import { type SkyMarkers, type SkyPalette, skyPalette, skyPhaseForTime } from "@/lib/sky";
import { useLocation, useLocationStatus } from "@/stores/location-store";

export interface HomeHeroData {
  location: string;
  hijriDate: string;
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
  /** Fraction (0..1) of the current prayer window that has elapsed. */
  windowProgress: number;
  /** Pre-localized "in {{time}}" until the next marker, e.g. "in 27m". */
  nextIn: string;
  /** The six markers with display strings + which one is currently active. */
  schedule: ScheduleItem[];
}

export interface ScheduleItem {
  id: string;
  name: string;
  time: string;
  /** Whether this marker's window is the one currently running. */
  active: boolean;
}

/**
 * Derives everything the prayer-times hero renders from the stored location and
 * the live clock. Prayer times are computed on-device via `adhan`; the Hijri
 * date and countdown update as the clock ticks.
 */
export function useHomeHero(): HomeHeroData {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const status = useLocationStatus();
  const now = useNow();

  const base = i18n.language?.split("-")[0];
  const locale: AppLocale = base === "ar" || base === "ur" ? base : "en";

  return useMemo(() => {
    const coords = { latitude: location.latitude, longitude: location.longitude };
    const times = computePrayerTimes(coords, now, location.method, location.madhab);
    const next = nextPrayer(coords, now, location.method, location.madhab);
    const slots = prayerSlots(times);

    const prayers: PrayerTime[] = slots.map((slot) => ({
      name: t(`prayers.${slot.id}`),
      time: formatPrayerTime(slot.date),
      icon: PRAYER_SLOT_ICONS[slot.id],
    }));

    const schedule: ScheduleItem[] = slots.map((slot, index) => ({
      id: slot.id,
      name: t(`prayers.${slot.id}`),
      time: formatPrayerTime(slot.date),
      active: index === next.currentIndex,
    }));

    // Progress through the running window: from the active marker to the next one.
    const windowStart = slots[next.currentIndex]?.date ?? now;
    const progress = windowProgress(windowStart, next.date, now);
    const nextIn = t("hero.nextIn", { time: formatDuration(next.minutesUntil) });

    const markers = Object.fromEntries(slots.map((s) => [s.id, s.date])) as unknown as SkyMarkers;
    const sky = skyPalette(skyPhaseForTime(now, markers));
    const moon = moonPhase(now);
    const moonLabel = t("moon.aria", { phase: t(`moon.${moon.name}`) });

    const prayerName = t(`prayers.${next.id}`);
    const countdown =
      status === "loading" && location.updatedAt == null
        ? t("hero.locating")
        : next.minutesUntil >= 60
          ? t("hero.nextPrayerAwayHours", {
              prayer: prayerName,
              hours: Math.floor(next.minutesUntil / 60),
              min: next.minutesUntil % 60,
            })
          : t("hero.nextPrayerAway", { prayer: prayerName, min: next.minutesUntil });

    return {
      location: location.label,
      hijriDate: formatHijriDate(now, locale),
      currentTime: formatPrayerTime(now),
      countdown,
      prayers,
      activeIndex: next.currentIndex,
      now,
      sky,
      moonLabel,
      windowProgress: progress,
      nextIn,
      schedule,
    };
  }, [location, status, now, locale, t]);
}
