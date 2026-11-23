import type { FeaturePage } from "@/content/types";

export const salahFocusLock: FeaturePage = {
  slug: "salah-focus-lock",
  icon: "focus",
  navLabel: "Salah focus lock",
  navHint: "Block distracting apps at Salah time",
  group: "track",
  title: "Put your phone down for Salah with a focus lock",
  seoTitle: "Salah Focus Lock — Block Distracting Apps at Prayer Time",
  seoDescription:
    "Block the apps you choose around each Salah until you pray or the window ends. Gentle, firm or strict modes, Jumu'ah support and pauses on excused days. Free.",
  description:
    "Block the apps you choose during a window around each Salah, until you pray or the window ends.",
  keywords: [
    "salah focus lock",
    "block apps during prayer",
    "prayer app blocker",
    "salah screen time",
  ],
  cluster: "salah",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "Salah focus lock",
  intro:
    "The Adhan goes, and somehow ten minutes later you're still scrolling. The focus lock blocks the apps you pick for a short window around each Salah, so the easiest thing to do is get up and pray.",
  hero: null,
  whatItDoes: {
    title: "What the focus lock does",
    groups: [
      {
        title: "A window around each Salah",
        items: [
          "Choose which Salah to cover, including Jumu'ah on Fridays",
          "Start at the Adhan, or at iqamah if your home Masjid has times",
          "Choose how long the window lasts, from 5 to 60 minutes",
          "Overlapping windows are merged, for example at high latitudes",
        ],
      },
      {
        title: "Blocks only what you choose",
        items: [
          "Pick the apps that distract you; everything else keeps working",
          "Uses the system's own screen-time tools on iPhone and Android",
          "Your app choices stay on your device",
        ],
      },
      {
        title: "Three levels of firmness",
        items: [
          '**Gentle:** hold "I\'ll pray now" for a few seconds to unlock',
          "**Firm:** apps unlock when you mark the Salah as prayed",
          "**Strict:** apps stay blocked until the window ends or you mark the Salah as prayed",
          "A small number of emergency unlocks each day",
        ],
      },
      {
        title: "Fits your life",
        items: [
          "Marking the Salah as prayed, anywhere, ends the window early",
          "Pauses automatically on excused days for hayd, illness or travel",
          "Quiet dates and weekday-only schedules",
        ],
      },
    ],
  },
  why: {
    title: "Why lock your phone at Salah time?",
    paragraphs: [
      "Most delayed Salah aren't a decision. They're a notification, a video, one more message. The Qur'an asks believers to leave trade when the call to Jumu'ah is made; for many of us today, the phone is the trade.",
      "A focus lock removes the temptation for a few minutes, which is often all it takes. Once you've prayed, everything unlocks.",
      "It's your tool, set up your way. There's no judgement when you use an emergency unlock; the count is only there for you to reflect on.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Allow screen-time access",
        text: "Give Munib Tracker permission to use the system's focus tools. On iPhone this is Apple's Screen Time; on Android, usage access.",
      },
      {
        title: "Pick apps and Salah",
        text: "Choose the apps to block and which Salah to cover.",
      },
      {
        title: "Set the window and mode",
        text: "Pick when it starts, how long it lasts, and whether it's gentle, firm or strict.",
      },
      {
        title: "Pray and unlock",
        text: "Mark the Salah as prayed in the app, a widget or your watch, and your apps come back.",
      },
    ],
  },
  benefits: [
    {
      title: "Fewer delayed Salah",
      text: "Removing the distraction at the right moment makes praying on time the default.",
    },
    {
      title: "Free",
      text: "No subscription, unlike most app blockers.",
    },
    {
      title: "Built around Salah times",
      text: "Windows follow your calculated times, your adjustments and your home Masjid's iqamah.",
    },
    {
      title: "Respects excused days",
      text: "No blocking or judgement when you are excused from Salah.",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "Fajr after waking",
        text: "Block social apps for 30 minutes from Fajr, so the first thing you do is pray.",
      },
      {
        title: "Workday Dhuhr and Asr",
        text: "Firm mode on weekdays: your email and chat apps return as soon as you mark the Salah.",
      },
      {
        title: "Jumu'ah",
        text: "Cover Jumu'ah from the Adhan until the khutbah and Salah are over.",
      },
    ],
  },
  notes: [
    {
      tone: "info",
      text: "The focus lock needs permission to use your phone's screen-time features. It is available in the iPhone and Android apps.",
    },
  ],
  faqs: [
    {
      question: "Can I still make calls or use maps during the window?",
      answer: "Yes. Only the apps you choose are blocked.",
    },
    {
      question: "What if there's an emergency?",
      answer:
        "Each day includes a few emergency unlocks (none in strict mode, if you choose). They're counted privately, with no judgement.",
    },
    {
      question: "Does it work on a computer?",
      answer:
        "No. It uses phone screen-time features, so it is available in the iPhone and Android apps.",
    },
  ],
  related: ["salah-tracker", "masjid-finder", "prayer-times-qibla", "daily-islamic-habits"],
  guides: ["/resources/salah/how-to-build-a-consistent-salah-habit"],
  cta: {
    title: "Make praying on time the easy choice",
    text: "Download Munib Tracker, turn on the focus lock for one Salah, and see how it feels.",
  },
};
