import type { ComparePage } from "@/content/types";
import { cell, MUNIB_CELLS as M, MUNIB, MUNIB_NF as P, VERIFIED_ON } from "./shared";

const AT = "athan";

export const vsAthan: ComparePage = {
  slug: "munib-tracker-vs-athan",
  kind: "versus",
  title: "Munib Tracker vs Athan (IslamicFinder)",
  seoTitle: "Munib Tracker vs Athan App: Prayer Tracking & Qaza Compared",
  seoDescription:
    "Compare Munib Tracker and IslamicFinder's Athan app: prayer times, Salah logging, Qaza, zikr, Qur'an, recitation practice, ads and privacy labels.",
  description:
    "Athan is a popular prayer-times app with Salah logging and streaks. Munib Tracker adds Qaza planning, recitation practice and no ads.",
  keywords: ["munib tracker vs athan", "athan app alternative", "islamicfinder athan alternative"],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "Comparison",
  intro: [
    "Athan, from IslamicFinder, is one of the most popular prayer-times apps, rated 4.8 on Google Play from over 300,000 ratings. Beyond times and Adhan, it logs your five daily Salah with streaks and daily goals, and includes a menstrual mode, duas and a Qur'an reader.",
    "Munib Tracker overlaps on prayer times and Salah logging, and adds Qaza planning, guided adhkar, recitation practice and a learning library, without ads. Here's a side-by-side look based on official listings.",
  ],
  apps: [
    MUNIB,
    {
      id: AT,
      name: "Athan",
      developer: "IslamicFinder",
      url: "https://www.islamicfinder.org/athan/",
    },
  ],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "Choose Athan if…",
      text: "you want a well-established prayer-times and Adhan app with simple Salah logging, a period tracker and short video stories.",
    },
    {
      title: "Choose Munib Tracker if…",
      text: "you also want to plan and track Qaza, follow guided adhkar sessions, practise Qur'an recitation and use an Apple Watch or Wear OS companion, with no ads.",
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
            [AT]: cell.text(
              "Free with ads; Athan Premium ($1.99/month or $11.99/year in the US) or one-off ad removal",
            ),
          },
        },
        {
          feature: "Ads in the free version",
          cells: { munib: M.ads, [AT]: cell.text('Yes (Google Play: "Contains ads")') },
        },
        {
          feature: 'App Store "Data Used to Track You"',
          cells: {
            munib: cell.text("No advertising SDKs; guest data stays on the device"),
            [AT]: cell.text("Contact Info"),
          },
        },
      ],
    },
    {
      group: "Salah",
      rows: [
        { feature: "Prayer times and Adhan", cells: { munib: M.times, [AT]: cell.yes() } },
        { feature: "Qibla", cells: { munib: M.qibla, [AT]: cell.yes() } },
        {
          feature: "Log Salah as prayed",
          cells: { munib: M.salahLog, [AT]: cell.yes("Daily log and streaks") },
        },
        { feature: "Daily goals", cells: { munib: M.goals, [AT]: cell.yes("Daily Goals") } },
        {
          feature: "Excused days (hayd)",
          cells: { munib: M.excusedDays, [AT]: cell.yes("Menstrual mode with period tracker") },
        },
        {
          feature: "Sunnah Salah and Rawatib",
          cells: {
            munib: cell.yes("Rawatib tracker (10 or 12), plus Tahajjud, Ishraq, Duha and more"),
            [AT]: cell.unverified(),
          },
        },
        {
          feature: "Qaza tracking",
          cells: { munib: M.qaza, [AT]: cell.unverified("Not mentioned in listings") },
        },
        { feature: "Prayer journal", cells: { munib: M.journal, [AT]: cell.unverified() } },
        { feature: "Masjid finder", cells: { munib: P.masjidFinder, [AT]: cell.unverified() } },
      ],
    },
    {
      group: "Fasting and seasons",
      rows: [
        {
          feature: "Fasting tracking",
          cells: { munib: M.fastingTracking, [AT]: cell.unverified() },
        },
        {
          feature: "Voluntary fasting planner",
          cells: { munib: P.voluntaryFasting, [AT]: cell.unverified() },
        },
        { feature: "Dhul-Hijjah mode", cells: { munib: P.dhulHijjah, [AT]: cell.unverified() } },
        {
          feature: "Hajj and Umrah guides",
          cells: { munib: M.hajjUmrah, [AT]: cell.yes("Hajj and Umrah guides") },
        },
        { feature: "Live Umrah companion", cells: { munib: P.umrahMode, [AT]: cell.unverified() } },
        {
          feature: "Hijri calendar",
          cells: { munib: M.hijriCalendar, [AT]: cell.yes("Hijri and Umm al-Qura calendars") },
        },
      ],
    },
    {
      group: "Zikr and Qur'an",
      rows: [
        {
          feature: "Tasbeeh and adhkar",
          cells: { munib: M.zikr, [AT]: cell.yes("Tasbeeh counter, adhkar with audio") },
        },
        {
          feature: "Qur'an translations",
          cells: { munib: M.translations, [AT]: cell.yes("45+ languages") },
        },
        {
          feature: "Tafsir and word-by-word",
          cells: { munib: cell.yes(), [AT]: cell.unverified() },
        },
        {
          feature: "Identify an ayah by voice or text",
          cells: { munib: M.verseDetector, [AT]: cell.unverified() },
        },
        {
          feature: "Qur'an learning",
          cells: { munib: M.quranLearning, [AT]: cell.unverified("Separate Athan Academy app") },
        },
        {
          feature: "Microphone recitation practice",
          cells: { munib: M.recitation, [AT]: cell.unverified() },
        },
        {
          feature: "Hadith collections",
          cells: {
            munib: M.hadith,
            [AT]: cell.unverified("Hadith section on the IslamicFinder website"),
          },
        },
      ],
    },
    {
      group: "Extras and devices",
      rows: [
        {
          feature: "Short video stories",
          cells: { munib: cell.no(), [AT]: cell.yes("Athan Stories") },
        },
        { feature: "Home-screen widget", cells: { munib: M.widgets, [AT]: cell.yes() } },
        {
          feature: "Smartwatch",
          cells: { munib: M.watch, [AT]: cell.unverified("No watch listed") },
        },
        { feature: "TV apps", cells: { munib: M.tv, [AT]: cell.unverified() } },
        {
          feature: "Web app",
          cells: { munib: M.webApp, [AT]: cell.partial("IslamicFinder website") },
        },
      ],
    },
  ],
  strengths: {
    munib: [
      "Qaza calculator and daily-pace planner",
      "Guided adhkar sessions with source hadith",
      "On-device recitation practice",
      "Apple Watch, Wear OS and TV apps",
      "No ads or subscription",
      "Masjid finder, Umrah mode and a voluntary fasting planner",
    ],
    [AT]: [
      "Long-established, highly rated prayer-times app",
      "Daily goals and Salah streaks",
      "Menstrual mode with a period tracker",
      "Hajj and Umrah guides and multiple Hijri calendars",
      "Low-cost Premium option",
    ],
  },
  bestFor: {
    munib:
      "People who want tracking that includes Qaza, plus Qur'an practice and learning, with no ads.",
    [AT]: "People who mainly want reliable prayer times and simple daily logging.",
  },
  sources: [
    { label: "Athan — IslamicFinder website", url: "https://www.islamicfinder.org/athan/" },
    {
      label: "Athan — Google Play listing",
      url: "https://play.google.com/store/apps/details?id=com.athan",
    },
    {
      label: "Athan — App Store listing",
      url: "https://apps.apple.com/us/app/athan-prayer-times-dua-azkar/id505858403",
    },
  ],
  faqs: [
    {
      question: "Does Athan track Qaza prayers?",
      answer:
        "We couldn't find Qaza tracking mentioned in Athan's official listings or website as of our last check. Munib Tracker has a dedicated [Qaza tracker](/features/qaza-salah-tracker).",
    },
  ],
  related: [
    "/compare/best-salah-tracker-apps",
    "/features/prayer-times-qibla",
    "/features/qaza-salah-tracker",
  ],
};
