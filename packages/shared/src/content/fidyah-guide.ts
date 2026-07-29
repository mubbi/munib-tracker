import type { LearnGuideTopic } from "../types/learn-guide";

/**
 * Learn guide + helper copy for fidyah / kaffarah related to missed or broken
 * Ramadan fasts. Scholar-neutral, mainstream Sunni teaching drawn only from the
 * Qur'an and authentic, checkable hadith (sunnah.com numbering). This is an
 * educational estimate helper — not an auto-ruling or fatwa engine. Madhhab
 * differences are noted via `madhhabNote`. Bump the version when content changes.
 */
export const FIDYAH_GUIDE_CONTENT_VERSION = 1;

export const FIDYAH_GUIDE_SECTION_ORDER = ["overview", "fidyah", "kaffarah", "practice"] as const;

export const FIDYAH_GUIDE_TOPICS: LearnGuideTopic[] = [
  {
    id: "when-fidyah-or-qaza",
    section: "overview",
    title: "Qaza, fidyah, or kaffarah?",
    summary: "Three different remedies — do not mix them up.",
    body: [
      "Missed Ramadan fasts are not all treated the same. Temporary inability — illness you expect to recover from, travel, pregnancy or breastfeeding when fasting would harm, and similar excuses — is made up later by fasting other days (qaza). The Qur'an says: '...and whoever is ill or on a journey — then an equal number of other days' (Qur'an 2:185).",
      "Fidyah (a ransom of feeding the poor) is for those who cannot fast and have no realistic hope of making the days up — classically the elderly or chronically ill for whom fasting is a lasting hardship. The Qur'an mentions feeding a poor person as the ransom for those for whom fasting is too difficult (Qur'an 2:184). That verse is not a license to skip fasting while healthy.",
      "Kaffarah (expiation) is heavier. It applies when a person deliberately breaks a Ramadan fast without a valid excuse in ways the schools treat as requiring expiation — most clearly sexual intercourse during the daytime of Ramadan, as in the well-known narration in Sahih Muslim. Schools differ on whether deliberately eating or drinking also obligates the same kaffarah. This helper estimates amounts only; a qualified local scholar must classify your case.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 184,
        ayahTo: 185,
        label: "Qur'an 2:184–185",
        excerpt:
          "...And upon those who are able [to fast, but with hardship] — a ransom of feeding a poor person... And whoever is ill or on a journey — then an equal number of other days.",
      },
    ],
    actions: [
      "If you can still make the days up by fasting later, plan qaza — not fidyah.",
      "If fasting is permanently impossible, ask a scholar about fidyah for each missed day.",
      "If you broke a fast deliberately, do not rely on an app estimate — ask a scholar which ruling applies.",
    ],
    appLinks: [
      {
        label: "Qaza fasting tracker",
        route: "/qaza/roza",
      },
      {
        label: "Illness & fasting guidance",
        route: "/sick",
      },
    ],
  },
  {
    id: "fidyah-feeding-poor",
    section: "fidyah",
    title: "What is fidyah for missed fasts?",
    summary: "One poor person fed per missed day when qaza is not possible.",
    body: [
      "The Qur'anic ransom for those who cannot fast with lasting hardship is feeding a poor person for each day (Qur'an 2:184). Scholars treat this as the fidya unit: one day of missed fasting corresponds to feeding one needy person (or giving the food equivalent commonly used in your locality).",
      "The exact measure of food (a mudd, a sa', or a local meal) and whether a cash equivalent is accepted vary by school and by the practice of local fatwa councils. Many communities publish a yearly fidya amount based on the cost of feeding one poor person. Enter that local unit in the helper to estimate a total — it is a planning tool, not a binding assessment.",
      "Fidyah does not replace repentance or care for the poor beyond the minimum. Give with sincerity, and if your ability to fast returns later, ask a scholar whether any further qaza is due in your situation.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 184,
        label: "Qur'an 2:184",
        excerpt:
          "...And upon those who are able [to fast, but with hardship] — a ransom of feeding a poor person. And whoever volunteers good — it is better for him. And to fast is better for you, if you only knew.",
      },
    ],
    madhhabNote:
      "Hanafi practice often allows a wheat/flour or cash fidya calibrated to local poor-feeding costs. Shafi'i, Maliki, and Hanbali schools discuss mudd/sa' measures of staple food and differ on cash substitutions. Follow a trusted local scholar or masjid fidya rate for your region.",
    actions: [
      "Confirm with a scholar that your case is fidyah (not qaza-only).",
      "Use your local masjid or council's fidya rate per day when available.",
      "Multiply days × one meal (or published fidya unit) for a planning estimate.",
    ],
  },
  {
    id: "who-pays-fidyah",
    section: "fidyah",
    title: "Who typically pays fidyah?",
    summary: "Permanent inability — not every missed fast.",
    body: [
      "The classical cases for fidyah instead of later fasting are those who cannot fast and cannot reasonably expect to make the days up — such as advanced age or a chronic illness where fasting would cause lasting harm. Temporary illness that later passes is ordinarily made up by fasting other days (Qur'an 2:185).",
      "Pregnancy and breastfeeding are treated carefully by the schools: some require only qaza; others discuss fidyah in addition when fasting would harm mother or child. Do not decide from a calculator alone.",
      "If someone dies with missed Ramadan fasts still owed, heirs may fast on their behalf or feed the poor according to authentic reports and scholarly detail (see Bukhari 1952 on fasting on behalf of the deceased). Ask a scholar for your family's case.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 185,
        label: "Qur'an 2:185",
        excerpt:
          "...So whoever sights [the new moon of] the month, let him fast it; and whoever is ill or on a journey — then an equal number of other days. Allah intends for you ease and does not intend for you hardship...",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1952",
        grade: "sahih",
        excerpt:
          "A man said: My mother died owing fasting. Should I fast on her behalf? The Prophet ﷺ said: Yes — the debt of Allah has more right to be paid.",
      },
    ],
    disclaimer:
      "Classification of pregnancy, breastfeeding, and chronic illness is a scholarly judgment. This topic is educational only.",
  },
  {
    id: "kaffarah-ramadan",
    section: "kaffarah",
    title: "Kaffarah for deliberately breaking the fast",
    summary: "Freeing a slave, or sixty consecutive fasts, or feeding sixty poor.",
    body: [
      "Abu Hurayrah reported that a man came to the Prophet ﷺ and said he was ruined because he had had intercourse with his wife in Ramadan while fasting. The Prophet ﷺ asked whether he could free a slave; then whether he could fast two consecutive months; then whether he could feed sixty poor people — and helped him when he could not (Sahih Muslim 1111; also Bukhari 1936).",
      "This graded expiation is the textual foundation for kaffarah of intercourse during a Ramadan fast day. The order in the narration is: emancipation, then sixty consecutive days of fasting, then feeding sixty poor people. Inability at each step moves a person to the next option according to the schools' reading of the report.",
      "Whether deliberately eating or drinking without excuse also obligates this same kaffarah is a well-known point of difference among the madhhabs. The helper's 'kaffarah' estimate models feeding sixty poor people (or sixty days of fasting) per incident unit — only after a scholar has told you that kaffarah applies.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "1111",
        grade: "sahih",
        excerpt:
          "A man said: I am ruined, O Messenger of Allah — I had intercourse with my wife in Ramadan. He was asked about freeing a slave, fasting two months consecutively, and feeding sixty poor persons...",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "1936",
        grade: "sahih",
        excerpt:
          "While we were sitting with the Prophet ﷺ a man came and said: I am ruined... He had intercourse with his wife while he was fasting...",
      },
    ],
    madhhabNote:
      "The Hanafi school generally extends kaffarah to deliberate eating and drinking in Ramadan as well as intercourse. Many Shafi'i, Maliki, and Hanbali treatments keep the full sixty-day / sixty-poor kaffarah clearest for intercourse, with other deliberate violations treated differently. Confirm your school's ruling before using any estimate.",
    actions: [
      "Repent sincerely and stop the sinful act immediately.",
      "Ask a qualified scholar which expiation — if any — you owe.",
      "If feeding sixty poor is the option you can fulfill, use a local meal cost × 60 as a planning figure.",
    ],
  },
  {
    id: "using-the-helper",
    section: "practice",
    title: "How to use this helper",
    summary: "Estimates only — enter local meal or fidya rates.",
    body: [
      "The fidyah estimate multiplies the number of days by the cost of feeding one poor person (or your published local fidya unit). The kaffarah estimate multiplies by sixty meals per incident unit, reflecting the feeding option in Sahih Muslim 1111 — or shows sixty consecutive fast days if that option is chosen instead.",
      "Enter amounts in your own currency. Prefer the fidya rate announced by a reliable local masjid, Islamic center, or scholarly council for the current year. If none is published, a realistic cost of a basic nourishing meal for one needy person is a common planning proxy — still subject to scholarly confirmation.",
      "Never treat the on-screen total as a fatwa. If you are unsure whether you owe qaza, fidyah, kaffarah, or nothing beyond repentance, pause the calculator and ask a scholar who knows your circumstances.",
    ],
    actions: [
      "Look up this year's local fidya rate before estimating.",
      "Keep a note of days and amounts for your own records.",
      "Give through a trustworthy channel that reaches the poor.",
    ],
    appLinks: [
      { label: "Zakat calculator", route: "/zakat" },
      { label: "Sadaqah goals", route: "/sadaqah" },
    ],
    disclaimer:
      "Munib Tracker provides educational estimates only. It does not issue Islamic legal rulings.",
  },
];
