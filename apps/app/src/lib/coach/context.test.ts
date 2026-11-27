import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type { PrayerLog, PrayerStatus } from "@munib-tracker/shared/types";
import { addDays, buildCoachWeekReport, emptyCoachHistory } from "@munib-tracker/shared/utils";

import { EMPTY_HABIT_CONTEXT, EMPTY_SUNNAH_HABITS } from "@/lib/sunnah-habits";

import { makePrayerLog as log } from "../../../../../packages/shared/src/test-support/factories";
import { buildCoachContext, type CoachSources } from "./context";

const WEEK = "2026-11-13"; // Fri → Thu, reviewed Friday 2026-11-20
const TODAY = "2026-11-20";

function day(date: string, status: PrayerStatus, extra: Partial<PrayerLog> = {}): PrayerLog[] {
  return OBLIGATORY_PRAYERS.map((prayer) => log(date, prayer, status, extra));
}

function weekOf(start: string, status: PrayerStatus, extra: Partial<PrayerLog> = {}): PrayerLog[] {
  return Array.from({ length: 7 }, (_, i) => day(addDays(start, i), status, extra)).flat();
}

function sources(overrides: Partial<CoachSources> = {}): CoachSources {
  return {
    today: TODAY,
    weekStart: WEEK,
    prayerLogs: [],
    zikrProgress: [],
    qazaCounters: [],
    qazaDailyProgress: {},
    khatm: { plan: null, read: 0 },
    khushu: [],
    quranReadingProgress: {},
    practiceSessionEnds: [],
    habits: EMPTY_SUNNAH_HABITS,
    habitContext: EMPTY_HABIT_CONTEXT,
    voluntaryFasting: {},
    prefs: { activeExcusedReason: null, homeMasjid: null, bedtime: "22:30" },
    muhasabah: null,
    family: null,
    ...overrides,
  };
}

describe("buildCoachContext (NF-3.14)", () => {
  it("maps the statistics engine into week stats (on time, delayed, jama, weekdays)", () => {
    const logs = [
      ...weekOf(WEEK, "completed").filter(
        (l) =>
          !(l.date === "2026-11-19" && l.prayerId === "asr") &&
          !(l.date === "2026-11-13" && l.prayerId === "isha"),
      ),
      // Thursday's Asr delayed, Friday's Isha in congregation.
      log("2026-11-19", "asr", "delayed"),
      log("2026-11-13", "isha", "completed", { isJama: true }),
    ];
    const ctx = buildCoachContext(sources({ prayerLogs: logs }));
    expect(ctx.week.countedDays).toBe(7);
    expect(ctx.week.perfectDays).toBe(6);
    expect(ctx.week.fard.asr).toEqual({ onTime: 6, delayed: 1, jama: 0, days: 7 });
    expect(ctx.week.fard.isha.jama).toBe(1);
    // 2026-11-19 is a Thursday (index 4): 4 of 5 on time.
    expect(ctx.week.weekdayLevels[4]).toBeCloseTo(0.8);
    expect(ctx.week.activeDays).toBe(7);
    expect(ctx.previousWeeks).toHaveLength(4);
    expect(ctx.previousWeeks[0]?.activeDays).toBe(0);
    expect(ctx.streak).toEqual({ current: 7, best: 7, bestBeforeWeek: 0 });
  });

  it("counts excused days and the dominant reason (travel), leaving them out of rates", () => {
    const logs = [
      ...weekOf(WEEK, "completed").filter((l) => l.date < "2026-11-15"),
      ...Array.from({ length: 5 }, (_, i) =>
        day(addDays("2026-11-15", i), "pending", { isExcused: true, excusedReason: "travel" }),
      ).flat(),
    ];
    const ctx = buildCoachContext(sources({ prayerLogs: logs }));
    expect(ctx.week.excusedDays).toBe(5);
    expect(ctx.week.countedDays).toBe(2);
    expect(ctx.excused).toEqual({ active: null, dominant: "travel" });
    const report = buildCoachWeekReport(ctx, emptyCoachHistory());
    expect(report.mode).toBe("excused");
    expect(report.insights.map((i) => i.variant)).toEqual(["travel"]);
  });

  it("reads Qur'an days from reading progress and practice, fasts, qaza and khatm pace", () => {
    const ctx = buildCoachContext(
      sources({
        quranReadingProgress: {
          1: { updatedAt: new Date(2026, 10, 14, 9).toISOString() },
          2: { updatedAt: new Date(2026, 9, 1, 9).toISOString() },
        },
        practiceSessionEnds: [new Date(2026, 10, 16, 20).toISOString()],
        voluntaryFasting: {
          "2026-11-16": { status: "fasted", updatedAt: "x" },
          "2026-11-17": { status: "fasted", asQaza: true, updatedAt: "x" },
          "2026-11-19": { status: "fasted", deleted: true, updatedAt: "x" },
        },
        qazaCounters: [{ remaining: 30 }, { remaining: 10 }],
        qazaDailyProgress: { "2026-11-14": { date: "2026-11-14", completed: { fajr: 2 } } },
        // 30-day plan started 10 days ago, nothing read: 10 days behind.
        khatm: { plan: { days: 30, startDate: "2026-11-10", unit: "ayah" }, read: 0 },
      } as Partial<CoachSources>),
    );
    expect(ctx.week.quranDays).toBe(2);
    expect(ctx.voluntaryFastsKept).toBe(1);
    expect(ctx.qaza).toMatchObject({ remaining: 40, madeUpThisWeek: 2 });
    expect(ctx.khatm).toEqual({ hasPlan: true, daysBehind: 10 });
    expect(ctx.week.activeDays).toBe(2);
  });

  it("D40: counts every logged reading day and uses the surah stamps only before the log began", () => {
    const at = (d: number) => new Date(2026, 10, d, 9).toISOString();
    const ctx = buildCoachContext(
      sources({
        quranReadingLog: {
          "2026-11-16": { seconds: 300, ayahs: 20, pages: 0 },
          "2026-11-17": { seconds: 0, ayahs: 0, pages: 2 },
          "2026-11-18": { seconds: 120, ayahs: 0, pages: 0 },
          // Previous week — only counted for that week.
          "2026-11-10": { seconds: 60, ayahs: 5, pages: 0 },
        },
        quranReadingProgress: {
          // Before the log's first entry (2026-11-10): the approximation still counts.
          1: { updatedAt: at(8) },
          // On/after the log start: ignored (the log is the source of truth).
          2: { updatedAt: at(14) },
        },
      }),
    );
    expect(ctx.week.quranDays).toBe(3);
    expect(ctx.previousWeeks[0]?.quranDays).toBe(2);
  });

  it("falls back to the surah-progress approximation when the log is empty", () => {
    const ctx = buildCoachContext(
      sources({
        quranReadingLog: {},
        quranReadingProgress: { 1: { updatedAt: new Date(2026, 10, 14, 9).toISOString() } },
      }),
    );
    expect(ctx.week.quranDays).toBe(1);
  });

  it("passes vault counts through and keeps null (locked) as null", () => {
    const locked = buildCoachContext(sources());
    expect(locked.muhasabah).toBeNull();
    expect(locked.family).toBeNull();
    const open = buildCoachContext(
      sources({
        muhasabah: { weekStart: WEEK, reviewDays: 5, perPrompt: {}, istighfarDays: 1 },
        family: {
          tracked: 3,
          dueCount: 1,
          parentDue: true,
          contactsThisWeek: 2,
          asOf: "2026-11-19",
        },
      }),
    );
    expect(open.muhasabah).toEqual({ reviewDays: 5, istighfarDays: 1 });
    expect(open.family).toEqual({ parentDue: true, dueCount: 1, contactsThisWeek: 2 });
  });

  it("averages khushu per fard over four weeks", () => {
    const entry = (date: string, rating: number) => ({
      id: date,
      date,
      prayerId: "fajr" as const,
      rating,
      createdAt: "x",
      updatedAt: "x",
    });
    const ctx = buildCoachContext(
      sources({
        khushu: [entry("2026-11-18", 2), entry("2026-11-01", 1), entry("2026-09-01", 5)],
      }),
    );
    expect(ctx.khushu.fajr).toEqual({ average: 1.5, entries: 2 });
  });

  it("counts focus-lock emergency unlocks inside the reviewed week only (neutral count)", () => {
    const at = (date: string, time: string) => new Date(`${date}T${time}`).toISOString();
    const emergencyLog = [
      at("2026-11-12", "23:30:00"), // the day before the week
      at("2026-11-13", "05:10:00"),
      at("2026-11-16", "13:00:00"),
      at("2026-11-19", "23:59:00"),
      at("2026-11-20", "06:00:00"), // report day, after the week
    ];
    expect(buildCoachContext(sources({ focusLock: { emergencyLog } })).focusLock).toEqual({
      emergencyUnlocks: 3,
    });
    expect(buildCoachContext(sources()).focusLock).toBeNull();
    expect(buildCoachContext(sources({ focusLock: null })).focusLock).toBeNull();
  });
});
