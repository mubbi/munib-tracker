import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  ensureHomeMasjidLoaded,
  useHomeIqamahTimetable,
  useHomeMasjid,
} from "@/lib/masjid/home-masjid";
import { nextIqamah } from "@/lib/masjid/next-iqamah";
import { useLocation } from "@/stores/location-store";

/**
 * NF-3.11 home-hero iqamah countdown, e.g. "Dhuhr iqamah in 25 min". Null when
 * no home masjid / no iqamah times exist (private > public > nothing) or the
 * next iqamah is more than three hours away — the hero then shows only the
 * adhan countdown. Ticks with the `now` the hero already passes down.
 */
export function useIqamahCountdown(now: Date): string | null {
  const { t } = useTranslation();
  const home = useHomeMasjid();
  const timetable = useHomeIqamahTimetable();
  const location = useLocation();

  useEffect(() => {
    if (home) void ensureHomeMasjidLoaded().catch(() => undefined);
  }, [home]);

  const next = nextIqamah(timetable, now, location.timeZone);
  if (!next) return null;
  const prayer = t(`prayers.${next.prayer}`);
  return next.minutes >= 60
    ? t("masjidLog.heroIqamahHours", {
        prayer,
        hours: Math.floor(next.minutes / 60),
        min: next.minutes % 60,
      })
    : t("masjidLog.heroIqamah", { prayer, min: next.minutes });
}
