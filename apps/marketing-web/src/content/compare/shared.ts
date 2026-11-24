import { MUNIB_FEATURE_INVENTORY } from "@/content/munib-features";
import type { CompareApp, CompareCell } from "@/content/types";

export const VERIFIED_ON = "2026-11-23" as const;

export const MUNIB: CompareApp = {
  id: "munib",
  name: "Munib Tracker",
  url: "https://munibtracker.app",
};

const yes = (note?: string): CompareCell => ({ status: "yes", ...(note ? { note } : {}) });
const no = (note?: string): CompareCell => ({ status: "no", ...(note ? { note } : {}) });
const partial = (note?: string): CompareCell => ({ status: "partial", ...(note ? { note } : {}) });
const unverified = (note?: string): CompareCell => ({
  status: "unverified",
  ...(note ? { note } : {}),
});
const text = (value: string): CompareCell => ({ text: value });
/** Munib Tracker roadmap item (docs/NEW_FEATURES_TODO_PLAN.md) — rendered "Coming soon". */
const planned = (note?: string): CompareCell => ({ status: "planned", ...(note ? { note } : {}) });

export const cell = { yes, no, partial, unverified, text, planned };

/**
 * Munib Tracker's own values, verified against the app source and
 * docs/FEATURES.md. Every comparison uses these so they never drift.
 */
export const MUNIB_CELLS = {
  price: text("Free. No subscriptions or in-app purchases"),
  ads: text("No ads"),
  account: text("Not required (guest mode); optional sign-in to sync"),
  platforms: text("iOS, Android, web, Apple TV, Android TV; Apple Watch and Wear OS companions"),
  times: yes("13 methods, Hanafi/Shafi'i Asr, per-Salah offsets"),
  adhan: yes("Optional, five styles"),
  qibla: yes(),
  salahLog: yes("Completed, delayed, missed, Qaza; Witr and Sunnah"),
  qaza: yes("Calculator, daily-pace planner, history, missed fasts"),
  zikr: yes("60 adhkar with source hadith, guided sessions"),
  tasbeeh: yes("33/99/100/unlimited/custom"),
  duas: yes("279 duas from Hisnul Muslim"),
  quranReader: yes("Surah, juz, 604-page mushaf"),
  translations: yes("25 editions, side by side"),
  tafsir: yes("On demand"),
  wordByWord: yes(),
  tajweedColours: yes(),
  quranOffline: yes("Text bundled; audio and extras downloadable"),
  khatm: yes("Khatm plan with daily target"),
  quranLearning: yes("Letters, learn-to-read, tajweed lessons"),
  recitation: yes("On-device listener follows word by word; free"),
  mistakeMarks: partial("Words to try again; no scores"),
  memorization: yes("Hide words/ayahs, spaced revision 1-3-7-14-30 days"),
  hadith: yes("Two collections bundled, six on demand"),
  learning: yes("Cited lessons on aqeedah, seerah, fiqh guides"),
  statistics: yes("Week/month/year, weekly report"),
  widgets: yes("Home and lock screen; Live Activities"),
  watch: yes("Apple Watch app; Wear OS tiles"),
  openSource: yes("Source available on GitHub (non-commercial licence)"),
  // Shipped features not covered above
  verseDetector: yes("Verse Detector: by voice or typed Arabic/English"),
  sunnahSalah: yes("Tahajjud, Ishraq, Duha and more"),
  excusedDays: yes("Hayd, illness and travel; streak kept"),
  journal: yes("Khushu' journal per Salah"),
  fastingTracking: yes("Ramadan log, White Days, missed fasts"),
  hijriCalendar: yes("Events calendar and date converter"),
  zakat: yes("Zakat calculator"),
  hajjUmrah: yes("Learning guide and rite checklists"),
  hadithDepth: yes("Grades, narrators, sharh and full isnad"),
  tafsirAudio: no(),
  goals: yes("Today's Goal checklist"),
  achievements: yes("Achievements and Noor levels"),
  appLock: yes("PIN or biometrics"),
  tv: yes("Apple TV and Android TV"),
  webApp: yes("Web app / PWA"),
  flashCards: yes("Flash cards across Qur'an, hadith and guides"),
} as const satisfies Record<string, CompareCell>;

const NF_STATUS = new Map(
  MUNIB_FEATURE_INVENTORY.flatMap((g) => g.items)
    .filter((i) => i.nf)
    .map((i) => [i.nf, i.status]),
);

/**
 * A Munib cell for an NF-3.x feature: available or "Coming soon", per its
 * inventory status. `shippedAs: "partial"` marks a feature that ships in a
 * deliberately limited form (e.g. a documented fallback).
 */
function nf(id: string, note: string, shippedAs: "yes" | "partial" = "yes"): CompareCell {
  const status = NF_STATUS.get(id);
  if (!status) throw new Error(`Unknown roadmap id ${id}`);
  if (status !== "shipped") return planned(note);
  return shippedAs === "partial" ? partial(note) : yes(note);
}

/**
 * Munib Tracker NF-3.x features (docs/NEW_FEATURES_TODO_PLAN.md). Their
 * availability comes from `content/munib-features.ts`, so one edit there
 * updates every comparison table.
 */
export const MUNIB_NF = {
  rawatib: nf("NF-3.1", "Sunnah Rawatib tracker"),
  focusLock: nf("NF-3.13", "Salah focus lock (blocks chosen apps)"),
  masjidFinder: nf("NF-3.11", "Masjid finder (OpenStreetMap)"),
  timetableScan: nf("NF-3.12", "Scan your masjid's timetable, read on the device"),
  madhhab: nf("NF-3.0a", "App-wide madhhab setting"),
  voluntaryFasting: nf("NF-3.2", "Voluntary fasting tracker"),
  dhulHijjah: nf("NF-3.3", "Dhul-Hijjah mode"),
  sunnahHabits: nf("NF-3.5", "Daily Sunnah habits checklist"),
  tasbeehDesigns: nf("NF-3.19", "Eight designs, incl. sliding beads; sound and haptics"),
  handsFreeTasbeeh: nf("NF-3.20", "Basic: counts each spoken phrase by its pauses, on the device"),
  ayahNotes: nf("NF-3.21", "Ayah notes, highlights and tags"),
  rootSearch: nf("NF-3.22", "Arabic root-word search"),
  pronunciation: nf(
    "NF-3.24",
    "Basic: marks words that seem skipped or unclear, on the device; no tajweed or letter-level judging",
    "partial",
  ),
  tajweedCoaching: nf(
    "NF-3.15",
    "Coaching on tajweed sounds to practise, with drills; doesn't check tajweed inside an ayah",
    "partial",
  ),
  umrahMode: nf("NF-3.4", "Live, guided Umrah mode"),
  mirath: nf("NF-3.10", "Inheritance calculator, four schools"),
  wasiyyah: nf("NF-3.9", "Islamic will builder"),
  debts: nf("NF-3.8", "Debts and trusts record"),
  muhasabah: nf("NF-3.6", "Nightly muhasabah"),
  coach: nf("NF-3.14", "Weekly on-device coach"),
  familyTies: nf("NF-3.7", "Family ties reminders"),
  family: nf("NF-3.16", "Family and kids mode"),
  partner: nf("NF-3.17", "Accountability partner"),
  groupKhatm: nf("NF-3.18", "Group khatm"),
} as const satisfies Record<string, CompareCell>;
