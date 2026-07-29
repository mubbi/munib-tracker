/** Value-moment / manual trigger ids for the in-app review funnel and app-feedback API. */
export const APP_FEEDBACK_TRIGGER_IDS = {
  perfect_day: "perfect_day",
  achievement_unlock: "achievement_unlock",
  weekly_report: "weekly_report",
  streak_milestone: "streak_milestone",
  qaza_cleared: "qaza_cleared",
  manual: "manual",
} as const;

export type AppFeedbackTriggerId =
  (typeof APP_FEEDBACK_TRIGGER_IDS)[keyof typeof APP_FEEDBACK_TRIGGER_IDS];

export const STREAK_MILESTONE_DAYS = [3, 7, 14, 30] as const;
