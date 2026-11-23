import type { Article } from "@/content/types";

export const article: Article = {
  slug: "what-is-qaza-salah",
  category: "salah",
  title: "What Is Qaza Salah? Making Up a Missed Prayer",
  seoTitle: "What Is Qaza Salah? How Missed Prayers Are Made Up",
  seoDescription:
    "What Qaza Salah means, the hadith on praying a missed Salah when you remember it, how it is performed, and where the schools of law differ on the details.",
  description:
    "A clear explanation of Qaza Salah: what it is, the evidence for it, how it is generally prayed, and the main differences of opinion, presented neutrally.",
  keywords: [
    "what is qaza salah",
    "qaza namaz meaning",
    "how to pray qaza salah",
    "qada prayer",
    "making up missed prayers in islam",
  ],
  cluster: "qaza",
  published: "2026-11-23",
  updated: "2026-11-23",
  takeaways: [
    "Qaza Salah is an obligatory Salah prayed after its time has passed, to make up for one that was missed.",
    "The Prophet ﷺ taught that a prayer missed through sleep or forgetfulness should be prayed when it is remembered.",
    "A Qaza prayer has the same number of rakahs as the fard it replaces, with an intention for that specific prayer.",
    "The schools differ on keeping the order of missed prayers, on Witr, and on prayers that were left deliberately.",
    "For your own situation, especially a large backlog, ask a qualified scholar you trust.",
  ],
  body: [
    {
      type: "p",
      text: "Qaza (also spelled qada or qadha) Salah means praying an obligatory Salah after its time has ended, to make up for a prayer that was missed. If you slept through Fajr and prayed it after sunrise, that prayer was a Qaza.",
    },
    {
      type: "p",
      text: "This guide explains what Qaza Salah is, the evidence behind it, how it is generally performed, and the questions on which scholars differ. It does not give rulings. Where the schools of law disagree, the main positions are described so you know what to ask a scholar about.",
    },
    { type: "h2", text: "What Qaza Salah means" },
    {
      type: "p",
      text: 'Scholars distinguish between two ways an act of worship can be performed. A Salah prayed within its time is called **ada\'**, performing it on time. A Salah prayed after its time has passed is a make-up, and the Arabic term for that is where the word "Qaza" comes from.',
    },
    {
      type: "p",
      text: "The obligation to make up applies first of all to the five fard prayers: Fajr, Dhuhr, Asr, Maghrib and Isha. Witr is discussed separately below because the schools classify it differently. Making up missed Sunnah prayers is not an obligation, although some scholars recommend it for certain Sunnah prayers.",
    },
    { type: "h2", text: "The evidence: pray it when you remember it" },
    {
      type: "p",
      text: "The clearest evidence for making up a missed Salah is a hadith narrated by Anas ibn Malik, recorded by both al-Bukhari and Muslim.",
    },
    {
      type: "evidence",
      kind: "hadith",
      arabic: "مَنْ نَسِيَ صَلاَةً فَلْيُصَلِّ إِذَا ذَكَرَهَا، لاَ كَفَّارَةَ لَهَا إِلاَّ ذَلِكَ",
      translation:
        'The Prophet (ﷺ) said, "If anyone forgets a prayer he should pray that prayer when he remembers it. There is no expiation except to pray the same."',
      reference: "Sahih al-Bukhari 597",
      href: "https://sunnah.com/bukhari:597",
      note: "Narrated by Anas. Translation as published on Sunnah.com.",
    },
    {
      type: "evidence",
      kind: "hadith",
      arabic: "مَنْ نَسِيَ صَلاَةً أَوْ نَامَ عَنْهَا فَكَفَّارَتُهَا أَنْ يُصَلِّيَهَا إِذَا ذَكَرَهَا",
      translation:
        "He who forgets the prayer, or he slept (and it was omitted), its expiation is (only) that he should observe it when he remembers it.",
      reference: "Sahih Muslim 684",
      href: "https://sunnah.com/muslim:684c",
      note: "Narrated by Anas ibn Malik. Translation as published on Sunnah.com.",
    },
    {
      type: "p",
      text: "Both collections connect this teaching to a verse of Surah Ta-Ha. In one of Muslim's narrations, the Prophet Muhammad ﷺ gives it as the reason, saying that Allah has said to establish prayer for His remembrance. The verse reads:",
    },
    {
      type: "evidence",
      kind: "quran",
      arabic: "إِنَّنِيٓ أَنَا ٱللَّهُ لَآ إِلَٰهَ إِلَّآ أَنَا۠ فَٱعۡبُدۡنِي وَأَقِمِ ٱلصَّلَوٰةَ لِذِكۡرِيٓ",
      translation:
        "Indeed, I am Allāh. There is no deity except Me, so worship Me and establish prayer for My remembrance.",
      reference: "Qur'an 20:14",
      href: "https://quran.com/20/14",
      note: "Translation: Saheeh International",
    },
    {
      type: "p",
      text: "These narrations speak about someone who slept through a prayer or forgot it. The obligation does not disappear when the time passes. It is fulfilled by praying the Salah once the person remembers or wakes.",
    },
    { type: "h2", text: "How Qaza Salah is generally performed" },
    {
      type: "p",
      text: "A Qaza prayer is prayed like the original fard, with Wudu, facing the qiblah, and the usual conditions of Salah. In outline:",
    },
    {
      type: "steps",
      items: [
        {
          title: "Make the intention",
          text: "Intend in your heart the specific prayer you are making up, for example the Asr you missed today. For a large backlog where exact dates are unknown, some scholars advise intending, for example, the earliest Fajr you still owe.",
        },
        {
          title: "Pray the same number of rakahs",
          text: "A missed Fajr is made up as two rakahs, a missed Maghrib as three, and so on. A Qaza prayer is not longer or shorter than the fard it replaces.",
        },
        {
          title: "Do not delay without need",
          text: "The hadith ties the make-up to remembering, so it is prayed as soon as reasonably possible rather than put off indefinitely. For a single missed prayer, that usually means the same day.",
        },
      ],
    },
    {
      type: "table",
      caption: "Fard rakahs to make up for each prayer",
      head: ["Salah", "Fard rakahs"],
      rows: [
        ["Fajr", "2"],
        ["Dhuhr", "4"],
        ["Asr", "4"],
        ["Maghrib", "3"],
        ["Isha", "4"],
      ],
    },
    {
      type: "p",
      text: "There is also a difference about timing. The Hanafi school does not allow any Salah, including Qaza, at sunrise, when the sun is at its highest point, and at sunset. The other schools generally allow a missed obligatory Salah to be made up at any time.",
    },
    { type: "h2", text: "Where the schools differ: order and Witr" },
    { type: "h3", text: "Keeping the order (tartib)" },
    {
      type: "p",
      text: "If you have missed more than one prayer, should they be made up in order, and before the current Salah? The Hanafi, Maliki and Hanbali schools treat keeping the order as required in some situations, with exceptions such as forgetting, too little time left for the current Salah, or, in the Hanafi school, having six or more prayers to make up. The Shafi'i school regards keeping the order as recommended rather than required.",
    },
    { type: "h3", text: "Witr" },
    {
      type: "p",
      text: "In the Hanafi school, Witr is wajib (necessary), so a missed Witr is made up and is counted as part of the backlog. The Maliki, Shafi'i and Hanbali schools regard Witr as a strongly emphasised Sunnah rather than an obligation, so it is not part of an obligatory backlog in those schools, although some scholars recommend making it up.",
    },
    { type: "h2", text: "Prayers left deliberately: a difference of opinion" },
    {
      type: "p",
      text: "Everyone agrees that leaving a Salah deliberately is a serious sin that calls for sincere repentance. The question is whether such a prayer can also be made up.",
    },
    {
      type: "ul",
      items: [
        "**The majority position.** The great majority of scholars, including the four Sunni schools of law, hold that deliberately missed prayers must be made up, alongside repentance. One line of reasoning is that if a person who slept or forgot must make up the prayer, a person who left it deliberately has even more reason to.",
        "**A minority position.** A minority, including Ibn Hazm and, as is commonly attributed, Ibn Taymiyyah, held that a prayer deliberately left until its time ended cannot be made up in this way. Instead, the person should repent sincerely, keep the five daily prayers from now on, and increase in voluntary prayers. They point out that the hadith mentions sleep and forgetting specifically.",
      ],
    },
    {
      type: "p",
      text: "Two points are not in dispute. Prayers missed during menstruation or post-natal bleeding are not made up, and a person who has just accepted Islam does not owe prayers from before they became Muslim.",
    },
    {
      type: "note",
      tone: "scholar",
      title: "Ask a scholar about your situation",
      text: "This article describes positions; it does not decide between them. How many prayers you owe, which school you follow, and how to handle order and Witr are best settled with a qualified scholar you trust, especially if your backlog is large.",
    },
    { type: "h2", text: "Getting started with your own Qaza" },
    {
      type: "p",
      text: "If you owe only a few prayers, the simplest step is to make them up today. If you owe months or years of prayers, the task can feel overwhelming, but it becomes manageable with an honest estimate and a steady daily pace, for example one extra make-up prayer with each Salah. Our step-by-step guide on [how to track missed prayers](/resources/salah/how-to-track-missed-prayers) walks through estimating a backlog and choosing a pace.",
    },
    {
      type: "note",
      tone: "app",
      title: "Keeping count",
      text: "Munib Tracker keeps a separate Qaza counter for each prayer, and a daily-pace planner shows an estimated finish date. See the [Qaza Salah tracker](/features/qaza-salah-tracker).",
    },
    {
      type: "p",
      text: "Above all, do not let the size of the number stop you from beginning. Every Qaza prayer you complete is one fewer still owed. Many people find that once they have a clear number and a daily routine, the weight they felt for years becomes something practical they can work through. And while you work through the past, protect the present by praying each new Salah on time. Our guide to [building a consistent Salah habit](/resources/salah/how-to-build-a-consistent-salah-habit) can help with that.",
    },
  ],
  sources: [
    { label: "Sahih al-Bukhari 597 — Sunnah.com", url: "https://sunnah.com/bukhari:597" },
    { label: "Sahih Muslim 684c — Sunnah.com", url: "https://sunnah.com/muslim:684c" },
    { label: "Sahih Muslim 684d — Sunnah.com", url: "https://sunnah.com/muslim:684d" },
    { label: "Qur'an 20:14 (Saheeh International) — Quran.com", url: "https://quran.com/20/14" },
  ],
  faqs: [
    {
      question: "Is Qaza Salah the same as a Nafl prayer?",
      answer:
        "No. A Qaza prayer makes up an obligatory Salah that was missed, so it is prayed with the intention of that obligatory prayer. A Nafl prayer is voluntary and does not replace a missed fard.",
    },
    {
      question: "Can I pray Qaza at any time of day?",
      answer:
        "Most schools allow a missed obligatory Salah to be made up at any time. The Hanafi school excludes sunrise, the moment the sun is at its highest point, and sunset. Follow the guidance of your own school or a scholar you trust.",
    },
    {
      question: "Do I have to make up prayers from before I accepted Islam?",
      answer:
        "No. A person who accepts Islam does not owe prayers from before they became Muslim. The obligation begins once they are Muslim and have reached puberty.",
    },
    {
      question: "Can I make up several missed prayers in one sitting?",
      answer:
        "Yes, you can pray several Qaza prayers one after another. If you have a long backlog, many people find it easier to pair one make-up prayer with each daily Salah.",
    },
  ],
  appTieIn: {
    feature: "qaza-salah-tracker",
    text: "In Munib Tracker, a Salah you log as missed is added to that prayer's Qaza counter, and each make-up you log brings it down, so you always know where you stand.",
  },
  related: [
    "/resources/salah/how-to-track-missed-prayers",
    "/resources/salah/how-to-build-a-consistent-salah-habit",
    "/features/qaza-salah-tracker",
    "/features/salah-tracker",
  ],
};
