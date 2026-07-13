import { describe, expect, it } from "vitest";

import {
  NEW_MUSLIM_CONTENT_VERSION,
  NEW_MUSLIM_SECTION_ORDER,
  NEW_MUSLIM_TOPICS,
} from "./new-muslim";

// Strip the ﷺ honorific ligature (U+FDFA, "peace be upon him") before checking —
// it's used throughout the app's content as a symbol, not quoted Arabic prayer text.
const hasArabicScript = (s: string) =>
  /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(s.replace(/\uFDFA/g, ""));

describe("new muslim content", () => {
  it("has a positive content version", () => {
    expect(NEW_MUSLIM_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("declares the expected section order", () => {
    expect(NEW_MUSLIM_SECTION_ORDER).toEqual([
      "start",
      "pillars",
      "faith",
      "prayer",
      "next-steps",
      "faq",
    ]);
  });

  it("ships topics across every declared section", () => {
    for (const section of NEW_MUSLIM_SECTION_ORDER) {
      const inSection = NEW_MUSLIM_TOPICS.filter((t) => t.section === section);
      expect(inSection.length, section).toBeGreaterThan(0);
    }
  });

  it("gives every topic a globally-unique id", () => {
    const ids = NEW_MUSLIM_TOPICS.map((t) => t.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("never ships a topic without a title, summary, or non-empty body", () => {
    for (const topic of NEW_MUSLIM_TOPICS) {
      expect(topic.title.trim().length, topic.id).toBeGreaterThan(0);
      expect(topic.summary.trim().length, topic.id).toBeGreaterThan(0);
      expect(topic.body.length, topic.id).toBeGreaterThan(0);
      for (const paragraph of topic.body) {
        expect(paragraph.trim().length, topic.id).toBeGreaterThan(0);
      }
    }
  });

  it("backs every topic with evidence, actions, app links, or an explicit disclaimer", () => {
    for (const topic of NEW_MUSLIM_TOPICS) {
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
    for (const topic of NEW_MUSLIM_TOPICS) {
      for (const link of topic.appLinks ?? []) {
        expect(link.route.startsWith("/"), topic.id).toBe(true);
        expect(link.label.length, topic.id).toBeGreaterThan(0);
      }
    }
  });

  it("never invents full Arabic prayer text — no Arabic script anywhere in the guide", () => {
    for (const topic of NEW_MUSLIM_TOPICS) {
      for (const paragraph of topic.body) {
        expect(hasArabicScript(paragraph), `${topic.id}: unexpected Arabic script`).toBe(false);
      }
      expect(hasArabicScript(topic.summary), topic.id).toBe(false);
    }
  });

  it("links the prayer overview to the dedicated Salah guide and phrases screen instead of authoring prayer text", () => {
    const prayerOverview = NEW_MUSLIM_TOPICS.find((t) => t.id === "how-to-pray-overview");
    expect(prayerOverview).toBeDefined();
    const routes = prayerOverview?.appLinks?.map((l) => l.route) ?? [];
    expect(routes).toContain("/salah-guide");
    expect(routes).toContain("/salah-guide/phrases");
  });

  it("links onward to aqeedah, learn-dua, and quran", () => {
    const allRoutes = NEW_MUSLIM_TOPICS.flatMap((t) => t.appLinks ?? []).map((l) => l.route);
    expect(allRoutes.some((r) => r.startsWith("/aqeedah"))).toBe(true);
    expect(allRoutes.some((r) => r.startsWith("/learn-dua"))).toBe(true);
    expect(allRoutes.some((r) => r.startsWith("/quran"))).toBe(true);
  });

  it("grounds the shahada and the six articles of iman in verified citations", () => {
    const allQuran = NEW_MUSLIM_TOPICS.flatMap((t) => t.quran ?? []);
    const allHadith = NEW_MUSLIM_TOPICS.flatMap((t) => t.hadith ?? []);

    expect(allQuran.some((q) => q.surah === 3 && q.ayahFrom === 18)).toBe(true);
    expect(allHadith.some((h) => h.collection === "Sahih Muslim" && h.citation === "8")).toBe(true);
    expect(allHadith.some((h) => h.collection === "Sahih al-Bukhari" && h.citation === "8")).toBe(
      true,
    );
  });

  it("gives the FAQ a non-fatwa tone on family, with a clear disclaimer", () => {
    const familyTopic = NEW_MUSLIM_TOPICS.find((t) => t.id === "faq-family-relations");
    expect(familyTopic).toBeDefined();
    expect(familyTopic?.disclaimer?.length ?? 0).toBeGreaterThan(0);
    expect(familyTopic?.disclaimer).toMatch(/local imam|qualified|teacher|counsellor/i);
  });

  it("ships a first-steps checklist with multiple concrete actions", () => {
    const checklist = NEW_MUSLIM_TOPICS.find((t) => t.id === "first-steps-checklist");
    expect(checklist).toBeDefined();
    expect(checklist?.actions?.length ?? 0).toBeGreaterThanOrEqual(5);
  });
});
