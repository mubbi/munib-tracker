import { getLocalDateString, parseLocalDateString } from "@munib-tracker/shared/utils";
import { useMemo } from "react";

import { useNow } from "@/hooks/use-now";
import { locationCalcExtras } from "@/lib/location";
import { computePrayerTimes } from "@/lib/prayer-times";
import { useLocation } from "@/stores/location-store";

/**
 * Today's Isha on this device (on-device adhan times). Partner reminders are
 * shown only after it — the server has no prayer times (docs/CIRCLES.md).
 * `null` when it can't be computed (e.g. extreme latitudes).
 */
export function useIshaToday(): { now: Date; isha: Date | null } {
  const location = useLocation();
  const now = useNow();
  // Recompute once per local day (and when the location changes).
  const day = getLocalDateString(now);
  const isha = useMemo(() => {
    try {
      const noon = parseLocalDateString(day);
      noon.setHours(12, 0, 0, 0);
      const times = computePrayerTimes(
        { latitude: location.latitude, longitude: location.longitude },
        noon,
        location.method,
        location.madhab,
        locationCalcExtras(location),
      );
      return Number.isNaN(times.isha.getTime()) ? null : times.isha;
    } catch {
      return null;
    }
  }, [location, day]);
  return { now, isha };
}
