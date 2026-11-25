import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import { emitReviewTrigger } from "@/features/reviews/lib/reviewTriggerBus";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Builds before D76 posted a local "share your experience" notification. A tap
 * on one still sitting in the tray just opens the app — never a review sheet
 * (an OS sheet in response to a tap may silently not show).
 */
export function isLegacyReviewNotification(data: Record<string, unknown> | undefined): boolean {
  return data?.type === "review_reactivation";
}

/**
 * Opening a fresh weekly-report inbox row is a value moment: queue it so the
 * OS review sheet may show when the person is back on Home. The row still
 * opens its own screen as usual.
 */
export function noteWeeklyReportOpened(
  kind: string,
  id: string,
  createdAt: string,
  now = Date.now(),
): boolean {
  if (kind !== "system" || !id.startsWith("weekly-")) return false;
  const at = new Date(createdAt).getTime();
  if (Number.isNaN(at) || now - at > DAY_MS) return false;
  emitReviewTrigger(APP_FEEDBACK_TRIGGER_IDS.weekly_report, { deferRoute: "home", now });
  return true;
}
