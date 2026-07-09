import { APP_FEEDBACK_TRIGGER_IDS, type AppFeedbackTriggerId } from "@munib-tracker/shared/reviews";
import type { ReviewFunnelTriggerId } from "@/features/reviews/lib/reviewPromptBridge";

export const TRIGGER_PRIORITY: Record<ReviewFunnelTriggerId, number> = {
  [APP_FEEDBACK_TRIGGER_IDS.perfect_day]: 1,
  [APP_FEEDBACK_TRIGGER_IDS.achievement_unlock]: 2,
  [APP_FEEDBACK_TRIGGER_IDS.weekly_report]: 3,
  [APP_FEEDBACK_TRIGGER_IDS.streak_milestone]: 4,
  [APP_FEEDBACK_TRIGGER_IDS.qaza_cleared]: 5,
  [APP_FEEDBACK_TRIGGER_IDS.manual]: 6,
};

export function isReviewFunnelTriggerId(value: string): value is AppFeedbackTriggerId {
  return Object.values(APP_FEEDBACK_TRIGGER_IDS).includes(value as AppFeedbackTriggerId);
}
