import { describe, expect, it } from "vitest";
import { ISLAMIC_HISTORY_CONTENT_VERSION, ISLAMIC_HISTORY_EVENTS } from "./islamic-history";

describe("islamic history timeline content (Rashidun-scoped)", () => {
  it("ships a versioned, non-empty timeline", () => {
    expect(ISLAMIC_HISTORY_CONTENT_VERSION).toBeGreaterThan(0);
    expect(ISLAMIC_HISTORY_EVENTS.length).toBeGreaterThanOrEqual(12);
    expect(ISLAMIC_HISTORY_EVENTS.length).toBeLessThanOrEqual(18);
  });

  it("gives every event a unique id, title, and body", () => {
    const ids = ISLAMIC_HISTORY_EVENTS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const event of ISLAMIC_HISTORY_EVENTS) {
      expect(event.title.trim().length).toBeGreaterThan(0);
      expect(event.body.trim().length).toBeGreaterThan(150);
    }
  });

  it("is ordered chronologically by year", () => {
    const years = ISLAMIC_HISTORY_EVENTS.map((e) => e.year);
    for (let i = 1; i < years.length; i += 1) {
      expect(years[i] ?? 0).toBeGreaterThanOrEqual(years[i - 1] ?? 0);
    }
  });

  it("stays within the Prophet's ﷺ death through end-of-Rashidun window (11–41 AH)", () => {
    for (const event of ISLAMIC_HISTORY_EVENTS) {
      expect(event.ah).toBeGreaterThanOrEqual(11);
      expect(event.ah).toBeLessThanOrEqual(41);
      expect(event.year).toBeGreaterThanOrEqual(632);
      expect(event.year).toBeLessThanOrEqual(661);
    }
  });

  it("uses only the declared era tags and covers each Caliph's era", () => {
    const allowedEras = new Set(["prophetic-close", "abu-bakr", "umar", "uthman", "ali"]);
    for (const event of ISLAMIC_HISTORY_EVENTS) {
      expect(allowedEras.has(event.era)).toBe(true);
    }
    for (const era of ["abu-bakr", "umar", "uthman", "ali"]) {
      const count = ISLAMIC_HISTORY_EVENTS.filter((e) => e.era === era).length;
      expect(count).toBeGreaterThan(0);
    }
  });

  it("closes the timeline with the end of the Rashidun Caliphate, not later history", () => {
    const last = ISLAMIC_HISTORY_EVENTS[ISLAMIC_HISTORY_EVENTS.length - 1];
    expect(last?.id).toBe("end-of-rashidun");
    expect(last?.ah).toBe(41);
  });
});
