import {
  APP_FEEDBACK_TRIGGER_IDS,
  REVIEW_TRIGGER_MAX_AGE_MINUTES,
} from "@munib-tracker/shared/reviews";
import {
  clearPendingReviewTrigger,
  emitReviewTrigger,
  flushReviewTriggerForRoute,
  registerReviewTriggerFlush,
} from "@/features/reviews/lib/reviewTriggerBus";

const { perfect_day, weekly_report, streak_milestone, qaza_cleared } = APP_FEEDBACK_TRIGGER_IDS;
const T0 = 1_000_000;
const MAX_AGE_MS = REVIEW_TRIGGER_MAX_AGE_MINUTES * 60 * 1000;

describe("reviewTriggerBus", () => {
  const flush = jest.fn();

  beforeEach(() => {
    flush.mockReset();
    clearPendingReviewTrigger();
    registerReviewTriggerFlush(flush);
  });

  afterEach(() => registerReviewTriggerFlush(null));

  it("keeps the higher-priority trigger when several emit", () => {
    emitReviewTrigger(weekly_report, { now: T0 });
    emitReviewTrigger(perfect_day, { now: T0 });
    flushReviewTriggerForRoute("home", T0);
    expect(flush.mock.calls).toEqual([[perfect_day]]);
  });

  it("keeps the pending trigger when a lower-priority one arrives", () => {
    emitReviewTrigger(perfect_day, { now: T0 });
    emitReviewTrigger(qaza_cleared, { deferRoute: "tracker", now: T0 });
    flushReviewTriggerForRoute("home", T0);
    expect(flush).toHaveBeenCalledWith(perfect_day);
  });

  it("waits for the trigger's own screen", () => {
    emitReviewTrigger(streak_milestone, { deferRoute: "home", now: T0 });
    flushReviewTriggerForRoute("tracker", T0);
    expect(flush).not.toHaveBeenCalled();
    flushReviewTriggerForRoute("home", T0);
    expect(flush).toHaveBeenCalledWith(streak_milestone);
  });

  it("flushes at most once", () => {
    emitReviewTrigger(perfect_day, { now: T0 });
    flushReviewTriggerForRoute("tracker", T0);
    flushReviewTriggerForRoute("tracker", T0);
    expect(flush).toHaveBeenCalledTimes(1);
  });

  it("drops a moment that has gone stale", () => {
    emitReviewTrigger(perfect_day, { deferRoute: "tracker", now: T0 });
    flushReviewTriggerForRoute("tracker", T0 + MAX_AGE_MS + 1);
    expect(flush).not.toHaveBeenCalled();
    flushReviewTriggerForRoute("tracker", T0 + MAX_AGE_MS + 2);
    expect(flush).not.toHaveBeenCalled();
  });

  it("lets a fresh lower-priority moment replace a stale one", () => {
    emitReviewTrigger(perfect_day, { deferRoute: "tracker", now: T0 });
    emitReviewTrigger(qaza_cleared, { deferRoute: "tracker", now: T0 + MAX_AGE_MS + 1 });
    flushReviewTriggerForRoute("tracker", T0 + MAX_AGE_MS + 2);
    expect(flush).toHaveBeenCalledWith(qaza_cleared);
  });

  it("holds the trigger until a handler is registered", () => {
    registerReviewTriggerFlush(null);
    emitReviewTrigger(perfect_day, { now: T0 });
    flushReviewTriggerForRoute("tracker", T0);
    registerReviewTriggerFlush(flush);
    flushReviewTriggerForRoute("tracker", T0);
    expect(flush).toHaveBeenCalledWith(perfect_day);
  });
});
