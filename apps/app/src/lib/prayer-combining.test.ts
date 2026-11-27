import { describe, expect, it } from "@jest/globals";
import { MADHHAB_RULES } from "@munib-tracker/shared/fiqh";

import {
  COMBINE_PAIRS,
  combinedFromLog,
  combineHostPrayer,
  combineOfferFor,
  combinePairFor,
  combinePartner,
  combiningAllowed,
  combiningContexts,
} from "./prayer-combining";

const schoolRules = (school: keyof typeof MADHHAB_RULES) => ({
  travel: MADHHAB_RULES[school],
  rain: MADHHAB_RULES[school],
});

describe("combine pairs", () => {
  it("pairs Dhuhr with Asr and Maghrib with Isha only", () => {
    expect(COMBINE_PAIRS).toEqual([
      ["dhuhr", "asr"],
      ["maghrib", "isha"],
    ]);
    expect(combinePartner("dhuhr")).toBe("asr");
    expect(combinePartner("asr")).toBe("dhuhr");
    expect(combinePartner("maghrib")).toBe("isha");
    expect(combinePartner("isha")).toBe("maghrib");
    expect(combinePartner("fajr")).toBeNull();
    expect(combinePartner("witr")).toBeNull();
    expect(combinePairFor("tahajjud")).toBeNull();
  });

  it("taqdim hosts in the earlier prayer, ta'khir in the later", () => {
    expect(combineHostPrayer(["dhuhr", "asr"], "taqdim")).toBe("dhuhr");
    expect(combineHostPrayer(["dhuhr", "asr"], "takhir")).toBe("asr");
    expect(combineHostPrayer(["maghrib", "isha"], "takhir")).toBe("isha");
  });
});

describe("combiningContexts by school", () => {
  it.each([
    ["hanafi", ["dhuhr", "asr"], []],
    ["hanafi", ["maghrib", "isha"], []],
    ["shafii", ["dhuhr", "asr"], ["travel", "rain"]],
    ["shafii", ["maghrib", "isha"], ["travel", "rain"]],
    ["maliki", ["dhuhr", "asr"], ["travel"]],
    ["maliki", ["maghrib", "isha"], ["travel", "rain"]],
    ["hanbali", ["dhuhr", "asr"], ["travel"]],
    ["hanbali", ["maghrib", "isha"], ["travel", "rain"]],
  ] as const)("%s %j → %j", (school, pair, expected) => {
    expect(combiningContexts(MADHHAB_RULES[school], pair)).toEqual(expected);
  });

  it("combiningAllowed reads jamTravel / jamRain", () => {
    expect(combiningAllowed(MADHHAB_RULES.hanafi, "travel")).toBe(false);
    expect(combiningAllowed(MADHHAB_RULES.shafii, "rain", ["dhuhr", "asr"])).toBe(true);
    expect(combiningAllowed(MADHHAB_RULES.hanbali, "rain", ["dhuhr", "asr"])).toBe(false);
    expect(combiningAllowed(MADHHAB_RULES.hanbali, "rain", ["maghrib", "isha"])).toBe(true);
  });
});

describe("combineOfferFor", () => {
  it("never offers combining to a Hanafi user", () => {
    for (const prayer of ["dhuhr", "asr", "maghrib", "isha"] as const) {
      expect(combineOfferFor(prayer, schoolRules("hanafi"))).toEqual({ kind: "none" });
    }
  });

  it("offers the pair prayers to a Shafi'i user, never Fajr", () => {
    expect(combineOfferFor("asr", schoolRules("shafii"))).toEqual({
      kind: "allowed",
      pair: ["dhuhr", "asr"],
      contexts: ["travel", "rain"],
    });
    expect(combineOfferFor("fajr", schoolRules("shafii"))).toEqual({ kind: "none" });
  });

  it("shows all views (no school picked) when either domain has no school", () => {
    expect(combineOfferFor("isha", { travel: null, rain: null })).toEqual({
      kind: "allViews",
      pair: ["maghrib", "isha"],
    });
    expect(combineOfferFor("dhuhr", { travel: MADHHAB_RULES.hanafi, rain: null }).kind).toBe(
      "allViews",
    );
    expect(combineOfferFor("fajr", { travel: null, rain: null })).toEqual({ kind: "none" });
  });

  it("reads travel and rain from their own domains", () => {
    // Hanafi overall, but a Shafi'i override for travel only.
    expect(
      combineOfferFor("dhuhr", { travel: MADHHAB_RULES.shafii, rain: MADHHAB_RULES.hanafi }),
    ).toEqual({ kind: "allowed", pair: ["dhuhr", "asr"], contexts: ["travel"] });
  });
});

describe("combinedFromLog", () => {
  it("reads a valid flag", () => {
    expect(
      combinedFromLog({ prayerId: "asr", combinedWith: "dhuhr", combineMode: "taqdim" }),
    ).toEqual({ with: "dhuhr", mode: "taqdim" });
  });

  it("ignores malformed or mismatched flags", () => {
    expect(combinedFromLog({ prayerId: "asr" })).toBeNull();
    expect(
      combinedFromLog({ prayerId: "asr", combinedWith: "isha", combineMode: "taqdim" }),
    ).toBeNull();
    expect(
      combinedFromLog({
        prayerId: "fajr",
        combinedWith: "dhuhr",
        combineMode: "taqdim",
      }),
    ).toBeNull();
    expect(
      combinedFromLog({
        prayerId: "dhuhr",
        combinedWith: "asr",
        combineMode: "sideways" as unknown as "taqdim",
      }),
    ).toBeNull();
  });
});
