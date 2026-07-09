import { describe, expect, it, jest } from "@jest/globals";
import {
  canSendReviewReactivationPush,
  canShowManualReviewPrompt,
  canShowReviewPrompt,
  isManualReviewPromptAvailable,
  type ReviewPromptRuntime,
  recordSessionForeground,
  recordValueMoment,
} from "@/features/reviews/lib/reviewGating";
import { EMPTY_REVIEW_GATING, type ReviewGatingState } from "@/features/reviews/lib/reviewStorage";

jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
}));

jest.mock("@/lib/notifications/platform", () => ({
  isExpoGo: () => false,
}));

const readyRuntime: ReviewPromptRuntime = {
  isSyncing: false,
  prayersLogged: 10,
  currentStreak: 5,
  achievementsUnlocked: 2,
  hasCompletedOnboarding: true,
};

const FIXED_NOW = new Date("2026-06-11T12:00:00.000Z");

function readyState(overrides: Partial<ReviewGatingState> = {}): ReviewGatingState {
  const state: ReviewGatingState = {
    ...EMPTY_REVIEW_GATING,
    firstOpenAt: "2026-06-01T12:00:00.000Z",
    sessionCount: 5,
    meaningfulInteractionCount: 6,
    currentSessionStartedAt: "2026-06-11T11:00:00.000Z",
    ...overrides,
  };
  if (!("lastSessionValueAt" in overrides)) {
    return recordValueMoment(state, FIXED_NOW);
  }
  return state;
}

describe("reviewGating", () => {
  it("blocks automatic prompts on web", () => {
    const rn = jest.requireMock<{ Platform: { OS: string } }>("react-native");
    const original = rn.Platform.OS;
    rn.Platform.OS = "web";
    expect(canShowReviewPrompt(readyState(), readyRuntime).allowed).toBe(false);
    expect(canShowManualReviewPrompt(readyState()).allowed).toBe(true);
    rn.Platform.OS = original;
  });

  it("blocks when sync is pending", () => {
    const gate = canShowReviewPrompt(readyState(), {
      ...readyRuntime,
      isSyncing: true,
    });
    expect(gate.allowed).toBe(false);
    expect(gate.reason).toBe("sync_pending");
  });

  it("blocks without a value moment in the current session", () => {
    const gate = canShowReviewPrompt(
      readyState({ lastSessionValueAt: "2026-06-10T12:00:00.000Z" }),
      readyRuntime,
    );
    expect(gate.allowed).toBe(false);
    expect(gate.reason).toBe("no_value_moment");
  });

  it("allows when all gates pass", () => {
    expect(canShowReviewPrompt(readyState(), readyRuntime, FIXED_NOW).allowed).toBe(true);
  });

  it("canSendReviewReactivationPush ignores session coalescing flags", () => {
    const blocked = canShowReviewPrompt(
      readyState({ sessionPromptShown: true }),
      readyRuntime,
      FIXED_NOW,
    );
    expect(blocked.allowed).toBe(false);

    const pushGate = canSendReviewReactivationPush(
      readyState({ sessionPromptShown: true }),
      readyRuntime,
      FIXED_NOW,
    );
    expect(pushGate.allowed).toBe(true);
  });

  it("recordSessionForeground starts a new session after idle gap", () => {
    const prior = readyState({
      sessionCount: 4,
      lastForegroundAt: "2026-06-11T10:00:00.000Z",
      sessionPromptShown: true,
      sessionErrorAt: "2026-06-11T10:30:00.000Z",
    });
    const next = recordSessionForeground(prior, new Date("2026-06-11T12:00:00.000Z"));
    expect(next.sessionCount).toBe(5);
    expect(next.sessionPromptShown).toBe(false);
    expect(next.sessionErrorAt).toBeNull();
  });

  describe("dismiss backoff", () => {
    it("blocks within min(30, 7 × dismissStreak) days of last dismiss", () => {
      const gate = canShowReviewPrompt(
        readyState({ dismissStreak: 1, lastDismissedAt: "2026-06-08T12:00:00.000Z" }),
        readyRuntime,
        FIXED_NOW,
      );
      expect(gate.allowed).toBe(false);
      expect(gate.reason).toBe("dismiss_backoff");
    });

    it("allows once the streak window has elapsed", () => {
      const gate = canShowReviewPrompt(
        readyState({ dismissStreak: 1, lastDismissedAt: "2026-06-03T12:00:00.000Z" }),
        readyRuntime,
        FIXED_NOW,
      );
      expect(gate.allowed).toBe(true);
    });
  });

  describe("manual prompt gating", () => {
    it("allows an explicit tap even when soft engagement gates fail", () => {
      const gate = canShowManualReviewPrompt(EMPTY_REVIEW_GATING, FIXED_NOW);
      expect(gate.allowed).toBe(true);
    });

    it("still honors the lifetime cap", () => {
      const gate = canShowManualReviewPrompt(readyState({ promptCountLifetime: 3 }), FIXED_NOW);
      expect(gate.allowed).toBe(false);
      expect(gate.reason).toBe("lifetime_cap");
    });

    it("isManualReviewPromptAvailable requires load, no block, and passing gating", () => {
      expect(
        isManualReviewPromptAvailable(EMPTY_REVIEW_GATING, {
          loaded: false,
          blocked: false,
        }),
      ).toBe(false);
      expect(
        isManualReviewPromptAvailable(EMPTY_REVIEW_GATING, {
          loaded: true,
          blocked: true,
        }),
      ).toBe(false);
      expect(
        isManualReviewPromptAvailable(EMPTY_REVIEW_GATING, {
          loaded: true,
          blocked: false,
        }),
      ).toBe(true);
    });
  });
});
