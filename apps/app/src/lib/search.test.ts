import { DUROOD_ITEMS, duasByCategory, NAMES_OF_ALLAH } from "@munib-tracker/shared/content";

import { getBundledCollection } from "@/lib/hadith";
import { getSurahAyahs } from "@/lib/quran";
import {
  createCustomAdhkarSearch,
  createDuaSearch,
  createDuroodSearch,
  createFuzzyIndex,
  createHadithSearch,
  createNameSearch,
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
import { searchLightWithGuides } from "@/lib/search-with-guides";
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

  it("finds Journey to Jannah topics", () => {
    const groups = searchLightWithGuides("firdaws");
    const jannah = groups.find((g) => g.category === "jannah");
    expect(jannah).toBeDefined();
    expect(jannah?.results.some((r) => r.params?.topic === "al-firdaws")).toBe(true);
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

  it("finds an ayah by its Arabic text", () => {
    // Al-Ikhlas 112:2 ("Allāhu-ṣ-Ṣamad") — the word الصمد occurs in only this
    // ayah in the whole Qur'an, so it is an unambiguous match. Derive the query
    // from the bundled data (harakat and all) instead of hardcoding a string, so
    // the test tracks the real content and fails if the Arabic field is ever
    // dropped from the ayah index (an Arabic query hits no Latin field).
    const query = getSurahAyahs(112)[1].arabic;
    const group = searchQuranAyahs(query);
    expect(group.results.some((r) => r.params?.surah === "112" && r.params?.ayah === "2")).toBe(
      true,
    );
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

  it("finds a surah by English meaning", () => {
    expect(searchSurahList("cow").some((s) => s.number === 2)).toBe(true);
    expect(searchSurahList("opener").some((s) => s.number === 1)).toBe(true);
  });

  it("finds a surah by Arabic name", () => {
    expect(searchSurahList("فات").some((s) => s.number === 1)).toBe(true);
    expect(searchSurahList("بقر").some((s) => s.number === 2)).toBe(true);
  });

  it("matches an exact surah number", () => {
    expect(searchSurahList("1").some((s) => s.number === 1)).toBe(true);
    expect(searchSurahList("114").some((s) => s.number === 114)).toBe(true);
  });

  it("filters by revelation place", () => {
    const makki = searchSurahList("", { revelation: "makkah" });
    const madani = searchSurahList("", { revelation: "madinah" });
    expect(makki.every((s) => s.revelationPlace === "makkah")).toBe(true);
    expect(madani.every((s) => s.revelationPlace === "madinah")).toBe(true);
    expect(makki.length + madani.length).toBe(114);
  });

  it("combines fuzzy search with a revelation filter", () => {
    const hits = searchSurahList("al", { revelation: "makkah" });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((s) => s.revelationPlace === "makkah")).toBe(true);
  });

  it("returns the full list for an empty query and respects the limit", () => {
    expect(searchSurahList("").length).toBe(114);
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
    const items = duasByCategory("food");
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

describe("createDuroodSearch", () => {
  it("fuzzy-searches the duroods list", () => {
    const index = createDuroodSearch(DUROOD_ITEMS);
    expect(index.search("ibrahim").length).toBeGreaterThan(0);
    expect(index.search("")).toEqual([]);
  });
});

describe("createCustomAdhkarSearch", () => {
  it("fuzzy-searches custom adhkar by title and body fields", () => {
    const index = createCustomAdhkarSearch([
      {
        id: "a1",
        title: "Morning protection",
        arabic: "أعوذ بالله",
        transliteration: "A'udhu billah",
        translation: "I seek refuge in Allah",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "a2",
        title: "Evening dhikr",
        arabic: "سبحان الله",
        transliteration: "Subhanallah",
        translation: "Glory be to Allah",
        createdAt: "2026-01-02T00:00:00.000Z",
        updatedAt: "2026-01-02T00:00:00.000Z",
      },
    ]);
    expect(index.search("morning").map((item) => item.id)).toEqual(["a1"]);
    expect(index.search("subhan").map((item) => item.id)).toEqual(["a2"]);
    expect(index.search("refuge").map((item) => item.id)).toEqual(["a1"]);
    expect(index.search("")).toEqual([]);
  });
});

describe("createNameSearch", () => {
  it("fuzzy-searches the 99 names by transliteration and meaning", () => {
    const index = createNameSearch(NAMES_OF_ALLAH);
    expect(index.search("rahman").length).toBeGreaterThan(0);
    // Typo tolerance over the normalized fields.
    expect(index.search("merciful").length).toBeGreaterThan(0);
    expect(index.search("")).toEqual([]);
  });
});

describe("searchDuaList", () => {
  it("finds duas by title or category, typo-tolerant", () => {
    expect(searchDuaList("travel").length).toBeGreaterThan(0);
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
