import {
  focusInstant as at,
  makeFocusDay as day,
  makeFocusPrefs as prefs,
} from "@/test-support/focus-lock";

import {
  activeWindowAt,
  focusSkipReason,
  MAX_WINDOWS,
  mergeWindows,
  nextWindowAfter,
  planFocusWindows,
  testWindow,
} from "./plan";
import { effectiveWeekendDays, regionWeekendDays } from "./weekend";

const THU = "2026-11-26";
const FRI = "2026-11-27";
const SAT = "2026-11-28";
const MIDNIGHT_THU = at(THU, "00:00");

const ids = (ws: { id: string }[]) => ws.map((w) => w.id);

describe("planFocusWindows", () => {
  it("plans the five fard for today and tomorrow, adhan + 0, 20 minutes", () => {
    const windows = planFocusWindows({
      prefs: prefs(),
      days: [day(THU, 4), day(FRI, 5)],
      now: MIDNIGHT_THU,
    });
    expect(ids(windows)).toEqual([
      `${THU}:fajr`,
      `${THU}:dhuhr`,
      `${THU}:asr`,
      `${THU}:maghrib`,
      `${THU}:isha`,
      `${FRI}:fajr`,
      // Friday: Jumu'ah replaces Dhuhr.
      `${FRI}:jumuah`,
      `${FRI}:asr`,
      `${FRI}:maghrib`,
      `${FRI}:isha`,
    ]);
    const dhuhr = windows[1];
    expect(dhuhr?.start).toEqual(at(THU, "12:30"));
    expect(dhuhr?.end).toEqual(at(THU, "12:50"));
    expect(dhuhr?.anchor).toBe("adhan");
  });

  it("returns nothing while disabled", () => {
    expect(
      planFocusWindows({
        prefs: prefs({ enabled: false }),
        days: [day(THU, 4)],
        now: MIDNIGHT_THU,
      }),
    ).toEqual([]);
  });

  it("keeps the Dhuhr window on Friday when Jumu'ah isn't chosen", () => {
    const windows = planFocusWindows({
      prefs: prefs({ prayers: ["dhuhr"] }),
      days: [day(FRI, 5)],
      now: at(FRI, "00:00"),
    });
    expect(ids(windows)).toEqual([`${FRI}:dhuhr`]);
  });

  it("skips Jumu'ah on non-Fridays", () => {
    const windows = planFocusWindows({
      prefs: prefs({ prayers: ["jumuah"] }),
      days: [day(THU, 4), day(SAT, 6)],
      now: MIDNIGHT_THU,
    });
    expect(windows).toEqual([]);
  });

  it("skips a salah already logged completed (Jumu'ah reads Dhuhr)", () => {
    const windows = planFocusWindows({
      prefs: prefs({ prayers: ["fajr", "dhuhr", "jumuah"] }),
      days: [day(FRI, 5)],
      now: at(FRI, "00:00"),
      completed: { [FRI]: { fajr: true, dhuhr: true } },
    });
    expect(windows).toEqual([]);
  });

  it("pauses every window during an excused period unless the user opted out", () => {
    const input = { days: [day(THU, 4)], now: MIDNIGHT_THU, excused: true };
    expect(planFocusWindows({ ...input, prefs: prefs() })).toEqual([]);
    expect(planFocusWindows({ ...input, prefs: prefs({ pauseWhileExcused: false }) })).toHaveLength(
      5,
    );
  });

  it("skips quiet dates", () => {
    expect(
      planFocusWindows({
        prefs: prefs({ schedule: { quietDates: [THU] } }),
        days: [day(THU, 4)],
        now: MIDNIGHT_THU,
      }),
    ).toEqual([]);
  });

  describe("weekdays only (D37: the user's own weekend)", () => {
    const SUN = "2026-11-29";
    const week = [day(THU, 4), day(FRI, 5), day(SAT, 6), day(SUN, 0)];
    const plannedDates = (input: Partial<Parameters<typeof planFocusWindows>[0]>) => [
      ...new Set(
        planFocusWindows({
          prefs: prefs({ prayers: ["asr"], schedule: { weekdaysOnly: true } }),
          days: week,
          now: MIDNIGHT_THU,
          ...input,
        }).map((w) => w.date),
      ),
    ];

    it("skips Saturday and Sunday by default", () => {
      expect(plannedDates({})).toEqual([THU, FRI]);
    });

    it("skips the region's weekend (Gulf: Friday + Saturday; Iran: Friday)", () => {
      expect(plannedDates({ weekendDays: regionWeekendDays({ country: "SA" }) })).toEqual([
        THU,
        SUN,
      ]);
      expect(
        plannedDates({ weekendDays: regionWeekendDays({ deviceTimeZone: "Asia/Tehran" }) }),
      ).toEqual([THU, SAT, SUN]);
      expect(plannedDates({ weekendDays: regionWeekendDays({ country: "Germany" }) })).toEqual([
        THU,
        FRI,
      ]);
    });

    it("uses the user's own days when set, and nothing is skipped while the toggle is off", () => {
      const own = prefs({ prayers: ["asr"], schedule: { weekdaysOnly: true, weekendDays: [4] } });
      expect(plannedDates({ prefs: own })).toEqual([FRI, SAT, SUN]);
      const off = prefs({ prayers: ["asr"], schedule: { weekendDays: [4, 5, 6, 0] } });
      expect(plannedDates({ prefs: off })).toEqual([THU, FRI, SAT, SUN]);
    });

    it("never skips a Jumu'ah window the user turned on, even on a Friday weekend (L5)", () => {
      const gulf = regionWeekendDays({ country: "SA" });
      const windows = planFocusWindows({
        prefs: prefs({ prayers: ["dhuhr", "jumuah", "asr"], schedule: { weekdaysOnly: true } }),
        days: [day(THU, 4), day(FRI, 5), day(SAT, 6)],
        now: MIDNIGHT_THU,
        weekendDays: gulf,
      });
      // Friday's daily windows (Asr) still follow the weekend; Jumu'ah locks.
      expect(ids(windows)).toEqual([`${THU}:dhuhr`, `${THU}:asr`, `${FRI}:jumuah`]);
      expect(
        focusSkipReason(
          "jumuah",
          { date: FRI, weekday: 5 },
          {
            prefs: prefs({ schedule: { weekdaysOnly: true } }),
            weekendDays: gulf,
          },
        ),
      ).toBeNull();
    });

    it("resolves the caller's days through effectiveWeekendDays (choice beats region)", () => {
      const own = prefs({ schedule: { weekdaysOnly: true, weekendDays: [0] } });
      expect(effectiveWeekendDays(own.schedule, { country: "Saudi Arabia" })).toEqual([0]);
      expect(effectiveWeekendDays({}, { country: "Saudi Arabia" })).toEqual([5, 6]);
    });
  });

  describe("Jumu'ah window (D38)", () => {
    it("runs 60 minutes by default, separately from the daily length", () => {
      const windows = planFocusWindows({
        prefs: prefs({ prayers: ["dhuhr", "jumuah"], durationMin: 15 }),
        days: [day(THU, 4), day(FRI, 5)],
        now: MIDNIGHT_THU,
      });
      expect(windows.map((w) => [w.id, w.start, w.end])).toEqual([
        [`${THU}:dhuhr`, at(THU, "12:30"), at(THU, "12:45")],
        [`${FRI}:jumuah`, at(FRI, "12:30"), at(FRI, "13:30")],
      ]);
    });

    it("starts from the masjid's Jumu'ah time when known, even with the adhan anchor", () => {
      const [w] = planFocusWindows({
        prefs: prefs({ prayers: ["jumuah"], jumuahDurationMin: 90 }),
        days: [day(FRI, 5, {}, { dhuhr: at(FRI, "13:15"), jumuah: at(FRI, "13:15") })],
        now: at(FRI, "00:00"),
      });
      expect(w).toMatchObject({
        id: `${FRI}:jumuah`,
        anchor: "iqamah",
        start: at(FRI, "13:15"),
        end: at(FRI, "14:45"),
      });
    });

    it("applies the start offset to the Jumu'ah window too", () => {
      const [w] = planFocusWindows({
        prefs: prefs({
          prayers: ["jumuah"],
          start: { anchor: "adhan", offsetMin: -10 },
          jumuahDurationMin: 45,
        }),
        days: [day(FRI, 5)],
        now: at(FRI, "00:00"),
      });
      expect(w?.start).toEqual(at(FRI, "12:20"));
      expect(w?.end).toEqual(at(FRI, "13:05"));
    });
  });

  it("applies the start offset and duration", () => {
    const [w] = planFocusWindows({
      prefs: prefs({
        prayers: ["asr"],
        start: { anchor: "adhan", offsetMin: 10 },
        durationMin: 30,
      }),
      days: [day(THU, 4)],
      now: MIDNIGHT_THU,
    });
    expect(w?.start).toEqual(at(THU, "15:55"));
    expect(w?.end).toEqual(at(THU, "16:25"));
  });

  it("never starts before a late salah reminder (prayerReminderOffsets)", () => {
    const [w] = planFocusWindows({
      prefs: prefs({ prayers: ["asr"] }),
      days: [day(THU, 4)],
      now: MIDNIGHT_THU,
      reminderOffsets: { asr: 10 },
    });
    expect(w?.start).toEqual(at(THU, "15:55"));
    // An earlier reminder doesn't pull the lock forward.
    const [early] = planFocusWindows({
      prefs: prefs({ prayers: ["asr"] }),
      days: [day(THU, 4)],
      now: MIDNIGHT_THU,
      reminderOffsets: { asr: -15 },
    });
    expect(early?.start).toEqual(at(THU, "15:45"));
  });

  it("caps the Fajr window at sunrise", () => {
    const [w] = planFocusWindows({
      prefs: prefs({ prayers: ["fajr"], durationMin: 60 }),
      days: [day(THU, 4, { fajr: "06:00", sunrise: "06:25" })],
      now: MIDNIGHT_THU,
    });
    expect(w?.end).toEqual(at(THU, "06:25"));
  });

  it("never locks Fajr after sunrise, whatever pushes the start (L4)", () => {
    const base = { days: [day(THU, 4, { fajr: "06:00", sunrise: "06:25" })], now: MIDNIGHT_THU };
    // A late reminder (+30) moves the start past sunrise → no window.
    expect(
      planFocusWindows({
        ...base,
        prefs: prefs({ prayers: ["fajr"] }),
        reminderOffsets: { fajr: 30 },
      }),
    ).toEqual([]);
    // An iqamah anchor at sunrise → no window.
    expect(
      planFocusWindows({
        prefs: prefs({ prayers: ["fajr"], start: { anchor: "iqamah", offsetMin: 0 } }),
        days: [day(THU, 4, { fajr: "06:00", sunrise: "06:25" }, { fajr: at(THU, "06:25") })],
        now: MIDNIGHT_THU,
      }),
    ).toEqual([]);
    // An out-of-range stored offset is clamped (max +60), and the end is still capped.
    const [w] = planFocusWindows({
      prefs: prefs({ prayers: ["fajr"], start: { anchor: "adhan", offsetMin: 10 } }),
      days: [day(THU, 4, { fajr: "06:00", sunrise: "06:25" })],
      now: MIDNIGHT_THU,
    });
    expect(w?.start).toEqual(at(THU, "06:10"));
    expect(w?.end).toEqual(at(THU, "06:25"));
    expect(
      planFocusWindows({
        prefs: prefs({ prayers: ["asr"], start: { anchor: "adhan", offsetMin: 500 } }),
        days: [day(THU, 4)],
        now: MIDNIGHT_THU,
      })[0]?.start,
    ).toEqual(at(THU, "16:45"));
  });

  it("anchors to the iqamah when known and falls back to the adhan otherwise", () => {
    const windows = planFocusWindows({
      prefs: prefs({ prayers: ["dhuhr", "asr"], start: { anchor: "iqamah", offsetMin: -5 } }),
      days: [day(THU, 4, {}, { dhuhr: at(THU, "13:00") })],
      now: MIDNIGHT_THU,
    });
    expect(windows.map((w) => [w.id, w.anchor, w.start.toISOString()])).toEqual([
      [`${THU}:dhuhr`, "iqamah", at(THU, "12:55").toISOString()],
      [`${THU}:asr`, "adhan", at(THU, "15:40").toISOString()],
    ]);
  });

  it("merges overlapping windows (high latitude: Maghrib → Isha)", () => {
    const windows = planFocusWindows({
      prefs: prefs({ prayers: ["maghrib", "isha"], durationMin: 40 }),
      days: [day(THU, 4, { maghrib: "21:30", isha: "22:00" })],
      now: MIDNIGHT_THU,
    });
    expect(windows).toHaveLength(1);
    expect(windows[0]).toMatchObject({
      id: `${THU}:maghrib+isha`,
      prayers: ["maghrib", "isha"],
      start: at(THU, "21:30"),
      end: at(THU, "22:40"),
    });
  });

  describe("an unlocked merged window stays unlocked (L3)", () => {
    const input = {
      prefs: prefs({ prayers: ["maghrib", "isha"], durationMin: 40 }),
      days: [day(THU, 4, { maghrib: "21:30", isha: "22:00" })],
      now: at(THU, "21:45"),
    };

    it("doesn't re-arm the Isha part after Maghrib is marked", () => {
      expect(
        planFocusWindows({
          ...input,
          endedIds: [`${THU}:maghrib+isha`],
          completed: { [THU]: { maghrib: true } },
        }),
      ).toEqual([]);
    });

    it("without an unlock, marking Maghrib still leaves the Isha lock", () => {
      expect(ids(planFocusWindows({ ...input, completed: { [THU]: { maghrib: true } } }))).toEqual([
        `${THU}:isha`,
      ]);
    });

    it("an ended single window doesn't swallow a merged one it is only part of", () => {
      expect(ids(planFocusWindows({ ...input, endedIds: [`${THU}:isha`] }))).toEqual([
        `${THU}:maghrib+isha`,
      ]);
    });
  });

  it("skips invalid (polar) times instead of producing NaN windows", () => {
    const d = day(THU, 4);
    d.adhan.isha = new Date(Number.NaN);
    const windows = planFocusWindows({
      prefs: prefs({ prayers: ["isha"] }),
      days: [d],
      now: MIDNIGHT_THU,
    });
    expect(windows).toEqual([]);
  });

  it("keeps whole-minute durations across a DST change (absolute instants)", () => {
    // 2026-03-29: Europe moves the clocks forward at 01:00 UTC; the planner only adds minutes.
    const [w] = planFocusWindows({
      prefs: prefs({ prayers: ["fajr"], durationMin: 20 }),
      days: [day("2026-03-29", 0, { fajr: "00:50", sunrise: "05:00" })],
      now: at("2026-03-29", "00:00"),
    });
    expect((w?.end.getTime() ?? 0) - (w?.start.getTime() ?? 0)).toBe(20 * 60_000);
  });

  it("drops past and ended windows but keeps the running one", () => {
    const windows = planFocusWindows({
      prefs: prefs({ prayers: ["fajr", "dhuhr", "asr"] }),
      days: [day(THU, 4)],
      now: at(THU, "12:40"),
      endedIds: [`${THU}:asr`],
    });
    expect(ids(windows)).toEqual([`${THU}:dhuhr`]);
  });

  it(`never hands more than ${MAX_WINDOWS} windows to the native scheduler`, () => {
    const days = [day(THU, 4), day(FRI, 5), day(SAT, 6)];
    expect(planFocusWindows({ prefs: prefs(), days, now: MIDNIGHT_THU })).toHaveLength(MAX_WINDOWS);
  });
});

describe("focusSkipReason", () => {
  it("names the first rule that skips a window", () => {
    const base = { prefs: prefs() };
    expect(focusSkipReason("jumuah", { date: THU, weekday: 4 }, base)).toBe("notFriday");
    expect(focusSkipReason("dhuhr", { date: FRI, weekday: 5 }, base)).toBe("disabled");
    expect(focusSkipReason("asr", { date: THU, weekday: 4 }, { ...base, excused: true })).toBe(
      "excused",
    );
    expect(focusSkipReason("asr", { date: THU, weekday: 4 }, base)).toBeNull();
  });
});

describe("window helpers", () => {
  const windows = planFocusWindows({
    prefs: prefs({ prayers: ["dhuhr", "asr"] }),
    days: [day(THU, 4)],
    now: MIDNIGHT_THU,
  });

  it("finds the active and the next window", () => {
    expect(activeWindowAt(windows, at(THU, "12:35"))?.id).toBe(`${THU}:dhuhr`);
    expect(activeWindowAt(windows, at(THU, "12:50"))).toBeNull();
    expect(nextWindowAfter(windows, at(THU, "12:35"))?.id).toBe(`${THU}:asr`);
  });

  it("mergeWindows leaves separate windows alone", () => {
    expect(mergeWindows(windows)).toHaveLength(2);
  });

  it("builds a one-minute test window", () => {
    const w = testWindow(at(THU, "10:00"));
    expect(w.end.getTime() - w.start.getTime()).toBe(60_000);
    expect(w.prayers).toEqual([]);
  });
});
