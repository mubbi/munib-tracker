import { APP_FEEDBACK_TRIGGER_IDS, type ReviewValueMomentId } from "@munib-tracker/shared/reviews";

/** Lower wins when several value moments are pending at once. */
export const TRIGGER_PRIORITY: Record<ReviewValueMomentId, number> = {
  [APP_FEEDBACK_TRIGGER_IDS.perfect_day]: 1,
  [APP_FEEDBACK_TRIGGER_IDS.achievement_unlock]: 2,
  [APP_FEEDBACK_TRIGGER_IDS.weekly_report]: 3,
  [APP_FEEDBACK_TRIGGER_IDS.streak_milestone]: 4,
  [APP_FEEDBACK_TRIGGER_IDS.qaza_cleared]: 5,
};
