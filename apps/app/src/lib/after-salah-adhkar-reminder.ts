import type { ObligatoryPrayer, PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import { isObligatoryPrayer } from "@munib-tracker/shared/validators";

/** True when an obligatory prayer was just marked completed (not toggled off). */
export function shouldRemindAfterSalahAdhkar(
  prayerId: PrayerId,
  previous: PrayerStatus,
  next: PrayerStatus,
): boolean {
  return isObligatoryPrayer(prayerId) && previous !== "completed" && next === "completed";
}

export function afterSalahAdhkarRoute(prayerId?: ObligatoryPrayer) {
  return {
    pathname: "/zikr/[category]" as const,
    params: prayerId
      ? { category: "after_prayer" as const, prayer: prayerId }
      : { category: "after_prayer" as const },
  };
}

/** String href for notification deep-links and other string-based navigators. */
export function afterSalahAdhkarHref(prayerId: ObligatoryPrayer): string {
  return `/zikr/after_prayer?prayer=${prayerId}`;
}

export const AFTER_SALAH_ADHKAR_ROUTE = afterSalahAdhkarRoute();
