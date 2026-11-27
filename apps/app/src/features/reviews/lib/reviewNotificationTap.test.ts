import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import {
  isLegacyReviewNotification,
  noteWeeklyReportOpened,
} from "@/features/reviews/lib/reviewNotificationTap";
import {
  clearPendingReviewTrigger,
  flushReviewTriggerForRoute,
  registerReviewTriggerFlush,
} from "@/features/reviews/lib/reviewTriggerBus";

const NOW = Date.parse("2026-11-25T12:00:00.000Z");
const HOUR_MS = 60 * 60 * 1000;
const hoursAgo = (hours: number) => new Date(NOW - hours * HOUR_MS).toISOString();

describe("isLegacyReviewNotification", () => {
  it.each([
    [undefined, false],
    [{ type: "prayer" }, false],
    [{ type: "review_reactivation", triggerId: "perfect_day" }, true],
  ])("%j → %s", (data, expected) => {
    expect(isLegacyReviewNotification(data)).toBe(expected);
  });
});

describe("noteWeeklyReportOpened", () => {
  const flush = jest.fn();

  beforeEach(() => {
    flush.mockReset();
    clearPendingReviewTrigger();
    registerReviewTriggerFlush(flush);
  });

  afterEach(() => registerReviewTriggerFlush(null));

  it("queues weekly_report for Home when a fresh report is opened", () => {
    expect(noteWeeklyReportOpened("system", "weekly-2026-11-25", hoursAgo(2), NOW)).toBe(true);
    flushReviewTriggerForRoute("tracker", NOW);
    expect(flush).not.toHaveBeenCalled();
    flushReviewTriggerForRoute("home", NOW);
    expect(flush).toHaveBeenCalledWith(APP_FEEDBACK_TRIGGER_IDS.weekly_report);
  });

  it.each([
    ["another kind", "reminder", "weekly-2026-11-25", hoursAgo(1)],
    ["another system row", "system", "update-1", hoursAgo(1)],
    ["a stale report", "system", "weekly-2026-11-18", hoursAgo(25)],
    ["a bad date", "system", "weekly-2026-11-25", "nope"],
  ])("ignores %s", (_label, kind, id, createdAt) => {
    expect(noteWeeklyReportOpened(kind, id, createdAt, NOW)).toBe(false);
    flushReviewTriggerForRoute("home", NOW);
    expect(flush).not.toHaveBeenCalled();
  });
});
