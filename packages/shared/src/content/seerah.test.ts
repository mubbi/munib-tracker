import { describe, expect, it } from "vitest";
import { SEERAH_CONTENT_VERSION, SEERAH_EVENTS } from "./seerah";

describe("seerah timeline content (NF-2.4)", () => {
  it("ships a versioned, non-empty timeline", () => {
    expect(SEERAH_CONTENT_VERSION).toBeGreaterThan(0);
    expect(SEERAH_EVENTS.length).toBeGreaterThanOrEqual(30);
  });

  it("gives every event a unique id, title, and body", () => {
    const ids = SEERAH_EVENTS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const event of SEERAH_EVENTS) {
      expect(event.title.trim().length).toBeGreaterThan(0);
      expect(event.body.trim().length).toBeGreaterThan(0);
    }
  });

  it("is ordered chronologically by year", () => {
    const years = SEERAH_EVENTS.map((e) => e.year);
    for (let i = 1; i < years.length; i += 1) {
      expect(years[i] ?? 0).toBeGreaterThanOrEqual(years[i - 1] ?? 0);
    }
  });

  it("marks the Hijra as AH 1 and only dates later events with AH", () => {
    const hijra = SEERAH_EVENTS.find((e) => e.id === "hijra");
    expect(hijra?.ah).toBe(1);
    for (const event of SEERAH_EVENTS) {
      if (event.ah != null) expect(event.year).toBeGreaterThanOrEqual(622);
    }
  });
});
