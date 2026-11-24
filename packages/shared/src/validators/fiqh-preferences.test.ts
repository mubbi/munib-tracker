import { describe, expect, it } from "vitest";

import { FIQH_CUSTOM_BOUNDS, FIQH_DOMAINS, MADHHAB_IDS, sanitizeFiqhCustom } from "../fiqh/core";
import {
  isValidMadhhabPreference,
  SYNC_FIQH_CUSTOM_BOUNDS,
  SYNC_FIQH_DOMAINS,
  SYNC_MADHHAB_IDS,
  sanitizeFiqhCustomValues,
  sanitizeFiqhPreferenceFields,
  sanitizeMadhhabOverrides,
} from "./fiqh-preferences";

describe("fiqh preference validators (API-safe copies)", () => {
  it("mirrors the fiqh module's schools, domains and custom bounds", () => {
    expect(SYNC_MADHHAB_IDS).toEqual(MADHHAB_IDS);
    expect(SYNC_FIQH_DOMAINS).toEqual(FIQH_DOMAINS);
    expect(SYNC_FIQH_CUSTOM_BOUNDS).toEqual(FIQH_CUSTOM_BOUNDS);
  });

  it("agrees with sanitizeFiqhCustom on mixed input", () => {
    const samples: unknown[] = [
      { qasrDistanceKm: 77, residencyDays: 0, haydMaxDays: 10.5, nifasMaxDays: 91 },
      { nisabBasis: "silver", qasrDistanceKm: "77", haydMaxDays: Number.NaN },
      { nisabBasis: "platinum", residencyDays: 30, nifasMaxDays: 1 },
      {},
    ];
    for (const sample of samples) {
      expect(sanitizeFiqhCustomValues(sample)).toEqual(sanitizeFiqhCustom(sample));
    }
    expect(sanitizeFiqhCustomValues(null)).toBeUndefined();
    expect(sanitizeFiqhCustomValues([1])).toBeUndefined();
  });

  it("accepts a school or null for madhhab", () => {
    expect(isValidMadhhabPreference("hanafi")).toBe(true);
    expect(isValidMadhhabPreference(null)).toBe(true);
    expect(isValidMadhhabPreference("shafi")).toBe(false);
    expect(isValidMadhhabPreference(undefined)).toBe(false);
  });

  it("keeps only valid override entries", () => {
    expect(
      sanitizeMadhhabOverrides({ zakat: "shafii", travel: null, salah: "jafari", hayd: "hanafi" }),
    ).toEqual({ zakat: "shafii", travel: null });
    expect(sanitizeMadhhabOverrides("hanafi")).toBeUndefined();
  });

  it("cleans the record without rejecting it", () => {
    const untouched = { locale: "en" };
    expect(sanitizeFiqhPreferenceFields(untouched)).toBe(untouched);
    expect(
      sanitizeFiqhPreferenceFields({
        locale: "ur",
        madhhab: "zaidi",
        madhhabOverrides: { zakat: "maliki", fasting: 3 },
        fiqhCustom: { qasrDistanceKm: 9999, nisabBasis: "gold" },
      }),
    ).toEqual({
      locale: "ur",
      madhhabOverrides: { zakat: "maliki" },
      fiqhCustom: { nisabBasis: "gold" },
    });
    expect(
      sanitizeFiqhPreferenceFields({ madhhab: null, madhhabOverrides: [], fiqhCustom: "x" }),
    ).toEqual({ madhhab: null });
  });
});
