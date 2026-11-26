import type { FeaturePage } from "@/content/types";

export const salahTracker: FeaturePage = {
  slug: "salah-tracker",
  icon: "salah",
  navLabel: "Salah tracker",
  navHint: "Log the five daily Salah",
  group: "track",
  title: "A Salah tracker that helps you pray, not just count",
  seoTitle: "Salah Tracker App — Log Your 5 Daily Prayers, Free & Ad-Free",
  seoDescription:
    "Log Fajr to Isha, Witr and Sunnah Salah, see your streak and calendar, and get gentle reminders. A free Muslim prayer tracker with no ads and no account.",
  description:
    "Log each of the five daily Salah, plus Witr and Sunnah, and see an honest picture of your week, month and year.",
  keywords: [
    "salah tracker",
    "prayer tracker app",
    "muslim prayer tracker",
    "daily salah tracker",
    "namaz tracker",
  ],
  cluster: "salah",
  published: "2026-11-23",
  updated: "2026-11-24",
  eyebrow: "Salah tracker",
  intro:
    "Mark each Salah as you pray it, see where your day stands at a glance, and build a routine you can keep. Munib Tracker is a free prayer tracker for Muslims, with no ads and no account required.",
  hero: {
    key: "tracker",
    caption: "Today's Salah progress, your streak, and rings for Witr, adhkar, Qaza and khatm.",
  },
  whatItDoes: {
    title: "What the Salah tracker does",
    intro: "Everything you need to keep an honest daily record, in one screen.",
    groups: [
      {
        title: "The five daily Salah",
        items: [
          "Fajr, Dhuhr, Asr, Maghrib and Isha, each with its own status",
          "Statuses for completed, delayed, missed and Qaza, so the record stays honest",
          "Witr tracked separately from the five fard Salah",
          "A Jama'ah toggle for Salah prayed in congregation",
          "Private notes on any Salah",
        ],
      },
      {
        title: "Sunnah and optional Salah",
        items: [
          "Tahajjud, Ishraq, Duha, Tahiyyat al-Masjid, Hajat and Istikhara",
          "A Rawatib tracker for the confirmed Sunnah: 12 or 10 rakahs, following your madhhab, which you can change",
          "Optional reminders for the Tahajjud, Ishraq and Duha windows",
          "A Tahajjud log with its own streak",
        ],
      },
      {
        title: "See the bigger picture",
        items: [
          "A progress ring for today and a streak of consecutive days",
          "A calendar that shows prayed, partial and missed days",
          "Week, month and year statistics, plus a weekly worship report",
          "A khushu' journal to note how present you felt in each Salah",
        ],
      },
      {
        title: "Fits real life",
        items: [
          "Excused days for travel, illness or hayd, so your streak isn't broken unfairly",
          "Missed Salah flow straight into your Qaza counters",
          "A [Salah focus lock](/features/salah-focus-lock) that blocks distracting apps until you pray",
          "Mark a fard Salah as prayed at your home Masjid, and find one with the [Masjid finder](/features/masjid-finder)",
          "Mark Salah from a home-screen widget, Apple Watch or Wear OS",
          "Works offline; optional sign-in syncs across your devices",
        ],
      },
    ],
  },
  why: {
    title: "Why track your Salah at all?",
    paragraphs: [
      "Most of us don't stop praying in one day. A Salah gets delayed, then skipped, then the week has gaps we only half remember. Writing it down makes those gaps visible while they are still small.",
      "A tracker isn't there to judge you. It's a mirror. Seeing that Fajr is the one you keep missing tells you exactly where to put your effort, whether that's an earlier night, a second alarm or praying Isha before you get too tired.",
      "And when things go well, it shows that too. A streak of completed days is a quiet reminder that consistency is possible, one Salah at a time.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Set your location",
        text: "Use GPS or search for your city. Salah times are calculated on your device with the method and Asr madhab you choose.",
      },
      {
        title: "Tap a Salah to log it",
        text: "Choose completed, delayed, missed or Qaza. It takes a second, and it's saved on your phone straight away.",
      },
      {
        title: "Turn on the reminders you want",
        text: "Every reminder is off until you enable it. You can add an Adhan, choose its style, and set a reminder a few minutes before or after each Salah.",
      },
      {
        title: "Review your week",
        text: "Check the calendar and statistics to see your pattern, then focus on the Salah that need the most attention.",
      },
    ],
  },
  benefits: [
    {
      title: "Honest, not harsh",
      text: "Delayed and missed are recorded as they are, without red alerts or guilt trips. The goal is to help you come back, not to make you feel bad.",
    },
    {
      title: "Private by default",
      text: "Your record stays on your device. There's no account to create and no ads tracking you.",
    },
    {
      title: "Connected to the rest of your worship",
      text: "Missed Salah feed your Qaza plan, and your Salah count joins zikr and Qur'an reading in Today's Goal.",
    },
    {
      title: "Always with you",
      text: "Check the next Salah and mark it from your lock screen, widget or watch, even without opening the app.",
    },
  ],
  gallery: [
    {
      key: "home",
      caption: "Home: today's Salah times, the Hijri date and a countdown to the next Salah.",
    },
    { key: "tracker-light", caption: "The tracker in the light theme." },
    { key: "tracker", device: "android", caption: "The same tracker on an Android phone." },
    {
      key: "tracker",
      device: "ipad",
      caption: "On iPad, today's schedule sits beside your Salah.",
    },
  ],
  examples: {
    title: "How people use it",
    items: [
      {
        title: "Fixing a weak Fajr",
        text: "Log every Salah for two weeks, then look at the calendar. If Fajr is the gap, set a Fajr reminder with the Adhan and track just that one until it's steady.",
      },
      {
        title: "Praying at work",
        text: "Use the delayed status honestly when Dhuhr slips past its start, and add a note about what got in the way. Patterns show up quickly.",
      },
      {
        title: "Travelling",
        text: "Mark a travel day as excused where that applies to you, read the in-app travel guide on shortening and combining, and keep your streak intact.",
      },
    ],
  },
  notes: [
    {
      tone: "scholar",
      text: "Munib Tracker records what you tell it; it does not decide whether a Salah is valid, late or needs to be made up. For rulings about your own situation, ask a qualified scholar.",
    },
  ],
  faqs: [
    {
      question: "Is the Salah tracker free?",
      answer:
        "Yes. Munib Tracker is free, with no ads, subscriptions or in-app purchases. Every tracking feature is available without signing in.",
    },
    {
      question: "Does it calculate Salah times?",
      answer:
        "Yes. Times are calculated on your device for your GPS location or chosen city, using one of 13 calculation methods and your Asr madhab (Shafi'i or Hanafi). You can fine-tune each Salah by a few minutes. See [Salah times and Qibla](/features/prayer-times-qibla).",
    },
    {
      question: "What happens when I mark a Salah as missed?",
      answer:
        "It is added to your Qaza counter for that Salah, so you can plan to make it up. Read more about the [Qaza tracker](/features/qaza-salah-tracker).",
    },
    {
      question: "Can I use it on more than one device?",
      answer:
        "Yes. Sign in with Google, Apple or Facebook to sync your record between your phone, tablet and the web app. Without signing in, everything stays on the device you use.",
    },
    {
      question: "Does it track Witr and Sunnah Salah?",
      answer:
        "Yes. Witr is tracked on its own, and you can log Sunnah and optional Salah such as Tahajjud, Ishraq and Duha.",
    },
    {
      question: "Can it stop me getting distracted at Salah time?",
      answer:
        "Yes. The [Salah focus lock](/features/salah-focus-lock) blocks the apps you choose for a window around each Salah, until you mark it as prayed or the window ends.",
    },
  ],
  related: [
    "qaza-salah-tracker",
    "salah-focus-lock",
    "prayer-times-qibla",
    "worship-progress",
    "daily-islamic-habits",
  ],
  guides: [
    "/resources/salah/how-to-build-a-consistent-salah-habit",
    "/resources/islamic-habits/how-to-stay-consistent-with-daily-worship",
  ],
  cta: {
    title: "Start tracking your Salah today",
    text: "Download Munib Tracker, set your location, and log your next Salah. It takes less than a minute.",
  },
};
