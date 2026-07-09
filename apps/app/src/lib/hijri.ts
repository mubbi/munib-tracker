import type { AppLocale } from "@munib-tracker/shared/types";

import { prayerDayAnchor } from "@/lib/timezone-anchor";

/**
 * Offline Gregorian → Hijri (Islamic) date conversion.
 *
 * Uses the tabular "Kuwaiti algorithm" (the arithmetic Islamic calendar used by
 * Microsoft's HijriCalendar and widely across Islamic apps). It stays within a
 * day of the Umm al-Qura calendar and needs zero network / native deps, so the
 * date works fully offline and identically on iOS, Android, and Web.
 */

export interface HijriDate {
  /** Islamic year (AH). */
  year: number;
  /** Islamic month, 1–12. */
  month: number;
  /** Day of the Islamic month, 1–30. */
  day: number;
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

/** Gregorian (proleptic) calendar day → integer Julian Day Number. */
function gregorianToJDN(gy: number, gm: number, gd: number): number {
  const a = Math.floor((14 - gm) / 12);
  const y = gy + 4800 - a;
  const m = gm + 12 * a - 3;
  return (
    gd +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/** Julian Day Number → Gregorian { year, month (1-12), day }. */
function jdnToGregorian(jdn: number): { year: number; month: number; day: number } {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year: 100 * b + d - 4800 + Math.floor(m / 10),
  };
}

/** Julian Day Number → Islamic date (tabular "Kuwaiti algorithm"). */
function jdnToIslamic(jdn: number): HijriDate {
  let l = jdn - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day };
}

/** Islamic date → integer Julian Day Number (exact inverse of `jdnToIslamic`). */
function islamicToJDN(hy: number, hm: number, hd: number): number {
  return (
    hd + Math.ceil(29.5 * (hm - 1)) + (hy - 1) * 354 + Math.floor((3 + 11 * hy) / 30) + 1948440 - 1
  );
}

/** Converts a Gregorian calendar day to a Hijri date. Pass `timeZone` for manual locations. */
export function gregorianToHijri(date: Date, timeZone?: string): HijriDate {
  const anchor = prayerDayAnchor(date, timeZone);
  return jdnToIslamic(
    gregorianToJDN(anchor.getFullYear(), anchor.getMonth() + 1, anchor.getDate()),
  );
}

/** Converts a Hijri date to a Gregorian `Date` at local midnight. */
export function hijriToGregorian(year: number, month: number, day: number): Date {
  const { year: gy, month: gm, day: gd } = jdnToGregorian(islamicToJDN(year, month, day));
  return new Date(gy, gm - 1, gd);
}

/** Number of days (29 or 30) in the given Hijri month. */
export function hijriMonthLength(year: number, month: number): number {
  const start = islamicToJDN(year, month, 1);
  const next = month === 12 ? islamicToJDN(year + 1, 1, 1) : islamicToJDN(year, month + 1, 1);
  return next - start;
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
