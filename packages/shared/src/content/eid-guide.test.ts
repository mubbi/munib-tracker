import { describe, expect, it } from "vitest";

import { EID_GUIDE_CONTENT_VERSION, EID_GUIDE_SECTION_ORDER, EID_GUIDE_TOPICS } from "./eid-guide";

describe("eid guide content", () => {
  it("has a positive content version", () => {
    expect(EID_GUIDE_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("ships topics across every declared section", () => {
    for (const section of EID_GUIDE_SECTION_ORDER) {
      const inSection = EID_GUIDE_TOPICS.filter((t) => t.section === section);
      expect(inSection.length, section).toBeGreaterThan(0);
    }
  });

  it("gives every topic a globally-unique id", () => {
    const ids = EID_GUIDE_TOPICS.map((t) => t.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("never ships a topic without a title, summary, or body", () => {
    for (const topic of EID_GUIDE_TOPICS) {
      expect(topic.title.trim().length, topic.id).toBeGreaterThan(0);
      expect(topic.summary.trim().length, topic.id).toBeGreaterThan(0);
      expect(topic.body.length, topic.id).toBeGreaterThan(0);
      for (const paragraph of topic.body) {
        expect(paragraph.trim().length, topic.id).toBeGreaterThan(0);
      }
    }
  });

  it("backs every topic with evidence, actions, or an explicit disclaimer", () => {
    for (const topic of EID_GUIDE_TOPICS) {
      const hasSupport =
        (topic.quran?.length ?? 0) > 0 ||
        (topic.hadith?.length ?? 0) > 0 ||
        (topic.actions?.length ?? 0) > 0 ||
        (topic.disclaimer?.length ?? 0) > 0;
      expect(hasSupport, topic.id).toBe(true);
    }
  });

  it("gives the Eid prayer topic a madhhab note covering Hanafi 3+3 and Shafi'i 7+5 takbirs", () => {
    const prayerTopic = EID_GUIDE_TOPICS.find((t) => t.id === "eid-prayer-how-to");
    expect(prayerTopic).toBeDefined();
    expect(prayerTopic?.madhhabNote?.length ?? 0).toBeGreaterThan(0);
    expect(prayerTopic?.madhhabNote).toMatch(/Hanafi/);
    expect(prayerTopic?.madhhabNote).toMatch(/Shafi/);
  });

  it("cites the core evidence: Bukhari 986 (route), 1503 (zakat al-fitr) & 5558 (udhiyah)", () => {
    const allHadith = EID_GUIDE_TOPICS.flatMap((t) => t.hadith ?? []);

    for (const citation of ["986", "1503", "5558"]) {
      expect(
        allHadith.some((h) => h.collection === "Sahih al-Bukhari" && h.citation === citation),
        citation,
      ).toBe(true);
    }
  });

  it("keeps app link routes rooted at /", () => {
    for (const topic of EID_GUIDE_TOPICS) {
      for (const link of topic.appLinks ?? []) {
        expect(link.route.startsWith("/"), topic.id).toBe(true);
        expect(link.label.length, topic.id).toBeGreaterThan(0);
      }
    }
  });

  it("skips cultural food-tourism content", () => {
    const bodies = EID_GUIDE_TOPICS.flatMap((t) => t.body)
      .join(" ")
      .toLowerCase();
    expect(bodies).not.toMatch(/food tourism|culinary tour|street food/);
  });
});
