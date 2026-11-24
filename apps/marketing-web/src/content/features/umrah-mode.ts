import type { FeaturePage } from "@/content/types";

export const umrahMode: FeaturePage = {
  slug: "umrah-mode",
  icon: "umrah",
  navLabel: "Umrah mode",
  navHint: "A step-by-step companion during Umrah",
  group: "everyday",
  title: "Umrah mode: a calm, step-by-step companion for your Umrah",
  seoTitle: "Umrah Guide App — Step by Step, With Tawaf & Sa'i Counters",
  seoDescription:
    "Follow your Umrah step by step: a miqat check, talbiyah, a tawaf counter, two rakahs, Zamzam, a sa'i counter and halq or taqsir, with duas from Hisnul Muslim.",
  description:
    "A live, step-by-step Umrah companion with a miqat check, tawaf and sa'i counters, duas from Hisnul Muslim and your place saved.",
  keywords: ["umrah guide app", "tawaf counter", "umrah step by step", "sai counter"],
  cluster: "habits",
  published: "2026-11-24",
  updated: "2026-11-24",
  eyebrow: "Umrah mode",
  intro:
    "In the crowd of the Haram it's easy to lose count of your circuits or wonder what comes next. Umrah mode walks you through each rite in order, counts your tawaf and sa'i with one tap, and keeps your place if you close the app.",
  hero: null,
  whatItDoes: {
    title: "What Umrah mode does",
    groups: [
      {
        title: "Every rite, in order",
        items: [
          "Prepare, miqat, ihram and talbiyah, arriving at the Haram, tawaf, two rakahs at Maqam Ibrahim, Zamzam, sa'i, and halq or taqsir",
          "Short, practical guidance for each step, with a link to the full lesson in the Hajj & Umrah guide",
          "Your place is saved, so you can close the app and pick up where you left off",
        ],
      },
      {
        title: "Counters you can trust",
        items: [
          "A seven-circuit tawaf counter and a seven-course sa'i counter, one tap each",
          "Undo a mistaken tap",
          "An optional per-lap timer",
          "Help for when you're unsure how many circuits you've done",
        ],
      },
      {
        title: "The miqat",
        items: [
          "By land: check your distance to the nearest miqat, using your location on the device",
          "By air: enter the time your flight crosses the miqat for a countdown",
          "The five miqats, with their names",
        ],
      },
      {
        title: "Duas and differences",
        items: [
          "The talbiyah and the duas tied to places, shown from Hisnul Muslim with audio",
          "No made-up dua for each circuit: between the marked places, make your own dua",
          "Where the schools differ, such as wudu for tawaf, the difference is labelled",
          "During hayd or nifas, tawaf and the two rakahs wait, gently, while the rest stays open",
        ],
      },
    ],
  },
  why: {
    title: "Why a companion for Umrah?",
    paragraphs: [
      "Umrah is a handful of rites, but doing them for the first time, tired and surrounded by thousands of people, is different from reading about them at home.",
      "A counter that keeps your circuits, a clear next step, and the right dua at the right place let you give your attention to worship instead of to remembering the order.",
      "Umrah mode builds on the app's Hajj & Umrah guide and checklist, so you can learn at home and follow the same steps on the day.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Prepare at home",
        text: "Read the Hajj & Umrah guide and the Umrah checklist before you travel.",
      },
      {
        title: "Start Umrah mode",
        text: "Check your distance to the miqat by land, or set the time your flight crosses it.",
      },
      {
        title: "Tap as you go",
        text: "Count each tawaf circuit and sa'i course with one tap, with the duas for each place on screen.",
      },
      {
        title: "Finish calmly",
        text: "Complete halq or taqsir, and Umrah mode marks your Umrah complete.",
      },
    ],
  },
  benefits: [
    {
      title: "Works offline",
      text: "Steps, counters and duas work without a connection, which helps in a crowded Haram.",
    },
    {
      title: "Private",
      text: "Your location is checked on your device only while the miqat screen is open. It isn't saved or sent.",
    },
    {
      title: "Sourced duas",
      text: "Duas come from Hisnul Muslim with their references; none are typed in or invented.",
    },
    {
      title: "Respects your madhhab",
      text: "Labelled differences follow your [madhhab setting](/features/my-madhhab), or show every view.",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "Flying from abroad",
        text: "Set the time the airline says you'll cross the miqat, and be in ihram before the countdown ends.",
      },
      {
        title: "Lost count in tawaf",
        text: "Your circuits are on screen. If you tapped twice by mistake, undo the last one.",
      },
      {
        title: "With family",
        text: "One person counts on their phone while everyone makes dua.",
      },
    ],
  },
  notes: [
    {
      tone: "scholar",
      text: "Umrah mode is a practical guide, not a substitute for your official Umrah provider or a scholar. For questions about your own situation, ask a qualified scholar.",
    },
    {
      tone: "info",
      text: "Umrah mode is best on your phone; it also works in the web app. On TV it shows the order of the steps only.",
    },
  ],
  faqs: [
    {
      question: "Does Umrah mode work without internet?",
      answer:
        "Yes. The steps, counters and duas work offline. Checking your distance to the miqat uses your device's location, not the internet.",
    },
    {
      question: "Does it tell me which dua to say on each circuit?",
      answer:
        "No, because no fixed dua per circuit is established. It shows the remembrances tied to places, such as at the Black Stone and between the Yemeni corner and the Black Stone, and invites you to make your own dua in between.",
    },
    {
      question: "What if my period starts during Umrah?",
      answer:
        "Tawaf and the two rakahs wait until you are pure and have made ghusl; your ihram stays in place. The app links to its hayd guide and suggests asking a scholar if your group must leave first.",
    },
    {
      question: "Is my location saved?",
      answer:
        "No. It is checked on your device while the miqat screen is open, and isn't saved or sent.",
    },
  ],
  related: ["fasting-tracker", "my-madhhab", "zikr-tracker", "prayer-times-qibla"],
  cta: {
    title: "Take a companion on your Umrah",
    text: "Download Munib Tracker and open Umrah mode before you travel.",
  },
};
