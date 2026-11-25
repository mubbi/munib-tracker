import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import {
  deferRouteForTrigger,
  invokeOpenWriteReview,
  registerWriteReviewOpener,
} from "@/features/reviews/lib/reviewPromptBridge";

describe("deferRouteForTrigger", () => {
  it.each([
    [APP_FEEDBACK_TRIGGER_IDS.perfect_day, "tracker"],
    [APP_FEEDBACK_TRIGGER_IDS.achievement_unlock, "tracker"],
    [APP_FEEDBACK_TRIGGER_IDS.qaza_cleared, "tracker"],
    [APP_FEEDBACK_TRIGGER_IDS.weekly_report, "home"],
    [APP_FEEDBACK_TRIGGER_IDS.streak_milestone, "home"],
  ] as const)("%s → %s", (triggerId, route) => {
    expect(deferRouteForTrigger(triggerId)).toBe(route);
  });
});

describe("write-review opener", () => {
  afterEach(() => registerWriteReviewOpener(null));

  it("reports false when no provider is mounted", () => {
    expect(invokeOpenWriteReview()).toBe(false);
  });

  it("calls the registered opener", () => {
    const opener = jest.fn();
    registerWriteReviewOpener(opener);
    expect(invokeOpenWriteReview()).toBe(true);
    expect(opener).toHaveBeenCalledTimes(1);
  });
});
