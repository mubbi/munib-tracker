import { MADHHAB_IDS } from "@munib-tracker/shared/fiqh";
import {
  calculateAllSchools,
  calculateMirath,
  type MirathHeirCounts,
  type MirathReasonCode,
  toFractionString,
} from "@munib-tracker/shared/mirath";

import i18n from "@/i18n";
import en from "@/i18n/en.json";

import {
  baseSummary,
  explainHeir,
  heirCountLabel,
  resultSummary,
  SPECIAL_CASE_KEYS,
} from "./explain";
import {
  buildMirathSnapshot,
  offerMirathSnapshot,
  takePendingMirathSnapshot,
} from "./wasiyyah-handoff";
import {
  type DeceasedGender,
  effectiveCounts,
  heirsForStep,
  isStepRelevant,
  maxCountFor,
  siblingsOnlyCountForMother,
  visibleSteps,
} from "./wizard";

const t = i18n.t.bind(i18n);

/** Every reason the engine can emit (kept in sync with `MirathReasonCode`). */
const REASONS: Record<MirathReasonCode, true> = {
  excluded: true,
  nothing_left: true,
  husband_half: true,
  husband_quarter: true,
  wife_quarter: true,
  wife_eighth: true,
  mother_third: true,
  mother_sixth_descendant: true,
  mother_sixth_siblings: true,
  mother_third_of_remainder: true,
  father_sixth: true,
  father_sixth_and_residue: true,
  father_residue: true,
  grandfather_sixth: true,
  grandfather_sixth_and_residue: true,
  grandfather_residue: true,
  grandmother_sixth: true,
  daughter_half: true,
  daughters_two_thirds: true,
  sons_daughter_half: true,
  sons_daughters_two_thirds: true,
  sons_daughter_sixth: true,
  sister_half: true,
  sisters_two_thirds: true,
  paternal_sister_sixth: true,
  maternal_sixth: true,
  maternal_third: true,
  residuary_self: true,
  residuary_with_male: true,
  residuary_with_daughters: true,
  awl: true,
  radd: true,
  umariyyatayn: true,
  mushtarakah_share: true,
  mushtarakah_excluded: true,
  akdariyyah: true,
  malikiyyah: true,
  muqasamah_share: true,
  muqasamah_third: true,
  muqasamah_sixth: true,
  muqasamah_siblings: true,
  muaddah_counted: true,
  muaddah_reclaim: true,
};

describe("mirath wizard", () => {
  it("asks for the spouse that matches the deceased", () => {
    expect(heirsForStep("spouse", "male")).toEqual(["wife"]);
    expect(heirsForStep("spouse", "female")).toEqual(["husband"]);
  });

  it("limits counts (one husband / parent, four wives)", () => {
    expect(maxCountFor("husband")).toBe(1);
    expect(maxCountFor("mother")).toBe(1);
    expect(maxCountFor("wife")).toBe(4);
    expect(maxCountFor("son")).toBeGreaterThan(4);
  });

  it("skips steps whose heirs are all excluded", () => {
    expect(isStepRelevant("grandchildren", { son: 1 })).toBe(false);
    // The father excludes siblings; they only matter when they can reduce a mother.
    expect(isStepRelevant("siblings", { father: 1 })).toBe(false);
    expect(isStepRelevant("siblings", { father: 1, mother: 1 })).toBe(true);
    expect(isStepRelevant("siblings", { father: 1, mother: 1, daughter: 1 })).toBe(false);
    expect(isStepRelevant("siblings", { father: 1, mother: 1, sons_daughter: 1 })).toBe(false);
    expect(isStepRelevant("siblings", { mother: 1, son: 1 })).toBe(false);
    expect(siblingsOnlyCountForMother({ father: 1, mother: 1 })).toBe(true);
    expect(siblingsOnlyCountForMother({ mother: 1 })).toBe(false);
    expect(isStepRelevant("siblings", { daughter: 1 })).toBe(true);
    expect(isStepRelevant("grandparents", { father: 1, mother: 1 })).toBe(false);
    expect(isStepRelevant("grandparents", { father: 1 })).toBe(true); // Hanbali grandmother
    expect(isStepRelevant("extended", { full_brother: 1 })).toBe(false);
    expect(visibleSteps({ son: 1 })).toEqual([
      "deceased",
      "spouse",
      "children",
      "parents",
      "grandparents",
      "confirm",
    ]);
  });

  it("drops answers from skipped steps and the wrong spouse", () => {
    expect(
      effectiveCounts({ son: 1, sons_son: 2, full_brother: 1, husband: 1, wife: 2 }, "male"),
    ).toEqual({ son: 1, wife: 2 });
    expect(effectiveCounts({ father: 1, paternal_grandfather: 1, mother: 1 }, "male")).toEqual({
      father: 1,
      mother: 1,
    });
  });

  it("keeps siblings for the mother's share when the father is present (hajb nuqsan)", () => {
    expect(
      effectiveCounts({ father: 1, mother: 1, full_brother: 2, full_brothers_son: 1 }, "male"),
    ).toEqual({ father: 1, mother: 1, full_brother: 2 });
    // Without a mother (or with a descendant) they change nothing and are dropped.
    expect(effectiveCounts({ father: 1, full_brother: 2 }, "male")).toEqual({ father: 1 });
    expect(effectiveCounts({ father: 1, mother: 1, daughter: 1, full_brother: 2 }, "male")).toEqual(
      { father: 1, mother: 1, daughter: 1 },
    );
  });
});

/** Runs the wizard's answers through the engine, as the calculator screen does. */
function wizardShares(counts: MirathHeirCounts, gender: DeceasedGender) {
  const all = calculateAllSchools({ deceased: { gender }, heirs: effectiveCounts(counts, gender) });
  return MADHHAB_IDS.map((school) => {
    const r = all[school];
    const shares: Record<string, string> = {};
    for (const h of r.heirs) if (h.inherits) shares[h.heir] = toFractionString(h.share);
    return { school, shares, specialCases: r.specialCases };
  });
}

describe("mirath wizard → engine (final review C1)", () => {
  it("father + mother + 2 full brothers: father 5/6, mother 1/6 in every school", () => {
    for (const r of wizardShares({ father: 1, mother: 1, full_brother: 2 }, "male")) {
      expect(r.shares).toEqual({ father: "5/6", mother: "1/6" });
    }
  });

  it("wife + father + mother + full sister + maternal brother is not an 'Umariyyah", () => {
    const counts = { wife: 1, father: 1, mother: 1, full_sister: 1, maternal_brother: 1 };
    for (const r of wizardShares(counts, "male")) {
      expect(r.shares).toEqual({ wife: "1/4", mother: "1/6", father: "7/12" });
      expect(r.specialCases).not.toContain("umariyyatayn");
    }
  });

  it("still gives the 'Umariyyah with fewer than two siblings", () => {
    for (const r of wizardShares({ wife: 1, father: 1, mother: 1, full_brother: 1 }, "male")) {
      expect(r.shares).toEqual({ wife: "1/4", mother: "1/4", father: "1/2" });
      expect(r.specialCases).toContain("umariyyatayn");
    }
  });
});

describe("mirath explanations", () => {
  it("has an English sentence for every engine reason and special case", () => {
    const why = (en as unknown as { mirath: { why: Record<string, string> } }).mirath.why;
    for (const code of Object.keys(REASONS)) expect(why[code]).toBeTruthy();
    for (const key of Object.values(SPECIAL_CASE_KEYS)) expect(i18n.exists(key)).toBe(true);
  });

  it("explains each heir with fractions and the blocking heirs", () => {
    const result = calculateMirath({
      school: "hanafi",
      deceased: { gender: "male" },
      heirs: { wife: 1, son: 1, full_brother: 1 },
    });
    const [wife, son, brother] = result.heirs;
    expect(wife && explainHeir(t, wife)[0]).toContain("1/8");
    expect(son && explainHeir(t, son)[0]).toMatch(/residu/i);
    expect(brother && explainHeir(t, brother)[0]).toContain(t("heirs.son"));
    expect(heirCountLabel(t, "daughter", 3)).toContain("3");
    expect(resultSummary(t, result)).toHaveLength(2);
  });
});

describe("wasiyyah handoff", () => {
  it("hands one snapshot to the wasiyyah wizard, once", () => {
    const result = calculateMirath({
      school: "shafii",
      deceased: { gender: "female" },
      heirs: { husband: 1, daughter: 1 },
    });
    const snapshot = buildMirathSnapshot(result, new Date("2026-11-24T00:00:00Z"));
    expect(snapshot.school).toBe("shafii");
    expect(snapshot.shares).toEqual([
      { heir: "husband", count: 1, fraction: "1/4" },
      { heir: "daughter", count: 1, fraction: "3/4" },
    ]);
    offerMirathSnapshot(snapshot);
    expect(takePendingMirathSnapshot()).toBe(snapshot);
    expect(takePendingMirathSnapshot()).toBeNull();
  });

  it("records the school the shares were computed under (all-views mode browses one)", () => {
    const all = calculateAllSchools({
      deceased: { gender: "female" },
      heirs: { husband: 1, mother: 1, paternal_grandfather: 1, full_sister: 1 },
    });
    // al-Akdariyyah: the shares differ by school, so the snapshot must name its school.
    const hanafi = buildMirathSnapshot(all.hanafi);
    const shafii = buildMirathSnapshot(all.shafii);
    expect(hanafi.school).toBe("hanafi");
    expect(shafii.school).toBe("shafii");
    expect(hanafi.shares).not.toEqual(shafii.shares);
  });
});

describe("mirath base summary (final review L13)", () => {
  const lines = (input: Parameters<typeof calculateMirath>[0]) => {
    const s = baseSummary(calculateMirath(input));
    return [t(s.base.key, s.base.values), ...(s.tashih ? [t(s.tashih.key, s.tashih.values)] : [])];
  };
  const male = (heirs: MirathHeirCounts) =>
    ({ school: "hanafi", deceased: { gender: "male" }, heirs }) as const;

  it("shows base 3 for three sons with no 'corrected' line", () => {
    expect(lines(male({ son: 3 }))).toEqual([t("mirath.result.base", { base: "3" })]);
  });

  it("shows the radd base and the 'awl base", () => {
    expect(lines(male({ mother: 1, daughter: 1 }))).toEqual([
      t("mirath.result.raddBase", { from: "6", to: "4" }),
    ]);
    expect(lines(male({ wife: 1, daughter: 2, father: 1, mother: 1 }))).toEqual([
      t("mirath.result.awl", { from: "24", to: "27" }),
    ]);
    expect(t("mirath.result.raddBase", { from: "6", to: "4" })).toContain("4");
  });

  it("adds the corrected base only when heads need it", () => {
    expect(lines(male({ wife: 1, son: 2 }))).toEqual([
      t("mirath.result.base", { base: "8" }),
      t("mirath.result.tashih", { base: "16" }),
    ]);
  });
});
