import { describe, expect, it } from "vitest";

import {
  AHMAD_5446_CITATION,
  DHUL_HIJJAH_DEEDS,
  DHUL_HIJJAH_EVIDENCE,
  DHUL_HIJJAH_ZIKR,
  UDHIYAH_MIN_AGE_MONTHS,
  udhiyahAgeRow,
} from "./dhul-hijjah";
import { ZIKR_ITEMS } from "./zikr";

describe.concurrent("Dhul-Hijjah content", () => {
  it("cites the §12 refs (Bukhari 969, Muslim 1977, Tirmidhi 3585, Ahmad 5446)", () => {
    expect(DHUL_HIJJAH_EVIDENCE.tenDaysVirtue[0]).toMatchObject({
      collection: "bukhari",
      number: 969,
    });
    expect(DHUL_HIJJAH_EVIDENCE.hairNails[0]).toMatchObject({
      number: 5119,
      arabicNumber: "1977.03",
    });
    expect(DHUL_HIJJAH_EVIDENCE.arafahDua[0]).toMatchObject({ number: 3585, grade: "disputed" });
    expect(AHMAD_5446_CITATION).toMatchObject({ number: 5446, grade: "disputed" });
  });

  it("draws every counter's text from an existing bundled zikr (no typed Arabic)", () => {
    const ids = new Set(ZIKR_ITEMS.map((z) => z.id));
    for (const zikr of DHUL_HIJJAH_ZIKR) {
      expect(ids.has(zikr.sourceId)).toBe(true);
      expect(ids.has(zikr.id)).toBe(false);
    }
  });

  it("lists the five daily deeds", () => {
    expect(DHUL_HIJJAH_DEEDS).toEqual(["fast", "zikr", "quran", "sadaqah", "qiyam"]);
  });

  it("maps shares onto the whole-animal age row", () => {
    expect(udhiyahAgeRow("cow_share")).toBe("cow");
    expect(udhiyahAgeRow("camel_share")).toBe("camel");
    expect(UDHIYAH_MIN_AGE_MONTHS.camel.months).toBe(60);
    expect(UDHIYAH_MIN_AGE_MONTHS.sheep.robustMonths).toBe(6);
  });
});
