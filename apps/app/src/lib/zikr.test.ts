import { ZIKR_CATEGORY_IDS } from "@munib-tracker/shared/constants";

import { ensureZikrCorpus, getZikrById, zikrByCategory, zikrCategories } from "@/lib/zikr";

// jest.setup.ts warms the zikr corpus synchronously.
describe("zikr corpus accessors", () => {
  it("resolves the warmed corpus", async () => {
    expect((await ensureZikrCorpus()).length).toBeGreaterThan(0);
  });

  it("filters items by category", async () => {
    const [category] = ZIKR_CATEGORY_IDS;
    const items = zikrByCategory(category);
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.categoryId === category)).toBe(true);
  });

  it("finds an item by id", async () => {
    const [first] = await ensureZikrCorpus();
    expect(getZikrById(first.id)).toEqual(first);
  });

  it.each([undefined, "", "missing"])("returns undefined for id %p", (id) => {
    expect(getZikrById(id)).toBeUndefined();
  });

  it("summarises every category with its label, icon and count", () => {
    const categories = zikrCategories();
    expect(categories.map((c) => c.id)).toEqual(ZIKR_CATEGORY_IDS);
    for (const category of categories) {
      expect(category.count).toBe(zikrByCategory(category.id).length);
      expect(category.label).toBeTruthy();
      expect(category.icon).toBeDefined();
    }
  });
});
