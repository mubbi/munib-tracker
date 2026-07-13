import { describe, expect, it } from "vitest";

import { RUQYAH_CONTENT_VERSION, RUQYAH_SECTION_ORDER, RUQYAH_TOPICS } from "./ruqyah";

describe("ruqyah content", () => {
  it("has a positive content version", () => {
    expect(RUQYAH_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("ships topics across every declared section", () => {
    for (const section of RUQYAH_SECTION_ORDER) {
      const inSection = RUQYAH_TOPICS.filter((t) => t.section === section);
      expect(inSection.length, section).toBeGreaterThan(0);
    }
  });

  it("gives every topic a globally-unique id", () => {
    const ids = RUQYAH_TOPICS.map((t) => t.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("never ships a topic without a title, summary, or body", () => {
    for (const topic of RUQYAH_TOPICS) {
      expect(topic.title.trim().length, topic.id).toBeGreaterThan(0);
      expect(topic.summary.trim().length, topic.id).toBeGreaterThan(0);
      expect(topic.body.length, topic.id).toBeGreaterThan(0);
      for (const paragraph of topic.body) {
        expect(paragraph.trim().length, topic.id).toBeGreaterThan(0);
      }
    }
  });

  it("backs every topic with evidence, actions, or an explicit disclaimer", () => {
    for (const topic of RUQYAH_TOPICS) {
      const hasSupport =
        (topic.quran?.length ?? 0) > 0 ||
        (topic.hadith?.length ?? 0) > 0 ||
        (topic.actions?.length ?? 0) > 0 ||
        (topic.disclaimer?.length ?? 0) > 0;
      expect(hasSupport, topic.id).toBe(true);
    }
  });

  it("cites Al-Fatiha, Ayat al-Kursi (2:255), and surahs 112-114 by surah/ayah only", () => {
    const allQuran = RUQYAH_TOPICS.flatMap((t) => t.quran ?? []);
    const surahs = new Set(allQuran.map((q) => q.surah));

    for (const surah of [1, 2, 112, 113, 114]) {
      expect(surahs.has(surah), `surah ${surah}`).toBe(true);
    }

    const ayatAlKursi = allQuran.find((q) => q.surah === 2 && q.ayahFrom === 255);
    expect(ayatAlKursi).toBeDefined();
    // Short excerpt only — never the full, long verse text.
    expect(ayatAlKursi?.excerpt?.length ?? 0).toBeLessThan(200);
  });

  it("cites the halal/haram foundation (Muslim 2200) and the fortune-teller warning (Muslim 2230)", () => {
    const allHadith = RUQYAH_TOPICS.flatMap((t) => t.hadith ?? []);

    for (const citation of ["2200", "2230"]) {
      expect(
        allHadith.some((h) => h.collection === "Sahih Muslim" && h.citation === citation),
        citation,
      ).toBe(true);
    }
  });

  it("points daily protection to the /zikr adhkar route", () => {
    const dailyProtection = RUQYAH_TOPICS.find((t) => t.id === "daily-protection");
    expect(dailyProtection).toBeDefined();
    expect(dailyProtection?.appLinks?.some((link) => link.route === "/zikr")).toBe(true);
  });

  it("skips olive-oil folk protocols and unsourced affliction-sign lists", () => {
    const bodies = RUQYAH_TOPICS.flatMap((t) => t.body)
      .join(" ")
      .toLowerCase();
    expect(bodies).not.toMatch(/olive oil/);
    expect(bodies).not.toMatch(/signs (that )?you (are|have been) affected/);
  });
});
