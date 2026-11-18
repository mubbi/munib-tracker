import {
  canSendReviewReactivationPush,
  canShowManualReviewPrompt,
  canShowReviewPrompt,
  isManualReviewPromptAvailable,
  type ReviewPromptRuntime,
  recordDismissed,
  recordFeedbackSent,
  recordMeaningfulInteraction,
  recordPromptShown,
  recordReviewError,
  recordSessionForeground,
  recordStoreReviewRequest,
  recordValueMoment,
} from "@/features/reviews/lib/reviewGating";
import { EMPTY_REVIEW_GATING, type ReviewGatingState } from "@/features/reviews/lib/reviewStorage";
import { usePlatform } from "@/test-support/platform";

let mockIsExpoGo = false;

jest.mock("@/lib/notifications/platform", () => ({
  isExpoGo: () => mockIsExpoGo,
}));

const FIXED_NOW = new Date("2026-06-11T12:00:00.000Z");
const ISO_NOW = FIXED_NOW.toISOString();

function buildRuntime(overrides: Partial<ReviewPromptRuntime> = {}): ReviewPromptRuntime {
  return {
    isSyncing: false,
    prayersLogged: 10,
    currentStreak: 5,
    achievementsUnlocked: 2,
    hasCompletedOnboarding: true,
    ...overrides,
  };
}

/** Gating state that passes every automatic gate at FIXED_NOW. */
function readyState(overrides: Partial<ReviewGatingState> = {}): ReviewGatingState {
  return {
    ...EMPTY_REVIEW_GATING,
    firstOpenAt: "2026-06-01T12:00:00.000Z",
    sessionCount: 5,
    meaningfulInteractionCount: 6,
    currentSessionStartedAt: "2026-06-11T11:00:00.000Z",
    lastSessionValueAt: ISO_NOW,
    ...overrides,
  };
}

function autoGate(
  overrides: Partial<ReviewGatingState> = {},
  runtime: Partial<ReviewPromptRuntime> = {},
) {
  return canShowReviewPrompt(readyState(overrides), buildRuntime(runtime), FIXED_NOW);
}

beforeEach(() => {
  mockIsExpoGo = false;
});

describe("canShowReviewPrompt", () => {
  it("allows when all gates pass", () => {
    expect(autoGate()).toEqual({ allowed: true });
  });

  it("blocks inside Expo Go", () => {
    mockIsExpoGo = true;
    expect(autoGate().reason).toBe("expo_go");
  });

  it.each([
    ["min_sessions", { sessionCount: 1 }, {}],
    ["install_age", { firstOpenAt: "2026-06-10T12:00:00.000Z" }, {}],
    ["recent_error", { lastErrorAt: "2026-06-09T12:00:00.000Z" }, {}],
    ["sync_pending", {}, { isSyncing: true }],
    ["session_error", { sessionErrorAt: "2026-06-11T11:30:00.000Z" }, {}],
    ["min_interactions", { meaningfulInteractionCount: 1 }, {}],
    ["no_value_moment", { lastSessionValueAt: null }, {}],
    ["no_value_moment", { currentSessionStartedAt: null }, {}],
    ["no_value_moment", { lastSessionValueAt: "2026-06-10T12:00:00.000Z" }, {}],
    ["insufficient_usage", {}, { prayersLogged: 0, currentStreak: 0, achievementsUnlocked: 0 }],
    ["setup_incomplete", {}, { hasCompletedOnboarding: false }],
    ["lifetime_cap", { promptCountLifetime: 3 }, {}],
    ["store_cooldown", { lastStoreReviewRequestAt: "2026-05-01T12:00:00.000Z" }, {}],
    ["dismiss_backoff", { dismissStreak: 1, lastDismissedAt: "2026-06-08T12:00:00.000Z" }, {}],
    ["dismiss_backoff", { dismissStreak: 0, lastDismissedAt: "2026-06-08T12:00:00.000Z" }, {}],
    ["dismiss_backoff", { dismissStreak: 10, lastDismissedAt: "2026-05-20T12:00:00.000Z" }, {}],
    ["session_prompt_shown", { sessionPromptShown: true }, {}],
    ["trigger_coalesced", { lastTriggerCoalesceAt: "2026-06-11T11:50:00.000Z" }, {}],
  ] as const)("blocks with %s for %o / %o", (reason, overrides, runtime) => {
    expect(autoGate(overrides, runtime)).toEqual({ allowed: false, reason });
  });

  it.each([
    ["no firstOpenAt", { firstOpenAt: null }, {}],
    ["an old error", { lastErrorAt: "2026-05-01T12:00:00.000Z" }, {}],
    ["an expired store cooldown", { lastStoreReviewRequestAt: "2025-01-01T12:00:00.000Z" }, {}],
    ["an expired coalesce window", { lastTriggerCoalesceAt: "2026-06-11T10:00:00.000Z" }, {}],
    [
      "an elapsed dismiss window",
      { dismissStreak: 1, lastDismissedAt: "2026-06-03T12:00:00.000Z" },
      {},
    ],
    [
      "a capped dismiss window",
      { dismissStreak: 10, lastDismissedAt: "2026-05-01T12:00:00.000Z" },
      {},
    ],
    ["streak-only usage", {}, { prayersLogged: 0, currentStreak: 3, achievementsUnlocked: 0 }],
    ["achievement-only usage", {}, { prayersLogged: 0, currentStreak: 0, achievementsUnlocked: 1 }],
  ] as const)("allows with %s", (_label, overrides, runtime) => {
    expect(autoGate(overrides, runtime).allowed).toBe(true);
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("blocks automatic prompts", () => {
      expect(autoGate()).toEqual({ allowed: false, reason: "web" });
    });

    it("still allows manual prompts", () => {
      expect(canShowManualReviewPrompt(readyState(), FIXED_NOW).allowed).toBe(true);
    });
  });
});

describe("canShowManualReviewPrompt", () => {
  it("allows an explicit tap even when soft engagement gates fail", () => {
    expect(canShowManualReviewPrompt(EMPTY_REVIEW_GATING, FIXED_NOW)).toEqual({ allowed: true });
  });

  it.each([
    ["lifetime_cap", { promptCountLifetime: 3 }],
    ["store_cooldown", { lastStoreReviewRequestAt: "2026-06-01T12:00:00.000Z" }],
  ] as const)("blocks with %s", (reason, overrides) => {
    expect(canShowManualReviewPrompt(readyState(overrides), FIXED_NOW)).toEqual({
      allowed: false,
      reason,
    });
  });

  it("allows once the store cooldown has elapsed", () => {
    const state = readyState({ lastStoreReviewRequestAt: "2025-01-01T12:00:00.000Z" });
    expect(canShowManualReviewPrompt(state, FIXED_NOW).allowed).toBe(true);
  });
});

describe("isManualReviewPromptAvailable", () => {
  it.each([
    ["not loaded", EMPTY_REVIEW_GATING, { loaded: false, blocked: false }, false],
    ["blocked", EMPTY_REVIEW_GATING, { loaded: true, blocked: true }, false],
    ["missing state", null, { loaded: true, blocked: false }, false],
    ["loaded and unblocked", EMPTY_REVIEW_GATING, { loaded: true, blocked: false }, true],
  ] as const)("is %s → %s", (_label, state, options, expected) => {
    expect(isManualReviewPromptAvailable(state, options)).toBe(expected);
  });
});

describe("canSendReviewReactivationPush", () => {
  it.each([
    ["the session prompt flag", { sessionPromptShown: true }],
    ["the coalesce stamp", { lastTriggerCoalesceAt: "2026-06-11T11:55:00.000Z" }],
    ["nothing", {}],
  ] as const)("ignores %s", (_label, overrides) => {
    expect(canSendReviewReactivationPush(readyState(overrides), buildRuntime(), FIXED_NOW)).toEqual(
      { allowed: true },
    );
  });
});

describe("recordSessionForeground", () => {
  it("starts the first session and stamps firstOpenAt", () => {
    expect(recordSessionForeground(EMPTY_REVIEW_GATING, FIXED_NOW)).toMatchObject({
      firstOpenAt: ISO_NOW,
      lastForegroundAt: ISO_NOW,
      currentSessionStartedAt: ISO_NOW,
      sessionCount: 1,
    });
  });

  it("starts a new session after the idle gap", () => {
    const prior = readyState({
      sessionCount: 4,
      lastForegroundAt: "2026-06-11T10:00:00.000Z",
      sessionPromptShown: true,
      sessionErrorAt: "2026-06-11T10:30:00.000Z",
    });
    expect(recordSessionForeground(prior, FIXED_NOW)).toMatchObject({
      sessionCount: 5,
      sessionPromptShown: false,
      sessionErrorAt: null,
    });
  });

  it("keeps the current session within the idle window", () => {
    const prior = readyState({
      sessionCount: 4,
      lastForegroundAt: "2026-06-11T11:50:00.000Z",
      sessionPromptShown: true,
    });
    expect(recordSessionForeground(prior, FIXED_NOW)).toMatchObject({
      sessionCount: 4,
      sessionPromptShown: true,
      firstOpenAt: prior.firstOpenAt,
      lastForegroundAt: ISO_NOW,
    });
  });
});

describe("record helpers", () => {
  const base = readyState({ dismissStreak: 2, promptCountLifetime: 1 });

  it.each([
    [
      "recordValueMoment",
      () => recordValueMoment(base, FIXED_NOW),
      { lastSessionValueAt: ISO_NOW },
    ],
    [
      "recordMeaningfulInteraction",
      () => recordMeaningfulInteraction(base),
      { meaningfulInteractionCount: 7 },
    ],
    [
      "recordReviewError",
      () => recordReviewError(base, FIXED_NOW),
      { lastErrorAt: ISO_NOW, sessionErrorAt: ISO_NOW },
    ],
    [
      "recordPromptShown",
      () => recordPromptShown(base, FIXED_NOW),
      {
        lastPromptedAt: ISO_NOW,
        promptCountLifetime: 2,
        sessionPromptShown: true,
        lastTriggerCoalesceAt: ISO_NOW,
      },
    ],
    [
      "recordDismissed",
      () => recordDismissed(base, FIXED_NOW),
      { lastDismissedAt: ISO_NOW, dismissStreak: 3 },
    ],
    [
      "recordStoreReviewRequest",
      () => recordStoreReviewRequest(base, FIXED_NOW),
      { lastStoreReviewRequestAt: ISO_NOW, dismissStreak: 0 },
    ],
    [
      "recordFeedbackSent",
      () => recordFeedbackSent(base, FIXED_NOW),
      { lastFeedbackSentAt: ISO_NOW, dismissStreak: 0 },
    ],
  ] as const)("%s updates the state", (_name, apply, expected) => {
    expect(apply()).toMatchObject(expected);
  });

  it.each([
    ["recordValueMoment", () => recordValueMoment(base).lastSessionValueAt],
    ["recordReviewError", () => recordReviewError(base).lastErrorAt],
    ["recordPromptShown", () => recordPromptShown(base).lastPromptedAt],
    ["recordDismissed", () => recordDismissed(base).lastDismissedAt],
    ["recordStoreReviewRequest", () => recordStoreReviewRequest(base).lastStoreReviewRequestAt],
    ["recordFeedbackSent", () => recordFeedbackSent(base).lastFeedbackSentAt],
    ["recordSessionForeground", () => recordSessionForeground(base).lastForegroundAt],
  ] as const)("%s defaults to the current time", (_name, stamp) => {
    expect(Number.isNaN(Date.parse(stamp() ?? ""))).toBe(false);
  });
});

describe("default evaluation time", () => {
  it.each([
    [
      "canShowReviewPrompt",
      () => canShowReviewPrompt(readyState({ sessionCount: 0 }), buildRuntime()),
    ],
    [
      "canShowManualReviewPrompt",
      () => canShowManualReviewPrompt(readyState({ promptCountLifetime: 3 })),
    ],
    [
      "canSendReviewReactivationPush",
      () => canSendReviewReactivationPush(readyState({ sessionCount: 0 }), buildRuntime()),
    ],
  ])("%s evaluates against the current time", (_name, evaluate) => {
    expect(evaluate().allowed).toBe(false);
  });
});
