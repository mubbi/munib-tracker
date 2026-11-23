import type { FeaturePage } from "@/content/types";

export const zikrTracker: FeaturePage = {
  slug: "zikr-tracker",
  icon: "zikr",
  navLabel: "Zikr & tasbeeh",
  navHint: "Daily adhkar and a tasbeeh counter",
  group: "track",
  title: "Zikr tracker and tasbeeh counter for every part of your day",
  seoTitle: "Zikr Tracker & Tasbeeh Counter — Daily Adhkar App",
  seoDescription:
    "Morning, evening, after-Salah and bedtime adhkar with their source hadith, guided sessions, a tasbeeh counter and 279 duas. Free, offline and ad-free.",
  description:
    "Guided morning, evening, after-Salah and bedtime adhkar with sources, a tasbeeh counter, duas and your own custom adhkar.",
  keywords: [
    "zikr tracker",
    "dhikr tracker app",
    "tasbeeh counter",
    "daily adhkar app",
    "morning and evening adhkar",
  ],
  cluster: "zikr",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "Zikr tracker",
  intro:
    "Remember Allah throughout the day with the adhkar the Prophet ﷺ taught, each shown with its source. Follow a guided session after Salah, count with a tactile tasbeeh, and keep track of what you've said today.",
  hero: {
    key: "zikr",
    caption: "Adhkar organised by time of day, with favorites, search and your own custom adhkar.",
  },
  whatItDoes: {
    title: "What you get",
    groups: [
      {
        title: "Adhkar with their sources",
        items: [
          "60 adhkar in seven categories, including morning, evening, after Salah and before sleep",
          "Arabic, transliteration and translation for each one",
          "The full source hadith for each zikr, so you can see where it comes from",
          "Favorites you can reorder, and search across every zikr",
        ],
      },
      {
        title: "Guided sessions",
        items: [
          "One screen per session: tap to count and it moves to the next zikr by itself",
          "Sessions for morning, evening, before sleep and after each Salah",
          "Done, pending and missed status based on the time windows of your day",
          "Mark one zikr or the whole session complete",
        ],
      },
      {
        title: "Tasbeeh counter",
        items: [
          "Targets of 33, 99, 100, unlimited or a custom number",
          "Counter designs: the classic ring, sliding beads and more, with optional sound and haptics",
          "Hands-free counting: say the zikr aloud and it counts, recognised on your device",
          "Undo and reset, with haptic feedback on phones",
          "A Tasbeeh tile on Wear OS and a shortcut on Apple Watch",
          "Counts linked to a zikr save towards your daily goal",
        ],
      },
      {
        title: "Duas and more",
        items: [
          "279 duas from Hisnul Muslim in 16 categories",
          "Nine duroods (salawat) and the 99 Names of Allah with audio",
          "A custom adhkar builder with speech-to-text",
          "Optional reminders for morning, evening and before-sleep adhkar",
        ],
      },
    ],
  },
  why: {
    title: "Why keep a Zikr routine?",
    paragraphs: [
      "Zikr (also written dhikr) is one of the lightest acts of worship to carry with you. It needs no special place or time, but because it can be done anytime, it's also easy to forget entirely.",
      "Anchoring adhkar to moments you already have, like after each Salah, the morning, the evening and bedtime, turns good intentions into a routine. A tracker shows you which of those moments you're keeping and which keep slipping.",
      "Seeing the source of each zikr also matters. When you know a hadith behind the words, they stop being a formula and start to mean something.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Open a session",
        text: "Pick morning, evening, before sleep, or the session after the Salah you just prayed.",
      },
      {
        title: "Tap to count",
        text: "Each tap counts one repetition. When you reach the number for a zikr, the next one appears.",
      },
      {
        title: "Read the meaning and source",
        text: "Open any zikr to see its translation and the full hadith it comes from.",
      },
      {
        title: "See your progress",
        text: "Completed adhkar count towards Today's Goal and your statistics, and earn Noor towards your devotion level.",
      },
    ],
  },
  benefits: [
    {
      title: "Authentic and cited",
      text: "Adhkar and duas come from established open datasets, Hisnul Muslim included, and every zikr shows its source hadith.",
    },
    {
      title: "Built around your Salah",
      text: "Sessions follow your day's Salah times, so the app knows what's due now and what you've already done.",
    },
    {
      title: "Works without signal",
      text: "Adhkar, duas and the counter work offline, which is handy on a commute or a flight.",
    },
    {
      title: "Calm by design",
      text: "No ads, no feeds and no distractions between you and your remembrance.",
    },
  ],
  gallery: [
    {
      key: "tasbeeh",
      caption: "The tasbeeh counter with 33, 99, 100, unlimited and custom targets.",
    },
    { key: "wear-tasbeeh-tile", caption: "The Tasbeeh tile on Wear OS." },
    { key: "names", caption: "The 99 Names of Allah with meanings and audio." },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "After every Salah",
        text: "Stay seated for two minutes and run the after-Salah session: istighfar, the tasbeeh, tahmid and takbir, and Ayat al-Kursi.",
      },
      {
        title: "Morning on the commute",
        text: "Open the morning session on the bus or train. If you stop halfway, it remembers where you were.",
      },
      {
        title: "Building your own list",
        text: "Add a dua your teacher gave you in the adhkar builder, with Arabic and meaning, and count it like any other zikr.",
      },
    ],
  },
  faqs: [
    {
      question: "Where do the adhkar come from?",
      answer:
        "From established open-source datasets, including the full Hisnul Muslim collection, with source hadith taken verbatim from public hadith databases. Full credits are on the [credits page](/credits).",
    },
    {
      question: "Is there a free tasbeeh counter?",
      answer:
        "Yes. The tasbeeh counter is free, has no ads, and lets you set 33, 99, 100, unlimited or any custom target.",
    },
    {
      question: "Can I get reminders for morning and evening adhkar?",
      answer:
        "Yes. Morning, evening and before-sleep reminders are available. They're off until you switch them on, and the before-sleep reminder uses your bedtime.",
    },
    {
      question: "Can I add my own zikr?",
      answer:
        "Yes. The custom adhkar builder lets you add Arabic, transliteration and translation, and you can dictate with speech-to-text.",
    },
    {
      question: "Can I count tasbeeh without tapping?",
      answer:
        "Yes. Turn on hands-free counting and say the zikr aloud; the counter counts each one it recognises. Recognition happens on your device and no audio is saved or uploaded.",
    },
  ],
  related: ["salah-tracker", "daily-islamic-habits", "worship-progress", "widgets-and-devices"],
  guides: [
    "/resources/zikr/how-to-build-a-daily-zikr-routine",
    "/resources/zikr/morning-and-evening-adhkar",
  ],
  cta: {
    title: "Make remembrance part of every day",
    text: "Download Munib Tracker and start with tonight's before-sleep adhkar. They take about five minutes.",
  },
};
