import { describe, expect, it } from "vitest";

import {
  FIDYAH_GUIDE_CONTENT_VERSION,
  FIDYAH_GUIDE_SECTION_ORDER,
  FIDYAH_GUIDE_TOPICS,
} from "./fidyah-guide";

describe("fidyah guide content", () => {
  it("has a positive content version", () => {
    expect(FIDYAH_GUIDE_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("ships topics across every declared section", () => {
    for (const section of FIDYAH_GUIDE_SECTION_ORDER) {
      const inSection = FIDYAH_GUIDE_TOPICS.filter((t) => t.section === section);
      expect(inSection.length, section).toBeGreaterThan(0);
    }
  });

  it("gives every topic a globally-unique id", () => {
    const ids = FIDYAH_GUIDE_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("never ships a topic without a title, summary, or body", () => {
    for (const topic of FIDYAH_GUIDE_TOPICS) {
      expect(topic.title.trim().length, topic.id).toBeGreaterThan(0);
      expect(topic.summary.trim().length, topic.id).toBeGreaterThan(0);
      expect(topic.body.length, topic.id).toBeGreaterThan(0);
    }
  });

  it("cites Qur'an 2:184 and Muslim 1111", () => {
    const allQuran = FIDYAH_GUIDE_TOPICS.flatMap((t) => t.quran ?? []);
    const allHadith = FIDYAH_GUIDE_TOPICS.flatMap((t) => t.hadith ?? []);
    expect(allQuran.some((q) => q.surah === 2 && q.ayahFrom === 184)).toBe(true);
    expect(allHadith.some((h) => h.collection === "Sahih Muslim" && h.citation === "1111")).toBe(
      true,
    );
  });

  it("keeps app link routes rooted at /", () => {
    for (const topic of FIDYAH_GUIDE_TOPICS) {
      for (const link of topic.appLinks ?? []) {
        expect(link.route.startsWith("/"), topic.id).toBe(true);
      }
    }
  });
});
