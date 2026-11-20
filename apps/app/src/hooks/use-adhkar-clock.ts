import { useMemo } from "react";

import { useNow } from "@/hooks/use-now";
import { afterSalahPrayerForSlot, type PrayerInstants } from "@/lib/adhkar-session";
import { locationCalcExtras } from "@/lib/location";
import { computePrayerTimes, currentPrayer, hasValidPrayerTimes } from "@/lib/prayer-times";
import { prayerDayAnchor } from "@/lib/timezone-anchor";
import { useLocation } from "@/stores/location-store";

/**
 * Wall-clock + today's prayer instants for adhkar status (pending / missed …)
 * and the default after-salah tab. Times are computed on-device (adhan) from
 * the saved location, exactly like the home hero.
 */
export function useAdhkarClock() {
  const location = useLocation();
  const now = useNow();

  return useMemo(() => {
    const coords = { latitude: location.latitude, longitude: location.longitude };
    const extras = locationCalcExtras(location);
    try {
      const anchor = prayerDayAnchor(now, location.timeZone);
      const computed = computePrayerTimes(coords, anchor, location.method, location.madhab, extras);
      if (!hasValidPrayerTimes(computed)) {
        return { now, times: null, currentAfterSalah: afterSalahPrayerForSlot(undefined) };
      }
      const times: PrayerInstants = {
        fajr: computed.fajr,
        sunrise: computed.sunrise,
        dhuhr: computed.dhuhr,
        asr: computed.asr,
        maghrib: computed.maghrib,
        isha: computed.isha,
      };
      const slot = currentPrayer(
        coords,
        now,
        location.method,
        location.madhab,
        location.timeZone,
        extras,
      );
      return { now, times, currentAfterSalah: afterSalahPrayerForSlot(slot.id) };
    } catch {
      return { now, times: null, currentAfterSalah: afterSalahPrayerForSlot(undefined) };
    }
  }, [location, now]);
}
