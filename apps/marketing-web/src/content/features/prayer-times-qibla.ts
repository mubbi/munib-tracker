import type { FeaturePage } from "@/content/types";

export const prayerTimesQibla: FeaturePage = {
  slug: "prayer-times-qibla",
  icon: "times",
  navLabel: "Salah times & Qibla",
  navHint: "Accurate times, Adhan and compass",
  group: "everyday",
  title: "Accurate Salah times, Adhan and Qibla wherever you are",
  seoTitle: "Prayer Times, Adhan & Qibla Compass App — Free, No Ads",
  seoDescription:
    "Salah times calculated on your device with 13 methods and Hanafi or Shafi'i Asr, an Adhan with five styles, a Qibla compass and the Hijri calendar. Free.",
  description:
    "On-device Salah times with your choice of method, an optional Adhan, a Qibla compass and the Hijri calendar with Islamic events.",
  keywords: [
    "prayer times app",
    "salah times",
    "qibla compass app",
    "adhan app",
    "hijri calendar app",
  ],
  cluster: "prayer-times",
  published: "2026-11-23",
  updated: "2026-11-24",
  eyebrow: "Salah times & Qibla",
  intro:
    "Know when each Salah begins and which way to face, at home or travelling. Times are calculated on your device for your location, with the method and Asr madhab you follow.",
  hero: {
    key: "home",
    caption:
      "Today's times from Fajr to Isha, a live countdown, and the Hijri date with the moon phase.",
  },
  whatItDoes: {
    title: "What it includes",
    groups: [
      {
        title: "Salah times",
        items: [
          "Fajr, sunrise, Dhuhr, Asr, Maghrib and Isha for your location",
          "13 calculation methods and Shafi'i or Hanafi Asr",
          "Per-Salah minute adjustments to match your local Masjid",
          "High-latitude rules for places with very long or short nights",
          "A [madhhab setting](/features/my-madhhab) that Witr and the guides follow, or show all views; it can also match your Asr setting",
        ],
      },
      {
        title: "Adhan and reminders",
        items: [
          "An optional Adhan at each Salah time, with five styles",
          "Reminders before or after each Salah, with your own offsets",
          "Precise timing on Android phones when you allow exact alarms",
          "Live Activities on iOS and an ongoing notification on Android for the current Salah",
        ],
      },
      {
        title: "Qibla",
        items: [
          "A Qibla compass with the bearing in degrees and the distance to Makkah",
          "A gentle haptic when you're aligned, on phones with a compass",
          "On devices without a compass sensor, the bearing from true north",
        ],
      },
      {
        title: "Your Masjid",
        items: [
          "Find nearby masjids with the [Masjid finder](/features/masjid-finder)",
          "Keep your home Masjid's iqamah times privately, typed in or scanned from its timetable, with a countdown and an optional reminder to leave",
          "Anchor reminders and the [Salah focus lock](/features/salah-focus-lock) to iqamah time",
        ],
      },
      {
        title: "Calendar and sky",
        items: [
          "The Hijri date on the home screen, with the moon phase",
          "An Islamic events calendar",
          "A Hijri to Gregorian date converter",
          "Hijri date adjustment: a ±2-day offset plus per-month corrections, to match your local moon sighting",
          "Optional local weather",
        ],
      },
    ],
  },
  why: {
    title: "Why calculate times on your device?",
    paragraphs: [
      "Salah times depend on where you are and which convention you follow. Two apps can disagree by several minutes simply because they use different methods. Munib Tracker lets you choose the method and Asr madhab, then fine-tune each time to match your Masjid.",
      "Calculating on the device also means times keep working offline, without sending your location to a server to get them.",
      "Because the same times drive your tracker, reminders and adhkar sessions, the whole app knows what's due right now.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Set your location",
        text: "Allow location access, or search for a city if you'd rather not share GPS.",
      },
      {
        title: "Choose your method",
        text: "Pick the calculation method and Asr madhab used where you live, and adjust any time by a few minutes.",
      },
      {
        title: "Turn on the Adhan if you want it",
        text: "Choose a style and the Salah you want it for. All reminders are off until you enable them.",
      },
      {
        title: "Find the Qibla",
        text: "Open the Qibla screen and turn until the arrow lines up with the Kaaba marker.",
      },
    ],
  },
  benefits: [
    {
      title: "Matches your community",
      text: "Methods, madhab and per-Salah offsets let you line up with your local Masjid timetable.",
    },
    {
      title: "Works offline",
      text: "Times are calculated on the device, so they're there even without a connection.",
    },
    {
      title: "Privacy-friendly",
      text: "Prefer not to share GPS? Choose a city instead. Location is used on the device to calculate times.",
    },
    {
      title: "Everywhere you look",
      text: "The next Salah appears on widgets, Live Activities, Apple Watch and Wear OS.",
    },
  ],
  gallery: [
    {
      key: "qibla",
      caption:
        "The Qibla screen with the bearing and distance (shown here on a device without a compass sensor).",
    },
    { key: "watch-schedule", caption: "The next Salah on Apple Watch." },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "Matching your Masjid",
        text: "If your Masjid prays Isha five minutes later than calculated, add +5 to Isha and your reminders follow.",
      },
      {
        title: "Travelling",
        text: "Refresh your location when you land and times update for the new city, with the Qibla ready in the hotel.",
      },
      {
        title: "Long summer nights",
        text: "In northern countries, choose a high-latitude rule that gives workable Fajr and Isha times, following local guidance.",
      },
    ],
  },
  notes: [
    {
      tone: "scholar",
      text: "Calculation methods and high-latitude rules reflect different scholarly and institutional conventions. If you're unsure which to use, follow your local Masjid or ask a qualified scholar.",
    },
  ],
  faqs: [
    {
      question: "How accurate are the Salah times?",
      answer:
        "They're calculated with standard astronomical methods for your coordinates. Accuracy depends mainly on choosing the method your community uses; you can then adjust each Salah by a few minutes.",
    },
    {
      question: "Does the Qibla compass work on every phone?",
      answer:
        "It works best on phones with a compass sensor. Without one, the app shows the Qibla bearing measured clockwise from true north.",
    },
    {
      question: "Can I hear the Adhan?",
      answer:
        "Yes. You can enable an Adhan at Salah times and pick from five styles. It's off by default.",
    },
  ],
  related: [
    "salah-tracker",
    "masjid-finder",
    "widgets-and-devices",
    "daily-islamic-habits",
    "qaza-salah-tracker",
  ],
  guides: ["/resources/salah/how-to-build-a-consistent-salah-habit"],
  cta: {
    title: "Never wonder when the next Salah is",
    text: "Download Munib Tracker, set your location once, and see today's times at a glance.",
  },
};
