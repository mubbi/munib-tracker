import { pickKnowledgeCard, resolveKnowledgeCardEntry } from "@/lib/knowledge-card";
import { buildKnowledgeCardPool, isFriday } from "@/lib/knowledge-card-data";

describe("knowledge card", () => {
  it("resolves a curated quran ayah with arabic and translation", () => {
    const card = resolveKnowledgeCardEntry({ kind: "quran", surah: 112, ayah: 1 });
    expect(card?.kind).toBe("quran");
    expect(card?.arabic).toBeTruthy();
    expect(card?.body.length).toBeGreaterThan(0);
    expect(card?.href).toEqual({
      pathname: "/quran/[surah]",
      params: { surah: "112", ayah: "1" },
    });
  });

  it("resolves a bundled hadith with a deep link", () => {
    const card = resolveKnowledgeCardEntry({ kind: "hadith", id: "nawawi40:1" });
    expect(card?.kind).toBe("hadith");
    expect(card?.body).toContain("Actions are");
    expect(card?.href).toMatchObject({
      pathname: "/hadith/[collection]",
      params: { collection: "nawawi40" },
    });
  });

  it("adds extra Friday entries on Jumu'ah", () => {
    const weekday = buildKnowledgeCardPool(new Date("2026-07-02T12:00:00"));
    const friday = buildKnowledgeCardPool(new Date("2026-07-03T12:00:00"));
    expect(isFriday(new Date("2026-07-03T12:00:00"))).toBe(true);
    expect(friday.length).toBeGreaterThan(weekday.length);
  });

  it("picks a stable card for a fixed seed", () => {
    const first = pickKnowledgeCard(42, new Date("2026-07-02T12:00:00"));
    const second = pickKnowledgeCard(42, new Date("2026-07-02T12:00:00"));
    expect(first.key).toBe(second.key);
  });
});
