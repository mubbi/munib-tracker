import type { ComparePage } from "@/content/types";
import { devicesGroup, NOT_ON_APP_STORE } from "./devices";
import { cell, MUNIB_CELLS as M, MUNIB, MUNIB_NF as P, VERIFIED_ON } from "./shared";

const PL = "pillars";

export const vsPillars: ComparePage = {
  slug: "munib-tracker-vs-pillars",
  kind: "versus",
  title: "Munib Tracker vs Pillars",
  seoTitle: "Munib Tracker vs Pillars: Two Ad-Free Prayer Apps Compared",
  seoDescription:
    "Pillars and Munib Tracker are both ad-free and need no account. Compare prayer tracking, Qaza, zikr, Qur'an, Apple Watch support and pricing.",
  description:
    "Both are ad-free and account-free. Pillars focuses on prayer times and focus tools; Munib Tracker adds Qaza, zikr and the Qur'an.",
  keywords: ["munib tracker vs pillars", "pillars app alternative", "pillars prayer app"],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "Comparison",
  intro: [
    'Pillars describes itself as "the prayer app you can trust". Like Munib Tracker, it has no ads and needs no account, and it calculates prayer times on the device. It\'s focused on Salah: times, Adhan, a tracker, widgets, and Premium tools like an app blocker and a Fajr alarm.',
    "Munib Tracker shares the same privacy-first approach but covers more of daily worship: Qaza planning, adhkar, the Qur'an, recitation practice and a learning library. Here's how they compare, using Pillars' official site and store listings.",
  ],
  apps: [
    MUNIB,
    {
      id: PL,
      name: "Pillars",
      developer: "The Pillars Group Ltd",
      url: "https://thepillarsapp.com",
    },
  ],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "Choose Pillars if…",
      text: "you want a focused, beautifully simple prayer app and its smart Fajr alarm appeals to you, and you don't need a Qur'an reader or adhkar in the same app.",
    },
    {
      title: "Choose Munib Tracker if…",
      text: "you also want Qaza tracking, adhkar, a full Qur'an reader, recitation practice and a Salah focus lock in the same app, all free.",
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
            [PL]: cell.text("Free core; Premium from $11.99/month or $49.99/year in the US"),
          },
        },
        { feature: "Ads", cells: { munib: M.ads, [PL]: cell.text("No ads") } },
        {
          feature: "Account required",
          cells: { munib: M.account, [PL]: cell.text("Not required (no sign-up)") },
        },
        {
          feature: "Prayer times calculated on device",
          cells: { munib: cell.yes(), [PL]: cell.yes() },
        },
      ],
    },
    {
      group: "Salah",
      rows: [
        {
          feature: "Prayer times and Adhan",
          cells: { munib: M.times, [PL]: cell.yes("Full Adhan is Premium") },
        },
        { feature: "Qibla", cells: { munib: M.qibla, [PL]: cell.yes() } },
        {
          feature: "Log Salah as prayed",
          cells: { munib: M.salahLog, [PL]: cell.yes("Free tracker") },
        },
        {
          feature: "Excused days (hayd)",
          cells: { munib: M.excusedDays, [PL]: cell.yes("Menstruation mode keeps streaks") },
        },
        {
          feature: "Sunnah Salah and Rawatib",
          cells: {
            munib: cell.yes("Rawatib tracker (10 or 12), plus Tahajjud, Ishraq, Duha and more"),
            [PL]: cell.unverified(),
          },
        },
        {
          feature: "Qaza tracking",
          cells: {
            munib: M.qaza,
            [PL]: cell.partial("Mark a Salah as late/made up; fasting make-up counter"),
          },
        },
        {
          feature: "Block apps at Salah time",
          cells: { munib: P.focusLock, [PL]: cell.yes("PrayFirst, Premium") },
        },
        {
          feature: "Smart Fajr alarm",
          cells: { munib: cell.no("Adhan and reminders only"), [PL]: cell.yes("Premium") },
        },
        {
          feature: "Masjid times",
          cells: {
            munib: cell.yes("Masjid finder, plus your own private iqamah times, typed in"),
            [PL]: cell.partial("Masjid times in beta"),
          },
        },
      ],
    },
    {
      group: "Zikr and Qur'an",
      rows: [
        {
          feature: "Tasbeeh counter",
          cells: { munib: M.tasbeeh, [PL]: cell.partial("Apple Watch only, Premium") },
        },
        { feature: "Adhkar and duas", cells: { munib: M.zikr, [PL]: cell.unverified() } },
        {
          feature: "Qur'an reader",
          cells: { munib: M.quranReader, [PL]: cell.no("Per Pillars' own blog") },
        },
        {
          feature: "Khatm planner",
          cells: { munib: M.khatm, [PL]: cell.no("Per Pillars' own blog") },
        },
        {
          feature: "Zakat calculator",
          cells: { munib: M.zakat, [PL]: cell.no("Per Pillars' own blog") },
        },
        { feature: "Recitation practice", cells: { munib: M.recitation, [PL]: cell.unverified() } },
      ],
    },
    devicesGroup({
      [PL]: {
        ios: cell.yes("iPhone and iPad"),
        android: cell.yes(),
        appleWatch: cell.yes("Premium"),
        appleTv: NOT_ON_APP_STORE,
        widgets: cell.yes("Free"),
      },
    }),
  ],
  strengths: {
    munib: [
      "Qaza calculator and planner",
      "Adhkar, duas and tasbeeh on the phone",
      "Full Qur'an reader with recitation practice",
      "Apple Watch companion, Wear OS tiles and TV apps, all free",
      "Salah focus lock and Masjid finder at no cost",
    ],
    [PL]: [
      "Clean, focused prayer experience",
      "No ads and no account, like Munib Tracker",
      "PrayFirst app blocking and a smart Fajr alarm (Premium)",
      "Menstruation mode that keeps streaks",
      "Highly rated on the App Store",
    ],
  },
  bestFor: {
    munib: "People who want one private app for Salah, Qaza, zikr and the Qur'an.",
    [PL]: "People who want a minimal prayer app and value focus tools like app blocking.",
  },
  sources: [
    { label: "Pillars — official website", url: "https://thepillarsapp.com" },
    { label: "Pillars — features and pricing (/ai)", url: "https://thepillarsapp.com/ai" },
    {
      label: "Pillars blog — best Ramadan apps",
      url: "https://thepillarsapp.com/blog/best-ramadan-apps",
    },
    { label: "Pillars — App Store listing", url: "https://apps.apple.com/us/app/id1559086853" },
    {
      label: "Pillars — Google Play listing",
      url: "https://play.google.com/store/apps/details?id=com.pillars.pillars",
    },
  ],
  faqs: [
    {
      question: "Are Pillars and Munib Tracker both ad-free?",
      answer:
        "Yes. Both say they have no ads and don't require an account. Pillars offers optional Premium features; Munib Tracker has no paid tier.",
    },
  ],
  related: [
    "/compare/best-salah-tracker-apps",
    "/features/salah-tracker",
    "/features/zikr-tracker",
  ],
};
