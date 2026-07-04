import { duasByCategory } from "@munib-tracker/shared/content";

import { getBundledCollection } from "@/lib/hadith";
import {
  createDuaSearch,
  createFuzzyIndex,
  createHadithSearch,
  createZikrSearch,
  isAyahIndexReady,
  normalize,
  SEARCH_CATEGORY_ORDER,
  searchAll,
  searchDuaList,
  searchLight,
  searchQuranAyahs,
  searchSurahList,
  searchZikrList,
  tokenize,
} from "@/lib/search";
import { zikrByCategory } from "@/lib/zikr";

describe("normalize", () => {
  it("strips Latin diacritics and lowercases", () => {
    expect(normalize("Subhân-Allâh!")).toBe("subhanallah");
  });

  it("removes intra-word joiners so both spaced and joined forms match", () => {
    // "Ar-Rahman" folds to a single token; a spaced query still matches by substring.
    expect(normalize("Ar-Rahman")).toBe("arrahman");
    expect(normalize("Qur'an")).toBe("quran");
  });

  it("strips Arabic harakat but preserves the letters", () => {
    // الْحَمْدُ (with sukun/fatha/damma) → الحمد
    expect(normalize("الْحَمْدُ")).toBe("الحمد");
  });

  it("does not strip Arabic letters or Arabic-Indic digits (regression guard)", () => {
    // ف ق ك must survive, and the Arabic-Indic digit ١ (U+0661) too.
    expect(normalize("فقك")).toBe("فقك");
    expect(normalize("١")).toBe("١");
  });

  it("folds alef and taa-marbuta variants", () => {
    // أ إ آ ٱ → ا ; ة → ه
    expect(normalize("أإآٱ")).toBe("اااا");
    expect(normalize("صلاة")).toBe("صلاه");
  });
});

describe("tokenize", () => {
  it("returns no tokens for queries under two characters", () => {
    expect(tokenize("")).toEqual([]);
    expect(tokenize("a")).toEqual([]);
    expect(tokenize("  ")).toEqual([]);
  });

  it("splits a normalized multi-word query", () => {
    expect(tokenize("morning adhkar")).toEqual(["morning", "adhkar"]);
  });
});

describe("searchLight", () => {
  it("finds a surah by transliterated name without touching ayah full-text", () => {
    const groups = searchLight("fatiha");
    const quran = groups.find((g) => g.category === "quran");
    expect(quran).toBeDefined();
    expect(quran?.results.some((r) => r.params?.surah === "1")).toBe(true);
    // Light search must not have built the heavy ayah index.
    expect(quran?.results.every((r) => !r.params?.ayah)).toBe(true);
  });

  it("finds one of the 99 names", () => {
    const groups = searchLight("rahman");
    const names = groups.find((g) => g.category === "name");
    expect(names?.results.some((r) => /rahman/i.test(r.title))).toBe(true);
  });

  it("returns nothing for an empty query", () => {
    expect(searchLight("")).toEqual([]);
  });

  it("orders groups by the fixed category order", () => {
    const groups = searchLight("allah");
    const order = groups.map((g) => g.category);
    const expected = SEARCH_CATEGORY_ORDER.filter((c) => order.includes(c));
    expect(order).toEqual(expected);
  });
});

describe("searchQuranAyahs", () => {
  it("returns ayah results anchored to a surah and ayah", () => {
    const group = searchQuranAyahs("mercy");
    expect(group.total).toBeGreaterThan(0);
    expect(isAyahIndexReady()).toBe(true);
    for (const result of group.results) {
      expect(result.category).toBe("quran");
      expect(result.href).toBe("/quran/[surah]");
      expect(result.params?.surah).toBeDefined();
      expect(result.params?.ayah).toBeDefined();
    }
  });

  it("respects the result limit", () => {
    const group = searchQuranAyahs("the", 3);
    expect(group.results.length).toBeLessThanOrEqual(3);
  });
});

describe("searchAll", () => {
  it("merges surah and ayah matches into a single Qur'an group", () => {
    const groups = searchAll("rahman");
    const quran = groups.find((g) => g.category === "quran");
    expect(quran).toBeDefined();
    // Should include at least a surah match (Ar-Rahman is surah 55).
    expect(quran?.results.some((r) => r.key.startsWith("quran-surah"))).toBe(true);
  });

  it("keeps the fixed category order even when Qur'an is inserted from ayahs only", () => {
    const groups = searchAll("mercy");
    const order = groups.map((g) => g.category);
    // Qur'an must lead the group order whenever it is present.
    if (order.includes("quran")) expect(order[0]).toBe("quran");
  });
});

describe("searchSurahList", () => {
  it("finds a surah by name, typo-tolerant", () => {
    expect(searchSurahList("baqara").some((s) => s.number === 2)).toBe(true);
    expect(searchSurahList("fatiah").some((s) => s.number === 1)).toBe(true);
  });

  it("returns nothing for an empty query and respects the limit", () => {
    expect(searchSurahList("")).toEqual([]);
    expect(searchSurahList("al", 3).length).toBeLessThanOrEqual(3);
  });
});

describe("createHadithSearch", () => {
  it("fuzzy-searches within one collection's items", () => {
    const items = getBundledCollection("nawawi40")?.items ?? [];
    const index = createHadithSearch(items);
    expect(index.search("messenger").length).toBeGreaterThan(0);
    // typo-tolerant (missing an 's')
    expect(index.search("mesenger").length).toBeGreaterThan(0);
    expect(index.count("messenger")).toBeGreaterThan(0);
    expect(index.search("")).toEqual([]);
  });
});

describe("createDuaSearch", () => {
  it("fuzzy-searches within one category's duas", () => {
    const items = duasByCategory("daily");
    const index = createDuaSearch(items);
    expect(index.search("eating").length).toBeGreaterThan(0);
    expect(index.search("")).toEqual([]);
  });
});

describe("createZikrSearch", () => {
  it("fuzzy-searches within one category's adhkar", () => {
    const items = zikrByCategory("morning");
    const index = createZikrSearch(items);
    expect(index.search("subhan").length).toBeGreaterThan(0);
    expect(index.search("")).toEqual([]);
  });
});

describe("searchDuaList", () => {
  it("finds duas by title or category, typo-tolerant", () => {
    expect(searchDuaList("sunnah").length).toBeGreaterThan(0);
    expect(searchDuaList("forgivness").length).toBeGreaterThan(0);
    expect(searchDuaList("")).toEqual([]);
  });
});

describe("searchZikrList", () => {
  it("finds adhkar by title or category id", () => {
    expect(searchZikrList("morning").length).toBeGreaterThan(0);
    expect(searchZikrList("subhanallah").length).toBeGreaterThan(0);
    expect(searchZikrList("")).toEqual([]);
  });
});

describe("createFuzzyIndex", () => {
  it("ranks typo-tolerant matches over an arbitrary list", () => {
    const index = createFuzzyIndex(
      [{ name: "Application" }, { name: "Bandana" }, { name: "Category" }],
      [{ key: "name", weight: 1, get: (x) => x.name }],
    );
    expect(index.search("aplication")[0]?.name).toBe("Application");
    expect(index.count("application")).toBe(1);
    expect(index.search("x")).toEqual([]);
  });
});
