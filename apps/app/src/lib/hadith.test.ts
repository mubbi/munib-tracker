import {
  ensureBundledCollection,
  getBundledCollection,
  getBundledCollections,
  searchHadiths,
} from "@/lib/hadith";
import type { BundledHadithCollection } from "@/lib/hadith-bundled";

describe("hadith bundled highlights", () => {
  it("loads the bundled highlight collections", () => {
    const collections = getBundledCollections();
    expect(collections.length).toBeGreaterThanOrEqual(2);
    expect(collections.map((c) => c.id)).toContain("nawawi40");
  });

  it("gives every bundled hadith a non-empty reference and arabic", async () => {
    for (const collection of getBundledCollections()) {
      const bundled = await ensureBundledCollection(collection.id);
      expect(bundled).toBeDefined();
      expect(bundled?.items.length).toBeGreaterThan(0);
      for (const item of bundled?.items ?? []) {
        expect(item.reference.trim().length).toBeGreaterThan(0);
        expect(item.arabic.trim().length).toBeGreaterThan(0);
        expect(item.id).toBe(`${item.collection}:${item.number}`);
      }
    }
  });

  it("searches english text and references", () => {
    const nawawi = getBundledCollection("nawawi40") as BundledHadithCollection;
    const results = searchHadiths(nawawi?.items ?? [], "Allah");
    expect(results.length).toBeGreaterThan(0);
    // Reference-based search also works.
    expect(searchHadiths(nawawi?.items ?? [], "Nawawi").length).toBeGreaterThan(0);
  });
});
