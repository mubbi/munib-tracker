import { describe, expect, it } from "vitest";

import {
  JAHANNAM_CONTENT_VERSION,
  JAHANNAM_CORE_TOPICS,
  JAHANNAM_DUAS,
  JAHANNAM_GATES,
  JAHANNAM_HADITH,
  JAHANNAM_MAJOR_SIN_IDS,
  JAHANNAM_NAMES,
  JAHANNAM_REFLECTIONS,
  JAHANNAM_TOPICS,
  JAHANNAM_VERSES,
} from "./jahannam";

describe("jahannam content", () => {
  it("has a positive content version", () => {
    expect(JAHANNAM_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("ships core topics with evidence", () => {
    const ids = JAHANNAM_CORE_TOPICS.map((t) => t.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "introduction",
        "why-jahannam",
        "protection",
        "repentance",
        "hope-in-mercy",
      ]),
    );
    for (const topic of JAHANNAM_CORE_TOPICS) {
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.summary.length).toBeGreaterThan(0);
      expect(topic.body.length).toBeGreaterThan(0);
      const hasEvidence = (topic.quran?.length ?? 0) > 0 || (topic.hadith?.length ?? 0) > 0;
      expect(hasEvidence).toBe(true);
    }
  });

  it("ships every major sin topic slug", () => {
    for (const id of JAHANNAM_MAJOR_SIN_IDS) {
      const topic = JAHANNAM_TOPICS.find((t) => t.id === id);
      expect(topic, id).toBeDefined();
      expect(topic?.section).toBe("major-sins");
    }
  });

  it("validates app link routes start with /", () => {
    for (const topic of JAHANNAM_TOPICS) {
      for (const link of topic.appLinks ?? []) {
        expect(link.route.startsWith("/")).toBe(true);
        expect(link.label.length).toBeGreaterThan(0);
      }
    }
  });

  it("ships names, gates, verses, hadith, duas, and reflections", () => {
    expect(JAHANNAM_NAMES.length).toBeGreaterThanOrEqual(7);
    expect(JAHANNAM_GATES.length).toBe(7);
    expect(JAHANNAM_VERSES.length).toBeGreaterThanOrEqual(10);
    expect(JAHANNAM_HADITH.length).toBeGreaterThanOrEqual(6);
    expect(JAHANNAM_DUAS.length).toBeGreaterThanOrEqual(3);
    expect(JAHANNAM_REFLECTIONS.length).toBeGreaterThanOrEqual(5);
  });
});
