import type { FeaturePage } from "@/content/types";

export const worshipProgress: FeaturePage = {
  slug: "worship-progress",
  icon: "progress",
  navLabel: "Worship progress",
  navHint: "Statistics, streaks and Noor levels",
  group: "track",
  title: "See your progress in worship, without the pressure",
  seoTitle: "Worship Progress & Salah Statistics — Streaks and Insights",
  seoDescription:
    "Weekly, monthly and yearly Salah statistics, a weekly worship report, streaks, and Noor devotion levels that never cap out. Insights that encourage you.",
  description:
    "Week, month and year statistics, a weekly worship report, streaks, achievements and Noor levels that never run out.",
  keywords: [
    "salah statistics",
    "worship progress tracker",
    "prayer streak app",
    "islamic achievements",
    "weekly worship report",
  ],
  cluster: "progress",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "Worship progress",
  intro:
    "Look back at your week, month or year of worship and see what's growing. Statistics, a weekly report and Noor devotion levels show your progress honestly, and always point to the next small step.",
  hero: {
    key: "tracker",
    caption: "Your streak, today's rings, and your Noor level and achievements on the tracker.",
  },
  whatItDoes: {
    title: "What you can see",
    groups: [
      {
        title: "Statistics",
        items: [
          "Week, month and year views of your Salah",
          "Lifetime totals and today's snapshot",
          "Per-Salah adhkar history",
          "A calendar of prayed, partial and missed days",
        ],
      },
      {
        title: "Weekly worship report",
        items: [
          "A once-a-week summary of your worship",
          "Salah completed and perfect days that week",
          "Qaza made up and zikr sessions completed",
          "A gentle coach with one to three kind, practical suggestions from your week, computed on your device",
        ],
      },
      {
        title: "Achievements",
        items: [
          "Salah, Streak, Zikr and Consistency tracks that never cap out",
          "Qaza and fasting goals that match your current debt and disappear once cleared",
          "Optional achievement notifications",
        ],
      },
      {
        title: "Noor devotion levels",
        items: [
          "Earn Noor from Salah, Qaza, zikr and perfect days",
          "Levels keep growing; there is always a next one",
          "Your level shows on the tracker and home screen",
        ],
      },
    ],
  },
  why: {
    title: "Why look at your progress?",
    paragraphs: [
      "It's hard to feel progress day to day. Looking back over a month shows the change you can't see from inside a single week: Fajr that used to be missed and now isn't, or a zikr habit that's held for thirty days.",
      "Statistics also help you aim. If Asr is your weakest Salah, that's the one to set a reminder for. If your Qaza pace slipped last month, you can adjust it now rather than give up later.",
      "Achievements in Munib Tracker are designed to encourage, not to rank you against anyone. There are no leaderboards, and no badge ever says you failed.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Log as usual",
        text: "Every Salah, Qaza and zikr you record feeds your statistics automatically.",
      },
      {
        title: "Open Statistics",
        text: "Switch between week, month and year to see your pattern.",
      },
      {
        title: "Read your weekly report",
        text: "Once a week, see how many Salah you completed, your perfect days, Qaza made up and zikr sessions.",
      },
      {
        title: "Grow your level",
        text: "Noor accumulates from your worship and moves you up through devotion levels that never end.",
      },
    ],
  },
  benefits: [
    {
      title: "Motivation without guilt",
      text: "Missed days don't erase your history, and excused days don't break your streak.",
    },
    {
      title: "Focus where it matters",
      text: "See which Salah or habit needs attention instead of guessing.",
    },
    {
      title: "Private",
      text: "No public profiles or leaderboards. Your statistics are for you.",
    },
    {
      title: "Long-term",
      text: "Tracks scale from your first Salah to thousands, so there's always a next milestone.",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "A monthly check-in",
        text: "On the first of each Hijri month, open the month view and choose one Salah to improve.",
      },
      {
        title: "After Ramadan",
        text: "Compare Shawwal with Ramadan and pick one habit to keep, like the after-Salah adhkar.",
      },
      {
        title: "Celebrating consistency",
        text: "Turn on achievement notifications to get a quiet nudge when you reach a new streak.",
      },
    ],
  },
  notes: [
    {
      tone: "info",
      text: "Statistics reflect only what you log. They are a tool for self-reflection, not a measure of anyone's faith or of what Allah accepts.",
    },
  ],
  faqs: [
    {
      question: "Are my statistics shared with anyone?",
      answer:
        "No. There are no public profiles or leaderboards. Your data stays on your device unless you sign in to sync it to your own account.",
    },
    {
      question: "What are Noor levels?",
      answer:
        "Noor is a measure of the worship you log: Salah, Qaza, zikr and perfect days. It builds up over time and moves you through devotion levels with no upper limit.",
    },
    {
      question: "Does a missed day reset everything?",
      answer:
        "A missed day ends the current streak, but your totals, levels and history stay. Excused days for travel, illness or hayd don't break the streak.",
    },
  ],
  related: ["salah-tracker", "daily-islamic-habits", "qaza-salah-tracker", "zikr-tracker"],
  guides: [
    "/resources/islamic-habits/how-to-stay-consistent-with-daily-worship",
    "/resources/salah/how-to-build-a-consistent-salah-habit",
  ],
  cta: {
    title: "See how far you've come",
    text: "Download Munib Tracker and start building a record you'll be glad to look back on.",
  },
};
