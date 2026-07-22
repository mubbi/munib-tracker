import { describe, expect, it } from "vitest";

import {
  JANAZAH_GUIDE_CONTENT_VERSION,
  JANAZAH_GUIDE_SECTION_ORDER,
  JANAZAH_GUIDE_TOPICS,
} from "./janazah-guide";

const EXPECTED_DUA_IDS = [
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

describe("janazah guide content", () => {
  it("has a positive content version", () => {
    expect(JANAZAH_GUIDE_CONTENT_VERSION).toBeGreaterThan(0);
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

  it("links bundled Hisnul funeral duas by id (no invented dua text)", () => {
    const duaIds = JANAZAH_GUIDE_TOPICS.map((t) => t.duaId).filter(Boolean);
    for (const id of EXPECTED_DUA_IDS) {
      expect(duaIds, id).toContain(id);
    }
  });

  it("cites four-takbir Janazah evidence (Bukhari 1334)", () => {
    const allHadith = JANAZAH_GUIDE_TOPICS.flatMap((t) => t.hadith ?? []);
    expect(
      allHadith.some((h) => h.collection === "Sahih al-Bukhari" && h.citation === "1334"),
    ).toBe(true);
  });
});
