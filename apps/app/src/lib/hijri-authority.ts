import type { SightingObserver } from "@/lib/hijri-sighting";
import type { StoredLocation } from "@/lib/location";

/**
 * Which Hijri convention a location follows.
 *
 * Saudi Arabia and the countries that adopt its announcements (or their own
 * pre-computed calendars that track it, like Turkey's Diyanet) use the
 * official Umm al-Qura dates — their civil calendar is fixed by calculation,
 * not by what is visible from the ground that evening. Everywhere else
 * (Pakistan, India, Bangladesh, Oman, Morocco, and mixed regions) months are
 * declared from crescent sighting, which local visibility computation
 * reproduces — e.g. Pakistan's Ruet-e-Hilal dates in Karachi.
 */

/** IANA timezones of regions whose official calendar is Umm al-Qura (or tracks it). */
const UMALQURA_TIMEZONES = new Set([
  "Asia/Riyadh",
  "Asia/Dubai",
  "Asia/Qatar",
  "Asia/Kuwait",
  "Asia/Bahrain",
  "Africa/Cairo",
  "Asia/Amman",
  "Asia/Damascus",
  "Asia/Beirut",
  "Asia/Baghdad",
  "Asia/Aden",
  "Asia/Gaza",
  "Asia/Hebron",
  "Europe/Istanbul",
]);

/** English country labels for the same regions (reverse-geocode fallback). */
const UMALQURA_COUNTRIES = new Set([
  "Saudi Arabia",
  "United Arab Emirates",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Egypt",
  "Jordan",
  "Syria",
  "Lebanon",
  "Iraq",
  "Yemen",
  "Palestine",
  "Turkey",
  "Türkiye",
]);

function deviceTimeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
}

/**
 * Sighting observer for a stored location, or `null` when the location should
 * stay on the official Umm al-Qura calendar: the seeded default (no fix yet)
 * and regions whose authority follows Umm al-Qura rather than local sighting.
 */
export function hijriObserverFor(location: StoredLocation): SightingObserver | null {
  if (location.source === "default") return null;
  const timeZone = location.timeZone ?? deviceTimeZone();
  if (timeZone && UMALQURA_TIMEZONES.has(timeZone)) return null;
  if (location.country && UMALQURA_COUNTRIES.has(location.country)) return null;
  return { latitude: location.latitude, longitude: location.longitude };
}
