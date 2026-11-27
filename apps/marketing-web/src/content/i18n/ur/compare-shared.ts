import { DUA_COUNT } from "@munib-tracker/shared/constants";
import { MUNIB_CELLS, MUNIB_NF } from "@/content/compare/shared";
import type { CompareCell } from "@/content/types";

/**
 * Urdu wording for Munib Tracker's own comparison cells. Only `note`/`text`
 * strings are translated; every status comes from the English cells
 * (`compare/shared.ts`, which follows the feature inventory), so a status can
 * never drift between languages. A missing translation throws at import time.
 */
const UR: Readonly<Record<string, string>> = {
  // MUNIB_CELLS
  "Free. No subscriptions or in-app purchases": "مفت۔ نہ کوئی سبسکرپشن، نہ ان-ایپ خریداری",
  "No ads": "کوئی اشتہار نہیں",
  "Not required (guest mode); optional sign-in to sync":
    "ضروری نہیں (مہمان موڈ)؛ سنک کے لیے سائن اِن اختیاری",
  "iOS, Android, web, Apple TV, Android TV; Apple Watch and Wear OS companions":
    "iOS، Android، ویب، Apple TV، Android TV؛ ساتھ Apple Watch اور Wear OS کی ساتھی ایپس",
  "13 methods, Hanafi/Shafi'i Asr, per-Salah offsets":
    "حساب کے 13 طریقے، حنفی/شافعی عصر، ہر نماز کے وقت میں الگ کمی بیشی",
  "Optional, five styles": "اختیاری، پانچ انداز",
  "Completed, delayed, missed, Qaza; Witr and Sunnah":
    "ادا، تاخیر سے، چھوٹی ہوئی، قضا؛ وتر اور سنتیں",
  "Calculator, daily-pace planner, history, missed fasts":
    "کیلکولیٹر، روزانہ رفتار کا منصوبہ، ریکارڈ، چھوٹے ہوئے روزے",
  "60 adhkar with source hadith, guided sessions": "60 اذکار ماخذ حدیث کے ساتھ، رہنمائی والے سیشن",
  "33/99/100/unlimited/custom": "33/99/100/لامحدود/اپنی مرضی کا ہدف",
  [`${DUA_COUNT} duas from Hisnul Muslim`]: `حصن مسلم سے ${DUA_COUNT} دعائیں`,
  "Surah, juz, 604-page mushaf": "سورت، پارہ، 604 صفحات کا مصحف",
  "25 editions, side by side": "25 تراجم، ساتھ ساتھ",
  "On demand": "ضرورت کے وقت ڈاؤن لوڈ",
  "Text bundled; audio and extras downloadable":
    "متن ایپ میں شامل؛ آڈیو اور اضافی مواد ڈاؤن لوڈ کے قابل",
  "Khatm plan with daily target": "روزانہ ہدف کے ساتھ ختم کا منصوبہ",
  "Letters, learn-to-read, tajweed lessons": "حروف، پڑھنا سیکھیں، تجوید کے اسباق",
  "On-device listener follows word by word; free":
    "ڈیوائس پر موجود سامع لفظ بہ لفظ ساتھ چلتا ہے؛ مفت",
  "Words to try again; no scores": "دوبارہ پڑھنے کے لیے الفاظ؛ کوئی اسکور نہیں",
  "Hide words/ayahs, spaced revision 1-3-7-14-30 days":
    "الفاظ/آیات چھپائیں، وقفے وقفے سے دہرائی 1-3-7-14-30 دن",
  "Two collections bundled, six on demand": "دو مجموعے ایپ میں شامل، چھ ضرورت کے وقت",
  "Cited lessons on aqeedah, seerah, fiqh guides":
    "عقیدہ اور سیرت پر حوالوں کے ساتھ اسباق، فقہی رہنما",
  "Week/month/year, weekly report": "ہفتہ/مہینہ/سال، ہفتہ وار رپورٹ",
  "Home and lock screen; Live Activities": "ہوم اور لاک اسکرین؛ Live Activities",
  "Apple Watch app; Wear OS tiles": "Apple Watch ایپ؛ Wear OS ٹائلز",
  "Source available on GitHub (non-commercial licence)":
    "سورس کوڈ GitHub پر دستیاب (غیر تجارتی لائسنس)",
  "Verse Detector: by voice or typed Arabic/English":
    "آیت کی شناخت: آواز سے یا عربی/انگریزی ٹائپ کر کے",
  "Tahajjud, Ishraq, Duha and more": "تہجد، اشراق، چاشت اور مزید",
  "Hayd, illness and travel; streak kept": "حیض، بیماری اور سفر؛ سلسلہ برقرار رہتا ہے",
  "Khushu' journal per Salah": "ہر نماز کے لیے خشوع جرنل",
  "Ramadan log, White Days, missed fasts": "رمضان کا ریکارڈ، ایامِ بیض، چھوٹے ہوئے روزے",
  "Events calendar and date converter": "اسلامی واقعات کا کیلنڈر اور تاریخ کنورٹر",
  "Zakat calculator": "زکوٰۃ کیلکولیٹر",
  "Learning guide and rite checklists": "سیکھنے کی گائیڈ اور مناسک کی چیک لسٹیں",
  "Grades, narrators, sharh and full isnad": "درجۂ حدیث، راوی، شرح اور مکمل سند",
  "Today's Goal checklist": "آج کے ہدف کی چیک لسٹ",
  "Achievements and Noor levels": "کامیابیاں اور نور کے لیول",
  "PIN or biometrics": "PIN یا بایومیٹرکس",
  "Apple TV and Android TV": "Apple TV اور Android TV",
  "Web app / PWA": "ویب ایپ / PWA",
  "Flash cards across Qur'an, hadith and guides": "قرآن، حدیث اور گائیڈز کے فلیش کارڈز",
  // MUNIB_NF
  "Sunnah Rawatib tracker": "سنتِ رواتب کا ٹریکر",
  "Salah focus lock (blocks chosen apps)": "نماز فوکس لاک (منتخب ایپس بلاک کرتا ہے)",
  "Masjid finder (OpenStreetMap)": "مسجد تلاش (OpenStreetMap)",
  "Scan your masjid's timetable, read on the device":
    "اپنی مسجد کا نظام الاوقات اسکین کریں، ڈیوائس پر ہی پڑھا جاتا ہے",
  "App-wide madhhab setting": "پوری ایپ کے لیے مسلک کی ترتیب",
  "Voluntary fasting tracker": "نفلی روزوں کا ٹریکر",
  "Dhul-Hijjah mode": "ذوالحجہ موڈ",
  "Daily Sunnah habits checklist": "روزانہ سنت عادات کی چیک لسٹ",
  "Eight designs, incl. sliding beads; sound and haptics":
    "آٹھ ڈیزائن، سرکنے والے دانوں سمیت؛ آواز اور وائبریشن",
  "Any zikr: teach it by saying it, then only its repeats count, on the device; tap to correct":
    "کوئی بھی ذکر: ایک بار پڑھ کر سکھائیں، پھر صرف اسی کی تکرار گنی جاتی ہے، ڈیوائس پر ہی؛ درستی کے لیے ٹیپ کریں",
  "Ayah notes, highlights and tags": "آیات پر نوٹس، ہائی لائٹس اور ٹیگز",
  "Arabic root-word search": "عربی مادّے سے الفاظ کی تلاش",
  "Basic: marks words that seem skipped or unclear, on the device; no tajweed or letter-level judging":
    "بنیادی: چھوٹے ہوئے یا غیر واضح لگنے والے الفاظ نشان زد کرتا ہے، ڈیوائس پر ہی؛ تجوید یا حروف کی سطح پر کوئی جانچ نہیں",
  "Coaching on tajweed sounds to practise, with drills; doesn't check tajweed inside an ayah":
    "مشق کے لیے تجوید کی آوازوں پر رہنمائی، ڈرلز کے ساتھ؛ آیت کے اندر تجوید کی جانچ نہیں کرتا",
  "Live, guided Umrah mode": "قدم بہ قدم رہنمائی والا لائیو عمرہ موڈ",
  "Inheritance calculator, four schools": "وراثت کیلکولیٹر، چاروں مسالک",
  "Islamic will builder": "اسلامی وصیت نامہ بنانے کا ٹول",
  "Debts and trusts record": "قرضوں اور امانتوں کا ریکارڈ",
  "Nightly muhasabah": "رات کا محاسبہ",
  "Weekly on-device coach": "ڈیوائس پر ہفتہ وار رہنما",
  "Family ties reminders": "صلہ رحمی کی یاد دہانیاں",
  "Family and kids mode": "خاندان اور بچوں کا موڈ",
  "Accountability partner": "احتساب کا ساتھی",
  "Group khatm": "اجتماعی ختم",
};

function tr(english: string): string {
  const urdu = UR[english];
  if (urdu === undefined) throw new Error(`Missing Urdu for comparison cell "${english}"`);
  return urdu;
}

/** The same cell with its `note`/`text` in Urdu (status untouched). */
export function localizeCell(value: CompareCell): CompareCell {
  if ("text" in value) return { text: tr(value.text) };
  return value.note ? { ...value, note: tr(value.note) } : value;
}

function localizeCells<T extends Readonly<Record<string, CompareCell>>>(
  cells: T,
): { readonly [K in keyof T]: CompareCell } {
  return Object.fromEntries(
    Object.entries(cells).map(([key, value]) => [key, localizeCell(value)]),
  ) as { readonly [K in keyof T]: CompareCell };
}

/** `MUNIB_CELLS` with Urdu notes. */
export const MUNIB_CELLS_UR = localizeCells(MUNIB_CELLS);

/** `MUNIB_NF` with Urdu notes; statuses follow the feature inventory. */
export const MUNIB_NF_UR = localizeCells(MUNIB_NF);
