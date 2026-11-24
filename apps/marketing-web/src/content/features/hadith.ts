import type { FeaturePage } from "@/content/types";

export const hadith: FeaturePage = {
  slug: "hadith",
  icon: "hadith",
  navLabel: "Hadith library",
  navHint: "Collections, grades and explanation",
  group: "quran",
  title: "A hadith library you can read, study and search",
  seoTitle: "Hadith App — Bukhari, Muslim & More, With Grades and Explanation",
  seoDescription:
    "Read Sahih al-Bukhari, Sahih Muslim and four more collections, with grades, narrators, explanation and full isnad, plus Nawawi's 40 offline and a daily hadith.",
  description:
    "Nawawi's 40 and Riyad as-Salihin offline, six major collections on demand, with grades, explanation and isnad.",
  keywords: ["hadith app", "sahih bukhari app", "hadith with explanation", "daily hadith app"],
  cluster: "quran-reading",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "Hadith library",
  intro:
    "Read the sayings of the Prophet ﷺ from the major collections, see their grading and chains of narration, and understand them with explanation. Start with the Forty Hadith offline, or open Sahih al-Bukhari and the other collections whenever you need them.",
  hero: null,
  whatItDoes: {
    title: "What's in the library",
    groups: [
      {
        title: "Collections",
        items: [
          "Imam al-Nawawi's Forty Hadith and Riyad as-Salihin, bundled for offline reading",
          "Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami' at-Tirmidhi, Sunan an-Nasa'i and Sunan Ibn Majah on demand",
          "Downloaded collections are kept for offline use",
          "Translations in several languages, set separately from the app's language",
        ],
      },
      {
        title: "Study each hadith",
        items: [
          "Grades and narrators shown with each hadith",
          "Explanation (sharh) to understand the meaning",
          "The full chain of narration (isnad)",
          "Search within a collection, and bookmarks",
        ],
      },
      {
        title: "Every day",
        items: [
          "A daily hadith from the Forty, renewed each morning",
          "Source hadith shown alongside every zikr in the adhkar",
          "Universal search across hadith, the Qur'an, duas and adhkar",
        ],
      },
    ],
  },
  why: {
    title: "Why a hadith library inside a worship app?",
    paragraphs: [
      "The Sunnah explains how to pray, what to say in the morning, and why consistency matters. Having the sources one tap away from your tracker and adhkar means you can always check where a practice comes from.",
      "Grades, explanation and the chain of narration help you read carefully rather than share whatever appears in a feed.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Open a collection",
        text: "Start with the bundled collections, or download one of the six major collections.",
      },
      {
        title: "Read and study",
        text: "See the grade, narrator, explanation and isnad for each hadith.",
      },
      {
        title: "Save what matters",
        text: "Bookmark hadith to come back to, and find them from search.",
      },
    ],
  },
  benefits: [
    {
      title: "From established sources",
      text: "Hadith text and translations come from open hadith datasets, credited on our [content sources](/credits) page.",
    },
    {
      title: "Carefully sourced",
      text: "Hadith are text only. The app never reads hadith with a synthetic voice.",
    },
    {
      title: "Offline",
      text: "Bundled collections need no connection, and downloaded ones stay available.",
    },
    { title: "No ads", text: "Read without interruptions." },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "One hadith a day",
        text: "Read the daily hadith from the Forty with its explanation after Fajr.",
      },
      {
        title: "Checking a source",
        text: "Someone shares a saying; search the collections and check its grading.",
      },
      {
        title: "A chapter a week",
        text: "Read one chapter of Riyad as-Salihin each week and bookmark the hadith you want to remember.",
      },
    ],
  },
  faqs: [
    {
      question: "Which hadith collections are included?",
      answer:
        "Nawawi's Forty and Riyad as-Salihin are bundled. Sahih al-Bukhari, Sahih Muslim, Abu Dawud, at-Tirmidhi, an-Nasa'i and Ibn Majah download when you open them.",
    },
    {
      question: "Can I listen to hadith?",
      answer:
        "No. Hadith in the app are text only. We would only ever add recordings by human readers that are licensed for sharing, never a synthetic voice, and no such recording has passed our licence review.",
    },
    {
      question: "Are the hadith graded?",
      answer: "Yes, grading is shown where the source collection provides it.",
    },
  ],
  related: ["quran", "zikr-tracker", "learn-quran", "daily-islamic-habits"],
  cta: {
    title: "Keep the Sunnah close",
    text: "Download Munib Tracker and start with today's hadith.",
  },
};
