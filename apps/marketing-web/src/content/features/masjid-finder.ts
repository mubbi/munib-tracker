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
    "Find masjids near you from OpenStreetMap, save your home Masjid, keep its iqamah times privately (typed or scanned on your device) and log Salah at the Masjid.",
  description:
    "Nearby masjids from OpenStreetMap, a home Masjid with your own private iqamah times, an iqamah countdown and reminder, and Salah logged at the Masjid.",
  keywords: [
    "masjid finder app",
    "mosque near me app",
    "masjid iqamah times app",
    "nearest masjid",
  ],
  cluster: "prayer-times",
  published: "2026-11-23",
  updated: "2026-11-27",
  eyebrow: "Masjid finder",
  intro:
    "Travelling, new to the area, or just want to pray in congregation more often? See the masjids around you, open directions in your maps app, save the one you usually pray at, and keep its iqamah times on your phone, even if they come from a printed timetable on the noticeboard.",
  hero: null,
  whatItDoes: {
    title: "What the Masjid finder does",
    groups: [
      {
        title: "Find masjids near you",
        items: [
          "A list of masjids within about 7 km, nearest first",
          "Name, address, website, phone, opening hours and facilities such as wheelchair access, when OpenStreetMap has them",
          "Jumu'ah times when they are mapped on OpenStreetMap, clearly labelled as such",
          "An optional map view with a pin for each masjid: tap a pin to see the masjid and get directions",
          "Open directions to any masjid in Google Maps",
          "Data from OpenStreetMap, credited on every list and detail screen",
        ],
      },
      {
        title: "Your home Masjid",
        items: [
          "Save the masjid you usually pray at",
          "Type in its daily iqamah and Jumu'ah times as your own private times",
          "Or photograph its printed timetable: the text is read on your device, and you check every time before saving",
          "For LED boards and other hard-to-read timetables, mark each time on the photo yourself and the app reads just those boxes",
          "An iqamah countdown on the home screen when the next iqamah is close",
          'An optional "time to head to the Masjid" reminder before iqamah, with your travel time',
          "Use iqamah times as the start of the Salah focus lock window",
        ],
      },
      {
        title: "Pray in congregation",
        items: [
          'Once you have a home Masjid, mark a fard Salah as "prayed at the Masjid"',
          "A simple weekly count of Salah at the Masjid in your statistics, never a score",
          "Separate from the tracker's Jama'ah toggle, which counts congregation anywhere",
        ],
      },
      {
        title: "Honest about what it knows",
        items: [
          "Details that aren't in public data are left out, never guessed",
          "No user-submitted times, ratings or reviews",
          'Wrong details? "Report a problem on OpenStreetMap" opens the place on OpenStreetMap, where anyone can correct it',
        ],
      },
    ],
  },
  why: {
    title: "Why a Masjid finder that only uses public data?",
    paragraphs: [
      "Many masjid apps rely on users submitting and editing times, which can leave you standing outside a locked door at the wrong hour. Munib Tracker shows only what is in publicly available data, and simply leaves a field out when there is nothing reliable to show.",
      "The most accurate times for your own masjid are usually the ones on its noticeboard. Type them in or photograph the timetable, and they live on your phone, labelled as yours. They are never shared with other users.",
      "Praying in congregation carries great reward, and knowing where the nearest masjid is makes it easier to go, especially in a new city.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Open the finder",
        text: "Use your location or choose a city. Masjids nearby appear in a list, with their distance.",
      },
      {
        title: "Save your home Masjid",
        text: "Pick the masjid you usually pray at.",
      },
      {
        title: "Add its times",
        text: "Type in its iqamah and Jumu'ah times, or photograph its timetable and check what was read. They stay private to your devices.",
      },
      {
        title: "Go and pray",
        text: "Turn on the iqamah reminder or open directions, then mark the Salah as prayed at the Masjid.",
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
      title: "Your location stays approximate",
      text: "Only a rough area of about 5 km is sent to look up masjids. Distances are worked out on your device.",
    },
    {
      title: "On-device timetable scanning",
      text: "Timetable photos are read on your phone or in your browser, never uploaded. The app's copy of the photo is deleted after reading, or once you finish checking if you keep it beside the times.",
    },
    {
      title: "Connected to your Salah",
      text: "Your iqamah times can drive a time-to-leave reminder and the start of the Salah focus lock.",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "In a new city",
        text: "Land, open the finder, and get directions to the nearest masjid for Dhuhr.",
      },
      {
        title: "Your local Masjid",
        text: "When the monthly timetable changes, photograph it, check the times, and let the reminder tell you when to leave.",
      },
      {
        title: "More Salah in Jama'ah",
        text: "Set your travel time, so the reminder comes early enough for you to catch the congregation.",
      },
    ],
  },
  notes: [
    {
      tone: "info",
      text: "Masjid locations and details come from OpenStreetMap (© OpenStreetMap contributors). To find masjids near you, the app sends only an area code covering about 5 km to Munib Tracker's server, which looks it up on OpenStreetMap; no account, exact location or user ID is sent. Times you add for your home masjid stay on your device and your own synced devices.",
    },
    {
      tone: "info",
      title: "What it doesn't do",
      text: "Public iqamah timetables aren't shown, because no source has passed our licence review; only your own times are used. The map is optional and stays off until you open it, because its tiles load from OpenFreeMap, which can see the area shown on the map; directions open in Google Maps, which receives only the masjid's coordinates. Timetable scanning works in the iPhone and Android apps and in the web app (after a one-time download of about 7 MB), not on TV, and you always review the times before they are saved.",
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
        "Public data rarely includes iqamah times, and no timetable source has passed our licence review yet. You can add your home masjid's times yourself, by typing them or scanning its timetable. They stay private to you.",
    },
    {
      question: "Is there a map of nearby masjids?",
      answer:
        "Yes. The finder opens as a list, nearest first, and you can switch to a map with a pin for each masjid. The map is optional because its tiles load from OpenFreeMap, which can see the area you are looking at. Directions open in Google Maps.",
    },
    {
      question: "Is my location shared?",
      answer:
        "Only roughly. The app sends an area code covering about 5 km, without your account, to look up masjids, and works out the distances on your device.",
    },
    {
      question: "Is the timetable photo uploaded?",
      answer:
        "No. It is read on your device (Apple's Vision on iPhone, ML Kit on Android, and an engine that runs inside your browser on the web). The app's copy of the photo is deleted after reading (or when you finish checking, if you keep it on screen), and nothing is saved until you have checked the times.",
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
