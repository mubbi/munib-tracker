import {
  buildDailySchedule,
  buildPrayerTimeMap,
  type Coords,
  computeNightDividers,
  computePrayerTimes,
  detectNightPrayerWallClock,
  duhaWindow,
  formatPrayerTime,
  ishraqTime,
  ishraqWindow,
  lastThirdOfNight,
  midMorningTime,
  midNightOfNight,
  nextPrayer,
  nextScheduleEntry,
  nightBoundsFromWallClock,
  PRAYER_SLOT_ORDER,
  prayerSlots,
  resolveNightBoundsForNow,
  tahajjudTime,
  witrTime,
  zawalTime,
} from "@/lib/prayer-times";
import { prayerDayAnchor } from "@/lib/time";

const MAKKAH: Coords = { latitude: 21.4225, longitude: 39.8262 };
const NYC: Coords = { latitude: 40.7128, longitude: -74.006 };
/** Makkah shares Arabia Standard Time with Riyadh — use for timezone-stable tests. */
const MAKKAH_TZ = "Asia/Riyadh";
const MAKKAH_TEST_DAY = new Date(Date.UTC(2025, 5, 15));

/** Two hours before Fajr on `day`, as an absolute instant (pass `MAKKAH_TZ` to nextPrayer). */
function makkahPreDawn(day: Date = MAKKAH_TEST_DAY): Date {
  const times = computePrayerTimes(MAKKAH, day);
  return new Date(times.fajr.getTime() - 2 * 60 * 60_000);
}

describe("nextPrayer with manual location timezone", () => {
  it("uses the selected city's calendar day, not the device day", () => {
    // 3:57 PM EDT on Jul 4, 2026 — also midnight Jul 5 in Pakistan (UTC+5).
    const now = new Date("2026-07-04T19:57:00.000Z");
    const next = nextPrayer(NYC, now, "MuslimWorldLeague", "shafi", "America/New_York");

    expect(next.id).toBe("asr");
    expect(next.currentIndex).toBe(PRAYER_SLOT_ORDER.indexOf("dhuhr"));
    expect(next.minutesUntil).toBeGreaterThan(0);
    expect(next.minutesUntil).toBeLessThan(120);
  });
});

describe("prayer calc extras (NF-2.20 / NF-2.21)", () => {
  it("shifts a prayer by its manual masjid offset", () => {
    const base = computePrayerTimes(MAKKAH, MAKKAH_TEST_DAY);
    const shifted = computePrayerTimes(MAKKAH, MAKKAH_TEST_DAY, "MuslimWorldLeague", "shafi", {
      adjustments: { fajr: 5, isha: -3 },
    });
    expect(Math.round((shifted.fajr.getTime() - base.fajr.getTime()) / 60000)).toBe(5);
    expect(Math.round((shifted.isha.getTime() - base.isha.getTime()) / 60000)).toBe(-3);
    // Untouched prayers stay put.
    expect(shifted.dhuhr.getTime()).toBe(base.dhuhr.getTime());
  });

  it("applies a high-latitude rule override where the default differs", () => {
    // At a far-northern latitude in mid-June the twilight rule genuinely changes Isha.
    const OSLO: Coords = { latitude: 59.9139, longitude: 10.7522 };
    const midJune = new Date(Date.UTC(2025, 5, 15));
    const seventh = computePrayerTimes(OSLO, midJune, "MuslimWorldLeague", "shafi", {
      highLatitudeRule: "SeventhOfTheNight",
    });
    const midnight = computePrayerTimes(OSLO, midJune, "MuslimWorldLeague", "shafi", {
      highLatitudeRule: "MiddleOfTheNight",
    });
    expect(Number.isNaN(seventh.isha.getTime())).toBe(false);
    expect(Number.isNaN(midnight.isha.getTime())).toBe(false);
    expect(seventh.isha.getTime()).not.toBe(midnight.isha.getTime());
  });
});

describe("computePrayerTimes / prayerSlots", () => {
  it("returns the six markers in chronological order", () => {
    const times = computePrayerTimes(MAKKAH, new Date(2025, 5, 15));
    const slots = prayerSlots(times);
    expect(slots.map((s) => s.id)).toEqual(PRAYER_SLOT_ORDER);
    for (let i = 1; i < slots.length; i += 1) {
      expect(slots[i].date.getTime()).toBeGreaterThan(slots[i - 1].date.getTime());
    }
  });

  it("respects the asr madhab (Hanafi asr is later than Shafi)", () => {
    const day = new Date(2025, 5, 15);
    const shafi = computePrayerTimes(MAKKAH, day, "MuslimWorldLeague", "shafi").asr;
    const hanafi = computePrayerTimes(MAKKAH, day, "MuslimWorldLeague", "hanafi").asr;
    expect(hanafi.getTime()).toBeGreaterThan(shafi.getTime());
  });
});

describe("nextPrayer", () => {
  it("points at Fajr in the pre-dawn hours", () => {
    const now = makkahPreDawn();
    const next = nextPrayer(MAKKAH, now, "MuslimWorldLeague", "shafi", MAKKAH_TZ);
    expect(next.id).toBe("fajr");
    expect(next.activeIndex).toBe(0);
    expect(next.minutesUntil).toBeGreaterThan(0);
  });

  it("rolls over to tomorrow's Fajr after Isha", () => {
    const now = new Date(2025, 5, 15, 23, 30, 0);
    const next = nextPrayer(MAKKAH, now);
    expect(next.id).toBe("fajr");
    expect(next.activeIndex).toBe(-1);
    expect(next.date.getTime()).toBeGreaterThan(now.getTime());
  });

  it("never reports a negative countdown", () => {
    const next = nextPrayer(MAKKAH, new Date(2025, 5, 15, 12, 0, 0));
    expect(next.minutesUntil).toBeGreaterThanOrEqual(0);
  });
});

describe("nextPrayer currentIndex", () => {
  const day = new Date(2025, 5, 15);
  const slots = prayerSlots(computePrayerTimes(MAKKAH, day));

  it("keeps the just-started prayer active while the next one is still far off", () => {
    // One minute after Maghrib begins: Maghrib stays highlighted, not Isha.
    const maghribIdx = PRAYER_SLOT_ORDER.indexOf("maghrib");
    const now = new Date(slots[maghribIdx].date.getTime() + 60_000);
    const next = nextPrayer(MAKKAH, now);
    expect(next.currentIndex).toBe(maghribIdx);
    expect(next.id).toBe("isha"); // countdown still targets the upcoming prayer
  });

  it("advances the highlight only once the next marker actually arrives", () => {
    const dhuhrIdx = PRAYER_SLOT_ORDER.indexOf("dhuhr");
    const asrIdx = PRAYER_SLOT_ORDER.indexOf("asr");
    const justBeforeAsr = new Date(slots[asrIdx].date.getTime() - 60_000);
    const atAsr = new Date(slots[asrIdx].date.getTime());
    expect(nextPrayer(MAKKAH, justBeforeAsr).currentIndex).toBe(dhuhrIdx);
    expect(nextPrayer(MAKKAH, atAsr).currentIndex).toBe(asrIdx);
  });

  it("treats the pre-dawn hours as the previous night's Isha", () => {
    const now = makkahPreDawn();
    expect(nextPrayer(MAKKAH, now, "MuslimWorldLeague", "shafi", MAKKAH_TZ).currentIndex).toBe(
      PRAYER_SLOT_ORDER.indexOf("isha"),
    );
  });

  it("stays on Isha through the late night after it begins", () => {
    const now = new Date(2025, 5, 15, 23, 30, 0);
    expect(nextPrayer(MAKKAH, now).currentIndex).toBe(PRAYER_SLOT_ORDER.indexOf("isha"));
  });
});

describe("night dividers", () => {
  const anchor = new Date(2026, 6, 14, 12, 0, 0);

  it("matches the public last-third calculator example", () => {
    const { maghribAt, fajrAt } = nightBoundsFromWallClock(
      { hour: 19, minute: 23 },
      { hour: 4, minute: 25 },
      anchor,
    );
    const dividers = computeNightDividers(maghribAt, fajrAt);

    expect(dividers.nightDurationMinutes).toBe(542);
    expect(formatPrayerTime(dividers.midNight, "12")).toMatch(/11:54 PM/);
    expect(formatPrayerTime(dividers.lastThird, "12")).toMatch(/1:24 AM/);
    expect(midNightOfNight(maghribAt, fajrAt).getTime()).toBe(dividers.midNight.getTime());
    expect(lastThirdOfNight(maghribAt, fajrAt).getTime()).toBe(dividers.lastThird.getTime());
  });

  it("keeps same-day Fajr when its wall clock is after Maghrib (24h inputs)", () => {
    // Regression: always rolling Fajr to tomorrow yielded 31h 57m for 08:24 → 16:21.
    const { maghribAt, fajrAt } = nightBoundsFromWallClock(
      { hour: 8, minute: 24 },
      { hour: 16, minute: 21 },
      anchor,
    );
    const dividers = computeNightDividers(maghribAt, fajrAt);
    expect(dividers.nightDurationMinutes).toBe(7 * 60 + 57);
    expect(fajrAt.getDate()).toBe(maghribAt.getDate());
    expect(formatPrayerTime(dividers.midNight, "24")).toBe("12:22");
    expect(formatPrayerTime(dividers.lastThird, "24")).toBe("13:42");
  });

  it("still rolls Fajr to the next day for overnight Maghrib → Fajr", () => {
    const { maghribAt, fajrAt } = nightBoundsFromWallClock(
      { hour: 20, minute: 24 },
      { hour: 4, minute: 21 },
      anchor,
    );
    const dividers = computeNightDividers(maghribAt, fajrAt);
    expect(dividers.nightDurationMinutes).toBe(7 * 60 + 57);
    expect(fajrAt.getDate()).toBe(maghribAt.getDate() + 1);
    expect(formatPrayerTime(dividers.midNight, "24")).toBe("00:22");
    expect(formatPrayerTime(dividers.lastThird, "12")).toMatch(/1:42 AM/);
  });

  it("detects wall-clock Maghrib and Fajr for the upcoming night", () => {
    const now = new Date(2025, 5, 15, 12, 0, 0);
    const detected = detectNightPrayerWallClock(MAKKAH, now);
    const { maghribAt, fajrAt } = nightBoundsFromWallClock(
      detected.maghrib,
      detected.fajr,
      prayerDayAnchor(now),
    );
    const dividers = computeNightDividers(maghribAt, fajrAt);
    expect(dividers.lastThird.getTime()).toBeGreaterThan(maghribAt.getTime());
    expect(dividers.lastThird.getTime()).toBeLessThan(fajrAt.getTime());
  });

  it("resolves the overnight window before Fajr", () => {
    const now = new Date(2026, 6, 15, 2, 0, 0);
    const bounds = resolveNightBoundsForNow({ hour: 19, minute: 23 }, { hour: 4, minute: 25 }, now);
    expect(bounds).toBeDefined();
    expect(bounds?.maghribAt.getDate()).toBe(14);
    expect(bounds?.fajrAt.getDate()).toBe(15);
    expect(bounds?.fajrAt.getTime()).toBeGreaterThan(now.getTime());
  });

  it("resolves the upcoming night after Fajr", () => {
    const now = new Date(2026, 6, 15, 12, 0, 0);
    const bounds = resolveNightBoundsForNow({ hour: 19, minute: 23 }, { hour: 4, minute: 25 }, now);
    expect(bounds).toBeDefined();
    expect(bounds?.maghribAt.getDate()).toBe(15);
    expect(bounds?.fajrAt.getDate()).toBe(16);
  });
});

describe("formatPrayerTime", () => {
  it("formats as zero-padded HH:mm in 24-hour mode", () => {
    expect(formatPrayerTime(new Date(2025, 5, 15, 5, 7, 0), "24")).toBe("05:07");
  });

  it("formats with AM/PM in 12-hour mode", () => {
    expect(formatPrayerTime(new Date(2025, 5, 15, 14, 30, 0), "12")).toMatch(/2:30 PM/);
  });
});

describe("sunnah prayer times", () => {
  const day = new Date(2025, 5, 15);
  const times = computePrayerTimes(MAKKAH, day);

  it("places Ishraq after sunrise", () => {
    expect(ishraqTime(times.sunrise).getTime()).toBeGreaterThan(times.sunrise.getTime());
  });

  it("ends Ishraq at mid-morning and starts Duha there until zawal", () => {
    const ishraq = ishraqWindow(times.sunrise, times.dhuhr);
    const duha = duhaWindow(times.sunrise, times.dhuhr);
    const midMorning = midMorningTime(times.sunrise, times.dhuhr);
    const zawal = zawalTime(times.dhuhr);

    expect(ishraq.start.getTime()).toBe(ishraqTime(times.sunrise).getTime());
    expect(ishraq.end.getTime()).toBe(midMorning.getTime());
    expect(duha.start.getTime()).toBe(midMorning.getTime());
    expect(duha.end.getTime()).toBe(zawal.getTime());
    expect(duha.recommended.getTime()).toBeGreaterThan(duha.start.getTime());
    expect(duha.recommended.getTime()).toBeLessThan(duha.end.getTime());
  });

  it("places Duha between Ishraq and Dhuhr", () => {
    const duha = duhaWindow(times.sunrise, times.dhuhr);
    expect(duha.start.getTime()).toBeGreaterThan(times.sunrise.getTime());
    expect(duha.end.getTime()).toBeLessThan(times.dhuhr.getTime());
  });

  it("places Witr after Isha", () => {
    expect(witrTime(times.isha).getTime()).toBeGreaterThan(times.isha.getTime());
  });

  it("places Tahajjud in the last third of the night", () => {
    const now = new Date(2025, 5, 15, 12, 0, 0);
    const tomorrow = new Date(day);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = computePrayerTimes(MAKKAH, tomorrow);
    const tahajjud = tahajjudTime(now, times, tomorrowTimes.fajr, times.maghrib);
    const lastThird = lastThirdOfNight(times.maghrib, tomorrowTimes.fajr);
    expect(tahajjud.getTime()).toBe(lastThird.getTime());
  });
});

describe("buildDailySchedule ishraq/duha active windows", () => {
  const day = new Date(2025, 5, 15);
  const times = computePrayerTimes(MAKKAH, day);
  const ishraq = ishraqWindow(times.sunrise, times.dhuhr);
  const duha = duhaWindow(times.sunrise, times.dhuhr);

  function activeAt(now: Date, id: "ishraq" | "duha"): boolean {
    const entry = buildDailySchedule(MAKKAH, now).find((item) => item.id === id);
    return entry?.active ?? false;
  }

  it("marks Ishraq current only during the early forenoon window", () => {
    const duringIshraq = new Date(ishraq.start.getTime() + 5 * 60_000);
    const afterIshraq = new Date(ishraq.end.getTime() + 5 * 60_000);

    expect(activeAt(duringIshraq, "ishraq")).toBe(true);
    expect(activeAt(afterIshraq, "ishraq")).toBe(false);
  });

  it("marks Duha current from mid-morning until zawal, not during Ishraq", () => {
    const duringIshraq = new Date(ishraq.start.getTime() + 5 * 60_000);
    const duringDuha = new Date(duha.start.getTime() + 30 * 60_000);
    const afterDuha = new Date(duha.end.getTime() + 5 * 60_000);

    expect(activeAt(duringIshraq, "duha")).toBe(false);
    expect(activeAt(duringDuha, "duha")).toBe(true);
    expect(activeAt(afterDuha, "duha")).toBe(false);
  });
});

describe("buildDailySchedule", () => {
  it("includes obligatory, optional, and marker entries in order", () => {
    const now = new Date(2025, 5, 15, 12, 0, 0);
    const schedule = buildDailySchedule(MAKKAH, now);
    const ids = schedule.map((entry) => entry.id);
    expect(ids).toContain("fajr");
    expect(ids).toContain("witr");
    expect(ids).toContain("tahajjud");
    expect(ids).toContain("ishraq");
    expect(ids).toContain("duha");
    expect(ids).toContain("tahiyyatul_masjid");
    expect(ids.indexOf("fajr")).toBeLessThan(ids.indexOf("dhuhr"));
    expect(ids.indexOf("isha")).toBeLessThan(ids.indexOf("witr"));
  });
});

describe("nextScheduleEntry", () => {
  const day = new Date(2025, 5, 15);
  const times = computePrayerTimes(MAKKAH, day);

  it("picks the chronologically nearest future entry during Dhuhr, not Tahajjud", () => {
    const now = new Date(times.dhuhr.getTime() + 45 * 60_000);
    const schedule = buildDailySchedule(MAKKAH, now);
    expect(nextScheduleEntry(schedule, now)?.id).toBe("asr");
  });

  it("does not treat Tahajjud as next when Asr is sooner the same day", () => {
    const now = new Date(times.asr.getTime() - 36 * 60_000);
    const schedule = buildDailySchedule(MAKKAH, now);
    const next = nextScheduleEntry(schedule, now);
    expect(next?.id).toBe("asr");
    expect(next?.id).not.toBe("tahajjud");
  });

  it("returns Tahajjud when it is the nearest upcoming marker at night", () => {
    const witrAt = witrTime(times.isha);
    const now = new Date(witrAt.getTime() + 30 * 60_000);
    const schedule = buildDailySchedule(MAKKAH, now);
    expect(nextScheduleEntry(schedule, now)?.id).toBe("tahajjud");
  });
});

describe("buildPrayerTimeMap", () => {
  it("returns computed times for every tracked prayer", () => {
    const now = new Date(2025, 5, 15, 12, 0, 0);
    const map = buildPrayerTimeMap(MAKKAH, now);
    expect(map.fajr).toMatch(/^\d{2}:\d{2}$/);
    expect(map.tahajjud).toMatch(/^\d{2}:\d{2}$/);
    expect(map.tahiyyatul_masjid).toBe("Any time");
  });
});
