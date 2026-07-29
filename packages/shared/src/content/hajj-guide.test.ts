import { describe, expect, it } from "vitest";

import { HAJJ_CHECKLIST } from "./hajj-checklist";
import {
  HAJJ_GUIDE_CONTENT_VERSION,
  HAJJ_GUIDE_SECTION_ORDER,
  HAJJ_GUIDE_TOPICS,
} from "./hajj-guide";
import { UMRAH_CHECKLIST } from "./umrah-checklist";

describe("hajj guide content (NF-2.3)", () => {
  it("has a positive content version", () => {
    expect(HAJJ_GUIDE_CONTENT_VERSION).toBeGreaterThanOrEqual(4);
  });

  it("ships topics across every declared section", () => {
    for (const section of HAJJ_GUIDE_SECTION_ORDER) {
      const inSection = HAJJ_GUIDE_TOPICS.filter((t) => t.section === section);
      expect(inSection.length, section).toBeGreaterThan(0);
    }
  });

  it("gives every topic a globally-unique id", () => {
    const ids = HAJJ_GUIDE_TOPICS.map((t) => t.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("never ships a topic without a title, summary, or body", () => {
    for (const topic of HAJJ_GUIDE_TOPICS) {
      expect(topic.title.trim().length, topic.id).toBeGreaterThan(0);
      expect(topic.summary.trim().length, topic.id).toBeGreaterThan(0);
      expect(topic.body.length, topic.id).toBeGreaterThan(0);
      for (const paragraph of topic.body) {
        expect(paragraph.trim().length, topic.id).toBeGreaterThan(0);
      }
    }
  });

  it("backs every topic with evidence, actions, or an explicit disclaimer", () => {
    for (const topic of HAJJ_GUIDE_TOPICS) {
      const hasSupport =
        (topic.quran?.length ?? 0) > 0 ||
        (topic.hadith?.length ?? 0) > 0 ||
        (topic.actions?.length ?? 0) > 0 ||
        (topic.disclaimer?.length ?? 0) > 0;
      expect(hasSupport, topic.id).toBe(true);
    }
  });

  it("cites core evidence: 3:97, Bukhari 1521 / 1773, and Hajj is Arafah", () => {
    const allQuran = HAJJ_GUIDE_TOPICS.flatMap((t) => t.quran ?? []);
    const allHadith = HAJJ_GUIDE_TOPICS.flatMap((t) => t.hadith ?? []);

    expect(allQuran.some((q) => q.surah === 3 && q.ayahFrom === 97)).toBe(true);
    expect(
      allHadith.some((h) => h.collection === "Sahih al-Bukhari" && h.citation === "1521"),
    ).toBe(true);
    expect(
      allHadith.some((h) => h.collection === "Sahih al-Bukhari" && h.citation === "1773"),
    ).toBe(true);
    expect(allHadith.some((h) => /arafah/i.test(h.excerpt))).toBe(true);
  });

  it("keeps app link routes rooted at /", () => {
    for (const topic of HAJJ_GUIDE_TOPICS) {
      for (const link of topic.appLinks ?? []) {
        expect(link.route.startsWith("/"), topic.id).toBe(true);
        expect(link.label.length, topic.id).toBeGreaterThan(0);
      }
    }
  });
});

describe("hajj & umrah rite checklists", () => {
  it("gives every checklist item a unique id across both lists", () => {
    const ids = [...HAJJ_CHECKLIST, ...UMRAH_CHECKLIST].map((i) => i.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("never mixes umrah ids into the hajj checklist", () => {
    for (const item of HAJJ_CHECKLIST) {
      expect(item.id.startsWith("umrah-"), item.id).toBe(false);
    }
  });

  it("keeps umrah checklist items under umrah- prefix", () => {
    for (const item of UMRAH_CHECKLIST) {
      expect(item.id.startsWith("umrah-"), item.id).toBe(true);
    }
  });

  it("never leaves a rite without a title or hint", () => {
    for (const item of [...HAJJ_CHECKLIST, ...UMRAH_CHECKLIST]) {
      expect(item.title.trim().length, item.id).toBeGreaterThan(0);
      expect(item.hint.trim().length, item.id).toBeGreaterThan(0);
    }
  });

  it("preserves stable rite ids from the prior combined guide", () => {
    const hajjIds = new Set(HAJJ_CHECKLIST.map((i) => i.id));
    const umrahIds = new Set(UMRAH_CHECKLIST.map((i) => i.id));
    for (const id of [
      "hajj-ihram",
      "hajj-arafah-stand",
      "hajj-ifadah",
      "hajj-wada",
      "umrah-ihram",
      "umrah-tawaf",
      "umrah-sai",
      "umrah-halq",
    ]) {
      expect(hajjIds.has(id) || umrahIds.has(id), id).toBe(true);
    }
  });
});
