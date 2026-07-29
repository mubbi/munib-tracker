import { describe, expect, it } from "vitest";

import {
  QURAN_GUIDE_CONTENT_VERSION,
  QURAN_GUIDE_DAILY_LESSONS,
  QURAN_GUIDE_JOURNEY_ORDER,
  QURAN_GUIDE_STORIES,
  QURAN_GUIDE_TAJWEED,
  QURAN_GUIDE_THEMES,
  QURAN_GUIDE_TIMELINE,
  QURAN_GUIDE_TOPICS,
  QURAN_GUIDE_VOCABULARY,
} from "./quran-guide";

describe("quran-guide content", () => {
  it("has a positive content version", () => {
    expect(QURAN_GUIDE_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("ships topics across every journey with evidence or actions", () => {
    for (const journey of QURAN_GUIDE_JOURNEY_ORDER) {
      const inJourney = QURAN_GUIDE_TOPICS.filter((t) => t.journey === journey);
      expect(inJourney.length).toBeGreaterThan(0);
    }

    const ids = QURAN_GUIDE_TOPICS.map((t) => t.id);
    expect(ids).toEqual(
      expect.arrayContaining(["introduction", "tafsir", "tadabbur", "references"]),
    );
    expect(new Set(ids).size).toBe(ids.length);

    for (const topic of QURAN_GUIDE_TOPICS) {
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.body.length).toBeGreaterThan(0);
      const hasContent =
        (topic.quran?.length ?? 0) > 0 ||
        (topic.hadith?.length ?? 0) > 0 ||
        (topic.actions?.length ?? 0) > 0 ||
        (topic.sources?.length ?? 0) > 0 ||
        (topic.appLinks?.length ?? 0) > 0 ||
        topic.comingSoon;
      expect(hasContent).toBe(true);
      if (topic.appLinks?.length) {
        for (const link of topic.appLinks) {
          expect(link.route.startsWith("/")).toBe(true);
        }
      }
    }
  });

  it("ships timeline, themes, vocabulary, stories, tajweed, and daily lessons", () => {
    expect(QURAN_GUIDE_TIMELINE.length).toBeGreaterThan(5);
    expect(QURAN_GUIDE_THEMES.length).toBeGreaterThan(8);
    expect(QURAN_GUIDE_VOCABULARY.length).toBeGreaterThan(10);
    expect(QURAN_GUIDE_STORIES.length).toBeGreaterThan(5);
    expect(QURAN_GUIDE_TAJWEED.length).toBeGreaterThan(4);
    expect(QURAN_GUIDE_DAILY_LESSONS.length).toBeGreaterThan(3);
  });
});
