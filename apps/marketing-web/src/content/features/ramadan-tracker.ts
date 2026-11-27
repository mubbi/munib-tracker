import type { FeaturePage } from "@/content/types";

export const ramadanTracker: FeaturePage = {
  slug: "ramadan-tracker",
  icon: "ramadan",
  navLabel: "Ramadan tracker",
  navHint: "Fasting log, suhoor, iftar and the last ten",
  group: "track",
  title: "A Ramadan tracker for your fasts, suhoor and iftar, and the last ten nights",
  seoTitle: "Ramadan Tracker App — Fasting Log, Suhoor & Iftar Times",
  seoDescription:
    "Log every Ramadan fast, see suhoor and iftar times with a countdown, follow the last ten nights, plan a khatm and make up missed fasts. Free, with no ads.",
  description:
    "A Ramadan mode with a day-by-day fasting log, suhoor and iftar times, a last-ten-nights guide, a khatm plan and help with missed fasts.",
  keywords: [
    "ramadan tracker",
    "ramadan fasting log app",
    "suhoor and iftar times app",
    "missed fasts tracker",
    "laylat al-qadr app",
  ],
  cluster: "fasting",
  published: "2026-11-27",
  updated: "2026-11-27",
  eyebrow: "Ramadan tracker",
  intro:
    "Ramadan goes by faster than you expect. Munib Tracker keeps the month in one place: when suhoor ends and iftar begins where you are, which days you fasted, how far you are through the Qur'an, and what is left to make up after Eid.",
  hero: null,
  whatItDoes: {
    title: "What the Ramadan tracker does",
    intro:
      "Everything here is part of the free app. Nothing in Ramadan mode sits behind a subscription.",
    groups: [
      {
        title: "Ramadan mode",
        items: [
          "Today's two times for your location: when suhoor ends (Fajr) and when iftar begins (Maghrib)",
          'A countdown to whichever comes next, then a quiet "fast complete" once Maghrib has passed',
          "A fasting log for all 29 or 30 days: tap a day and mark it Fasted, Missed or Exempt",
          "Running totals of fasted, missed and exempt days, with a progress bar for the month",
          "A home card during Ramadan showing the day of the month, both times and a one-tap way to mark today fasted",
          "After the month ends the log stays open, so you can fill in days you forgot to mark",
        ],
      },
      {
        title: "The last ten nights and Laylat al-Qadr",
        items: [
          "From the 21st night, the Ramadan screen adds a card for the last ten nights",
          "A Laylat al-Qadr guide in five parts: its virtue, when to seek it, what to say, how to spend the night, and reminders, with a short quiz",
          "Count the dua of the night on the [Tasbeeh counter](/features/tasbeeh-counter), hands-free if you like",
          "Recite Surah al-Qadr along with the on-device listener from [Qur'an practice](/features/quran-practice)",
          "The guide does not name a single date for the night or repeat folk signs for spotting it",
        ],
      },
      {
        title: "A khatm plan for the month",
        items: [
          "Start a khatm plan for 30, 60 or 90 days, or set your own number of days",
          "Choose a daily target in ayahs or in mushaf pages",
          "See whether you are ahead, on track or behind, and how much to read today to catch up",
          "Log the day's reading in one tap, or correct the total by hand",
          "Share the Qur'an out among relatives with a [group khatm](/features/family-and-friends)",
        ],
      },
      {
        title: "Missed fasts, fidyah and Eid",
        items: [
          "After Ramadan the app offers to add your missed and exempt days to a fasting Qaza count; it never adds them for you",
          "A fasting Qaza counter: log each make-up fast, adjust what remains, or estimate older years you never counted",
          "A voluntary fast you mark as Qaza in the [fasting planner](/features/fasting-tracker) comes off the same count",
          "Fidyah and kaffarah helpers that turn days and a local meal cost into a planning estimate, with the food measure for your [madhhab](/features/my-madhhab)",
          "Short reference cards by school: eating forgetfully, what requires kaffarah, sadaqat al-fitr amounts and the number of Tarawih rakahs",
          "An Eid guide covering the Eid Salah, Zakat al-Fitr and the Sunnah practices of the day, with a quiz",
        ],
      },
      {
        title: "Around your phone",
        items: [
          "A home-screen [widget](/features/widgets-and-devices) with suhoor and iftar times and a countdown",
          "A Ramadan shortcut on the app icon's quick actions for the length of the month",
          'Seasonal banners on the home screen for Ramadan, the last ten nights and Eid, each with a "hide for this season" option',
          "Optional seasonal app icons for Ramadan, the last ten nights and Eid on iPhone and Android",
        ],
      },
    ],
  },
  why: {
    title: "Why track Ramadan at all?",
    paragraphs: [
      "By the third week most of us can't say for certain which days we fasted. A journey, an illness or a few excused days blur together, and the question of how many days to make up gets pushed to next year.",
      "A log you fill in with one tap a day answers that question before Eid arrives. You see the month as it really went, and the days still owed move straight into a count you can work through at your own pace.",
      "The same goes for the Qur'an. A plan that tells you today's portion, and how to catch up after a slow day, is easier to keep than a promise to \"read more this year\".",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Set your location once",
        text: "Suhoor and iftar come from the same [Salah times](/features/prayer-times-qibla) the app already calculates on your device for your location and method.",
      },
      {
        title: "Open Ramadan mode",
        text: "During the month, the home card and the seasonal banner take you straight to the Ramadan screen.",
      },
      {
        title: "Mark each day",
        text: "Tap the tick on today's card, or tap any past day in the grid to set it to Fasted, Missed or Exempt. Every change can be undone.",
      },
      {
        title: "Start your khatm",
        text: "Pick a plan length and a daily target, then log your reading as you go.",
      },
      {
        title: "Settle up after Eid",
        text: "Accept the offer to add the days you owe to your fasting Qaza, then log each make-up fast when you keep it.",
      },
    ],
  },
  benefits: [
    {
      title: "Times for where you are",
      text: "Suhoor and iftar follow your own location and calculation method, and are worked out on your device.",
    },
    {
      title: "An honest record",
      text: "Missed and exempt days are counted plainly, with no streaks to lose and no guilt-driven messages.",
    },
    {
      title: "Follows your school",
      text: "Fidyah measures and the rulings cards follow the madhhab you chose, or show every view side by side.",
    },
    {
      title: "On the right dates",
      text: "The month follows the Hijri calendar, including your own [Hijri date adjustment](/features/hijri-calendar) if your community started a day apart.",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "A week of travel",
        text: "Mark the days you did not fast as Missed while you are away. After Eid they are waiting in your make-up count, not in your memory.",
      },
      {
        title: "The last ten nights",
        text: "Open the Laylat al-Qadr guide after Isha, count the dua on the Tasbeeh counter, then read tonight's khatm portion.",
      },
      {
        title: "A khatm in thirty days",
        text: "Choose the 30-day plan by page and read a few pages after each Salah. The plan shows at once if you have slipped behind.",
      },
    ],
  },
  notes: [
    {
      tone: "scholar",
      text: "Suhoor and iftar times are calculated estimates, and the start of Ramadan depends on moon sighting where you live. Follow your local Masjid for the start of the month and the daily times. The rulings cards and the fidyah and kaffarah helpers are for learning and planning; they are not a fatwa, so ask a qualified scholar about your own case.",
    },
    {
      tone: "info",
      title: "What it does not do",
      text: "Munib Tracker does not log Tarawih as its own Salah; the Ramadan screen only shows, for information, how many rakahs each school prays. Seasonal app icons are available on iPhone and Android phones, not on the web or TV. The hands-free dua counter and the Surah al-Qadr recite-along are not available on TV.",
    },
  ],
  faqs: [
    {
      question: "Is there a free Ramadan tracker app without ads?",
      answer:
        "Yes. Munib Tracker's Ramadan mode is free and has no ads. It includes the fasting log, suhoor and iftar times, the Laylat al-Qadr and Eid guides, a khatm plan and the missed-fasts counter, with no subscription.",
    },
    {
      question: "How does the app work out suhoor and iftar times?",
      answer:
        "Suhoor ends at Fajr and iftar begins at Maghrib for your location. Both come from the Salah times the app calculates on your device with the method you chose, so they work offline. They are estimates; follow your local Masjid if its timetable differs.",
    },
    {
      question: "Can I track missed Ramadan fasts and make them up later?",
      answer:
        "Yes. Mark a day Missed or Exempt in the fasting log, and after Ramadan the app offers to add those days to your fasting Qaza count. Each make-up fast you log brings the count down, and you can adjust the number at any time.",
    },
    {
      question: "Does the app calculate fidyah or kaffarah?",
      answer:
        "It gives a planning estimate, not a ruling. You enter the number of days and the local cost of feeding one person, and the helper shows the total and the food measure for your school. A qualified scholar should confirm whether you owe Qaza, fidyah or kaffarah.",
    },
    {
      question: "Will it tell me which night is Laylat al-Qadr?",
      answer:
        "No. The guide explains when to seek the night and how to spend it, and the Ramadan screen highlights the last ten nights from the 21st. It deliberately does not claim to know the date. See our [Laylat al-Qadr guide](/resources/ramadan-fasting/laylat-al-qadr-guide).",
    },
    {
      question: "Can I plan to finish the Qur'an in Ramadan?",
      answer:
        "Yes. Start a 30-day khatm plan, choose ayahs or mushaf pages as your daily target, and log what you read. The plan shows whether you are ahead or behind and how much to read to catch up. More on the reader is on the [Qur'an page](/features/quran).",
    },
  ],
  related: ["fasting-tracker", "quran", "my-madhhab", "widgets-and-devices"],
  guides: [
    "/resources/ramadan-fasting/how-to-prepare-for-ramadan",
    "/resources/ramadan-fasting/laylat-al-qadr-guide",
  ],
  cta: {
    title: "Have it ready before the first fast",
    text: "Download Munib Tracker, set your location, and Ramadan mode will be waiting when the month begins.",
  },
};
