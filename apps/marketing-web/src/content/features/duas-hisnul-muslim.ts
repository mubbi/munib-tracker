import { DUA_COUNT } from "@munib-tracker/shared/constants";
import type { FeaturePage } from "@/content/types";

export const duasHisnulMuslim: FeaturePage = {
  slug: "duas-hisnul-muslim",
  icon: "dua",
  navLabel: "Duas (Hisnul Muslim)",
  navHint: "The full collection, by occasion",
  group: "quran",
  title: "The duas of Hisnul Muslim, organised for the moment you need one",
  seoTitle: "Dua App — Hisnul Muslim Duas with Audio, Search & Favorites",
  seoDescription: `${DUA_COUNT} duas from Hisnul Muslim in 16 categories, with Arabic, meaning, reference and audio. Search, save favorites and learn dua step by step. Free, no ads.`,
  description: `${DUA_COUNT} duas from Hisnul Muslim in 16 categories, with references, audio, search and favorites, plus a Learn Dua course.`,
  keywords: [
    "dua app",
    "hisnul muslim app",
    "daily duas app",
    "duas with audio and translation",
    "fortress of the muslim app",
    "dua for every occasion",
  ],
  cluster: "duas",
  published: "2026-11-27",
  updated: "2026-11-27",
  eyebrow: "Duas",
  intro: `All ${DUA_COUNT} duas of Hisnul Muslim (Fortress of the Muslim), sorted into 16 categories and then by occasion, each with its Arabic, meaning and reference. Search for what you need, save the ones you return to, and learn how dua is made in a short course.`,
  hero: null,
  whatItDoes: {
    title: "What is in the dua library",
    intro:
      "The dua library sits beside the app's adhkar and [tasbeeh counter](/features/tasbeeh-counter). The wider remembrance routine is covered on the [Zikr tracker](/features/zikr-tracker) page.",
    groups: [
      {
        title: "The collection",
        items: [
          `${DUA_COUNT} duas from the complete Hisnul Muslim collection`,
          "16 categories: morning and evening, sleep and waking, Salah and masjid, forgiveness and gratitude, distress and hardship, protection and refuge, Qur'anic duas, food and drink, home and clothing, travel, family and marriage, sickness and death, weather and nature, Hajj and Umrah, purification, and manners and social life",
          "Categories arranged under four headings: daily life, Salah and worship, hardship and healing, and family, people and travel",
          "Inside a category, duas are grouped by occasion, with a filter to jump to the one you want",
          "Every dua shows its reference",
        ],
      },
      {
        title: "Reading a dua",
        items: [
          "Arabic text with its meaning, and transliteration where the source dataset provides one",
          "Audio recitation for most duas",
          "Show or hide the transliteration and the translation, and change the text size",
          "Previous and next buttons to move through an occasion without going back to the list",
          "Share a dua as text or as an image card, and report a mistake from the same menu",
          "On a dua that is an ayah of the Qur'an, a recite-along check on phones, tablets and the web",
        ],
      },
      {
        title: "Finding and keeping",
        items: [
          "Search every dua by title, topic or text, or search inside one category",
          "The same duas appear in the app's universal search, next to the Qur'an, hadith and adhkar",
          "Saved duas in a list you can reorder",
          "A dua of the day, and a suggestion that follows the time of day: morning, around Salah, evening or before sleep",
          "Recently read duas on the first screen, which you can clear",
        ],
      },
      {
        title: "Learning and repeating",
        items: [
          "Learn Dua: 20 topics in five sections, from what dua is, its etiquette and its best times to daily and situational duas",
          "Duas by occasion: 16 everyday occasions that open the matching lesson or the library",
          "Mark topics complete, see your study progress and take a review quiz",
          "Duas also appear in the app's flash cards",
          "On the Ramadan screen, the Laylat al-Qadr dua opens in the tasbeeh counter so you can repeat it with a count",
        ],
      },
    ],
  },
  why: {
    title: "Why a dua library on your phone?",
    paragraphs: [
      "The moment you want a dua is rarely the moment you have the book. You are at the door, at the table, in a waiting room, or awake at three in the morning, trying to remember words you read once.",
      "Hisnul Muslim is the pocket collection many Muslims already know, arranged by occasion for exactly this reason. Having all of it in the app, with search and a reference on every entry, means the answer to “what do I say when…” is a few seconds away and you can see where it comes from.",
      "A list alone does not teach you to make dua, though. That is why the library is paired with a short course on what dua is, how to ask and when, so the words you find are words you understand.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Open Duas",
        text: "The first screen shows the dua of the day, a suggestion for this time of day, your saved duas and all 16 categories.",
      },
      {
        title: "Browse or search",
        text: "Open a category and filter by occasion, or type a word such as travel, rain or forgiveness into search.",
      },
      {
        title: "Read and listen",
        text: "Each dua shows the Arabic, the meaning and the reference. Where audio is available, press play to hear it.",
      },
      {
        title: "Save what you use",
        text: "Tap the bookmark to save a dua. Saved duas live in their own list, in the order you choose.",
      },
      {
        title: "Learn the background",
        text: "Open Learn Dua from the Learn section to study etiquette, best times and the duas of daily life, one topic at a time.",
      },
    ],
  },
  benefits: [
    {
      title: "Complete, not a sample",
      text: `The library carries the whole collection, ${DUA_COUNT} duas, and the count on this page is checked against the app's data.`,
    },
    {
      title: "Sourced, never rewritten",
      text: "The texts come from open Hisnul Muslim datasets and are not edited by hand. Each dua keeps its reference, and the datasets are named on the [credits page](/credits).",
    },
    {
      title: "There when you are offline",
      text: "The text of every dua is stored in the app. Audio plays from the internet the first time and is kept on your device afterwards.",
    },
    {
      title: "Quiet",
      text: "No ads and nothing to buy. You open a dua and read it.",
    },
  ],
  examples: {
    title: "Moments it helps",
    items: [
      {
        title: "Before a journey",
        text: "Open the Travel category at the door. The duas for setting out and returning are grouped together, so you read them in order.",
      },
      {
        title: "A hard night",
        text: "Search a word for what you feel, or open Distress and hardship. Save the dua that fits so it is one tap away next time.",
      },
      {
        title: "Visiting someone who is ill",
        text: "The Sickness and death category holds the duas for visiting the sick, and further on, the duas for the deceased.",
      },
      {
        title: "Teaching yourself slowly",
        text: "Take one Learn Dua topic a day. Mark it complete, then let the flash cards bring it back later.",
      },
    ],
  },
  notes: [
    {
      tone: "info",
      title: "Languages, transliteration and audio",
      text: "Meanings are in English. A Bengali translation covers part of the collection, and Urdu and Indonesian cover a smaller set; the rest fall back to English. Transliteration and audio are shown only where the source datasets include them, so some duas have neither.",
    },
    {
      tone: "scholar",
      title: "A library, not a ruling",
      text: "The app shows each dua with the reference given in its source. It does not grade narrations or issue rulings. Learn Dua is an educational guide: when you memorise, check the wording with a teacher, and remember that a translation helps you understand but does not replace the Arabic.",
    },
    {
      tone: "info",
      title: "On TV",
      text: "The dua library can be read on Apple TV and Android TV. Sharing, the recite-along check and counting a dua in the tasbeeh counter are for phones, tablets and the web.",
    },
  ],
  faqs: [
    {
      question: "Is there a free dua app with the full Hisnul Muslim?",
      answer: `Yes. Munib Tracker includes all ${DUA_COUNT} duas of Hisnul Muslim (Fortress of the Muslim) in 16 categories, free and without ads. Each dua shows its Arabic, meaning and reference.`,
    },
    {
      question: "Does the dua library work offline?",
      answer:
        "Yes. The text of every dua is stored in the app, so reading, searching and your saved duas work without a connection. Audio needs the internet the first time you play a dua and is kept on your device after that.",
    },
    {
      question: "Do the duas have audio and transliteration?",
      answer:
        "Most duas have an audio recitation, and some have transliteration. Both come from the source datasets, so the app shows them where they exist and leaves them out where they do not. You can hide the transliteration or the translation if you prefer to read the Arabic alone.",
    },
    {
      question: "Where do the duas come from?",
      answer:
        "From open-source Hisnul Muslim datasets, generated into the app without hand editing, with the reference kept on each dua. The datasets and their licences are listed on the [credits page](/credits).",
    },
    {
      question: "Can I save my favorite duas and find them quickly?",
      answer:
        "Yes. Tap the bookmark on any dua to add it to Saved duas, then reorder the list as you like. Search covers every dua by title, topic or text, and recently read duas are shown on the first screen.",
    },
    {
      question: "Can I learn how to make dua in the app?",
      answer:
        "Yes. Learn Dua is a course of 20 topics covering what dua is, its etiquette, its best times, and daily and situational duas, with a review quiz and progress you mark yourself. The guide [How to make dua](/resources/zikr/how-to-make-dua) covers the same ground in an article.",
    },
  ],
  related: ["zikr-tracker", "tasbeeh-counter", "99-names-of-allah", "hadith"],
  guides: ["/resources/zikr/how-to-make-dua", "/resources/zikr/morning-and-evening-adhkar"],
  cta: {
    title: "Have the right words within reach",
    text: "Download Munib Tracker, open Duas and save the three you most want to remember this week.",
  },
};
