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

  it("has non-empty arabic and translation for every item", () => {
    const all = [...ZIKR_ITEMS, ...NAMES_OF_ALLAH, ...DUA_ITEMS, ...DUROOD_ITEMS];
    for (const item of all) {
      expect(item.arabic.length).toBeGreaterThan(0);
      expect(item.translation.length).toBeGreaterThan(0);
    }
  });

  it("has a transliteration for every zikr and name (optional for duas & duroods)", () => {
    for (const item of [...ZIKR_ITEMS, ...NAMES_OF_ALLAH]) {
      expect(item.transliteration.length).toBeGreaterThan(0);
    }
  });

  it("never ships truncated Arabic (no ellipsis) in any content set", () => {
    const all = [...ZIKR_ITEMS, ...DUA_ITEMS, ...DUROOD_ITEMS];
    for (const item of all) {
      expect(item.arabic).not.toMatch(/…|\.\.\./);
    }
  });

  it("restores Qur'an recitations Hisnul Muslim abbreviates (never just the opening words)", () => {
    const byId = new Map(DUA_ITEMS.map((item) => [item.id, item]));
    // Letters only — mushaf marks are ordered differently from typed Arabic.
    const letters = (text = "") => text.replace(/[ٱأإآ]/g, "ا").replace(/[^ء-ي]/g, "");
    // Ayat al-Kursi after salah, morning & evening, and before sleep: the full
    // verse (ends "…al-'Aliyy al-'Azim"), not "Allahu la ilaha illa huwa…".
    for (const id of ["hisn-71", "hisn-75", "hisn-100"]) {
      const item = byId.get(id);
      expect(letters(item?.arabic).endsWith("وهوالعليالعظيم")).toBe(true);
      expect(item?.virtues?.length ?? 0).toBeGreaterThan(0);
    }
    // The three Quls (after salah, morning & evening, before sleep) — all three surahs.
    for (const id of ["hisn-70", "hisn-76", "hisn-99"]) {
      expect(byId.get(id)?.arabic.split("\n")).toHaveLength(3);
    }
    // Last two of Al-Baqarah, Al-'Imran 190-200, As-Sajdah + Al-Mulk, Al-Kahf 1-10.
    for (const id of ["hisn-101", "hisn-4", "hisn-110", "hisn-199"]) {
      expect(byId.get(id)?.arabic.length ?? 0).toBeGreaterThan(400);
    }
  });

  it("ships the full Hisnul Muslim dua corpus across many categories", () => {
    expect(DUA_ITEMS.length).toBeGreaterThan(200);
    const categories = new Set(DUA_ITEMS.map((item) => item.categoryId));
    expect(categories.size).toBeGreaterThanOrEqual(12);
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
