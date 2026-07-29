import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { buildPrayerTimeMap } from "@/lib/prayer-times";
import { useLocation } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";

/** Computed display times for every tracked prayer on a specific ISO date. */
export function usePrayerTimesForDate(isoDate: string) {
  const { t } = useTranslation();
  const location = useLocation();
  const timeFormat = usePreferences().timeFormat;

  return useMemo(() => {
    const coords = { latitude: location.latitude, longitude: location.longitude };
    const day = new Date(`${isoDate}T12:00:00`);
    return buildPrayerTimeMap(
      coords,
      day,
      location.method,
      location.madhab,
      t("home.scheduleAnyTime"),
      timeFormat,
      location.timeZone,
    );
  }, [isoDate, location, timeFormat, t]);
}
