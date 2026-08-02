import { describe, expect, it } from "@jest/globals";

import {
  ZAKAT_CALC_SECTION_IDS,
  ZAKAT_CALC_SECTIONS,
  type ZakatCalcSectionId,
} from "./zakat-section-info";

describe("ZAKAT_CALC_SECTIONS", () => {
  it("defines every section id in ZAKAT_CALC_SECTION_IDS", () => {
    for (const id of ZAKAT_CALC_SECTION_IDS) {
      expect(ZAKAT_CALC_SECTIONS[id].id).toBe(id);
    }
    expect(Object.keys(ZAKAT_CALC_SECTIONS).sort()).toEqual([...ZAKAT_CALC_SECTION_IDS].sort());
  });

  it("includes at least one quran or hadith ref per section", () => {
    for (const id of ZAKAT_CALC_SECTION_IDS) {
      const section = ZAKAT_CALC_SECTIONS[id];
      expect(section.refs.length).toBeGreaterThan(0);
      for (const ref of section.refs) {
        expect(ref.kind === "quran" || ref.kind === "hadith").toBe(true);
        if (ref.sharedIndex !== undefined) {
          expect(ref.sharedIndex).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it("links calculator blocks to longer guide topics where applicable", () => {
    const withGuides: ZakatCalcSectionId[] = [
      "currency",
      "liquid",
      "metals",
      "investments",
      "property",
      "livestock",
      "agriculture",
      "deductions",
      "nisab",
    ];
    for (const id of withGuides) {
      expect(ZAKAT_CALC_SECTIONS[id].guideTopic).toBeTruthy();
    }
  });
});
