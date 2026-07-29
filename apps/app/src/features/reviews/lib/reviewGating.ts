import {
  APP_FEEDBACK_TRIGGER_IDS,
  REVIEW_DISMISS_BASE_DAYS,
  REVIEW_DISMISS_MAX_DAYS,
  REVIEW_ERROR_COOLDOWN_DAYS,
  REVIEW_MIN_INSTALL_HOURS,
  REVIEW_MIN_MEANINGFUL_INTERACTIONS,
  REVIEW_MIN_PRAYERS_LOGGED,
  REVIEW_MIN_SESSIONS,
  REVIEW_PROMPT_LIFETIME_CAP,
  REVIEW_SESSION_IDLE_MINUTES,
  REVIEW_STORE_COOLDOWN_DAYS,
  REVIEW_TRIGGER_COALESCE_MINUTES,
} from "@munib-tracker/shared/reviews";
import { Platform } from "react-native";
import type { ReviewGatingState } from "@/features/reviews/lib/reviewStorage";
import { isExpoGo } from "@/lib/notifications/platform";

const SESSION_IDLE_MS = REVIEW_SESSION_IDLE_MINUTES * 60 * 1000;

export type ReviewBlockReason =
  | "web"
  | "expo_go"
  | "min_sessions"
  | "install_age"
  | "recent_error"
  | "sync_pending"
  | "session_error"
  | "min_interactions"
  | "no_value_moment"
  | "insufficient_usage"
  | "setup_incomplete"
  | "lifetime_cap"
  | "store_cooldown"
  | "dismiss_backoff"
  | "session_prompt_shown"
  | "trigger_coalesced";

export type ReviewPromptRuntime = {
  isSyncing: boolean;
  prayersLogged: number;
  currentStreak: number;
  achievementsUnlocked: number;
  hasCompletedOnboarding: boolean;
};

function daysBetween(a: Date, b: Date): number {
  return Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24);
}

function hoursSince(iso: string | null, now: Date): number {
  if (!iso) return Number.POSITIVE_INFINITY;
  return (now.getTime() - new Date(iso).getTime()) / (1000 * 60 * 60);
}

function minutesSince(iso: string | null, now: Date): number {
  if (!iso) return Number.POSITIVE_INFINITY;
  return (now.getTime() - new Date(iso).getTime()) / (1000 * 60);
}

function isValueMomentInCurrentSession(state: ReviewGatingState, now: Date): boolean {
  if (!state.lastSessionValueAt || !state.currentSessionStartedAt) return false;
  const valueAt = new Date(state.lastSessionValueAt).getTime();
  const sessionStart = new Date(state.currentSessionStartedAt).getTime();
  return valueAt >= sessionStart && valueAt <= now.getTime();
}

export type ManualReviewPromptAvailability = {
  loaded: boolean;
  blocked: boolean;
};

export function isManualReviewPromptAvailable(
  state: ReviewGatingState | null,
  options: ManualReviewPromptAvailability,
  now = new Date(),
): boolean {
  if (!options.loaded || options.blocked || !state) return false;
  return canShowManualReviewPrompt(state, now).allowed;
}

export function canShowManualReviewPrompt(
  state: ReviewGatingState,
  now = new Date(),
): { allowed: boolean; reason?: ReviewBlockReason } {
  if (state.promptCountLifetime >= REVIEW_PROMPT_LIFETIME_CAP) {
    return { allowed: false, reason: "lifetime_cap" };
  }
  if (
    state.lastStoreReviewRequestAt &&
    daysBetween(new Date(state.lastStoreReviewRequestAt), now) < REVIEW_STORE_COOLDOWN_DAYS
  ) {
    return { allowed: false, reason: "store_cooldown" };
  }
  return { allowed: true };
}

export function canShowReviewPrompt(
  state: ReviewGatingState,
  runtime: ReviewPromptRuntime,
  now = new Date(),
): { allowed: boolean; reason?: ReviewBlockReason } {
  if (Platform.OS === "web") return { allowed: false, reason: "web" };
  if (isExpoGo()) return { allowed: false, reason: "expo_go" };
  if (state.sessionCount < REVIEW_MIN_SESSIONS) {
    return { allowed: false, reason: "min_sessions" };
  }
  if (hoursSince(state.firstOpenAt, now) < REVIEW_MIN_INSTALL_HOURS) {
    return { allowed: false, reason: "install_age" };
  }
  if (
    state.lastErrorAt &&
    daysBetween(new Date(state.lastErrorAt), now) < REVIEW_ERROR_COOLDOWN_DAYS
  ) {
    return { allowed: false, reason: "recent_error" };
  }
  if (runtime.isSyncing) {
    return { allowed: false, reason: "sync_pending" };
  }
  if (state.sessionErrorAt) {
    return { allowed: false, reason: "session_error" };
  }
  if (state.meaningfulInteractionCount < REVIEW_MIN_MEANINGFUL_INTERACTIONS) {
    return { allowed: false, reason: "min_interactions" };
  }
  if (!isValueMomentInCurrentSession(state, now)) {
    return { allowed: false, reason: "no_value_moment" };
  }
  const hasUsage =
    runtime.prayersLogged >= REVIEW_MIN_PRAYERS_LOGGED ||
    runtime.currentStreak >= 3 ||
    runtime.achievementsUnlocked >= 1;
  if (!hasUsage) {
    return { allowed: false, reason: "insufficient_usage" };
  }
  if (!runtime.hasCompletedOnboarding) {
    return { allowed: false, reason: "setup_incomplete" };
  }
  if (state.promptCountLifetime >= REVIEW_PROMPT_LIFETIME_CAP) {
    return { allowed: false, reason: "lifetime_cap" };
  }
  if (
    state.lastStoreReviewRequestAt &&
    daysBetween(new Date(state.lastStoreReviewRequestAt), now) < REVIEW_STORE_COOLDOWN_DAYS
  ) {
    return { allowed: false, reason: "store_cooldown" };
  }
  if (state.lastDismissedAt) {
    const dismissDays = Math.min(
      REVIEW_DISMISS_MAX_DAYS,
      REVIEW_DISMISS_BASE_DAYS * Math.max(1, state.dismissStreak),
    );
    if (daysBetween(new Date(state.lastDismissedAt), now) < dismissDays) {
      return { allowed: false, reason: "dismiss_backoff" };
    }
  }
  if (state.sessionPromptShown) {
    return { allowed: false, reason: "session_prompt_shown" };
  }
  if (
    state.lastTriggerCoalesceAt &&
    minutesSince(state.lastTriggerCoalesceAt, now) < REVIEW_TRIGGER_COALESCE_MINUTES
  ) {
    return { allowed: false, reason: "trigger_coalesced" };
  }
  return { allowed: true };
}

export function canSendReviewReactivationPush(
  state: ReviewGatingState,
  runtime: ReviewPromptRuntime,
  now = new Date(),
): { allowed: boolean; reason?: ReviewBlockReason } {
  if (state.sessionPromptShown) {
    const withoutSessionFlag = { ...state, sessionPromptShown: false };
    const withoutCoalesce = {
      ...withoutSessionFlag,
      lastTriggerCoalesceAt: null,
    };
    return canShowReviewPrompt(withoutCoalesce, runtime, now);
  }
  if (state.lastTriggerCoalesceAt) {
    return canShowReviewPrompt({ ...state, lastTriggerCoalesceAt: null }, runtime, now);
  }
  return canShowReviewPrompt(state, runtime, now);
}

export function recordSessionForeground(
  state: ReviewGatingState,
  now = new Date(),
): ReviewGatingState {
  const iso = now.toISOString();
  const lastFg = state.lastForegroundAt ? new Date(state.lastForegroundAt).getTime() : null;
  const isNewSession = lastFg == null || now.getTime() - lastFg > SESSION_IDLE_MS;

  const base: ReviewGatingState = {
    ...state,
    firstOpenAt: state.firstOpenAt ?? iso,
    lastForegroundAt: iso,
  };

  if (!isNewSession) return base;

  return {
    ...base,
    sessionCount: state.sessionCount + 1,
    currentSessionStartedAt: iso,
    sessionPromptShown: false,
    sessionErrorAt: null,
  };
}

export function recordValueMoment(state: ReviewGatingState, now = new Date()): ReviewGatingState {
  return {
    ...state,
    lastSessionValueAt: now.toISOString(),
  };
}

export function recordMeaningfulInteraction(state: ReviewGatingState): ReviewGatingState {
  return {
    ...state,
    meaningfulInteractionCount: state.meaningfulInteractionCount + 1,
  };
}

export function recordReviewError(state: ReviewGatingState, now = new Date()): ReviewGatingState {
  const iso = now.toISOString();
  return {
    ...state,
    lastErrorAt: iso,
    sessionErrorAt: iso,
  };
}

export function recordPromptShown(state: ReviewGatingState, now = new Date()): ReviewGatingState {
  return {
    ...state,
    lastPromptedAt: now.toISOString(),
    promptCountLifetime: state.promptCountLifetime + 1,
    sessionPromptShown: true,
    lastTriggerCoalesceAt: now.toISOString(),
  };
}

export function recordDismissed(state: ReviewGatingState, now = new Date()): ReviewGatingState {
  return {
    ...state,
    lastDismissedAt: now.toISOString(),
    dismissStreak: state.dismissStreak + 1,
  };
}

export function recordStoreReviewRequest(
  state: ReviewGatingState,
  now = new Date(),
): ReviewGatingState {
  return {
    ...state,
    lastStoreReviewRequestAt: now.toISOString(),
    dismissStreak: 0,
  };
}

export function recordFeedbackSent(state: ReviewGatingState, now = new Date()): ReviewGatingState {
  return {
    ...state,
    lastFeedbackSentAt: now.toISOString(),
    dismissStreak: 0,
  };
}

export { APP_FEEDBACK_TRIGGER_IDS };
