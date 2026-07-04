export type AppFeatureIcon = "quran" | "hadith" | "dhikr" | "tracker" | "audio" | "reminders";

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
      "Seven adhkar categories plus favorites you can reorder",
      "Free tasbeeh with presets and custom targets",
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
      "Full Qur'an with recitation, bookmarks, and ayah search",
      "Bundled Nawawi 40 & Riyad as-Salihin; six books on demand",
      "Duas by category, duroods, and 99 Names with audio",
      "Universal fuzzy search across all corpora",
    ],
  },
  {
    id: "times",
    title: "Prayer times & qibla",
    summary:
      "Know when to pray and which way to face — accurate times, Hijri calendar, moon insights, and qibla compass.",
    highlights: [
      "GPS or city search for location",
      "Gregorian or Hijri month views",
      "Moon phase on the home hero",
      "Qibla compass with alignment haptic (native)",
    ],
  },
  {
    id: "insights",
    title: "See your progress",
    summary:
      "Statistics, achievements, and reminders that encourage the journey — never shame you for where you are.",
    highlights: [
      "Week, month, and year charts for prayers and zikr",
      "Nine milestone badges from first prayer to clearing qaza",
      "Today's goal combining salah and dhikr progress",
      "Optional prayer, zikr, and qaza reminders",
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
      "Light, dark, or system theme — twelve accent presets, custom colors, fonts, and three languages.",
    highlights: [
      "Warm cream and deep-forest palettes",
      "12 accent colors plus custom hex picker",
      "Separate Arabic and translation font sizes",
      "English, Arabic (RTL), and Urdu",
    ],
  },
  {
    id: "privacy",
    title: "Private by default",
    summary:
      "Your journey stays on your device until you choose to sign in and sync with Google or Apple.",
    highlights: [
      "No account required for full functionality",
      "Local-first storage with optional backup",
      "No ads or behavioural tracking SDKs",
      "Delete account and data anytime",
    ],
  },
  {
    id: "platform",
    title: "Wherever you are",
    summary: "iOS, Android, and web — the same calm companion on phone, tablet, or browser.",
    highlights: [
      "Native tabs and haptics on mobile",
      "PWA-friendly web with notification support",
      "Sync across devices when signed in",
      "Free for personal and educational use",
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
      "Read with Arabic, transliteration, and translation. Bookmark ayahs, listen, and search offline.",
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
    id: "audio",
    title: "Audio recitation",
    description: "Per-ayah and surah playback with reciter selection. 99 Names with play-all mode.",
    icon: "audio",
  },
  {
    id: "reminders",
    title: "Gentle reminders",
    description:
      "Optional nudges for prayer, zikr, and qaza — every category off until you enable it.",
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
