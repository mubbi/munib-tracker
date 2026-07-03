import {
  type Coords,
  computePrayerTimes,
  formatPrayerTime,
  nextPrayer,
  PRAYER_SLOT_ORDER,
  prayerSlots,
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
    expect(formatPrayerTime(new Date(2025, 5, 15, 5, 7, 0))).toBe("05:07");
  });
});
