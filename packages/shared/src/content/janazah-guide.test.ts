import { describe, expect, it } from "vitest";

import {
  JANAZAH_GUIDE_CONTENT_VERSION,
  JANAZAH_GUIDE_SECTION_ORDER,
  JANAZAH_GUIDE_TOPICS,
} from "./janazah-guide";

const EXPECTED_DUA_IDS = [
  "hisn-153",

  "hisn-154",

  "hisn-155",

  "hisn-156",

  "hisn-157",

  "hisn-158",

  "hisn-159",

  "hisn-160",

  "hisn-161",

  "hisn-163",

  "hisn-164",

  "hisn-165",
];

const EXPECTED_V2_TOPIC_IDS = [
  "takbir-steps",

  "dua-for-men-women",

  "martyrs-and-stillborn",

  "absentia-janazah",

  "deathbed-talqin",

  "bereaved-condolence",
];

describe("janazah guide content", () => {
  it("has a positive content version", () => {
    expect(JANAZAH_GUIDE_CONTENT_VERSION).toBeGreaterThanOrEqual(2);
  });

  it("ships topics across every declared section", () => {
    for (const section of JANAZAH_GUIDE_SECTION_ORDER) {
      const inSection = JANAZAH_GUIDE_TOPICS.filter((t) => t.section === section);

      expect(inSection.length, section).toBeGreaterThan(0);
    }
  });

  it("gives every topic a globally-unique id", () => {
    const ids = JANAZAH_GUIDE_TOPICS.map((t) => t.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("links bundled Hisnul funeral and deathbed duas by id (no invented dua text)", () => {
    const duaIds = JANAZAH_GUIDE_TOPICS.map((t) => t.duaId).filter(Boolean);

    for (const id of EXPECTED_DUA_IDS) {
      expect(duaIds, id).toContain(id);
    }
  });

  it("includes v2 topics for gender forms, takbir steps, and special cases", () => {
    const ids = new Set(JANAZAH_GUIDE_TOPICS.map((t) => t.id));

    for (const id of EXPECTED_V2_TOPIC_IDS) {
      expect(ids.has(id), id).toBe(true);
    }
  });

  it("teaches pronoun adaptation for women and children", () => {
    const gender = JANAZAH_GUIDE_TOPICS.find((t) => t.id === "dua-for-men-women");

    expect(gender?.body.some((p) => p.includes("لَهَا") || p.includes("feminine"))).toBe(true);
  });

  it("cites four-takbir Janazah evidence (Bukhari 1334)", () => {
    const allHadith = JANAZAH_GUIDE_TOPICS.flatMap((t) => t.hadith ?? []);

    expect(
      allHadith.some((h) => h.collection === "Sahih al-Bukhari" && h.citation === "1334"),
    ).toBe(true);
  });
});
