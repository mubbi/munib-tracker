import { describe, expect, it } from "vitest";

import {
  ISLAMIC_FINANCE_CONTENT_VERSION,
  ISLAMIC_FINANCE_SECTION_ORDER,
  ISLAMIC_FINANCE_TOPICS,
} from "./islamic-finance";

const FUND_SCREENER_MARKERS =
  /\bETF\b|ticker symbol|NASDAQ|S&P\s?500|mutual fund (?:list|screener)|stock (?:pick|list)/i;

describe("islamic finance content", () => {
  it("has a positive content version", () => {
    expect(ISLAMIC_FINANCE_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("declares the expected section order", () => {
    expect(ISLAMIC_FINANCE_SECTION_ORDER).toEqual([
      "principles",
      "riba",
      "trade",
      "giving",
      "takaful",
      "faq",
    ]);
  });

  it("ships topics across every declared section", () => {
    for (const section of ISLAMIC_FINANCE_SECTION_ORDER) {
      const inSection = ISLAMIC_FINANCE_TOPICS.filter((t) => t.section === section);
      expect(inSection.length, section).toBeGreaterThan(0);
    }
  });

  it("gives every topic a globally-unique id", () => {
    const ids = ISLAMIC_FINANCE_TOPICS.map((t) => t.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("never ships a topic without a title, summary, or non-empty body", () => {
    for (const topic of ISLAMIC_FINANCE_TOPICS) {
      expect(topic.title.trim().length, topic.id).toBeGreaterThan(0);
      expect(topic.summary.trim().length, topic.id).toBeGreaterThan(0);
      expect(topic.body.length, topic.id).toBeGreaterThan(0);
      for (const paragraph of topic.body) {
        expect(paragraph.trim().length, topic.id).toBeGreaterThan(0);
      }
    }
  });

  it("backs every topic with evidence, actions, app links, or an explicit disclaimer", () => {
    for (const topic of ISLAMIC_FINANCE_TOPICS) {
      const hasSupport =
        (topic.quran?.length ?? 0) > 0 ||
        (topic.hadith?.length ?? 0) > 0 ||
        (topic.actions?.length ?? 0) > 0 ||
        (topic.appLinks?.length ?? 0) > 0 ||
        (topic.disclaimer?.length ?? 0) > 0;
      expect(hasSupport, topic.id).toBe(true);
    }
  });

  it("keeps app link routes rooted at / with a non-empty label", () => {
    for (const topic of ISLAMIC_FINANCE_TOPICS) {
      for (const link of topic.appLinks ?? []) {
        expect(link.route.startsWith("/"), topic.id).toBe(true);
        expect(link.label.length, topic.id).toBeGreaterThan(0);
      }
    }
  });

  it("is strictly educational — never a fund screener or an ETF/stock list", () => {
    const bodies = ISLAMIC_FINANCE_TOPICS.flatMap((t) => t.body).join(" ");
    expect(bodies).not.toMatch(FUND_SCREENER_MARKERS);
  });

  it("carries a strong, explicit not-financial-advice / not-a-fatwa disclaimer", () => {
    const disclaimers = ISLAMIC_FINANCE_TOPICS.map((t) => t.disclaimer).filter(
      (d): d is string => !!d,
    );
    expect(disclaimers.length).toBeGreaterThanOrEqual(3);
    expect(disclaimers.some((d) => /not financial advice/i.test(d))).toBe(true);
    expect(disclaimers.some((d) => /not a fatwa/i.test(d))).toBe(true);
  });

  it("cites the riba prohibition across Qur'an 2:275-279", () => {
    const allQuran = ISLAMIC_FINANCE_TOPICS.flatMap((t) => t.quran ?? []);
    expect(allQuran.some((q) => q.surah === 2 && q.ayahFrom === 275 && q.ayahTo === 279)).toBe(
      true,
    );
  });

  it("cites the authenticated hadith on riba (Sahih Muslim 1598) and fair trade (Tirmidhi 1209)", () => {
    const allHadith = ISLAMIC_FINANCE_TOPICS.flatMap((t) => t.hadith ?? []);
    expect(allHadith.some((h) => h.collection === "Sahih Muslim" && h.citation === "1598")).toBe(
      true,
    );
    expect(
      allHadith.some((h) => h.collection === "Jami' at-Tirmidhi" && h.citation === "1209"),
    ).toBe(true);
  });

  it("links zakah and sadaqah topics to the zakat calculator", () => {
    const givingTopics = ISLAMIC_FINANCE_TOPICS.filter((t) => t.section === "giving");
    expect(givingTopics.length).toBeGreaterThan(0);
    for (const topic of givingTopics) {
      const routes = topic.appLinks?.map((l) => l.route) ?? [];
      expect(routes, topic.id).toContain("/zakat");
    }
  });

  it("frames takaful only at a conceptual, non-product level with its own disclaimer", () => {
    const takafulTopics = ISLAMIC_FINANCE_TOPICS.filter((t) => t.section === "takaful");
    expect(takafulTopics.length).toBeGreaterThan(0);
    for (const topic of takafulTopics) {
      expect(topic.disclaimer?.length ?? 0, topic.id).toBeGreaterThan(0);
    }
  });
});
