import { DUROOD_ITEMS } from "@munib-tracker/shared/content/duroods";

import durood from "@/assets/data/hadith/durood-sources.json";
import { duroodGradeClass, duroodNeighbors, groupDuroods } from "./durood-browse";

const SOURCES = durood as unknown as Record<
  string,
  { sources: Array<{ reference: string; grade?: string; arabic: string; english: string }> }
>;

/** Ids users may have saved (favorites / Tasbeeh links) — must keep resolving. */
const STABLE_IDS = [
  "durood-ibrahim",
  "durood-short",
  "durood-salli-ala",
  "durood-afdal",
  "durood-hisn-219",
  "durood-hisn-220",
  "durood-hisn-221",
  "durood-hisn-222",
  "durood-hisn-223",
];

describe("bundled duroods (D11 sourced)", () => {
  it("keeps every previously shipped id", () => {
    const ids = new Set(DUROOD_ITEMS.map((item) => item.id));
    for (const id of STABLE_IDS) expect(ids).toContain(id);
  });

  it("cites every item, and grades every hadith-sourced one sahih or hasan", () => {
    for (const item of DUROOD_ITEMS) {
      expect({ id: item.id, reference: Boolean(item.reference?.trim()) }).toEqual({
        id: item.id,
        reference: true,
      });
      if (SOURCES[item.id]) {
        expect({ id: item.id, grade: duroodGradeClass(item.grade) }).not.toEqual({
          id: item.id,
          grade: null,
        });
      }
    }
  });

  it("ships a verbatim narration for each hadith-sourced durood", () => {
    for (const [id, context] of Object.entries(SOURCES)) {
      expect(DUROOD_ITEMS.some((item) => item.id === id)).toBe(true);
      expect(context.sources.length).toBeGreaterThan(0);
      for (const source of context.sources) {
        expect(source.arabic.length).toBeGreaterThan(0);
        expect(source.english.length).toBeGreaterThan(0);
        expect(duroodGradeClass(source.grade)).not.toBeNull();
      }
      // The item's own citation leads with its primary narration.
      const item = DUROOD_ITEMS.find((d) => d.id === id);
      expect(item?.reference?.startsWith(context.sources[0].reference)).toBe(true);
    }
  });

  it("only carries recorded audio pinned to the Hisnul Muslim commit", () => {
    for (const item of DUROOD_ITEMS) {
      if (!item.audioUri) continue;
      expect(item.audioUri).toMatch(
        /^https:\/\/cdn\.jsdelivr\.net\/gh\/sheikhhanif\/Hisnul_Muslim_Database@[0-9a-f]{40}\/audio\/\d+hm\.mp3$/,
      );
    }
  });

  it("has no two items with the same wording", () => {
    const fold = (text: string) => text.replace(/[ً-ٰٟ\s،,.]/g, "");
    const seen = new Set<string>();
    for (const item of DUROOD_ITEMS) {
      const key = fold(item.arabic);
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });
});

describe("durood browse helpers", () => {
  it("groups salawat before virtue reports, keeping dataset order", () => {
    const sections = groupDuroods(DUROOD_ITEMS);
    expect(sections.map((s) => s.key)).toEqual(["salawat", "virtues"]);
    expect(sections[0].items[0].id).toBe("durood-ibrahim");
    expect(sections[1].items.every((item) => item.kind === "virtue")).toBe(true);
  });

  it("buckets grades for the badge", () => {
    expect(duroodGradeClass("Sahih")).toBe("sahih");
    expect(duroodGradeClass("Sahih (Al-Albani)")).toBe("sahih");
    expect(duroodGradeClass("Hasan (Al-Albani)")).toBe("hasan");
    expect(duroodGradeClass("Daif (Al-Albani)")).toBeNull();
    expect(duroodGradeClass(undefined)).toBeNull();
  });

  it("pages through browse order", () => {
    const ordered = groupDuroods(DUROOD_ITEMS).flatMap((s) => s.items);
    const first = duroodNeighbors(DUROOD_ITEMS, ordered[0].id);
    expect(first).toEqual(
      expect.objectContaining({ previous: null, next: ordered[1], position: 1 }),
    );
    const last = duroodNeighbors(DUROOD_ITEMS, ordered[ordered.length - 1].id);
    expect(last?.next).toBeNull();
    expect(duroodNeighbors(DUROOD_ITEMS, "nope")).toBeNull();
  });
});
