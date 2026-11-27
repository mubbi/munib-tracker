import { describe, expect, it } from "@jest/globals";

import {
  FOOD_MEASURE_KG,
  fidyahMeasureFor,
  fitrMeasureFor,
  forgetfulEatingOutcome,
  formatKgRange,
  handledRozaOfferCount,
  isNoFastExcuse,
  kaffarahTriggerKey,
  kaffarahTriggersFor,
  pendingRozaOffer,
  ramadanMakeUpDates,
  rozaOfferSeenId,
  schoolsToShow,
  tarawihRakahsFor,
} from "./fasting-fiqh";

describe("fidyahMeasureFor", () => {
  it("Hanafi: half a sa' of wheat or a sa' of dates/barley, cash allowed", () => {
    const r = fidyahMeasureFor("hanafi");
    expect(r.options.map((o) => `${o.unit}:${o.food}`)).toEqual([
      "half_sa:wheat",
      "sa:dates_barley",
    ]);
    expect(r.options[0]?.kgRange).toEqual(FOOD_MEASURE_KG.hanafiHalfSa);
    expect(r.cashAllowed).toBe(true);
    expect(r.elderlyFidyahRecommendedOnly).toBe(false);
  });

  it.each(["shafii", "maliki"] as const)("%s: one mudd of staple food, food only", (school) => {
    const r = fidyahMeasureFor(school);
    expect(r.options).toEqual([{ unit: "mudd", food: "staple", kgRange: FOOD_MEASURE_KG.mudd }]);
    expect(r.cashAllowed).toBe(false);
  });

  it("Maliki: fidyah for the very elderly is recommended only", () => {
    expect(fidyahMeasureFor("maliki").elderlyFidyahRecommendedOnly).toBe(true);
    expect(fidyahMeasureFor("shafii").elderlyFidyahRecommendedOnly).toBe(false);
  });

  it("Hanbali: a mudd of wheat or half a sa' of other food, food only", () => {
    const r = fidyahMeasureFor("hanbali");
    expect(r.options.map((o) => `${o.unit}:${o.food}`)).toEqual([
      "mudd:wheat",
      "half_sa:other_food",
    ]);
    expect(r.cashAllowed).toBe(false);
  });

  it("keeps every weight range ordered low → high", () => {
    for (const range of Object.values(FOOD_MEASURE_KG)) expect(range[0]).toBeLessThan(range[1]);
  });
});

describe("fitrMeasureFor", () => {
  it("Hanafi: half a sa' of wheat / a sa' of other food, cash allowed", () => {
    const r = fitrMeasureFor("hanafi");
    expect(r.options.map((o) => o.unit)).toEqual(["half_sa", "sa"]);
    expect(r.cashAllowed).toBe(true);
  });

  it.each(["shafii", "maliki", "hanbali"] as const)("%s: one sa' of staple food", (school) => {
    const r = fitrMeasureFor(school);
    expect(r.options).toEqual([{ unit: "sa", food: "staple", kgRange: FOOD_MEASURE_KG.sa }]);
    expect(r.cashAllowed).toBe(false);
  });
});

describe("forgetful eating and kaffarah", () => {
  it.each([
    ["hanafi", "valid"],
    ["shafii", "valid"],
    ["maliki", "make_up"],
    ["hanbali", "valid"],
  ] as const)("%s → %s", (school, outcome) => {
    expect(forgetfulEatingOutcome(school)).toBe(outcome);
  });

  it.each([
    ["hanafi", "intercourseOrEating"],
    ["shafii", "intercourseOnly"],
    ["maliki", "intercourseOrEating"],
    ["hanbali", "intercourseOnly"],
  ] as const)("%s kaffarah triggers → %s", (school, key) => {
    expect(kaffarahTriggerKey(school)).toBe(key);
    expect(kaffarahTriggersFor(school)).toContain("intercourse");
  });

  it("records 20 rakahs of tarawih for every school (info only)", () => {
    for (const school of schoolsToShow(null)) expect(tarawihRakahsFor(school)).toBe(20);
  });
});

describe("schoolsToShow", () => {
  it("lists one school, or all four in all-views mode", () => {
    expect(schoolsToShow("shafii")).toEqual(["shafii"]);
    expect(schoolsToShow(null)).toEqual(["hanafi", "shafii", "maliki", "hanbali"]);
  });
});

describe("formatKgRange", () => {
  it("formats a range with an en dash", () => {
    expect(formatKgRange([1.6, 2.05], "en")).toBe("1.6–2.05");
  });
});

describe("Ramadan make-up offer", () => {
  const dates = ["2026-02-18", "2026-02-19", "2026-02-20", "2026-02-21", "2026-02-22"];

  it("counts missed, exempt and hayd/nifas-excused days up to today", () => {
    const out = ramadanMakeUpDates(
      dates,
      { "2026-02-18": "fasted", "2026-02-19": "exempt", "2026-02-20": "missed" },
      new Set(["2026-02-21", "2026-02-18", "2026-02-22"]),
      "2026-02-21",
    );
    // 18 is fasted (log wins), 22 is in the future.
    expect(out).toEqual(["2026-02-19", "2026-02-20", "2026-02-21"]);
  });

  it("only hayd and nifas excuses mean no fast", () => {
    expect(isNoFastExcuse("hayd")).toBe(true);
    expect(isNoFastExcuse("nifas")).toBe(true);
    expect(isNoFastExcuse("travel")).toBe(false);
    expect(isNoFastExcuse(null)).toBe(false);
  });

  it("remembers how many days were handled per Hijri year", () => {
    const seen = [rozaOfferSeenId(1447, 3), rozaOfferSeenId(1447, 5), rozaOfferSeenId(1446, 9)];
    expect(handledRozaOfferCount(seen, 1447)).toBe(5);
    expect(handledRozaOfferCount(seen, 1448)).toBe(0);
    expect(handledRozaOfferCount(["other-tour", "ramadan-fasting-qaza-offer:1447:x"], 1447)).toBe(
      0,
    );
  });

  it("offers only the days added since the last answer", () => {
    expect(pendingRozaOffer(6, 5)).toBe(1);
    expect(pendingRozaOffer(4, 5)).toBe(0);
  });
});
