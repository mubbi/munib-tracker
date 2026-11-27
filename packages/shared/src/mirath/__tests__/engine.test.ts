import { describe, expect, it } from "vitest";

import { MADHHAB_IDS } from "../../fiqh/madhhab-rules";
import {
  calculateAllSchools,
  calculateMirath,
  differingHeirs,
  validateMirathInput,
} from "../engine";
import { allocateCents, computeNetEstate } from "../estate";
import {
  add,
  cmp,
  div,
  lcm,
  parseFraction,
  rat,
  sum,
  toFractionString,
  toPercent,
} from "../rational";
import { mirathSnapshotShares } from "../snapshot";
import type { MirathInput } from "../types";

const male = (heirs: MirathInput["heirs"], extra: Partial<MirathInput> = {}): MirathInput => ({
  school: "hanafi",
  deceased: { gender: "male" },
  heirs,
  ...extra,
});

describe.concurrent("rational", () => {
  it("reduces and keeps the denominator positive", () => {
    expect(rat(6, -8)).toEqual({ n: BigInt(-3), d: BigInt(4) });
    expect(toFractionString(add(rat(1, 6), rat(1, 3)))).toBe("1/2");
    expect(toFractionString(div(rat(1, 2), rat(3, 2)))).toBe("1/3");
    expect(cmp(rat(5, 18), rat(1, 6))).toBe(1);
    expect(lcm(BigInt(6), BigInt(8))).toBe(BigInt(24));
    expect(toFractionString(sum([rat(1, 8), rat(2, 3), rat(1, 6), rat(1, 6)]))).toBe("9/8");
  });

  it("parses fractions and rejects junk", () => {
    expect(parseFraction("16/27")).toEqual(rat(16, 27));
    expect(parseFraction("1")).toEqual(rat(1));
    expect(() => parseFraction("0.5")).toThrow();
  });

  it("rounds percentages for display only", () => {
    expect(toPercent(rat(1, 3))).toBe(33.33);
    expect(toPercent(rat(2, 3))).toBe(66.67);
  });
});

describe.concurrent("validation", () => {
  it.each([
    [{ wife: 5 }, "male", "too_many_wives"],
    [{ husband: 1, wife: 1 }, "female", "husband_and_wife"],
    [{ husband: 1 }, "male", "husband_needs_female_deceased"],
    [{ wife: 1 }, "female", "wife_needs_male_deceased"],
    [{ father: 2 }, "male", "only_one_allowed"],
    [{ son: 1.5 }, "male", "count_invalid"],
    [{ son: -1 }, "male", "count_invalid"],
  ] as const)("%j (%s) → %s", (heirs, gender, code) => {
    const issues = validateMirathInput({ heirs, deceased: { gender } });
    expect(issues.map((i) => i.code)).toContain(code);
    const result = calculateMirath({ school: "shafii", deceased: { gender }, heirs });
    expect(result.outcome).toBe("invalid");
    expect(result.heirs).toEqual([]);
  });
});

describe.concurrent("estate deductions", () => {
  it("pays funeral and debts first, then caps bequests at one third", () => {
    const { estate } = computeNetEstate({
      gross: 12_000,
      funeral: 500,
      debts: 2_500,
      bequests: 4_000,
      currency: "USD",
    });
    expect(estate.net).toBe(9_000);
    expect(estate.bequestCapped).toBe(true);
    expect(estate.bequests).toBe(3_000);
    expect(estate.distributable).toBe(6_000);
  });

  it("keeps a bequest within one third as asked", () => {
    const { estate } = computeNetEstate({
      gross: 900,
      funeral: 0,
      debts: 0,
      bequests: 300,
      currency: "EUR",
    });
    expect(estate.bequestCapped).toBe(false);
    expect(estate.distributable).toBe(600);
  });

  it("flags negative inputs and ignores a negative bequest", () => {
    const { estate, issues } = computeNetEstate({
      gross: 1_000,
      funeral: 0,
      debts: 0,
      bequests: -50,
      currency: "USD",
    });
    expect(issues).toEqual([{ code: "estate_negative" }]);
    expect(estate.bequestsRequested).toBe(0);
    expect(estate.distributable).toBe(1_000);
  });

  it("flags debts that exceed the estate", () => {
    const { estate, issues } = computeNetEstate({
      gross: 100,
      funeral: 50,
      debts: 80,
      bequests: 0,
      currency: "USD",
    });
    expect(estate.net).toBe(0);
    expect(issues.map((i) => i.code)).toEqual(["debts_exceed_estate"]);
  });

  it("splits cents exactly (largest remainder)", () => {
    const parts = allocateCents(BigInt(100), [rat(1, 3), rat(1, 3), rat(1, 3)]);
    expect(parts.reduce((a, b) => a + b, BigInt(0))).toBe(BigInt(100));
    expect(parts.map(Number).sort()).toEqual([33, 33, 34]);
  });

  it("gives amounts that add up to the distributable estate", () => {
    const result = calculateMirath(
      male(
        { wife: 1, daughter: 2, father: 1, mother: 1 },
        { estate: { gross: 1_000, funeral: 0, debts: 0, bequests: 0, currency: "USD" } },
      ),
    );
    const total = result.heirs.reduce((n, h) => n + Math.round((h.amount ?? 0) * 100), 0);
    expect(total).toBe(100_000);
  });

  it("includes the unallocated part in the amount split", () => {
    const result = calculateMirath(
      male(
        { wife: 1 },
        { estate: { gross: 800, funeral: 0, debts: 0, bequests: 0, currency: "USD" } },
      ),
    );
    expect(result.heirs[0]?.amount).toBe(200);
    expect(result.unallocated?.amount).toBe(600);
    expect(result.unallocated?.reason).toBe("spouse_only");
  });

  it("gives whole-cent per-head amounts that add up to the group total", () => {
    // Four wives share ⅛ of 100 = 12.50: two get 3.13 and two get 3.12 (not 4 × 3.12).
    const result = calculateMirath(
      male(
        { wife: 4, son: 1 },
        { estate: { gross: 100, funeral: 0, debts: 0, bequests: 0, currency: "USD" } },
      ),
    );
    const wives = result.heirs.find((h) => h.heir === "wife");
    expect(wives?.amount).toBe(12.5);
    expect(wives?.perHeadAmount).toBe(3.12);
    expect(wives?.perHeadAmountMax).toBe(3.13);
    expect(wives?.perHeadAmountMaxCount).toBe(2);
    const cents = (n?: number) => Math.round((n ?? 0) * 100);
    const lowHeads = (wives?.count ?? 0) - (wives?.perHeadAmountMaxCount ?? 0);
    expect(
      lowHeads * cents(wives?.perHeadAmount) +
        (wives?.perHeadAmountMaxCount ?? 0) * cents(wives?.perHeadAmountMax),
    ).toBe(1250);
    const son = result.heirs.find((h) => h.heir === "son");
    expect(son?.perHeadAmount).toBe(87.5);
    expect(son?.perHeadAmountMax).toBe(87.5);
    expect(son?.perHeadAmountMaxCount).toBe(0);
  });

  it("reports debts above the estate on the result (every amount is zero)", () => {
    const result = calculateMirath(
      male(
        { son: 2 },
        { estate: { gross: 100, funeral: 20, debts: 150, bequests: 10, currency: "USD" } },
      ),
    );
    expect(result.outcome).toBe("distributed");
    expect(result.issues.map((i) => i.code)).toContain("debts_exceed_estate");
    expect(result.estate?.distributable).toBe(0);
    expect(result.heirs.every((h) => h.amount === 0)).toBe(true);
  });
});

describe.concurrent("base (asl) shown to the user", () => {
  const base = (input: MirathInput) => {
    const r = calculateMirath(input);
    return { asl: Number(r.asl), radd: r.raddBase, tashih: Number(r.tashihBase) };
  };

  it("counts residuary heads, a male as two only beside females", () => {
    expect(base(male({ son: 3 }))).toMatchObject({ asl: 3, tashih: 3 });
    expect(base(male({ son: 2, daughter: 1 }))).toMatchObject({ asl: 5, tashih: 5 });
    expect(base(male({ full_brother: 2 }))).toMatchObject({ asl: 2, tashih: 2 });
    expect(base(male({ father: 1 }))).toMatchObject({ asl: 1, tashih: 1 });
  });

  it("uses the grandfather's muqasamah heads, or 3 when he takes a third", () => {
    const shafii = (heirs: MirathInput["heirs"]) => male(heirs, { school: "shafii" });
    expect(base(shafii({ paternal_grandfather: 1, full_brother: 1 })).asl).toBe(2);
    expect(base(shafii({ paternal_grandfather: 1, full_sister: 1 })).asl).toBe(3);
    // ⅓ beats sharing 1/4 with three brothers: base 3, corrected to 9.
    expect(base(shafii({ paternal_grandfather: 1, full_brother: 3 }))).toMatchObject({
      asl: 3,
      tashih: 9,
    });
  });

  it("shows the radd base instead of only the pre-radd LCM", () => {
    // Mother ⅙ + daughter ½: base 6 → 4 by radd.
    const md = calculateMirath(male({ mother: 1, daughter: 1 }));
    expect(Number(md.asl)).toBe(6);
    expect(Number(md.raddBase)).toBe(4);
    expect(Number(md.tashihBase)).toBe(4);
    // Two daughters: ⅔ → base 3 → 2.
    expect(Number(calculateMirath(male({ daughter: 2 })).raddBase)).toBe(2);
    // Wife ⅛ from 8; the 7 left doesn't divide by the radd heirs' 4 → 8 × 4 = 32.
    const wmd = calculateMirath(male({ wife: 1, mother: 1, daughter: 1 }));
    expect(Number(wmd.raddBase)).toBe(32);
    expect(Number(wmd.tashihBase)).toBe(32);
    // Wife ¼ from 4; the 3 left matches mother ⅙ + maternal siblings ⅓ (3) → 4.
    expect(
      Number(calculateMirath(male({ wife: 1, mother: 1, maternal_brother: 2 })).raddBase),
    ).toBe(4);
    // Husband ¼ + two daughters: 3 left over 2 → 4 × 2 = 8.
    const hd = calculateMirath({
      school: "hanafi",
      deceased: { gender: "female" },
      heirs: { husband: 1, daughter: 2 },
    });
    expect(Number(hd.raddBase)).toBe(8);
    expect(Number(hd.tashihBase)).toBe(8);
    expect(calculateMirath(male({ wife: 1, son: 1 })).raddBase).toBeUndefined();
  });
});

describe.concurrent("explanation log", () => {
  it("records the pipeline steps", () => {
    const result = calculateMirath(male({ wife: 1, daughter: 2, father: 1, mother: 1 }));
    expect(result.steps.map((s) => s.code)).toEqual([
      "validate",
      "exclusion",
      "furud",
      "awl",
      "tashih",
    ]);
    expect(Number(result.asl)).toBe(24);
    expect(Number(result.awlBase)).toBe(27);
  });

  it("explains exclusion by naming the blocking heir", () => {
    const result = calculateMirath(male({ father: 1, full_brother: 2 }));
    const fb = result.heirs.find((h) => h.heir === "full_brother");
    expect(fb?.inherits).toBe(false);
    expect(fb?.reasons[0]).toEqual({ code: "excluded", by: ["father"] });
  });

  it("marks the father's ⅙ plus residue", () => {
    const result = calculateMirath(male({ father: 1, daughter: 1 }));
    const father = result.heirs.find((h) => h.heir === "father");
    expect(father?.basis).toBe("fard_and_asabah");
    expect(father?.reasons.map((r) => r.code)).toEqual(["father_sixth_and_residue"]);
  });

  it("explains the grandfather's best option under muqasamah", () => {
    const result = calculateMirath({
      school: "hanbali",
      deceased: { gender: "male" },
      heirs: { mother: 1, paternal_grandfather: 1, full_brother: 4 },
    });
    const gf = result.heirs.find((h) => h.heir === "paternal_grandfather");
    expect(gf?.reasons[0]?.code).toBe("muqasamah_third");
    expect(result.specialCases).toContain("grandfather_siblings");
  });

  it("labels the mother's ⅓ of the remainder in the 'Umariyyatayn", () => {
    const result = calculateMirath({
      school: "maliki",
      deceased: { gender: "female" },
      heirs: { husband: 1, father: 1, mother: 1 },
    });
    expect(result.specialCases).toEqual(["umariyyatayn"]);
    expect(result.heirs.find((h) => h.heir === "mother")?.reasons.map((r) => r.code)).toEqual([
      "mother_third_of_remainder",
      "umariyyatayn",
    ]);
  });

  it("flags Shibh al-Malikiyyah under Maliki (scholars of the school differ)", () => {
    const result = calculateMirath({
      school: "maliki",
      deceased: { gender: "female" },
      heirs: {
        husband: 1,
        mother: 1,
        paternal_grandfather: 1,
        maternal_brother: 2,
        full_brother: 1,
      },
    });
    expect(result.specialCases).toContain("shibh_malikiyyah");
  });

  it("honours parameter overrides", () => {
    const result = calculateMirath({
      school: "hanafi",
      deceased: { gender: "male" },
      heirs: { paternal_grandfather: 1, full_brother: 1 },
      params: { grandfatherWithSiblings: "muqasamah" },
    });
    expect(result.heirs.map((h) => toFractionString(h.share))).toEqual(["1/2", "1/2"]);
  });
});

describe.concurrent("all-schools comparison", () => {
  it("runs every school and lists the heirs that differ", () => {
    const results = calculateAllSchools({
      deceased: { gender: "female" },
      heirs: { husband: 1, mother: 1, maternal_brother: 2, full_brother: 1 },
    });
    expect(Object.keys(results)).toEqual([...MADHHAB_IDS]);
    expect(differingHeirs(results)).toEqual(["full_brother", "maternal_brother"]);
  });

  it("reports no difference for an agreed case", () => {
    const results = calculateAllSchools({
      deceased: { gender: "male" },
      heirs: { son: 1, daughter: 1 },
    });
    expect(differingHeirs(results)).toEqual([]);
  });
});

describe.concurrent("wasiyyah snapshot", () => {
  it("lists inheriting heirs with their fractions", () => {
    const result = calculateMirath(male({ wife: 1, son: 1, full_brother: 1 }));
    expect(mirathSnapshotShares(result)).toEqual([
      { heir: "wife", count: 1, fraction: "1/8" },
      { heir: "son", count: 1, fraction: "7/8" },
    ]);
  });
});
