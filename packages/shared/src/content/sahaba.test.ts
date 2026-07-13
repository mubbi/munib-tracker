import { describe, expect, it } from "vitest";
import { SAHABA_CATEGORY_ORDER, SAHABA_CONTENT_VERSION, SAHABA_PROFILES } from "./sahaba";

describe("sahaba directory content", () => {
  it("ships a versioned, non-empty companion directory", () => {
    expect(SAHABA_CONTENT_VERSION).toBeGreaterThan(0);
    expect(SAHABA_PROFILES.length).toBeGreaterThanOrEqual(28);
    expect(SAHABA_PROFILES.length).toBeLessThanOrEqual(32);
  });

  it("gives every companion a unique id, name, summary, and body", () => {
    const ids = SAHABA_PROFILES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const profile of SAHABA_PROFILES) {
      expect(profile.name.trim().length).toBeGreaterThan(0);
      expect(profile.summary.trim().length).toBeGreaterThan(0);
      expect(profile.body.trim().length).toBeGreaterThan(120);
      expect(profile.categories.length).toBeGreaterThan(0);
    }
  });

  it("keeps every category on a profile within the declared category order", () => {
    const allowed = new Set(SAHABA_CATEGORY_ORDER);
    for (const profile of SAHABA_PROFILES) {
      for (const category of profile.categories) {
        expect(allowed.has(category)).toBe(true);
      }
    }
  });

  it("covers every declared category with at least one companion", () => {
    for (const category of SAHABA_CATEGORY_ORDER) {
      const count = SAHABA_PROFILES.filter((p) => p.categories.includes(category)).length;
      expect(count).toBeGreaterThan(0);
    }
  });

  it("includes all four rightly guided Caliphs and the ten promised Paradise", () => {
    const ids = new Set(SAHABA_PROFILES.map((p) => p.id));
    for (const id of ["abu-bakr", "umar", "uthman", "ali"]) {
      expect(ids.has(id)).toBe(true);
    }
    const ashara = SAHABA_PROFILES.filter((p) => p.categories.includes("ashara"));
    expect(ashara.length).toBe(10);
  });

  it("gives every summary a single concise sentence (no internal line breaks)", () => {
    for (const profile of SAHABA_PROFILES) {
      expect(profile.summary).not.toMatch(/\n/);
    }
  });
});
