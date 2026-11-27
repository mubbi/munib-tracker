import type { FeaturePage } from "@/content/types";

export const hijriCalendar: FeaturePage = {
  slug: "hijri-calendar",
  icon: "calendar",
  navLabel: "Hijri calendar",
  navHint: "Islamic dates, events, converter",
  group: "everyday",
  title: "A Hijri calendar you can match to your local moon sighting",
  seoTitle: "Hijri Calendar App — Islamic Date Today, Converter & Events",
  seoDescription:
    "See today's Hijri date, browse the Islamic calendar, convert Hijri and Gregorian dates and follow upcoming events. Adjust it to your local moon sighting.",
  description:
    "Today's Hijri date, a month calendar, a Hijri and Gregorian date converter, upcoming Islamic events and an adjustment for your community's moon sighting.",
  keywords: [
    "hijri calendar",
    "islamic calendar",
    "islamic date today",
    "hijri to gregorian converter",
    "islamic events calendar",
  ],
  cluster: "prayer-times",
  published: "2026-11-27",
  updated: "2026-11-27",
  eyebrow: "Hijri calendar",
  intro:
    "See the Islamic date every time you open the app, look ahead to Ramadan and the two Eids, and convert any date between the two calendars. When your community's announcement differs from the prediction, you correct it once and every screen follows.",
  hero: null,
  whatItDoes: {
    title: "What it includes",
    groups: [
      {
        title: "Today's Hijri date",
        items: [
          "The Hijri and Gregorian dates together on the home screen",
          "The moon's current phase beside the date, with a detail sheet: how much is lit, the day of the month and when the next Islamic month is expected",
          "A default calendar setting, Hijri or Gregorian, for date labels across the app",
          "Dates calculated on your device, with no connection needed",
        ],
      },
      {
        title: "Month calendar and converter",
        items: [
          "A month view you can switch between Hijri and Gregorian",
          "Your logged Salah marked on each day, so the calendar doubles as your [worship history](/features/worship-progress)",
          "A converter from Hijri to Gregorian and from Gregorian to Hijri",
          "A Use today shortcut and quick links between the calendar, the converter and the events list",
        ],
      },
      {
        title: "Islamic events",
        items: [
          "Upcoming dates with a countdown in days: Islamic New Year, Ashura, Mawlid an-Nabi, Isra and Mi'raj, the first of Ramadan, Eid al-Fitr, the Day of Arafah and Eid al-Adha",
          "Laylat al-Qadr shown on the 27th of Ramadan and labelled as an estimate",
          "A short, referenced background note for each event",
        ],
      },
      {
        title: "Hijri date adjustment",
        items: [
          "Shift the whole calendar by up to 2 days either way",
          "Or correct a single month by choosing the day your community announced as the 1st",
          "Months always stay 29 or 30 days long",
          "The prediction source is shown: crescent visibility at your location, or the Umm al-Qura calendar in regions that follow it",
          "If you move, the app asks whether to keep or clear your corrections",
        ],
      },
      {
        title: "Through the seasons",
        items: [
          "Home banners for the Islamic seasons, such as Ramadan, the last ten nights, the two Eids, the first days of Dhul-Hijjah and Ashura, each with a hide option",
          "Seasonal app icons on iPhone and Android phones, with a Classic option if you prefer one icon all year",
          "A White Days reminder on the 13th, 14th and 15th of each Hijri month, with an optional notification",
          "[Fasting and Ramadan screens](/features/fasting-tracker) that follow the same Hijri dates",
        ],
      },
    ],
  },
  why: {
    title: "Why a Hijri calendar inside your worship app?",
    paragraphs: [
      "The Islamic year sets when you fast, when Eid falls and when the White Days come round, yet most phones show only the Gregorian date. A converter website answers one question at a time; it doesn't keep the date in front of you.",
      "A Hijri month begins with the sighting of the new crescent, so a calculated calendar can be a day away from what your Masjid announces. Many apps leave you with that mismatch. Here you record the announcement your community follows, and the calendar, fasting screens, events and reminders all move together.",
      "The date is worked out on your device from your location, so it is there offline.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Set your location",
        text: "The app predicts each Hijri month from crescent visibility where you are, or from the Umm al-Qura calendar in regions that use it.",
      },
      {
        title: "Check today's date",
        text: "The Hijri date and the moon phase sit at the top of the home screen. Tap the moon for the details of the month.",
      },
      {
        title: "Browse or convert",
        text: "Open the calendar and switch to Hijri to see the whole month, or use the converter for any single date.",
      },
      {
        title: "Match your community",
        text: "If your Masjid announced a different start to the month, choose that day under Hijri date adjustment. Every Hijri date in the app follows.",
      },
    ],
  },
  benefits: [
    {
      title: "One date everywhere",
      text: "The home screen, calendar, converter, events, fasting screens and reminders all read from the same Hijri calendar.",
    },
    {
      title: "Yours to correct",
      text: "A whole-calendar shift and month-by-month corrections let you follow the announcement you trust.",
    },
    {
      title: "Works offline",
      text: "Dates, conversions and the moon phase are calculated on the device.",
    },
    {
      title: "No surprises",
      text: "A countdown to each event gives you time to prepare for Ramadan, Arafah or Ashura.",
    },
  ],
  gallery: [
    {
      key: "home",
      caption: "The home screen, with the Hijri date and the moon phase above today's Salah times.",
    },
    {
      key: "home-light",
      caption: "The same screen in the light theme.",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "When is Ramadan?",
        text: "Open Islamic events to see the predicted first day and how many days are left, then plan around it.",
      },
      {
        title: "Your Masjid announced a different day",
        text: "Open the adjustment for that month and pick the announced day. Your fasting screens and reminders move with it.",
      },
      {
        title: "A date on a document",
        text: "Type a Gregorian date into the converter to get the Hijri date, or the other way round, for a birthday, a contract or a nikah certificate.",
      },
      {
        title: "Your zakat anniversary",
        text: "Convert the Hijri date your zakat falls due into this year's Gregorian date, then open the [Zakat calculator](/features/zakat-calculator).",
      },
    ],
  },
  notes: [
    {
      tone: "scholar",
      title: "Dates depend on moon sighting",
      text: "Every date the app shows is a calculated prediction and can differ by a day from an official announcement. The app does not present any one method as the correct one. For Ramadan, Eid and other religious dates, follow your local Masjid or authority.",
    },
    {
      tone: "info",
      title: "What an adjustment changes",
      text: "An adjustment moves Hijri labels and everything scheduled from them, such as events, the White Days and seasonal banners. It does not move what you have already logged, because Salah and fasting logs are stored by Gregorian date.",
    },
    {
      tone: "info",
      title: "Platform notes",
      text: "Seasonal app icons are available on iPhone and Android phones, not on the web app or TV; they are on by default on iPhone and opt-in on Android. The moon on the home screen is a calculated phase for illustration, not a sighting report.",
    },
  ],
  faqs: [
    {
      question: "What is the Islamic date today?",
      answer:
        "Munib Tracker shows today's Hijri date on its home screen, next to the Gregorian date and the moon phase. It is calculated on your device for your location, so it can differ by a day from a calendar made for another country.",
    },
    {
      question: "Why is my Hijri date one day different from my Masjid's?",
      answer:
        "Because a Hijri month starts with the sighting of the new crescent, and communities follow different sightings or calculations. In the app, open Hijri date adjustment and pick the day your community announced; the setting is described on the [My madhhab and settings](/features/my-madhhab) page.",
    },
    {
      question: "How do I convert a Hijri date to Gregorian?",
      answer:
        "Open the date converter from the calendar, choose Hijri to Gregorian and enter the day, month and year. The result appears straight away, and the same screen converts Gregorian dates to Hijri.",
    },
    {
      question: "How does the app calculate Hijri dates?",
      answer:
        "It predicts each month from crescent visibility at your location, or uses the official Umm al-Qura calendar in regions that follow it. The source in use is shown on the adjustment screen, and both are predictions, not announcements.",
    },
    {
      question: "Which Islamic events does the calendar show?",
      answer:
        "It lists Islamic New Year, Ashura, Mawlid an-Nabi, Isra and Mi'raj, the first of Ramadan, Laylat al-Qadr as an estimate, Eid al-Fitr, the Day of Arafah and Eid al-Adha, each with a countdown and a short background note.",
    },
    {
      question: "Does the Hijri calendar work offline?",
      answer:
        "Yes. Hijri dates, the converter, the events list and the moon phase are all calculated on your device, so they work without a connection.",
    },
  ],
  related: [
    "prayer-times-qibla",
    "fasting-tracker",
    "my-madhhab",
    "zakat-calculator",
    "widgets-and-devices",
  ],
  guides: ["/resources/islamic-habits/how-to-stay-consistent-with-daily-worship"],
  cta: {
    title: "Keep the Islamic date in view",
    text: "Download Munib Tracker to see today's Hijri date, what is coming up, and a calendar you can match to your community.",
  },
};
