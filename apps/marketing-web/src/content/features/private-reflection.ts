import type { FeaturePage } from "@/content/types";

export const privateReflection: FeaturePage = {
  slug: "private-reflection",
  icon: "reflection",
  navLabel: "Private reflection",
  navHint: "Muhasabah, weekly coach and family ties",
  group: "life",
  title: "Private reflection: muhasabah, a gentle weekly coach and family ties",
  seoTitle: "Muhasabah App — Nightly Self-Review, Weekly Coach & Family Ties",
  seoDescription:
    "A one-minute nightly muhasabah, a weekly coach that runs on your device with no AI, and family-ties reminders, all kept in an encrypted vault only you can open.",
  description:
    "A one-minute nightly muhasabah, a weekly on-device coach, and gentle family-ties reminders, kept in an encrypted vault.",
  keywords: [
    "muhasabah app",
    "islamic self reflection app",
    "silat al rahim reminder",
    "islamic journal app",
  ],
  cluster: "progress",
  published: "2026-11-24",
  updated: "2026-11-24",
  eyebrow: "Private reflection",
  intro:
    "Tracking tells you what you did. Reflection asks how it went, what you're grateful for, and who you haven't called in a while. These tools are small, kind, and private: what you write is encrypted on your device and is visible only to you.",
  hero: null,
  whatItDoes: {
    title: "What's included",
    groups: [
      {
        title: "Nightly muhasabah",
        items: [
          "About a minute before sleep: a look back at today's Salah",
          "Three to six honest questions, answered Yes, Partly or No, with no score",
          "Optional: one thing you're grateful for, and something to repent from, followed by Sayyid al-Istighfar",
          "One small intention for tomorrow",
          'An optional nightly reminder that only says "A minute with yourself before sleep"',
        ],
      },
      {
        title: "Weekly gentle coach",
        items: [
          "Once a week, one to three kind, practical suggestions from your own week",
          "One small goal you can accept for the week ahead",
          "Counts the days you actually read the Qur'an, from a daily reading log kept by the reader",
          "Built from simple, fixed rules that run on your device: no AI, nothing uploaded",
          "Counts, never percentages or comparisons with other people",
          "In an excused week, only a message to rest, with no suggestions",
        ],
      },
      {
        title: "Family ties (silat al-rahim)",
        items: [
          "A private list of the relatives you want to stay close to, parents first",
          "Choose how often to keep in touch with each, and see who would love to hear from you",
          "Call, message or WhatsApp from the app, and the contact is logged",
          "Log visits, gifts and duas too, and remember relatives who have passed away in your dua",
          "A gentle weekly reminder that shows only a count, never names",
        ],
      },
      {
        title: "Kept in your encrypted vault",
        items: [
          "Your muhasabah, family list, debts record and will are encrypted on your device",
          "Not synced unless you choose to: sync is end-to-end encrypted, with a passphrase and a 24-word recovery code",
          "Our server stores only encrypted data it can't read",
          "Available on your own devices, not on a shared screen such as a TV",
        ],
      },
    ],
  },
  why: {
    title: "Why reflect, and why keep it private?",
    paragraphs: [
      "Taking yourself to account before the day ends is an old practice of the believers. A minute each night, looking back honestly and turning to Allah, keeps small slips from becoming habits.",
      "Reflection only works when it is honest, and honesty needs privacy. That's why these records are encrypted on your device, never shown in notifications, and never shared with anyone, including us.",
      "Keeping family ties is part of worship too, yet a busy week is all it takes to lose touch. A quiet reminder to call a parent or an aunt can mean a great deal to them.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Reflect at night",
        text: "Open the nightly muhasabah before sleep and answer a few questions in about a minute.",
      },
      {
        title: "Add your family",
        text: "Start with your parents, then the relatives you want to stay close to, and how often.",
      },
      {
        title: "Read your week",
        text: "Once a week, the coach shows what went well and one small step to try.",
      },
      {
        title: "Choose about sync",
        text: "Keep everything on this device, or turn on end-to-end encrypted sync with a passphrase.",
      },
    ],
  },
  benefits: [
    {
      title: "Private by design",
      text: "Encrypted on your device; notifications never show what you wrote, names or amounts.",
    },
    {
      title: "No AI, no judgement",
      text: "The coach is simple rules on your device. It never scores you or compares you with anyone.",
    },
    {
      title: "Gentle",
      text: "Excused days pause the nudges, and nothing is lost when you skip a night.",
    },
    {
      title: "Sourced",
      text: "Each feature links the Qur'an and hadith behind it, opened in the app's own readers.",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "Before sleep",
        text: "Pair the muhasabah with the before-sleep adhkar for a calm end to the day.",
      },
      {
        title: "Sunday call",
        text: "Set your grandparents to every week, and the reminder brings them to the top of your list.",
      },
      {
        title: "A small goal",
        text: "Accept the coach's suggestion to pray one Salah a week with the congregation, and see how it went next week.",
      },
    ],
  },
  notes: [
    {
      tone: "info",
      title: "If you lose your passphrase",
      text: "Encrypted sync has no back door. If you lose both your passphrase and your recovery code, the synced copy can't be opened by anyone, including us. The records on your device keep working.",
    },
  ],
  faqs: [
    {
      question: "Does the weekly coach use AI?",
      answer:
        "No. It uses simple, fixed rules that run on your device to turn your week into a few kind suggestions. Nothing is sent to a server or an AI service.",
    },
    {
      question: "Who can read my muhasabah?",
      answer:
        "Only you. It is encrypted on your device. If you turn on sync, it is encrypted with your passphrase before it leaves the device, so our server can't read it.",
    },
    {
      question: "Are my relatives' names and numbers uploaded?",
      answer:
        "Not unless you turn on encrypted sync, and even then only as encrypted data we can't read. Reminders never show their names.",
    },
    {
      question: "What happens on a shared device like a TV?",
      answer:
        "These private records aren't shown on TV. They stay on your own phone, tablet or browser.",
    },
  ],
  related: [
    "daily-islamic-habits",
    "worship-progress",
    "islamic-will-and-inheritance",
    "family-and-friends",
  ],
  cta: {
    title: "Take a minute for yourself tonight",
    text: "Download Munib Tracker and try your first nightly muhasabah.",
  },
};
