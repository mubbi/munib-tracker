import { DUA_ITEMS } from "@munib-tracker/shared/content/duas";
import type { DuaItem } from "@munib-tracker/shared/types";

import {
  DUA_CATEGORY_GROUPS,
  DUA_CATEGORY_ICONS,
  DUA_CATEGORY_IDS,
  duaMomentFor,
  duaNeighbors,
  duaOccasion,
  duaOfTheDay,
  formatDuaHeading,
  groupDuasByOccasion,
  isDuaCategoryId,
  shortOccasionLabel,
} from "./dua-browse";

function dua(id: string, title: string, extra: Partial<DuaItem> = {}): DuaItem {
  return {
    id,
    categoryId: "sleep",
    title,
    arabic: "بِسْمِ اللَّهِ",
    translation: `Translation ${id}`,
    ...extra,
  };
}

describe("dua taxonomy", () => {
  it("places every category in exactly one group, with an icon", () => {
    const grouped = DUA_CATEGORY_GROUPS.flatMap((group) => group.categories);
    expect([...grouped].sort()).toEqual([...DUA_CATEGORY_IDS].sort());
    expect(new Set(grouped).size).toBe(grouped.length);
    for (const id of DUA_CATEGORY_IDS) expect(DUA_CATEGORY_ICONS[id]).toBeDefined();
  });

  it("covers every category used by the bundled corpus", () => {
    for (const item of DUA_ITEMS) expect(isDuaCategoryId(item.categoryId)).toBe(true);
    expect(isDuaCategoryId("nope")).toBe(false);
    expect(isDuaCategoryId(undefined)).toBe(false);
  });
});

describe("formatDuaHeading", () => {
  it("drops the source sequence suffix and folds transliteration marks", () => {
    expect(formatDuaHeading("While bowing in Ŝalâh (Rukû') #3")).toBe(
      "While bowing in Salah (Ruku')",
    );
    expect(formatDuaHeading("Supplications related to the Athân (call to prayer) #1")).toBe(
      "Supplications related to the Adhan (call to prayer)",
    );
    expect(formatDuaHeading("Du'â Qunût Al-Witr  #1")).toBe("Dua Qunut Al-Witr");
    expect(formatDuaHeading("Remembrance said at a sitting or gathering, etc...")).toBe(
      "Remembrance said at a sitting or gathering",
    );
  });

  it("leaves curated headings alone", () => {
    expect(formatDuaHeading("Entering the masjid")).toBe("Entering the masjid");
  });

  it("never leaves a sequence suffix on any bundled heading", () => {
    for (const item of DUA_ITEMS) expect(duaOccasion(item)).not.toMatch(/#\s*\d+$/);
  });
});

describe("shortOccasionLabel", () => {
  it("drops lead-ins and glosses for compact chips", () => {
    expect(shortOccasionLabel("Supplications at the start of Salah (prayer)")).toBe(
      "At the start of Salah",
    );
    expect(shortOccasionLabel("Supplications related to the Adhan (call to prayer)")).toBe("Adhan");
    expect(shortOccasionLabel("Supplication when wearing clothes")).toBe("When wearing clothes");
    expect(shortOccasionLabel("Remembrance before sleeping")).toBe("Before sleeping");
    expect(shortOccasionLabel("Upon waking up")).toBe("Upon waking up");
  });
});

describe("groupDuasByOccasion", () => {
  it("titles repeated occasions and collects one-offs into untitled runs", () => {
    const sections = groupDuasByOccasion([
      dua("a", "Upon waking up #1"),
      dua("b", "Upon waking up #2"),
      dua("c", "Turning over at night"),
      dua("d", "Upon a bad dream"),
      dua("e", "Before sleeping #1"),
      dua("f", "Before sleeping #2"),
    ]);
    expect(sections.map((s) => [s.title, s.items.map((i) => i.id)])).toEqual([
      ["Upon waking up", ["a", "b"]],
      [null, ["c", "d"]],
      ["Before sleeping", ["e", "f"]],
    ]);
  });

  it("keeps every dua exactly once for every real category", () => {
    for (const categoryId of DUA_CATEGORY_IDS) {
      const items = DUA_ITEMS.filter((item) => item.categoryId === categoryId);
      const flat = groupDuasByOccasion(items).flatMap((s) => s.items.map((i) => i.id));
      expect([...flat].sort()).toEqual(items.map((i) => i.id).sort());
    }
  });

  it("groups the 24 morning & evening remembrances under one heading", () => {
    const items = DUA_ITEMS.filter((item) => item.categoryId === "morning_evening");
    const sections = groupDuasByOccasion(items);
    const largest = Math.max(...sections.map((s) => s.items.length));
    expect(largest).toBeGreaterThanOrEqual(20);
  });
});

describe("duaNeighbors", () => {
  const items = [
    dua("a", "Upon waking up #1"),
    dua("x", "Other", { categoryId: "food" }),
    dua("b", "Turning over"),
    dua("c", "Upon waking up #2"),
  ];

  it("walks the grouped browse order within the category", () => {
    // Browse order: [a, c] (Upon waking up) then [b] (one-off).
    expect(duaNeighbors(items, "a")).toMatchObject({
      previous: undefined,
      next: { id: "c" },
      position: 1,
      total: 3,
      occasion: { title: "Upon waking up", position: 1, total: 2 },
    });
    expect(duaNeighbors(items, "c")).toMatchObject({ previous: { id: "a" }, next: { id: "b" } });
    expect(duaNeighbors(items, "b")).toMatchObject({ next: undefined, position: 3 });
    expect(duaNeighbors(items, "b")?.occasion).toBeUndefined();
  });

  it("returns null for an unknown id", () => {
    expect(duaNeighbors(items, "missing")).toBeNull();
  });
});

describe("suggestions", () => {
  it("maps the local hour to a moment", () => {
    const at = (h: number) => duaMomentFor(new Date(2026, 10, 23, h, 0)).moment;
    expect(at(5)).toBe("morning");
    expect(at(12)).toBe("midday");
    expect(at(17)).toBe("evening");
    expect(at(23)).toBe("night");
    expect(at(1)).toBe("night");
  });

  it("picks a stable, transliterated dua of the day", () => {
    const morning = new Date(2026, 10, 23, 6);
    const night = new Date(2026, 10, 23, 23);
    const pick = duaOfTheDay(DUA_ITEMS, morning);
    expect(pick?.transliteration).toBeTruthy();
    expect(duaOfTheDay(DUA_ITEMS, night)?.id).toBe(pick?.id);
    expect(duaOfTheDay(DUA_ITEMS, new Date(2026, 10, 24, 6))?.id).not.toBe(pick?.id);
    expect(duaOfTheDay([], morning)).toBeUndefined();
  });
});
