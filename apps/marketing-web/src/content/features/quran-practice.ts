import type { FeaturePage } from "@/content/types";

export const quranPractice: FeaturePage = {
  slug: "quran-practice",
  icon: "practice",
  navLabel: "Qur'an practice (AI)",
  navHint: "Recite and it follows along",
  group: "quran",
  title: "Practise your Qur'an recitation with an on-device AI listener",
  seoTitle: "Qur'an Recitation Practice App with On-Device AI",
  seoDescription:
    "Recite and an on-device AI listener follows you word by word, marks words to try again, and schedules revision. Private, offline and free, with no scores.",
  description:
    "Recite and an on-device listener follows you word by word, shows words to try again, and brings ayahs back for revision.",
  keywords: [
    "quran practice app",
    "quran recitation practice",
    "ai quran recitation",
    "quran memorization app",
    "quran recitation correction",
  ],
  cluster: "quran-practice",
  published: "2026-11-23",
  updated: "2026-11-24",
  eyebrow: "Qur'an practice",
  intro:
    "Tap the microphone and recite. An AI listener running on your own device follows along word by word, then shows which words to try again. Use it to memorize, revise and build confidence between lessons with your teacher, privately and for free.",
  hero: null,
  whatItDoes: {
    title: "What Qur'an practice does",
    intro: "Practice has four modes, from reading along to reciting a whole ayah from memory.",
    groups: [
      {
        title: "Four practice modes",
        items: [
          "**Follow:** recite with the text in front of you while the listener follows word by word",
          "**Check:** after each ayah, see any words the listener didn't hear as expected",
          "**Hide words:** words are covered after the first and reveal themselves as you recite them",
          "**Hide ayahs:** the whole ayah stays covered until you finish or tap Reveal",
        ],
      },
      {
        title: "Revision that remembers",
        items: [
          "Ayahs you practise come back when they're due: after 1, 3, 7, 14, then 30 days",
          "A daily limit so revision never piles up",
          "An optional revision reminder",
          "A summary at the end of each session with the ayahs to practise again",
        ],
      },
      {
        title: "Gentle feedback",
        items: [
          "Words to try again are marked softly; there are no scores or grades",
          "Choose when marks appear: while you recite, after each ayah, or at the end",
          "Hear the reciter before you start, or before every ayah",
          "If the listener isn't sure about a word, it says so instead of guessing",
        ],
      },
      {
        title: "Pronunciation check",
        items: [
          "Read the ayah on screen aloud, then tap Done",
          "Words that seem skipped or unclear are marked gently, never in red, so you can listen to them again",
          "Tap any word to hear the reciter, then read the ayah again",
          "If the reading doesn't match the ayah on screen, it says it couldn't follow instead of guessing",
        ],
      },
      {
        title: "Tajweed coaching",
        items: [
          "A short plan of tajweed sounds that appear in the ayahs you're working on, with words from your own recitation as examples",
          "Words the pronunciation check marked can be used as examples (you can turn this off)",
          "Plain explanations of each rule, such as qalqalah, ghunnah, shaddah, madd and the sun letters",
          "Short sound drills for qalqalah, ghunnah and shaddah, and listen-and-repeat cards for the others",
          "Spaced practice: each sound shows how often you've practised it and when it comes back, never a score",
        ],
      },
      {
        title: "Private and offline",
        items: [
          "Your voice is processed on your device; it is never recorded, stored or uploaded",
          "The listener is a one-time optional download of about 70 MB",
          "After that, practice works without a connection",
        ],
      },
    ],
  },
  why: {
    title: "Why practise with a listener?",
    paragraphs: [
      "Most memorization happens alone: in the car, before Fajr, or in the few minutes after a class. Without someone listening, it's easy to skip a word or swap one ayah for a similar one and not notice for weeks.",
      "An on-device listener gives you a second pair of ears for that solo time. It can't replace a teacher, but it can catch the words you dropped and bring an ayah back before you forget it.",
      "Because everything happens on your phone, you can practise anywhere without worrying about who is hearing your recitation.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Download the listener once",
        text: "Go to Settings, then Qur'an practice, and download the on-device listener (about 70 MB). Reading and listening work without it.",
      },
      {
        title: "Choose a passage and a mode",
        text: "Start from where you last read, or pick any surah and ayah range. Choose Follow, Check, Hide words or Hide ayahs.",
      },
      {
        title: "Tap the microphone and recite",
        text: "The listener follows you word by word and stops by itself after the last word of the ayah.",
      },
      {
        title: "Review and revise",
        text: "See the words to try again, then let the revision queue bring those ayahs back on the right day.",
      },
    ],
  },
  benefits: [
    {
      title: "Practise any time",
      text: "No need to wait for a class or find a study partner. Five minutes before work is enough.",
    },
    {
      title: "Nothing leaves your phone",
      text: "Audio is processed on the device and discarded. Practice keeps only counts and ayah numbers.",
    },
    {
      title: "Revision you won't forget",
      text: "Spaced review brings ayahs back just as they start to fade, which is when revising helps most.",
    },
    {
      title: "Free, with no ads",
      text: "No subscription and no paywall on mistake marks. The recommended listener is shared under a licence that keeps it free and ad-free.",
    },
  ],
  gallery: [
    {
      key: "quran",
      caption: "Start practice from the Qur'an tab, or from any ayah in the reader.",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "Memorizing Juz' Amma",
        text: "Learn a short surah with the reciter, then switch to Hide words until you can recite it without peeking. The revision queue handles the rest.",
      },
      {
        title: "Revising for Tarawih",
        text: "Use Hide ayahs on the portion you plan to lead or listen to, and practise the ones marked to try again.",
      },
      {
        title: "Between lessons",
        text: "Recite the lines your teacher set this week in Check mode, so you arrive at your next lesson having fixed the dropped words.",
      },
    ],
  },
  notes: [
    {
      tone: "info",
      title: "What it does not do",
      text: "Feedback is a guide, never a score. The listener and the pronunciation check look at which words you said; they do not judge tajweed or how each letter is pronounced, and they miss some mistakes, especially between similar-sounding letters. Tajweed coaching suggests sounds to practise, but it can't check tajweed inside an ayah and doesn't measure the length of a madd. None of it replaces reciting to a qualified teacher. It works best in a quiet room, with one voice, at a normal recitation pace, and may be less reliable for children's voices.",
    },
    {
      tone: "app",
      title: "Pronunciation check and tajweed coaching",
      text: "Both run on your device. The pronunciation check is available in the iPhone, Android and web apps, not on TV, and uses an optional on-device listener download shared with Qur'an practice. No audio is recorded, stored or uploaded, and nothing is scored. They were tested on reference recitations with added noise and errors, not on learners' voices, so treat their marks as a prompt to listen again.",
    },
  ],
  faqs: [
    {
      question: "Does Qur'an practice record my voice?",
      answer:
        "No. Your audio is processed on your device while you recite. It is never recorded, saved or uploaded. Practice keeps only counts, such as how many words matched, and ayah numbers.",
    },
    {
      question: "Does it correct my tajweed?",
      answer:
        "No, it doesn't correct tajweed. The pronunciation check marks words that seem skipped or unclear, and tajweed coaching turns the ayahs you practise into a short plan of tajweed sounds to work on, with explanations, sound drills for qalqalah, ghunnah and shaddah, and listen-and-repeat cards. It can't check tajweed inside an ayah, there are no scores, and it does not replace a teacher. See our guide on [improving your recitation](/resources/quran-learning/how-to-improve-quran-recitation).",
    },
    {
      question: "Does it work offline?",
      answer:
        "Yes, once the listener is downloaded. The download needs a connection once; after that, practice works offline.",
    },
    {
      question: "Is it suitable for children?",
      answer:
        "Children can use it with a parent, but the listener may be less reliable for children's voices. See our page for [families](/for/families).",
    },
    {
      question: "Which devices support it?",
      answer:
        "Qur'an practice is available in the iOS and Android apps and in the web app. Some older or low-memory devices may not be able to run the listener; you can still listen to the reciter and reveal words by hand.",
    },
  ],
  related: ["quran", "learn-quran", "daily-islamic-habits", "worship-progress"],
  guides: [
    "/resources/quran-learning/how-to-memorize-the-quran",
    "/resources/quran-learning/how-to-improve-quran-recitation",
  ],
  cta: {
    title: "Try Qur'an practice on your next surah",
    text: "Download Munib Tracker, fetch the listener once, and recite. Your voice never leaves your phone.",
  },
};
