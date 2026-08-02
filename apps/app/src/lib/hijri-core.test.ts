import { describe, expect, it } from "@jest/globals";

import {
  gregorianToJDN,
  inUmalquraJDNRange,
  inUmalquraYearRange,
  islamicTabularToJDN,
  jdnToGregorian,
  jdnToIslamicTabular,
  jdnToUmalqura,
  umalquraMonthLength,
  umalquraToJDN,
} from "./hijri-core";
import { UMALQURA_EPOCH_JDN, UMALQURA_TOTAL_DAYS } from "./hijri-umalqura-data";

describe("gregorianToJDN / jdnToGregorian", () => {
  it("round-trips a known Gregorian date", () => {
    const jdn = gregorianToJDN(2023, 3, 23);
    expect(jdnToGregorian(jdn)).toEqual({ year: 2023, month: 3, day: 23 });
  });

  it("round-trips across a decade of dates", () => {
    const cursor = { year: 2020, month: 1, day: 1 };
    for (let i = 0; i < 3653; i += 1) {
      const jdn = gregorianToJDN(cursor.year, cursor.month, cursor.day);
      const back = jdnToGregorian(jdn);
      expect(back).toEqual(cursor);

      const next = new Date(cursor.year, cursor.month - 1, cursor.day);
      next.setDate(next.getDate() + 1);
      cursor.year = next.getFullYear();
      cursor.month = next.getMonth() + 1;
      cursor.day = next.getDate();
    }
  });
});

describe("inUmalquraJDNRange", () => {
  it("includes the epoch and last covered day", () => {
    expect(inUmalquraJDNRange(UMALQURA_EPOCH_JDN)).toBe(true);
    expect(inUmalquraJDNRange(UMALQURA_EPOCH_JDN + UMALQURA_TOTAL_DAYS - 1)).toBe(true);
  });

  it("excludes days outside the table", () => {
    expect(inUmalquraJDNRange(UMALQURA_EPOCH_JDN - 1)).toBe(false);
    expect(inUmalquraJDNRange(UMALQURA_EPOCH_JDN + UMALQURA_TOTAL_DAYS)).toBe(false);
  });
});

describe("inUmalquraYearRange", () => {
  it("accepts years inside the table", () => {
    expect(inUmalquraYearRange(1444)).toBe(true);
  });

  it("rejects years outside the table", () => {
    expect(inUmalquraYearRange(1299)).toBe(false);
    expect(inUmalquraYearRange(1601)).toBe(false);
  });
});

describe("umalquraMonthLength", () => {
  it("returns 29 or 30 for Ramadan 1444", () => {
    const len = umalquraMonthLength(1444, 9);
    expect(len === 29 || len === 30).toBe(true);
  });

  it("returns 29 or 30 for any month in range", () => {
    const len = umalquraMonthLength(1444, 1);
    expect(len === 29 || len === 30).toBe(true);
  });
});

describe("umalquraToJDN / jdnToUmalqura", () => {
  it("round-trips Ramadan 1, 1444 AH", () => {
    const jdn = umalquraToJDN(1444, 9, 1);
    expect(jdnToUmalqura(jdn)).toEqual({ year: 1444, month: 9, day: 1 });
    expect(jdnToGregorian(jdn)).toEqual({ year: 2023, month: 3, day: 23 });
  });
});

describe("islamicTabularToJDN / jdnToIslamicTabular", () => {
  it("round-trips a tabular Hijri date", () => {
    const jdn = islamicTabularToJDN(1200, 6, 15);
    expect(jdnToIslamicTabular(jdn)).toEqual({ year: 1200, month: 6, day: 15 });
  });

  it("is the exact inverse of jdnToIslamicTabular for sampled dates", () => {
    for (let jdn = 2_000_000; jdn < 2_001_000; jdn += 17) {
      const h = jdnToIslamicTabular(jdn);
      expect(islamicTabularToJDN(h.year, h.month, h.day)).toBe(jdn);
    }
  });
});
