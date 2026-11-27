import type { FeaturePage } from "@/content/types";

export const islamicWillAndInheritance: FeaturePage = {
  slug: "islamic-will-and-inheritance",
  icon: "will",
  navLabel: "Will & inheritance",
  navHint: "Mirath, wasiyyah and debts",
  group: "life",
  title: "Islamic inheritance calculator, will builder and debts record",
  seoTitle: "Islamic Inheritance Calculator (Mirath) & Will Builder App",
  seoDescription:
    "Learn how Islamic inheritance shares work in all four schools, build a wasiyyah within the one-third limit as a PDF, and keep a private record of debts and trusts.",
  description:
    "Mirath shares for all four schools, a guided wasiyyah within the one-third limit, and a private record of debts and trusts.",
  keywords: [
    "islamic inheritance calculator",
    "mirath calculator",
    "islamic will builder",
    "wasiyyah template",
    "debt record islam",
  ],
  cluster: "habits",
  published: "2026-11-23",
  updated: "2026-11-24",
  eyebrow: "Will & inheritance",
  intro:
    "Writing down debts, leaving a will, and knowing how an estate is divided are duties many Muslims put off. Munib Tracker makes them practical: a debts and trusts record, a guided Islamic will, and an inheritance calculator that explains every share.",
  hero: null,
  whatItDoes: {
    title: "What's included",
    groups: [
      {
        title: "Inheritance (mirath) calculator",
        items: [
          "Shares for the Hanafi, Shafi'i, Maliki and Hanbali schools",
          "Where the schools differ, the difference is shown, not hidden",
          "Deducts funeral costs, debts and bequests before dividing",
          'Every share is an exact fraction, with a "Why?" explanation of the rule behind it',
          "Rare cases it doesn't cover, such as an unborn or missing heir, are flagged for a scholar instead of guessed",
        ],
      },
      {
        title: "Islamic will (wasiyyah) builder",
        items: [
          "A step-by-step wizard you can save, then export as a PDF to print or share",
          "Debts and trusts are pulled in from your record for you to confirm",
          "Bequests are checked against the one-third limit",
          "A bequest to an heir is flagged, with an explanation, until you acknowledge it",
          "Funeral wishes, guardianship of minors and an executor",
        ],
      },
      {
        title: "Debts and trusts record",
        items: [
          "What you owe, what you're owed, and trusts you hold",
          "Record payments; balances update and settled debts close",
          "Attach an optional photo of a document, encrypted on your device and never synced",
          "Forgive a debt, with a note on the reward of doing so",
          "A reminder that an increase on a loan is riba, with a link to learn more",
        ],
      },
      {
        title: "Kept private",
        items: [
          "Your will and debts are kept in an encrypted vault on your device",
          "Syncing them is optional and end-to-end encrypted: our server stores only data it can't read",
          "Reminders use generic text; lock-screen notifications never show names or amounts",
          "The inheritance calculator stores nothing: your inputs stay on the screen",
        ],
      },
    ],
  },
  why: {
    title: "Why these tools belong in a worship app",
    paragraphs: [
      "The Qur'an tells believers to write their debts down (2:282), and it sets out the shares of inheritance in detail (4:11–12, 4:176). The Prophet ﷺ encouraged Muslims not to let time pass without a written will.",
      "Yet these are the tasks people leave until it's too late, often because they seem complicated. Breaking them into small, guided steps makes them something you can do this week.",
      "Keeping debts, trusts and your will together also means nothing gets forgotten: what you owe flows into your will, and your will respects the shares of your heirs.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Record debts and trusts",
        text: "Add what you owe and are owed as they happen, and log payments.",
      },
      {
        title: "Build your will",
        text: "Follow the wizard; your debts and trusts are already there to confirm.",
      },
      {
        title: "Check the shares",
        text: "Enter the heirs and your school, and see each share with its explanation.",
      },
      {
        title: "Print and witness",
        text: "Export the will as a PDF, have it witnessed, and let the app remind you to review it.",
      },
    ],
  },
  benefits: [
    {
      title: "All four schools",
      text: "Choose your madhhab, or show every view side by side.",
    },
    {
      title: "Explainable",
      text: "Each result shows the rule behind it, so you can check it with a scholar.",
    },
    {
      title: "Connected",
      text: "Debts flow into the will, and the will respects the inheritance rules.",
    },
    {
      title: "Private",
      text: "Sensitive records stay on your device unless you choose encrypted sync.",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "Lending to a friend",
        text: "Record the loan, the date and a witness, and log each repayment.",
      },
      {
        title: "Writing a first will",
        text: "Spend twenty minutes with the wizard, print the result, and sign it with two witnesses.",
      },
      {
        title: "Understanding a family estate",
        text: "Enter the surviving relatives to see how the shares work before speaking to a scholar.",
      },
    ],
  },
  notes: [
    {
      tone: "scholar",
      title: "Not a legal or religious ruling",
      text: "The inheritance calculator is an educational tool, not a fatwa or a legal decision. Inheritance and wills involve both Islamic rules and the law of your country: use these tools to prepare, then confirm your will and any estate division with a qualified scholar or a Shariah court and, where needed, a lawyer. The will builder records your wishes; in many countries it is not legally binding until it is executed and registered under local law.",
    },
  ],
  faqs: [
    {
      question: "Which schools does the inheritance calculator follow?",
      answer:
        "Hanafi, Shafi'i, Maliki and Hanbali. Where they differ, you can pick your school or see every view.",
    },
    {
      question: "Is the will legally binding?",
      answer:
        "That depends on the law where you live. The will builder helps you write an Islamic will; check local requirements, such as witnesses, with a lawyer.",
    },
    {
      question: "Who can see my debts and will?",
      answer:
        "Only you. They're kept in an encrypted vault on your device. Syncing them is optional and end-to-end encrypted, with a passphrase and a recovery code only you hold.",
    },
  ],
  related: ["qaza-salah-tracker", "daily-islamic-habits", "worship-progress", "hadith"],
  cta: {
    title: "Put your affairs in order, calmly",
    text: "Download Munib Tracker and start with one step: record a debt or begin your will.",
  },
};
