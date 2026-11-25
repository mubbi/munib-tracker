/**
 * The complete Munib Tracker feature inventory — the single source of truth
 * for "everything in the app" on comparison pages.
 *
 * - `shipped`: in the app today (verified against `docs/FEATURES.md` and the
 *   app routes/strings).
 * - `planned`: shown as "Coming soon", never as available.
 * Items with an `nf` id are catalogued in `docs/FEATURES.md` (shipped) or
 * `docs/BACKLOG.md` (planned); locked scope is in `docs/DECISIONS.md`.
 */

import { DUA_COUNT } from "@munib-tracker/shared/constants";
import { TRANSLATIONS as arInventory } from "@/content/i18n/ar/inventory";
import { TRANSLATIONS as urInventory } from "@/content/i18n/ur/inventory";
import { type ContentTranslations, localizeEntries } from "@/content/localized";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/routing";

export type InventoryItem = {
  name: string;
  detail?: string;
  status: "shipped" | "planned";
  /** Roadmap id for planned items (e.g. "NF-3.11"). */
  nf?: string;
  /** Feature page that explains it, if any. */
  href?: string;
};

export type InventoryGroup = { id: string; title: string; items: readonly InventoryItem[] };

const shipped = (name: string, detail?: string, href?: string): InventoryItem => ({
  name,
  status: "shipped",
  ...(detail ? { detail } : {}),
  ...(href ? { href } : {}),
});
/**
 * An NF-3.x feature (docs/FEATURES.md, decisions in docs/DECISIONS.md) that is in the app
 * (checked against the app code and docs/proofs/*.md on 2026-11-24). Every
 * comparison cell built with `nf()` in compare/shared.ts follows its status.
 */
const nf = (id: string, name: string, detail: string, href?: string): InventoryItem => ({
  name,
  detail,
  status: "shipped",
  nf: id,
  ...(href ? { href } : {}),
});
/**
 * An NF-3.x feature still being built: shown as "Coming soon", never as
 * available. Nothing uses it right now; kept for the next roadmap item.
 */
export const soon = (id: string, name: string, detail: string, href?: string): InventoryItem => ({
  ...nf(id, name, detail, href),
  status: "planned",
});

export const MUNIB_FEATURE_INVENTORY: readonly InventoryGroup[] = [
  {
    id: "salah",
    title: "Salah",
    items: [
      shipped(
        "Salah times",
        "GPS or city, 13 calculation methods, Hanafi or Shafi'i Asr, per-Salah tuning, high-latitude rules",
        "/features/prayer-times-qibla",
      ),
      shipped(
        "Adhan and reminders",
        "Five Adhan styles, reminders before or after each Salah, precise timing on Android",
      ),
      shipped(
        "Salah tracker",
        "Completed, delayed, missed or Qaza for each Salah; Witr; Jama'ah; private notes; streaks and calendar",
        "/features/salah-tracker",
      ),
      shipped(
        "Sunnah and Nafl Salah",
        "Tahajjud, Ishraq, Duha, Tahiyyat al-Masjid, Hajat and Istikhara",
      ),
      shipped("Today's schedule", "Obligatory Salah, Sunnah windows and flexible acts for the day"),
      shipped(
        "Excused days",
        "Hayd, illness and travel pause tracking without breaking your streak, with guides",
      ),
      shipped("Khushu' prayer journal", "Note how present you felt in each Salah"),
      shipped("Tahajjud log", "With the last third of the night calculated for your location"),
      shipped(
        "Qibla compass",
        "Bearing and distance to Makkah, with an alignment haptic",
        "/features/prayer-times-qibla",
      ),
      shipped(
        "Salah history import",
        "From a spreadsheet (CSV) or JSON, with misses added to Qaza",
      ),
      nf(
        "NF-3.1",
        "Sunnah Rawatib tracker",
        "The confirmed Sunnah rakahs: 12 for Hanafis, 10 for the other schools, and editable",
        "/features/salah-tracker",
      ),
      nf(
        "NF-3.13",
        "Salah focus lock",
        "Block chosen apps around each Salah until you pray, on iPhone and Android",
        "/features/salah-focus-lock",
      ),
      nf(
        "NF-3.11",
        "Masjid finder",
        'Nearby masjids from OpenStreetMap, a home masjid with private iqamah times, an iqamah countdown and "prayed at the Masjid"',
        "/features/masjid-finder",
      ),
      nf(
        "NF-3.12",
        "Timetable scan",
        "Photograph your masjid's timetable to import iqamah times, read on the device and checked by you",
        "/features/masjid-finder",
      ),
      shipped(
        "Preferred-time reminders",
        "Optional, for schools that prefer a later time for Fajr, Asr or Isha",
        "/features/my-madhhab",
      ),
      nf(
        "NF-3.0a",
        "My madhhab setting",
        "Hanafi, Shafi'i, Maliki, Hanbali or all views; differences labelled in guides and calculators",
        "/features/my-madhhab",
      ),
      nf(
        "NF-3.0b",
        "Hijri date adjustment",
        "A ±2-day offset plus per-month corrections to match your local moon sighting",
        "/features/my-madhhab",
      ),
    ],
  },
  {
    id: "qaza",
    title: "Qaza and fasting",
    items: [
      shipped(
        "Qaza counters",
        "One per Salah, including Witr, fed by missed Salah",
        "/features/qaza-salah-tracker",
      ),
      shipped("Lifetime Qaza calculator", "Estimate a backlog from the years you didn't pray"),
      shipped("Daily-pace planner", "Gentle to intensive presets with an estimated finish date"),
      shipped("Qaza history", "Every make-up Salah, logged"),
      shipped("Missed fasts tracker", "Track and make up missed fasts"),
      shipped("Fidyah and kaffarah helpers", "Planning estimates with guidance"),
      shipped("Ramadan tracker", "Fasting times and a fasting log"),
      shipped(
        "White Days fasting",
        "Hub, checklist and reminder for the 13th to 15th of each Hijri month",
      ),
      nf(
        "NF-3.2",
        "Voluntary fasting tracker",
        "Plan, remind and log recommended fasts; disliked days labelled, prohibited days blocked",
        "/features/fasting-tracker",
      ),
      nf(
        "NF-3.3",
        "Dhul-Hijjah mode",
        "Daily deeds, the Day of Arafah, Takbir al-Tashriq by school and an udhiyah planner",
        "/features/fasting-tracker",
      ),
    ],
  },
  {
    id: "zikr",
    title: "Zikr and duas",
    items: [
      shipped(
        "60 adhkar with sources",
        "Seven categories, each zikr with its source hadith",
        "/features/zikr-tracker",
      ),
      shipped("Guided adhkar sessions", "Morning, evening, before sleep and after each Salah"),
      shipped("Tasbeeh counter", "33, 99, 100, unlimited or custom targets; Wear OS tile"),
      shipped("Custom adhkar builder", "Your own zikr, with speech-to-text"),
      shipped(`${DUA_COUNT} duas`, "The full Hisnul Muslim in 16 categories"),
      shipped(
        "Duroods and the 99 Names",
        "Nine salawat, and the Names of Allah with meanings and audio",
      ),
      nf(
        "NF-3.5",
        "Daily Sunnah habits",
        "A short, evidence-backed checklist of everyday sunnahs",
        "/features/daily-islamic-habits",
      ),
      nf(
        "NF-3.19",
        "Tasbeeh counter designs",
        "Eight designs, from the Ring (the default) and sliding beads to date pits and finger counting, with optional sound and haptics",
        "/features/zikr-tracker",
      ),
      nf(
        "NF-3.20",
        "Hands-free tasbeeh",
        "Teach any zikr by saying it, then only its repeats count, on the device; tap to correct any miscount",
        "/features/zikr-tracker",
      ),
    ],
  },
  {
    id: "quran",
    title: "Qur'an",
    items: [
      shipped(
        "Full Qur'an offline",
        "Surah, juz and 604-page mushaf, two facing pages on wide screens",
        "/features/quran",
      ),
      shipped("Word-by-word and tajweed colours"),
      shipped("25 translations", "Two bundled, the rest on demand, side by side"),
      shipped("Tafsir on demand"),
      shipped("Recitation audio", "Several reciters, ayah or surah playback, offline downloads"),
      shipped("Khatm plan and hifz tracker", "Daily reading target and memorized ayahs"),
      shipped("Verse Detector", "Find the surah and ayah from spoken or typed Arabic or English"),
      shipped("Search and bookmarks", "Ayah search, universal search and one bookmarks hub"),
      nf(
        "NF-3.21",
        "Ayah notes and highlights",
        "Your own reflections, colours and tags on any ayah",
        "/features/quran",
      ),
      nf(
        "NF-3.22",
        "Arabic root-word search",
        "Every word from a root, from the Quranic Arabic Corpus (an optional download of about 6 MB)",
        "/features/quran",
      ),
    ],
  },
  {
    id: "recitation",
    title: "Recitation and learning the Qur'an",
    items: [
      shipped(
        "On-device recitation listener",
        "Follow, Check, Hide words and Hide ayahs modes; voice never leaves the device",
        "/features/quran-practice",
      ),
      shipped("Spaced revision", "Ayahs come back after 1, 3, 7, 14 and 30 days"),
      shipped("Pronunciation drills", "Optional, for selected tajweed lessons"),
      shipped(
        "Learn the Qur'an",
        "Arabic letters, learn-to-read, tajweed, vocabulary, themes, stories and tadabbur",
        "/features/learn-quran",
      ),
      nf(
        "NF-3.24",
        "Pronunciation check",
        "After you recite an ayah, marks words that seem skipped or unclear, on the device",
        "/features/quran-practice",
      ),
      nf(
        "NF-3.15",
        "Tajweed coaching",
        "Tajweed sounds to practise from the ayahs you're working on, with explanations and drills",
        "/features/quran-practice",
      ),
    ],
  },
  {
    id: "knowledge",
    title: "Hadith and learning",
    items: [
      shipped(
        "Hadith library",
        "Nawawi's 40 and Riyad as-Salihin bundled; six major collections on demand",
        "/features/hadith",
      ),
      shipped("Hadith explanation and isnad", "Sharh and full chains of narration"),
      shipped("Daily hadith"),
      shipped(
        "Learning library",
        "Aqeedah, prophets with a family tree, seerah, battles, sahaba, early history, the Hereafter",
        "/learn",
      ),
      shipped(
        "Worship guides",
        "Salah guide, taharah, Friday, Laylat al-Qadr, Eid, Janazah, ruqyah, Islamic finance",
      ),
      shipped("New Muslim guide", "18 topics for the first steps", "/for/new-muslims"),
      shipped("Flash cards", "Review Qur'an, hadith, the Names of Allah and every guide"),
    ],
  },
  {
    id: "tools",
    title: "Calculators and planning",
    items: [
      shipped("Zakat calculator", "With nisab, checklist and guidance"),
      shipped("Hajj and Umrah", "Learning guide and separate rite checklists"),
      shipped("Sadaqah goals", "A giving intention and log"),
      shipped("Islamic events calendar and date converter", "Hijri and Gregorian"),
      nf(
        "NF-3.4",
        "Umrah mode",
        "A live, step-by-step companion with tawaf and sa'i counters",
        "/features/umrah-mode",
      ),
      nf(
        "NF-3.10",
        "Inheritance (mirath) calculator",
        "All four schools, with every share explained",
        "/features/islamic-will-and-inheritance",
      ),
      nf(
        "NF-3.9",
        "Islamic will (wasiyyah) builder",
        "Guided, within the one-third limit, exported as a PDF to print and witness",
        "/features/islamic-will-and-inheritance",
      ),
      nf(
        "NF-3.8",
        "Debts and trusts record",
        "What you owe and are owed, with an optional document photo, kept private and encrypted",
        "/features/islamic-will-and-inheritance",
      ),
    ],
  },
  {
    id: "progress",
    title: "Progress and reflection",
    items: [
      shipped(
        "Today's Goal",
        "Salah, zikr, Qaza and khatm in one daily checklist",
        "/features/daily-islamic-habits",
      ),
      shipped(
        "Statistics and weekly report",
        "Week, month and year views",
        "/features/worship-progress",
      ),
      shipped("Achievements and Noor levels", "Encouragement that never caps out"),
      nf(
        "NF-3.6",
        "Nightly muhasabah",
        "A private one-minute self-review each night, encrypted",
        "/features/private-reflection",
      ),
      nf(
        "NF-3.14",
        "Weekly gentle coach",
        "Kind, practical suggestions from your week, from simple rules on the device (no AI)",
        "/features/private-reflection",
      ),
      shipped(
        "Daily Qur'an reading log",
        "Records the days you read, so the weekly coach counts them accurately",
        "/features/quran",
      ),
      nf(
        "NF-3.7",
        "Family ties reminders",
        "Gentle reminders to stay in touch with relatives, kept in your encrypted vault",
        "/features/private-reflection",
      ),
    ],
  },
  {
    id: "together",
    title: "Family and community",
    items: [
      nf(
        "NF-3.16",
        "Family and kids mode",
        "Parent-managed profiles for children under 13, a kids Salah path and prophet stories; parents see fard Salah status only",
        "/features/family-and-friends",
      ),
      nf(
        "NF-3.17",
        "Accountability partner",
        'Share only a daily "done", never your goal or details',
        "/features/family-and-friends",
      ),
      nf(
        "NF-3.18",
        "Group khatm",
        "Share a khatm by juz, hizb or surah with family or friends",
        "/features/family-and-friends",
      ),
    ],
  },
  {
    id: "devices",
    title: "Devices",
    items: [
      shipped("iPhone, iPad and Android", undefined, "/features/widgets-and-devices"),
      shipped("Web app", "Works in any browser and installs as a PWA"),
      shipped("Apple TV and Android TV"),
      shipped(
        "Widgets and Live Activities",
        "Home and lock screen, Dynamic Island, Android Live Updates",
      ),
      shipped("Apple Watch and Wear OS", "Schedule, marking Salah, complications and tiles"),
      shipped("Siri and Google Assistant shortcuts", "Plus app-icon quick actions"),
    ],
  },
  {
    id: "privacy",
    title: "Privacy and personalisation",
    items: [
      shipped("No ads, no subscriptions", "Free for personal use"),
      shipped("No account needed", "Optional Google, Apple or Facebook sign-in to sync"),
      shipped("Backup and restore", "A file you keep, plus an offline download manager"),
      shipped("Sync conflict review", "Choose which version to keep when two devices disagree"),
      shipped("Notification inbox", "Announcements and reminders in one place in the app"),
      shipped("App lock", "PIN or biometrics"),
      shipped(
        "24 languages",
        "Right-to-left layouts for Arabic, Urdu, Persian, Pashto and Kurdish",
      ),
      shipped("Themes and fonts", "Light and dark, 12 accents, seasonal themes, Arabic fonts"),
      shipped("Customisable home", "Choose home modules and quick actions"),
      shipped("Source code on GitHub", "Non-commercial licence", "/open-source"),
      nf(
        "NF-3.0",
        "Encrypted private vault",
        "Muhasabah, will, debts and family contacts encrypted on the device; opt-in end-to-end encrypted sync",
        "/features/private-reflection",
      ),
      nf("NF-3.0b", "Searchable settings", "Redesigned settings grouped by topic, with search"),
    ],
  },
];

export const PLANNED_FEATURES = MUNIB_FEATURE_INVENTORY.flatMap((g) =>
  g.items.filter((i) => i.status === "planned"),
);

export const SHIPPED_FEATURE_COUNT = MUNIB_FEATURE_INVENTORY.flatMap((g) => g.items).filter(
  (i) => i.status === "shipped",
).length;

/** Translated inventory groups per locale (see `content/localized.ts`). */
const TRANSLATIONS: ContentTranslations<InventoryGroup> = { ar: arInventory, ur: urInventory };

/** The feature inventory in `locale`, English where a group isn't translated yet. */
export function getFeatureInventory(locale: Locale = DEFAULT_LOCALE): readonly InventoryGroup[] {
  return localizeEntries(MUNIB_FEATURE_INVENTORY, TRANSLATIONS, locale, (g) => g.id);
}
