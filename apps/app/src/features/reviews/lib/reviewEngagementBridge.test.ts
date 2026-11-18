import {
  getReviewPromptRuntime,
  recordReviewErrorMarker,
  registerReviewEngagement,
  trackReviewInteraction,
} from "@/features/reviews/lib/reviewEngagementBridge";
import type { ReviewPromptRuntime } from "@/features/reviews/lib/reviewGating";

const RUNTIME: ReviewPromptRuntime = {
  isSyncing: true,
  prayersLogged: 9,
  currentStreak: 4,
  achievementsUnlocked: 1,
  hasCompletedOnboarding: true,
};

function setup() {
  const handlers = {
    trackInteraction: jest.fn(),
    recordError: jest.fn(),
    getRuntime: jest.fn(() => RUNTIME),
  };
  registerReviewEngagement(handlers);
  return handlers;
}

describe("reviewEngagementBridge", () => {
  afterEach(() => {
    registerReviewEngagement(null);
  });

  describe("without handlers", () => {
    it.each([
      ["trackReviewInteraction", () => trackReviewInteraction("mark_prayer")],
      ["recordReviewErrorMarker", () => recordReviewErrorMarker()],
    ])("%s is a no-op", (_name, call) => {
      expect(call).not.toThrow();
    });

    it("returns an empty runtime", () => {
      expect(getReviewPromptRuntime()).toEqual({
        isSyncing: false,
        prayersLogged: 0,
        currentStreak: 0,
        achievementsUnlocked: 0,
        hasCompletedOnboarding: false,
      });
    });
  });

  describe("with handlers", () => {
    it("forwards interactions", () => {
      const handlers = setup();
      trackReviewInteraction("mark_zikr");
      expect(handlers.trackInteraction).toHaveBeenCalledWith("mark_zikr");
    });

    it("forwards error markers", () => {
      const handlers = setup();
      recordReviewErrorMarker();
      expect(handlers.recordError).toHaveBeenCalledTimes(1);
    });

    it("returns the registered runtime", () => {
      setup();
      expect(getReviewPromptRuntime()).toBe(RUNTIME);
    });
  });
});
