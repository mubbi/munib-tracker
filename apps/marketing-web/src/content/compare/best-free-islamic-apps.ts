import type { ComparePage } from "@/content/types";
import { devicesGroup, NOT_ON_APP_STORE } from "./devices";
import { cell, MUNIB_CELLS as M, MUNIB } from "./shared";

const QC = "quran-com";
const PL = "pillars";
const AT = "athan";
const MP = "muslim-pro";
const I3 = "islam360";
const TA = "tarteel";

/** The Quran.com app is a Qur'an reader; its listings describe nothing else. */
const NOT_IN_LISTINGS = cell.unverified("Not mentioned in its listings");

export const bestFreeIslamicApps: ComparePage = {
  slug: "best-free-islamic-apps",
  kind: "roundup",
  title: 'Best free Islamic apps: what "free" really means in each one',
  seoTitle: "Best Free Islamic Apps (2026): No Ads, No Subscription Compared",
  seoDescription:
    "Free Islamic apps compared: Munib Tracker, Quran.com, Pillars, Athan, Muslim Pro, Islam360 and Tarteel. Ads, paid tiers, accounts and privacy labels.",
  description:
    'Seven Islamic apps you can download for free, and what "free" covers in each: ads, paid tiers, accounts, privacy labels and features.',
  keywords: [
    "best free islamic apps",
    "free islamic app without ads",
    "free muslim apps no subscription",
    "islamic apps without in-app purchases",
  ],
  cluster: "comparison",
  published: "2026-11-27",
  updated: "2026-11-27",
  eyebrow: "Roundup",
  intro: [
    'Almost every Islamic app is free to download, but "free" covers very different things. Some apps are free with nothing to buy. Some have no ads but keep certain features for a paid tier. Others are free because they show ads, with a subscription to remove them.',
    "We compared seven well-known apps using each app's official website and its App Store and Google Play listings. Munib Tracker is our app, so we've kept the table factual and said plainly where another app is the better free choice. Where we couldn't confirm something from an official source, we say \"not verified\" rather than guess.",
  ],
  apps: [
    MUNIB,
    {
      id: QC,
      name: "Quran (by Quran.com)",
      developer: "Quran Foundation, Inc",
      url: "https://quran.com/apps",
    },
    { id: PL, name: "Pillars", url: "https://thepillarsapp.com" },
    { id: AT, name: "Athan", url: "https://www.islamicfinder.org/athan/" },
    { id: MP, name: "Muslim Pro", url: "https://www.muslimpro.com/" },
    { id: I3, name: "Islam360", url: "https://www.theislam360.com/" },
    { id: TA, name: "Tarteel", url: "https://tarteel.ai" },
  ],
  verifiedOn: "2026-11-27",
  summary: [
    {
      title: "Free with nothing to buy",
      text: "Munib Tracker and the Quran.com app have no ads and no in-app purchases. Munib Tracker covers Salah, Qaza, zikr, the Qur'an and learning; the Quran.com app is a Qur'an reader.",
    },
    {
      title: "If you only want to read the Qur'an",
      text: "The Quran.com app is the simpler free choice: a focused, ad-free mushaf from a non-profit, with open-source code.",
    },
    {
      title: "No ads, with a paid tier",
      text: "Pillars and Tarteel show no ads. Both keep some features for Premium: Pillars its full Adhan, app blocking and Apple Watch app; Tarteel its mistake detection.",
    },
    {
      title: "Free with ads",
      text: "Athan, Muslim Pro and Islam360 are free with ads and sell a subscription. Athan's Premium has the lowest listed price of the three.",
    },
    {
      title: "For hadith and Urdu tafsir",
      text: "Islam360 is the better free choice for deep Qur'an and hadith study in Urdu, if you don't mind ads.",
    },
  ],
  table: [
    {
      group: 'What "free" includes',
      rows: [
        {
          feature: "Price and in-app purchases",
          cells: {
            munib: M.price,
            [QC]: cell.text("Free; no in-app purchases on its App Store listing"),
            [PL]: cell.text("Free core; Premium from $11.99/month or $49.99/year in the US"),
            [AT]: cell.text(
              "Free with ads; Athan Premium ($1.99/month or $11.99/year in the US) or one-off ad removal",
            ),
            [MP]: cell.text(
              "Free with ads; Premium subscription ($12.99/month or $34.99/year in the US)",
            ),
            [I3]: cell.text(
              "Free with ads; subscription to remove ads ($9.99/month or $49.99/year in the US)",
            ),
            [TA]: cell.text(
              "Free core; Premium subscription (US App Store lists from $12.99/month)",
            ),
          },
        },
        {
          feature: "Ads",
          cells: {
            munib: M.ads,
            [QC]: cell.text('No ads (its listing says "ad-free")'),
            [PL]: cell.text("No ads"),
            [AT]: cell.text('Yes (Google Play: "Contains ads")'),
            [MP]: cell.text('Yes (Google Play: "Contains ads")'),
            [I3]: cell.text('Yes (Google Play: "Contains ads")'),
            [TA]: cell.text("No ads"),
          },
        },
        {
          feature: "Account required",
          cells: {
            munib: M.account,
            [QC]: cell.unverified(),
            [PL]: cell.text("Not required (no sign-up)"),
            [AT]: cell.unverified(),
            [MP]: cell.unverified(),
            [I3]: cell.unverified(),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: 'App Store "Data Used to Track You"',
          cells: {
            munib: cell.text("No advertising SDKs; guest data stays on the device"),
            [QC]: cell.text("None declared"),
            [PL]: cell.text("None declared"),
            [AT]: cell.text("Contact Info"),
            [MP]: cell.text("Location, Identifiers"),
            [I3]: cell.text("Identifiers"),
            [TA]: cell.text("None declared"),
          },
        },
        {
          feature: "Source code public",
          cells: {
            munib: M.openSource,
            [QC]: cell.yes("Open source on GitHub; Android app under GPL-3.0"),
            [PL]: cell.unverified(),
            [AT]: cell.unverified(),
            [MP]: cell.unverified(),
            [I3]: cell.unverified(),
            [TA]: cell.unverified(),
          },
        },
      ],
    },
    {
      group: "Core features",
      rows: [
        {
          feature: "Salah times and Adhan",
          cells: {
            munib: M.times,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.yes("Full Adhan is Premium"),
            [AT]: cell.yes(),
            [MP]: cell.yes(),
            [I3]: cell.yes(),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "Qibla",
          cells: {
            munib: M.qibla,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.yes(),
            [AT]: cell.yes(),
            [MP]: cell.yes(),
            [I3]: cell.yes(),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "Salah tracking",
          cells: {
            munib: M.salahLog,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.yes("Free tracker"),
            [AT]: cell.yes("Daily log and streaks"),
            [MP]: cell.yes("Prayer & Fasting tracker with streaks"),
            [I3]: cell.unverified(
              'Website mentions a "Salah Tracker"; store listings don\'t describe logging',
            ),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "Qaza (missed Salah) tracking",
          cells: {
            munib: M.qaza,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.partial("Mark a Salah as late/made up; fasting make-up counter"),
            [AT]: cell.unverified("Not mentioned in listings"),
            [MP]: cell.yes("Ibadah tracker logs missed prayers and fasts"),
            [I3]: cell.unverified(),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "Qur'an reader",
          cells: {
            munib: M.quranReader,
            [QC]: cell.yes("Mushaf pages, reciters and downloadable translations"),
            [PL]: cell.no("Per Pillars' own blog"),
            [AT]: cell.yes("Translations in 45+ languages"),
            [MP]: cell.yes("Offline Qur'an needs Premium"),
            [I3]: cell.yes("21+ translations, 16+ tafsir"),
            [TA]: cell.yes("152 translations in 76 languages"),
          },
        },
        {
          feature: "Qur'an recitation practice (mic)",
          cells: {
            munib: M.recitation,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.unverified(),
            [AT]: cell.unverified(),
            [MP]: cell.unverified("Not described in official listings"),
            [I3]: cell.unverified("Voice search only"),
            [TA]: cell.yes("Follows your recitation for free; mistake detection needs Premium"),
          },
        },
        {
          feature: "Zikr and duas",
          cells: {
            munib: M.zikr,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.partial("Tasbeeh on Apple Watch only, Premium"),
            [AT]: cell.yes("Tasbeeh counter, adhkar with audio"),
            [MP]: cell.yes("Tasbeeh counter and dua library"),
            [I3]: cell.yes("With hadith references"),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "Hadith collections",
          cells: {
            munib: M.hadith,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.unverified(),
            [AT]: cell.unverified("Hadith section on the IslamicFinder website"),
            [MP]: cell.partial("Via AiDeen and Qalbox video"),
            [I3]: cell.yes("Seven primary books plus more"),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "Islamic learning library",
          cells: {
            munib: M.learning,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.unverified(),
            [AT]: cell.unverified("Separate Athan Academy app"),
            [MP]: cell.partial("Qalbox video series; Premium lessons"),
            [I3]: cell.partial("Courses and Fahm-ul-Quran"),
            [TA]: cell.unverified("No tajweed lessons or Qaida found"),
          },
        },
      ],
    },
    devicesGroup({
      [QC]: {
        web: cell.partial("Quran.com website"),
        ios: cell.yes("iPhone and iPad; also Mac and Vision Pro"),
        android: cell.yes("Quran for Android"),
        appleWatch: NOT_ON_APP_STORE,
        appleTv: NOT_ON_APP_STORE,
      },
      [PL]: {
        ios: cell.yes("iPhone and iPad"),
        android: cell.yes(),
        appleWatch: cell.yes("Premium"),
        appleTv: NOT_ON_APP_STORE,
        widgets: cell.yes("Free"),
      },
      [AT]: {
        web: cell.partial("IslamicFinder website"),
        ios: cell.partial("iPhone; no iPad version on its App Store listing"),
        android: cell.yes(),
        appleWatch: NOT_ON_APP_STORE,
        appleTv: NOT_ON_APP_STORE,
        widgets: cell.yes(),
      },
      [MP]: {
        web: cell.partial("Prayer-times pages on the website"),
        ios: cell.yes("iPhone and iPad; also Mac and Vision Pro"),
        android: cell.yes(),
        appleWatch: cell.yes("Listed on the App Store"),
        appleTv: cell.partial("Apple TV listed on the App Store"),
        widgets: cell.partial("Marking from the widget needs Premium"),
      },
      [I3]: {
        ios: cell.yes("iPhone and iPad"),
        android: cell.yes("Also on Huawei AppGallery"),
        appleWatch: NOT_ON_APP_STORE,
        appleTv: NOT_ON_APP_STORE,
        widgets: cell.yes("Prayer time, tracker, tasbeeh and verse widgets on iPhone"),
      },
      [TA]: {
        ios: cell.yes("iPhone and iPad"),
        android: cell.yes(),
        appleWatch: NOT_ON_APP_STORE,
        appleTv: NOT_ON_APP_STORE,
      },
    }),
  ],
  strengths: {
    munib: [
      "Free, with no ads, subscriptions or in-app purchases",
      "No account needed (guest mode)",
      "Salah, Qaza, zikr, the Qur'an, hadith and learning in one app",
      "Web, TV, Apple Watch and Wear OS",
      "Source code public on GitHub (non-commercial licence)",
    ],
    [QC]: [
      "Free and ad-free, with no in-app purchases listed",
      "Open-source code, run by a non-profit",
      "Focused mushaf with reciters and translations",
    ],
    [PL]: [
      "No ads and no account",
      "Free prayer tracker and widgets",
      "App blocking and a smart Fajr alarm (Premium)",
    ],
    [AT]: [
      "Established prayer times and Adhan",
      "Daily log, goals and streaks",
      "Low-cost Premium option",
    ],
    [MP]: [
      "Very broad feature set in a single app",
      "Tracks missed prayers and fasts",
      "Qalbox video library and AiDeen AI assistant",
    ],
    [I3]: [
      "Large hadith library with grading and takhreej",
      "Many Urdu translations and tafsir by named scholars",
      "Qaida lessons with audio",
    ],
    [TA]: [
      "Follows your recitation for free",
      "Very large free Qur'an library: translations, tafsirs, reciters",
      "No ads",
    ],
  },
  bestFor: {
    munib: "One free app for Salah, Qaza, zikr, the Qur'an and learning, with nothing to buy.",
    [QC]: "Reading and listening to the Qur'an in a focused, ad-free, open-source app.",
    [PL]: "A minimal, ad-free prayer app, if the free core is enough for you.",
    [AT]: "Reliable prayer times with simple logging, if you don't mind ads.",
    [MP]: "One app for nearly everything, with ads or a Premium subscription.",
    [I3]: "Deep Qur'an and hadith study in Urdu, with ads or a subscription.",
    [TA]: "Memorizers who want AI to follow their recitation and may subscribe later.",
  },
  body: [
    { type: "h2", text: 'Four kinds of "free"' },
    {
      type: "ul",
      items: [
        "**Free with nothing to buy.** No ads, no subscription and no in-app purchases. Munib Tracker and the Quran.com app work this way.",
        "**Free core, paid extras.** No ads, but some features need a paid tier. Pillars and Tarteel work this way.",
        "**Free with ads.** The app is paid for by advertising, and a subscription or one-off purchase removes the ads. Athan, Muslim Pro and Islam360 work this way.",
        "**Free, but with an account or data cost.** Check whether you must sign up, and read the App Store privacy label before you install.",
      ],
    },
    { type: "h2", text: "How to check an app yourself" },
    {
      type: "ul",
      items: [
        '**Ads:** on Google Play, look for the "Contains ads" label under the app name.',
        '**Purchases:** on the App Store, open "In-App Purchases" to see what is sold and at what price.',
        '**Tracking:** on the App Store, look for "Data Used to Track You" in the App Privacy section.',
        "**Source code:** an app whose code is public can be inspected by anyone. Munib Tracker's [source code is public](/open-source) under a non-commercial licence, and our [privacy policy](/privacy) explains what stays on your device.",
      ],
    },
    {
      type: "note",
      tone: "info",
      title: "How we checked",
      text: "Every value comes from the app's official website, App Store listing or Google Play listing (US storefronts), checked on the date shown. Prices and features change often, so check the listings before you decide. Spotted something out of date? [Tell us](/contact) and we'll fix it.",
    },
  ],
  sources: [
    {
      label: "Quran (by Quran.com) — App Store",
      url: "https://apps.apple.com/us/app/quran-by-quran-com-%D9%82%D8%B1%D8%A2%D9%86/id1118663303",
    },
    {
      label: "Quran for Android — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.quran.labs.androidquran",
    },
    { label: "Quran.com — apps", url: "https://quran.com/apps" },
    { label: "Quran.com — about", url: "https://quran.com/about-us" },
    { label: "Quran for Android — source code", url: "https://github.com/quran/quran_android" },
    { label: "Quran for iOS — source code", url: "https://github.com/quran/quran-ios" },
    { label: "Pillars — official site (/ai)", url: "https://thepillarsapp.com/ai" },
    {
      label: "Pillars blog — best Ramadan apps",
      url: "https://thepillarsapp.com/blog/best-ramadan-apps",
    },
    { label: "Pillars — App Store", url: "https://apps.apple.com/us/app/id1559086853" },
    {
      label: "Pillars — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.pillars.pillars",
    },
    { label: "Athan — IslamicFinder website", url: "https://www.islamicfinder.org/athan/" },
    {
      label: "Athan — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.athan",
    },
    {
      label: "Athan — App Store",
      url: "https://apps.apple.com/us/app/athan-prayer-times-dua-azkar/id505858403",
    },
    { label: "Muslim Pro — official website", url: "https://www.muslimpro.com/" },
    {
      label: "Muslim Pro — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
    },
    {
      label: "Muslim Pro — App Store",
      url: "https://apps.apple.com/us/app/muslim-pro-quran-athan/id388389451",
    },
    {
      label: "Muslim Pro help — Journal / tracker",
      url: "https://support.muslimpro.com/help/en/articles/journal",
    },
    {
      label: "Muslim Pro help — Qur'an reading",
      url: "https://support.muslimpro.com/hc/en-us/articles/29167995711769-Quran-Read",
    },
    { label: "Muslim Pro — AiDeen", url: "https://www.muslimpro.com/app/askaideen" },
    { label: "Islam360 — official website", url: "https://www.theislam360.com/" },
    { label: "Islam360 — features", url: "https://www.theislam360.com/features" },
    { label: "Islam360 — learn Qur'an", url: "https://www.theislam360.com/learn-quran" },
    {
      label: "Islam360 — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.islam360",
    },
    {
      label: "Islam360 — App Store",
      url: "https://apps.apple.com/us/app/islam360-quran-hadith-qibla/id1006098149",
    },
    { label: "Tarteel — official website", url: "https://tarteel.ai" },
    {
      label: "Tarteel help — Can I use Tarteel for free?",
      url: "https://support.tarteel.ai/en/articles/12267535-can-i-use-tarteel-for-free",
    },
    { label: "Tarteel — App Store", url: "https://apps.apple.com/us/app/id1391009396" },
    {
      label: "Tarteel — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.mmmoussa.iqra",
    },
  ],
  faqs: [
    {
      question: "Which Islamic app has no ads?",
      answer:
        "Munib Tracker, the Quran.com app, Pillars and Tarteel show no ads. Of these, Munib Tracker and the Quran.com app also have no in-app purchases, while Pillars and Tarteel sell a Premium tier. Athan, Muslim Pro and Islam360 show ads in their free versions.",
    },
    {
      question: "Which Islamic apps are completely free, with no subscription?",
      answer:
        "Munib Tracker and the Quran.com app are free with no subscription and no in-app purchases. Munib Tracker covers Salah, Qaza, zikr, the Qur'an, hadith and learning; the Quran.com app is a Qur'an reader. The other five apps in this comparison are free to download and sell a paid tier.",
    },
    {
      question: "Is Muslim Pro free?",
      answer:
        "Yes, Muslim Pro is free to download and use with ads. It also sells a Premium subscription, listed at $12.99 a month or $34.99 a year in the US, and some features such as the offline Qur'an need Premium. See [Munib Tracker vs Muslim Pro](/compare/munib-tracker-vs-muslim-pro) for the full comparison.",
    },
    {
      question: "Is there a free Islamic app that works without an account?",
      answer:
        "Yes. Munib Tracker works in guest mode with no account, and sign-in is optional if you want to sync. Pillars also says it needs no sign-up. We couldn't confirm from official sources whether the other apps here need an account for core use.",
    },
    {
      question: "Which free Islamic apps are open source?",
      answer:
        "The Quran.com apps are open source: their code is on GitHub, and the Android app is under the GPL-3.0 licence. Munib Tracker's [source code is public on GitHub](/open-source) under the PolyForm Noncommercial licence, which lets anyone read it but doesn't allow commercial use. We couldn't confirm public source code for the other apps.",
    },
  ],
  related: [
    "/compare/best-salah-tracker-apps",
    "/compare/islamic-habit-tracker-apps",
    "/why-munib-tracker",
    "/open-source",
    "/download",
  ],
};
