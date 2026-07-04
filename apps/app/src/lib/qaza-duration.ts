import { breakDownDayDuration, type DayDurationParts } from "@munib-tracker/shared/utils";
import type { TFunction } from "i18next";

function durationPart(
  t: TFunction,
  key: "durationYears" | "durationMonths" | "durationDays",
  count: number,
): string {
  return t(`qazaPlan.${key}`, { count });
}

/** Formats a day count as "X years, Y months and Z days", omitting zero units. */
export function formatQazaDuration(totalDays: number, t: TFunction): string {
  const parts = breakDownDayDuration(totalDays);
  return formatDurationParts(parts, t);
}

export function formatDurationParts(parts: DayDurationParts, t: TFunction): string {
  const segments: string[] = [];
  if (parts.years > 0) segments.push(durationPart(t, "durationYears", parts.years));
  if (parts.months > 0) segments.push(durationPart(t, "durationMonths", parts.months));
  if (parts.days > 0 || segments.length === 0) {
    segments.push(durationPart(t, "durationDays", parts.days));
  }

  if (segments.length === 1) return segments[0];
  if (segments.length === 2) {
    return t("qazaPlan.durationTwo", { first: segments[0], second: segments[1] });
  }
  return t("qazaPlan.durationThree", {
    first: segments[0],
    second: segments[1],
    third: segments[2],
  });
}
