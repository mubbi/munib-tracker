import type { PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import { isObligatoryPrayer } from "@munib-tracker/shared/validators";

/** True when an obligatory prayer was just marked completed (not toggled off). */
export function shouldRemindAfterSalahAdhkar(
  prayerId: PrayerId,
  previous: PrayerStatus,
  next: PrayerStatus,
): boolean {
  return isObligatoryPrayer(prayerId) && previous !== "completed" && next === "completed";
}

export const AFTER_SALAH_ADHKAR_ROUTE = {
  pathname: "/zikr/[category]",
  params: { category: "after_prayer" },
} as const;
