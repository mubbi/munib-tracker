import { describe, expect, it } from "vitest";

import { QAZA_PRAYER_SET, RAWATIB_IDS, RAWATIB_PRAYERS } from "../constants/index";
import { makePrayerLog as log } from "../test-support/factories";
import type { MadhhabId, PrayerLog } from "../types/index";
import { buildDayActivity, countPerfectDays, sumPrayerTotals } from "./history";
import {
  activeRawatibIds,
  completedRawatibRakahs,
  defaultRakahs,
  hasRakahChoice,
  isRawatibDayComplete,
  isWitrQazaEnabled,
  type RawatibDayTimes,
  rakahsForLog,
  rawatibConsistency,
  rawatibForParent,
  rawatibNudgeCandidates,
  rawatibRowState,
  rawatibWindow,
  resolveRawatibConfig,
  sanitizeRawatibPreferences,
  splitRawatibForExcuse,
  summarizeRawatib,
  travelRawatibMode,
  witrQazaDefault,
  witrStatusFor,
} from "./rawatib";
import { buildDailySummary, computeStreak, longestStreak } from "./streak";

const FARD = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

function fullFardDay(date: string): PrayerLog[] {
  return FARD.map((id) => log(date, id, "completed"));
}

function rawatibDay(date: string): PrayerLog[] {
  return RAWATIB_IDS.map((id) => log(date, id, "completed"));
}

/** A plain day: Fajr 05:00, sunrise 06:30, Dhuhr 12:30, Asr 15:45, Maghrib 18:10, Isha 19:40. */
function times(day = "2026-03-10"): RawatibDayTimes {
  const at = (hhmm: string, d = day) => new Date(`${d}T${hhmm}:00Z`);
  return {
    fajr: at("05:00"),
    sunrise: at("06:30"),
    dhuhr: at("12:30"),
    asr: at("15:45"),
    maghrib: at("18:10"),
    isha: at("19:40"),
    nextFajr: at("04:58", "2026-03-11"),
  };
}

describe.concurrent("resolveRawatibConfig (D8 presets)", () => {
  it.each<[MadhhabId, number]>([
    ["hanafi", 12],
    ["shafii", 10],
    ["maliki", 10],
    ["hanbali", 10],
  ])("%s defaults to %i and is on", (madhhab, preset) => {
    const config = resolveRawatibConfig({ madhhab });
    expect(config).toMatchObject({ enabled: true, needsChoice: false, preset, school: madhhab });
    expect(config.presetSource).toBe("school");
    expect(config.ids).toEqual([...RAWATIB_PRAYERS]);
  });

  it("asks first when no school is chosen (never silently picks one)", () => {
    expect(resolveRawatibConfig({})).toMatchObject({ enabled: false, needsChoice: true });
    expect(resolveRawatibConfig({ madhhab: null })).toMatchObject({
      enabled: false,
      needsChoice: true,
      presetSource: "fallback",
    });
  });

  it("follows a salah-domain override and lets the user edit the preset", () => {
    expect(
      resolveRawatibConfig({ madhhab: "shafii", madhhabOverrides: { salah: "hanafi" } }).preset,
    ).toBe(12);
    const edited = resolveRawatibConfig({
      madhhab: "hanafi",
      rawatib: { enabled: true, preset: 10, extras: ["asr_before"] },
    });
    expect(edited).toMatchObject({ preset: 10, presetSource: "user" });
    expect(edited.ids).toEqual([
      "fajr_before",
      "dhuhr_before",
      "dhuhr_after",
      "asr_before",
      "maghrib_after",
      "isha_after",
    ]);
  });

  it("keeps an explicit off switch even when a school is chosen", () => {
    expect(
      resolveRawatibConfig({ madhhab: "hanbali", rawatib: { enabled: false, extras: [] } }),
    ).toMatchObject({ enabled: false, needsChoice: false, preset: 10 });
  });

  it("sanitizes malformed synced values", () => {
    expect(sanitizeRawatibPreferences(null)).toBeUndefined();
    expect(sanitizeRawatibPreferences({ enabled: "yes" })).toBeUndefined();
    expect(
      sanitizeRawatibPreferences({ enabled: true, preset: 11, extras: ["asr_before", "nope", 3] }),
    ).toEqual({ enabled: true, extras: ["asr_before"] });
  });
});

describe.concurrent("rows and rak'at", () => {
  it("orders extras after each fard's mu'akkadah rows", () => {
    expect(activeRawatibIds(["isha_before", "dhuhr_after_extra", "maghrib_before"])).toEqual([
      "fajr_before",
      "dhuhr_before",
      "dhuhr_after",
      "dhuhr_after_extra",
      "maghrib_before",
      "maghrib_after",
      "isha_before",
      "isha_after",
    ]);
    expect(rawatibForParent(activeRawatibIds([]), "dhuhr")).toEqual([
      "dhuhr_before",
      "dhuhr_after",
    ]);
    expect(rawatibForParent(activeRawatibIds([]), "asr")).toEqual([]);
  });

  it("defaults 4 before Dhuhr on preset 12 and 2 on preset 10", () => {
    expect(defaultRakahs("dhuhr_before", 12)).toBe(4);
    expect(defaultRakahs("dhuhr_before", 10)).toBe(2);
    expect(defaultRakahs("fajr_before", 12)).toBe(2);
    expect(defaultRakahs("asr_before", 10)).toBe(4);
    expect(hasRakahChoice("dhuhr_before")).toBe(true);
    expect(hasRakahChoice("maghrib_after")).toBe(false);
  });

  it("uses a valid logged count and ignores invalid ones", () => {
    expect(rakahsForLog({ rakahs: 2 }, "dhuhr_before", 12)).toBe(2);
    expect(rakahsForLog({ rakahs: 3 }, "dhuhr_before", 12)).toBe(4);
    expect(rakahsForLog(undefined, "dhuhr_before", 10)).toBe(2);
  });

  it("counts rak'at toward the preset target, mu'akkadah rows only", () => {
    const day = [
      ...rawatibDay("2026-03-10"),
      log("2026-03-10", "dhuhr_before", "completed", { rakahs: 4 }),
    ];
    // Map semantics: the later dhuhr_before log (4) is a separate entry in the list.
    const unique = new Map(day.map((entry) => [entry.prayerId, entry]));
    expect(completedRawatibRakahs([...unique.values()], 12)).toBe(12);
    expect(completedRawatibRakahs([...unique.values()], 10)).toBe(12);
    expect(completedRawatibRakahs(rawatibDay("2026-03-10"), 10)).toBe(10);
    expect(completedRawatibRakahs([log("2026-03-10", "fajr_before", "pending")], 12)).toBe(0);
    expect(isRawatibDayComplete({ fajr_before: "completed" })).toBe(false);
  });
});

describe.concurrent("excused periods", () => {
  const ids = activeRawatibIds(["asr_before"]);

  it("hides every row during hayd and nifas", () => {
    expect(splitRawatibForExcuse(ids, "hayd")).toEqual({
      shown: [],
      optional: [],
      hidden: true,
      expected: false,
    });
    expect(splitRawatibForExcuse(ids, "nifas").hidden).toBe(true);
  });

  it("keeps rows visible but expects nothing while sick", () => {
    expect(splitRawatibForExcuse(ids, "sick")).toMatchObject({ shown: ids, expected: false });
  });

  it("shows only the Fajr sunnah while travelling; the rest are optional", () => {
    const split = splitRawatibForExcuse(ids, "travel");
    expect(split.shown).toEqual(["fajr_before"]);
    expect(split.optional).not.toContain("fajr_before");
    expect(split.optional).toHaveLength(ids.length - 1);
  });

  it("expects all rows on a normal day", () => {
    expect(splitRawatibForExcuse(ids, null)).toMatchObject({ shown: ids, expected: true });
  });

  it("reads the travel rule of the school governing travel", () => {
    expect(travelRawatibMode({ madhhab: "hanafi" })).toBe("optional_except_fajr");
    expect(travelRawatibMode({ madhhab: "hanbali" })).toBe("left_except_fajr_witr");
    expect(travelRawatibMode({ madhhab: "shafii" })).toBe("optional");
    expect(travelRawatibMode({ madhhab: null })).toBeNull();
  });
});

describe.concurrent("visibility windows", () => {
  it("opens each row at its fard and closes it at the next fard", () => {
    const t = times();
    expect(rawatibWindow("fajr_before", t)).toEqual({
      start: t.fajr,
      end: t.dhuhr,
      lateAfter: t.sunrise,
    });
    expect(rawatibWindow("dhuhr_after", t)).toEqual({ start: t.dhuhr, end: t.asr });
    expect(rawatibWindow("asr_before", t)).toEqual({ start: t.asr, end: t.maghrib });
    expect(rawatibWindow("maghrib_before", t)).toEqual({ start: t.maghrib, end: t.isha });
    expect(rawatibWindow("isha_after", t)).toEqual({ start: t.isha, end: t.nextFajr });
  });

  it("marks the Fajr sunnah late after sunrise (Tirmidhi 423)", () => {
    const t = times();
    const early = rawatibRowState(
      "fajr_before",
      new Date("2026-03-10T05:30:00Z"),
      t,
      undefined,
      false,
    );
    const late = rawatibRowState(
      "fajr_before",
      new Date("2026-03-10T09:00:00Z"),
      t,
      undefined,
      false,
    );
    expect(early).toMatchObject({ visible: true, late: false });
    expect(late).toMatchObject({ visible: true, late: true });
    const afterDhuhr = rawatibRowState(
      "fajr_before",
      new Date("2026-03-10T13:00:00Z"),
      t,
      undefined,
      false,
    );
    expect(afterDhuhr.visible).toBe(false);
  });

  it("keeps a logged row visible after its window closes", () => {
    const state = rawatibRowState(
      "fajr_before",
      new Date("2026-03-10T20:00:00Z"),
      times(),
      undefined,
      true,
    );
    expect(state).toMatchObject({ visible: true, inWindow: false });
  });

  it("flags an after-row whose fard isn't marked yet (soft hint, still loggable)", () => {
    const now = new Date("2026-03-10T13:00:00Z");
    expect(rawatibRowState("dhuhr_after", now, times(), "pending", false)).toMatchObject({
      visible: true,
      beforeFard: true,
    });
    expect(rawatibRowState("dhuhr_after", now, times(), "completed", false).beforeFard).toBe(false);
    expect(rawatibRowState("dhuhr_before", now, times(), "pending", false).beforeFard).toBe(false);
  });

  it("keeps rows visible when a time is unavailable (polar day/night)", () => {
    const polar = { ...times(), isha: new Date(Number.NaN) };
    expect(rawatibWindow("isha_after", polar)).toBeNull();
    expect(
      rawatibRowState("isha_after", new Date("2026-03-10T10:00:00Z"), polar, "pending", false),
    ).toMatchObject({ visible: true, inWindow: true });
    expect(
      rawatibRowState("dhuhr_before", new Date("2026-03-10T10:00:00Z"), null, undefined, false)
        .visible,
    ).toBe(true);
  });

  it("handles an Isha window that runs past midnight", () => {
    const t = { ...times(), isha: new Date("2026-03-10T23:30:00Z") };
    expect(
      rawatibRowState("isha_after", new Date("2026-03-11T00:30:00Z"), t, "completed", false)
        .visible,
    ).toBe(true);
  });
});

describe.concurrent("statistics", () => {
  it("builds a consistency grid and summary that skip excused and untracked days", () => {
    const logs = [
      ...rawatibDay("2026-03-02").filter((entry) =>
        RAWATIB_PRAYERS.includes(entry.prayerId as never),
      ),
      log("2026-03-03", "fajr_before", "completed"),
      log("2026-03-04", "fajr", "pending", { isExcused: true, excusedReason: "hayd" }),
    ];
    const cells = rawatibConsistency(logs, "2026-03-01", "2026-03-05", "2026-03-05");
    expect(cells.map((c) => [c.date, c.done, c.complete, c.excused, c.beforeStart])).toEqual([
      ["2026-03-01", 0, false, false, true],
      ["2026-03-02", 5, true, false, false],
      ["2026-03-03", 1, false, false, false],
      ["2026-03-04", 0, false, true, false],
      ["2026-03-05", 0, false, false, false],
    ]);
    expect(summarizeRawatib(cells)).toEqual({ completeDays: 1, countedDays: 2, rowsCompleted: 6 });
  });
});

describe.concurrent("after-fard nudge candidates", () => {
  it("nudges after a marked fard whose after-row is unlogged", () => {
    const ids = activeRawatibIds([]);
    const logs = [
      log("2026-03-10", "fajr", "completed", { updatedAt: "2026-03-10T05:10:00.000Z" }),
      log("2026-03-10", "dhuhr", "completed", { updatedAt: "2026-03-10T12:40:00.000Z" }),
      log("2026-03-10", "maghrib", "completed", { updatedAt: "2026-03-10T18:20:00.000Z" }),
      log("2026-03-10", "maghrib_after", "completed"),
      log("2026-03-10", "isha", "pending"),
    ];
    expect(rawatibNudgeCandidates(logs, ids, "2026-03-10")).toEqual([
      { parent: "dhuhr", rawatib: "dhuhr_after", fireAt: new Date("2026-03-10T12:50:00.000Z") },
    ]);
  });
});

describe.concurrent("Witr (madhhab retrofit)", () => {
  it("defaults Witr qaza on only for Hanafi; an explicit choice wins", () => {
    expect(witrQazaDefault({ madhhab: "hanafi" })).toBe(true);
    for (const madhhab of ["shafii", "maliki", "hanbali"] as const) {
      expect(witrQazaDefault({ madhhab })).toBe(false);
      expect(isWitrQazaEnabled({ madhhab, witrQaza: true })).toBe(true);
    }
    expect(isWitrQazaEnabled({ madhhab: "hanafi", witrQaza: false })).toBe(false);
    // No school: keep the earlier behaviour (asked each time).
    expect(isWitrQazaEnabled({ madhhab: null })).toBe(true);
    expect(isWitrQazaEnabled({})).toBe(true);
  });

  it("labels Witr wajib for Hanafi and sunnah mu'akkadah for the others", () => {
    expect(witrStatusFor({ madhhab: "hanafi" })).toBe("wajib");
    expect(witrStatusFor({ madhhab: "maliki" })).toBe("sunnah_muakkadah");
    expect(witrStatusFor({ madhhab: null })).toBeNull();
  });
});

describe.concurrent("obligatory-only computations ignore rawatib (regression)", () => {
  const today = "2026-03-10";

  it("rawatib never make a streak, a perfect day or a fard total", () => {
    const onlyRawatib = [...rawatibDay("2026-03-09"), ...rawatibDay(today)];
    expect(computeStreak(onlyRawatib, true, today)).toBe(0);
    expect(longestStreak(onlyRawatib, true)).toBe(0);
    expect(countPerfectDays(onlyRawatib)).toBe(0);
    expect(buildDayActivity(onlyRawatib, today).completed).toBe(0);
    expect(sumPrayerTotals(onlyRawatib, "2026-03-01", today).completed).toBe(0);
    expect(buildDailySummary({ date: today, prayerLogs: onlyRawatib }).salahCompleted).toBe(0);
  });

  it("adding rawatib to a fard day changes nothing", () => {
    const fard = [...fullFardDay("2026-03-09"), ...fullFardDay(today)];
    const withRawatib = [...fard, ...rawatibDay("2026-03-09"), ...rawatibDay(today)];
    expect(computeStreak(withRawatib, true, today)).toBe(computeStreak(fard, true, today));
    expect(longestStreak(withRawatib, true)).toBe(longestStreak(fard, true));
    expect(countPerfectDays(withRawatib)).toBe(countPerfectDays(fard));
    expect(buildDayActivity(withRawatib, today)).toEqual(buildDayActivity(fard, today));
  });

  it("no rawatib id is a qaza prayer", () => {
    for (const id of RAWATIB_IDS) expect(QAZA_PRAYER_SET.has(id)).toBe(false);
  });
});
