/**
 * Trigger ids: value moments that may request the OS review sheet, plus
 * `manual` (user-opened feedback from Settings). Also the `triggerId` field of
 * the app-feedback API.
 */
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

/** Value-moment triggers — every id except the user-initiated `manual`. */
export type ReviewValueMomentId = Exclude<AppFeedbackTriggerId, "manual">;

/** Streak lengths that count as a review value moment (hit exactly, on the day it happens). */
export const STREAK_MILESTONE_DAYS = [3, 7, 14, 30] as const;

/** App-feedback ratings accepted by the API (1–5, user-initiated, never a store pre-filter). */
export const APP_FEEDBACK_MIN_RATING = 1;
export const APP_FEEDBACK_MAX_RATING = 5;
