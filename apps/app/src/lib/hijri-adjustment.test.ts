import type { HijriAdjustment, HijriOffsetDays } from "@munib-tracker/shared/types";

import { buildWidgetSnapshot } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import {
  formatHijriDate,
  gregorianToHijri,
  hijriBaseCalendar,
  hijriMonthLength,
  hijriToGregorian,
  resetHijriAdjustmentCacheForTests,
  setHijriAdjustment,
  setHijriObserver,
} from "@/lib/hijri";
import {
  createAdjustedCalendar,
  type HijriBaseCalendar,
  hijriBasisFingerprint,
  hijriBasisMismatch,
  hijriMonthFromIndex,
  hijriMonthIndex,
  hijriMonthKey,
  isoDateToJDN,
  jdnToIsoDate,
  monthStartChoices,
  normalizeHijriAdjustment,
  withHijriBasis,
  withHijriMonthStart,
  withHijriOffset,
  withoutHijriMonthStarts,
} from "@/lib/hijri-adjustment";
import {
  gregorianToJDN,
  type HijriDate,
  inUmalquraJDNRange,
  inUmalquraYearRange,
  islamicTabularToJDN,
  jdnToGregorian,
  jdnToIslamicTabular,
  jdnToUmalqura,
  umalquraMonthLength,
  umalquraToJDN,
} from "@/lib/hijri-core";
import { resetSightingCacheForTests } from "@/lib/hijri-sighting";
import {
  UMALQURA_END_YEAR,
  UMALQURA_EPOCH_JDN,
  UMALQURA_START_YEAR,
  UMALQURA_TOTAL_DAYS,
} from "@/lib/hijri-umalqura-data";
import { getUpcomingEvents } from "@/lib/islamic-events";
import { DEFAULT_LOCATION, type StoredLocation } from "@/lib/location";
import { getRamadanInfo } from "@/lib/ramadan";
import { isLunarWhiteDayDateString, whiteDaysForHijriMonth } from "@/lib/white-days";

/**
 * D14 Hijri adjustment (plan §4.5.11). Fixtures:
 * - Ramadan 1445 began on 11 March 2024 in Saudi Arabia (Umm al-Qura) and on
 *   12 March 2024 in Pakistan (Central Ruet-e-Hilal Committee) — see
 *   docs/proofs/hijri-adjustment.md.
 */

const UPDATED_AT = "2026-11-23T00:00:00.000Z";
const KARACHI = { latitude: 24.8607, longitude: 67.0011 };
const META = { basis: "umalqura", updatedAt: UPDATED_AT };

function adjustment(
  offsetDays: HijriOffsetDays,
  monthStarts?: Record<string, string>,
): HijriAdjustment {
  return {
    offsetDays,
    ...(monthStarts ? { monthStarts: monthStarts as HijriAdjustment["monthStarts"] } : {}),
    updatedAt: UPDATED_AT,
  };
}

function localDate(jdn: number): Date {
  const { year, month, day } = jdnToGregorian(jdn);
  return new Date(year, month - 1, day);
}

function dateJDN(date: Date): number {
  return gregorianToJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

/** Umm al-Qura inside the table, tabular outside — pure, no observer state. */
const UMALQURA_BASE: HijriBaseCalendar = {
  monthStart(index) {
    const { year, month } = hijriMonthFromIndex(index);
    return inUmalquraYearRange(year)
      ? umalquraToJDN(year, month, 1)
      : islamicTabularToJDN(year, month, 1);
  },
  monthIndexOf(jdn) {
    const h = inUmalquraJDNRange(jdn) ? jdnToUmalqura(jdn) : jdnToIslamicTabular(jdn);
    return hijriMonthIndex(h.year, h.month);
  },
};

const TABULAR_BASE: HijriBaseCalendar = {
  monthStart(index) {
    const { year, month } = hijriMonthFromIndex(index);
    return islamicTabularToJDN(year, month, 1);
  },
  monthIndexOf(jdn) {
    const h = jdnToIslamicTabular(jdn);
    return hijriMonthIndex(h.year, h.month);
  },
};

/** Deterministic PRNG (mulberry32). */
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const UQ_FIRST_INDEX = hijriMonthIndex(UMALQURA_START_YEAR, 1);
const UQ_LAST_INDEX = hijriMonthIndex(UMALQURA_END_YEAR, 12);

afterEach(() => {
  setHijriAdjustment(null);
  setHijriObserver(null);
  resetSightingCacheForTests();
  resetHijriAdjustmentCacheForTests();
});

/** Collects mismatches so day-by-day sweeps cost one `expect` (jest matchers are slow). */
function collector() {
  const failures: string[] = [];
  return {
    failures,
    check(ok: boolean, message: () => string) {
      if (!ok && failures.length < 20) failures.push(message());
    },
  };
}

function sameDate(a: HijriDate, b: HijriDate): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

const show = (h: HijriDate) => `${h.year}-${h.month}-${h.day}`;

describe("zero adjustment is identical to today", () => {
  /**
   * Compares the adjusted pipeline (forced, with a zero adjustment) and
   * hijri.ts with a neutral adjustment registered against today's `hijri.ts`
   * output for every day in `[fromJdn, toJdn)`.
   */
  function expectIdentity(fromJdn: number, toJdn: number) {
    const { failures, check } = collector();
    const days: { date: Date; today: HijriDate }[] = [];
    setHijriAdjustment(null);
    for (let jdn = fromJdn; jdn < toJdn; jdn += 1) {
      const date = localDate(jdn);
      days.push({ date, today: gregorianToHijri(date) });
    }
    const months = days
      .filter(({ today }) => today.day === 1)
      .map(({ today }) => ({
        ...today,
        length: hijriMonthLength(today.year, today.month),
        start: dateJDN(hijriToGregorian(today.year, today.month, 1)),
      }));

    const forced = createAdjustedCalendar(hijriBaseCalendar(), adjustment(0));
    days.forEach(({ today }, i) => {
      const got = forced.toHijri(fromJdn + i);
      check(sameDate(got, today), () => `forced ${fromJdn + i}: ${show(got)} ≠ ${show(today)}`);
    });
    for (const { year, month, length, start } of months) {
      const index = hijriMonthIndex(year, month);
      check(forced.monthLength(index) === length, () => `length ${year}-${month}`);
      check(forced.toJDN(year, month, 1) === start, () => `start ${year}-${month}`);
      check(forced.toJDN(year, month, length) === start + length - 1, () => `end ${year}-${month}`);
    }

    setHijriAdjustment({ offsetDays: 0, updatedAt: UPDATED_AT });
    for (const { date, today } of days) {
      const got = gregorianToHijri(date);
      check(sameDate(got, today), () => `neutral ${date.toDateString()}: ${show(got)}`);
    }
    for (const { year, month, length, start } of months) {
      check(hijriMonthLength(year, month) === length, () => `neutral length ${year}-${month}`);
      check(
        dateJDN(hijriToGregorian(year, month, 1)) === start,
        () => `neutral start ${year}-${month}`,
      );
    }
    expect(failures).toEqual([]);
    expect(days.length).toBe(toJdn - fromJdn);
  }

  it("matches Umm al-Qura for every day 1300–1600 AH", () => {
    expectIdentity(UMALQURA_EPOCH_JDN, UMALQURA_EPOCH_JDN + UMALQURA_TOTAL_DAYS);
  });

  it("matches the tabular calendar for every day 1300–1600 AH", () => {
    const { failures, check } = collector();
    const forced = createAdjustedCalendar(TABULAR_BASE, adjustment(0));
    const from = islamicTabularToJDN(UMALQURA_START_YEAR, 1, 1);
    const to = islamicTabularToJDN(UMALQURA_END_YEAR + 1, 1, 1);
    for (let jdn = from; jdn < to; jdn += 1) {
      const got = forced.toHijri(jdn);
      const want = jdnToIslamicTabular(jdn);
      check(sameDate(got, want), () => `${jdn}: ${show(got)} ≠ ${show(want)}`);
    }
    expect(failures).toEqual([]);
    // …and hijri.ts's own tabular fallback before the Umm al-Qura table.
    expectIdentity(islamicTabularToJDN(1280, 1, 1), UMALQURA_EPOCH_JDN);
  });

  // The Yallop table costs ~45 ms per month (≈ 2 s per year on a slow CI disk),
  // so the 300-year sighting sweep is sampled deterministically: every day of
  // every 50th year 1300–1600 AH (each window crosses both year boundaries,
  // incl. the table's two ends) plus every day of 1444–1449 AH contiguously.
  // Every 10th year + 1440–1450 was measured at ~65 s extra — too slow.
  const SIGHTING_SAMPLE_YEARS = Array.from(
    { length: (UMALQURA_END_YEAR - UMALQURA_START_YEAR) / 50 + 1 },
    (_, i) => UMALQURA_START_YEAR + i * 50,
  );

  function yearWindow(from: number, to: number): [number, number] {
    const start = umalquraToJDN(from, 1, 1) - 3;
    const end =
      to < UMALQURA_END_YEAR
        ? umalquraToJDN(to + 1, 1, 1) + 3
        : UMALQURA_EPOCH_JDN + UMALQURA_TOTAL_DAYS + 3;
    return [start, end];
  }

  it.each(SIGHTING_SAMPLE_YEARS)(
    "matches the sighting observer at fixture coordinates for every day of %i AH",
    (year) => {
      setHijriObserver(KARACHI);
      expectIdentity(...yearWindow(year, year));
    },
  );

  it("matches the sighting observer at fixture coordinates for every day 1444–1449 AH", () => {
    setHijriObserver(KARACHI);
    expectIdentity(...yearWindow(1444, 1449));
  });
});

describe("invariant sweep (seeded property tests)", () => {
  const WINDOW_FROM = hijriMonthIndex(1440, 1);
  const WINDOW_TO = hijriMonthIndex(1449, 12);

  function randomAdjustment(random: () => number): HijriAdjustment {
    const offsetDays = (Math.floor(random() * 5) - 2) as HijriOffsetDays;
    const plain = createAdjustedCalendar(UMALQURA_BASE, adjustment(offsetDays));
    const monthStarts: Record<string, string> = {};
    const count = Math.floor(random() * 25);
    for (let i = 0; i < count; i += 1) {
      const index = WINDOW_FROM + 2 + Math.floor(random() * (WINDOW_TO - WINDOW_FROM - 4));
      const { year, month } = hijriMonthFromIndex(index);
      const delta = Math.floor(random() * 5) - 2;
      monthStarts[hijriMonthKey(year, month)] = jdnToIsoDate(plain.predictedStart(index) + delta);
    }
    return adjustment(offsetDays, monthStarts);
  }

  it("keeps 29/30-day months, exact round-trips and contiguous days for 40 seeds", () => {
    const { failures, check } = collector();
    for (let seed = 1; seed <= 40; seed += 1) {
      const cal = createAdjustedCalendar(UMALQURA_BASE, randomAdjustment(seeded(seed)));
      let expectedNext = cal.monthStart(WINDOW_FROM);
      for (let index = WINDOW_FROM; index <= WINDOW_TO; index += 1) {
        const length = cal.monthLength(index);
        check(length === 29 || length === 30, () => `seed ${seed} month ${index}: ${length} days`);
        const { year, month } = hijriMonthFromIndex(index);
        for (let day = 1; day <= length; day += 1) {
          const jdn = cal.toJDN(year, month, day);
          // Contiguity: each Hijri day is exactly one civil day after the previous.
          check(jdn === expectedNext, () => `seed ${seed} ${year}-${month}-${day}: gap/overlap`);
          expectedNext = jdn + 1;
          // h → g → h
          const back = cal.toHijri(jdn);
          check(sameDate(back, { year, month, day }), () => `seed ${seed} h→g→h ${show(back)}`);
          // g → h → g
          check(
            cal.toJDN(back.year, back.month, back.day) === jdn,
            () => `seed ${seed} g→h→g ${jdn}`,
          );
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it.each([-2, -1, 1, 2] as const)("offsetDays %i alone shifts every date uniformly", (offset) => {
    const { failures, check } = collector();
    const shifted = createAdjustedCalendar(UMALQURA_BASE, adjustment(offset));
    const from = umalquraToJDN(1400, 1, 1);
    const to = umalquraToJDN(1460, 1, 1);
    for (let jdn = from; jdn < to; jdn += 1) {
      check(sameDate(shifted.toHijri(jdn + offset), jdnToUmalqura(jdn)), () => `${jdn}`);
    }
    expect(failures).toEqual([]);
  });

  it("applies an offset through hijri.ts too", () => {
    const before = gregorianToHijri(new Date(2026, 6, 20));
    setHijriAdjustment(adjustment(1));
    expect(gregorianToHijri(new Date(2026, 6, 21))).toEqual(before);
  });
});

describe("clamp behaviour", () => {
  it("never offers a correction that would make the previous month 28 or 31 days", () => {
    const random = seeded(42);
    for (let index = hijriMonthIndex(1440, 1); index <= hijriMonthIndex(1450, 12); index += 1) {
      const { year, month } = hijriMonthFromIndex(index);
      const prior =
        random() < 0.5
          ? adjustment(0)
          : adjustment(0, {
              [hijriMonthKey(
                hijriMonthFromIndex(index - 1).year,
                hijriMonthFromIndex(index - 1).month,
              )]: jdnToIsoDate(UMALQURA_BASE.monthStart(index - 1) + (random() < 0.5 ? 1 : -1)),
            });
      const { choices } = monthStartChoices(UMALQURA_BASE, prior, year, month);
      expect(choices.length).toBeGreaterThanOrEqual(1);
      for (const choice of choices) {
        const next = withHijriMonthStart(UMALQURA_BASE, prior, year, month, choice.date, META);
        const cal = createAdjustedCalendar(UMALQURA_BASE, next);
        expect([29, 30]).toContain(cal.monthLength(index - 1));
        expect(cal.monthStart(index)).toBe(choice.jdn);
      }
    }
  });

  it("correcting a month one day late lengthens a 29-day previous month to 30", () => {
    let checked = 0;
    for (let index = hijriMonthIndex(1445, 1); index <= hijriMonthIndex(1447, 12); index += 1) {
      if (UMALQURA_BASE.monthStart(index) - UMALQURA_BASE.monthStart(index - 1) !== 29) continue;
      const { year, month } = hijriMonthFromIndex(index);
      const late = jdnToIsoDate(UMALQURA_BASE.monthStart(index) + 1);
      const cal = createAdjustedCalendar(
        UMALQURA_BASE,
        adjustment(0, { [hijriMonthKey(year, month)]: late }),
      );
      expect(cal.monthLength(index - 1)).toBe(30);
      expect(cal.corrections()[0]?.applied).toBe(true);
      checked += 1;
    }
    expect(checked).toBeGreaterThan(5);
  });

  it("refuses a late correction after a 30-day month and one more than 2 days away", () => {
    const index = hijriMonthIndex(1445, 9);
    let after30 = index;
    while (UMALQURA_BASE.monthStart(after30) - UMALQURA_BASE.monthStart(after30 - 1) !== 30) {
      after30 += 1;
    }
    const { year, month } = hijriMonthFromIndex(after30);
    const key = hijriMonthKey(year, month);
    const predicted = UMALQURA_BASE.monthStart(after30);
    const refused = createAdjustedCalendar(
      UMALQURA_BASE,
      adjustment(0, { [key]: jdnToIsoDate(predicted + 1) }),
    );
    expect(refused.monthStart(after30)).toBe(predicted);
    expect(refused.corrections()[0]?.applied).toBe(false);
    const far = createAdjustedCalendar(
      UMALQURA_BASE,
      adjustment(0, { [key]: jdnToIsoDate(predicted - 3) }),
    );
    expect(far.monthStart(after30)).toBe(predicted);
    const choices = monthStartChoices(UMALQURA_BASE, null, year, month);
    expect(choices.laterNeedsPreviousMonth).toBe(true);
    expect(choices.choices.map((c) => c.delta)).toEqual([-1, 0]);
  });

  it("converges back to S₀ within 8 months for every |e| ≤ 2 across 1300–1600 AH", () => {
    const { failures, check } = collector();
    let accepted = 0;
    let worst = 0;
    for (let index = UQ_FIRST_INDEX + 2; index <= UQ_LAST_INDEX - 10; index += 1) {
      for (const e of [-2, -1, 1, 2]) {
        const monthStarts: Record<string, string> = {};
        const here = hijriMonthFromIndex(index);
        monthStarts[hijriMonthKey(here.year, here.month)] = jdnToIsoDate(
          UMALQURA_BASE.monthStart(index) + e,
        );
        if (Math.abs(e) === 2) {
          // A 2-day drift needs the previous month moved one day the same way first.
          const prev = hijriMonthFromIndex(index - 1);
          monthStarts[hijriMonthKey(prev.year, prev.month)] = jdnToIsoDate(
            UMALQURA_BASE.monthStart(index - 1) + Math.sign(e),
          );
        }
        const cal = createAdjustedCalendar(UMALQURA_BASE, adjustment(0, monthStarts));
        if (cal.monthStart(index) - cal.predictedStart(index) !== e) continue;
        accepted += 1;
        let converged = -1;
        for (let k = 1; k <= 8; k += 1) {
          if (cal.monthStart(index + k) === cal.predictedStart(index + k)) {
            converged = k;
            break;
          }
        }
        check(converged > 0, () => `month ${index} e=${e} did not converge`);
        worst = Math.max(worst, converged);
        // Once converged it stays on S₀.
        const after = index + converged + 1;
        check(cal.monthStart(after) === cal.predictedStart(after), () => `month ${index} drifted`);
      }
    }
    expect(failures).toEqual([]);
    expect(accepted).toBeGreaterThan(3000);
    expect(worst).toBeLessThanOrEqual(8);
  });
});

describe("real-world fixture: Ramadan 1445", () => {
  const shabanLength = umalquraMonthLength(1445, 8);

  it("Umm al-Qura starts Ramadan 1445 on 11 March 2024", () => {
    expect(gregorianToHijri(new Date(2024, 2, 11))).toEqual({ year: 1445, month: 9, day: 1 });
  });

  it("a 1445-09 correction to 12 March makes 12 March 1 Ramadan and Sha'ban one day longer", () => {
    const pakistan = adjustment(0, { "1445-09": "2024-03-12" });
    setHijriAdjustment(pakistan);
    if (shabanLength === 29) {
      expect(gregorianToHijri(new Date(2024, 2, 12))).toEqual({ year: 1445, month: 9, day: 1 });
      expect(gregorianToHijri(new Date(2024, 2, 11))).toEqual({ year: 1445, month: 8, day: 30 });
      expect(hijriMonthLength(1445, 8)).toBe(shabanLength + 1);
      expect(dateJDN(hijriToGregorian(1445, 9, 1))).toBe(isoDateToJDN("2024-03-12"));
      // Pakistan's Eid al-Fitr 1445 was 10 April 2024 as well: Shawwal converges back.
      expect(gregorianToHijri(new Date(2024, 3, 10))).toEqual({ year: 1445, month: 10, day: 1 });
    } else {
      // Sha'ban already 30 days: refused, and the sheet asks to correct Sha'ban first.
      expect(gregorianToHijri(new Date(2024, 2, 12))).toEqual({ year: 1445, month: 9, day: 2 });
      expect(monthStartChoices(UMALQURA_BASE, null, 1445, 9).laterNeedsPreviousMonth).toBe(true);
    }
  });

  it("offers 12 March in the sheet and stores it with the current basis", () => {
    const choices = monthStartChoices(hijriBaseCalendar(), null, 1445, 9);
    expect(choices.predicted).toBe(isoDateToJDN("2024-03-11"));
    expect(choices.choices.some((c) => c.date === "2024-03-12")).toBe(shabanLength === 29);
    const next = withHijriMonthStart(hijriBaseCalendar(), null, 1445, 9, "2024-03-12", {
      ...META,
      basisPlace: "Lahore",
    });
    if (shabanLength === 29) {
      expect(next).toEqual({
        offsetDays: 0,
        monthStarts: { "1445-09": "2024-03-12" },
        basis: "umalqura",
        basisPlace: "Lahore",
        updatedAt: UPDATED_AT,
      });
    }
    // Choosing the predicted day clears the correction.
    expect(
      withHijriMonthStart(hijriBaseCalendar(), next, 1445, 9, "2024-03-11", META),
    ).toBeUndefined();
  });
});

describe("consumers follow the correction", () => {
  const pakistan = adjustment(0, { "1445-09": "2024-03-12" });
  const location: StoredLocation = { ...DEFAULT_LOCATION };

  it("Ramadan info", () => {
    const now = new Date(2024, 2, 12, 12);
    expect(getRamadanInfo(location, now).day).toBe(2);
    setHijriAdjustment(pakistan);
    const info = getRamadanInfo(location, now);
    expect(info.isRamadan).toBe(true);
    expect(info.day).toBe(1);
    expect(info.totalDays).toBe(hijriMonthLength(1445, 9));
    expect(getRamadanInfo(location, new Date(2024, 2, 11, 12)).isRamadan).toBe(false);
  });

  it("white days 13–15 follow the correction", () => {
    expect(whiteDaysForHijriMonth(1445, 9).map((d) => d.date)).toEqual([
      "2024-03-23",
      "2024-03-24",
      "2024-03-25",
    ]);
    expect(isLunarWhiteDayDateString("2024-03-26")).toBe(false);
    setHijriAdjustment(pakistan);
    expect(whiteDaysForHijriMonth(1445, 9).map((d) => d.date)).toEqual([
      "2024-03-24",
      "2024-03-25",
      "2024-03-26",
    ]);
    expect(isLunarWhiteDayDateString("2024-03-26")).toBe(true);
    expect(isLunarWhiteDayDateString("2024-03-23")).toBe(false);
  });

  it("Islamic events", () => {
    const ramadanStart = () => getUpcomingEvents("2024-03-01", 8).find((e) => e.id === "ramadan");
    expect(ramadanStart()?.date).toBe("2024-03-11");
    setHijriAdjustment(pakistan);
    expect(ramadanStart()?.date).toBe("2024-03-12");
    expect(getUpcomingEvents("2024-03-01", 8).find((e) => e.id === "laylatQadr")?.date).toBe(
      "2024-04-07",
    );
  });

  it("widget snapshot", () => {
    const t = (_key: string, fallback: string) => fallback;
    const snapshot = () =>
      buildWidgetSnapshot({
        location,
        locationDenied: false,
        locale: "en",
        translationLocale: "en",
        calendar: "hijri",
        timeFormat: "24",
        theme: { isDark: false, primaryColor: "#059669", followsSystem: true },
        salahCompleted: 0,
        salahTotal: 5,
        prayerStatus: {},
        streakDays: 0,
        qazaRemaining: 0,
        qazaCompletedToday: 0,
        qazaTargetToday: 0,
        khatmPlan: null,
        khatmAyahsRead: 0,
        tasbeehToday: null,
        fridayChecklistDone: {},
        t,
        now: new Date(2024, 2, 12, 12),
      }).hijriDate.hijriDate;
    expect(snapshot()).toBe("Ramadan 2, 1445 AH");
    setHijriAdjustment(pakistan);
    expect(snapshot()).toBe("Ramadan 1, 1445 AH");
    expect(formatHijriDate(new Date(2024, 2, 12, 12), "en")).toBe("Ramadan 1, 1445 AH");
  });
});

describe("editing helpers and basis", () => {
  it("normalizes neutral adjustments to null", () => {
    expect(normalizeHijriAdjustment(adjustment(0))).toBeNull();
    expect(normalizeHijriAdjustment(adjustment(0, {}))).toBeNull();
    expect(normalizeHijriAdjustment(adjustment(1))).not.toBeNull();
  });

  it("sets and clears the offset and corrections", () => {
    const withOffset = withHijriOffset(null, -1, META);
    expect(withOffset).toEqual({ offsetDays: -1, basis: "umalqura", updatedAt: UPDATED_AT });
    expect(withHijriOffset(withOffset, 0, META)).toBeUndefined();
    const both = { ...adjustment(1, { "1445-09": "2024-03-13" }), basis: "umalqura" };
    expect(withoutHijriMonthStarts(both, META)).toEqual({
      offsetDays: 1,
      basis: "umalqura",
      updatedAt: UPDATED_AT,
    });
    expect(
      withoutHijriMonthStarts(adjustment(0, { "1445-09": "2024-03-12" }), META),
    ).toBeUndefined();
  });

  it("fingerprints the method and detects a move", () => {
    expect(hijriBasisFingerprint(null)).toBe("umalqura");
    expect(hijriBasisFingerprint({ latitude: 31.52, longitude: 74.36 })).toBe("sighting:32,74");
    expect(hijriBasisFingerprint({ latitude: -0.2, longitude: 0.3 })).toBe("sighting:0,0");
    const made = { ...adjustment(0, { "1445-09": "2024-03-12" }), basis: "sighting:32,74" };
    expect(hijriBasisMismatch(made, "sighting:32,74")).toBe(false);
    expect(hijriBasisMismatch(made, "umalqura")).toBe(true);
    expect(hijriBasisMismatch({ ...adjustment(1), basis: "sighting:32,74" }, "umalqura")).toBe(
      false,
    );
    const kept = withHijriBasis(made, {
      basis: "umalqura",
      basisPlace: "Makkah",
      updatedAt: UPDATED_AT,
    });
    expect(hijriBasisMismatch(kept, "umalqura")).toBe(false);
  });

  it("lists the months a correction affects", () => {
    const cal = createAdjustedCalendar(UMALQURA_BASE, adjustment(0, { "1445-09": "2024-03-12" }));
    const affected = cal.affectedMonths();
    expect(affected[0]).toMatchObject({ year: 1445, month: 8 });
    expect(affected.some((m) => m.year === 1445 && m.month === 9 && m.corrected)).toBe(true);
    for (const month of affected) expect([29, 30]).toContain(month.length);
  });
});
