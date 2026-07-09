import { APP_FEEDBACK_TRIGGER_IDS, type AppFeedbackTriggerId } from "@munib-tracker/shared/reviews";

export type ReviewFunnelTriggerId = AppFeedbackTriggerId;

export type OpenReviewFunnelFn = (triggerId: ReviewFunnelTriggerId) => void;

let openReviewFunnel: OpenReviewFunnelFn | null = null;

export function registerReviewPromptOpener(fn: OpenReviewFunnelFn | null): void {
  openReviewFunnel = fn;
}

export function invokeOpenReviewFunnel(triggerId: ReviewFunnelTriggerId): void {
  openReviewFunnel?.(triggerId);
}

const REVIEW_REACTIVATION_TRIGGER_IDS = new Set<string>(Object.values(APP_FEEDBACK_TRIGGER_IDS));

export function parseReviewReactivationTriggerId(value: unknown): ReviewFunnelTriggerId | null {
  if (typeof value !== "string") return null;
  return REVIEW_REACTIVATION_TRIGGER_IDS.has(value) ? (value as ReviewFunnelTriggerId) : null;
}

export function deferRouteForTrigger(triggerId: ReviewFunnelTriggerId): ReviewDeferRoute {
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

export type ReviewDeferRoute = "home" | "tracker" | "none";
