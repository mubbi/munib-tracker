import type { ComparePage } from "@/content/types";
import { devicesGroup, NOT_ON_APP_STORE } from "./devices";
import { cell, MUNIB_CELLS as M, MUNIB, MUNIB_NF as P } from "./shared";

const TA = "tarteel";
const QC = "quran-com";
const MQ = "memorize-quran";
const HA = "haafidh";

export const bestQuranMemorizationApps: ComparePage = {
  slug: "best-quran-memorization-apps",
  kind: "roundup",
  title: "Qur'an memorization apps compared: hifz, revision and recitation practice",
  seoTitle: "Best Qur'an Memorization Apps (2026): Hifz & Revision Compared",
  seoDescription:
    "A sourced comparison of Qur'an memorization apps: Munib Tracker, Tarteel, Quran by Quran.com, Memorize Quran and Haafidh. Price, ads, features.",
  description:
    "Five apps for memorizing and revising the Qur'an side by side: recitation listening, hide modes, spaced revision, reciters, price and ads.",
  keywords: [
    "best quran memorization apps",
    "hifz app",
    "quran revision app",
    "app to memorize quran",
    "quran memorization app comparison",
  ],
  cluster: "comparison",
  published: "2026-11-27",
  updated: "2026-11-27",
  eyebrow: "Roundup",
  intro: [
    "Apps help with memorizing the Qur'an (hifz) in different ways. Some listen while you recite and point out mistakes. Some repeat a reciter until the ayah stays with you. Others hide the text so you can test yourself, or keep a schedule so that what you have memorized comes back for revision before it fades.",
    "We compared five apps using each one's App Store and Google Play listings and its official website. Munib Tracker is our app, so we've kept the table factual and said plainly where another app is stronger. Where we couldn't confirm a feature from an official source, we say \"not verified\" rather than guess. No app replaces reciting to a qualified teacher.",
  ],
  apps: [
    MUNIB,
    { id: TA, name: "Tarteel", developer: "Tarteel Inc.", url: "https://tarteel.ai" },
    {
      id: QC,
      name: "Quran by Quran.com",
      developer: "Quran Foundation, Inc",
      url: "https://apps.apple.com/us/app/id1118663303",
    },
    {
      id: MQ,
      name: "Memorize Quran",
      developer: "Shoaib Khan",
      url: "https://apps.apple.com/us/app/memorize-quran/id1326501581",
    },
    {
      id: HA,
      name: "Haafidh",
      developer: "Vaan Corporation",
      url: "https://apps.apple.com/us/app/haafidh/id1571078630",
    },
  ],
  verifiedOn: "2026-11-27",
  summary: [
    {
      title: "For the most detailed mistake detection",
      text: "Tarteel. Mistake detection is its core product: its Premium plan flags missed, wrong and extra words and tashkeel errors as you recite.",
    },
    {
      title: "For free practice that stays on your device",
      text: "Munib Tracker follows your recitation on the device and marks words to try again, with hide modes and spaced revision. It's simpler than Tarteel, gives no scores and does not grade tajweed.",
    },
    {
      title: "For a free, ad-free mushaf with audio repeat",
      text: "Quran by Quran.com is a free reading app with no ads, over 15 recitations and customizable audio repeat for memorizing by listening.",
    },
    {
      title: "For a revision schedule only",
      text: "Haafidh tracks the passages you've memorized and reminds you to revise them at spaced intervals. It's free with no ads, and is meant to sit beside your mushaf or another app.",
    },
    {
      title: "For repetition-led memorizing",
      text: "Memorize Quran automates repetition with its IntelliJ Mode (subscription after a 15-day trial).",
    },
  ],
  table: [
    {
      group: "Recitation and feedback",
      rows: [
        {
          feature: "Listens to your recitation (microphone)",
          cells: {
            munib: M.recitation,
            [TA]: cell.yes("Free"),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified("Listing describes a revision tracker"),
          },
        },
        {
          feature: "Mistake detection",
          cells: {
            munib: M.mistakeMarks,
            [TA]: cell.yes("Premium: missed, wrong, extra words and tashkeel errors"),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified(),
          },
        },
        {
          feature: "Word-by-word pronunciation feedback",
          cells: {
            munib: P.pronunciation,
            [TA]: cell.partial("Tashkeel errors in Premium mistake detection"),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified(),
          },
        },
        {
          feature: "Tajweed feedback on your recitation",
          cells: {
            munib: P.tajweedCoaching,
            [TA]: cell.no('"Does not detect Tajweed mistakes yet"'),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified(),
          },
        },
        {
          feature: "Where voice is processed",
          cells: {
            munib: cell.text("On your device; never recorded or uploaded"),
            [TA]: cell.text(
              "Needs a stable internet connection; App Store label lists audio data collected",
            ),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified(),
          },
        },
      ],
    },
    {
      group: "Memorization and revision",
      rows: [
        {
          feature: "Hide words or ayahs to test yourself",
          cells: {
            munib: cell.yes("Free"),
            [TA]: cell.yes("Premium"),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified(),
          },
        },
        {
          feature: "Spaced revision",
          cells: {
            munib: M.memorization,
            [TA]: cell.partial("Goal planning and history, Premium"),
            [QC]: cell.unverified(),
            [MQ]: cell.partial("Revision dashboard; schedule not described"),
            [HA]: cell.yes("Reminders at spaced intervals, with a revision schedule"),
          },
        },
        {
          feature: "Hifz progress tracking",
          cells: {
            munib: cell.yes("A hifz tracker for ayahs you've memorized or need to review"),
            [TA]: cell.yes("Goal planning and history, Premium"),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.yes("Progress timeline"),
          },
        },
        {
          feature: "Reciters and audio repeat",
          cells: {
            munib: cell.yes("Several, with offline downloads"),
            [TA]: cell.yes("16 recitations, offline downloads"),
            [QC]: cell.yes("Over 15 recitations, customizable audio repeat"),
            [MQ]: cell.yes("Over 20 reciters (Premium audio), auto-repetition"),
            [HA]: cell.partial("One reciter; a passage repeats 7 times"),
          },
        },
        {
          feature: "Tajweed colours in the text",
          cells: {
            munib: M.tajweedColours,
            [TA]: cell.yes(),
            [QC]: cell.yes("Tajweed mushaf edition (App Store listing)"),
            [MQ]: cell.yes("Colour-coded Tajweed mushaf"),
            [HA]: cell.unverified(),
          },
        },
        {
          feature: "Learn to read (letters, tajweed lessons)",
          cells: {
            munib: M.quranLearning,
            [TA]: cell.unverified("No tajweed lessons or Qaida found"),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified(),
          },
        },
        {
          feature: "Kids mode",
          cells: {
            munib: P.family,
            [TA]: cell.unverified(),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified(),
          },
        },
      ],
    },
    {
      group: "Price, ads and account",
      rows: [
        {
          feature: "Price",
          cells: {
            munib: M.price,
            [TA]: cell.text(
              "Free core; Premium subscription (US App Store lists from $12.99/month)",
            ),
            [QC]: cell.text("Free; no in-app purchases listed"),
            [MQ]: cell.text(
              "15-day free trial, then a subscription (US App Store: $1.99/month to $49.99 lifetime)",
            ),
            [HA]: cell.text("Free; optional support purchases"),
          },
        },
        {
          feature: "What needs payment",
          cells: {
            munib: cell.text("No subscription and no paywall on mistake marks"),
            [TA]: cell.text("Mistake detection, hidden verses, goal planning and history"),
            [QC]: cell.text("Nothing listed"),
            [MQ]: cell.text(
              "Features need a subscription after the trial; the mushaf, Qibla and prayer times are listed as free",
            ),
            [HA]: cell.text("Nothing; purchases are optional support"),
          },
        },
        {
          feature: "Ads",
          cells: {
            munib: M.ads,
            [TA]: cell.text("No ads"),
            [QC]: cell.text("No ads"),
            [MQ]: cell.unverified(),
            [HA]: cell.text("No ads"),
          },
        },
        {
          feature: "Account",
          cells: {
            munib: M.account,
            [TA]: cell.unverified(),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified(),
          },
        },
        {
          feature: "Works offline",
          cells: {
            munib: cell.yes("After a one-time download"),
            [TA]: cell.unverified("Voice features need internet"),
            [QC]: cell.unverified("Listing mentions downloaded audio, translations and pages"),
            [MQ]: cell.unverified("Listing mentions downloads"),
            [HA]: cell.unverified(),
          },
        },
        {
          feature: 'App Store "Data Used to Track You"',
          cells: {
            munib: cell.text("No ad SDKs"),
            [TA]: cell.unverified(),
            [QC]: cell.text("None declared"),
            [MQ]: cell.text("None declared"),
            [HA]: cell.text("None declared"),
          },
        },
      ],
    },
    devicesGroup({
      [TA]: {
        ios: cell.yes("iPhone and iPad"),
        android: cell.yes(),
        appleWatch: NOT_ON_APP_STORE,
        appleTv: NOT_ON_APP_STORE,
      },
      [QC]: {
        ios: cell.yes("iPhone and iPad"),
        android: cell.yes("Quran for Android"),
        appleWatch: NOT_ON_APP_STORE,
        appleTv: NOT_ON_APP_STORE,
      },
      [MQ]: {
        ios: cell.yes("iPhone and iPad"),
        appleWatch: NOT_ON_APP_STORE,
        appleTv: NOT_ON_APP_STORE,
      },
      [HA]: {
        ios: cell.yes("iPhone and iPad"),
        appleWatch: NOT_ON_APP_STORE,
        appleTv: NOT_ON_APP_STORE,
      },
    }),
  ],
  strengths: {
    munib: [
      "Recitation practice is free, with hide modes and spaced revision",
      "Voice stays on the device",
      "Part of a full worship tracker: Salah, Qaza, zikr, learning",
      "No ads and no subscription",
    ],
    [TA]: [
      "The most developed AI memorization feedback, including tashkeel errors",
      "Voice search to find any ayah",
      "Very large free Qur'an library: translations, tafsirs, reciters",
    ],
    [QC]: [
      "Free, with no ads and no in-app purchases listed",
      "Over 15 recitations with customizable audio repeat",
      "Translations and tafsir in over 20 languages (Google Play listing)",
    ],
    [MQ]: [
      "IntelliJ Mode builds and repeats verse sets automatically",
      "Over 20 reciters and a colour-coded Tajweed mushaf",
      "Revision dashboard",
    ],
    [HA]: [
      "Revision reminders at spaced intervals",
      "Free, with no ads",
      "Works alongside a printed mushaf or any other app",
    ],
  },
  bestFor: {
    munib:
      "People who want free, private recitation practice and revision inside their daily worship app.",
    [TA]: "Dedicated memorizers who want the most detailed AI feedback and are happy to subscribe.",
    [QC]: "Readers who memorize by listening and want a free, ad-free mushaf.",
    [MQ]: "Learners who memorize by repetition and are willing to subscribe after the trial.",
    [HA]: "People who already memorize elsewhere and only need a revision schedule.",
  },
  body: [
    { type: "h2", text: "How to choose a Qur'an memorization app" },
    {
      type: "ul",
      items: [
        "**Do you want the app to listen?** Tarteel has the most detailed mistake detection. Munib Tracker's [Qur'an practice](/features/quran-practice) is free and simpler: it follows your recitation and marks words to try again.",
        "**Do you learn by ear?** Look for a reciter you like and audio repeat. Most of the apps here have both.",
        "**How will you revise?** New memorization fades without review. A schedule that brings ayahs back matters more than any single feature. See [how to memorize the Qur'an](/resources/quran-learning/how-to-memorize-the-quran).",
        "**What does it cost over a year?** Check which features sit behind a subscription before you build a routine around them.",
        "**Where does your voice go?** If an app listens, check whether it says the audio is processed on the device or needs a connection.",
      ],
    },
    {
      type: "note",
      tone: "info",
      title: "What Munib Tracker's listener does and doesn't do",
      text: "It follows your recitation word by word on your device and marks words to try again, and its pronunciation check marks words that seem skipped or unclear. It does not grade or correct tajweed, gives no scores, misses some mistakes, and does not replace reciting to a qualified teacher. See [how to improve Qur'an recitation](/resources/quran-learning/how-to-improve-quran-recitation).",
    },
    {
      type: "note",
      tone: "info",
      title: "How we checked",
      text: "Every value comes from the app's official website, App Store listing or Google Play listing (US storefronts), checked on the date shown. For Memorize Quran and Haafidh we found no Google Play listing we could confirm as the same app, so their Android cells say not verified. Features change often, so check the listings before you decide.",
    },
  ],
  sources: [
    { label: "Tarteel — official website", url: "https://tarteel.ai" },
    {
      label: "Tarteel help — Can I use Tarteel for free?",
      url: "https://support.tarteel.ai/en/articles/12267535-can-i-use-tarteel-for-free",
    },
    {
      label: "Tarteel help — Tajweed mistakes",
      url: "https://support.tarteel.ai/en/articles/12414457-tarteel-is-not-recognising-my-tajweed-mistakes",
    },
    {
      label: "Tarteel blog — Introducing mistake detection",
      url: "https://tarteel.ai/blog/introducing-mistake-detection/",
    },
    { label: "Tarteel — App Store listing", url: "https://apps.apple.com/us/app/id1391009396" },
    {
      label: "Tarteel — Google Play listing",
      url: "https://play.google.com/store/apps/details?id=com.mmmoussa.iqra",
    },
    {
      label: "Quran by Quran.com — App Store listing",
      url: "https://apps.apple.com/us/app/id1118663303",
    },
    {
      label: "Quran for Android (Quran.com) — Google Play listing",
      url: "https://play.google.com/store/apps/details?id=com.quran.labs.androidquran",
    },
    {
      label: "Memorize Quran — App Store listing",
      url: "https://apps.apple.com/us/app/memorize-quran/id1326501581",
    },
    {
      label: "Haafidh — App Store listing",
      url: "https://apps.apple.com/us/app/haafidh/id1571078630",
    },
  ],
  faqs: [
    {
      question: "What is the best app to memorize the Qur'an?",
      answer:
        "It depends on how you memorize. Tarteel has the most detailed mistake detection, in its paid Premium plan. Munib Tracker offers free recitation practice on your device with hide modes and spaced revision. Quran by Quran.com suits memorizing by listening, and Haafidh is a simple revision scheduler.",
    },
    {
      question: "Is there a free Qur'an memorization app without ads?",
      answer:
        "Yes. Munib Tracker is free with no ads, subscriptions or in-app purchases. Quran by Quran.com is free and ad-free, and Haafidh is free with no ads and optional support purchases. Tarteel has no ads and a free core, with mistake detection in Premium.",
    },
    {
      question: "Which Qur'an app detects mistakes when I recite?",
      answer:
        "Tarteel detects missed, wrong and extra words and tashkeel errors in its Premium plan. Munib Tracker's free listener is simpler: it marks words to try again and words that seem skipped or unclear, without scores. Neither app detects tajweed mistakes.",
    },
    {
      question: "Can an app replace a Qur'an teacher for hifz?",
      answer:
        "No. An app can help you repeat, test yourself and revise between lessons, but it cannot replace reciting to a qualified teacher who hears your tajweed and corrects it. See our page for [Qur'an learners](/for/quran-learners).",
    },
    {
      question: "Which Qur'an memorization app keeps my voice on my device?",
      answer:
        "Munib Tracker processes your voice on your device; it is never recorded, stored or uploaded. Tarteel's voice features need a stable internet connection. The official sources for the other apps in this comparison don't say where recitation audio is handled.",
    },
  ],
  related: [
    "/compare/munib-tracker-vs-tarteel",
    "/features/quran-practice",
    "/resources/quran-learning/how-to-memorize-the-quran",
    "/for/quran-learners",
  ],
};
