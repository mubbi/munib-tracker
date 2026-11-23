import type { ComparePage } from "@/content/types";
import { cell, MUNIB_CELLS as M, MUNIB, MUNIB_NF as P, VERIFIED_ON } from "./shared";

export const bestSalahTrackerApps: ComparePage = {
  slug: "best-salah-tracker-apps",
  kind: "roundup",
  title: "Salah tracker apps compared: which one fits you?",
  seoTitle: "Best Salah Tracker Apps (2026): Prayer & Qaza Trackers Compared",
  seoDescription:
    "A sourced comparison of popular Salah tracker apps: Munib Tracker, Muslim Pro, Athan, Pillars, FivePrayer, Just Pray and 5te5. Tracking, Qaza, ads and price.",
  description:
    "Seven popular prayer tracker apps side by side: Salah logging, Qaza, zikr, Qur'an, ads, price and privacy labels.",
  keywords: [
    "best salah tracker app",
    "prayer tracker apps",
    "muslim prayer tracker comparison",
    "qaza tracker app",
  ],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "Roundup",
  intro: [
    "A Salah tracker helps you log each of the five daily prayers and see your consistency over time. Some apps stop there; others add missed-prayer (Qaza) tracking, adhkar, the Qur'an or learning content. Business models differ too: some show ads, some charge a subscription, some are free.",
    "We compared seven popular options using each app's official website and its App Store and Google Play listings. Munib Tracker is our app, so we've kept the table factual and noted where another app is the better fit. Where we couldn't confirm a feature from an official source, we say \"not verified\" rather than guess.",
  ],
  apps: [
    MUNIB,
    { id: "muslim-pro", name: "Muslim Pro", url: "https://www.muslimpro.com/" },
    { id: "athan", name: "Athan", url: "https://www.islamicfinder.org/athan/" },
    { id: "pillars", name: "Pillars", url: "https://thepillarsapp.com" },
    { id: "fiveprayer", name: "FivePrayer", url: "https://apps.apple.com/us/app/id6755536905" },
    { id: "justpray", name: "Just Pray", url: "https://apps.apple.com/us/app/id6747154163" },
    { id: "5te5", name: "5te5", url: "https://apps.apple.com/us/app/id1602490524" },
  ],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "For Qaza (missed Salah)",
      text: "Munib Tracker and Muslim Pro both track missed prayers. Munib Tracker adds a calculator and a daily-pace planner. 5te5 offers Qaza in a separate free app.",
    },
    {
      title: "For no ads and no subscription",
      text: "Munib Tracker and 5te5 are free with no in-app purchases. Pillars has no ads but sells a Premium tier.",
    },
    {
      title: "For learning to pray",
      text: "Just Pray and 5te5 include learn-to-pray guides and videos. Munib Tracker has a 24-lesson Salah guide in its learning library.",
    },
    {
      title: "For blocking distractions",
      text: "Munib Tracker's Salah focus lock is free. Pillars (Premium) and FivePrayer can also block or lock apps at Salah time.",
    },
    {
      title: "For an all-in-one lifestyle app",
      text: "Muslim Pro has the widest range, including video, community and a halal finder, with ads or Premium.",
    },
  ],
  table: [
    {
      group: "Tracking",
      rows: [
        {
          feature: "Log Salah as prayed",
          cells: {
            munib: M.salahLog,
            "muslim-pro": cell.yes(),
            athan: cell.yes(),
            pillars: cell.yes(),
            fiveprayer: cell.yes(),
            justpray: cell.yes("On time or late, journal"),
            "5te5": cell.yes("40-day habit challenge"),
          },
        },
        {
          feature: "Qaza (missed Salah) tracking",
          cells: {
            munib: cell.yes("Calculator and planner"),
            "muslim-pro": cell.yes(),
            athan: cell.unverified(),
            pillars: cell.partial("Mark as made up"),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.partial("Separate Qaza app"),
          },
        },
        {
          feature: "Sunnah Salah and Rawatib",
          cells: {
            munib: cell.yes("Rawatib tracker (10 or 12), plus Tahajjud, Ishraq, Duha and more"),
            "muslim-pro": cell.unverified(),
            athan: cell.unverified(),
            pillars: cell.unverified(),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "Excused days (hayd)",
          cells: {
            munib: cell.yes("Hayd, illness and travel"),
            "muslim-pro": cell.unverified(),
            athan: cell.yes("Menstrual mode"),
            pillars: cell.yes("Menstruation mode"),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "Statistics and streaks",
          cells: {
            munib: cell.yes(),
            "muslim-pro": cell.yes(),
            athan: cell.yes(),
            pillars: cell.yes(),
            fiveprayer: cell.yes(),
            justpray: cell.yes("Calendar"),
            "5te5": cell.unverified(),
          },
        },
      ],
    },
    {
      group: "Everything else",
      rows: [
        {
          feature: "Prayer times",
          cells: {
            munib: cell.yes(),
            "muslim-pro": cell.yes(),
            athan: cell.yes(),
            pillars: cell.yes(),
            fiveprayer: cell.yes(),
            justpray: cell.yes(),
            "5te5": cell.yes(),
          },
        },
        {
          feature: "Zikr and tasbeeh",
          cells: {
            munib: cell.yes(),
            "muslim-pro": cell.yes(),
            athan: cell.yes(),
            pillars: cell.partial("Apple Watch, Premium"),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "Qur'an reader",
          cells: {
            munib: cell.yes(),
            "muslim-pro": cell.yes(),
            athan: cell.yes(),
            pillars: cell.no(),
            fiveprayer: cell.yes(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "Learn-to-pray guide",
          cells: {
            munib: cell.yes("Salah guide"),
            "muslim-pro": cell.unverified(),
            athan: cell.unverified(),
            pillars: cell.unverified(),
            fiveprayer: cell.partial("Articles"),
            justpray: cell.yes(),
            "5te5": cell.yes("Videos"),
          },
        },
        {
          feature: "Qur'an recitation practice (mic)",
          cells: {
            munib: cell.yes("On-device"),
            "muslim-pro": cell.unverified(),
            athan: cell.unverified(),
            pillars: cell.unverified(),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
      ],
    },
    {
      group: "Focus, place and people",
      rows: [
        {
          feature: "Block apps at Salah time",
          cells: {
            munib: P.focusLock,
            "muslim-pro": cell.unverified(),
            athan: cell.unverified(),
            pillars: cell.yes("PrayFirst, Premium"),
            fiveprayer: cell.yes("App lock during Salah"),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "Masjid finder",
          cells: {
            munib: P.masjidFinder,
            "muslim-pro": cell.yes(),
            athan: cell.unverified(),
            pillars: cell.partial("Masjid times in beta"),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "Pray with friends",
          cells: {
            munib: P.partner,
            "muslim-pro": cell.partial("Community features"),
            athan: cell.unverified(),
            pillars: cell.unverified(),
            fiveprayer: cell.yes("Prayer circles"),
            justpray: cell.yes("Prayer circles"),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "Family and kids mode",
          cells: {
            munib: P.family,
            "muslim-pro": cell.unverified(),
            athan: cell.unverified(),
            pillars: cell.unverified(),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
      ],
    },
    {
      group: "Price and privacy",
      rows: [
        {
          feature: "Ads",
          cells: {
            munib: cell.text("No"),
            "muslim-pro": cell.text("Yes, in the free version"),
            athan: cell.text("Yes, in the free version"),
            pillars: cell.text("No"),
            fiveprayer: cell.text("States no ads"),
            justpray: cell.text("No ads label on Play"),
            "5te5": cell.text("No"),
          },
        },
        {
          feature: "Paid tier",
          cells: {
            munib: cell.text("None"),
            "muslim-pro": cell.text("Premium"),
            athan: cell.text("Premium / remove ads"),
            pillars: cell.text("Premium"),
            fiveprayer: cell.text("Pro"),
            justpray: cell.text("Pro"),
            "5te5": cell.text("None"),
          },
        },
        {
          feature: 'App Store "Data Used to Track You"',
          cells: {
            munib: cell.text("No ad SDKs"),
            "muslim-pro": cell.text("Location, Identifiers"),
            athan: cell.text("Contact Info"),
            pillars: cell.text("None declared"),
            fiveprayer: cell.text("Identifiers"),
            justpray: cell.text("Location, Identifiers, Usage Data"),
            "5te5": cell.text("None declared"),
          },
        },
      ],
    },
  ],
  strengths: {
    munib: [
      "Qaza calculator and planner",
      "Recitation practice",
      "No ads or paid tier",
      "Watch and TV apps",
    ],
    "muslim-pro": ["Widest feature set", "Video, community, halal finder", "Largest user base"],
    athan: ["Established prayer times", "Daily goals and streaks", "Menstrual mode"],
    pillars: ["No ads, no account", "App blocking and Fajr alarm (Premium)", "Clean design"],
    fiveprayer: ["App lock during Salah", "Prayer circles with friends", "Qur'an reader"],
    justpray: ["Illustrated learn-to-pray guides", "Prayer circles", "Fajr alarm"],
    "5te5": [
      "Completely free, non-profit",
      "Beginner 40-day challenge",
      "No data collected (Play)",
    ],
  },
  bestFor: {
    munib: "Free, private tracking of Salah, Qaza and zikr with the Qur'an and learning built in.",
    "muslim-pro": "One app for everything, including video and community.",
    athan: "Reliable prayer times with simple logging.",
    pillars: "A minimal prayer app with focus tools.",
    fiveprayer: "Praying on time with friends and app lock.",
    justpray: "New learners who want illustrated guidance.",
    "5te5": "Beginners building the habit, completely free.",
  },
  body: [
    { type: "h2", text: "How to choose a Salah tracker" },
    {
      type: "ul",
      items: [
        "**Do you have missed Salah to make up?** Pick an app with real Qaza tracking. See [what Qaza Salah is](/resources/salah/what-is-qaza-salah).",
        '**Do you mind ads?** Ads in a worship app are distracting for many people; check the Play Store "Contains ads" label.',
        '**What does the privacy label say?** On the App Store, look for "Data Used to Track You".',
        "**Do you want more than tracking?** If you also want adhkar and the Qur'an, an all-in-one app saves switching.",
        "**Will you keep using it?** The best tracker is the one you open every day. Try two for a week each.",
      ],
    },
    {
      type: "note",
      tone: "info",
      title: "How we checked",
      text: "Every value comes from the app's official website, App Store listing or Google Play listing (US storefronts), checked on the date shown. Features change often, so check the listings before you decide. Spotted something out of date? [Tell us](/contact) and we'll fix it.",
    },
  ],
  sources: [
    {
      label: "Muslim Pro — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
    },
    {
      label: "Muslim Pro — App Store",
      url: "https://apps.apple.com/us/app/muslim-pro-quran-athan/id388389451",
    },
    {
      label: "Athan — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.athan",
    },
    {
      label: "Athan — App Store",
      url: "https://apps.apple.com/us/app/athan-prayer-times-dua-azkar/id505858403",
    },
    { label: "Pillars — official site (/ai)", url: "https://thepillarsapp.com/ai" },
    { label: "Pillars — App Store", url: "https://apps.apple.com/us/app/id1559086853" },
    { label: "FivePrayer — App Store", url: "https://apps.apple.com/us/app/id6755536905" },
    {
      label: "FivePrayer — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.fiveprayer.app",
    },
    { label: "Just Pray — App Store", url: "https://apps.apple.com/us/app/id6747154163" },
    {
      label: "Just Pray — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.justprayapp.justpray",
    },
    { label: "5te5 Prayer Tracker — App Store", url: "https://apps.apple.com/us/app/id1602490524" },
    {
      label: "5te5 Prayer Tracker — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.sozlerkosku.beste5v2",
    },
    { label: "5te5 Qadha Tracker — App Store", url: "https://apps.apple.com/us/app/id6751702091" },
  ],
  faqs: [
    {
      question: "What is the best Salah tracker app?",
      answer:
        "It depends on what you need. If you have Qaza to make up, choose an app with real Qaza tracking. If you want everything in one place, Muslim Pro is the broadest. If you want no ads and no subscription, Munib Tracker and 5te5 are both free.",
    },
    {
      question: "Is there a free Salah tracker without ads?",
      answer:
        "Yes. Munib Tracker and 5te5 have no ads and no in-app purchases. Pillars has no ads and offers an optional Premium tier.",
    },
  ],
  related: [
    "/features/salah-tracker",
    "/features/qaza-salah-tracker",
    "/compare/islamic-habit-tracker-apps",
  ],
};
