import type { FeaturePage } from "@/content/types";

export const familyAndFriends: FeaturePage = {
  slug: "family-and-friends",
  icon: "family",
  navLabel: "Family & friends",
  navHint: "Kids mode, partners and group khatm",
  group: "life",
  title: "Worship together: kids mode, partners and group khatm",
  seoTitle: "Family Salah Tracker, Kids Mode & Group Khatm App",
  seoDescription:
    "Parent-managed kids mode for learning Salah, a private accountability partner, and group khatm with family or friends. No leaderboards, no ads. Free.",
  description:
    "A parent-managed kids mode, a private accountability partner, and group khatm you can share with family or friends.",
  keywords: [
    "family salah tracker",
    "kids prayer tracker app",
    "group khatm app",
    "accountability partner muslim",
  ],
  cluster: "audience",
  published: "2026-11-23",
  updated: "2026-11-27",
  eyebrow: "Family & friends",
  intro:
    "Some habits are easier together. Help your children learn to pray with a simple kids mode, encourage a friend without either of you sharing details, and finish the Qur'an as a family or a Masjid circle.",
  hero: null,
  whatItDoes: {
    title: "What you can do together",
    groups: [
      {
        title: "Family and kids mode",
        items: [
          "A parent creates a child profile with just a nickname and birth year; no email for the child",
          "Link the child's device with a one-time QR code or, when the phones are side by side, over Bluetooth with a 4-digit code you approve; or log their Salah for them on your phone",
          "A simple kids view: five big Salah buttons, a kids Salah path (wudu, the five prayers and how to pray), stories of the prophets, and a short, curated set of daily duas, adhkar and short surahs with audio",
          "Kids content is chosen from the app's own sourced guides and duas, and a linked child's device can't open the adult guides",
          "Stickers, stars and a real reward you set, like a park trip for a week of Salah",
          "Under 7, Salah can be logged just for practice; tracking stays gentle from 7 to 12",
          "Parents see only the five fard Salah statuses and the stickers earned from them, never anything else",
          "Co-parents can join the family; children never see their siblings",
        ],
      },
      {
        title: "Accountability partner",
        items: [
          "A small private circle of two to five people, by invite",
          "Each person sets their own daily goal, which is never shared",
          "The only thing shared is whether your goal was done that day",
          'Make dua for a partner (they see "Someone made dua for you"), or send one gentle reminder a day, which they see after their own Isha',
          "Pause sharing or leave at any time, quietly",
        ],
      },
      {
        title: "Group khatm",
        items: [
          "Create a khatm with a title, an intention and a deadline",
          "Split it by juz (default), hizb or surah",
          "Members pick their part, the creator assigns parts, or parts are dealt out in turn",
          "Read your part in the app and mark it done; everyone sees the progress",
          "Invite by link or QR code, or add someone next to you over Bluetooth; people without the app can join on the web as a guest",
          "Start another round when the khatm is complete",
        ],
      },
    ],
  },
  why: {
    title: "Why worship together, privately?",
    paragraphs: [
      "The Qur'an asks believers to guard their families and to enjoin prayer on them. Children learn Salah best when it is part of family life, with patience and encouragement, never pressure.",
      'Friends help too. But comparing worship can turn into showing off or shame. So a partner sees only a simple "done" signal, never numbers, and there are no leaderboards anywhere.',
      "A shared khatm turns a big goal into a small part for each person, which is why families and Masjid circles have done it for generations.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Sign in",
        text: "Family circles and partners use a free account so members can see shared progress. A group khatm can also be joined as a guest on the web.",
      },
      {
        title: "Create or join a circle",
        text: "Add a child profile, invite a partner, or start a group khatm and share the link.",
      },
      {
        title: "Share only what's needed",
        text: "Children's fard status, a partner's \"done\", or a khatm part. Nothing else leaves your account.",
      },
      {
        title: "Encourage each other",
        text: "Stickers for children, a dua for a partner, a reminder for an open khatm part.",
      },
    ],
  },
  benefits: [
    {
      title: "Private by design",
      text: "Each circle shares one small signal. Your logs, goals and notes stay yours.",
    },
    {
      title: "Safe for children",
      text: "No email, no ads, no chat and no comparison between siblings.",
    },
    {
      title: "Encouragement, not pressure",
      text: 'No "missed" state for partners, no streak-loss messages, and nothing punitive for children.',
    },
    {
      title: "Built on the Qur'an reader",
      text: "Group khatm parts open straight into the juz in the app's Qur'an reader.",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "A seven-year-old's first Salah",
        text: "Set a reward for a week of Fajr and Maghrib, and let them tap the big buttons themselves.",
      },
      {
        title: "Two friends after Ramadan",
        text: 'Each sets "all five fard" as a private goal and sees the other\'s daily "done".',
      },
      {
        title: "A khatm for a loved one",
        text: "Start a 30-juz group khatm with the family and share the link in your family chat.",
      },
    ],
  },
  notes: [
    {
      tone: "scholar",
      text: "Gifting the reward of recitation to the deceased is a matter scholars discuss differently. Group khatm lets you write an intention but makes no claims about it.",
    },
    {
      tone: "info",
      text: 'Circles store only the shared signals on Munib Tracker\'s server: fard status for children, a daily "done" for partners, and part status for a khatm. Members see the display name you choose for each circle, never your email. When you leave a circle you are hidden at once, and your signals for it are deleted after 30 days. Circle notifications (a khatm part or the whole khatm completed, a dua made for you, and a weekly family digest for parents with counts only) carry no names or individual Salah, and each has its own switch.',
    },
  ],
  faqs: [
    {
      question: "Does my child need an email address?",
      answer:
        "No. A parent creates the profile with a nickname and birth year, and links the child's device with a QR code.",
    },
    {
      question: "What can a parent see?",
      answer:
        "Only the child's five fard Salah statuses and their stickers. From 13, a child can move to their own account; the child profile is then deleted, and they share nothing unless they choose to turn sharing on.",
    },
    {
      question: "Can my partner see what I missed?",
      answer:
        'No. Partners only see "done" or nothing. There is no missed state, and you can skip sharing any day.',
    },
    {
      question: "Can someone join a group khatm without the app?",
      answer: "Yes. The invite link opens on the web, where they can join and read their part.",
    },
  ],
  related: ["quran", "salah-tracker", "learn-quran", "worship-progress"],
  guides: [
    "/resources/quran-learning/how-to-help-children-learn-the-quran",
    "/resources/islamic-habits/how-to-build-better-islamic-habits",
  ],
  cta: {
    title: "Bring your family along",
    text: "Download Munib Tracker, sign in, and create your family circle or first group khatm.",
  },
};
