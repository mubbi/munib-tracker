import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type { PrayerStatus } from "@munib-tracker/shared/types";

import type { StoredLocation } from "@/lib/location";
import { computePrayerTimes, nextPrayer, PRAYER_SLOT_ORDER, prayerSlots } from "@/lib/prayer-times";

import { resolveMarkableObligatoryPrayer } from "./resolve-markable-prayer";

const MAKKAH: StoredLocation = {
  latitude: 21.4225,
  longitude: 39.8262,
  label: "Makkah",
  source: "manual",
  method: "MuslimWorldLeague",
  madhab: "shafi",
  timeZone: "Asia/Riyadh",
};

const MAKKAH_DAY = new Date(Date.UTC(2025, 5, 15));

function emptyStatus(): Record<string, PrayerStatus> {
  return Object.fromEntries(OBLIGATORY_PRAYERS.map((id) => [id, "pending" as PrayerStatus]));
}

describe("resolveMarkableObligatoryPrayer", () => {
  it("marks Maghrib during its window, not Isha (countdown id)", () => {
    const slots = prayerSlots(computePrayerTimes(MAKKAH, MAKKAH_DAY));
    const maghribIdx = PRAYER_SLOT_ORDER.indexOf("maghrib");
    const now = new Date(slots[maghribIdx].date.getTime() + 60_000);
    const next = nextPrayer(MAKKAH, now, MAKKAH.method, MAKKAH.madhab, MAKKAH.timeZone);
    expect(next.id).toBe("isha");
    expect(next.currentIndex).toBe(maghribIdx);

    const resolved = resolveMarkableObligatoryPrayer(MAKKAH, now, emptyStatus());
    expect(resolved).toBe("maghrib");
  });

  it("skips sunrise and resolves fajr during sunrise window", () => {
    const slots = prayerSlots(computePrayerTimes(MAKKAH, MAKKAH_DAY));
    const sunriseIdx = PRAYER_SLOT_ORDER.indexOf("sunrise");
    const now = new Date(slots[sunriseIdx].date.getTime() + 60_000);
    const resolved = resolveMarkableObligatoryPrayer(MAKKAH, now, emptyStatus());
    expect(resolved).toBe("fajr");
  });

  it("returns null when all obligatory prayers are completed", () => {
    const status = Object.fromEntries(
      OBLIGATORY_PRAYERS.map((id) => [id, "completed" as PrayerStatus]),
    );
    const now = new Date(MAKKAH_DAY.getTime() + 12 * 60 * 60_000);
    expect(resolveMarkableObligatoryPrayer(MAKKAH, now, status)).toBeNull();
  });

  it("returns next pending fard when the active window prayer is already done", () => {
    const slots = prayerSlots(computePrayerTimes(MAKKAH, MAKKAH_DAY));
    const dhuhrIdx = PRAYER_SLOT_ORDER.indexOf("dhuhr");
    const now = new Date(slots[dhuhrIdx].date.getTime() + 60_000);
    const status = emptyStatus();
    status.dhuhr = "completed";
    expect(resolveMarkableObligatoryPrayer(MAKKAH, now, status)).toBe("asr");
  });
});
