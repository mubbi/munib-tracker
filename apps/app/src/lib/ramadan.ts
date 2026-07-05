import { gregorianToHijri, hijriMonthLength } from "./hijri";
import { locationCalcExtras, type StoredLocation } from "./location";
import { computePrayerTimes } from "./prayer-times";
import { prayerDayAnchor } from "./time";

/** Ramadan is the 9th month of the Hijri calendar. */
export const RAMADAN_MONTH = 9;

export interface RamadanInfo {
  isRamadan: boolean;
  /** Day of Ramadan (1..30) when `isRamadan`, else 0. */
  day: number;
  /** Days in this Ramadan (29 or 30). */
  totalDays: number;
  hijriYear: number;
  /** Suhoor ends at Fajr. */
  suhoorEnds: Date;
  /** Iftar begins at Maghrib. */
  iftar: Date;
}

/**
 * Ramadan status + today's suhoor (Fajr) / iftar (Maghrib) for the stored
 * location, computed on-device from the Hijri date and the `adhan` engine (no
 * network). `isRamadan` drives the home Ramadan card; the fasting times drive the
 * Ramadan screen countdown.
 */
export function getRamadanInfo(location: StoredLocation, now: Date = new Date()): RamadanInfo {
  const hijri = gregorianToHijri(now, location.timeZone);
  const isRamadan = hijri.month === RAMADAN_MONTH;
  const anchor = prayerDayAnchor(now, location.timeZone);
  const times = computePrayerTimes(
    { latitude: location.latitude, longitude: location.longitude },
    anchor,
    location.method,
    location.madhab,
    locationCalcExtras(location),
  );

  return {
    isRamadan,
    day: isRamadan ? hijri.day : 0,
    totalDays: hijriMonthLength(hijri.year, RAMADAN_MONTH),
    hijriYear: hijri.year,
    suhoorEnds: times.fajr,
    iftar: times.maghrib,
  };
}
