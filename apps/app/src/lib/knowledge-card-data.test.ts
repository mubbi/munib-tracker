import { describe, expect, it } from "@jest/globals";

import {
  buildKnowledgeCardPool,
  FRIDAY_HADITH_IDS,
  FRIDAY_QURAN_AYAHS,
  isFriday,
  KNOWLEDGE_HADITH_IDS,
  KNOWLEDGE_NAME_IDS,
  KNOWLEDGE_QURAN_AYAHS,
  MOTIVATION_QUOTES,
} from "./knowledge-card-data";

describe("knowledge-card-data pool", () => {
  it("includes quran, hadith, names, and motivation entries on weekdays", () => {
    const pool = buildKnowledgeCardPool(new Date("2026-07-02T12:00:00"));
    expect(pool.some((e) => e.kind === "quran")).toBe(true);
    expect(pool.some((e) => e.kind === "hadith")).toBe(true);
    expect(pool.some((e) => e.kind === "name")).toBe(true);
    expect(pool.some((e) => e.kind === "motivation")).toBe(true);
    expect(pool.some((e) => e.kind === "friday-quran")).toBe(false);
  });

  it("adds Friday-only entries on Jumu'ah", () => {
    const weekday = buildKnowledgeCardPool(new Date("2026-07-02T12:00:00"));
    const friday = buildKnowledgeCardPool(new Date("2026-07-03T12:00:00"));
    expect(isFriday(new Date("2026-07-03T12:00:00"))).toBe(true);
    expect(friday.length).toBeGreaterThan(weekday.length);
    expect(friday.filter((e) => e.kind === "friday-quran").length).toBe(
      FRIDAY_QURAN_AYAHS.length * 2,
    );
    expect(friday.filter((e) => e.kind === "friday-hadith").length).toBe(
      FRIDAY_HADITH_IDS.length * 2,
    );
  });
});

describe("curated lists", () => {
  it("has valid quran ayah references", () => {
    for (const ref of KNOWLEDGE_QURAN_AYAHS) {
      expect(ref.surah).toBeGreaterThanOrEqual(1);
      expect(ref.surah).toBeLessThanOrEqual(114);
      expect(ref.ayah).toBeGreaterThanOrEqual(1);
    }
  });

  it("uses bundled nawawi hadith ids", () => {
    for (const id of KNOWLEDGE_HADITH_IDS) {
      expect(id.startsWith("nawawi40:")).toBe(true);
    }
  });

  it("has unique motivation quote ids", () => {
    const ids = MOTIVATION_QUOTES.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has non-empty name ids", () => {
    expect(KNOWLEDGE_NAME_IDS.length).toBeGreaterThan(0);
    for (const id of KNOWLEDGE_NAME_IDS) {
      expect(id.length).toBeGreaterThan(0);
    }
  });
});
