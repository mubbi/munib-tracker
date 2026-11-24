import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { formatDistance } from "@/lib/masjid/maps-link";
import { formatDisplayHhMm, parseHhMm } from "@/lib/time";
import { usePreferences } from "@/stores/preferences-store";

/** Formatters shared by the masjid screens: wall-clock "HH:mm" and distance. */
export function useMasjidFormat() {
  const { t, i18n } = useTranslation();
  const timeFormat = usePreferences().timeFormat;
  const time = useCallback(
    (hhmm: string) => {
      const { hour, minute } = parseHhMm(hhmm);
      return formatDisplayHhMm(hour, minute, timeFormat);
    },
    [timeFormat],
  );
  const distance = useCallback(
    (meters: number) =>
      formatDistance(meters, i18n.language, (key, options) => t(key, options) as string),
    [i18n.language, t],
  );
  return { time, distance };
}
