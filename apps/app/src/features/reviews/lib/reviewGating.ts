import {
  REVIEW_AFTER_WRITE_REVIEW_DAYS,
  REVIEW_ERROR_COOLDOWN_DAYS,
  REVIEW_MIN_INSTALL_HOURS,
  REVIEW_MIN_MEANINGFUL_INTERACTIONS,
  REVIEW_MIN_PRAYERS_LOGGED,
  REVIEW_MIN_SESSIONS,
  REVIEW_MIN_STREAK_DAYS,
  REVIEW_PROMPT_COOLDOWN_DAYS,
  REVIEW_PROMPT_LIFETIME_CAP,
  REVIEW_SESSION_IDLE_MINUTES,
} from "@munib-tracker/shared/reviews";
import type { ReviewInteractionKind } from "@/features/reviews/lib/reviewInteractionKinds";
import type { ReviewGatingState } from "@/features/reviews/lib/reviewStorage";

/**
 * Pure rules for the automatic OS review request (D76). Platform support
 * (store build, not web / TV / Expo Go / TestFlight) is checked separately by
 * `isStoreReviewAvailable()`; the user-initiated Rate row and Send feedback are
 * never gated.
 */

const SESSION_IDLE_MS = REVIEW_SESSION_IDLE_MINUTES * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export type ReviewBlockReason =
  | "setup_incomplete"
  | "sync_pending"
  | "min_sessions"
  | "install_age"
  | "recent_error"
  | "session_error"
  | "min_interactions"
  | "insufficient_usage"
  | "lifetime_cap"
  | "prompt_cooldown"
  | "same_version"
  | "recently_reviewed";

export type ReviewPromptRuntime = {
  isSyncing: boolean;
  prayersLogged: number;
  currentStreak: number;
  achievementsUnlocked: number;
  hasCompletedOnboarding: boolean;
  appVersion: string;
};

export type ReviewGateResult = { allowed: true } | { allowed: false; reason: ReviewBlockReason };

/** Days since `iso`; +∞ when unset or unparseable, negative clock skew counts as 0. */
function daysSince(iso: string | null, now: Date): number {
  if (!iso) return Number.POSITIVE_INFINITY;
  const at = new Date(iso).getTime();
  if (Number.isNaN(at)) return Number.POSITIVE_INFINITY;
  return Math.max(0, now.getTime() - at) / DAY_MS;
}

export function canRequestAutomaticReview(
  state: ReviewGatingState,
  runtime: ReviewPromptRuntime,
  now = new Date(),
): ReviewGateResult {
  if (!runtime.hasCompletedOnboarding) return { allowed: false, reason: "setup_incomplete" };
  if (runtime.isSyncing) return { allowed: false, reason: "sync_pending" };

  // Engagement — HIG: ask only after the person has shown they use the app.
  if (state.sessionCount < REVIEW_MIN_SESSIONS) return { allowed: false, reason: "min_sessions" };
  if (!state.firstOpenAt || daysSince(state.firstOpenAt, now) * 24 < REVIEW_MIN_INSTALL_HOURS) {
    return { allowed: false, reason: "install_age" };
  }
  if (state.meaningfulInteractionCount < REVIEW_MIN_MEANINGFUL_INTERACTIONS) {
    return { allowed: false, reason: "min_interactions" };
  }
  const hasUsage =
    runtime.prayersLogged >= REVIEW_MIN_PRAYERS_LOGGED ||
    runtime.currentStreak >= REVIEW_MIN_STREAK_DAYS ||
    runtime.achievementsUnlocked >= 1;
  if (!hasUsage) return { allowed: false, reason: "insufficient_usage" };

  // A frustrated moment is never a good time to ask.
  if (daysSince(state.lastErrorAt, now) < REVIEW_ERROR_COOLDOWN_DAYS) {
    return { allowed: false, reason: "recent_error" };
  }
  if (state.sessionErrorAt) return { allowed: false, reason: "session_error" };

  // Frequency — stay well inside the OS quotas (Apple: 3 per 365 days).
  if (daysSince(state.lastWriteReviewOpenedAt, now) < REVIEW_AFTER_WRITE_REVIEW_DAYS) {
    return { allowed: false, reason: "recently_reviewed" };
  }
  if (state.promptCountLifetime >= REVIEW_PROMPT_LIFETIME_CAP) {
    return { allowed: false, reason: "lifetime_cap" };
  }
  if (daysSince(state.lastPromptedAt, now) < REVIEW_PROMPT_COOLDOWN_DAYS) {
    return { allowed: false, reason: "prompt_cooldown" };
  }
  // Apple's sample: never ask twice for the same app version.
  if (state.lastPromptedVersion && state.lastPromptedVersion === runtime.appVersion) {
    return { allowed: false, reason: "same_version" };
  }
  return { allowed: true };
}

export function recordSessionForeground(
  state: ReviewGatingState,
  now = new Date(),
): ReviewGatingState {
  const iso = now.toISOString();
  const lastFg = state.lastForegroundAt ? new Date(state.lastForegroundAt).getTime() : Number.NaN;
  const isNewSession = Number.isNaN(lastFg) || now.getTime() - lastFg > SESSION_IDLE_MS;

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
    sessionInteractionKinds: [],
    sessionErrorAt: null,
  };
}

/** Marks the app as still in use (on background too, so a long session isn't split). */
export function recordForegroundHeartbeat(
  state: ReviewGatingState,
  now = new Date(),
): ReviewGatingState {
  return { ...state, lastForegroundAt: now.toISOString() };
}

/** Counts each interaction kind once per session. */
export function recordMeaningfulInteraction(
  state: ReviewGatingState,
  kind: ReviewInteractionKind,
): ReviewGatingState {
  if (state.sessionInteractionKinds.includes(kind)) return state;
  return {
    ...state,
    sessionInteractionKinds: [...state.sessionInteractionKinds, kind],
    meaningfulInteractionCount: state.meaningfulInteractionCount + 1,
  };
}

export type ReviewErrorSeverity = "crash" | "session";

/**
 * `crash` (error boundary) blocks automatic asks for a week; `session` (e.g. an
 * offline sync failure) only for the rest of the session.
 */
export function recordReviewError(
  state: ReviewGatingState,
  severity: ReviewErrorSeverity = "crash",
  now = new Date(),
): ReviewGatingState {
  const iso = now.toISOString();
  return {
    ...state,
    lastErrorAt: severity === "crash" ? iso : state.lastErrorAt,
    sessionErrorAt: iso,
  };
}

export function recordAutomaticReviewRequested(
  state: ReviewGatingState,
  appVersion: string,
  now = new Date(),
): ReviewGatingState {
  return {
    ...state,
    lastPromptedAt: now.toISOString(),
    lastPromptedVersion: appVersion,
    promptCountLifetime: state.promptCountLifetime + 1,
  };
}

export function recordWriteReviewOpened(
  state: ReviewGatingState,
  now = new Date(),
): ReviewGatingState {
  return { ...state, lastWriteReviewOpenedAt: now.toISOString() };
}

export function recordFeedbackSent(state: ReviewGatingState, now = new Date()): ReviewGatingState {
  return { ...state, lastFeedbackSentAt: now.toISOString() };
}
