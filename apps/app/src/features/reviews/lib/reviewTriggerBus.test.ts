import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import type { ReviewDeferRoute } from "@/features/reviews/lib/reviewPromptBridge";
import {
  clearPendingReviewTrigger,
  emitReviewTrigger,
  flushReviewTriggerForRoute,
  flushReviewTriggerImmediate,
  registerReviewTriggerFlush,
} from "@/features/reviews/lib/reviewTriggerBus";

const { perfect_day, weekly_report, streak_milestone, qaza_cleared, manual } =
  APP_FEEDBACK_TRIGGER_IDS;

/** Registers a flush spy and emits the given triggers in order. */
function setup(...emits: [Parameters<typeof emitReviewTrigger>[0], ReviewDeferRoute?][]) {
  const flush = jest.fn();
  registerReviewTriggerFlush(flush);
  for (const [triggerId, deferRoute] of emits) {
    emitReviewTrigger(triggerId, deferRoute ? { deferRoute } : undefined);
  }
  return flush;
}

describe("reviewTriggerBus", () => {
  beforeEach(() => {
    clearPendingReviewTrigger();
    registerReviewTriggerFlush(null);
  });

  it("keeps the higher-priority trigger when several emit", () => {
    const flush = setup([weekly_report], [perfect_day]);
    flushReviewTriggerImmediate();
    expect(flush.mock.calls).toEqual([[perfect_day]]);
  });

  it("keeps the pending trigger when a lower-priority one arrives", () => {
    const flush = setup([perfect_day], [qaza_cleared, "tracker"]);
    flushReviewTriggerForRoute("home");
    expect(flush).toHaveBeenCalledWith(perfect_day);
  });

  it("lets a manual trigger replace a deferred automatic one", () => {
    const flush = setup([perfect_day, "tracker"], [manual, "none"]);
    flushReviewTriggerImmediate();
    expect(flush.mock.calls).toEqual([[manual]]);
  });

  it("does not flush a deferred trigger on another route", () => {
    const flush = setup([weekly_report, "home"]);
    flushReviewTriggerForRoute("tracker");
    expect(flush).not.toHaveBeenCalled();
  });

  it("flushes a deferred trigger on its route", () => {
    const flush = setup([weekly_report, "home"]);
    flushReviewTriggerForRoute("home");
    expect(flush).toHaveBeenCalledWith(weekly_report);
  });

  it("does not flush a deferred trigger immediately", () => {
    const flush = setup([streak_milestone, "home"]);
    flushReviewTriggerImmediate();
    expect(flush).not.toHaveBeenCalled();
  });

  it.each([
    ["for a route", () => flushReviewTriggerForRoute("home")],
    ["immediately", () => flushReviewTriggerImmediate()],
  ])("does nothing %s without a pending trigger", (_label, flushNow) => {
    const flush = setup();
    flushNow();
    expect(flush).not.toHaveBeenCalled();
  });

  it("keeps the trigger pending until a flush handler registers", () => {
    emitReviewTrigger(manual);
    flushReviewTriggerForRoute("none");
    flushReviewTriggerImmediate();
    const flush = setup();
    flushReviewTriggerImmediate();
    expect(flush).toHaveBeenCalledWith(manual);
  });
});
