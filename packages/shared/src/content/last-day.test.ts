import { describe, expect, it } from "vitest";

import {
  LAST_DAY_CONTENT_VERSION,
  LAST_DAY_HADITH,
  LAST_DAY_QUIZ,
  LAST_DAY_REFERENCES,
  LAST_DAY_SECTION_ORDER,
  LAST_DAY_TIMELINE,
  LAST_DAY_TOPICS,
  LAST_DAY_VERSES,
} from "./last-day";

describe("last-day content", () => {
  it("has a positive content version", () => {
    expect(LAST_DAY_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("ships topics across every section with evidence or actions", () => {
    for (const section of LAST_DAY_SECTION_ORDER) {
      const inSection = LAST_DAY_TOPICS.filter((t) => t.section === section);
      expect(inSection.length).toBeGreaterThan(0);
    }

    const ids = LAST_DAY_TOPICS.map((t) => t.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "introduction",
        "death",
        "barzakh",
        "major-signs",
        "preparing",
        "sirat",
        "heavy-on-the-scale",
        "scale",
      ]),
    );
    expect(new Set(ids).size).toBe(ids.length);

    const heavy = LAST_DAY_TOPICS.find((t) => t.id === "heavy-on-the-scale");
    expect(heavy?.section).toBe("events");
    expect(heavy?.mizanDeeds?.length ?? 0).toBeGreaterThanOrEqual(5);
    expect(
      LAST_DAY_TOPICS.find((t) => t.id === "scale")?.appLinks?.some((l) =>
        l.route.includes("heavy-on-the-scale"),
      ),
    ).toBe(true);

    for (const topic of LAST_DAY_TOPICS) {
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.body.length).toBeGreaterThan(0);
      const hasContent =
        (topic.quran?.length ?? 0) > 0 ||
        (topic.hadith?.length ?? 0) > 0 ||
        (topic.actions?.length ?? 0) > 0;
      expect(hasContent).toBe(true);
      if (topic.appLinks?.length) {
        for (const link of topic.appLinks) {
          expect(link.route.startsWith("/")).toBe(true);
        }
      }
    }
  });

  it("ships timeline, verses, hadith, quiz, and references", () => {
    expect(LAST_DAY_TIMELINE.length).toBeGreaterThan(10);
    expect(LAST_DAY_VERSES.length).toBeGreaterThan(8);
    expect(LAST_DAY_HADITH.length).toBeGreaterThan(8);
    expect(LAST_DAY_HADITH.some((h) => h.hadith.citation === "6406")).toBe(true);
    expect(LAST_DAY_HADITH.some((h) => h.hadith.citation === "2002")).toBe(true);
    expect(LAST_DAY_HADITH.some((h) => h.hadith.citation === "223")).toBe(true);
    expect(LAST_DAY_QUIZ.length).toBeGreaterThan(5);
    expect(LAST_DAY_REFERENCES.length).toBeGreaterThan(5);
  });
});
