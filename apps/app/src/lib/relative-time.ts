import type { AppLocale, CalendarMode } from "@munib-tracker/shared/types";
import type { TFunction } from "i18next";

import { formatCalendarDateFromIso } from "./calendar-format";
import { toAppLocale } from "./locale-bcp47";

/**
 * Human "x minutes ago" relative time for a stored ISO timestamp, falling back
 * to an absolute short date once it is more than a week old. Reuses the generic
 * `home.continueWhen.*` catalog strings so the phrasing stays consistent across
 * the continue card and the cloud-sync status row.
 */
export function formatRelativeWhen(
  iso: string,
  locale: string | undefined,
  t: TFunction,
  calendar: CalendarMode = "gregorian",
): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return t("home.continueWhen.justNow");
  if (diffMin < 60) return t("home.continueWhen.minutesAgo", { count: diffMin });

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return t("home.continueWhen.hoursAgo", { count: diffHours });

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return t("home.continueWhen.yesterday");
  if (diffDays < 7) return t("home.continueWhen.daysAgo", { count: diffDays });

  return formatCalendarDateFromIso(iso.slice(0, 10), calendar, appLocaleFrom(locale), {
    month: "short",
    day: "numeric",
  });
}

function appLocaleFrom(locale: string | undefined): AppLocale {
  return toAppLocale(locale ?? "en");
}
