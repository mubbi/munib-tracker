import { describe, expect, it } from "vitest";

import {
  AQEDAH_CONTENT_VERSION,
  AQEDAH_GLOSSARY,
  AQEDAH_SECTION_ORDER,
  AQEDAH_TOPICS,
} from "./aqeedah";

describe("aqeedah content", () => {
  it("has a positive content version", () => {
    expect(AQEDAH_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("ships topics across every section with evidence", () => {
    for (const section of AQEDAH_SECTION_ORDER) {
      const inSection = AQEDAH_TOPICS.filter((t) => t.section === section);
      expect(inSection.length).toBeGreaterThan(0);
    }

    const ids = AQEDAH_TOPICS.map((t) => t.id);
    expect(ids).toEqual(
      expect.arrayContaining(["introduction", "six-articles", "tawheed-explained", "references"]),
    );
    expect(new Set(ids).size).toBe(ids.length);

    for (const topic of AQEDAH_TOPICS) {
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.body.length).toBeGreaterThan(0);
      const hasContent =
        (topic.quran?.length ?? 0) > 0 ||
        (topic.hadith?.length ?? 0) > 0 ||
        (topic.actions?.length ?? 0) > 0 ||
        (topic.misconceptions?.length ?? 0) > 0;
      expect(hasContent).toBe(true);
    }
  });

  it("ships a glossary", () => {
    expect(AQEDAH_GLOSSARY.length).toBeGreaterThan(5);
  });
});
