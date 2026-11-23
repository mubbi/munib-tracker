import type { ComparePage } from "@/content/types";
import { cell, MUNIB_CELLS as M, MUNIB, MUNIB_NF as P, VERIFIED_ON } from "./shared";

const TA = "tarteel";

export const vsTarteel: ComparePage = {
  slug: "munib-tracker-vs-tarteel",
  kind: "versus",
  title: "Munib Tracker vs Tarteel for Qur'an recitation practice",
  seoTitle: "Munib Tracker vs Tarteel: AI Qur'an Recitation Compared",
  seoDescription:
    "Tarteel is the leading AI Qur'an memorization app. Munib Tracker offers free on-device recitation practice plus Salah tracking. Compare features and privacy.",
  description:
    "Tarteel leads in AI memorization with paid mistake detection. Munib Tracker offers free, on-device practice inside a full worship tracker.",
  keywords: ["munib tracker vs tarteel", "tarteel alternative", "free ai quran recitation app"],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "Comparison",
  intro: [
    "Tarteel is the best-known AI Qur'an app, with over 10 million Google Play downloads. It follows your recitation, offers a generous free Qur'an reader, and in its Premium plan detects missed, wrong or extra words and tashkeel errors as you recite.",
    "Munib Tracker's Qur'an practice is a newer, simpler feature inside a wider worship tracker. Its listener runs on your device, is free, and marks words to try again. Here's an honest look at how they differ.",
  ],
  apps: [MUNIB, { id: TA, name: "Tarteel", developer: "Tarteel Inc.", url: "https://tarteel.ai" }],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "Choose Tarteel if…",
      text: "memorization is your main goal and you want the most developed AI feedback available, including live mistake detection and analytics, and you're open to a subscription.",
    },
    {
      title: "Choose Munib Tracker if…",
      text: "you want free recitation practice that keeps your voice on your device, alongside Salah, Qaza and zikr tracking in one app.",
    },
  ],
  table: [
    {
      group: "Recitation practice",
      rows: [
        {
          feature: "Follows your recitation",
          cells: { munib: cell.yes("Free"), [TA]: cell.yes("Free") },
        },
        {
          feature: "Mistake detection",
          cells: {
            munib: M.mistakeMarks,
            [TA]: cell.yes("Premium: missed, wrong, extra words and tashkeel errors"),
          },
        },
        {
          feature: "Word-by-word pronunciation feedback",
          cells: {
            munib: P.pronunciation,
            [TA]: cell.partial("Tashkeel errors in Premium mistake detection"),
          },
        },
        {
          feature: "Tajweed feedback",
          cells: {
            munib: cell.yes("Tajweed error coaching and pronunciation drills; no scores"),
            [TA]: cell.no('"Does not detect Tajweed mistakes yet"'),
          },
        },
        {
          feature: "Hide words / hidden verses",
          cells: { munib: cell.yes("Free"), [TA]: cell.yes("Premium") },
        },
        {
          feature: "Spaced revision",
          cells: {
            munib: M.memorization,
            [TA]: cell.partial("Goal planning and history, Premium"),
          },
        },
        {
          feature: "Where voice is processed",
          cells: {
            munib: cell.text("On your device; never recorded or uploaded"),
            [TA]: cell.text(
              "Needs a stable internet connection; App Store label lists audio data collected",
            ),
          },
        },
        {
          feature: "Works offline",
          cells: {
            munib: cell.yes("After a one-time download"),
            [TA]: cell.unverified("Voice features need internet"),
          },
        },
      ],
    },
    {
      group: "Qur'an reader",
      rows: [
        {
          feature: "Translations",
          cells: { munib: M.translations, [TA]: cell.yes("152 translations in 76 languages") },
        },
        { feature: "Tafsir", cells: { munib: M.tafsir, [TA]: cell.yes("45 tafsirs") } },
        {
          feature: "Reciters",
          cells: {
            munib: cell.yes("Several, with offline downloads"),
            [TA]: cell.yes("16 recitations, offline downloads"),
          },
        },
        { feature: "Tajweed colours", cells: { munib: M.tajweedColours, [TA]: cell.yes() } },
        {
          feature: "Identify an ayah by voice",
          cells: { munib: M.verseDetector, [TA]: cell.yes("Voice search") },
        },
        {
          feature: "Reading goals",
          cells: { munib: M.khatm, [TA]: cell.yes("Goal planning, Premium") },
        },
        { feature: "Personal ayah notes", cells: { munib: P.ayahNotes, [TA]: cell.unverified() } },
        {
          feature: "Arabic root-word search",
          cells: { munib: P.rootSearch, [TA]: cell.unverified() },
        },
        {
          feature: "Group khatm with others",
          cells: { munib: P.groupKhatm, [TA]: cell.unverified() },
        },
      ],
    },
    {
      group: "Beyond the Qur'an",
      rows: [
        {
          feature: "Learn to read (letters, tajweed lessons)",
          cells: {
            munib: M.quranLearning,
            [TA]: cell.unverified("No tajweed lessons or Qaida found"),
          },
        },
        { feature: "Salah tracking", cells: { munib: M.salahLog, [TA]: cell.unverified() } },
        { feature: "Qaza tracking", cells: { munib: M.qaza, [TA]: cell.unverified() } },
        { feature: "Zikr and duas", cells: { munib: M.zikr, [TA]: cell.unverified() } },
        {
          feature: "Prayer times and Qibla",
          cells: { munib: cell.yes(), [TA]: cell.unverified() },
        },
        { feature: "Hadith collections", cells: { munib: M.hadith, [TA]: cell.unverified() } },
      ],
    },
    {
      group: "Price",
      rows: [
        {
          feature: "Price",
          cells: {
            munib: M.price,
            [TA]: cell.text(
              "Free core; Premium subscription (US App Store lists from $12.99/month)",
            ),
          },
        },
        { feature: "Ads", cells: { munib: M.ads, [TA]: cell.text("No ads") } },
      ],
    },
  ],
  strengths: {
    munib: [
      "Recitation practice is free, with hide modes and spaced revision",
      "Voice stays on the device",
      "Part of a full worship tracker: Salah, Qaza, zikr, learning",
      "No subscription",
      "Word-by-word pronunciation feedback and tajweed coaching, on the device",
    ],
    [TA]: [
      "The most developed AI memorization feedback, including tashkeel errors",
      "Voice search to find any ayah",
      "Very large free Qur'an library: translations, tafsirs, reciters",
      "Proven at scale (10M+ downloads)",
    ],
  },
  bestFor: {
    munib:
      "People who want private, free recitation practice as part of their daily worship routine.",
    [TA]: "Dedicated memorizers who want the most detailed AI feedback and are happy to subscribe.",
  },
  body: [
    { type: "h2", text: 'What "AI recitation" means in each app' },
    {
      type: "p",
      text: "Both apps listen and follow along. Tarteel's Premium mistake detection is the more detailed of the two: it flags missed, wrong and extra words and tashkeel errors live. Munib Tracker's listener shows words to try again after each ayah, or while you recite if you prefer, and says when it isn't sure; its pronunciation check then marks each word as clear or worth listening to again, and tajweed coaching turns that into targeted practice. Neither app gives a tajweed score.",
    },
    {
      type: "p",
      text: "Neither is a replacement for reciting to a qualified teacher. See our guide on [how to improve Qur'an recitation](/resources/quran-learning/how-to-improve-quran-recitation).",
    },
  ],
  sources: [
    { label: "Tarteel — official website", url: "https://tarteel.ai" },
    {
      label: "Tarteel help — Can I use Tarteel for free?",
      url: "https://support.tarteel.ai/en/articles/12267535-can-i-use-tarteel-for-free",
    },
    {
      label: "Tarteel help — Tajweed mistakes",
      url: "https://support.tarteel.ai/en/articles/12414457-tarteel-is-not-recognising-my-tajweed-mistakes",
    },
    {
      label: "Tarteel blog — Introducing mistake detection",
      url: "https://tarteel.ai/blog/introducing-mistake-detection/",
    },
    { label: "Tarteel — App Store listing", url: "https://apps.apple.com/us/app/id1391009396" },
    {
      label: "Tarteel — Google Play listing",
      url: "https://play.google.com/store/apps/details?id=com.mmmoussa.iqra",
    },
  ],
  faqs: [
    {
      question: "Is there a free alternative to Tarteel's mistake detection?",
      answer:
        "Munib Tracker's Qur'an practice is free and marks words to try again after each ayah. It's simpler than Tarteel's Premium mistake detection and doesn't detect tashkeel errors. Munib Tracker also gives word-by-word pronunciation feedback (clear, or worth listening to again) and tajweed coaching, all on the device and without scores.",
    },
    {
      question: "Does Munib Tracker upload my recitation?",
      answer: "No. The listener runs on your device; audio is never recorded, stored or uploaded.",
    },
  ],
  related: [
    "/features/quran-practice",
    "/resources/quran-learning/how-to-memorize-the-quran",
    "/compare",
  ],
};
