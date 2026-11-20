import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useMemo } from "react";

import { useNow } from "@/hooks/use-now";
import { adhkarDayFor, afterSalahPrayerForSlot, type PrayerInstants } from "@/lib/adhkar-session";
import { locationCalcExtras } from "@/lib/location";
import {
  computePrayerTimes,
  currentPrayer,
  hasValidPrayerTimes,
  type PrayerSlotId,
} from "@/lib/prayer-times";
import { prayerDayAnchor } from "@/lib/timezone-anchor";
import { useLocation } from "@/stores/location-store";

type PrayerTimesLike = Record<PrayerSlotId, Date>;

function instants(computed: PrayerTimesLike): PrayerInstants {
  return {
    fajr: computed.fajr,
    sunrise: computed.sunrise,
    dhuhr: computed.dhuhr,
    asr: computed.asr,
    maghrib: computed.maghrib,
    isha: computed.isha,
  };
}

/**
 * Wall-clock + the adhkar day for zikr tracking:
 * - `date` — the day recitations are logged under. It runs Fajr → Fajr, so
 *   before today's Fajr it is still yesterday (last night's Isha / Witr /
 *   before-sleep adhkar land on the night they belong to).
 * - `times` — that day's prayer instants (adhkar windows / pending / missed).
 * - `currentAfterSalah` — the after-salah tab to open by default.
 *
 * Times are computed on-device (adhan) from the saved location, like the home hero.
 */
export function useAdhkarClock() {
  const location = useLocation();
  const now = useNow();

  return useMemo(() => {
    const today = getLocalDateString(now);
    const fallback = {
      now,
      date: today,
      times: null as PrayerInstants | null,
      currentAfterSalah: afterSalahPrayerForSlot(undefined),
    };
    const coords = { latitude: location.latitude, longitude: location.longitude };
    const extras = locationCalcExtras(location);
    try {
      const anchor = prayerDayAnchor(now, location.timeZone);
      const todays = computePrayerTimes(coords, anchor, location.method, location.madhab, extras);
      if (!hasValidPrayerTimes(todays)) return fallback;
      const date = adhkarDayFor(now, todays.fajr, today);
      let times = instants(todays);
      if (date !== today) {
        const previous = new Date(anchor);
        previous.setDate(previous.getDate() - 1);
        const yesterdays = computePrayerTimes(
          coords,
          previous,
          location.method,
          location.madhab,
          extras,
        );
        if (hasValidPrayerTimes(yesterdays)) times = instants(yesterdays);
      }
      const slot = currentPrayer(
        coords,
        now,
        location.method,
        location.madhab,
        location.timeZone,
        extras,
      );
      return { now, date, times, currentAfterSalah: afterSalahPrayerForSlot(slot.id) };
    } catch {
      return fallback;
    }
  }, [location, now]);
}
