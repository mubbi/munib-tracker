import type { ComparePage } from "@/content/types";
import { cell, MUNIB_CELLS as M, MUNIB, MUNIB_NF as P, VERIFIED_ON } from "./shared";

export const islamicHabitTrackerApps: ComparePage = {
  slug: "islamic-habit-tracker-apps",
  kind: "roundup",
  title: "Islamic habit tracker apps compared",
  seoTitle: "Islamic Habit Tracker Apps Compared (2026)",
  seoDescription:
    "Comparing Islamic habit tracker apps: Munib Tracker, Islamic Habit Tracker, Muslim Tracker and Dawaam. Salah, zikr, Qur'an, custom habits, ads and data.",
  description:
    "Worship-focused habit trackers side by side: what they track, custom habits, ads, price and data practices.",
  keywords: [
    "islamic habit tracker apps",
    "best muslim habit tracker app",
    "islamic habit tracker comparison",
  ],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "Roundup",
  intro: [
    "Islamic habit trackers help you build routines around Salah, zikr, Qur'an reading and fasting. Some are general habit apps with an Islamic theme, where you create each habit yourself; others are built around worship and know your Salah times and the Hijri calendar.",
    "Most apps in this category are small and Android-only, so we checked each one's Google Play listing (and App Store listing where one exists). Munib Tracker is our app; we've noted where others do things it doesn't.",
  ],
  apps: [
    MUNIB,
    {
      id: "mortys",
      name: "Islamic Habit Tracker (Mortys)",
      url: "https://play.google.com/store/apps/details?id=com.prayertimesqiblaazan.muslim",
    },
    {
      id: "june",
      name: "Islamic Habit Tracker App (June Afternoon)",
      url: "https://play.google.com/store/apps/details?id=islamic.habit.tracker.app",
    },
    {
      id: "deen",
      name: "Muslim Tracker (Deen IndieTech)",
      url: "https://play.google.com/store/apps/details?id=com.deenindietech.sunnahtracker",
    },
  ],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "Want fully custom habits?",
      text: "June Afternoon's Islamic Habit Tracker lets you define your own habits. Munib Tracker focuses on worship and doesn't support arbitrary custom habits.",
    },
    {
      title: "Want worship that's already set up?",
      text: "Munib Tracker comes with Salah, Qaza, adhkar, Qur'an and seasonal trackers ready to use, tied to your Salah times.",
    },
  ],
  table: [
    {
      group: "What you can track",
      rows: [
        {
          feature: "Salah",
          cells: {
            munib: M.salahLog,
            mortys: cell.partial("Generic habit"),
            june: cell.yes("As a custom habit"),
            deen: cell.yes("At Masjid, on time, missed"),
          },
        },
        {
          feature: "Qaza",
          cells: {
            munib: M.qaza,
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.unverified(),
          },
        },
        {
          feature: "Zikr / tasbeeh",
          cells: {
            munib: M.zikr,
            mortys: cell.yes("Counter"),
            june: cell.yes("Digital tasbih"),
            deen: cell.unverified(),
          },
        },
        {
          feature: "Qur'an",
          cells: {
            munib: cell.yes("Full reader, khatm plan, practice"),
            mortys: cell.yes("Reader"),
            june: cell.partial("Tracks pages or time; no reader"),
            deen: cell.unverified(),
          },
        },
        {
          feature: "Fasting",
          cells: {
            munib: cell.yes("Ramadan, White Days, missed fasts"),
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.yes("Several fasting types"),
          },
        },
        {
          feature: "Custom habits",
          cells: {
            munib: cell.partial("Custom adhkar and a Sunnah habits checklist"),
            mortys: cell.yes(),
            june: cell.yes(),
            deen: cell.unverified(),
          },
        },
      ],
    },
    {
      group: "Building the habit",
      rows: [
        {
          feature: "Daily goal across worship",
          cells: {
            munib: cell.yes("Today's Goal: Salah, zikr, Qaza, khatm"),
            mortys: cell.unverified(),
            june: cell.yes("Custom habit list"),
            deen: cell.unverified(),
          },
        },
        {
          feature: "Daily Sunnah habits checklist",
          cells: {
            munib: P.sunnahHabits,
            mortys: cell.partial("Generic habits"),
            june: cell.partial("As custom habits"),
            deen: cell.unverified(),
          },
        },
        {
          feature: "Voluntary fasting planner",
          cells: {
            munib: cell.yes(
              "Mondays and Thursdays, Shawwal, Arafah, Ashura, White Days and more, with prohibited-day warnings",
            ),
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.yes("Several fasting types"),
          },
        },
        {
          feature: "Weekly review and insights",
          cells: {
            munib: cell.yes("Weekly report and an on-device gentle coach"),
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.unverified(),
          },
        },
        {
          feature: "Nightly self-review (muhasabah)",
          cells: {
            munib: P.muhasabah,
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.unverified(),
          },
        },
        {
          feature: "Family ties reminders",
          cells: {
            munib: P.familyTies,
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.unverified(),
          },
        },
        {
          feature: "Accountability partner",
          cells: {
            munib: P.partner,
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.unverified(),
          },
        },
      ],
    },
    {
      group: "Platforms, price and data",
      rows: [
        {
          feature: "Platforms",
          cells: {
            munib: M.platforms,
            mortys: cell.text("Android"),
            june: cell.text("Android"),
            deen: cell.text("Android"),
          },
        },
        {
          feature: "Ads",
          cells: {
            munib: cell.text("No"),
            mortys: cell.text('Yes ("Contains ads")'),
            june: cell.text("No ads label"),
            deen: cell.text("No ads label"),
          },
        },
        {
          feature: "In-app purchases",
          cells: {
            munib: cell.text("None"),
            mortys: cell.text("Yes"),
            june: cell.text("Yes"),
            deen: cell.text("Yes"),
          },
        },
        {
          feature: "Google Play data safety",
          cells: {
            munib: cell.text("Guest data stays on device; no ad SDKs"),
            mortys: cell.text("Shares location, app activity and more"),
            june: cell.text("No data collected or shared"),
            deen: cell.text("Shares financial info"),
          },
        },
      ],
    },
  ],
  strengths: {
    munib: [
      "Worship tracking ready out of the box",
      "Qaza planning",
      "Qur'an reader and practice",
      "Every platform",
    ],
    mortys: ["Large install base (1M+)", "Broad all-in-one feature set"],
    june: ["Flexible custom habits", "No data collected per Play listing"],
    deen: ["Detailed Salah status (Masjid, on time, missed)", "Several fasting types"],
  },
  bestFor: {
    munib: "Anyone who wants worship habits already set up, with Qaza and Qur'an included.",
    mortys: "Android users who want a broad app and don't mind ads.",
    june: "People who want to design their own habit list.",
    deen: "Detailed Salah and fasting logging on Android.",
  },
  body: [
    { type: "h2", text: "Also worth a look" },
    {
      type: "p",
      text: "[Dawaam](https://play.google.com/store/apps/details?id=dawaam.app) combines Salah, adhkar and habit streaks with \"squads\" for doing it with friends, on iOS and Android. We didn't include it in the table because we couldn't verify enough of its features from official listings.",
    },
    {
      type: "p",
      text: "For ideas on building routines that last, read [how to build better Islamic habits](/resources/islamic-habits/how-to-build-better-islamic-habits).",
    },
  ],
  sources: [
    {
      label: "Islamic Habit Tracker (Mortys) — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.prayertimesqiblaazan.muslim",
    },
    {
      label: "Islamic Habit Tracker App (June Afternoon) — Google Play",
      url: "https://play.google.com/store/apps/details?id=islamic.habit.tracker.app",
    },
    {
      label: "Muslim Tracker (Deen IndieTech) — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.deenindietech.sunnahtracker",
    },
    {
      label: "Dawaam — Google Play",
      url: "https://play.google.com/store/apps/details?id=dawaam.app",
    },
  ],
  faqs: [
    {
      question: "What should an Islamic habit tracker include?",
      answer:
        "At minimum: the five daily Salah, some form of zikr tracking and Qur'an reading. Useful extras are Qaza tracking, reminders tied to Salah times, and fasting trackers for Ramadan and voluntary fasts.",
    },
  ],
  related: [
    "/features/daily-islamic-habits",
    "/compare/best-salah-tracker-apps",
    "/resources/islamic-habits/how-to-build-better-islamic-habits",
  ],
};
