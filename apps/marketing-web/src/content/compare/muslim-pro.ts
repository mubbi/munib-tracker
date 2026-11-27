import type { ComparePage } from "@/content/types";
import { devicesGroup } from "./devices";
import { cell, MUNIB_CELLS as M, MUNIB, MUNIB_NF as P, VERIFIED_ON } from "./shared";

const MP = "muslim-pro";

export const vsMuslimPro: ComparePage = {
  slug: "munib-tracker-vs-muslim-pro",
  kind: "versus",
  title: "Munib Tracker vs Muslim Pro",
  seoTitle: "Munib Tracker vs Muslim Pro: Features, Ads & Privacy Compared",
  seoDescription:
    "An evidence-based comparison of Munib Tracker and Muslim Pro: Salah and Qaza tracking, Qur'an, zikr, recitation practice, pricing, ads and privacy labels.",
  description:
    "Muslim Pro is the broadest all-in-one Muslim lifestyle app. Munib Tracker is a free, ad-free tracker and Qur'an companion. Here's how they differ.",
  keywords: ["munib tracker vs muslim pro", "muslim pro alternative", "muslim pro without ads"],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "Comparison",
  intro: [
    "Muslim Pro, by Bitsmedia, is one of the best-known Muslim apps, with over 100 million downloads on Google Play. It covers prayer times, Qur'an, duas, a prayer and fasting tracker, a video service called Qalbox, a halal place finder and much more.",
    "Munib Tracker is a smaller, free app focused on tracking your worship (Salah, Qaza and zikr), the Qur'an, and learning, with no ads and no account required. This page compares the two using each app's official website and store listings.",
  ],
  apps: [
    MUNIB,
    {
      id: MP,
      name: "Muslim Pro",
      developer: "Bitsmedia Pte Ltd",
      url: "https://www.muslimpro.com/",
    },
  ],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "Choose Muslim Pro if…",
      text: "you want one app for nearly everything, including video lectures, a halal restaurant finder, a large community and an AI Q&A assistant, and you're happy with ads or a Premium subscription.",
    },
    {
      title: "Choose Munib Tracker if…",
      text: "you mainly want to track Salah, Qaza and zikr, read and practise the Qur'an, and learn, in an app with no ads, no subscription and no account.",
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
            [MP]: cell.text(
              "Free with ads; Premium subscription ($12.99/month or $34.99/year in the US)",
            ),
          },
        },
        {
          feature: "Ads in the free version",
          cells: { munib: M.ads, [MP]: cell.text('Yes (Google Play: "Contains ads")') },
        },
        {
          feature: 'App Store "Data Used to Track You"',
          cells: {
            munib: cell.text("No advertising SDKs; guest data stays on the device"),
            [MP]: cell.text("Location, Identifiers"),
          },
        },
        {
          feature: "Account needed for core use",
          cells: { munib: M.account, [MP]: cell.unverified() },
        },
      ],
    },
    {
      group: "Salah",
      rows: [
        { feature: "Prayer times and Adhan", cells: { munib: M.times, [MP]: cell.yes() } },
        { feature: "Qibla", cells: { munib: M.qibla, [MP]: cell.yes() } },
        {
          feature: "Log Salah as prayed",
          cells: { munib: M.salahLog, [MP]: cell.yes("Prayer & Fasting tracker with streaks") },
        },
        {
          feature: "Sunnah and Nafl Salah",
          cells: { munib: M.sunnahSalah, [MP]: cell.unverified() },
        },
        { feature: "Sunnah Rawatib tracker", cells: { munib: P.rawatib, [MP]: cell.unverified() } },
        {
          feature: "Excused days (hayd, illness, travel)",
          cells: { munib: M.excusedDays, [MP]: cell.unverified() },
        },
        {
          feature: "Qaza (missed Salah) tracking",
          cells: { munib: M.qaza, [MP]: cell.yes("Ibadah tracker logs missed prayers and fasts") },
        },
        { feature: "Prayer journal", cells: { munib: M.journal, [MP]: cell.yes("Journal") } },
        {
          feature: "Masjid finder",
          cells: { munib: P.masjidFinder, [MP]: cell.yes("Mosques and halal places") },
        },
        {
          feature: "Block apps at Salah time",
          cells: { munib: P.focusLock, [MP]: cell.unverified() },
        },
      ],
    },
    {
      group: "Fasting",
      rows: [
        {
          feature: "Fasting tracking",
          cells: { munib: M.fastingTracking, [MP]: cell.yes("Prayer & Fasting tracker") },
        },
        {
          feature: "Voluntary fasting planner",
          cells: { munib: P.voluntaryFasting, [MP]: cell.unverified() },
        },
      ],
    },
    {
      group: "Zikr and duas",
      rows: [
        { feature: "Tasbeeh counter", cells: { munib: M.tasbeeh, [MP]: cell.yes() } },
        { feature: "Adhkar and duas", cells: { munib: M.zikr, [MP]: cell.yes("Dua library") } },
        {
          feature: "Your own custom adhkar",
          cells: { munib: cell.yes("With speech-to-text"), [MP]: cell.unverified() },
        },
        {
          feature: "Hands-free (voice) tasbeeh",
          cells: { munib: P.handsFreeTasbeeh, [MP]: cell.unverified() },
        },
      ],
    },
    {
      group: "Qur'an",
      rows: [
        { feature: "Translations", cells: { munib: M.translations, [MP]: cell.yes() } },
        { feature: "Tajweed colour coding", cells: { munib: M.tajweedColours, [MP]: cell.yes() } },
        { feature: "Word-by-word", cells: { munib: M.wordByWord, [MP]: cell.unverified() } },
        { feature: "Tafsir", cells: { munib: M.tafsir, [MP]: cell.partial("As Qalbox videos") } },
        {
          feature: "Offline Qur'an",
          cells: { munib: M.quranOffline, [MP]: cell.partial("Premium") },
        },
        { feature: "Khatm reading plan", cells: { munib: M.khatm, [MP]: cell.unverified() } },
        {
          feature: "Identify an ayah by voice or text",
          cells: { munib: M.verseDetector, [MP]: cell.unverified() },
        },
        { feature: "Personal ayah notes", cells: { munib: P.ayahNotes, [MP]: cell.unverified() } },
      ],
    },
    {
      group: "Learning and recitation",
      rows: [
        {
          feature: "Qur'an learning",
          cells: {
            munib: M.quranLearning,
            [MP]: cell.partial("Memorise tool; Premium lessons and live classes"),
          },
        },
        {
          feature: "Microphone recitation practice",
          cells: {
            munib: M.recitation,
            [MP]: cell.unverified("Not described in official listings"),
          },
        },
        {
          feature: "Word-by-word pronunciation feedback",
          cells: { munib: P.pronunciation, [MP]: cell.unverified() },
        },
        {
          feature: "Hadith collections",
          cells: { munib: M.hadith, [MP]: cell.partial("Via AiDeen and Qalbox video") },
        },
        {
          feature: "Structured Islamic learning library",
          cells: { munib: M.learning, [MP]: cell.partial("Qalbox video series; Premium lessons") },
        },
        { feature: "Zakat calculator", cells: { munib: M.zakat, [MP]: cell.unverified() } },
        {
          feature: "Inheritance (mirath) calculator",
          cells: { munib: P.mirath, [MP]: cell.unverified() },
        },
      ],
    },
    {
      group: "Community and extras",
      rows: [
        {
          feature: "AI Islamic Q&A assistant",
          cells: { munib: cell.no(), [MP]: cell.yes("AiDeen") },
        },
        { feature: "Video content", cells: { munib: cell.no(), [MP]: cell.yes("Qalbox") } },
        {
          feature: "Community and group features",
          cells: { munib: P.groupKhatm, [MP]: cell.yes("Ummah Pro community, Quests") },
        },
        { feature: "Family and kids mode", cells: { munib: P.family, [MP]: cell.unverified() } },
        {
          feature: "Statistics and achievements",
          cells: { munib: M.achievements, [MP]: cell.yes("Streaks and gamified Quests") },
        },
      ],
    },
    devicesGroup(
      {
        [MP]: {
          web: cell.partial("Prayer-times pages on the website"),
          ios: cell.yes("iPhone and iPad; also Mac and Vision Pro"),
          android: cell.yes(),
          appleWatch: cell.yes("Listed on the App Store"),
          appleTv: cell.partial("Apple TV listed on the App Store"),
          widgets: cell.partial("Marking from the widget needs Premium"),
        },
      },
      [
        {
          feature: "Voice assistant shortcuts",
          cells: { munib: cell.yes("Siri and Google Assistant"), [MP]: cell.yes("Siri") },
        },
      ],
    ),
  ],
  strengths: {
    munib: [
      "No ads, subscriptions or account, ever",
      "Dedicated Qaza calculator and daily-pace planner",
      "On-device Qur'an recitation practice with spaced revision",
      "Every zikr shown with its source hadith",
      "Masjid finder, family and kids mode, and group khatm, with no ads",
      "Source code is public on GitHub",
    ],
    [MP]: [
      "Very broad feature set in a single app",
      "Huge, established user base (100M+ Google Play downloads)",
      "Qalbox video library and AiDeen AI assistant",
      "Halal restaurant and Masjid finder, community features",
      "Available on Apple Watch, iPad, Mac, Apple TV and Vision Pro",
    ],
  },
  bestFor: {
    munib: "People who want a calm, private tracker and Qur'an companion with no ads or paywall.",
    [MP]: "People who want one app for prayer times, Qur'an, video, community and local services.",
  },
  body: [
    { type: "h2", text: "Privacy: what the store labels say" },
    {
      type: "p",
      text: "Apple asks developers to declare data use. Muslim Pro's App Store listing declares location and identifiers under \"Data Used to Track You\". In November 2020, Vice's Motherboard reported that Muslim Pro location data reached a broker linked to the US military; Muslim Pro called the report untrue and said it ended its relationships with its data partners ([Middle East Eye report](https://www.middleeasteye.net/news/us-military-data-muslim-pro-apps-ties-severed)).",
    },
    {
      type: "p",
      text: "Munib Tracker has no ads or advertising SDKs. In guest mode your worship data stays on your device; if you sign in to sync, only what's needed to sync is stored. Details are in our [privacy policy](/privacy).",
    },
    { type: "h2", text: "Qaza and Salah tracking" },
    {
      type: "p",
      text: "Both apps let you log Salah and track missed prayers. Munib Tracker's [Qaza tracker](/features/qaza-salah-tracker) adds a lifetime calculator, pace presets and an estimated finish date, and missed Salah from the daily tracker feed it automatically.",
    },
    { type: "h2", text: "Qur'an practice" },
    {
      type: "p",
      text: "We found no microphone-based recitation practice in Muslim Pro's official listings. Its memorisation tool uses audio playback and self-rating. Munib Tracker's [Qur'an practice](/features/quran-practice) listens on your device and marks words to try again, for free.",
    },
  ],
  sources: [
    { label: "Muslim Pro — official website", url: "https://www.muslimpro.com/" },
    {
      label: "Muslim Pro — Google Play listing",
      url: "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
    },
    {
      label: "Muslim Pro — App Store listing",
      url: "https://apps.apple.com/us/app/muslim-pro-quran-athan/id388389451",
    },
    {
      label: "Muslim Pro help — Journal / tracker",
      url: "https://support.muslimpro.com/help/en/articles/journal",
    },
    {
      label: "Muslim Pro help — Qur'an reading",
      url: "https://support.muslimpro.com/hc/en-us/articles/29167995711769-Quran-Read",
    },
    {
      label: "Muslim Pro help — Memorisation",
      url: "https://support.muslimpro.com/hc/en-us/articles/29158808395289-Quran-Learn-Memorisation",
    },
    { label: "Muslim Pro — AiDeen", url: "https://www.muslimpro.com/app/askaideen" },
    {
      label: "Middle East Eye — 2020 data report",
      url: "https://www.middleeasteye.net/news/us-military-data-muslim-pro-apps-ties-severed",
    },
  ],
  faqs: [
    {
      question: "Is Munib Tracker a good Muslim Pro alternative without ads?",
      answer:
        "If you mainly use Muslim Pro for prayer times, tracking, Qur'an and duas, Munib Tracker covers those without ads or a subscription. It doesn't offer video content, an AI assistant or a halal restaurant finder, but it does include a Masjid finder, family mode and group khatm.",
    },
    {
      question: "Can I move my data from Muslim Pro?",
      answer:
        "Munib Tracker can import past Salah logs from a spreadsheet (CSV) or JSON. Whether you can export from Muslim Pro in that format depends on Muslim Pro.",
    },
  ],
  related: [
    "/compare/best-salah-tracker-apps",
    "/features/qaza-salah-tracker",
    "/features/quran-practice",
  ],
};
