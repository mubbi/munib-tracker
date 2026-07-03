import { describe, expect, it } from "vitest";
import { DUA_CONTENT_VERSION, DUA_ITEMS } from "./duas";
import { DUROOD_CONTENT_VERSION, DUROOD_ITEMS } from "./duroods";
import { NAMES_CONTENT_VERSION, NAMES_OF_ALLAH } from "./names";
import { ZIKR_CONTENT_VERSION, ZIKR_ITEMS } from "./zikr";

describe.concurrent("content", () => {
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

  it("ships all 99 names of Allah", () => {
    expect(NAMES_OF_ALLAH.length).toBe(99);
    for (const name of NAMES_OF_ALLAH) {
      expect(name.meaning?.length ?? 0).toBeGreaterThan(0);
    }
  });

  it("gives every dua and zikr a non-empty reference", () => {
    for (const item of [...ZIKR_ITEMS, ...DUA_ITEMS]) {
      expect(item.reference?.trim().length ?? 0).toBeGreaterThan(0);
    }
  });

  it("bumped every content version past the initial release", () => {
    expect(ZIKR_CONTENT_VERSION).toBeGreaterThanOrEqual(2);
    expect(DUA_CONTENT_VERSION).toBeGreaterThanOrEqual(2);
    expect(DUROOD_CONTENT_VERSION).toBeGreaterThanOrEqual(2);
    expect(NAMES_CONTENT_VERSION).toBeGreaterThanOrEqual(2);
  });
});
