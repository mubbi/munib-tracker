import type { FeaturePage } from "@/content/types";

export const zakatCalculator: FeaturePage = {
  slug: "zakat-calculator",
  icon: "zakat",
  navLabel: "Zakat calculator",
  navHint: "Estimate zakat against nisab",
  group: "life",
  title: "A zakat calculator that shows its working",
  seoTitle: "Zakat Calculator App — Nisab, Gold & Silver, by Madhhab",
  seoDescription:
    "Estimate zakat on cash, gold, silver, investments, crops and livestock. Nisab from gold and silver prices, your madhhab's view and a checklist before you pay.",
  description:
    "A planning calculator for zakat: your wealth, your deductions, the nisab from gold and silver prices, and the points where the four schools differ.",
  keywords: [
    "zakat calculator",
    "nisab calculator",
    "zakat on gold calculator",
    "how to calculate zakat",
    "zakat calculator app",
  ],
  cluster: "tools",
  published: "2026-11-27",
  updated: "2026-11-27",
  eyebrow: "Zakat calculator",
  intro:
    "Add up what you own, take off what you owe, and see an estimate of your zakat next to the nisab it was measured against. It is a planning tool with short guides beside it, not a fatwa: check the result with a qualified scholar before you pay.",
  hero: null,
  whatItDoes: {
    title: "What it includes",
    groups: [
      {
        title: "Your wealth",
        items: [
          "Cash and savings, stocks and investments, business and trade goods, money owed to you, saved rental or business income, and cryptocurrency",
          "Gold and silver by value, or by weight in grams, tola, troy ounces or kilograms, with gold karat and silver purity",
          "Land, buildings and vehicles held for investment or sale, kept apart from your own home and car",
          "Livestock by head count, shown as the animals due, with an optional cash estimate",
          "Crops by harvest value, with a choice between rain-fed and irrigated land",
        ],
      },
      {
        title: "Nisab and deductions",
        items: [
          "The gold nisab (about 87.48 g) and the silver nisab (about 612.36 g) valued from the price per gram, side by side",
          "Gold and silver prices loaded in your currency when you're online, or typed in by hand",
          "A manual nisab figure if your scholar or Masjid gives you one",
          "Debts due now, plus immediate living expenses if your scholar allows that deduction",
          "A running total that stays on screen: net wealth, the nisab used and the estimated zakat",
        ],
      },
      {
        title: "Your madhhab's view",
        items: [
          "Follows the school you chose in [My madhhab](/features/my-madhhab), or shows all views",
          "The nisab basis (gold, silver, or the lower of the two) starts from your school's default and can be changed",
          "How gold, silver and other wealth are added together to reach nisab follows your school",
          "Jewellery in everyday use is counted or left out according to your school, and the screen says which",
          "In all-views mode, the result for each nisab basis, with and without everyday jewellery",
        ],
      },
      {
        title: "Guides and checklist",
        items: [
          "Ten short zakat topics: what zakat is, the lunar year (hawl), nisab, what is and isn't zakatable, debts, who may receive it, other rates and common mistakes",
          "A six-step Before you pay checklist",
          "A page of the Qur'an and Sunnah texts on zakat, with references",
          "A short explanation behind each section of the form",
        ],
      },
      {
        title: "Related giving tools",
        items: [
          "Sadaqah goals: a daily or weekly intention for voluntary charity and a simple log of what you gave",
          "A fidyah and kaffarah helper that turns missed fast days and a local meal cost into a planning estimate",
          "Your figures are saved as you type, and sync between your devices if you sign in",
        ],
      },
    ],
  },
  why: {
    title: "Why work it out in an app?",
    paragraphs: [
      "Most people can name the rate. The work is everything before it: remembering each account, valuing jewellery by weight and karat, deciding which debts come off, and knowing what the nisab is worth this week. A form that lists each kind of wealth makes it harder to forget one.",
      "Gold and silver give two different thresholds, and the schools do not all handle them, or everyday jewellery, the same way. Munib Tracker shows which basis it used and why, so you can take the figures to a scholar and ask a precise question.",
      "The calculator sits beside the guides and the checklist on purpose. An amount is only useful if you also know when zakat falls due and who may receive it.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Pick your currency",
        text: "Choose a currency and number format. When you're online, gold and silver prices load in that currency; you can replace them with your local market rate.",
      },
      {
        title: "Enter what you own",
        text: "Fill in the groups that apply to you and leave the rest empty. For jewellery, enter the weight and karat and the app values the pure metal.",
      },
      {
        title: "Take off what you owe",
        text: "Add debts that are due now. The app does not decide which long-term debts count; the debts guide explains the common approaches.",
      },
      {
        title: "Read the result",
        text: "See your net wealth, the nisab it was compared with and the estimated zakat, with crops and livestock listed separately.",
      },
      {
        title: "Check before you pay",
        text: "Go through the six-step checklist, including the lunar year, and ask a scholar about anything that is unclear for your case.",
      },
    ],
  },
  benefits: [
    {
      title: "Nothing left out by accident",
      text: "Separate fields for each kind of wealth prompt you to look at accounts and holdings you might otherwise skip.",
    },
    {
      title: "A nisab you can trace",
      text: "You see the weight, the price per gram and the resulting value, for gold and for silver.",
    },
    {
      title: "Honest about differences",
      text: "Where the schools differ, the screen says so and shows the other view instead of quietly choosing one.",
    },
    {
      title: "Ready next year",
      text: "Your last figures are still there when you open the calculator again, so you update them instead of starting over.",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "Savings and a few gold pieces",
        text: "Enter your bank balance, then the jewellery by weight in tola at 22 karat. The app converts it to pure gold, values it and adds it to your total.",
      },
      {
        title: "A small shop",
        text: "Put stock at today's selling value under business and trade goods, add invoices you expect to be paid, and take off supplier bills that are due now.",
      },
      {
        title: "Finding your zakat date",
        text: "Zakat on savings is tied to a lunar year. Use the [Hijri date converter](/features/hijri-calendar) to see when your Hijri anniversary falls in the Gregorian calendar.",
      },
      {
        title: "Giving through the year",
        text: "Set a weekly sadaqah intention and log each gift. The app keeps it separate from zakat, which stays its own obligation.",
      },
    ],
  },
  notes: [
    {
      tone: "scholar",
      title: "An estimate, not a fatwa",
      text: "The result is an educational planning estimate. Nisab weights, the lunar year, jewellery, debts, pensions, crypto, livestock and crops are treated differently between the schools. Consult a qualified scholar about your own situation before you pay.",
    },
    {
      tone: "info",
      title: "What the calculator does not do",
      text: "It does not track whether your wealth stayed above nisab for a full lunar year, decide which of your debts are deductible, or tell you whether a particular person or charity may receive zakat. It does not collect or pay zakat.",
    },
    {
      tone: "info",
      title: "Prices and platforms",
      text: "Gold, silver and exchange rates come from public market feeds and are indicative, so compare them with your local rate; without a connection you enter prices yourself. On Apple TV and Android TV the finance tools are hidden until you turn them on in Settings, so amounts stay private on a shared screen.",
    },
  ],
  faqs: [
    {
      question: "How do I calculate my zakat?",
      answer:
        "Add up your zakatable wealth, subtract the debts that are due now, and compare the result with the nisab. Munib Tracker does this as you type and applies the 2.5% rate on wealth when you are at or above nisab. Our guide on [how to calculate zakat](/resources/zakat-hajj/how-to-calculate-zakat) walks through each step.",
    },
    {
      question: "What is the nisab today?",
      answer:
        "Nisab is the value of about 87.48 g of gold or 612.36 g of silver, so it changes with metal prices. The app multiplies those weights by the current price per gram in your currency and shows both figures. You can also enter prices yourself, or a nisab figure from your scholar.",
    },
    {
      question: "Should I use the gold or the silver nisab?",
      answer:
        "Scholars differ, and the app does not settle it for you. It starts from the default of the school you chose, lets you switch between gold, silver and the lower of the two, and in all-views mode shows the result for each. Follow your own scholar's guidance.",
    },
    {
      question: "Do I pay zakat on gold jewellery I wear?",
      answer:
        "It depends on your school. The app notes that the Hanafi school counts jewellery in personal use and the other three schools do not, and it follows the [madhhab you set](/features/my-madhhab). In all-views mode it shows the amount with and without it.",
    },
    {
      question: "Can I calculate zakat on gold in tola?",
      answer:
        "Yes. Enter gold or silver by weight in tola, grams, troy ounces or kilograms, choose the karat or purity, and the app converts it to pure metal and values it at the price per gram.",
    },
    {
      question: "Is the zakat calculator free, and is my data private?",
      answer:
        "Yes, it is free and has no ads. Your figures are saved on your device so they are there next time, and they sync to your account only if you choose to sign in.",
    },
  ],
  related: [
    "my-madhhab",
    "fasting-tracker",
    "hijri-calendar",
    "islamic-will-and-inheritance",
    "daily-islamic-habits",
  ],
  guides: ["/resources/zakat-hajj/how-to-calculate-zakat"],
  cta: {
    title: "Work out your zakat with the nisab in view",
    text: "Download Munib Tracker, open the Zakat calculator and enter your figures. Then check the result with a scholar you trust.",
  },
};
