import { describe, expect, it } from "vitest";

import {
  LEARN_DUA_CONTENT_VERSION,
  LEARN_DUA_OCCASIONS,
  LEARN_DUA_SECTION_ORDER,
  LEARN_DUA_TOPICS,
} from "./learn-dua";

describe("learn dua content", () => {
  it("has a positive content version", () => {
    expect(LEARN_DUA_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("ships topics across every section with evidence or phrases", () => {
    for (const section of LEARN_DUA_SECTION_ORDER) {
      const inSection = LEARN_DUA_TOPICS.filter((t) => t.section === section);
      expect(inSection.length).toBeGreaterThan(0);
    }

    const ids = LEARN_DUA_TOPICS.map((t) => t.id);
    expect(ids).toEqual(
      expect.arrayContaining(["introduction", "dua-etiquette", "morning-evening", "references"]),
    );
    expect(new Set(ids).size).toBe(ids.length);

    for (const topic of LEARN_DUA_TOPICS) {
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.body.length).toBeGreaterThan(0);
      const hasContent =
        (topic.phrases?.length ?? 0) > 0 ||
        (topic.quran?.length ?? 0) > 0 ||
        (topic.hadith?.length ?? 0) > 0 ||
        (topic.actions?.length ?? 0) > 0;
      expect(hasContent).toBe(true);
    }
  });

  it("ships occasions index", () => {
    expect(LEARN_DUA_OCCASIONS.length).toBeGreaterThan(8);
  });
});
