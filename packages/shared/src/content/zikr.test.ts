import { describe, expect, it } from "vitest";
import { ZIKR_CATEGORY_IDS } from "../constants/index";
import { getZikrById, ZIKR_CONTENT_VERSION, ZIKR_ITEMS } from "./zikr";

describe.concurrent("zikr content", () => {
  it("has a content version", () => {
    expect(ZIKR_CONTENT_VERSION).toBeGreaterThanOrEqual(1);
  });

  it("has unique ids", () => {
    const ids = ZIKR_ITEMS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("provides at least three adhkar per category", () => {
    for (const category of ZIKR_CATEGORY_IDS) {
      const count = ZIKR_ITEMS.filter((item) => item.categoryId === category).length;
      expect(count).toBeGreaterThanOrEqual(3);
    }
  });

  it("includes the required text fields", () => {
    for (const item of ZIKR_ITEMS) {
      expect(item.arabic.length).toBeGreaterThan(0);
      expect(item.transliteration.length).toBeGreaterThan(0);
      expect(item.translation.length).toBeGreaterThan(0);
    }
  });

  it("looks up an item by id", () => {
    const first = ZIKR_ITEMS[0];
    expect(first).toBeDefined();
    expect(getZikrById(first?.id ?? "")).toEqual(first);
    expect(getZikrById("does-not-exist")).toBeUndefined();
  });

  it("stores both authentic Bukhari wordings for the before-sleep name dua", () => {
    const item = getZikrById("before_sleep-name");
    expect(item).toBeDefined();
    expect(item?.arabic).toContain("بِاسْمِكَ اللَّهُمَّ");
    expect(item?.reference).toMatch(/6324/);
    expect(item?.reference).toMatch(/6314/);
    expect(item?.variants?.length).toBeGreaterThanOrEqual(1);
    expect(item?.variants?.[0]?.arabic).toContain("اللَّهُمَّ بِاسْمِكَ");
    expect(item?.variants?.[0]?.reference).toMatch(/6314/);
  });
});
