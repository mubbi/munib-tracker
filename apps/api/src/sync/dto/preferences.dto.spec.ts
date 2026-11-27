import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { describe, expect, it } from "vitest";

import { HijriAdjustmentDto, sanitizePreferencesSyncData } from "./preferences.dto";

const UPDATED_AT = "2026-11-23T10:00:00.000Z";

describe("preferences sync data", () => {
  it("passes records without a Hijri adjustment through untouched", () => {
    const data = { locale: "ur", timeFormat: "12" };
    expect(sanitizePreferencesSyncData(data)).toBe(data);
  });

  it("keeps a valid adjustment and filters invalid month corrections", () => {
    const result = sanitizePreferencesSyncData({
      locale: "ur",
      hijriAdjustment: {
        offsetDays: 1,
        monthStarts: { "1445-09": "2024-03-12", "1445-10": "not-a-date" },
        updatedAt: UPDATED_AT,
      },
    });
    expect(result).toEqual({
      locale: "ur",
      hijriAdjustment: {
        offsetDays: 1,
        monthStarts: { "1445-09": "2024-03-12" },
        updatedAt: UPDATED_AT,
      },
    });
  });

  it("drops a malformed adjustment instead of rejecting the record", () => {
    expect(
      sanitizePreferencesSyncData({ locale: "en", hijriAdjustment: { offsetDays: 7 } }),
    ).toEqual({ locale: "en" });
  });

  it("keeps valid madhhab fields untouched", () => {
    const data = {
      locale: "en",
      madhhab: "hanafi",
      madhhabOverrides: { zakat: "shafii", travel: null },
      fiqhCustom: { qasrDistanceKm: 77, nisabBasis: "silver" },
    };
    expect(sanitizePreferencesSyncData(data)).toEqual(data);
    expect(sanitizePreferencesSyncData({ madhhab: null })).toEqual({ madhhab: null });
  });

  it("drops invalid madhhab fields and entries instead of rejecting the record", () => {
    expect(
      sanitizePreferencesSyncData({
        locale: "ur",
        madhhab: "zahiri",
        madhhabOverrides: { zakat: "maliki", salah: "jafari", wudu: "hanafi" },
        fiqhCustom: { residencyDays: 400, haydMaxDays: 10, nisabBasis: "copper" },
        hijriAdjustment: { offsetDays: 1, updatedAt: UPDATED_AT },
      }),
    ).toEqual({
      locale: "ur",
      madhhabOverrides: { zakat: "maliki" },
      fiqhCustom: { haydMaxDays: 10 },
      hijriAdjustment: { offsetDays: 1, updatedAt: UPDATED_AT },
    });
    expect(
      sanitizePreferencesSyncData({ locale: "en", madhhabOverrides: "hanafi", fiqhCustom: [3] }),
    ).toEqual({ locale: "en" });
  });

  it("accepts a finance reading override (G-72)", () => {
    const data = {
      locale: "en",
      fontPrefs: {
        arabic: { size: 30 },
        translation: {},
        readingOverrides: { finance: { arabicDelta: 2, textDelta: 2 }, jannah: { textDelta: -2 } },
      },
    };
    expect(sanitizePreferencesSyncData(data)).toEqual(data);
  });

  it("keeps an older client's blob without a finance override unchanged", () => {
    const data = { locale: "ur", fontPrefs: { arabic: {}, translation: {} } };
    expect(sanitizePreferencesSyncData(data)).toBe(data);
    const withOverrides = {
      fontPrefs: { arabic: {}, translation: {}, readingOverrides: { quran: { arabicDelta: 4 } } },
    };
    expect(sanitizePreferencesSyncData(withOverrides)).toEqual(withOverrides);
  });

  it("drops junk reading overrides instead of rejecting the record", () => {
    expect(
      sanitizePreferencesSyncData({
        locale: "en",
        fontPrefs: {
          arabic: {},
          translation: {},
          readingOverrides: {
            finance: { arabicDelta: "big", textDelta: 4 },
            zakat: { arabicDelta: 2 },
            hadith: { arabicDelta: Number.POSITIVE_INFINITY },
          },
        },
      }),
    ).toEqual({
      locale: "en",
      fontPrefs: { arabic: {}, translation: {}, readingOverrides: { finance: { textDelta: 4 } } },
    });
    expect(
      sanitizePreferencesSyncData({ fontPrefs: { arabic: {}, readingOverrides: [1, 2] } }),
    ).toEqual({ fontPrefs: { arabic: {} } });
  });

  it("validates the DTO shape", () => {
    const ok = plainToInstance(HijriAdjustmentDto, { offsetDays: -2, updatedAt: UPDATED_AT });
    expect(validateSync(ok)).toHaveLength(0);
    const bad = plainToInstance(HijriAdjustmentDto, { offsetDays: 3, updatedAt: "yesterday" });
    expect(
      validateSync(bad)
        .map((e) => e.property)
        .sort(),
    ).toEqual(["offsetDays", "updatedAt"]);
  });
});
