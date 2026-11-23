import type { FeaturePage } from "@/content/types";

export const masjidFinder: FeaturePage = {
  slug: "masjid-finder",
  icon: "masjid",
  navLabel: "Masjid finder",
  navHint: "Nearby masjids and your home masjid",
  group: "everyday",
  title: "Find a Masjid nearby, and keep your home Masjid's times",
  seoTitle: "Masjid Finder App — Mosques Near Me, With Your Iqamah Times",
  seoDescription:
    "Find masjids near you from OpenStreetMap, save your home Masjid, keep its iqamah times privately or scan its timetable, and log Salah prayed at the Masjid.",
  description:
    "Nearby masjids from OpenStreetMap, a home Masjid with your own iqamah times, and Salah you pray in congregation logged in one tap.",
  keywords: [
    "masjid finder app",
    "mosque near me app",
    "masjid iqamah times app",
    "nearest masjid",
  ],
  cluster: "prayer-times",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "Masjid finder",
  intro:
    "Travelling, new to the area, or just want to pray in congregation more often? See the masjids around you, save the one you usually pray at, and keep its iqamah times on your phone, even if they come from a printed timetable on the noticeboard.",
  hero: null,
  whatItDoes: {
    title: "What the Masjid finder does",
    groups: [
      {
        title: "Find masjids near you",
        items: [
          "A list of nearby masjids, closest first, within a radius you choose",
          "Name, address, website, phone and facilities such as wheelchair access, when they are recorded",
          "Open any masjid in your maps app for directions",
          "Data from OpenStreetMap, credited on every screen",
        ],
      },
      {
        title: "Your home Masjid",
        items: [
          "Save the masjid you usually pray at",
          "Keep its iqamah and Jumu'ah times as your own private times",
          "Scan a printed or posted timetable to fill them in, processed on your device",
          "Use iqamah times as the anchor for reminders and the Salah focus lock",
        ],
      },
      {
        title: "Pray in congregation",
        items: [
          "Log a Salah as prayed at the Masjid",
          "Jama'ah shows up in your tracker and statistics",
          "Pair with the tracker's Jama'ah toggle for an honest picture of your week",
        ],
      },
    ],
  },
  why: {
    title: "Why a Masjid finder that only uses public data?",
    paragraphs: [
      "Many masjid apps rely on users submitting and editing times, which can leave you standing outside a locked door at the wrong hour. Munib Tracker shows only what is in publicly available data, and simply leaves a field out when there is nothing reliable to show.",
      "The most accurate times for your own masjid are usually the ones on its noticeboard. Scan that timetable once and the times live on your phone, labelled as yours. They are never shared with other users.",
      "Praying in congregation carries great reward, and knowing where the nearest masjid is makes it easier to go, especially in a new city.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Open the finder",
        text: "Masjids near your location appear in a list, with their distance.",
      },
      {
        title: "Save your home Masjid",
        text: "Pick the masjid you usually pray at. It appears on your home screen.",
      },
      {
        title: "Add its times",
        text: "Type the iqamah times or photograph its timetable. The text is read on your device and you check every time before saving.",
      },
      {
        title: "Go and pray",
        text: "Open directions in your maps app, then log the Salah as prayed at the Masjid.",
      },
    ],
  },
  benefits: [
    {
      title: "Reliable, public data",
      text: "Locations and details come from OpenStreetMap. Missing details are left out rather than guessed.",
    },
    {
      title: "Your times stay yours",
      text: "Times you add for your home masjid are private and never shown to anyone else.",
    },
    {
      title: "On-device timetable scanning",
      text: "Photos of timetables are processed on your phone, never uploaded to be read.",
    },
    {
      title: "Connected to your Salah",
      text: "Iqamah times can drive your reminders and focus lock, and congregation is counted in your tracker.",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "In a new city",
        text: "Land, open the finder, and walk to the nearest masjid for Dhuhr.",
      },
      {
        title: "A monthly timetable",
        text: "At the start of each month, photograph the timetable on the masjid noticeboard and confirm the imported times.",
      },
      {
        title: "More Salah in Jama'ah",
        text: "Set reminders from iqamah rather than Adhan time, so you leave home in time to catch the congregation.",
      },
    ],
  },
  notes: [
    {
      tone: "info",
      text: "Masjid locations and details come from OpenStreetMap. To show masjids near you, your approximate location is sent to Munib Tracker's server, which looks them up on OpenStreetMap and returns the list. Times you add for your home masjid stay on your device and in your own sync.",
    },
  ],
  faqs: [
    {
      question: "Where does the Masjid data come from?",
      answer:
        "From OpenStreetMap, an open map built by volunteers. If a masjid is missing or its details are wrong, it can be corrected on OpenStreetMap itself.",
    },
    {
      question: "Why doesn't my Masjid show iqamah times?",
      answer:
        "Most public data doesn't include iqamah times. You can add your home masjid's times yourself, by typing them or scanning its timetable. They stay private to you.",
    },
    {
      question: "Is the timetable photo uploaded?",
      answer: "No. The photo is read on your device, and you review every time before it is saved.",
    },
    {
      question: "Can other users see the times I add?",
      answer: "No. Times you add are labelled as yours and are never shared with other users.",
    },
  ],
  related: ["prayer-times-qibla", "salah-focus-lock", "salah-tracker", "widgets-and-devices"],
  cta: {
    title: "Find your nearest Masjid",
    text: "Download Munib Tracker, open the Masjid finder, and save your home Masjid.",
  },
};
