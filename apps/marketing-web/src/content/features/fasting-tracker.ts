import type { FeaturePage } from "@/content/types";

export const fastingTracker: FeaturePage = {
  slug: "fasting-tracker",
  icon: "fasting",
  navLabel: "Fasting & Dhul-Hijjah",
  navHint: "Voluntary fasts, Ramadan and the ten days",
  group: "track",
  title: "Plan voluntary fasts, keep Ramadan, and make the most of Dhul-Hijjah",
  seoTitle: "Islamic Fasting Tracker — Sunnah Fasts, Ramadan & Dhul-Hijjah",
  seoDescription:
    "Plan Monday and Thursday, White Days, Shawwal and Arafah fasts, see the days not to fast, log Ramadan and missed fasts, and follow Dhul-Hijjah day by day.",
  description:
    "A voluntary fasting planner that knows the days not to fast, Ramadan and missed-fast tracking, and a Dhul-Hijjah mode for the best ten days.",
  keywords: [
    "islamic fasting tracker",
    "sunnah fasting app",
    "voluntary fasting tracker",
    "dhul hijjah app",
  ],
  cluster: "habits",
  published: "2026-11-24",
  updated: "2026-11-24",
  eyebrow: "Fasting & Dhul-Hijjah",
  intro:
    "The recommended fasts are easy to miss: a Monday slips by, Arafah arrives before you've planned for it. Munib Tracker shows the fasts coming up, reminds you the night before, marks the days not to fast, and turns the first ten days of Dhul-Hijjah into a simple daily plan.",
  hero: null,
  whatItDoes: {
    title: "What the fasting tools do",
    groups: [
      {
        title: "Voluntary fasting planner",
        items: [
          "Mondays and Thursdays, the White Days, six of Shawwal, the Day of Arafah, Tasu'a and Ashura, Muharram, Sha'ban, the first nine days of Dhul-Hijjah and the fast of Dawud",
          "The next 30 days coloured by ruling, with a star on the fasts you follow",
          "Disliked days labelled, such as Friday on its own or the day of doubt, and prohibited days such as Eid blocked",
          "Optional reminders: the night before, suhoor time, and two days before Arafah and Ashura",
          "Mark a fast as a Qaza fast, and it comes off your missed Ramadan days",
          "A short note on the evidence for each day, with the source one tap away",
        ],
      },
      {
        title: "Ramadan and missed fasts",
        items: [
          "A Ramadan tracker with suhoor and iftar times and a fasting log",
          "A missed-fasts tracker to record and make up Ramadan days",
          "Fidyah and kaffarah helpers that follow your [madhhab](/features/my-madhhab)",
          "A White Days hub and checklist for the 13th to 15th of each Hijri month",
        ],
      },
      {
        title: "Dhul-Hijjah mode",
        items: [
          "A daily deeds checklist for the first ten days: fasting, takbir and tahlil, Qur'an, sadaqah and qiyam",
          "A Day of Arafah view: fasting if you are not on Hajj, and dua from Asr to Maghrib",
          "A Takbir al-Tashriq counter and optional reminders after each fard, in your school's window",
          "An udhiyah planner: whether it is due on you, the animal, the time and the distribution",
          "A gentle hair-and-nails reminder if you intend udhiyah, following your school",
        ],
      },
    ],
  },
  why: {
    title: "Why plan your fasts?",
    paragraphs: [
      "Voluntary fasts are tied to the Hijri calendar and the days of the week, so they're easy to forget until the day has passed. A reminder the night before gives you time to set your intention and wake for suhoor.",
      "Knowing which days not to fast matters just as much. The planner labels disliked days and blocks the prohibited ones, so a good intention never lands on the wrong day.",
      "The first ten days of Dhul-Hijjah are among the best days of the year. A short daily plan makes it easier to fill them with good deeds.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Choose the fasts you follow",
        text: "Pick Mondays and Thursdays, the White Days, or any of the others.",
      },
      {
        title: "Get a reminder the night before",
        text: "Turn on the reminders you want. They pause during excused days.",
      },
      {
        title: "Log the fast",
        text: "Mark the fast kept, and count it as Qaza if you are making up a Ramadan day.",
      },
      {
        title: "Follow the seasons",
        text: "When Dhul-Hijjah begins, open Dhul-Hijjah mode for the day's deeds and the takbir.",
      },
    ],
  },
  benefits: [
    {
      title: "On the right days",
      text: "Dates follow the Hijri calendar, including your own [Hijri adjustment](/features/my-madhhab).",
    },
    {
      title: "Honest about differences",
      text: "Where scholars differ, such as fasting Friday alone or the second half of Sha'ban, the app labels it.",
    },
    {
      title: "Connected to Qaza",
      text: "A fast you keep can count towards your missed Ramadan days.",
    },
    {
      title: "Gentle",
      text: "Reminders pause during excused days, and nothing is lost when you skip a fast.",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "Mondays and Thursdays",
        text: "Follow both and get a reminder on Sunday and Wednesday nights.",
      },
      {
        title: "Six of Shawwal",
        text: "Track your six days after Eid, with a note if you still have Ramadan days to make up.",
      },
      {
        title: "The ten days",
        text: "Tick off the day's deeds each morning, then use the takbir counter from the Day of Arafah.",
      },
    ],
  },
  notes: [
    {
      tone: "scholar",
      text: "The planner shows the recommended days and their evidence, and labels where scholars differ. It does not issue rulings; for your own situation, consult a qualified scholar.",
    },
  ],
  faqs: [
    {
      question: "Which voluntary fasts does it include?",
      answer:
        "Mondays and Thursdays, the White Days (13th to 15th), six of Shawwal, the Day of Arafah, Tasu'a and Ashura, Muharram, Sha'ban, the first nine days of Dhul-Hijjah and the fast of Dawud. You choose which ones to follow.",
    },
    {
      question: "Will it stop me fasting on Eid?",
      answer:
        "Prohibited days, such as the two Eids, can't be marked as fasted. Disliked days, such as Friday on its own, are labelled so you can decide.",
    },
    {
      question: "Can a voluntary fast make up a missed Ramadan day?",
      answer:
        'If the fast you kept was a make-up of a missed Ramadan day, mark it "Count as a Qaza fast" and one day comes off your missed-fasts count. Undoing it puts the day back.',
    },
    {
      question: "Does Dhul-Hijjah mode follow my madhhab?",
      answer:
        "Yes. The Takbir al-Tashriq window, the status of udhiyah and the hair-and-nails rule follow your school, or show every view.",
    },
  ],
  related: ["qaza-salah-tracker", "my-madhhab", "daily-islamic-habits", "umrah-mode"],
  cta: {
    title: "Never miss a Sunnah fast",
    text: "Download Munib Tracker and choose the fasts you want to keep.",
  },
};
