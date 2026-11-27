import { describe, expect, it } from "vitest";
import { makeFastEntry as entry, makeHijriCalendar } from "../test-support/factories";
import { DEFAULT_VOLUNTARY_FASTING_PREFS, type VoluntaryFastingPrefs } from "../types/fasting";
import { addDays } from "./date";
import {
  asVoluntaryFastingMap,
  classifyFastDay,
  classifyFastRange,
  dhulHijjahNineCount,
  type FastingCalendarContext,
  hajjSeasonHijriYear,
  isPilgrimInHijriYear,
  matchesEnabledKinds,
  mergeVoluntaryFasting,
  needsAshuraCompanion,
  shawwalSixCount,
  voluntaryFastBlockForHijri,
  weekdayOfDateKey,
} from "./fasting-calendar";

// 1 Muharram 1448 ≈ 16 June 2026 (Umm al-Qura); alternate 30/29 months.
const ANCHOR = "2026-06-16";
const SHORT_SHABAN = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
// Same year but Sha'ban has 30 days (so a 30 Sha'ban "day of doubt" exists).
const LONG_SHABAN = [30, 29, 30, 29, 30, 29, 29, 30, 30, 29, 30, 29];

const toHijri = makeHijriCalendar(ANCHOR, 1448, SHORT_SHABAN);
const toHijriLong = makeHijriCalendar(ANCHOR, 1448, LONG_SHABAN);

/** Local date key for a Hijri day in 1448 under the given calendar. */
function dateOf(month: number, day: number, calendar = toHijri): string {
  for (let i = 0; i < 360; i += 1) {
    const key = addDays(ANCHOR, i);
    const h = calendar(key);
    if (h.year === 1448 && h.month === month && h.day === day) return key;
  }
  throw new Error(`no ${month}/${day}`);
}

function ctx(overrides: Partial<FastingCalendarContext> = {}): FastingCalendarContext {
  return { toHijri, school: "hanafi", prefs: DEFAULT_VOLUNTARY_FASTING_PREFS, ...overrides };
}

/** First date in a Hijri month whose weekday matches and that passes `extra`. */
function findInMonth(month: number, weekday: number, extra: (key: string) => boolean = () => true) {
  for (let day = 1; day <= 29; day += 1) {
    const key = dateOf(month, day);
    if (weekdayOfDateKey(key) === weekday && extra(key)) return key;
  }
  throw new Error("not found");
}

describe.concurrent("classifyFastDay — prohibited days", () => {
  it("blocks both Eids and the days of Tashriq with no kinds", () => {
    for (const [m, d, reason] of [
      [10, 1, "eid"],
      [12, 10, "eid"],
      [12, 11, "tashriq"],
      [12, 12, "tashriq"],
      [12, 13, "tashriq"],
    ] as const) {
      const c = classifyFastDay(dateOf(m, d), ctx());
      expect(c.ruling).toBe("prohibited");
      expect(c.blocking).toBe(true);
      expect(c.kinds).toEqual([]);
      expect(c.reasons).toEqual([`voluntaryFasting.reason.${reason}`]);
    }
  });

  it("excludes Ramadan (own store)", () => {
    const c = classifyFastDay(dateOf(9, 5), ctx());
    expect(c.isRamadan).toBe(true);
    expect(c.kinds).toEqual([]);
    expect(c.blocking).toBe(false);
  });
});

describe.concurrent("classifyFastDay — recommended kinds", () => {
  it("Arafah recommends both arafah and the first nine", () => {
    const c = classifyFastDay(dateOf(12, 9), ctx());
    expect(c.kinds).toEqual(expect.arrayContaining(["arafah", "dhul_hijjah_nine"]));
    expect(["recommended", "disliked"]).toContain(c.ruling);
  });

  it("Arafah is only permitted (with a note) for this year's pilgrim", () => {
    const prefs: VoluntaryFastingPrefs = {
      ...DEFAULT_VOLUNTARY_FASTING_PREFS,
      isPilgrimThisYear: true,
      pilgrimHijriYear: 1448,
    };
    const c = classifyFastDay(dateOf(12, 9), ctx({ prefs }));
    expect(c.kinds).not.toContain("arafah");
    expect(c.kinds).not.toContain("dhul_hijjah_nine");
    expect(c.ruling).toBe("permitted");
    expect(c.reasons).toEqual(["voluntaryFasting.reason.pilgrimArafah"]);
  });

  it("the pilgrim flag is scoped to its Hijri year (expires after that Hajj)", () => {
    const lastYear: VoluntaryFastingPrefs = {
      ...DEFAULT_VOLUNTARY_FASTING_PREFS,
      isPilgrimThisYear: true,
      pilgrimHijriYear: 1447,
    };
    const noYear: VoluntaryFastingPrefs = {
      ...DEFAULT_VOLUNTARY_FASTING_PREFS,
      isPilgrimThisYear: true,
    };
    for (const prefs of [lastYear, noYear]) {
      const c = classifyFastDay(dateOf(12, 9), ctx({ prefs }));
      expect(c.kinds).toContain("arafah");
      expect(c.reasons).not.toContain("voluntaryFasting.reason.pilgrimArafah");
    }
  });
});

describe.concurrent("pilgrim year + voluntary fast gate", () => {
  it("isPilgrimInHijriYear needs the flag and a matching year", () => {
    const on = { isPilgrimThisYear: true, pilgrimHijriYear: 1448 };
    expect(isPilgrimInHijriYear(on, 1448)).toBe(true);
    expect(isPilgrimInHijriYear(on, 1449)).toBe(false);
    expect(isPilgrimInHijriYear({ isPilgrimThisYear: false, pilgrimHijriYear: 1448 }, 1448)).toBe(
      false,
    );
    expect(isPilgrimInHijriYear({ isPilgrimThisYear: true }, 1448)).toBe(false);
    expect(isPilgrimInHijriYear(undefined, 1448)).toBe(false);
  });

  it("hajjSeasonHijriYear rolls over after the last day of Tashriq", () => {
    expect(hajjSeasonHijriYear({ year: 1448, month: 5, day: 1 })).toBe(1448);
    expect(hajjSeasonHijriYear({ year: 1448, month: 12, day: 13 })).toBe(1448);
    expect(hajjSeasonHijriYear({ year: 1448, month: 12, day: 14 })).toBe(1449);
  });

  it("voluntaryFastBlockForHijri: Eid, Tashriq (incl. 13 Dhul-Hijjah) and Ramadan", () => {
    expect(voluntaryFastBlockForHijri({ month: 10, day: 1 })).toBe("eid");
    expect(voluntaryFastBlockForHijri({ month: 12, day: 10 })).toBe("eid");
    for (const day of [11, 12, 13]) {
      expect(voluntaryFastBlockForHijri({ month: 12, day })).toBe("tashriq");
    }
    expect(voluntaryFastBlockForHijri({ month: 9, day: 14 })).toBe("ramadan");
    expect(voluntaryFastBlockForHijri({ month: 12, day: 14 })).toBeNull();
    expect(voluntaryFastBlockForHijri({ month: 12, day: 9 })).toBeNull();
    expect(voluntaryFastBlockForHijri({ month: 2, day: 13 })).toBeNull();
  });

  it("Tasu'a / Ashura / Muharram", () => {
    expect(classifyFastDay(dateOf(1, 9), ctx()).kinds).toEqual(
      expect.arrayContaining(["tasua", "muharram"]),
    );
    expect(classifyFastDay(dateOf(1, 10), ctx()).kinds).toEqual(
      expect.arrayContaining(["ashura", "muharram"]),
    );
  });

  it("White Days, Shawwal from the 2nd, Mondays and Thursdays", () => {
    expect(classifyFastDay(dateOf(2, 14), ctx()).kinds).toContain("white_day");
    expect(classifyFastDay(dateOf(10, 2), ctx()).kinds).toContain("shawwal_six");
    const monday = findInMonth(3, 1);
    expect(classifyFastDay(monday, ctx()).kinds).toContain("monday");
    const thursday = findInMonth(3, 4);
    expect(classifyFastDay(thursday, ctx()).ruling).toBe("recommended");
  });

  it("the fast of Dawud alternates from its start date", () => {
    const start = dateOf(3, 1);
    const prefs = { ...DEFAULT_VOLUNTARY_FASTING_PREFS, dawudMode: { startDate: start } };
    expect(classifyFastDay(start, ctx({ prefs })).kinds).toContain("dawud");
    expect(classifyFastDay(addDays(start, 1), ctx({ prefs })).kinds).not.toContain("dawud");
    expect(classifyFastDay(addDays(start, 2), ctx({ prefs })).kinds).toContain("dawud");
    expect(classifyFastDay(addDays(start, -2), ctx({ prefs })).kinds).not.toContain("dawud");
  });
});

describe.concurrent("classifyFastDay — Friday singled out", () => {
  const plainFriday = findInMonth(4, 5, (key) => {
    const day = toHijri(key).day;
    return day < 12 || day > 16;
  });

  it("is disliked alone, with a Thursday-or-Saturday hint", () => {
    const c = classifyFastDay(plainFriday, ctx());
    expect(c.ruling).toBe("disliked");
    expect(c.reasons).toEqual(["voluntaryFasting.reason.fridayAlone"]);
  });

  it("is fine with a planned Thursday or Saturday", () => {
    const withThu = { [addDays(plainFriday, -1)]: entry("intended") };
    const withSat = { [addDays(plainFriday, 1)]: entry("fasted") };
    expect(classifyFastDay(plainFriday, ctx({ entries: withThu })).ruling).toBe("permitted");
    expect(classifyFastDay(plainFriday, ctx({ entries: withSat })).ruling).toBe("permitted");
  });

  it("ignores cleared or broken neighbours", () => {
    const entries = {
      [addDays(plainFriday, -1)]: entry("intended", { deleted: true }),
      [addDays(plainFriday, 1)]: entry("broken"),
    };
    expect(classifyFastDay(plainFriday, ctx({ entries })).ruling).toBe("disliked");
  });

  it("is not disliked when it is a customary fast (White Day) or a qaza day", () => {
    const whiteFriday = [2, 3, 4, 5, 6, 7]
      .flatMap((m) => [13, 14, 15].map((d) => dateOf(m, d)))
      .find((key) => weekdayOfDateKey(key) === 5) as string;
    expect(classifyFastDay(whiteFriday, ctx()).ruling).toBe("recommended");
    const qaza = { [plainFriday]: entry("intended", { asQaza: true }) };
    expect(classifyFastDay(plainFriday, ctx({ entries: qaza })).ruling).toBe("permitted");
  });
});

describe.concurrent("classifyFastDay — Sha'ban", () => {
  const lateShaban = findInMonth(8, 3, (key) => toHijri(key).day >= 16 && toHijri(key).day <= 26);

  it("Shafi'i: after mid-Sha'ban is not permitted (relied-upon view) with a madhhab note", () => {
    const c = classifyFastDay(lateShaban, ctx({ school: "shafii" }));
    expect(c.ruling).toBe("prohibited");
    expect(c.blocking).toBe(false);
    expect(c.reasons).toEqual(["voluntaryFasting.reason.afterMidShabanShafii"]);
    expect(c.madhhabNoteId).toBe("fasting.afterMidShaban");
  });

  it("other schools: recommended (most of Sha'ban), no restriction", () => {
    for (const school of ["hanafi", "maliki", "hanbali"] as const) {
      const c = classifyFastDay(lateShaban, ctx({ school }));
      expect(c.ruling).toBe("recommended");
      expect(c.madhhabNoteId).toBeUndefined();
    }
  });

  it("all views: keeps the ruling but labels the Shafi'i restriction", () => {
    const c = classifyFastDay(lateShaban, ctx({ school: null }));
    expect(c.ruling).toBe("recommended");
    expect(c.reasons).toContain("voluntaryFasting.reason.afterMidShabanNote");
    expect(c.madhhabNoteId).toBe("fasting.afterMidShaban");
  });

  it("Shafi'i exceptions: habit, qaza, or joined to the first half", () => {
    const monday = findInMonth(8, 1, (key) => toHijri(key).day >= 16 && toHijri(key).day <= 26);
    expect(classifyFastDay(monday, ctx({ school: "shafii" })).ruling).toBe("recommended");

    const qaza = { [lateShaban]: entry("intended", { asQaza: true }) };
    expect(classifyFastDay(lateShaban, ctx({ school: "shafii", entries: qaza })).ruling).not.toBe(
      "prohibited",
    );

    // A non-habitual day after the 16th, joined day by day to the 15th.
    const target = [17, 18, 19, 20, 21]
      .map((d) => dateOf(8, d))
      .find((key) => ![1, 4].includes(weekdayOfDateKey(key))) as string;
    const joined: Record<string, ReturnType<typeof entry>> = {};
    for (let key = dateOf(8, 15); key < target; key = addDays(key, 1)) {
      joined[key] = entry("fasted");
    }
    expect(classifyFastDay(target, ctx({ school: "shafii", entries: joined })).ruling).not.toBe(
      "prohibited",
    );
    const gap = { [dateOf(8, 15)]: entry("fasted") };
    expect(classifyFastDay(target, ctx({ school: "shafii", entries: gap })).ruling).toBe(
      "prohibited",
    );
  });

  it("one or two days before Ramadan are disliked unless habitual", () => {
    const d28 = dateOf(8, 28);
    const d29 = dateOf(8, 29);
    for (const key of [d28, d29]) {
      const c = classifyFastDay(key, ctx());
      if (c.kinds.includes("monday") || c.kinds.includes("thursday")) {
        expect(c.ruling).toBe("recommended");
      } else {
        expect(c.ruling).toBe("disliked");
        expect(c.reasons).toEqual(["voluntaryFasting.reason.beforeRamadan"]);
      }
    }
    expect(classifyFastDay(dateOf(8, 20), ctx()).ruling).toBe("recommended");
  });

  it("30 Sha'ban (day of doubt) is disliked unless it is a qaza fast", () => {
    const d30 = dateOf(8, 30, toHijriLong);
    const base = { toHijri: toHijriLong, school: "hanafi" as const };
    expect(classifyFastDay(d30, base).reasons).toEqual(["voluntaryFasting.reason.dayOfDoubt"]);
    const qaza = { [d30]: entry("intended", { asQaza: true }) };
    expect(classifyFastDay(d30, { ...base, entries: qaza }).ruling).not.toBe("disliked");
  });
});

describe.concurrent("classifyFastRange — a full Hijri year", () => {
  const days = classifyFastRange(ANCHOR, addDays(ANCHOR, 353), ctx());

  it("covers 354 days with exactly 5 prohibited (Eids + Tashriq) and 30 of Ramadan", () => {
    expect(days).toHaveLength(354);
    expect(days.filter((d) => d.classification.blocking)).toHaveLength(5);
    expect(days.filter((d) => d.classification.isRamadan)).toHaveLength(30);
  });

  it("finds each seasonal kind exactly where expected", () => {
    const count = (kind: string) =>
      days.filter((d) => d.classification.kinds.includes(kind as never)).length;
    expect(count("arafah")).toBe(1);
    expect(count("tasua")).toBe(1);
    expect(count("ashura")).toBe(1);
    expect(count("muharram")).toBe(30);
    expect(count("shaban")).toBe(29);
    expect(count("dhul_hijjah_nine")).toBe(9);
    expect(count("shawwal_six")).toBe(28);
    // 12 months × 3, minus Ramadan's and the 13th of Dhul-Hijjah (Tashriq).
    expect(count("white_day")).toBe(12 * 3 - 3 - 1);
  });
});

describe.concurrent("progress counters", () => {
  it("Shawwal six counts kept fasts from the 2nd across month boundaries", () => {
    const entries = {
      [dateOf(10, 1)]: entry("fasted"), // Eid — never counts
      [dateOf(10, 2)]: entry("fasted"),
      [dateOf(10, 29)]: entry("fasted"),
      [dateOf(10, 3)]: entry("intended"),
      [dateOf(10, 4)]: entry("fasted", { deleted: true }),
      [dateOf(11, 1)]: entry("fasted"),
    };
    expect(shawwalSixCount(entries, toHijri, 1448)).toBe(2);
    expect(shawwalSixCount(entries, toHijri, 1449)).toBe(0);
  });

  it("Dhul-Hijjah counts days 1–9 only", () => {
    const entries = {
      [dateOf(12, 1)]: entry("fasted"),
      [dateOf(12, 9)]: entry("fasted"),
      [dateOf(12, 10)]: entry("fasted"),
    };
    expect(dhulHijjahNineCount(entries, toHijri, 1448)).toBe(2);
  });

  it("Ashura asks for the 9th or the 11th", () => {
    const ashura = dateOf(1, 10);
    expect(needsAshuraCompanion(ashura, { [ashura]: entry("intended") })).toBe(true);
    expect(
      needsAshuraCompanion(ashura, {
        [ashura]: entry("fasted"),
        [dateOf(1, 9)]: entry("fasted"),
      }),
    ).toBe(false);
    expect(
      needsAshuraCompanion(ashura, {
        [ashura]: entry("fasted"),
        [dateOf(1, 11)]: entry("intended"),
      }),
    ).toBe(false);
    expect(needsAshuraCompanion(ashura, {})).toBe(false);
  });

  it("matchesEnabledKinds follows the user's kinds", () => {
    const muharram = classifyFastDay(dateOf(1, 20), ctx());
    if (!muharram.kinds.includes("monday") && !muharram.kinds.includes("thursday")) {
      expect(matchesEnabledKinds(muharram, DEFAULT_VOLUNTARY_FASTING_PREFS)).toBe(false);
    }
    const arafah = classifyFastDay(dateOf(12, 9), ctx());
    expect(matchesEnabledKinds(arafah, DEFAULT_VOLUNTARY_FASTING_PREFS)).toBe(
      arafah.ruling === "recommended",
    );
    const eid = classifyFastDay(dateOf(10, 1), ctx());
    expect(matchesEnabledKinds(eid, DEFAULT_VOLUNTARY_FASTING_PREFS)).toBe(false);
  });
});

describe.concurrent("sync merge", () => {
  it("per-date last-write-wins, ties keep local, tombstones propagate", () => {
    const local = {
      "2026-07-01": entry("fasted", { updatedAt: "2026-07-01T10:00:00.000Z" }),
      "2026-07-02": entry("intended", { updatedAt: "2026-07-02T10:00:00.000Z" }),
      "2026-07-03": entry("fasted", { updatedAt: "2026-07-03T10:00:00.000Z" }),
    };
    const remote = {
      "2026-07-01": entry("broken", { updatedAt: "2026-07-01T09:00:00.000Z" }),
      "2026-07-02": entry("intended", { deleted: true, updatedAt: "2026-07-02T11:00:00.000Z" }),
      "2026-07-03": entry("broken", { updatedAt: "2026-07-03T10:00:00.000Z" }),
      "2026-07-04": entry("fasted", { updatedAt: "2026-07-04T10:00:00.000Z" }),
    };
    const merged = mergeVoluntaryFasting(local, remote);
    expect(merged["2026-07-01"]?.status).toBe("fasted");
    expect(merged["2026-07-02"]?.deleted).toBe(true);
    expect(merged["2026-07-03"]?.status).toBe("fasted");
    expect(merged["2026-07-04"]?.status).toBe("fasted");
    // Converges from either side.
    expect(mergeVoluntaryFasting(remote, local)["2026-07-02"]?.deleted).toBe(true);
  });

  it("drops malformed rows", () => {
    expect(
      asVoluntaryFastingMap({
        bad: entry(),
        "2026-07-01": { status: "nope", updatedAt: "x" },
        "2026-07-02": { status: "fasted" },
        "2026-07-03": entry("fasted", { asQaza: true }),
      }),
    ).toEqual({ "2026-07-03": entry("fasted", { asQaza: true }) });
    expect(asVoluntaryFastingMap(null)).toEqual({});
    expect(asVoluntaryFastingMap([1])).toEqual({});
  });
});
