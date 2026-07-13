import { describe, expect, it } from "vitest";

import {
  LAYLAT_AL_QADR_CONTENT_VERSION,
  LAYLAT_AL_QADR_SECTION_ORDER,
  LAYLAT_AL_QADR_TOPICS,
} from "./laylat-al-qadr";

describe("laylat al-qadr content", () => {
  it("has a positive content version", () => {
    expect(LAYLAT_AL_QADR_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("ships topics across every declared section", () => {
    for (const section of LAYLAT_AL_QADR_SECTION_ORDER) {
      const inSection = LAYLAT_AL_QADR_TOPICS.filter((t) => t.section === section);
      expect(inSection.length, section).toBeGreaterThan(0);
    }
  });

  it("gives every topic a globally-unique id", () => {
    const ids = LAYLAT_AL_QADR_TOPICS.map((t) => t.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("never ships a topic without a title, summary, or body", () => {
    for (const topic of LAYLAT_AL_QADR_TOPICS) {
      expect(topic.title.trim().length, topic.id).toBeGreaterThan(0);
      expect(topic.summary.trim().length, topic.id).toBeGreaterThan(0);
      expect(topic.body.length, topic.id).toBeGreaterThan(0);
      for (const paragraph of topic.body) {
        expect(paragraph.trim().length, topic.id).toBeGreaterThan(0);
      }
    }
  });

  it("backs every topic with evidence, actions, or an explicit disclaimer", () => {
    for (const topic of LAYLAT_AL_QADR_TOPICS) {
      const hasSupport =
        (topic.quran?.length ?? 0) > 0 ||
        (topic.hadith?.length ?? 0) > 0 ||
        (topic.actions?.length ?? 0) > 0 ||
        (topic.disclaimer?.length ?? 0) > 0;
      expect(hasSupport, topic.id).toBe(true);
    }
  });

  it("cites the core evidence: Qur'an 97, Bukhari 1901 & 2017, and Tirmidhi 3513", () => {
    const allQuran = LAYLAT_AL_QADR_TOPICS.flatMap((t) => t.quran ?? []);
    const allHadith = LAYLAT_AL_QADR_TOPICS.flatMap((t) => t.hadith ?? []);

    expect(allQuran.some((q) => q.surah === 97)).toBe(true);
    expect(
      allHadith.some((h) => h.collection === "Sahih al-Bukhari" && h.citation === "1901"),
    ).toBe(true);
    expect(
      allHadith.some((h) => h.collection === "Sahih al-Bukhari" && h.citation === "2017"),
    ).toBe(true);
    expect(
      allHadith.some((h) => h.collection === "Sunan al-Tirmidhi" && h.citation === "3513"),
    ).toBe(true);
  });

  it("keeps app link routes rooted at /", () => {
    for (const topic of LAYLAT_AL_QADR_TOPICS) {
      for (const link of topic.appLinks ?? []) {
        expect(link.route.startsWith("/"), topic.id).toBe(true);
        expect(link.label.length, topic.id).toBeGreaterThan(0);
      }
    }
  });

  it("carries an explicit disclaimer against fixed calendars and folk signs", () => {
    const disclaimers = LAYLAT_AL_QADR_TOPICS.map((t) => t.disclaimer ?? "").join(" ");
    expect(disclaimers).toMatch(/folk/i);
  });
});
