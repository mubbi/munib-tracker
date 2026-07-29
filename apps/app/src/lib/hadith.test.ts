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

  it("attaches structured isnad ending with the Prophet on Nawawi", async () => {
    const bundled = await ensureBundledCollection("nawawi40");
    expect(bundled).toBeDefined();
    const withIsnad = (bundled?.items ?? []).filter((item) => (item.isnad?.length ?? 0) >= 2);
    expect(withIsnad.length).toBeGreaterThan(30);
    const first = withIsnad[0]?.isnad ?? [];
    expect(first[first.length - 1]?.role).toBe("prophet");
  });

  it("merges Arabic sharh onto Nawawi from the sidecar", async () => {
    const bundled = await ensureBundledCollection("nawawi40");
    const withSharh = (bundled?.items ?? []).filter((item) => Boolean(item.sharhArabic?.trim()));
    expect(withSharh.length).toBeGreaterThanOrEqual(40);
  });

  it("searches english text and references", () => {
    const nawawi = getBundledCollection("nawawi40") as BundledHadithCollection;
    const results = searchHadiths(nawawi?.items ?? [], "Allah");
    expect(results.length).toBeGreaterThan(0);
    // Reference-based search also works.
    expect(searchHadiths(nawawi?.items ?? [], "Nawawi").length).toBeGreaterThan(0);
  });
});
