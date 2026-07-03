import { describe, expect, it } from "vitest";
import { DUA_ITEMS } from "./duas";
import { DUROOD_ITEMS } from "./duroods";
import { NAMES_OF_ALLAH } from "./names";
import { ZIKR_ITEMS } from "./zikr";

describe("content", () => {
  it("has globally unique ids across every content set", () => {
    const ids = [
      ...ZIKR_ITEMS.map((i) => i.id),
      ...NAMES_OF_ALLAH.map((i) => i.id),
      ...DUA_ITEMS.map((i) => i.id),
      ...DUROOD_ITEMS.map((i) => i.id),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has non-empty arabic, transliteration, and translation for every item", () => {
    const all = [...ZIKR_ITEMS, ...NAMES_OF_ALLAH, ...DUA_ITEMS, ...DUROOD_ITEMS];
    for (const item of all) {
      expect(item.arabic.length).toBeGreaterThan(0);
      expect(item.transliteration.length).toBeGreaterThan(0);
      expect(item.translation.length).toBeGreaterThan(0);
    }
  });
});
