import type { AppLocale } from "@munib-tracker/shared/types";

import {
  gregorianToJDN,
  type HijriDate,
  inUmalquraJDNRange,
  inUmalquraYearRange,
  islamicTabularToJDN,
  jdnToGregorian,
  jdnToIslamicTabular,
  jdnToUmalqura,
  umalquraMonthLength,
  umalquraToJDN,
} from "@/lib/hijri-core";
import {
  type SightingObserver,
  sightingAvailable,
  sightingHijriFromJDN,
  sightingJDNFromHijri,
  sightingMonthLength,
} from "@/lib/hijri-sighting";
import { prayerDayAnchor } from "@/lib/timezone-anchor";

export type { HijriDate };

/**
 * Offline Gregorian → Hijri (Islamic) date conversion.
 *
 * **Single source of truth for the whole app.** Ramadan, calendar grids, the
 * date converter, Islamic events, seasonal banners, widgets, and the prayer
 * hero all call these helpers — never reimplement Hijri math elsewhere.
 *
 * When a location observer is registered (see {@link setHijriObserver}), dates
 * come from actual crescent (hilāl) visibility computed for that latitude /
 * longitude with the `astronomy-engine` ephemeris — matching regional
 * moon-sighting outcomes (e.g. Pakistan's Ruet-e-Hilal dates in Karachi).
 * Without an observer (and as fallback for polar latitudes or dates outside
 * the covered range) the official Umm al-Qura month table is used
 * (`hijri-umalqura-data.ts`, 1300–1600 AH ≈ 1882–2174 CE), then the tabular
 * "Kuwaiti algorithm" for anything beyond that. All paths are pure math —
 * fully offline and identical on iOS, Android, and Web.
 *
 * The location store keeps the observer in sync via `hijriObserverFor`
 * (`hijri-authority.ts`): Umm al-Qura regions stay on the official calendar;
 * everywhere else uses sighting at the stored lat/long.
 */

let hijriObserver: SightingObserver | null = null;

/**
 * Registers the coordinates Hijri dates should be computed for. The location
 * store keeps this in sync with the user's chosen/GPS location so every date
 * shown in the app reflects crescent visibility at that place.
 */
export function setHijriObserver(observer: SightingObserver | null): void {
  hijriObserver =
    observer && sightingAvailable(observer.latitude)
      ? { latitude: observer.latitude, longitude: observer.longitude }
      : null;
}

/** Currently registered sighting coordinates (null ⇒ Umm al-Qura dates). */
export function getHijriObserver(): SightingObserver | null {
  return hijriObserver;
}

const HIJRI_MONTHS_EN = [
  "Muharram",
  "Safar",
  "Rabi al-Awwal",
  "Rabi al-Thani",
  "Jumada al-Ula",
  "Jumada al-Akhira",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhul-Qa'dah",
  "Dhul-Hijjah",
] as const;

const HIJRI_MONTHS: Partial<Record<AppLocale, readonly string[]>> = {
  en: HIJRI_MONTHS_EN,
  ar: [
    "محرم",
    "صفر",
    "ربيع الأول",
    "ربيع الآخر",
    "جمادى الأولى",
    "جمادى الآخرة",
    "رجب",
    "شعبان",
    "رمضان",
    "شوال",
    "ذو القعدة",
    "ذو الحجة",
  ],
  ur: [
    "محرم",
    "صفر",
    "ربیع الاول",
    "ربیع الثانی",
    "جمادی الاول",
    "جمادی الثانی",
    "رجب",
    "شعبان",
    "رمضان",
    "شوال",
    "ذوالقعدہ",
    "ذوالحجہ",
  ],
  fa: [
    "محرم",
    "صفر",
    "ربیع‌الاول",
    "ربیع‌الثانی",
    "جمادی‌الاول",
    "جمادی‌الثانی",
    "رجب",
    "شعبان",
    "رمضان",
    "شوال",
    "ذی‌القعده",
    "ذی‌الحجه",
  ],
  ps: [
    "محرم",
    "صفر",
    "ربيع الاول",
    "ربيع الثاني",
    "جمادي الاول",
    "جمادي الثاني",
    "رجب",
    "شعبان",
    "رمضان",
    "شوال",
    "ذوالقعده",
    "ذوالحجه",
  ],
  ku: [
    "مُحَرَّم",
    "صَفَر",
    "رَبیع الأَوَّل",
    "رَبیع الآخِر",
    "جُمادى الأُولى",
    "جُمادى الآخِرَة",
    "رَجَب",
    "شَعْبان",
    "رَمَضان",
    "شَوّال",
    "ذُوالقَعْدَة",
    "ذُوالحِجَّة",
  ],
  id: [
    "Muharram",
    "Safar",
    "Rabiul Awal",
    "Rabiul Akhir",
    "Jumadil Awal",
    "Jumadil Akhir",
    "Rajab",
    "Sya'ban",
    "Ramadhan",
    "Syawwal",
    "Dzulqa'dah",
    "Dzulhijjah",
  ],
  ms: [
    "Muharram",
    "Safar",
    "Rabiul Awal",
    "Rabiul Akhir",
    "Jumadil Awal",
    "Jumadil Akhir",
    "Rejab",
    "Syaaban",
    "Ramadan",
    "Syawal",
    "Zulkaedah",
    "Zulhijjah",
  ],
  tr: [
    "Muharrem",
    "Safer",
    "Rebiülevvel",
    "Rebiülahir",
    "Cemaziyelevvel",
    "Cemaziyelahir",
    "Recep",
    "Şaban",
    "Ramazan",
    "Şevval",
    "Zilkade",
    "Zilhicce",
  ],
  az: [
    "Məhərrəm",
    "Səfər",
    "Rabiül-əvvəl",
    "Rabiül-axir",
    "Cəmadiül-əvvəl",
    "Cəmadiül-axir",
    "Rəcəb",
    "Şaban",
    "Ramazan",
    "Şəvval",
    "Zülqədə",
    "Zülhiccə",
  ],
  uz: [
    "Muharram",
    "Safar",
    "Rabiul avval",
    "Rabiul oxir",
    "Jumadul avval",
    "Jumadul oxir",
    "Rajab",
    "Sha'bon",
    "Ramazon",
    "Shavvol",
    "Zul-qa'da",
    "Zul-hijja",
  ],
  kk: [
    "Мұхаррам",
    "Сафар",
    "Рабиул-аввал",
    "Рабиул-ахир",
    "Жумадул-аввал",
    "Жумадул-ахир",
    "Раджаб",
    "Шаабан",
    "Рамазан",
    "Шаввал",
    "Зул-қада",
    "Зул-хиджа",
  ],
  ky: [
    "Мухаррам",
    "Сафар",
    "Рабиул-аввал",
    "Рабиул-ахир",
    "Жумадул-аввал",
    "Жумадул-ахир",
    "Ражаб",
    "Шаабан",
    "Рамазан",
    "Шаввал",
    "Зул-када",
    "Зул-хиджа",
  ],
  tg: [
    "Муҳаррам",
    "Сафар",
    "Рабиул-аввал",
    "Рабиул-охир",
    "Ҷумодул-аввал",
    "Ҷумодул-охир",
    "Раҷаб",
    "Шаъбон",
    "Рамазон",
    "Шаввол",
    "Зул-қаъда",
    "Зул-ҳиҷҷа",
  ],
  tk: [
    "Muharram",
    "Safar",
    "Rabiul awwal",
    "Rabiul ahir",
    "Jumadul awwal",
    "Jumadul ahir",
    "Rajab",
    "Sha'ban",
    "Ramazan",
    "Shawwal",
    "Zul-qa'da",
    "Zul-hijja",
  ],
  bn: [
    "মুহাররম",
    "সফর",
    "রবিউল আউয়াল",
    "রবিউল আখির",
    "জুমাদাল আউয়াল",
    "জুমাদাল আখির",
    "রজব",
    "শাবান",
    "রমজান",
    "শাওয়াল",
    "জিলকদ",
    "জিলহজ",
  ],
  ru: [
    "Мухаррам",
    "Сафар",
    "Раби аль-аввал",
    "Раби аль-ахир",
    "Джумада аль-ула",
    "Джумада аль-ахира",
    "Раджаб",
    "Шаабан",
    "Рамадан",
    "Шавваль",
    "Зуль-када",
    "Зуль-хиджа",
  ],
  bs: [
    "Muharram",
    "Safar",
    "Rabiul-evvel",
    "Rabiul-ahir",
    "Džumadel-evvel",
    "Džumadel-ahir",
    "Redžeb",
    "Ša'ban",
    "Ramazan",
    "Ševval",
    "Zul-ka'de",
    "Zul-hidždže",
  ],
  sq: [
    "Muharrem",
    "Safer",
    "Rabiul-evl",
    "Rabiul-ahir",
    "Xhumadeul-evl",
    "Xhumadeul-ahir",
    "Redheb",
    "Sha'ban",
    "Ramazani",
    "Sheval",
    "Dhul-Kade",
    "Dhul-Hixhje",
  ],
  fr: [
    "Mouharram",
    "Safar",
    "Rabi al-Awwal",
    "Rabi al-Thani",
    "Joumada al-Oula",
    "Joumada al-Akhira",
    "Rajab",
    "Cha'ban",
    "Ramadan",
    "Chawwal",
    "Dhoul-Qi'dah",
    "Dhoul-Hijjah",
  ],
  ha: [
    "Muharram",
    "Safar",
    "Rabi'ul Awwal",
    "Rabi'ul Akhir",
    "Jumada al-Ula",
    "Jumada al-Akhira",
    "Rajab",
    "Sha'ban",
    "Ramadan",
    "Shawwal",
    "Dhu al-Qi'dah",
    "Dhu al-Hijjah",
  ],
  sw: [
    "Muharram",
    "Safar",
    "Rabi al-Awwal",
    "Rabi al-Thani",
    "Jumada al-Ula",
    "Jumada al-Akhira",
    "Rajab",
    "Sha'ban",
    "Ramadan",
    "Shawwal",
    "Dhul-Qi'dah",
    "Dhul-Hijjah",
  ],
  so: [
    "Muharram",
    "Safar",
    "Rabi al-Awwal",
    "Rabi al-Thani",
    "Jumada al-Ula",
    "Jumada al-Akhira",
    "Rajab",
    "Sha'ban",
    "Ramadan",
    "Shawwal",
    "Dhul-Qi'dah",
    "Dhul-Hijjah",
  ],
};

/** Locales that format Hijri dates day-first (like ar/ur). */
const HIJRI_DAY_FIRST = new Set<AppLocale>(["ar", "ur", "fa", "ps", "ku"]);

/** Era suffix ("AH") per locale — falls back to English. */
const HIJRI_SUFFIX: Partial<Record<AppLocale, string>> = {
  en: "AH",
  ar: "هـ",
  ur: "ھ",
  fa: "ه‍.ق",
  ps: "ه‍.ق",
  ku: "ک‍.ه",
  id: "H",
  ms: "H",
  tr: "H",
  az: "h.",
  uz: "h.",
  kk: "ж.",
  ky: "ж.",
  tg: "ҷ.",
  tk: "h.",
  bn: "হি.",
  ru: "г.х.",
  bs: "AH",
  sq: "v.e.",
  fr: "AH",
  ha: "AH",
  sw: "AH",
  so: "AH",
};

/**
 * Converts a Gregorian calendar day to a Hijri date. Pass `timeZone` for manual
 * locations. Uses crescent visibility at the registered observer when set,
 * otherwise the Umm al-Qura table, then the tabular fallback.
 */
export function gregorianToHijri(date: Date, timeZone?: string): HijriDate {
  const anchor = prayerDayAnchor(date, timeZone);
  const jdn = gregorianToJDN(anchor.getFullYear(), anchor.getMonth() + 1, anchor.getDate());
  if (hijriObserver) {
    const sighted = sightingHijriFromJDN(hijriObserver, jdn);
    if (sighted) return sighted;
  }
  if (inUmalquraJDNRange(jdn)) {
    return jdnToUmalqura(jdn);
  }
  return jdnToIslamicTabular(jdn);
}

/** Converts a Hijri date to a Gregorian `Date` at local midnight. */
export function hijriToGregorian(year: number, month: number, day: number): Date {
  let jdn: number | null = null;
  if (hijriObserver) {
    jdn = sightingJDNFromHijri(hijriObserver, year, month, day);
  }
  if (jdn === null) {
    jdn = inUmalquraYearRange(year)
      ? umalquraToJDN(year, month, day)
      : islamicTabularToJDN(year, month, day);
  }
  const { year: gy, month: gm, day: gd } = jdnToGregorian(jdn);
  return new Date(gy, gm - 1, gd);
}

/** Number of days (29 or 30) in the given Hijri month. */
export function hijriMonthLength(year: number, month: number): number {
  if (hijriObserver) {
    const sighted = sightingMonthLength(hijriObserver, year, month);
    if (sighted !== null) return sighted;
  }
  if (inUmalquraYearRange(year)) {
    return umalquraMonthLength(year, month);
  }
  const start = islamicTabularToJDN(year, month, 1);
  const next =
    month === 12 ? islamicTabularToJDN(year + 1, 1, 1) : islamicTabularToJDN(year, month + 1, 1);
  return next - start;
}

/** Progress through the current Hijri month and identity of the next month. */
export function hijriMonthProgress(hijri: HijriDate): {
  length: number;
  /** Whole days left in this month after today (0 on the last day). */
  daysRemaining: number;
  nextMonth: number;
  nextYear: number;
} {
  const length = hijriMonthLength(hijri.year, hijri.month);
  const daysRemaining = Math.max(0, length - hijri.day);
  const nextMonth = hijri.month === 12 ? 1 : hijri.month + 1;
  const nextYear = hijri.month === 12 ? hijri.year + 1 : hijri.year;
  return { length, daysRemaining, nextMonth, nextYear };
}

/** Localized Hijri month name (1-based month). */
export function hijriMonthName(month: number, locale: AppLocale): string {
  const names = HIJRI_MONTHS[locale] ?? HIJRI_MONTHS.en ?? [];
  return names[Math.min(Math.max(month, 1), 12) - 1] ?? "";
}

/**
 * Formats a Gregorian date as a localized Hijri string, e.g. "Muharram 17, 1448 AH"
 * (en) or "17 محرم 1448 هـ" (ar/ur, day-first).
 */
export function formatHijriDate(date: Date, locale: AppLocale, timeZone?: string): string {
  const { year, month, day } = gregorianToHijri(date, timeZone);
  const name = hijriMonthName(month, locale);
  const suffix = HIJRI_SUFFIX[locale] ?? HIJRI_SUFFIX.en;
  if (locale === "en") {
    return `${name} ${day}, ${year} ${suffix}`;
  }
  if (HIJRI_DAY_FIRST.has(locale)) {
    return `${day} ${name} ${year} ${suffix}`;
  }
  return `${name} ${day}, ${year} ${suffix}`;
}

/** Localized month-and-year label for a Hijri month, e.g. "Ramadan 1448 AH". */
export function hijriMonthLabel(year: number, month: number, locale: AppLocale): string {
  const suffix = HIJRI_SUFFIX[locale] ?? HIJRI_SUFFIX.en;
  return `${hijriMonthName(month, locale)} ${year} ${suffix}`;
}

/** Compact Hijri label for tight grids, e.g. "Ram 17" (en) or "17 رمضان" (ar/ur). */
export function formatHijriDateCompact(date: Date, locale: AppLocale, timeZone?: string): string {
  const { month, day } = gregorianToHijri(date, timeZone);
  const name = hijriMonthName(month, locale);
  if (locale === "en") {
    const short = name.split(/[\s'-]+/)[0].slice(0, 3);
    return `${short} ${day}`;
  }
  if (HIJRI_DAY_FIRST.has(locale)) {
    return `${day} ${name}`;
  }
  const short = name.split(/[\s'-]+/)[0].slice(0, 3);
  return `${short} ${day}`;
}
