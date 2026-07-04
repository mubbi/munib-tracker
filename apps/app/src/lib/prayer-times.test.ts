import {
  buildDailySchedule,
  buildPrayerTimeMap,
  type Coords,
  computePrayerTimes,
  duhaWindow,
  formatPrayerTime,
  ishraqTime,
  lastThirdOfNight,
  nextPrayer,
  nextScheduleEntry,
  PRAYER_SLOT_ORDER,
  prayerSlots,
  tahajjudTime,
  witrTime,
} from "@/lib/prayer-times";

const MAKKAH: Coords = { latitude: 21.4225, longitude: 39.8262 };

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
    const now = new Date(2025, 5, 15, 2, 0, 0);
    const next = nextPrayer(MAKKAH, now);
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
    const now = new Date(2025, 5, 15, 2, 0, 0);
    expect(nextPrayer(MAKKAH, now).currentIndex).toBe(PRAYER_SLOT_ORDER.indexOf("isha"));
  });

  it("stays on Isha through the late night after it begins", () => {
    const now = new Date(2025, 5, 15, 23, 30, 0);
    expect(nextPrayer(MAKKAH, now).currentIndex).toBe(PRAYER_SLOT_ORDER.indexOf("isha"));
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
