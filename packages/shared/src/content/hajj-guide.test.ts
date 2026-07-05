import { describe, expect, it } from "vitest";
import { HAJJ_GUIDE_CONTENT_VERSION, HAJJ_GUIDE_SECTIONS } from "./hajj-guide";

describe("hajj guide content (NF-2.3)", () => {
  it("ships both Umrah and Hajj sections", () => {
    const kinds = new Set(HAJJ_GUIDE_SECTIONS.map((s) => s.kind));
    expect(kinds.has("umrah")).toBe(true);
    expect(kinds.has("hajj")).toBe(true);
    expect(HAJJ_GUIDE_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("gives every rite a globally-unique id (used as the checklist key)", () => {
    const ids = HAJJ_GUIDE_SECTIONS.flatMap((s) => s.steps.map((step) => step.id));
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("never leaves a rite without a title or body", () => {
    for (const section of HAJJ_GUIDE_SECTIONS) {
      for (const step of section.steps) {
        expect(step.title.trim().length).toBeGreaterThan(0);
        expect(step.body.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
