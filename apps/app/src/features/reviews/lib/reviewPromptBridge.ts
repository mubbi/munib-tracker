import { APP_FEEDBACK_TRIGGER_IDS, type ReviewValueMomentId } from "@munib-tracker/shared/reviews";

/** Screen where a value-moment trigger may surface the OS review sheet ("none" = any). */
export type ReviewDeferRoute = "home" | "tracker" | "none";

export function deferRouteForTrigger(triggerId: ReviewValueMomentId): ReviewDeferRoute {
  switch (triggerId) {
    case APP_FEEDBACK_TRIGGER_IDS.perfect_day:
    case APP_FEEDBACK_TRIGGER_IDS.achievement_unlock:
    case APP_FEEDBACK_TRIGGER_IDS.qaza_cleared:
      return "tracker";
    case APP_FEEDBACK_TRIGGER_IDS.weekly_report:
    case APP_FEEDBACK_TRIGGER_IDS.streak_milestone:
      return "home";
    default:
      return "none";
  }
}

/** Lets non-React code (deep links) reach the provider's user-initiated "write a review". */
let openWriteReview: (() => void) | null = null;

export function registerWriteReviewOpener(fn: (() => void) | null): void {
  openWriteReview = fn;
}

export function invokeOpenWriteReview(): boolean {
  if (!openWriteReview) return false;
  openWriteReview();
  return true;
}
