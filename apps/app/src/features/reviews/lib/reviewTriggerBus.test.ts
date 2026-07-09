import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import {
  clearPendingReviewTrigger,
  emitReviewTrigger,
  flushReviewTriggerForRoute,
  flushReviewTriggerImmediate,
  registerReviewTriggerFlush,
} from "@/features/reviews/lib/reviewTriggerBus";

describe("reviewTriggerBus", () => {
  beforeEach(() => {
    clearPendingReviewTrigger();
    registerReviewTriggerFlush(null);
  });

  it("keeps higher-priority trigger when multiple emit", () => {
    const flush = jest.fn();
    registerReviewTriggerFlush(flush);

    emitReviewTrigger(APP_FEEDBACK_TRIGGER_IDS.weekly_report);
    emitReviewTrigger(APP_FEEDBACK_TRIGGER_IDS.perfect_day);

    flushReviewTriggerImmediate();
    expect(flush).toHaveBeenCalledTimes(1);
    expect(flush).toHaveBeenCalledWith(APP_FEEDBACK_TRIGGER_IDS.perfect_day);
  });

  it("flushes only when route matches deferral", () => {
    const flush = jest.fn();
    registerReviewTriggerFlush(flush);

    emitReviewTrigger(APP_FEEDBACK_TRIGGER_IDS.weekly_report, {
      deferRoute: "home",
    });

    flushReviewTriggerForRoute("tracker");
    expect(flush).not.toHaveBeenCalled();

    flushReviewTriggerForRoute("home");
    expect(flush).toHaveBeenCalledWith(APP_FEEDBACK_TRIGGER_IDS.weekly_report);
  });

  it("manual trigger replaces a deferred automatic trigger", () => {
    const flush = jest.fn();
    registerReviewTriggerFlush(flush);

    emitReviewTrigger(APP_FEEDBACK_TRIGGER_IDS.perfect_day, {
      deferRoute: "tracker",
    });
    emitReviewTrigger(APP_FEEDBACK_TRIGGER_IDS.manual, { deferRoute: "none" });

    flushReviewTriggerImmediate();
    expect(flush).toHaveBeenCalledTimes(1);
    expect(flush).toHaveBeenCalledWith(APP_FEEDBACK_TRIGGER_IDS.manual);
  });

  it("flushReviewTriggerImmediate skips deferred triggers", () => {
    const flush = jest.fn();
    registerReviewTriggerFlush(flush);

    emitReviewTrigger(APP_FEEDBACK_TRIGGER_IDS.streak_milestone, {
      deferRoute: "home",
    });

    flushReviewTriggerImmediate();
    expect(flush).not.toHaveBeenCalled();

    flushReviewTriggerForRoute("home");
    expect(flush).toHaveBeenCalledWith(APP_FEEDBACK_TRIGGER_IDS.streak_milestone);
  });
});
