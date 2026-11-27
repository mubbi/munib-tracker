import type {
  AfterSalahPrayer,
  ObligatoryPrayer,
  PrayerId,
  PrayerStatus,
} from "@munib-tracker/shared/types";
import { isObligatoryPrayer } from "@munib-tracker/shared/validators";

/** True when an obligatory prayer was just marked completed (not toggled off). */
export function shouldRemindAfterSalahAdhkar(
  prayerId: PrayerId,
  previous: PrayerStatus,
  next: PrayerStatus,
): boolean {
  return isObligatoryPrayer(prayerId) && previous !== "completed" && next === "completed";
}

/**
 * Where an after-salah prompt lands. With a salah it opens the guided session
 * straight away (counter inline, no list → tasbeeh hops); without one, the
 * after-salah list (which defaults to the current salah).
 */
export function afterSalahAdhkarRoute(prayerId?: AfterSalahPrayer) {
  if (prayerId) {
    return {
      pathname: "/zikr/session/[category]" as const,
      params: { category: "after_prayer" as const, prayer: prayerId },
    };
  }
  return {
    pathname: "/zikr/[category]" as const,
    params: { category: "after_prayer" as const },
  };
}

/** String href for notification deep-links and other string-based navigators. */
export function afterSalahAdhkarHref(prayerId: ObligatoryPrayer): string {
  return `/zikr/session/after_prayer?prayer=${prayerId}`;
}

export const AFTER_SALAH_ADHKAR_ROUTE = afterSalahAdhkarRoute();
