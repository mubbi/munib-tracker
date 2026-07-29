import type { ReviewFunnelTriggerId } from "@/features/reviews/lib/reviewPromptBridge";

/**
 * Web: no OS local notifications. Avoid importing expo-notifications (its
 * push-token auto-registration side effect warns on web).
 */
export async function maybeDeliverReviewReactivation(
  _triggerId: ReviewFunnelTriggerId,
): Promise<boolean> {
  return false;
}
