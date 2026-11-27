import type { FeaturePage } from "@/content/types";

export const hifzTracker: FeaturePage = {
  slug: "hifz-tracker",
  icon: "hifz",
  navLabel: "Hifz tracker",
  navHint: "Mark ayahs, hide and recite, revise on time",
  group: "quran",
  title: "A hifz tracker that remembers what you've memorized and when to revise it",
  seoTitle: "Hifz Tracker App — Memorize the Qur'an and Revise on Schedule",
  seoDescription:
    "Mark ayahs memorized, test yourself with Hide words and Hide ayahs, and revise after 1, 3, 7, 14 and 30 days. Private, on your device, free, with no scores.",
  description:
    "Mark the ayahs you've memorized, practise them with the text hidden, and let a spaced revision queue bring each one back on the right day.",
  keywords: [
    "hifz tracker",
    "quran memorization tracker",
    "hifz revision app",
    "quran revision schedule",
    "hifz app for kids",
  ],
  cluster: "quran-practice",
  published: "2026-11-27",
  updated: "2026-11-27",
  eyebrow: "Hifz tracker",
  intro:
    "Memorizing a page is the easy half. Keeping it is the hard half. Munib Tracker gives you one list of what you have memorized, two ways to recite with the text hidden, and a revision queue that brings every ayah back before it fades.",
  hero: null,
  whatItDoes: {
    title: "What the hifz tracker does",
    intro:
      "It has three parts that work together: a list of your ayahs, practice with the text hidden, and a revision queue.",
    groups: [
      {
        title: "Your hifz list",
        items: [
          "Mark any ayah in the reader as Memorized or Needs review",
          "See every marked ayah in one list, with its surah, ayah number and mushaf page",
          "Totals at the top: how many ayahs are memorized and how many are waiting for review",
          "Change an ayah's status or remove it from the list, with an Undo if you slip",
          "Tap a row to open that ayah in the [Qur'an reader](/features/quran)",
        ],
      },
      {
        title: "Recite with the text hidden",
        items: [
          "**Hide words:** every word after the first is covered and appears as you recite it",
          "**Hide ayahs:** the whole ayah stays covered until you finish or tap Reveal",
          "An on-device listener follows you word by word and marks the words to try again",
          "Hear the reciter first, once or before every ayah, then recite it yourself",
          "Without the listener you can still play the reciter and reveal the words by hand",
        ],
      },
      {
        title: "A revision queue that keeps the dates",
        items: [
          "Ayahs you practise in Check or a Hide mode come back after 1, 3, 7, 14, then 30 days",
          "Due ayahs are listed oldest first, with a note when one is overdue",
          "A daily limit you set, so a busy week never becomes a mountain of revision",
          "Ayahs you marked Needs review in your hifz list can join the same queue",
          'An "ayahs to revise" card on the home screen and an optional revision reminder',
          "A summary after each session with the ayahs to practise again and the next revision date",
        ],
      },
      {
        title: "Plans and encouragement",
        items: [
          "Four memorization plans in [Learn the Qur'an](/features/learn-quran): Juz Amma for beginners, ten core surahs, one full juz, and the hafiz journey",
          "A Recitation track in achievements, with milestones such as your first session, a seven-day revision streak and 100 ayahs recited",
          "The track is personal: it is never shared and never compared with anyone",
          "Ayahs you recite in practice count towards your daily reading log and your khatm plan, unless you turn that off",
        ],
      },
      {
        title: "For children",
        items: [
          "A recite-along in [kids mode](/features/kids-mode) with short surahs, one ayah at a time",
          'Words light up as the child recites, with a gentle "let\'s try these words again"',
          "No scores for children either, and the child's voice stays on the device",
        ],
      },
      {
        title: "Private by default",
        items: [
          "Your voice is processed on your device; it is never recorded, stored or uploaded",
          "The listener is a one-time optional download of about 70 MB, and works offline afterwards",
          "Marking ayahs and keeping your hifz list needs no download at all",
        ],
      },
    ],
  },
  why: {
    title: "Why does hifz need a tracker?",
    paragraphs: [
      "Ask anyone who has memorized a few juz what went wrong and the answer is nearly always the same: new pages kept coming and the old ones were quietly left behind. Nobody decides to forget a surah. It simply stops being revised.",
      'A paper chart can tell you what you learned, but it can\'t tell you what is due today. A dated queue can. It turns "I should revise" into a short list you can finish in one sitting.',
      "Reciting with the text hidden is where the real test happens. Doing it against a listener, alone and without embarrassment, shows you the word you keep dropping before your teacher has to.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Mark what you already know",
        text: "Open a surah in the reader and mark each ayah you have memorized. Mark the shaky ones Needs review.",
      },
      {
        title: "Download the listener once",
        text: "In Settings, open Qur'an practice and fetch the on-device listener. It is optional and about 70 MB.",
      },
      {
        title: "Practise with the text hidden",
        text: "Choose a passage, pick Hide words or Hide ayahs, tap the microphone and recite from memory.",
      },
      {
        title: "Let the queue do the remembering",
        text: "Open Revision when the home card says ayahs are due, and recite them before adding anything new.",
      },
      {
        title: "Take it to your teacher",
        text: "Use your list to show what you covered this week, and recite it to someone qualified.",
      },
    ],
  },
  benefits: [
    {
      title: "Nothing slips away quietly",
      text: "Every ayah you practise has a next revision date, so old portions come back without you planning it.",
    },
    {
      title: "Small enough to finish",
      text: "The daily limit keeps each sitting short. Whatever is left simply waits for another day.",
    },
    {
      title: "Gentle feedback",
      text: "Words to try again are marked softly. There are no scores, grades or percentages anywhere.",
    },
    {
      title: "Free, with no ads",
      text: "The tracker, the hide modes and the revision queue are all free. Full details of the listener are on the [Qur'an practice page](/features/quran-practice).",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "Starting Juz Amma",
        text: "Follow the beginner plan, learn a short surah with the reciter, then switch to Hide words until you no longer need to peek.",
      },
      {
        title: "Holding on to what you have",
        text: "Mark the surahs you learned years ago as Needs review and let the queue feed them back to you a few ayahs a day.",
      },
      {
        title: "Before your weekly lesson",
        text: "Recite this week's portion in Hide ayahs the night before, and repeat the ayahs the summary lists to practise again.",
      },
    ],
  },
  notes: [
    {
      tone: "info",
      title: "What it does not do",
      text: "The hifz list records what you tell it; it does not test or certify your memorization. The listener follows which words you said and marks the ones to try again. It does not judge tajweed or how each letter is pronounced, it misses some mistakes, and it gives no score. It works best in a quiet room, with one voice, at a normal recitation pace, and may be less reliable for children's voices. None of this replaces reciting to a qualified teacher.",
    },
    {
      tone: "app",
      title: "Where it works",
      text: "Practice with the listener is available in the iPhone, Android and web apps. Some older or low-memory devices can't run the listener; on those you can still play the reciter and reveal words by hand. The Recitation achievements track is not shown on TV.",
    },
  ],
  faqs: [
    {
      question: "What is the best way to track Qur'an memorization?",
      answer:
        "Keep two things: a list of every ayah you have memorized, and a dated schedule for revising it. Munib Tracker does both. You mark ayahs in the reader, and the revision queue brings each practised ayah back after 1, 3, 7, 14 and then 30 days.",
    },
    {
      question: "Is there a free hifz tracker app?",
      answer:
        "Yes. The hifz tracker in Munib Tracker is free, with no ads and no subscription. That includes the hide modes, the revision queue and the reminder.",
    },
    {
      question: "How does the revision schedule work?",
      answer:
        "Each ayah you practise in Check, Hide words or Hide ayahs is given a next revision date: after 1 day, then 3, 7, 14 and 30. Due ayahs appear in Revision, oldest first, up to the daily limit you set. The rest wait for the following days.",
    },
    {
      question: "Does the app check my memorization or correct my tajweed?",
      answer:
        "No, it does not correct tajweed or grade you. The on-device listener follows your recitation word by word and marks words to try again, such as a word you skipped. It is a practice aid for the time between lessons, and it does not replace a teacher.",
    },
    {
      question: "Does it record my voice while I recite?",
      answer:
        "No. Your recitation is processed on your device and is never recorded, saved or uploaded. Practice keeps only counts and ayah numbers so it can schedule your revision.",
    },
    {
      question: "Can children use it for hifz?",
      answer:
        "Yes, with a parent or teacher beside them. Kids mode has its own recite-along for short surahs, where words light up as the child recites and nothing is scored. The listener may be less reliable for children's voices. See our guide on [how to memorize the Qur'an](/resources/quran-learning/how-to-memorize-the-quran).",
    },
  ],
  related: ["quran-practice", "quran", "learn-quran", "kids-mode"],
  guides: ["/resources/quran-learning/how-to-memorize-the-quran"],
  cta: {
    title: "Start with the surahs you already know",
    text: "Download Munib Tracker, mark what you have memorized, and let the revision queue bring it back on time.",
  },
};
