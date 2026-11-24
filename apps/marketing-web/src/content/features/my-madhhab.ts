import type { FeaturePage } from "@/content/types";

export const myMadhhab: FeaturePage = {
  slug: "my-madhhab",
  icon: "madhhab",
  navLabel: "My madhhab",
  navHint: "Your school in every guide and calculator",
  group: "everyday",
  title: "Choose your madhhab once, and every guide follows it",
  seoTitle: "Madhhab Setting — Hanafi, Shafi'i, Maliki & Hanbali Views in One App",
  seoDescription:
    "Choose Hanafi, Shafi'i, Maliki or Hanbali, or show all views. Witr, zakat, fidyah, travel and hayd guides follow your school, with every difference labelled.",
  description:
    "One setting for Hanafi, Shafi'i, Maliki, Hanbali or all views, followed by the guides and calculators, plus Hijri date adjustment and searchable settings.",
  keywords: [
    "madhhab app",
    "hanafi shafi maliki hanbali differences",
    "hijri date adjustment",
    "islamic app settings",
  ],
  cluster: "salah",
  published: "2026-11-24",
  updated: "2026-11-24",
  eyebrow: "My madhhab",
  intro:
    "The four schools agree on far more than they differ, but where they do differ, a guide that picks one view for you can leave you confused. Munib Tracker lets you choose your school once. Guides and calculators then show its view, and label the difference instead of hiding it.",
  hero: null,
  whatItDoes: {
    title: "What the madhhab setting does",
    groups: [
      {
        title: "One setting, followed across the app",
        items: [
          "Choose Hanafi, Shafi'i, Maliki or Hanbali, or show all views side by side",
          "Not sure? The app suggests following your family, your local masjid or your teacher",
          "Where the schools differ, the difference is labelled, and the other views are one tap away",
          "Separate from the Asr calculation setting, which it can offer to match",
        ],
      },
      {
        title: "Guides and calculators that follow it",
        items: [
          "Witr: its status, how it is prayed, and whether it is counted in Qaza",
          "The Rawatib tracker: 12 confirmed Sunnah rakahs for Hanafis, 10 for the other schools, and editable",
          "Zakat: the nisab basis, and whether everyday jewellery is zakatable",
          "Fidyah measures",
          "A qasr calculator for travel: whether your trip counts as travel in your school, and whether you are resident on arrival",
          "A hayd and nifas day counter with gentle prompts, using your school's minimum and maximum days",
          "Takbir al-Tashriq, udhiyah and other seasonal rulings in [Dhul-Hijjah mode](/features/fasting-tracker)",
          "Optional preferred-time reminders where your school prefers a later time (for example Isha towards a third of the night for Hanafis and Hanbalis), always noting that the whole time stays valid",
        ],
      },
      {
        title: "Hijri date adjustment",
        items: [
          "Shift the whole Hijri calendar by up to two days either way",
          'Correct a single month with "this month started on…" when your community\'s announcement differs',
          "Months always stay 29 or 30 days long",
          "Every screen agrees: the calendar, fasting, White Days, Dhul-Hijjah mode and reminders",
        ],
      },
      {
        title: "Redesigned settings",
        items: [
          "Settings grouped by topic, with a dedicated Fiqh & madhhab section",
          "Search finds any setting by name",
        ],
      },
    ],
  },
  why: {
    title: "Why a madhhab setting?",
    paragraphs: [
      "Most Muslims follow a school, often the one their family or local masjid follows. A worship app that quietly applies a different school's rulings can make you doubt practices that are perfectly sound.",
      "Showing every view all the time isn't always the answer either. So the choice is yours: your school's view, clearly labelled, or all four views side by side.",
      "The rulings themselves come from the classical works of each school, recorded with their sources in the project's public review logs. They are a study aid; for your own situation, ask a qualified scholar.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Pick your school",
        text: 'Choose a school when you set up the app or later in Settings, or choose "Show all views".',
      },
      {
        title: "Open a guide or calculator",
        text: "Witr, zakat, fidyah, travel and hayd show your school's view, with a label where the schools differ.",
      },
      {
        title: "Compare when you want",
        text: "Tap the label to see every school's position side by side.",
      },
      {
        title: "Match your local moon sighting",
        text: "If the Hijri date is a day out, adjust it once and every screen follows.",
      },
    ],
  },
  benefits: [
    {
      title: "Madhhab-aware, not madhhab-imposing",
      text: "You choose the school; the app never decides for you, and other views are always visible.",
    },
    {
      title: "Differences labelled",
      text: "Where scholars differ, the app says so instead of presenting one view as the only one.",
    },
    {
      title: "Calendar you can trust",
      text: "One Hijri adjustment keeps fasting, events and reminders on the same day as your community.",
    },
    {
      title: "Easy to change",
      text: "Switch schools or turn on all views at any time in Settings.",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "Travelling for work",
        text: "Enter the trip distance and the days you'll stay, and the qasr calculator shows whether your school counts you as a traveller.",
      },
      {
        title: "Zakat on jewellery",
        text: "The zakat calculator follows your school on everyday jewellery, and shows the other views if you want to compare.",
      },
      {
        title: "Ramadan starts a day later",
        text: "Your community sighted the moon a day after the calculation. Correct the month once and the fasting tracker follows.",
      },
    ],
  },
  notes: [
    {
      tone: "scholar",
      title: "A study aid, not a fatwa",
      text: "The app shows what each school's classical works say on these points. It does not issue rulings. For your own situation, consult a qualified scholar.",
    },
  ],
  faqs: [
    {
      question: "Which schools can I choose?",
      answer:
        "Hanafi, Shafi'i, Maliki or Hanbali. You can also choose to show all views instead of one school.",
    },
    {
      question: "Does the madhhab setting change my Salah times?",
      answer:
        "Not by itself. The Asr calculation (Hanafi or Shafi'i) is a separate setting under Salah times; picking a school offers to match the two.",
    },
    {
      question: "Why is my Hijri date different from my masjid's?",
      answer:
        "Months begin with the sighting of the new moon, and communities announce them on different days. Adjust the date by up to two days, or correct a single month, and the whole app follows.",
    },
    {
      question: "Who decided the rulings shown for each school?",
      answer:
        "They come from the classical works of each school and are recorded, with their sources, in the project's public review logs. Where we couldn't confirm a view, the app says scholars differ rather than asserting one.",
    },
  ],
  related: ["salah-tracker", "qaza-salah-tracker", "fasting-tracker", "prayer-times-qibla"],
  cta: {
    title: "Worship by your school, with every view in reach",
    text: "Download Munib Tracker and choose your madhhab in Settings.",
  },
};
