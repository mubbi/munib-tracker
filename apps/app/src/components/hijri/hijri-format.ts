import type { AppLocale } from "@munib-tracker/shared/types";

import { jdnToLocalDate } from "@/lib/hijri-adjustment";
import { localeToBcp47 } from "@/lib/locale-bcp47";

/** Weekday + Gregorian date for a civil JDN, e.g. "Tue, 12 Mar 2024". */
export function formatGregorianDay(jdn: number, locale: AppLocale): string {
  try {
    return new Intl.DateTimeFormat(localeToBcp47(locale), {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(jdnToLocalDate(jdn));
  } catch {
    return jdnToLocalDate(jdn).toDateString();
  }
}
