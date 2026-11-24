import { describe, expect, it } from "vitest";

import { MADHHAB_RULES } from "../madhhab-rules";
import {
  applyFiqhCustom,
  customKeysApplied,
  type FiqhPreferences,
  globalSchool,
  hasDomainOverride,
  isMadhhabUnset,
  resolveFiqh,
  resolveSchool,
  rulesFor,
  rulesForSchool,
  sanitizeFiqhCustom,
} from "../resolve";

describe.concurrent("resolveSchool", () => {
  it.each<[string, FiqhPreferences, ReturnType<typeof resolveSchool>]>([
    ["never asked ⇒ all views", {}, null],
    ["all views ⇒ null", { madhhab: null }, null],
    ["global school", { madhhab: "hanafi" }, "hanafi"],
    [
      "domain override beats global",
      { madhhab: "hanafi", madhhabOverrides: { zakat: "shafii" } },
      "shafii",
    ],
    [
      "override only for its own domain",
      { madhhab: "hanafi", madhhabOverrides: { travel: "shafii" } },
      "hanafi",
    ],
    [
      "override null ⇒ all views for that domain",
      { madhhab: "maliki", madhhabOverrides: { zakat: null } },
      null,
    ],
    [
      "override with no global school",
      { madhhab: null, madhhabOverrides: { zakat: "hanbali" } },
      "hanbali",
    ],
    [
      "invalid override ignored",
      { madhhab: "hanafi", madhhabOverrides: { zakat: "jafari" as never } },
      "hanafi",
    ],
    ["invalid global treated as never asked", { madhhab: "zahiri" as never }, null],
  ])("%s", (_label, prefs, expected) => {
    expect(resolveSchool(prefs, "zakat")).toBe(expected);
  });

  it("reports unset vs explicit all-views", () => {
    expect(isMadhhabUnset({})).toBe(true);
    expect(isMadhhabUnset({ madhhab: null })).toBe(false);
    expect(globalSchool({ madhhab: "bogus" as never })).toBeUndefined();
    expect(hasDomainOverride({ madhhabOverrides: { zakat: null } }, "zakat")).toBe(true);
    expect(hasDomainOverride({ madhhabOverrides: {} }, "zakat")).toBe(false);
  });
});

describe.concurrent("fiqhCustom", () => {
  it("keeps valid values and drops malformed or out-of-range ones", () => {
    expect(
      sanitizeFiqhCustom({
        qasrDistanceKm: 88,
        residencyDays: 0,
        haydMaxDays: Number.NaN,
        nifasMaxDays: "40",
        nisabBasis: "silver",
        extra: 1,
      }),
    ).toEqual({ qasrDistanceKm: 88, nisabBasis: "silver" });
    expect(sanitizeFiqhCustom(null)).toEqual({});
    expect(sanitizeFiqhCustom({ nisabBasis: "platinum" })).toEqual({});
  });

  it("applies custom numbers on top of the school without mutating it", () => {
    const base = MADHHAB_RULES.hanafi;
    const rules = applyFiqhCustom(base, {
      qasrDistanceKm: 88,
      residencyDays: 10,
      haydMaxDays: 12,
      nifasMaxDays: 45,
      nisabBasis: "silver",
    });
    expect(rules.travel).toMatchObject({
      qasrDistanceKm: 88,
      qasrDistanceKmRange: [88, 88],
      residencyDays: 10,
    });
    expect(rules.hayd).toMatchObject({ maxDays: 12, nifasMaxDays: 45, minPurityDays: 15 });
    expect(rules.zakat).toMatchObject({ nisabBasis: "silver", nisabBasisContested: false });
    expect(base.travel.qasrDistanceKm).toBe(77);
    expect(base.hayd.maxDays).toBe(10);
  });

  it("returns the same object when nothing valid is customised", () => {
    expect(applyFiqhCustom(MADHHAB_RULES.shafii, { haydMaxDays: 999 })).toBe(MADHHAB_RULES.shafii);
  });

  it("lists which custom keys are in effect", () => {
    expect(customKeysApplied({ fiqhCustom: { residencyDays: 5, haydMaxDays: -1 } })).toEqual([
      "residencyDays",
    ]);
  });
});

describe.concurrent("rulesFor / resolveFiqh", () => {
  it("returns null in all-views mode, even with custom values", () => {
    expect(rulesFor({ madhhab: null, fiqhCustom: { qasrDistanceKm: 50 } }, "travel")).toBeNull();
    expect(resolveFiqh({}, "travel")).toEqual({
      school: null,
      rules: null,
      isOverride: false,
      customKeys: [],
    });
  });

  it("returns the school's rules with custom overrides applied", () => {
    const resolved = resolveFiqh(
      {
        madhhab: "shafii",
        madhhabOverrides: { travel: "hanafi" },
        fiqhCustom: { qasrDistanceKm: 80 },
      },
      "travel",
    );
    expect(resolved.school).toBe("hanafi");
    expect(resolved.isOverride).toBe(true);
    expect(resolved.customKeys).toEqual(["qasrDistanceKm"]);
    expect(resolved.rules?.travel.qasrDistanceKm).toBe(80);
    expect(resolved.rules?.travel.jamTravel).toBe(false);
  });

  it("returns the untouched table for a school with no custom values", () => {
    expect(rulesFor({ madhhab: "hanbali" }, "salah")).toBe(MADHHAB_RULES.hanbali);
    expect(rulesForSchool("maliki")).toBe(MADHHAB_RULES.maliki);
  });
});
