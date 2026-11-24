import { describe, expect, it } from "vitest";

import { CLASSICAL_WORKS } from "../../fiqh/differences";
import { MADHHAB_IDS } from "../../fiqh/madhhab-rules";
import { HEIR_TYPES, type HeirType } from "../../types/heirs";
import type { MadhhabId } from "../../types/preferences";
import awl from "../__fixtures__/awl.json";
import exclusion from "../__fixtures__/exclusion.json";
import grandfatherSiblings from "../__fixtures__/grandfather-siblings.json";
import radd from "../__fixtures__/radd.json";
import residuaries from "../__fixtures__/residuaries.json";
import shareTable from "../__fixtures__/share-table.json";
import specialCases from "../__fixtures__/special-cases.json";
import { calculateMirath } from "../engine";
import { parseFraction, toFractionString } from "../rational";
import { MIRATH_ENABLED, MIRATH_REVIEW } from "../release";
import type { MirathInput } from "../types";

interface Expected {
  shares: Partial<Record<HeirType, string>>;
  awlBase?: number;
  tashih?: number;
  radd?: boolean;
  unallocated?: string;
  outcome?: string;
}
interface Source {
  kind: "quran" | "hadith" | "book";
  ref?: string;
  grade?: string;
  work?: string;
  chapter?: string;
}
interface Fixture {
  id: string;
  title: string;
  basis: "rule" | "classical_case";
  case?: string;
  input: Omit<MirathInput, "school">;
  expected: Partial<Record<MadhhabId | "all", Expected>>;
  sources: Source[];
  verifiedBy: string;
  verifiedAt: string;
}

const GROUPS = [
  shareTable,
  residuaries,
  exclusion,
  awl,
  radd,
  specialCases,
  grandfatherSiblings,
] as unknown as {
  group: string;
  fixtures: Fixture[];
}[];
const FIXTURES = GROUPS.flatMap((g) => g.fixtures);

/** Each fixture × each school: the school's own expectation, else the shared one. */
const CASES = FIXTURES.flatMap((fx) =>
  MADHHAB_IDS.map((school) => [`${fx.id} [${school}]`, fx, school] as const),
);

describe.concurrent("Mirath fixture suite (D6 release gate)", () => {
  it("has at least 150 fixtures with unique ids", () => {
    expect(FIXTURES.length).toBeGreaterThanOrEqual(150);
    expect(new Set(FIXTURES.map((f) => f.id)).size).toBe(FIXTURES.length);
  });

  it("is reviewed (D11): every fixture carries verifiedBy + sources while the feature is enabled", () => {
    if (!MIRATH_ENABLED) return;
    for (const fx of FIXTURES) {
      expect({ id: fx.id, verifiedBy: fx.verifiedBy }).toEqual({
        id: fx.id,
        verifiedBy: MIRATH_REVIEW.verifiedBy,
      });
      expect(fx.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(fx.sources.length).toBeGreaterThan(0);
      // Every fixture cites at least one classical work by chapter, or a verified hadith case.
      expect(fx.sources.some((s) => s.kind === "book" || s.kind === "hadith")).toBe(true);
      if (fx.basis === "classical_case") expect(fx.case).toBeTruthy();
    }
  });

  it("cites only known works, Qur'an 4:x refs and the verified hadith", () => {
    const hadith = new Set([
      "bukhari:6732",
      "bukhari:6736",
      "bukhari:6741",
      "bukhari:6764",
      "abudawud:2894",
      "tirmidhi:2101",
      "tirmidhi:2104",
    ]);
    for (const s of FIXTURES.flatMap((f) => f.sources)) {
      if (s.kind === "book") {
        expect(Object.keys(CLASSICAL_WORKS)).toContain(s.work);
        expect(s.chapter?.length).toBeGreaterThan(3);
      } else if (s.kind === "quran") expect(["4:11", "4:12", "4:176"]).toContain(s.ref);
      else expect(hadith.has(s.ref ?? "")).toBe(true);
    }
  });

  it("covers every 'awl base the plan lists", () => {
    const bases = new Set(
      FIXTURES.flatMap((f) => Object.values(f.expected).map((e) => e?.awlBase)).filter(Boolean),
    );
    for (const b of [7, 8, 9, 10, 13, 15, 17, 27]) expect(bases).toContain(b);
  });

  it.each(CASES)("%s", (_label, fx, school) => {
    const expected = (fx.expected[school] ?? fx.expected.all) as Expected;
    expect(expected).toBeDefined();
    const result = calculateMirath({ ...fx.input, school });
    if (expected.outcome) {
      expect(result.outcome).toBe(expected.outcome);
      return;
    }
    expect(result.outcome).toBe("distributed");
    const actual: Partial<Record<HeirType, string>> = {};
    for (const h of result.heirs) if (h.inherits) actual[h.heir] = toFractionString(h.share);
    const want: Partial<Record<HeirType, string>> = {};
    for (const [h, frac] of Object.entries(expected.shares)) {
      want[h as HeirType] = toFractionString(parseFraction(frac as string));
    }
    expect(actual).toEqual(want);
    // Every listed heir not in `shares` inherits nothing.
    for (const h of HEIR_TYPES) {
      if (!(h in want))
        expect(result.heirs.find((x) => x.heir === h)?.inherits ?? false).toBe(false);
    }
    if (expected.awlBase != null) {
      expect(result.awl).toBe(true);
      expect(Number(result.awlBase)).toBe(expected.awlBase);
    } else expect(result.awl).toBe(false);
    if (expected.tashih != null) expect(Number(result.tashihBase)).toBe(expected.tashih);
    expect(result.radd).toBe(expected.radd ?? false);
    if (expected.unallocated) {
      expect(result.unallocated && toFractionString(result.unallocated.share)).toBe(
        expected.unallocated,
      );
    } else expect(result.unallocated).toBeUndefined();
  });
});
