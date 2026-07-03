import {
  isAyahIndexReady,
  normalize,
  searchAll,
  searchLight,
  searchQuranAyahs,
  tokenize,
} from "@/lib/search";

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
    const expected = ["quran", "hadith", "dua", "zikr", "name", "durood"].filter((c) =>
      order.includes(c as (typeof order)[number]),
    );
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
