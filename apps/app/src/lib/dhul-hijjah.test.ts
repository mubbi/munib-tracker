import { MADHHAB_IDS, rulesForSchool } from "@munib-tracker/shared/fiqh";
import { addDays } from "@munib-tracker/shared/utils";

import {
  dayOfTen,
  deedsForDay,
  dhulHijjahPhase,
  dhulHijjahStart,
  excusedStopsFasting,
  hairNailsWindowActive,
  hijriForDateString,
  isDhulHijjahModeActive,
  mergeDhulHijjah,
  sanitizeDhulHijjahStore,
  setIntendsUdhiyah,
  setUdhiyahPlan,
  tashriqKey,
  tashriqProgress,
  tashriqSlots,
  tashriqSlotsAllViews,
  toggleDailyCheck,
  toggleTashriq,
  udhiyahWindow,
} from "@/lib/dhul-hijjah";
import {
  resetHijriAdjustmentCacheForTests,
  setHijriAdjustment,
  setHijriObserver,
} from "@/lib/hijri";
import { defined } from "@/test-support/assert";
import {
  buildDhulHijjahState,
  DHUL_HIJJAH_1448 as DH,
  noonOf,
} from "@/test-support/fixtures/seasonal";

afterEach(() => {
  setHijriAdjustment(null);
  setHijriObserver(null);
  resetHijriAdjustmentCacheForTests();
});

describe("Dhul-Hijjah 1448 dates (lib/hijri.ts, Umm al-Qura)", () => {
  it("starts on 2027-05-07 with Arafah on the 15th and Eid on the 16th", () => {
    expect(dhulHijjahStart(DH.year).toDateString()).toBe(noonOf(DH.start).toDateString());
    expect(hijriForDateString(DH.arafah)).toEqual({ year: 1448, month: 12, day: 9 });
    expect(hijriForDateString(DH.eid)).toEqual({ year: 1448, month: 12, day: 10 });
  });
});

describe("activation boundaries", () => {
  it("teases from 25 Dhul-Qa'dah and runs 12/1 → 12/13", () => {
    expect(dhulHijjahPhase(noonOf(addDays(DH.teaserFrom, -1)))).toBeNull();
    expect(dhulHijjahPhase(noonOf(DH.teaserFrom))).toBe("teaser");
    expect(isDhulHijjahModeActive(noonOf(DH.eve))).toBe(false);
    expect(dhulHijjahPhase(noonOf(DH.start))).toBe("ten");
    expect(dhulHijjahPhase(noonOf(DH.arafah))).toBe("arafah");
    expect(dhulHijjahPhase(noonOf(DH.eid))).toBe("eid");
    expect(dhulHijjahPhase(noonOf(DH.lastTashriq))).toBe("tashriq");
    expect(isDhulHijjahModeActive(noonOf(DH.lastTashriq))).toBe(true);
    expect(isDhulHijjahModeActive(noonOf(addDays(DH.lastTashriq, 1)))).toBe(false);
  });

  it("follows a sighting override of the month start (D14 adjustment)", () => {
    setHijriAdjustment({
      offsetDays: 0,
      monthStarts: { "1448-12": addDays(DH.start, 1) },
      updatedAt: "2026-11-23T00:00:00.000Z",
    });
    expect(isDhulHijjahModeActive(noonOf(DH.start))).toBe(false);
    expect(dhulHijjahPhase(noonOf(addDays(DH.start, 1)))).toBe("ten");
    expect(dhulHijjahPhase(noonOf(addDays(DH.arafah, 1)))).toBe("arafah");
    expect(isDhulHijjahModeActive(noonOf(addDays(DH.lastTashriq, 1)))).toBe(true);
  });

  it("counts day X/10 only within the ten", () => {
    expect(dayOfTen({ year: 1448, month: 12, day: 10 })).toBe(10);
    expect(dayOfTen({ year: 1448, month: 12, day: 11 })).toBeNull();
    expect(dayOfTen({ year: 1448, month: 11, day: 29 })).toBeNull();
  });
});

describe("Takbir al-Tashriq slots per madhhab", () => {
  it.each([
    ["hanafi", 23],
    ["shafii", 23],
    ["hanbali", 23],
    ["maliki", 15],
  ] as const)("%s gives %i slots", (school, count) => {
    expect(tashriqSlots(rulesForSchool(school), DH.year)).toHaveLength(count);
  });

  it("starts at Fajr 9 / ends at Asr 13 for the majority and Dhuhr 10 → Fajr 13 for Maliki", () => {
    const hanafi = tashriqSlots(rulesForSchool("hanafi"), DH.year);
    expect(hanafi[0]).toEqual({ date: DH.arafah, hijriDay: 9, prayer: "fajr" });
    expect(hanafi.at(-1)).toEqual({ date: DH.lastTashriq, hijriDay: 13, prayer: "asr" });
    const maliki = tashriqSlots(rulesForSchool("maliki"), DH.year);
    expect(maliki[0]).toEqual({ date: DH.eid, hijriDay: 10, prayer: "dhuhr" });
    expect(maliki.at(-1)).toEqual({ date: DH.lastTashriq, hijriDay: 13, prayer: "fajr" });
  });

  it("all-views mode is the union, labelled by school", () => {
    const all = tashriqSlotsAllViews(DH.year);
    expect(all).toHaveLength(23);
    expect(all[0]?.schools).toEqual(["hanafi", "shafii", "hanbali"]);
    expect(all.find((s) => s.date === DH.eid && s.prayer === "dhuhr")?.schools).toEqual([
      ...MADHHAB_IDS,
    ]);
  });

  it("tracks progress X/N", () => {
    const slots = tashriqSlots(rulesForSchool("shafii"), DH.year);
    const state = toggleTashriq(buildDhulHijjahState(), DH.arafah, "fajr");
    expect(state.tashriq[tashriqKey(DH.arafah, "fajr")]).toBe(true);
    expect(tashriqProgress(state, slots)).toEqual({ done: 1, total: 23 });
  });
});

describe("daily deeds", () => {
  it("offers the fast on days 1–9 only, and not while fasting is excused", () => {
    expect(deedsForDay(1)).toContain("fast");
    expect(deedsForDay(9)).toContain("fast");
    expect(deedsForDay(10)).not.toContain("fast");
    expect(deedsForDay(12)).not.toContain("fast");
    expect(deedsForDay(3, { fastingExcused: true })).not.toContain("fast");
    expect(deedsForDay(10)).toEqual(["zikr", "quran", "sadaqah", "qiyam"]);
  });

  it("drops the Arafah fast for this year's pilgrim only (other days keep it)", () => {
    expect(deedsForDay(9, { pilgrim: true })).not.toContain("fast");
    expect(deedsForDay(8, { pilgrim: true })).toContain("fast");
    expect(deedsForDay(9, { pilgrim: false })).toContain("fast");
  });

  it("hayd and nifas stop fasting; sick and travel don't", () => {
    expect(excusedStopsFasting("hayd")).toBe(true);
    expect(excusedStopsFasting("nifas")).toBe(true);
    expect(excusedStopsFasting("sick")).toBe(false);
    expect(excusedStopsFasting("travel")).toBe(false);
    expect(excusedStopsFasting(null)).toBe(false);
  });

  it("toggles a deed per date", () => {
    const state = toggleDailyCheck(buildDhulHijjahState(), "qiyam", DH.start);
    expect(state.dailyChecks).toEqual({ [`qiyam::${DH.start}`]: true });
    expect(toggleDailyCheck(state, "qiyam", DH.start).dailyChecks).toEqual({});
  });
});

describe("udhiyah", () => {
  it("runs from 12/10 to the school's last day (both views when no school)", () => {
    expect(udhiyahWindow(rulesForSchool("hanafi"), DH.year)).toEqual([
      { startDate: DH.eid, endDate: addDays(DH.eid, 2), lastDayHijri: 12 },
    ]);
    expect(udhiyahWindow(rulesForSchool("shafii"), DH.year)[0]?.lastDayHijri).toBe(13);
    expect(udhiyahWindow(null, DH.year).map((w) => w.lastDayHijri)).toEqual([12, 13]);
  });

  it("keeps the plan clean (shares only for shared animals, max 7)", () => {
    const state = setUdhiyahPlan(buildDhulHijjahState(), {
      animal: "cow_share",
      shares: 12,
      via: "agency",
      onBehalfOf: ["  Aminah ", ""],
      status: "arranged",
    });
    expect(state.udhiyah).toEqual({
      animal: "cow_share",
      shares: 7,
      via: "agency",
      onBehalfOf: ["Aminah"],
      status: "arranged",
    });
    expect(setUdhiyahPlan(state, null).udhiyah).toBeUndefined();
  });
});

describe("hair & nails window", () => {
  const before = new Date(noonOf(DH.eve).getTime());

  it("applies from 12/1 when the intention was set before the month", () => {
    const state = setIntendsUdhiyah(buildDhulHijjahState(), true, before);
    expect(hairNailsWindowActive(state, noonOf(DH.eve))).toBe(false);
    expect(hairNailsWindowActive(state, noonOf(DH.start))).toBe(true);
    expect(hairNailsWindowActive(state, noonOf(DH.arafah))).toBe(true);
  });

  it("applies from the moment of intention when set mid-period", () => {
    const setAt = noonOf(addDays(DH.start, 3));
    const state = setIntendsUdhiyah(buildDhulHijjahState(), true, setAt);
    expect(hairNailsWindowActive(state, noonOf(addDays(DH.start, 2)))).toBe(false);
    expect(hairNailsWindowActive(state, new Date(setAt.getTime() + 60_000))).toBe(true);
  });

  it("ends once the animal is slaughtered or the season ends", () => {
    let state = setIntendsUdhiyah(buildDhulHijjahState(), true, before);
    state = setUdhiyahPlan(state, { animal: "sheep", via: "self", status: "slaughtered" });
    expect(hairNailsWindowActive(state, noonOf(DH.eid))).toBe(false);
    const open = setIntendsUdhiyah(buildDhulHijjahState(), true, before);
    expect(hairNailsWindowActive(open, noonOf(addDays(DH.lastTashriq, 1)))).toBe(false);
    expect(hairNailsWindowActive(setIntendsUdhiyah(open, false), noonOf(DH.start))).toBe(false);
  });
});

describe("sanitise + merge", () => {
  it("drops bad years and keys", () => {
    const store = sanitizeDhulHijjahStore({
      "1448": { dailyChecks: { [`quran::${DH.start}`]: true, junk: true }, tashriq: [] },
      nope: {},
      "99": {},
    });
    expect(Object.keys(store)).toEqual(["1448"]);
    expect(store["1448"]?.dailyChecks).toEqual({ [`quran::${DH.start}`]: true });
  });

  it("unions the checklists and keeps the newer planner per year", () => {
    const local = {
      "1448": buildDhulHijjahState({
        dailyChecks: { [`quran::${DH.start}`]: true },
        udhiyah: { animal: "sheep", via: "self", status: "planned" },
        updatedAt: "2027-05-01T00:00:00.000Z",
      }),
    };
    const remote = {
      "1448": buildDhulHijjahState({
        tashriq: { [tashriqKey(DH.arafah, "fajr")]: true },
        udhiyah: { animal: "goat", via: "agency", status: "arranged" },
        updatedAt: "2027-05-02T00:00:00.000Z",
      }),
      "1447": buildDhulHijjahState({ hijriYear: 1447 }),
    };
    const merged = mergeDhulHijjah(local, remote);
    expect(merged["1448"]).toMatchObject({
      dailyChecks: { [`quran::${DH.start}`]: true },
      tashriq: { [tashriqKey(DH.arafah, "fajr")]: true },
      udhiyah: { animal: "goat", status: "arranged" },
    });
    expect(merged["1447"]).toBeDefined();
  });

  describe("tick → untick across two devices", () => {
    const T1 = new Date("2027-05-27T05:00:00.000Z");
    const T2 = new Date("2027-05-27T06:00:00.000Z");
    const T3 = new Date("2027-05-27T07:00:00.000Z");

    it("keeps an untick made after the other device's tick (both directions)", () => {
      // Device A ticks; B pulls A, then unticks later.
      const a = { "1448": toggleDailyCheck(buildDhulHijjahState(), "qiyam", DH.start, T1) };
      const pulled = mergeDhulHijjah({}, a);
      const b = {
        "1448": toggleDailyCheck(defined(pulled["1448"]), "qiyam", DH.start, T2),
      };
      expect(b["1448"].dailyChecks).toEqual({});
      expect(mergeDhulHijjah(a, b)["1448"]?.dailyChecks).toEqual({});
      expect(mergeDhulHijjah(b, a)["1448"]?.dailyChecks).toEqual({});
      // A re-ticks later still: the newest write wins again.
      const a2 = {
        "1448": toggleDailyCheck(defined(mergeDhulHijjah(a, b)["1448"]), "qiyam", DH.start, T3),
      };
      expect(mergeDhulHijjah(b, a2)["1448"]?.dailyChecks).toEqual({
        [`qiyam::${DH.start}`]: true,
      });
    });

    it("keeps a Takbir al-Tashriq untick and still unions legacy unstamped ticks", () => {
      const ticked = toggleTashriq(buildDhulHijjahState(), DH.arafah, "fajr", T1);
      const unticked = { "1448": toggleTashriq(ticked, DH.arafah, "fajr", T2) };
      const legacy = {
        "1448": buildDhulHijjahState({
          tashriq: { [tashriqKey(DH.arafah, "dhuhr")]: true },
          dailyChecks: { [`quran::${DH.start}`]: true },
        }),
      };
      const merged = mergeDhulHijjah(legacy, { "1448": ticked })["1448"];
      expect(Object.keys(merged?.tashriq ?? {}).sort()).toEqual(
        [tashriqKey(DH.arafah, "dhuhr"), tashriqKey(DH.arafah, "fajr")].sort(),
      );
      const after = mergeDhulHijjah(merged ? { "1448": merged } : {}, unticked)["1448"];
      expect(after?.tashriq).toEqual({ [tashriqKey(DH.arafah, "dhuhr")]: true });
      expect(after?.dailyChecks).toEqual({ [`quran::${DH.start}`]: true });
      // Stamps survive a sanitize round trip (persisted / synced form).
      expect(sanitizeDhulHijjahStore({ "1448": after })["1448"]?.tashriqStamps).toEqual(
        after?.tashriqStamps,
      );
    });
  });
});
