import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNow } from "@/hooks/use-now";
import { buildPrayerTimeMap } from "@/lib/prayer-times";
import { useLocation } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";

/** Computed display times for every tracked prayer on the current local day. */
export function useDailyPrayerTimes() {
  const { t } = useTranslation();
  const location = useLocation();
  const now = useNow();
  const timeFormat = usePreferences().timeFormat;

  return useMemo(() => {
    const coords = { latitude: location.latitude, longitude: location.longitude };
    return buildPrayerTimeMap(
      coords,
      now,
      location.method,
      location.madhab,
      t("home.scheduleAnyTime"),
      timeFormat,
      location.timeZone,
    );
  }, [location, now, timeFormat, t]);
}
