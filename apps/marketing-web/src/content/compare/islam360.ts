import type { ComparePage } from "@/content/types";
import { devicesGroup, NOT_ON_APP_STORE } from "./devices";
import { cell, MUNIB_CELLS as M, MUNIB, MUNIB_NF as P, VERIFIED_ON } from "./shared";

const I3 = "islam360";

export const vsIslam360: ComparePage = {
  slug: "munib-tracker-vs-islam360",
  kind: "versus",
  title: "Munib Tracker vs Islam360",
  seoTitle: "Munib Tracker vs Islam360: Qur'an, Hadith & Tracking Compared",
  seoDescription:
    "Islam360 excels at Qur'an and hadith search with Urdu tafsir. Munib Tracker focuses on ad-free Salah, Qaza and zikr tracking plus recitation practice.",
  description:
    "Islam360 is a deep Qur'an and hadith search app. Munib Tracker is a free, ad-free worship tracker with a Qur'an reader and recitation practice.",
  keywords: ["munib tracker vs islam360", "islam360 alternative", "islam360 without ads"],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "Comparison",
  intro: [
    "Islam360 calls itself the \"world's first Quran and Hadith searchable application\". It's especially popular in South Asia, with Urdu, Hindi and Roman Urdu translations, tafsir by well-known scholars and a large hadith library.",
    "Munib Tracker comes at it from a different angle: it's built first to help you keep up your daily worship (Salah, Qaza and zikr), with a Qur'an reader, recitation practice and a learning library alongside. Both are compared here using their official websites and store listings.",
  ],
  apps: [
    MUNIB,
    {
      id: I3,
      name: "Islam360",
      developer: "Islam360 Foundation Trust",
      url: "https://www.theislam360.com/",
    },
  ],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "Choose Islam360 if…",
      text: "your priority is in-depth Qur'an and hadith study in Urdu: many Urdu translations and tafsir by named scholars, audio tafsir, and seven major hadith books with grading.",
    },
    {
      title: "Choose Munib Tracker if…",
      text: "you want to track Salah and make up missed Salah with a plan, follow daily adhkar, and practise recitation, without ads or a subscription.",
    },
  ],
  table: [
    {
      group: "Price and privacy",
      rows: [
        {
          feature: "Price",
          cells: {
            munib: M.price,
            [I3]: cell.text(
              "Free with ads; subscription to remove ads ($9.99/month or $49.99/year in the US)",
            ),
          },
        },
        {
          feature: "Ads in the free version",
          cells: { munib: M.ads, [I3]: cell.text('Yes (Google Play: "Contains ads")') },
        },
        {
          feature: 'App Store "Data Used to Track You"',
          cells: {
            munib: cell.text("No advertising SDKs; guest data stays on the device"),
            [I3]: cell.text("Identifiers"),
          },
        },
      ],
    },
    {
      group: "Salah",
      rows: [
        { feature: "Prayer times and Adhan", cells: { munib: M.times, [I3]: cell.yes() } },
        { feature: "Qibla", cells: { munib: M.qibla, [I3]: cell.yes() } },
        {
          feature: "Log Salah as prayed",
          cells: {
            munib: M.salahLog,
            [I3]: cell.unverified(
              'Website mentions a "Salah Tracker"; store listings don\'t describe logging',
            ),
          },
        },
        {
          feature: "Sunnah Salah and Rawatib",
          cells: {
            munib: cell.yes("Rawatib tracker (10 or 12), plus Tahajjud, Ishraq, Duha and more"),
            [I3]: cell.unverified(),
          },
        },
        { feature: "Qaza tracking", cells: { munib: M.qaza, [I3]: cell.unverified() } },
        { feature: "Masjid finder", cells: { munib: P.masjidFinder, [I3]: cell.unverified() } },
      ],
    },
    {
      group: "Zikr and duas",
      rows: [
        { feature: "Tasbeeh counter", cells: { munib: M.tasbeeh, [I3]: cell.yes() } },
        {
          feature: "Adhkar and duas with references",
          cells: { munib: M.zikr, [I3]: cell.yes("With hadith references") },
        },
        {
          feature: "Your own custom adhkar",
          cells: { munib: cell.yes("With speech-to-text"), [I3]: cell.unverified() },
        },
      ],
    },
    {
      group: "Qur'an",
      rows: [
        {
          feature: "Translations",
          cells: { munib: M.translations, [I3]: cell.yes("21+, incl. Urdu, Hindi, Roman Urdu") },
        },
        { feature: "Tafsir", cells: { munib: M.tafsir, [I3]: cell.yes("16+ by named scholars") } },
        { feature: "Audio tafsir", cells: { munib: M.tafsirAudio, [I3]: cell.yes() } },
        {
          feature: "Word-by-word",
          cells: { munib: M.wordByWord, [I3]: cell.yes("Arabic to Urdu") },
        },
        {
          feature: "Reciters",
          cells: { munib: cell.yes("Several, with offline downloads"), [I3]: cell.yes("12+") },
        },
        {
          feature: "Root-word search",
          cells: { munib: P.rootSearch, [I3]: cell.yes("Root, topic and translation search") },
        },
        {
          feature: "Identify an ayah by voice",
          cells: {
            munib: M.verseDetector,
            [I3]: cell.yes("Voice search across Qur'an and hadith"),
          },
        },
        { feature: "Personal ayah notes", cells: { munib: P.ayahNotes, [I3]: cell.yes("Notes") } },
        { feature: "Khatm reading plan", cells: { munib: M.khatm, [I3]: cell.unverified() } },
        { feature: "Offline Qur'an", cells: { munib: M.quranOffline, [I3]: cell.unverified() } },
      ],
    },
    {
      group: "Learning and recitation",
      rows: [
        {
          feature: "Qaida and tajweed lessons",
          cells: { munib: M.quranLearning, [I3]: cell.yes("27 Qaida lessons with audio") },
        },
        {
          feature: "Microphone recitation practice",
          cells: { munib: M.recitation, [I3]: cell.unverified("Voice search only") },
        },
        {
          feature: "Word-by-word pronunciation feedback",
          cells: { munib: P.pronunciation, [I3]: cell.unverified() },
        },
        {
          feature: "Structured Islamic learning library",
          cells: { munib: M.learning, [I3]: cell.partial("Courses and Fahm-ul-Quran") },
        },
      ],
    },
    {
      group: "Hadith",
      rows: [
        {
          feature: "Hadith collections",
          cells: { munib: M.hadith, [I3]: cell.yes("Seven primary books plus more") },
        },
        {
          feature: "Grading and explanation",
          cells: { munib: M.hadithDepth, [I3]: cell.yes("Grading and takhreej") },
        },
      ],
    },
    {
      group: "Tools",
      rows: [
        { feature: "Zakat calculator", cells: { munib: M.zakat, [I3]: cell.unverified() } },
        {
          feature: "Inheritance (mirath) calculator",
          cells: { munib: P.mirath, [I3]: cell.unverified() },
        },
        {
          feature: "Statistics and streaks",
          cells: { munib: M.statistics, [I3]: cell.unverified() },
        },
      ],
    },
    devicesGroup(
      {
        [I3]: {
          ios: cell.yes("iPhone and iPad"),
          android: cell.yes("Also on Huawei AppGallery"),
          appleWatch: NOT_ON_APP_STORE,
          appleTv: NOT_ON_APP_STORE,
          widgets: cell.yes("Prayer time, tracker, tasbeeh and verse widgets on iPhone"),
        },
      },
      [{ feature: "Computer", cells: { munib: M.webApp, [I3]: cell.text("Mac (Apple silicon)") } }],
    ),
  ],
  strengths: {
    munib: [
      "Detailed Salah and Qaza tracking with a make-up plan",
      "Guided adhkar sessions with source hadith",
      "On-device recitation practice and spaced revision",
      "No ads, subscription or account",
      "Widgets, an Apple Watch companion and Wear OS tiles",
      "Ayah notes and Arabic root-word search",
    ],
    [I3]: [
      "Deep Qur'an search by Arabic word, root, topic and translation",
      "Many Urdu translations and tafsir by named scholars",
      "Large hadith library with grading and takhreej",
      "Qaida lessons with audio",
      "Large, established user base (10M+ Google Play downloads)",
    ],
  },
  bestFor: {
    munib:
      "People who want to build and track daily worship habits, with Qur'an reading and practice alongside.",
    [I3]: "Students and readers, especially Urdu speakers, who want deep Qur'an and hadith research tools.",
  },
  body: [
    { type: "h2", text: "Different starting points" },
    {
      type: "p",
      text: "Islam360 is first a search and study tool. Munib Tracker is first a tracker: it records your Salah, Qaza and adhkar every day and shows your progress. Many people could reasonably use both, Islam360 for research and Munib Tracker for their daily routine.",
    },
    { type: "h2", text: "Qur'an and hadith depth" },
    {
      type: "p",
      text: "For Urdu translation and tafsir choice, Islam360 offers more than Munib Tracker. Munib Tracker's [Qur'an reader](/features/quran) has 25 translation editions, on-demand tafsir and word-by-word, with an emphasis on offline reading and a khatm plan.",
    },
  ],
  sources: [
    { label: "Islam360 — official website", url: "https://www.theislam360.com/" },
    { label: "Islam360 — features", url: "https://www.theislam360.com/features" },
    { label: "Islam360 — learn Qur'an", url: "https://www.theislam360.com/learn-quran" },
    {
      label: "Islam360 — Google Play listing",
      url: "https://play.google.com/store/apps/details?id=com.islam360",
    },
    {
      label: "Islam360 — App Store listing",
      url: "https://apps.apple.com/us/app/islam360-quran-hadith-qibla/id1006098149",
    },
  ],
  faqs: [
    {
      question: "Does Munib Tracker have Urdu?",
      answer:
        "Yes. The app interface is available in Urdu (with right-to-left layout), and the Qur'an includes an Urdu translation. Islam360 offers more Urdu translations and tafsir.",
    },
    {
      question: "Which is better for hadith?",
      answer:
        "Islam360 has the deeper hadith library, with grading and takhreej. Munib Tracker bundles two collections and downloads six more on demand.",
    },
  ],
  related: ["/compare/munib-tracker-vs-muslim-pro", "/features/quran", "/features/salah-tracker"],
};
