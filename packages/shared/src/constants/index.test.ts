import { describe, expect, it } from "vitest";
import {
  clampPrayerReminderOffset,
  PRAYER_REMINDER_OFFSET_MAX,
  PRAYER_REMINDER_OFFSET_MIN,
} from "./index";

describe("clampPrayerReminderOffset", () => {
  it.each([
    [-500, PRAYER_REMINDER_OFFSET_MIN],
    [500, PRAYER_REMINDER_OFFSET_MAX],
    [15, 15],
  ])("%i -> %i", (minutes, expected) => {
    expect(clampPrayerReminderOffset(minutes)).toBe(expected);
  });
});
