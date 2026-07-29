import { describe, expect, it } from "vitest";

import {
  TAHARAH_CHECKLIST,
  TAHARAH_CONTENT_VERSION,
  TAHARAH_SECTION_ORDER,
  TAHARAH_TOPICS,
} from "./taharah";

describe("taharah content", () => {
  it("has a positive content version", () => {
    expect(TAHARAH_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("ships topics across every section with evidence or steps", () => {
    for (const section of TAHARAH_SECTION_ORDER) {
      const inSection = TAHARAH_TOPICS.filter((t) => t.section === section);
      expect(inSection.length).toBeGreaterThan(0);
    }

    const ids = TAHARAH_TOPICS.map((t) => t.id);
    expect(ids).toEqual(
      expect.arrayContaining(["introduction", "wudu-steps", "ghusl-steps", "references"]),
    );
    expect(new Set(ids).size).toBe(ids.length);

    for (const topic of TAHARAH_TOPICS) {
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.body.length).toBeGreaterThan(0);
      const hasContent =
        (topic.steps?.length ?? 0) > 0 ||
        (topic.quran?.length ?? 0) > 0 ||
        (topic.hadith?.length ?? 0) > 0 ||
        (topic.actions?.length ?? 0) > 0;
      expect(hasContent).toBe(true);
    }
  });

  it("ships a daily checklist", () => {
    expect(TAHARAH_CHECKLIST.length).toBeGreaterThan(3);
  });
});
