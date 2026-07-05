import { DEFAULT_LOCATION } from "@/lib/location";
import { buildWidgetPayload } from "@/lib/widget-data";

describe("buildWidgetPayload", () => {
  it("builds a next-prayer payload from the location and clock", () => {
    const payload = buildWidgetPayload(
      DEFAULT_LOCATION,
      "en",
      new Date("2026-07-06T09:00:00.000Z"),
    );
    expect(payload.location).toBe(DEFAULT_LOCATION.label);
    expect(PRAYER_SLOTS).toContain(payload.nextPrayerId);
    expect(payload.minutesUntil).toBeGreaterThanOrEqual(0);
    expect(payload.nextPrayerTime).toMatch(/\d{1,2}:\d{2}/);
    expect(payload.displayDate.length).toBeGreaterThan(0);
    expect(payload.progress).toBeUndefined();
  });

  it("includes today's progress when a completed count is supplied", () => {
    const payload = buildWidgetPayload(DEFAULT_LOCATION, "en", new Date(), 3);
    expect(payload.progress).toBe("3/5");
  });
});

const PRAYER_SLOTS = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
