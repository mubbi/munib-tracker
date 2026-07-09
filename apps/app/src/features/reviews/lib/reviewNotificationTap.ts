import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import {
  invokeOpenReviewFunnel,
  parseReviewReactivationTriggerId,
} from "@/features/reviews/lib/reviewPromptBridge";

export function maybeOpenReviewFunnelFromNotificationData(
  data: Record<string, unknown> | undefined,
): boolean {
  if (data?.type !== "review_reactivation") return false;
  const triggerId =
    parseReviewReactivationTriggerId(data.triggerId) ?? APP_FEEDBACK_TRIGGER_IDS.manual;
  invokeOpenReviewFunnel(triggerId);
  return true;
}

export function maybeOpenReviewFunnelFromInAppNotification(
  kind: string,
  id: string,
  createdAt: string,
): boolean {
  if (kind !== "system" || !id.startsWith("weekly-")) return false;
  const ageMs = Date.now() - new Date(createdAt).getTime();
  if (ageMs > 24 * 60 * 60 * 1000) return false;
  invokeOpenReviewFunnel(APP_FEEDBACK_TRIGGER_IDS.weekly_report);
  return true;
}
