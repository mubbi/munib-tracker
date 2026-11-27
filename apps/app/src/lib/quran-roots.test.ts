import { buckwalterToArabic, rootToArabic } from "@/lib/quran-morphology/buckwalter";
import type { RootIndex } from "@/lib/quran-morphology/build-index";
import { buildFixtureIndex } from "@/test-support/quran-morphology";

import {
  buildSurahWordRoots,
  createRootSuggestionIndex,
  getRootOccurrences,
  listRoots,
  lookupRoots,
  parseRootQuery,
  searchRoots,
  studyWordIndexes,
  suggestRoots,
} from "./quran-roots";

const cp = (...codes: number[]) => String.fromCodePoint(...codes);
// Root letters typed by a user are built from code points / the mapping table.
const spaced = rootToArabic("rHm");
const compact = spaced.replace(/ /g, "");

let index: RootIndex;
beforeAll(async () => {
  index = await buildFixtureIndex();
});

describe("parseRootQuery", () => {
  it.each([
    ["spaced Arabic", spaced],
    ["hyphenated Arabic", spaced.replace(/ /g, "-")],
    ["Arabic with harakat", `${cp(0x631, 0x64e)} ${cp(0x62d, 0x650)} ${cp(0x645, 0x652)}`],
  ])("reads %s as one root", (_label, input) => {
    expect(parseRootQuery(input)).toMatchObject({
      kind: "root",
      candidates: ["rHm"],
      script: "arabic",
    });
  });

  it("treats unseparated Arabic as a root that may also be a word", () => {
    expect(parseRootQuery(compact)).toMatchObject({
      kind: "root",
      candidates: ["rHm"],
      word: expect.any(String),
    });
  });

  it.each([cp(0x623), cp(0x625), cp(0x621), cp(0x622)])(
    "folds hamza form %s to the dataset convention",
    (hamza) => {
      expect(parseRootQuery(`${hamza} ${cp(0x645)} ${cp(0x646)}`)).toMatchObject({
        candidates: ["Amn"],
      });
    },
  );

  it("folds alif maqsura to y", () => {
    expect(parseRootQuery(`${cp(0x647)} ${cp(0x62f)} ${cp(0x649)}`)).toMatchObject({
      candidates: ["hdy"],
    });
  });

  it("reads Buckwalter literally (case-sensitive)", () => {
    expect(parseRootQuery("rHm")).toEqual({ kind: "root", candidates: ["rHm"], script: "latin" });
  });

  it("returns several candidates for ambiguous Latin", () => {
    const query = parseRootQuery("r-h-m");
    expect(query.kind).toBe("root");
    if (query.kind !== "root") return;
    expect(query.candidates).toEqual(expect.arrayContaining(["rHm", "rhm"]));
    expect(parseRootQuery("ktb")).toMatchObject({ candidates: expect.arrayContaining(["ktb"]) });
    expect(parseRootQuery("shkr")).toMatchObject({ candidates: expect.arrayContaining(["$kr"]) });
  });

  it("treats long Arabic input as a whole word and blank input as empty", () => {
    expect(parseRootQuery(buckwalterToArabic("{lr~aHoma`ni")).kind).toBe("word");
    expect(parseRootQuery("   ")).toEqual({ kind: "empty" });
  });
});

describe("lookupRoots", () => {
  it("matches a root exactly", () => {
    expect(searchRoots(index, spaced)).toEqual({ kind: "roots", roots: ["rHm"], via: "root" });
  });

  it("filters ambiguous Latin candidates to roots that exist", () => {
    expect(searchRoots(index, "r-h-m")).toEqual({ kind: "roots", roots: ["rHm"], via: "root" });
  });

  it("finds a root through a whole word", () => {
    expect(searchRoots(index, buckwalterToArabic("{lr~aHiymi"))).toEqual({
      kind: "roots",
      roots: ["rHm"],
      via: "word",
    });
  });

  it("reports a dataset word without a root as rootless", () => {
    expect(searchRoots(index, buckwalterToArabic("humu"))).toEqual({ kind: "rootless" });
  });

  it("returns none for unknown input (UI offers text search)", () => {
    expect(lookupRoots(index, parseRootQuery("zzq"))).toEqual({ kind: "none" });
  });
});

describe("getRootOccurrences", () => {
  it("groups by lemma with counts and a per-surah distribution", () => {
    const result = getRootOccurrences(index, "rHm");
    expect(result?.total).toBe(4);
    expect(result?.lemmas.map((l) => l.count)).toEqual([2, 2]);
    expect(result?.lemmas[0]).toMatchObject({ lemma: "r~aHiym" });
    expect(result?.lemmas[0].locations[0]).toEqual({ surah: 1, ayah: 1, word: 4 });
    expect(result?.distribution).toEqual([{ surah: 1, count: 4 }]);
    expect(getRootOccurrences(index, "zzz")).toBeNull();
  });
});

describe("word ↔ study alignment", () => {
  it("is the identity for aligned ayahs", () => {
    expect(studyWordIndexes(index, { surah: 1, ayah: 1, word: 3 })).toEqual([2]);
  });

  it("follows a recorded join/split", async () => {
    const joins = await buildFixtureIndex("qac-join-split-excerpt.txt");
    expect(studyWordIndexes(joins, { surah: 15, ayah: 7, word: 2 })).toEqual([0]);
    expect(studyWordIndexes(joins, { surah: 15, ayah: 7, word: 3 })).toEqual([1]);
  });

  it("maps bundled words to roots for the word-by-word chip", () => {
    const roots = buildSurahWordRoots(index, 1);
    expect(roots.get("1:2")).toEqual(["rHm"]);
    expect(roots.get("2:1")).toEqual(["Alh"]);
    expect(roots.get("2:2")).toEqual(["rbb"]);
    expect(roots.has("5:0")).toBe(false); // rootless pronoun
  });
});

describe("suggestRoots", () => {
  it("offers near roots for a root that is not in the data", () => {
    const suggestions = suggestRoots(
      index,
      createRootSuggestionIndex(listRoots(index)),
      `${cp(0x631)} ${cp(0x62d)} ${cp(0x646)}`,
    );
    expect(suggestions).toContain("rHm");
  });
});
