import {
  __setBundledHadithForTests,
  type BundledHadithCollection,
  ensureBundledCollection,
  ensureBundledCollectionData,
  getBundledCollection,
  getBundledCollectionData,
  getBundledCollections,
  isBundledCollection,
} from "@/lib/hadith-bundled";
import { buildHadithItem } from "@/test-support/fixtures/hadith";

const NAWAWI = "nawawi40";
const RIYAD = "riyad_assalihin";

// jest.setup.ts preloads both collections; restore them after each override.
const preloaded = {
  [NAWAWI]: getBundledCollection(NAWAWI) as BundledHadithCollection,
  [RIYAD]: getBundledCollection(RIYAD) as BundledHadithCollection,
};
afterEach(() => {
  __setBundledHadithForTests(NAWAWI, preloaded[NAWAWI]);
  __setBundledHadithForTests(RIYAD, preloaded[RIYAD]);
});

/** Install a small Nawawi stand-in so section grouping is easy to assert. */
function setup(overrides: Partial<BundledHadithCollection> = {}): BundledHadithCollection {
  const bundled: BundledHadithCollection = {
    collection: getBundledCollections()[0],
    chapters: [
      { id: "1", nameArabic: "النية", nameEnglish: "Intentions" },
      { id: "2", nameArabic: "الإحسان", nameEnglish: "" },
      { id: "3", nameArabic: "", nameEnglish: "" },
      { id: "4", nameArabic: "", nameEnglish: "Empty chapter" },
    ],
    items: [
      buildHadithItem({ number: "1", chapterId: "1" }),
      buildHadithItem({ number: "2", chapterId: "2" }),
      buildHadithItem({ number: "3", chapterId: "3", book: "Explicit book" }),
      buildHadithItem({ number: "4" }),
      buildHadithItem({ number: "5", chapterId: "99" }),
    ],
    ...overrides,
  };
  __setBundledHadithForTests(NAWAWI, bundled);
  return bundled;
}

describe("bundled collection registry", () => {
  it("lists Nawawi and Riyad as bundled", () => {
    expect(getBundledCollections().map((c) => c.id)).toEqual([NAWAWI, RIYAD]);
  });

  it.each([
    [NAWAWI, true],
    [RIYAD, true],
    ["bukhari", false],
  ])("isBundledCollection(%s) → %p", (id, expected) => {
    expect(isBundledCollection(id)).toBe(expected);
  });

  it("returns nothing for a remote collection", async () => {
    expect(getBundledCollection("bukhari")).toBeUndefined();
    expect(getBundledCollectionData("bukhari")).toBeUndefined();
    await expect(ensureBundledCollection("bukhari")).resolves.toBeUndefined();
    await expect(ensureBundledCollectionData("bukhari")).resolves.toBeUndefined();
  });

  it.each([NAWAWI, RIYAD])(
    "ensureBundledCollection(%s) resolves the cached collection",
    async (id) => {
      await expect(ensureBundledCollection(id)).resolves.toBe(
        preloaded[id as keyof typeof preloaded],
      );
    },
  );

  it("ignores test injection for unknown ids", () => {
    __setBundledHadithForTests("bukhari", preloaded[NAWAWI]);
    expect(getBundledCollection("bukhari")).toBeUndefined();
  });
});

describe("getBundledCollectionData", () => {
  it("stamps each item with its chapter title, falling back to Arabic then the chapter id", () => {
    setup();
    const books = getBundledCollectionData(NAWAWI)?.items.map((item) => item.book);
    expect(books).toEqual(["Intentions", "الإحسان", "Explicit book", undefined, undefined]);
  });

  it("builds sections with counts and drops empty chapters", () => {
    setup();
    expect(getBundledCollectionData(NAWAWI)?.sections).toEqual([
      { id: "1", name: "Intentions", count: 1 },
      { id: "2", name: "الإحسان", count: 1 },
      { id: "3", name: "Chapter 3", count: 1 },
    ]);
  });

  it("matches the async variant", async () => {
    setup();
    await expect(ensureBundledCollectionData(NAWAWI)).resolves.toEqual(
      getBundledCollectionData(NAWAWI),
    );
  });

  it("groups the real Riyad collection into non-empty sections", () => {
    const data = getBundledCollectionData(RIYAD);
    expect(data?.sections.length).toBeGreaterThan(1);
    expect(data?.sections.every((s) => s.count > 0)).toBe(true);
  });
});
