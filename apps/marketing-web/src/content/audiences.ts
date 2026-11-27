import { TRANSLATIONS as arAudiences } from "@/content/i18n/ar/audiences";
import { TRANSLATIONS as urAudiences } from "@/content/i18n/ur/audiences";
import { type ContentTranslations, localizeEntries } from "@/content/localized";
import type { AudiencePage } from "@/content/types";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/routing";

export const AUDIENCE_PAGES: readonly AudiencePage[] = [
  {
    slug: "new-muslims",
    navLabel: "New Muslims",
    navHint: "Learn Salah and the basics, step by step",
    title: "A gentle companion for new Muslims",
    seoTitle: "App for New Muslims — Learn Salah, Wudu & the Basics",
    seoDescription:
      "For reverts and new Muslims: a step-by-step new Muslim guide, how to make wudu and pray Salah, the Arabic letters, and a private tracker to build the habit.",
    description:
      "Learn the basics of Islam at your own pace, from wudu and your first Salah to reading Al-Fatihah, privately and for free.",
    keywords: ["app for new muslims", "revert muslim app", "learn how to pray salah app"],
    cluster: "audience",
    published: "2026-11-23",
    updated: "2026-11-23",
    eyebrow: "For new Muslims",
    intro:
      "Becoming Muslim brings a lot to learn at once: how to make wudu, how to pray, what to say, and when. Munib Tracker gives you a calm place to learn it in order, practise privately, and build your Salah one step at a time.",
    hero: { key: "home-light", caption: "Today's Salah times and a simple daily checklist." },
    situation: {
      title: "Starting out",
      paragraphs: [
        "Many new Muslims feel pressure to learn everything in the first week. In reality, people learn Salah gradually, often starting with a few short phrases and building up.",
        "It also helps to have a private space. You can repeat a lesson as often as you need, without anyone watching, and come to the Masjid or your teacher with questions.",
      ],
    },
    gallery: [
      { key: "names", caption: "The 99 Names of Allah, with meanings and audio." },
      {
        key: "zikr",
        device: "android",
        caption: "Adhkar grouped by time of day, on an Android phone.",
      },
    ],
    helps: [
      {
        title: "New Muslim guide",
        text: "18 short topics on the essentials: belief, purification, Salah and daily worship, with sources.",
        href: "/learn",
      },
      {
        title: "Learn how to pray",
        text: "A 24-lesson Salah guide covering each position, what to say, and the phrases with transliteration and meaning.",
        href: "/learn",
      },
      {
        title: "Wudu and purification",
        text: "The taharah guide explains wudu and ghusl step by step, with a checklist.",
        href: "/learn",
      },
      {
        title: "Salah times and reminders",
        text: "Know when each Salah begins and get an optional reminder, so you don't have to memorize a timetable.",
        feature: "prayer-times-qibla",
      },
      {
        title: "A tracker that doesn't judge",
        text: "Log the Salah you pray and watch the habit grow. Nothing is public and there are no red marks.",
        feature: "salah-tracker",
      },
      {
        title: "The Arabic letters",
        text: "Start learning to read the Qur'an from the very first letter, at your own pace.",
        feature: "learn-quran",
      },
    ],
    plan: {
      title: "A simple first month",
      steps: [
        {
          title: "Week 1",
          text: "Read the new Muslim guide's first topics and learn how to make wudu.",
        },
        {
          title: "Week 2",
          text: "Go through the Salah guide and pray along with it, even if you read from the screen.",
        },
        {
          title: "Week 3",
          text: "Turn on reminders for one or two Salah and log them in the tracker.",
        },
        {
          title: "Week 4",
          text: "Start the Arabic letters and memorize Al-Fatihah with the reciter.",
        },
      ],
    },
    limits: [
      "The app is a learning aid, not a teacher or a community. Please connect with your local Masjid or a trusted teacher too.",
      "Guides explain commonly taught practice and note where scholars differ; they don't give personal rulings.",
    ],
    faqs: [
      {
        question: "Is it okay to read from the screen while I'm learning Salah?",
        answer:
          "This is a fiqh question with different views, so ask a scholar you trust. Many teachers suggest learning the words before Salah and reading them during practice sessions, not in the Salah itself.",
      },
      {
        question: "Do I need to create an account?",
        answer: "No. Everything works without an account, and your data stays on your device.",
      },
    ],
    guides: [
      "/resources/salah/how-to-build-a-consistent-salah-habit",
      "/resources/quran-learning/how-to-start-learning-the-quran",
    ],
    cta: {
      title: "Take your first steps at your own pace",
      text: "Download Munib Tracker and open the new Muslim guide. It's free, private and has no ads.",
    },
  },
  {
    slug: "quran-learners",
    navLabel: "Qur'an learners",
    navHint: "Read, recite, memorize and revise",
    title: "For anyone learning, reciting or memorizing the Qur'an",
    seoTitle: "Qur'an Learning App — Read, Recite, Memorize & Revise",
    seoDescription:
      "Learn to read the Qur'an, practise recitation with an on-device listener, memorize with hide modes and spaced revision, and keep a daily khatm plan. Free.",
    description:
      "Everything for your Qur'an journey: learning to read, daily reading plans, recitation practice and memorization revision.",
    keywords: ["quran learning app", "quran memorization app free", "hifz app"],
    cluster: "audience",
    published: "2026-11-23",
    updated: "2026-11-23",
    eyebrow: "For Qur'an learners",
    intro:
      "Whether you're learning the letters, reading a juz a day or revising your hifz, Munib Tracker brings the reader, lessons, recitation practice and revision together in one free app.",
    hero: {
      key: "quran",
      caption: "Continue reading, browse by juz or page, and open your khatm plan.",
    },
    situation: {
      title: "Where learners get stuck",
      paragraphs: [
        "Most Qur'an learning happens between lessons. You may see your teacher once or twice a week; the rest is practice on your own, and that's where mistakes and forgetting creep in.",
        "Memorizers face a second challenge: revision. New portions push out old ones unless there's a system to bring them back.",
      ],
    },
    gallery: [
      { key: "quran", device: "tv", caption: "Pick up where you stopped on the TV." },
      {
        key: "quran",
        device: "ipad",
        caption: "On iPad, the study tools sit beside the surah list.",
      },
    ],
    helps: [
      {
        title: "Learn to read",
        text: "Letters, learn-to-read lessons, tajweed rules and vocabulary, with quizzes.",
        feature: "learn-quran",
      },
      {
        title: "Practise with a listener",
        text: "An on-device listener follows your recitation, marks words to try again, and shows which words are worth listening to again.",
        feature: "quran-practice",
      },
      {
        title: "Memorize and revise",
        text: "Hide words or ayahs to test yourself; ayahs come back for review after 1, 3, 7, 14 and 30 days.",
        feature: "quran-practice",
      },
      {
        title: "Read every day",
        text: "A khatm plan sets a daily target and shows it on your home screen.",
        feature: "quran",
      },
      {
        title: "Understand",
        text: "Word-by-word, 25 translations, tafsir on demand, root-word search and your own ayah notes.",
        feature: "quran",
      },
      {
        title: "Read together",
        text: "Start a group khatm with your class, family or friends, split by juz.",
        feature: "family-and-friends",
      },
    ],
    plan: {
      title: "A sample week",
      steps: [
        {
          title: "Daily",
          text: "Read your khatm target after Fajr and clear today's revision queue.",
        },
        {
          title: "Three times a week",
          text: "Learn a new portion: listen to the reciter, then practise in Follow mode.",
        },
        {
          title: "Weekly",
          text: "Recite the week's portion to your teacher and note the corrections.",
        },
        { title: "Ongoing", text: "Use Hide ayahs on older portions so they stay fresh." },
      ],
    },
    limits: [
      "Feedback is a guide with no scores, and the listener works best for adult voices in a quiet room.",
      "No app replaces reciting to a qualified teacher.",
    ],
    faqs: [
      {
        question: "Is Qur'an practice free?",
        answer: "Yes. All practice modes and revision are free, with no ads or subscription.",
      },
      {
        question: "Can I track my hifz?",
        answer:
          "Yes. Mark ayahs as memorized from the reader, and practise them in the revision queue.",
      },
    ],
    guides: [
      "/resources/quran-learning/how-to-memorize-the-quran",
      "/resources/quran-learning/how-to-improve-quran-recitation",
      "/resources/quran-learning/how-to-practice-quran-reading-every-day",
    ],
    cta: {
      title: "Bring your Qur'an practice together",
      text: "Download Munib Tracker for the reader, lessons, practice and revision in one place.",
    },
  },
  {
    slug: "beginners",
    navLabel: "Returning to Salah",
    navHint: "Rebuild the habit without guilt",
    title: "Coming back to Salah? Start here",
    seoTitle: "Returning to Salah — Rebuild Your Prayer Habit, Step by Step",
    seoDescription:
      "If you've drifted from Salah, rebuild the habit one prayer at a time: gentle tracking, reminders, a Qaza plan for missed prayers, and no guilt.",
    description:
      "Rebuild your Salah habit one prayer at a time, with gentle tracking, reminders and a realistic plan for what you missed.",
    keywords: ["how to start praying again", "returning to salah", "beginner salah tracker"],
    cluster: "audience",
    published: "2026-11-23",
    updated: "2026-11-23",
    eyebrow: "For beginners and returners",
    intro:
      "Maybe you prayed as a child and drifted away, or you've only ever prayed on Fridays and Eid. Coming back can feel overwhelming. Munib Tracker helps you start small, stay consistent, and deal with missed Salah without being crushed by them.",
    hero: {
      key: "tracker",
      caption: "Two of five Salah logged today, and a two-day streak. Every day counts.",
    },
    situation: {
      title: "Why coming back feels hard",
      paragraphs: [
        "When you've missed a lot, it's tempting to think you have to fix everything at once. That usually leads to a strong week and then giving up.",
        "What works better is the opposite: one Salah you never miss, then two, then all five. And a separate, slow plan for the past.",
      ],
    },
    gallery: [
      {
        key: "home",
        device: "android",
        caption: "Today's Salah times and a countdown to the next one, on an Android phone.",
      },
    ],
    helps: [
      {
        title: "Start with one Salah",
        text: "Log just one Salah each day until it's steady, then add another.",
        feature: "salah-tracker",
      },
      {
        title: "Reminders at the right time",
        text: "Turn on a reminder, with or without the Adhan, for the Salah you most often miss.",
        feature: "prayer-times-qibla",
      },
      {
        title: "Refresh how to pray",
        text: "The Salah guide walks through each position and phrase if you've forgotten.",
        href: "/learn",
      },
      {
        title: "A plan for missed Salah",
        text: "Estimate your Qaza and choose a gentle daily pace, separate from your daily Salah.",
        feature: "qaza-salah-tracker",
      },
      {
        title: "Fewer distractions",
        text: "Turn on the Salah focus lock to block distracting apps until you've prayed.",
        feature: "salah-focus-lock",
      },
      {
        title: "A partner on the way",
        text: 'Invite a friend as an accountability partner. You only see each other\'s "done", never the details.',
        feature: "family-and-friends",
      },
      {
        title: "Encouragement, not shame",
        text: "Streaks, levels and gentle wording keep you going. Excused days don't break your streak.",
        feature: "worship-progress",
      },
    ],
    plan: {
      title: "A four-week restart",
      steps: [
        {
          title: "Week 1",
          text: "Pray and log one Salah daily. Choose the easiest one for your schedule.",
        },
        { title: "Week 2", text: "Add a second Salah and turn on its reminder." },
        {
          title: "Week 3",
          text: "Aim for all five, using the delayed status honestly when one slips.",
        },
        { title: "Week 4", text: "Estimate your Qaza and start a gentle make-up pace." },
      ],
    },
    faqs: [
      {
        question: "Will the app make me feel guilty about missed Salah?",
        answer:
          "No. Missed and delayed Salah are recorded honestly, without alarms or red warnings, and the focus is always on the next step.",
      },
      {
        question: "Do I have to make up everything I missed?",
        answer:
          "Scholars discuss this in detail. Read [What is Qaza Salah?](/resources/salah/what-is-qaza-salah) for an overview, and ask a qualified scholar about your situation.",
      },
    ],
    guides: [
      "/resources/salah/how-to-build-a-consistent-salah-habit",
      "/resources/salah/how-to-track-missed-prayers",
      "/resources/islamic-habits/how-to-stay-consistent-with-daily-worship",
    ],
    cta: {
      title: "Your next Salah is a good place to start",
      text: "Download Munib Tracker and log one Salah today. No account, no ads, no pressure.",
    },
  },
  {
    slug: "families",
    navLabel: "Families",
    navHint: "Learn the Qur'an and Salah at home",
    title: "Learning the Qur'an and Salah together at home",
    seoTitle: "Islamic App for Families — Qur'an & Salah Learning at Home",
    seoDescription:
      "Kids mode with child profiles and rewards, Arabic letters and short surahs to learn together, family group khatm, and the Qur'an on the TV. Free, with no ads.",
    description:
      "Kids mode for children learning to pray, lessons to do together, family group khatm, and the Qur'an on the TV.",
    keywords: ["quran learning for kids", "islamic app for families", "teach kids salah"],
    cluster: "audience",
    published: "2026-11-23",
    updated: "2026-11-24",
    eyebrow: "For families",
    intro:
      "Children learn most from what they see at home. Munib Tracker gives your children a simple kids mode for learning to pray, gives you lessons to do together, and keeps your own Salah and Qur'an routine on track as an example.",
    hero: {
      key: "home",
      device: "ipad",
      caption: "Today's Salah times and checklist on a family iPad.",
    },
    situation: {
      title: "What families tell us they need",
      paragraphs: [
        "Most parents want their children to love the Qur'an and Salah, not just memorize them. Short, regular sessions at home, alongside a teacher or Masjid class, are the usual path.",
        "Parents also need something for themselves. It's hard to teach a routine you're struggling to keep.",
      ],
    },
    gallery: [
      { key: "quran", device: "tv", caption: "Qur'an time on the TV, designed for the remote." },
      { key: "names", caption: "Learn the 99 Names of Allah together, with meanings and audio." },
    ],
    helps: [
      {
        title: "Kids mode",
        text: "Create a child profile with a nickname and birth year, link their device with a QR code, and let them tap five big Salah buttons, earn stickers and work towards a reward you set.",
        feature: "family-and-friends",
      },
      {
        title: "Letters together",
        text: "Sit with your child and go through the Arabic letters lessons, with pronunciation, at their pace.",
        feature: "learn-quran",
      },
      {
        title: "Short surahs with a reciter",
        text: "Play a short surah ayah by ayah and repeat it together. Juz' Amma is a common place to start.",
        feature: "quran",
      },
      {
        title: "Learn how to pray",
        text: "Use the Salah guide to show each position and phrase, then pray together.",
        href: "/learn",
      },
      {
        title: "On the big screen",
        text: "Open the Qur'an or the 99 Names on Apple TV or Android TV after Maghrib.",
        feature: "widgets-and-devices",
      },
      {
        title: "A family khatm",
        text: "Share the Qur'an by juz with the whole family, with everyone's progress in one place.",
        feature: "family-and-friends",
      },
      {
        title: "Your own routine",
        text: "Track your Salah, adhkar and khatm so the example your children see is a steady one.",
        feature: "daily-islamic-habits",
      },
    ],
    plan: {
      title: "A simple family routine",
      steps: [
        {
          title: "After Maghrib",
          text: "Ten minutes: one letter lesson or a few ayahs of a short surah, repeated together.",
        },
        {
          title: "At bedtime",
          text: "Recite the before-sleep adhkar together from the Zikr section.",
        },
        { title: "Fridays", text: "Read part of Surah Al-Kahf together on the TV." },
        {
          title: "Weekly",
          text: "Celebrate what was learned, without comparing children with each other.",
        },
      ],
    },
    limits: [
      "Parents see only the five fard Salah statuses in kids mode; there are no leaderboards and no comparison between siblings.",
      "The recitation listener may be less reliable for children's voices, so treat its marks as a rough guide.",
      "It doesn't replace a Qur'an teacher or Masjid class.",
    ],
    faqs: [
      {
        question: "Is there a kids' mode?",
        answer:
          "Yes. A parent creates a child profile with just a nickname and birth year, with no email, and links the child's device with a QR code. Children get a simple view with Salah buttons, a kids Salah path (wudu, the five prayers and how to pray), stories of the prophets and daily duas. See [Family & friends](/features/family-and-friends).",
      },
      {
        question: "Is it safe for children to use?",
        answer:
          "There are no ads and no chat. In kids mode, children only log their own Salah and see beginner lessons and duas from cited sources, and parents see only the five fard statuses.",
      },
    ],
    guides: [
      "/resources/quran-learning/how-to-help-children-learn-the-quran",
      "/resources/quran-learning/how-to-start-learning-the-quran",
    ],
    cta: {
      title: "Make Qur'an time part of family life",
      text: "Download Munib Tracker on your phone and TV, and start with one short surah together tonight.",
    },
  },
];

/** Translated audience pages per locale (see `content/localized.ts`). */
const TRANSLATIONS: ContentTranslations<AudiencePage> = { ar: arAudiences, ur: urAudiences };

/** Audience pages in `locale`, English where a page isn't translated yet. */
export function getAudiencePages(locale: Locale = DEFAULT_LOCALE): readonly AudiencePage[] {
  return localizeEntries(AUDIENCE_PAGES, TRANSLATIONS, locale, (a) => a.slug);
}

export function getAudience(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): AudiencePage | undefined {
  return getAudiencePages(locale).find((a) => a.slug === slug);
}

export function audienceHref(slug: string): string {
  return `/for/${slug}`;
}
