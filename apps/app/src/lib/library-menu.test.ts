import {
  createLibraryMenuSearch,
  LIBRARY_MENU_META,
  LIBRARY_SEARCH_ALIASES,
} from "@/lib/library-menu";
import { DEFAULT_QUICK_ACTION_ORDER, QUICK_ACTION_META } from "@/lib/quick-actions";

describe("library menu catalog", () => {
  it("matches quick-action meta ids 1:1", () => {
    const libraryIds = LIBRARY_MENU_META.map((entry) => entry.id).sort();
    const metaIds = QUICK_ACTION_META.map((entry) => entry.id).sort();
    expect(libraryIds).toEqual(metaIds);
  });

  it("includes every default home Explore shortcut", () => {
    const libraryIds = new Set(LIBRARY_MENU_META.map((entry) => entry.id));
    for (const id of DEFAULT_QUICK_ACTION_ORDER) {
      expect(libraryIds.has(id)).toBe(true);
    }
  });

  it("only aliases known library menu ids", () => {
    const libraryIds = new Set(LIBRARY_MENU_META.map((entry) => entry.id));
    for (const id of Object.keys(LIBRARY_SEARCH_ALIASES)) {
      expect(libraryIds.has(id)).toBe(true);
    }
  });
});

describe("createLibraryMenuSearch", () => {
  const index = createLibraryMenuSearch(
    LIBRARY_MENU_META.map((entry) => ({
      ...entry,
      // Stable English labels for alias tests (independent of i18n runtime).
      label: entry.id,
    })),
  );

  it.each([
    ["adhkar", "zikr"],
    ["azkar", "zikr"],
    ["zikar", "zikr"],
    ["dhikr", "zikr"],
    ["qadha", "qaza"],
    ["qada", "qaza"],
    ["koran", "quran"],
    ["tasbih", "tasbeeh"],
    ["salat", "salahGuide"],
    ["namaz", "salahGuide"],
    ["hadeeth", "hadith"],
    ["darood", "duroods"],
    ["duaa", "duas"],
    ["wudu", "taharah"],
    ["jumuah", "friday"],
  ] as const)("maps %# %s → %s", (query, expectedId) => {
    const ids = index.search(query).map((entry) => entry.id);
    expect(ids).toContain(expectedId);
  });

  it("returns both zikr destinations for shared adhkar spellings", () => {
    const ids = index.search("azkar").map((entry) => entry.id);
    expect(ids).toEqual(expect.arrayContaining(["zikr", "adhkarBuilder"]));
  });
});
