import {
  daysUntilFullMoon,
  daysUntilNewMoon,
  moonAgeDays,
  moonIconGeometry,
  moonPhase,
  moonPhaseName,
} from "@/lib/moon";

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

  it("does not label waning gibbous as last quarter before the quarter point", () => {
    // Jul 6 2026 is waning gibbous (~57% lit); last quarter is Jul 7.
    const phase = moonPhase(new Date("2026-07-06T15:39:00Z"));
    expect(phase.name).toBe("waningGibbous");
    expect(phase.illumination).toBeGreaterThan(0.5);
    expect(phase.illumination).toBeLessThan(0.97);
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

describe("moonPhaseName", () => {
  it.each([
    [0, 0, true, "new"],
    [0.125, 0.146, true, "waxingCrescent"],
    [0.25, 0.5, true, "firstQuarter"],
    [0.375, 0.854, true, "waxingGibbous"],
    [0.5, 1, false, "full"],
    [0.625, 0.854, false, "waningGibbous"],
    [0.75, 0.5, false, "lastQuarter"],
    [0.875, 0.146, false, "waningCrescent"],
  ])("classifies fraction %s as %s", (fraction, illumination, waxing, expected) => {
    expect(moonPhaseName(fraction, illumination, waxing)).toBe(expected);
  });
});

describe("moonIconGeometry", () => {
  const north = (fraction: number, waxing: boolean) => moonIconGeometry(fraction, waxing, false);
  const south = (fraction: number, waxing: boolean) => moonIconGeometry(fraction, waxing, true);

  it.each([
    ["waxingCrescent", 0.125, true, true, true, false],
    ["firstQuarter", 0.25, true, true, false, false],
    ["waxingGibbous", 0.375, true, true, false, false],
    ["waningGibbous", 0.625, false, false, false, false],
    ["lastQuarter", 0.75, false, false, false, false],
    ["waningCrescent", 0.875, false, false, true, false],
  ] as const)("northern hemisphere %s lights the correct side", (_label, fraction, waxing, litOnRight, isCrescent, _) => {
    const g = north(fraction, waxing);
    expect(g.litOnRight).toBe(litOnRight);
    expect(g.isCrescent).toBe(isCrescent);
  });

  it("mirrors the lit side in the southern hemisphere", () => {
    expect(north(0.25, true).litOnRight).toBe(true);
    expect(south(0.25, true).litOnRight).toBe(false);
    expect(north(0.75, false).litOnRight).toBe(false);
    expect(south(0.75, false).litOnRight).toBe(true);
  });

  it("collapses the terminator at quarter moons and expands it at new/full", () => {
    expect(north(0.25, true).terminatorScaleX).toBeCloseTo(0, 5);
    expect(north(0.75, false).terminatorScaleX).toBeCloseTo(0, 5);
    expect(north(0, true).terminatorScaleX).toBeCloseTo(1, 5);
    expect(north(0.5, false).terminatorScaleX).toBeCloseTo(1, 5);
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
