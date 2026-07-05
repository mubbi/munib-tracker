import { getUpcomingEvents, ISLAMIC_EVENTS } from "@/lib/islamic-events";

describe("getUpcomingEvents", () => {
  it("returns upcoming events sorted soonest-first, all in the future", () => {
    const today = "2026-07-06";
    const events = getUpcomingEvents(today, 8);
    expect(events.length).toBe(8);
    for (const e of events) {
      expect(e.date >= today).toBe(true);
      expect(e.daysUntil).toBeGreaterThanOrEqual(0);
      expect(ISLAMIC_EVENTS.some((def) => def.id === e.id)).toBe(true);
    }
    // Sorted ascending by date.
    for (let i = 1; i < events.length; i += 1) {
      expect(events[i - 1].date <= events[i].date).toBe(true);
    }
  });

  it("respects the count limit", () => {
    expect(getUpcomingEvents("2026-07-06", 3)).toHaveLength(3);
  });
});
