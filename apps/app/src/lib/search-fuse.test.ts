import { describe, expect, it } from "@jest/globals";

import {
  createFuzzyIndex,
  fusePattern,
  MIN_TOKEN_LENGTH,
  makeFuse,
  normalize,
  tokenize,
} from "./search-fuse";

describe("normalize / tokenize", () => {
  it("folds diacritics and joiners", () => {
    expect(normalize("Subhân-Allâh!")).toBe("subhanallah");
  });

  it("returns no tokens for short queries", () => {
    expect(tokenize("a")).toEqual([]);
    expect(tokenize("  ")).toEqual([]);
  });

  it("splits normalized tokens", () => {
    expect(tokenize("Al Baqarah")).toEqual(["al", "baqarah"]);
  });
});

describe("fusePattern", () => {
  it("joins tokens with spaces for extended search", () => {
    expect(fusePattern("Al Baqarah")).toBe("al baqarah");
  });

  it("drops tokens below MIN_TOKEN_LENGTH", () => {
    expect(fusePattern("a ba")).toBe("ba");
    expect(MIN_TOKEN_LENGTH).toBe(2);
  });
});

describe("makeFuse defaults", () => {
  type Item = { title: string; body?: string };

  const items: Item[] = [
    { title: "Al-Fatihah", body: "Opening chapter" },
    { title: "Al-Baqarah", body: "The cow" },
    { title: "Al-Imran", body: "Family of Imran" },
  ];

  const fields = [
    { key: "title", weight: 2, get: (item: Item) => item.title },
    { key: "body", weight: 1, get: (item: Item) => item.body },
  ];

  it("finds fuzzy matches with typo tolerance", () => {
    const fuse = makeFuse(items, fields);
    const matches = fuse.search(fusePattern("fatiah"));
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0]?.item.item.title).toBe("Al-Fatihah");
  });

  it("ranks title matches above body-only matches", () => {
    const fuse = makeFuse(items, fields);
    const matches = fuse.search(fusePattern("baqarah"));
    expect(matches[0]?.item.item.title).toBe("Al-Baqarah");
  });
});

describe("createFuzzyIndex", () => {
  it("returns empty results for too-short queries", () => {
    const index = createFuzzyIndex(
      [{ name: "Fajr" }],
      [{ key: "name", weight: 1, get: (row) => row.name }],
    );
    expect(index.search("f")).toEqual([]);
    expect(index.count("f")).toBe(0);
  });

  it("respects limit and count", () => {
    const rows = [{ name: "Fajr" }, { name: "Dhuhr" }, { name: "Asr" }];
    const index = createFuzzyIndex(rows, [{ key: "name", weight: 1, get: (row) => row.name }]);
    expect(index.search("ajr", 1)).toHaveLength(1);
    expect(index.count("ajr")).toBeGreaterThanOrEqual(1);
  });
});
