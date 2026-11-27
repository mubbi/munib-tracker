import type { FeaturePage } from "@/content/types";

export const widgetsAndDevices: FeaturePage = {
  slug: "widgets-and-devices",
  icon: "devices",
  navLabel: "Widgets, watch & TV",
  navHint: "iPhone, Android, web, watch and TV",
  group: "everyday",
  title: "Munib Tracker on your phone, watch, TV and browser",
  seoTitle: "Salah App for iPhone, Android, Apple Watch, Wear OS & TV",
  seoDescription:
    "Use Munib Tracker on iPhone, iPad, Android, the web, Apple TV and Android TV, with home-screen widgets, Live Activities, Apple Watch and Wear OS tiles.",
  description:
    "iOS, Android, web, Apple TV and Android TV, plus widgets, Live Activities, Apple Watch, Wear OS and voice shortcuts.",
  keywords: [
    "apple watch prayer app",
    "wear os salah tile",
    "prayer times widget",
    "islamic app for apple tv",
    "salah app web",
  ],
  cluster: "devices",
  published: "2026-11-23",
  updated: "2026-11-27",
  eyebrow: "Every device",
  intro:
    "Check the next Salah on your lock screen, mark it from your wrist, read the Qur'an on the big screen, and pick up on your laptop where you left off on your phone.",
  hero: {
    key: "watch-schedule",
    caption: "The next Salah and a Tasbeeh shortcut on Apple Watch.",
  },
  whatItDoes: {
    title: "Where you can use it",
    groups: [
      {
        title: "Phones and tablets",
        items: [
          "iPhone and iPad from the App Store",
          "Android phones and tablets from Google Play",
          "Layouts that adapt to tablets and foldables",
        ],
      },
      {
        title: "Home screen and lock screen",
        items: [
          "Widgets for the next Salah, the day's schedule, progress, streaks, Qaza, Tasbeeh, khatm and more",
          "Mark a Salah straight from a widget",
          "Live Activities and the Dynamic Island on iOS; Live Updates and an ongoing notification on Android",
          "App-icon quick actions and Siri / Google Assistant shortcuts",
          "Seasonal app icons on iPhone and Android for Ramadan, the last ten nights, both Eids, Dhul-Hijjah, the Islamic New Year and Ashura, or keep the classic icon",
        ],
      },
      {
        title: "Watch",
        items: [
          "An Apple Watch app with Now, Today, Tasbeeh and Overview pages: view the schedule, mark Salah and count tasbeeh with the Digital Crown",
          "Eight Apple Watch face complications, including the next Salah, the Islamic date and Tasbeeh",
          "A Wear OS app with Next Salah, Today and Tasbeeh tiles and two watch-face complications",
          "Watch apps are companions to the phone app",
        ],
      },
      {
        title: "Big screen and browser",
        items: [
          "Apple TV and Android TV apps for reading and tracking on the TV",
          "A web app at my.munibtracker.app that works in any modern browser",
          "Installable as a PWA with offline support",
          "Sign in to sync between all of them",
        ],
      },
    ],
  },
  why: {
    title: "Why it matters",
    paragraphs: [
      "The best reminder is the one you see without looking for it. A widget with the next Salah, or a glance at your watch, does more than a notification you swipe away.",
      "Being on every screen also makes tracking easier. Mark Asr from your wrist in a meeting, read Surah Yasin on the TV with your family, and plan your Qaza on a laptop. If you sign in, it's all one record.",
    ],
  },
  howItWorks: {
    title: "How to set it up",
    steps: [
      {
        title: "Install on your phone",
        text: "Download from the App Store or Google Play. Everything works without an account.",
      },
      {
        title: "Add widgets",
        text: "Long-press your home or lock screen and add the Munib Tracker widgets you want.",
      },
      {
        title: "Pair your watch",
        text: "The Apple Watch app and Wear OS tiles read from the phone app and send your marks back to it.",
      },
      {
        title: "Sign in to sync (optional)",
        text: "Use Google, Apple or Facebook sign-in to keep your phone, tablet, TV and web app in step.",
      },
    ],
  },
  benefits: [
    {
      title: "Glanceable",
      text: "The next Salah is always one look away, on your home screen, lock screen or wrist.",
    },
    {
      title: "One record",
      text: "Sign in once and your Salah, Qaza and zikr follow you across devices.",
    },
    {
      title: "Free everywhere",
      text: "Every platform is free with no ads, including the widgets and watch apps.",
    },
    {
      title: "Built for each screen",
      text: "TV layouts for the remote, wide layouts for tablets and desktops, and compact tiles for watches.",
    },
  ],
  gallery: [
    {
      key: "home",
      caption: "Home on iPhone: today's Salah times, the next-Salah countdown and Today's Goal.",
    },
    { key: "home", device: "android", caption: "The same home screen on an Android phone." },
    {
      key: "home",
      device: "ipad",
      caption: "On iPad, prayer times, Today's Goal and today's schedule sit side by side.",
    },
    {
      key: "tracker",
      device: "android-tablet",
      caption: "The tracker on an Android tablet, with today's schedule alongside.",
    },
    { key: "tv-home", caption: "Munib Tracker on Apple TV." },
    { key: "wear-tasbeeh-tile", caption: "The Tasbeeh tile on Wear OS." },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "At work",
        text: "Keep the schedule widget on your home screen and mark Dhuhr from the widget after you pray.",
      },
      {
        title: "Family Qur'an time",
        text: "Open the Qur'an on the TV after Maghrib so everyone can read along.",
      },
      {
        title: "On the laptop",
        text: "Use the web app to plan your Qaza or read with a translation side by side on a big screen.",
      },
    ],
  },
  notes: [
    {
      tone: "info",
      text: "Widgets, Live Activities, watch apps and voice shortcuts are part of the native iOS and Android apps. The web app and TV apps don't include them.",
    },
  ],
  faqs: [
    {
      question: "Is there an Apple Watch app?",
      answer:
        "Yes. The Apple Watch app shows your Salah schedule and lets you mark Salah; marks are sent to your iPhone. There are also complications for the next Salah.",
    },
    {
      question: "Does it work on Wear OS?",
      answer:
        "Yes. There are Wear OS tiles for the next Salah and for Tasbeeh, paired with the Android phone app.",
    },
    {
      question: "Can I use it on a computer?",
      answer:
        "Yes. Open the [web app](https://my.munibtracker.app) in any modern browser. You can install it as a PWA and sign in to sync with your phone.",
    },
    {
      question: "Is there a TV app?",
      answer: "Yes. Munib Tracker runs on Apple TV and Android TV.",
    },
  ],
  related: ["prayer-times-qibla", "salah-tracker", "zikr-tracker", "quran"],
  cta: {
    title: "Put your Salah times everywhere you look",
    text: "Download Munib Tracker, then add a widget or pair your watch.",
  },
};
