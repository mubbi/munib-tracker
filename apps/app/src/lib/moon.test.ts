import { daysUntilFullMoon, daysUntilNewMoon, moonAgeDays, moonPhase } from "@/lib/moon";

const SYNODIC = 29.530588853;

describe("moonPhase", () => {
  // Reference lunar events (UTC), cross-checked against published moon calendars.
  it.each([
    ["2000-01-06T18:14:00Z", "new"],
    ["2024-01-11T11:57:00Z", "new"],
    ["2024-01-25T17:54:00Z", "full"],
    ["2024-02-09T23:00:00Z", "new"],
  ])("names the phase near %s as %s", (iso, expected) => {
    expect(moonPhase(new Date(iso)).name).toBe(expected);
  });

  it("reports near-zero illumination at a new moon and near-full at a full moon", () => {
    expect(moonPhase(new Date("2024-01-11T11:57:00Z")).illumination).toBeLessThan(0.02);
    expect(moonPhase(new Date("2024-01-25T17:54:00Z")).illumination).toBeGreaterThan(0.98);
  });

  it("is waxing on the way up and waning on the way down", () => {
    // ~4 days after new: waxing crescent, growing.
    expect(moonPhase(new Date("2024-01-15T12:00:00Z")).waxing).toBe(true);
    // ~4 days after full: waning gibbous, shrinking.
    expect(moonPhase(new Date("2024-01-29T12:00:00Z")).waxing).toBe(false);
  });

  it("keeps fraction within [0, 1) and illumination within [0, 1]", () => {
    const cursor = new Date("2024-01-01T00:00:00Z");
    for (let i = 0; i < 60; i += 1) {
      const { fraction, illumination } = moonPhase(cursor);
      expect(fraction).toBeGreaterThanOrEqual(0);
      expect(fraction).toBeLessThan(1);
      expect(illumination).toBeGreaterThanOrEqual(0);
      expect(illumination).toBeLessThanOrEqual(1);
      cursor.setDate(cursor.getDate() + 1);
    }
  });
});

describe("moon almanac helpers", () => {
  it("reports moon age as days since the new moon", () => {
    expect(moonAgeDays(0)).toBeCloseTo(0, 5);
    expect(moonAgeDays(0.5)).toBeCloseTo(SYNODIC / 2, 5);
  });

  it("counts down to the next new moon", () => {
    expect(daysUntilNewMoon(0)).toBeCloseTo(SYNODIC, 5); // just after new → ~a full cycle
    expect(daysUntilNewMoon(0.5)).toBeCloseTo(SYNODIC / 2, 5); // at full → half a cycle
  });

  it("counts down to the next full moon, wrapping past it", () => {
    expect(daysUntilFullMoon(0)).toBeCloseTo(SYNODIC / 2, 5); // new → half a cycle to full
    expect(daysUntilFullMoon(0.5)).toBeCloseTo(0, 5); // exactly full
    // Just past full, the next full is almost a whole cycle away.
    expect(daysUntilFullMoon(0.6)).toBeCloseTo(0.9 * SYNODIC, 5);
  });
});
