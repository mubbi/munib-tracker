export type AppFeatureIcon =
  | "quran"
  | "hadith"
  | "dhikr"
  | "tracker"
  | "audio"
  | "reminders"
  | "learn"
  | "guides"
  | "times";

export type AppFeaturePillar = {
  id: string;
  title: string;
  summary: string;
  highlights: string[];
};

export type AppHomeFeature = {
  id: string;
  title: string;
  description: string;
  icon: AppFeatureIcon;
};

export type AppValueProp = {
  title: string;
  description: string;
};

/** Core product pillars — used on the marketing site and for in-app positioning. */
export const APP_FEATURE_PILLARS: AppFeaturePillar[] = [
  {
    id: "prayer",
    title: "Salah on your journey",
    summary:
      "Log each prayer as you walk back to Allah — completed, missed, delayed, or qaza — with streaks, notes, and an honest calendar.",
    highlights: [
      "Five fard prayers plus Witr (sunnah mu'akkadah) and five sunnah categories",
      "Progress ring, streaks, and gentle encouragement",
      "Calendar with prayed, partial, and missed days",
      "Prayer times hero with Hijri date, moon phase, and countdown",
    ],
  },
  {
    id: "qaza",
    title: "Make up what was missed",
    summary:
      "Turn qaza from overwhelming to doable — estimate, plan a daily pace, and track roza with scholar-aware guidance.",
    highlights: [
      "Per-prayer counters with auto-sync from missed tracker entries",
      "Lifetime calculator with scholar disclaimer",
      "Daily pace planner with ETA to clear your backlog",
      "Missed fast (roza) tracking and estimates",
    ],
  },
  {
    id: "dhikr",
    title: "Remember Allah daily",
    summary:
      "Morning, evening, and situational adhkar with favorites, daily progress, and a tactile tasbeeh counter.",
    highlights: [
      "54 adhkar across seven categories plus favorites you can reorder",
      "Custom adhkar builder with speech-to-text and a free tasbeeh counter",
      "Zikr-linked counters that save to your daily goal",
      "Bedtime-aware before-sleep reminders",
    ],
  },
  {
    id: "library",
    title: "Qur'an, hadith & duas offline",
    summary:
      "Read, search, and listen — Qur'an, hadith, duas, duroods, and the 99 Names bundled for the road.",
    highlights: [
      "Full mushaf: surah, juz, 604-page view, word-by-word, and tajweed coloring",
      "25 translation editions (two bundled), 123 tafsir editions on demand, eight reciters",
      "Bundled Nawawi 40 & Riyad as-Salihin; six major collections on demand",
      "271 duas, 54 adhkar, nine duroods, 99 Names, and universal fuzzy search",
    ],
  },
  {
    id: "learn",
    title: "Learn your deen",
    summary:
      "Study creed, the prophets, the seerah, and the Hereafter — structured lessons with progress, quizzes, and citations, not just a feed.",
    highlights: [
      "Aqeedah (24 topics), 25 prophets, 30-event seerah, and 21 major battles",
      "Jannah (45 topics), Jahannam (16), and the Last Day (20) with an interactive quiz",
      "Sahaba (30), early Islamic history (15), learn dua (46), and new-Muslim guide (18)",
      "Laylat al-Qadr, Eid, ruqyah, and Islamic finance — every lesson cited to source",
    ],
  },
  {
    id: "quran-learning",
    title: "Understand the Qur'an",
    summary:
      "Go from the Arabic letters to tajweed, memorization, and reflection — a guided path to read, understand, and live the Qur'an.",
    highlights: [
      "Letter-by-letter alphabet, pronunciation drills, and tajweed rules",
      "Memorization plans, themes, prophet stories, and vocabulary",
      "Daily tadabbur reflections and apply-it challenges",
      "One tap into the full mushaf reader to keep going",
    ],
  },
  {
    id: "guides",
    title: "Step-by-step worship guides",
    summary:
      "Learn how to pray, purify, fast, and give — practical fiqh guides with checklists, calculators, and clear evidence.",
    highlights: [
      "Salah guide (24 lessons) plus taharah (28 topics) with a daily checklist",
      "Zakat calculator, sadaqah tracking, and a 60-step hajj & umrah tracker",
      "Travel (qasr/jam'), illness, and hayd — worship at your capacity",
      "Ramadan tracker, tahajjud log, and khushu' prayer journal",
    ],
  },
  {
    id: "times",
    title: "Prayer times & qibla",
    summary:
      "Know when to pray and which way to face — accurate times, Hijri calendar, moon insights, and qibla compass.",
    highlights: [
      "GPS or city search with 13 calculation methods and Asr madhab",
      "Per-prayer tuning, high-latitude rules, and reminder offsets",
      "Hijri events calendar, moon phase, and optional weather",
      "Qibla compass with alignment haptic (native)",
    ],
  },
  {
    id: "insights",
    title: "See your progress",
    summary:
      "Statistics, achievements, and reminders that encourage the journey — never shame you for where you are.",
    highlights: [
      "Week, month, and year charts plus a weekly worship report",
      "Infinite Salah, Streak, Zikr, and Consistency tracks that never cap out",
      "Growing Noor devotion levels and today's combined salah + dhikr goal",
      "Optional prayer, zikr, qaza, daily content, and Friday reminders",
    ],
  },
  {
    id: "search",
    title: "Find guidance quickly",
    summary: "One search bar across ayahs, hadith, duas, adhkar, duroods, and the Names of Allah.",
    highlights: [
      "Fuzzy, typo-tolerant offline search",
      "Arabic-aware text normalization",
      "Category filters and recent searches",
      "Heavy Qur'an ayah index deferred for smooth scrolling",
    ],
  },
  {
    id: "personalize",
    title: "Make the app yours",
    summary:
      "Light, dark, or system theme — twelve accent presets, custom colors, fonts, and twenty-three languages.",
    highlights: [
      "23 UI locales with RTL for Arabic, Urdu, Persian, Pashto, and Kurdish",
      "12 accent colors plus custom hex picker; seasonal Hijri themes",
      "Arabic font families (Amiri, Scheherazade, Noto Naskh, QPC Hafs) and sizes",
      "Customizable home modules, quick actions, and library order",
    ],
  },
  {
    id: "privacy",
    title: "Private by default",
    summary:
      "Your journey stays on your device until you choose to sign in and sync across devices.",
    highlights: [
      "No account required for full functionality",
      "Local backup export/import and offline download manager",
      "Optional Google, Apple, or Facebook sign-in for cross-device sync",
      "Optional PIN / biometric app lock on native",
      "No ads in the app; delete account and data anytime",
    ],
  },
  {
    id: "platform",
    title: "Wherever you are",
    summary:
      "iOS, Android, and web — plus widgets, Live Activities, Watch, Wear, and voice shortcuts.",
    highlights: [
      "Home-screen widgets and iOS Live Activities / Dynamic Island",
      "Apple Watch and Wear OS companions to view and mark salah",
      "Siri and Google Assistant shortcuts; app-icon quick actions",
      "PWA-friendly web with sync when signed in — free for personal use",
    ],
  },
];

/** Highlight cards for the marketing home page. */
export const APP_HOME_FEATURES: AppHomeFeature[] = [
  {
    id: "tracker",
    title: "Salah tracking",
    description:
      "Mark each prayer on your journey — build streaks, review your calendar, and unlock milestones.",
    icon: "tracker",
  },
  {
    id: "dhikr",
    title: "Dhikr & tasbeeh",
    description: "Remember Allah throughout the day with categorized adhkar and a tactile counter.",
    icon: "dhikr",
  },
  {
    id: "quran",
    title: "Qur'an reader",
    description:
      "Surah, juz, and 604-page mushaf — translations, tafsir, recitation, khatm, and hifz offline.",
    icon: "quran",
  },
  {
    id: "hadith",
    title: "Hadith library",
    description:
      "Bundled highlights plus six major collections on demand — searchable with grades and narrators.",
    icon: "hadith",
  },
  {
    id: "learn",
    title: "Learn your deen",
    description:
      "Creed, prophets, seerah, companions, dua, and the Hereafter — 350+ cited lessons with progress.",
    icon: "learn",
  },
  {
    id: "guides",
    title: "Worship guides",
    description:
      "How to pray, make wudu, calculate zakat, and perform hajj — practical fiqh, step by step.",
    icon: "guides",
  },
  {
    id: "times",
    title: "Prayer times & qibla",
    description:
      "Accurate times for your location, the Hijri calendar with events, and a qibla compass.",
    icon: "times",
  },
  {
    id: "audio",
    title: "Audio recitation",
    description: "Per-ayah and surah playback with reciter selection. 99 Names with play-all mode.",
    icon: "audio",
  },
  {
    id: "reminders",
    title: "Gentle reminders",
    description:
      "Prayer, adhan styles, adhkar, qaza, daily content, and Friday nudges — all off until you enable them.",
    icon: "reminders",
  },
];

/** Onboarding-aligned value props for marketing. */
export const APP_VALUE_PROPS: AppValueProp[] = [
  {
    title: "Track your prayers",
    description:
      "Log salah each day and grow your streak one step at a time on the path back to Allah.",
  },
  {
    title: "Clear your qaza",
    description: "Estimate missed prayers and plan a steady pace to make them up.",
  },
  {
    title: "Remember Allah",
    description: "Adhkar for every part of the day, plus a tactile tasbeeh counter.",
  },
  {
    title: "Gentle reminders",
    description: "Optional nudges for prayer, zikr, and qaza — always in your control.",
  },
];

export const APP_ACHIEVEMENTS = [
  {
    name: "Devotion Levels",
    trigger: "Grow Noor from salah, qaza, zikr, and perfect days — levels never cap out",
  },
  {
    name: "Salah Track",
    trigger: "Reach the next prayer count milestone — from your first salah to thousands",
  },
  {
    name: "Streak Track",
    trigger: "Build consecutive prayer days — targets grow from 1 day to a full year and beyond",
  },
  {
    name: "Qaza & Roza debt",
    trigger:
      "When you track qaza or missed fasts, goals match your current debt — and disappear when cleared",
  },
  {
    name: "Zikr Track",
    trigger: "Complete remembrance sessions — milestones scale with your dhikr habit",
  },
  {
    name: "Consistency Track",
    trigger: "Perfect days with all five fard prayers — always a next target waiting",
  },
] as const;
