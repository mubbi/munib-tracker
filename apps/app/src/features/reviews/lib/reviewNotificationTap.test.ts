import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import {
  maybeOpenReviewFunnelFromInAppNotification,
  maybeOpenReviewFunnelFromNotificationData,
} from "@/features/reviews/lib/reviewNotificationTap";
import { registerReviewPromptOpener } from "@/features/reviews/lib/reviewPromptBridge";

const HOUR_MS = 60 * 60 * 1000;
const hoursAgo = (hours: number) => new Date(Date.now() - hours * HOUR_MS).toISOString();

const opener = jest.fn();

beforeEach(() => {
  opener.mockReset();
  registerReviewPromptOpener(opener);
});

afterEach(() => {
  registerReviewPromptOpener(null);
});

describe("maybeOpenReviewFunnelFromNotificationData", () => {
  it.each([
    ["no payload", undefined],
    ["another notification type", { type: "prayer" }],
  ])("ignores %s", (_label, data) => {
    expect(maybeOpenReviewFunnelFromNotificationData(data)).toBe(false);
    expect(opener).not.toHaveBeenCalled();
  });

  it.each([
    [
      "the payload trigger id",
      APP_FEEDBACK_TRIGGER_IDS.perfect_day,
      APP_FEEDBACK_TRIGGER_IDS.perfect_day,
    ],
    ["the manual trigger for unknown ids", "x", APP_FEEDBACK_TRIGGER_IDS.manual],
  ])("opens the funnel with %s", (_label, triggerId, expected) => {
    expect(
      maybeOpenReviewFunnelFromNotificationData({ type: "review_reactivation", triggerId }),
    ).toBe(true);
    expect(opener).toHaveBeenCalledWith(expected);
  });
});

describe("maybeOpenReviewFunnelFromInAppNotification", () => {
  it.each([
    ["a non-system kind", "broadcast", "weekly-1", hoursAgo(1)],
    ["a non-weekly id", "system", "other-1", hoursAgo(1)],
    ["a stale weekly report", "system", "weekly-1", hoursAgo(48)],
  ])("ignores %s", (_label, kind, id, createdAt) => {
    expect(maybeOpenReviewFunnelFromInAppNotification(kind, id, createdAt)).toBe(false);
    expect(opener).not.toHaveBeenCalled();
  });

  it("opens the weekly-report funnel for a fresh weekly report", () => {
    expect(maybeOpenReviewFunnelFromInAppNotification("system", "weekly-1", hoursAgo(1))).toBe(
      true,
    );
    expect(opener).toHaveBeenCalledWith(APP_FEEDBACK_TRIGGER_IDS.weekly_report);
  });
});
