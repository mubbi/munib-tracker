import { DUA_COUNT } from "@munib-tracker/shared/constants";
import { MUNIB_CELLS, MUNIB_NF } from "@/content/compare/shared";
import type { CompareCell } from "@/content/types";

/**
 * Arabic wording for Munib Tracker's own comparison cells. Only `note`/`text`
 * strings are translated; every status comes from the English cells
 * (`compare/shared.ts`, which follows the feature inventory), so a status can
 * never drift between languages. A missing translation throws at import time.
 */
const AR: Readonly<Record<string, string>> = {
  // MUNIB_CELLS
  "Free. No subscriptions or in-app purchases": "مجاني. بلا اشتراكات ولا مشتريات داخل التطبيق",
  "No ads": "بلا إعلانات",
  "Not required (guest mode); optional sign-in to sync":
    "غير مطلوب (وضع الضيف)؛ وتسجيل الدخول اختياري للمزامنة",
  "iOS, Android, web, Apple TV, Android TV; Apple Watch and Wear OS companions":
    "iOS وAndroid والويب وApple TV وAndroid TV؛ مع تطبيقين مرافقين على Apple Watch وWear OS",
  "13 methods, Hanafi/Shafi'i Asr, per-Salah offsets":
    "13 طريقة حساب، وعصر حنفي/شافعي، وتعديل لكل صلاة",
  "Optional, five styles": "اختياري، بخمسة أنماط",
  "Completed, delayed, missed, Qaza; Witr and Sunnah": "مؤدّاة، مؤجَّلة، فائتة، قضاء؛ والوتر والسنن",
  "Calculator, daily-pace planner, history, missed fasts":
    "حاسبة، ومخطط بوتيرة يومية، وسجل، والصيام الفائت",
  "60 adhkar with source hadith, guided sessions": "60 ذكرًا مع الحديث المصدر، وجلسات موجَّهة",
  "33/99/100/unlimited/custom": "33/99/100/بلا حد/مخصص",
  [`${DUA_COUNT} duas from Hisnul Muslim`]: `${DUA_COUNT} دعاءً من حصن المسلم`,
  "Surah, juz, 604-page mushaf": "بالسورة والجزء، ومصحف من 604 صفحات",
  "25 editions, side by side": "25 ترجمة، جنبًا إلى جنب",
  "On demand": "عند الطلب",
  "Text bundled; audio and extras downloadable": "النص مضمَّن؛ والصوت والإضافات قابلة للتنزيل",
  "Khatm plan with daily target": "خطة ختم بهدف يومي",
  "Letters, learn-to-read, tajweed lessons": "الحروف، وتعلّم القراءة، ودروس التجويد",
  "On-device listener follows word by word; free": "مستمع على الجهاز يتابعك كلمة بكلمة؛ مجانًا",
  "Words to try again; no scores": "كلمات لإعادة المحاولة؛ بلا درجات",
  "Hide words/ayahs, spaced revision 1-3-7-14-30 days":
    "إخفاء الكلمات/الآيات، ومراجعة متباعدة 1-3-7-14-30 يومًا",
  "Two collections bundled, six on demand": "مجموعتان مضمَّنتان، وست مجموعات عند الطلب",
  "Cited lessons on aqeedah, seerah, fiqh guides": "دروس موثَّقة في العقيدة والسيرة، وأدلة فقهية",
  "Week/month/year, weekly report": "أسبوع/شهر/سنة، وتقرير أسبوعي",
  "Home and lock screen; Live Activities": "الشاشة الرئيسية وشاشة القفل؛ والأنشطة المباشرة",
  "Apple Watch app; Wear OS tiles": "تطبيق على Apple Watch؛ ومربّعات على Wear OS",
  "Source available on GitHub (non-commercial licence)":
    "الشيفرة المصدرية متاحة على GitHub (ترخيص غير تجاري)",
  "Verse Detector: by voice or typed Arabic/English":
    "كاشف الآيات: بالصوت أو بكتابة نص عربي/إنجليزي",
  "Tahajjud, Ishraq, Duha and more": "التهجد والإشراق والضحى وغيرها",
  "Hayd, illness and travel; streak kept": "الحيض والمرض والسفر؛ مع بقاء السلسلة",
  "Khushu' journal per Salah": "يومية الخشوع لكل صلاة",
  "Ramadan log, White Days, missed fasts": "سجل رمضان، والأيام البيض، والصيام الفائت",
  "Events calendar and date converter": "تقويم المناسبات ومحوّل التاريخ",
  "Zakat calculator": "حاسبة الزكاة",
  "Learning guide and rite checklists": "دليل تعليمي وقوائم تحقق للمناسك",
  "Grades, narrators, sharh and full isnad": "درجات الأحاديث والرواة والشرح والإسناد كاملًا",
  "Today's Goal checklist": "قائمة هدف اليوم",
  "Achievements and Noor levels": "الإنجازات ومستويات النور",
  "PIN or biometrics": "رمز PIN أو البصمة/الوجه",
  "Apple TV and Android TV": "Apple TV وAndroid TV",
  "Web app / PWA": "تطبيق ويب / PWA",
  "Flash cards across Qur'an, hadith and guides": "بطاقات تعليمية للقرآن والحديث والأدلة",
  // MUNIB_NF
  "Sunnah Rawatib tracker": "متابعة السنن الرواتب",
  "Salah focus lock (blocks chosen apps)": "قفل التركيز للصلاة (يحجب التطبيقات التي تختارها)",
  "Masjid finder (OpenStreetMap)": "البحث عن المساجد (OpenStreetMap)",
  "Scan your masjid's timetable, read on the device": "تصوير جدول أوقات مسجدك وقراءته على الجهاز",
  "App-wide madhhab setting": "إعداد المذهب على مستوى التطبيق",
  "Voluntary fasting tracker": "متابعة صيام التطوع",
  "Dhul-Hijjah mode": "وضع ذي الحجة",
  "Daily Sunnah habits checklist": "قائمة السنن اليومية",
  "Eight designs, incl. sliding beads; sound and haptics":
    "ثمانية تصاميم، منها الخرز المنزلق؛ مع الصوت والاهتزاز",
  "Any zikr: teach it by saying it, then only its repeats count, on the device; tap to correct":
    "أي ذكر: علِّمه للتطبيق بنطقه، ثم لا يُحتسب إلا تكراره، على الجهاز؛ والتصحيح بلمسة",
  "Ayah notes, highlights and tags": "ملاحظات الآيات والتظليل والوسوم",
  "Arabic root-word search": "البحث بجذور الكلمات العربية",
  "Basic: marks words that seem skipped or unclear, on the device; no tajweed or letter-level judging":
    "أساسي: يعلِّم الكلمات التي يبدو أنها سقطت أو لم تتضح، على الجهاز؛ دون حكم على التجويد أو على مستوى الحروف",
  "Coaching on tajweed sounds to practise, with drills; doesn't check tajweed inside an ayah":
    "إرشاد إلى أصوات التجويد التي تحتاج إلى تمرين، مع تدريبات؛ ولا يفحص التجويد داخل الآية",
  "Live, guided Umrah mode": "وضع عمرة مباشر وموجَّه",
  "Inheritance calculator, four schools": "حاسبة المواريث، على المذاهب الأربعة",
  "Islamic will builder": "منشئ الوصية الإسلامية",
  "Debts and trusts record": "سجل الديون والأمانات",
  "Nightly muhasabah": "محاسبة النفس الليلية",
  "Weekly on-device coach": "مرشد أسبوعي على الجهاز",
  "Family ties reminders": "تذكيرات صلة الرحم",
  "Family and kids mode": "العائلة ووضع الأطفال",
  "Accountability partner": "رفيق المتابعة",
  "Group khatm": "الختمة الجماعية",
};

function tr(english: string): string {
  const arabic = AR[english];
  if (arabic === undefined) throw new Error(`Missing Arabic for comparison cell "${english}"`);
  return arabic;
}

/** The same cell with its `note`/`text` in Arabic (status untouched). */
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

/** `MUNIB_CELLS` with Arabic notes. */
export const MUNIB_CELLS_AR = localizeCells(MUNIB_CELLS);

/** `MUNIB_NF` with Arabic notes; statuses follow the feature inventory. */
export const MUNIB_NF_AR = localizeCells(MUNIB_NF);
