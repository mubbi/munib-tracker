import type { FeaturePage } from "@/content/types";

export const quran: FeaturePage = {
  slug: "quran",
  icon: "quran",
  navLabel: "Qur'an reader",
  navHint: "Read, listen and reflect offline",
  group: "quran",
  title: "Read, listen to and reflect on the Qur'an, even offline",
  seoTitle: "Offline Qur'an App with Translation, Tafsir & Audio",
  seoDescription:
    "The full Qur'an offline by surah, juz or 604-page mushaf, with word-by-word, tajweed colours, 25 translations, tafsir, reciters and a khatm plan. No ads.",
  description:
    "The full Qur'an by surah, juz or mushaf page, with word-by-word, tajweed colours, translations, tafsir, audio and a khatm plan.",
  keywords: [
    "quran app offline",
    "quran with translation app",
    "quran word by word",
    "quran tafsir app",
    "khatm planner",
  ],
  cluster: "quran-reading",
  published: "2026-11-23",
  updated: "2026-11-24",
  eyebrow: "Qur'an reader",
  intro:
    "Open the Qur'an anywhere, even without a connection. Read by surah, juz or mushaf page, follow word by word, listen to a reciter, and keep a steady pace with a khatm plan.",
  hero: {
    key: "quran",
    caption:
      "Continue where you stopped, search ayahs, browse by page or juz, and open your khatm plan.",
  },
  whatItDoes: {
    title: "What's inside the reader",
    groups: [
      {
        title: "Read your way",
        items: [
          "All 114 surahs and 6,236 ayahs, bundled for offline reading",
          "Browse by surah, by juz, or as the 604-page mushaf",
          "Two facing pages on wide screens, and an immersive full-screen mode",
          "Arabic font families and sizes you can change while reading",
        ],
      },
      {
        title: "Understand what you read",
        items: [
          "Word-by-word meanings and tajweed colouring",
          "25 translation editions (two bundled, the rest on demand), shown side by side if you like",
          "Tafsir on demand in several languages",
          "Search ayahs by words, or find a surah by name, meaning or number",
          "Arabic root-word search: every word from a root, from the Quranic Arabic Corpus (an optional download of about 6 MB, credited in the app)",
          "Verse Detector: find the surah and ayah from a verse you say or type, in Arabic or English",
        ],
      },
      {
        title: "Listen",
        items: [
          "Ayah-by-ayah and full-surah playback",
          "A choice of reciters",
          "Download audio for offline listening and manage it in Settings",
        ],
      },
      {
        title: "Keep going",
        items: [
          "Continue reading from the last ayah you opened",
          "Bookmarks across the whole Qur'an",
          "A khatm plan with a daily target and catch-up on the home screen",
          "A daily reading log of the days you spent with the Qur'an, which the weekly coach uses",
          "A hifz tracker for ayahs you've memorized or need to review",
          "Your own notes, highlights (five colours, on a whole ayah or, in mushaf page view, on a few words) and tags on any ayah, kept as your reflections, never presented as tafsir",
          "Group khatm with family or friends, split into 30 juz, 60 hizb or 114 surahs; see [Family & friends](/features/family-and-friends)",
        ],
      },
    ],
  },
  why: {
    title: "Why another Qur'an reader?",
    paragraphs: [
      "Plenty of apps let you read the Qur'an. What's harder to find is one that stays out of the way: no ads between surahs, no account wall, and no need for a signal to open it.",
      "Munib Tracker's reader is also connected to the rest of your day. Your khatm target sits next to your Salah in Today's Goal, so reading becomes part of the routine rather than something you remember once a week.",
      "And when you want to go further, the same ayah opens into [Qur'an practice](/features/quran-practice) for memorization and revision, or into the [Learn the Qur'an](/features/learn-quran) lessons.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Open a surah or page",
        text: "Pick from the surah list, a juz, or a mushaf page. Your place is saved automatically.",
      },
      {
        title: "Choose your view",
        text: "Turn on word-by-word, tajweed colours, a translation or two, and the font size that's comfortable.",
      },
      {
        title: "Set a khatm plan",
        text: "Choose when you want to finish. The app works out a daily target and shows it on the home screen.",
      },
      {
        title: "Listen and reflect",
        text: "Play any ayah or a whole surah, and open tafsir when you want to understand more.",
      },
    ],
  },
  benefits: [
    {
      title: "Offline first",
      text: "The Arabic text and two translations are bundled. Extra translations, tafsir and audio download once and stay on your device.",
    },
    {
      title: "From reliable open sources",
      text: "Text, translations and tafsir come from established open datasets, credited on our [content sources page](/credits).",
    },
    {
      title: "A steady pace",
      text: 'Khatm plans turn "I should read more" into a few pages a day, with a gentle catch-up when you fall behind.',
    },
    {
      title: "Comfortable to read",
      text: "Several Arabic fonts, adjustable sizes, light and dark themes, and full-screen reading.",
    },
  ],
  gallery: [
    { key: "quran-light", caption: "The surah list in the light theme." },
    {
      key: "offline-data",
      caption: "Downloaded translations, fonts and audio, managed in Settings.",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "A juz in Ramadan",
        text: "Set a 30-day khatm plan at the start of Ramadan. If you miss a day, the catch-up card shows how many ayahs bring you back on track.",
      },
      {
        title: "Studying a surah",
        text: "Read Surah Al-Kahf on Friday with a translation side by side, then open tafsir on the ayahs you want to think about.",
      },
      {
        title: "On a flight",
        text: "Download your reciter's audio before you travel and listen without a connection.",
      },
    ],
  },
  faqs: [
    {
      question: "Does the Qur'an work without internet?",
      answer:
        "Yes. The full Arabic text and two translations are bundled. Other translations, tafsir and recitation audio download on demand and are cached for offline use.",
    },
    {
      question: "Which translations are available?",
      answer:
        "25 translation editions in several languages. Two are bundled with the app; the others download when you choose them.",
    },
    {
      question: "Can I see the mushaf page layout?",
      answer:
        "Yes. There's a 604-page mushaf view, with two facing pages on landscape tablets and wide screens.",
    },
    {
      question: "Is there a reading plan?",
      answer:
        "Yes. The khatm plan sets a daily target from the date you want to finish and shows your progress on the home screen and tracker.",
    },
  ],
  related: ["quran-practice", "learn-quran", "daily-islamic-habits", "worship-progress"],
  guides: [
    "/resources/quran-learning/how-to-practice-quran-reading-every-day",
    "/resources/quran-learning/how-to-start-learning-the-quran",
  ],
  cta: {
    title: "Carry the Qur'an with you",
    text: "Download Munib Tracker and pick up where you left off, online or offline.",
  },
};
