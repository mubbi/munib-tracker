import { describe, expect, it } from "vitest";

import {
  JANNAH_CONTENT_VERSION,
  JANNAH_DUAS,
  JANNAH_GATES,
  JANNAH_PATH_TOPIC_IDS,
  JANNAH_PROMISED,
  JANNAH_TOPICS,
  JANNAH_VERSES,
} from "./jannah";

describe("jannah content", () => {
  it("has a positive content version", () => {
    expect(JANNAH_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("ships core hub topics with evidence", () => {
    const ids = JANNAH_TOPICS.map((t) => t.id);
    expect(ids).toEqual(
      expect.arrayContaining(["about", "ranks", "al-firdaws", "warnings", "promised"]),
    );
    for (const topic of JANNAH_TOPICS) {
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.summary.length).toBeGreaterThan(0);
      expect(topic.body.length).toBeGreaterThan(0);
      const hasEvidence =
        (topic.quran?.length ?? 0) > 0 ||
        (topic.hadith?.length ?? 0) > 0 ||
        topic.hub === "promised";
      expect(hasEvidence).toBe(true);
    }
  });

  it("ships every path topic slug", () => {
    for (const id of JANNAH_PATH_TOPIC_IDS) {
      const topic = JANNAH_TOPICS.find((t) => t.id === id);
      expect(topic, id).toBeDefined();
      expect(topic?.hub).toBe("paths");
    }
  });

  it("validates app link routes start with /", () => {
    for (const topic of JANNAH_TOPICS) {
      for (const link of topic.appLinks ?? []) {
        expect(link.route.startsWith("/")).toBe(true);
        expect(link.label.length).toBeGreaterThan(0);
      }
    }
  });

  it("ships gates, verses, duas, and promised entries", () => {
    expect(JANNAH_GATES.length).toBeGreaterThanOrEqual(4);
    expect(JANNAH_VERSES.length).toBeGreaterThanOrEqual(8);
    expect(JANNAH_DUAS.length).toBeGreaterThanOrEqual(3);
    expect(JANNAH_PROMISED.length).toBeGreaterThanOrEqual(4);
  });
});
