import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import {
  deferRouteForTrigger,
  invokeOpenReviewFunnel,
  parseReviewReactivationTriggerId,
  registerReviewPromptOpener,
} from "@/features/reviews/lib/reviewPromptBridge";

const ids = APP_FEEDBACK_TRIGGER_IDS;

describe("reviewPromptBridge", () => {
  afterEach(() => {
    registerReviewPromptOpener(null);
  });

  it("does nothing without a registered opener", () => {
    expect(() => invokeOpenReviewFunnel(ids.manual)).not.toThrow();
  });

  it("invokes the registered opener with the trigger", () => {
    const opener = jest.fn();
    registerReviewPromptOpener(opener);
    invokeOpenReviewFunnel(ids.perfect_day);
    expect(opener).toHaveBeenCalledWith(ids.perfect_day);
  });

  it.each([
    [ids.weekly_report, ids.weekly_report],
    ["nope", null],
    [42, null],
    [undefined, null],
  ])("parses %p as %p", (value, expected) => {
    expect(parseReviewReactivationTriggerId(value)).toBe(expected);
  });

  it.each([
    [ids.perfect_day, "tracker"],
    [ids.achievement_unlock, "tracker"],
    [ids.qaza_cleared, "tracker"],
    [ids.weekly_report, "home"],
    [ids.streak_milestone, "home"],
    [ids.manual, "none"],
  ] as const)("defers %s to %s", (triggerId, route) => {
    expect(deferRouteForTrigger(triggerId)).toBe(route);
  });
});
