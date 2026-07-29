import { describe, expect, it } from "vitest";

import {
  PROPHETS_CONTENT_VERSION,
  PROPHETS_SECTION_ORDER,
  PROPHETS_TIMELINE,
  PROPHETS_TOPICS,
} from "./prophets";

describe("prophets content", () => {
  it("has a positive content version", () => {
    expect(PROPHETS_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("ships topics across every section with evidence", () => {
    for (const section of PROPHETS_SECTION_ORDER) {
      const inSection = PROPHETS_TOPICS.filter((t) => t.section === section);
      expect(inSection.length).toBeGreaterThan(0);
    }

    const ids = PROPHETS_TOPICS.map((t) => t.id);
    expect(ids).toEqual(
      expect.arrayContaining(["introduction", "adam", "musa", "muhammad", "references"]),
    );
    expect(new Set(ids).size).toBe(ids.length);

    for (const topic of PROPHETS_TOPICS) {
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.body.length).toBeGreaterThan(0);
      const hasContent =
        (topic.quran?.length ?? 0) > 0 ||
        (topic.hadith?.length ?? 0) > 0 ||
        (topic.actions?.length ?? 0) > 0 ||
        !!topic.profile;
      expect(hasContent).toBe(true);
    }
  });

  it("ships a timeline", () => {
    expect(PROPHETS_TIMELINE.length).toBeGreaterThan(5);
  });
});
