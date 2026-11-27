import type { FeaturePage } from "@/content/types";

export const qazaSalahTracker: FeaturePage = {
  slug: "qaza-salah-tracker",
  icon: "qaza",
  navLabel: "Qaza tracker",
  navHint: "Make up missed Salah at your pace",
  group: "track",
  title: "Make up missed Salah with a Qaza plan you can keep",
  seoTitle: "Qaza Salah Tracker — Missed Prayer Calculator & Planner",
  seoDescription:
    "Estimate your missed Salah, choose a daily pace, and track every Qaza you make up, plus missed fasts. A free, private Qaza (qada) tracker with no ads.",
  description:
    "Estimate your missed Salah, choose a daily pace, and watch the number go down, one make-up Salah at a time.",
  keywords: [
    "qaza salah tracker",
    "missed prayer tracker",
    "qada prayer calculator",
    "qaza namaz tracker",
    "make up missed prayers app",
  ],
  cluster: "qaza",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "Qaza tracker",
  intro:
    "If you have years of missed Salah behind you, the number can feel too big to start. Munib Tracker helps you estimate it, turn it into a small daily pace, and see real progress as you make each one up.",
  hero: {
    key: "qaza",
    caption:
      "Your Qaza at a glance: remaining, made up, and an estimated finish date at your pace.",
  },
  whatItDoes: {
    title: "What the Qaza tracker does",
    groups: [
      {
        title: "Know where you stand",
        items: [
          "A counter for each Salah: Fajr, Dhuhr, Asr, Maghrib, Isha and Witr",
          "Witr and other points where the schools differ follow your madhhab setting, or show every view",
          "Salah you mark as missed in the tracker are added automatically",
          "A lifetime calculator to estimate a backlog from the years you didn't pray",
          "Import past Salah logs from another app or a spreadsheet, with missed ones added to Qaza",
        ],
      },
      {
        title: "Plan a pace you can keep",
        items: [
          "Gentle, balanced, committed and intensive presets, or a custom number for each Salah",
          "An estimated finish date that updates as you go",
          "A Qaza goal in Today's Goal on the home screen",
          "Optional Qaza reminders to stay on pace",
        ],
      },
      {
        title: "See every step",
        items: [
          "Tap to log each make-up Salah, with undo",
          "A history log of what you've made up and when",
          "Progress bar and percentage made up",
          "Achievements that match your current debt and disappear once it's cleared",
        ],
      },
      {
        title: "Missed fasts too",
        items: [
          "Track missed fasts separately from Salah",
          "A voluntary fasting planner that links back to the fasts you need to make up",
          "Fidyah and kaffarah guidance in the learning library",
          "A home-screen widget showing what's left",
        ],
      },
    ],
  },
  why: {
    title: "Why a Qaza plan helps",
    paragraphs: [
      'Many Muslims come back to Salah after years away and then hit a wall: "How do I make up everything I missed?" Without a number and a plan, it\'s easy to do nothing at all.',
      "Breaking a large backlog into a small daily pace changes how it feels. One extra make-up Salah alongside each obligatory one is five a day. At that pace, a year of missed Salah is done in about a year, and the finish date is right there on your screen.",
      "Tracking also protects you from losing count. Months into a plan, you won't have to guess how many you've made up.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Estimate your backlog",
        text: "Enter the period you didn't pray, or set each Salah's count yourself. The calculator includes a reminder to err on the side of caution and to ask a scholar about your situation.",
      },
      {
        title: "Pick a pace",
        text: "Choose a preset or set how many of each Salah you'll make up per day. The planner shows when you'll finish at that pace.",
      },
      {
        title: "Log as you pray",
        text: "Tap to record each make-up Salah. The remaining number drops, and Today's Goal on the home screen reflects it.",
      },
      {
        title: "Adjust without starting over",
        text: "Life changes. Lower your pace for a busy month or raise it in Ramadan; your history and progress stay intact.",
      },
    ],
  },
  benefits: [
    {
      title: "A big number becomes a daily habit",
      text: "The planner is built around a phrase you'll see in the app: consistency over intensity. A pace you can keep for years beats a burst you drop in a week.",
    },
    {
      title: "Nothing slips through",
      text: "Missed Salah from your daily tracker flow straight into Qaza, so the count stays accurate without extra work.",
    },
    {
      title: "Private",
      text: "Your backlog is personal. It stays on your device unless you choose to sign in and sync.",
    },
    {
      title: "Honest about the fiqh",
      text: "Calculators are aids, not fatwas. The app points out where scholars differ, such as on Witr, and suggests you ask someone qualified.",
    },
  ],
  gallery: [
    { key: "tracker", caption: "The Qaza ring on the tracker shows today's make-up progress." },
    { key: "home", caption: "Qaza joins Salah and zikr in Today's Goal on the home screen." },
    {
      key: "qaza",
      device: "android-tablet",
      caption:
        "On an Android tablet: a counter for each Salah beside the calculator, planner, fasting and history.",
    },
  ],
  examples: {
    title: "Practical examples",
    items: [
      {
        title: "Returning after university",
        text: "Someone who didn't pray for about three years estimates roughly 1,095 days of each Salah. At two make-ups per Salah each day, the planner shows a finish date about a year and a half away.",
      },
      {
        title: "Only Fajr was missed",
        text: "Set the Fajr counter alone and make up one extra Fajr each morning. The other counters stay at zero.",
      },
      {
        title: "Ramadan push",
        text: "Raise the pace for the month when your routine is strongest, then return to your usual pace afterwards.",
      },
    ],
  },
  notes: [
    {
      tone: "scholar",
      title: "Scholars differ on some Qaza questions",
      text: "How to make up Salah, whether order matters, whether Witr is made up, and how deliberately abandoned Salah are treated are all discussed differently across schools. Read [What is Qaza Salah?](/resources/salah/what-is-qaza-salah) for an overview, and ask a qualified scholar about your own case.",
    },
  ],
  faqs: [
    {
      question: "How do I estimate how many Salah I missed?",
      answer:
        "Start from when you became responsible for Salah (usually puberty) and count the days you didn't pray, then multiply by each Salah. The in-app calculator does this for you. Our guide on [how to track missed prayers](/resources/salah/how-to-track-missed-prayers) walks through an example.",
    },
    {
      question: "Is Qaza the same as qada or qadha?",
      answer:
        'Yes. They are different spellings of the same word for making up an obligatory act after its time. Munib Tracker uses "Qaza" throughout.',
    },
    {
      question: "Does the app tell me whether I must make up a Salah?",
      answer:
        "No. It helps you count and plan. Whether a particular Salah needs making up is a question for a qualified scholar.",
    },
    {
      question: "Can I track missed fasts as well?",
      answer: "Yes. Missed fasts have their own tracker, separate from Salah.",
    },
  ],
  related: ["salah-tracker", "worship-progress", "daily-islamic-habits", "prayer-times-qibla"],
  guides: ["/resources/salah/what-is-qaza-salah", "/resources/salah/how-to-track-missed-prayers"],
  cta: {
    title: "Turn your Qaza into a plan",
    text: "Download Munib Tracker, estimate your backlog in a minute, and make up your first Salah today.",
  },
};
