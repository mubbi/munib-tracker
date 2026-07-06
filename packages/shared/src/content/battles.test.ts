import { describe, expect, it } from "vitest";

import {
  BATTLES_AFTER_PROPHET,
  BATTLES_CONTENT_VERSION,
  BATTLES_FIGURES,
  BATTLES_GLOSSARY,
  BATTLES_LESSON_CARDS,
  BATTLES_SECTION_ORDER,
  BATTLES_TIMELINE,
  BATTLES_TOPICS,
  BATTLES_VERSES,
} from "./battles";

describe("battles content", () => {
  it("has a positive content version", () => {
    expect(BATTLES_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("ships topics across every section with evidence or actions", () => {
    for (const section of BATTLES_SECTION_ORDER) {
      const inSection = BATTLES_TOPICS.filter((t) => t.section === section);
      expect(inSection.length).toBeGreaterThan(0);
    }

    const ids = BATTLES_TOPICS.map((t) => t.id);
    expect(ids).toEqual(
      expect.arrayContaining(["introduction", "badr", "ethics-of-warfare", "references"]),
    );
    expect(new Set(ids).size).toBe(ids.length);

    for (const topic of BATTLES_TOPICS) {
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.body.length).toBeGreaterThan(0);
      const hasContent =
        (topic.quran?.length ?? 0) > 0 ||
        (topic.hadith?.length ?? 0) > 0 ||
        (topic.actions?.length ?? 0) > 0 ||
        !!topic.battleDetails;
      expect(hasContent).toBe(true);
      if (topic.appLinks?.length) {
        for (const link of topic.appLinks) {
          expect(link.route.startsWith("/")).toBe(true);
        }
      }
    }
  });

  it("ships timeline, glossary, figures, lessons, and verses", () => {
    expect(BATTLES_TIMELINE.length).toBeGreaterThan(8);
    expect(BATTLES_GLOSSARY.length).toBeGreaterThan(8);
    expect(BATTLES_FIGURES.length).toBeGreaterThan(5);
    expect(BATTLES_LESSON_CARDS.length).toBeGreaterThan(5);
    expect(BATTLES_VERSES.length).toBeGreaterThan(5);
    expect(BATTLES_AFTER_PROPHET.length).toBe(3);
  });
});
