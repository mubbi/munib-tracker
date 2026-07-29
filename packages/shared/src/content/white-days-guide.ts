import type { LearnGuideTopic } from "../types/learn-guide";

/**
 * Learn guide: Ayyām al-Bīḍ (the White Days) — fasting the 13th, 14th and 15th
 * of each Hijri month. Scholar-neutral, mainstream Sunni teaching drawn only
 * from the Qur'an and authentic, checkable hadith (sunnah.com numbering).
 *
 * Citations verified against sunnah.com:
 *   - Sunan an-Nasa'i 2422 (Jarir) — three days a month = a lifetime; the White
 *     Days are the 13th, 14th, 15th.
 *   - Sunan Abi Dawud 2449 (Ibn Milhan) — command to fast the white nights.
 *   - Jami' at-Tirmidhi 761 (Abu Dharr) — fast the 13th, 14th, 15th.
 *   - Sahih al-Bukhari 1975 / 1979 (Abdullah ibn 'Amr) — three days = the whole
 *     year, the reward of a good deed multiplied tenfold.
 *   - Sahih Muslim 1162e (Abu Qatadah) — fasting Monday.
 *   - Qur'an 2:183 (fasting prescribed) and 6:160 (tenfold reward).
 *
 * Deliberately excludes fixed printed "White Days" calendars and folk claims:
 * the actual dates shift with the moon and local sighting, so the app resolves
 * them from its Hijri engine rather than a hard-coded table. Bump the version
 * when content changes so any cache/test notices.
 */
export const WHITE_DAYS_GUIDE_CONTENT_VERSION = 1;

export const WHITE_DAYS_GUIDE_SECTION_ORDER = [
  "what",
  "virtue",
  "practice",
  "related",
  "track",
] as const;

export const WHITE_DAYS_GUIDE_TOPICS: LearnGuideTopic[] = [
  {
    id: "what-are-the-white-days",
    section: "what",
    title: "What are the White Days?",
    summary: "The 13th, 14th and 15th of every Hijri month — the bright, moonlit nights.",
    body: [
      "Ayyām al-Bīḍ, 'the White Days', are the 13th, 14th and 15th of every Islamic (Hijri) month. They are called 'white' because their nights are bright: the moon is full or near-full and stays lit for most of the night, so the nights themselves appear white with moonlight.",
      "Fasting three days of each month is an emphasised sunnah of the Prophet ﷺ, and the White Days are the recommended three. Jarir ibn Abdullah reported that the Prophet ﷺ said: 'Fasting three days of each month is fasting for a lifetime, and the White Days (Ayyām al-Bīḍ) are the thirteenth, fourteenth and fifteenth' (Sunan an-Nasa'i 2422).",
      "Because the Hijri month follows the moon, these three days move through the Gregorian calendar each month and can start a day earlier or later depending on when the new moon was sighted in your region. This app works them out from its own Hijri calendar, so you always know which dates they fall on.",
    ],
    hadith: [
      {
        collection: "Sunan an-Nasa'i",
        citation: "2422",
        grade: "sahih",
        excerpt:
          "Fasting three days of each month is fasting for a lifetime, and the White Days (Ayyām al-Bīḍ) are the thirteenth, fourteenth and fifteenth.",
      },
    ],
    actions: [
      "Open the moon phase view to see when this month's White Days fall.",
      "Note the three dates so you can plan suhoor and iftar around them.",
    ],
    disclaimer:
      "The exact dates depend on the Hijri month, which varies by moon sighting from region to region. Follow the reliable local sighting or calendar of your community; the app's dates are a guide, not a fatwa.",
  },
  {
    id: "virtue-three-days",
    section: "virtue",
    title: "Like fasting a lifetime",
    summary: "Three days each month carries the reward of fasting the whole year.",
    body: [
      "The Prophet ﷺ explained the reward with the Qur'anic principle that Allah multiplies a good deed tenfold: 'Whoever comes with a good deed will have ten times the like thereof' (Qur'an 6:160). Fasting three days a month is therefore counted as if you fasted thirty days — a full month — and across the year that is the reward of fasting every day.",
      "Abdullah ibn 'Amr reported that the Prophet ﷺ said to him: 'It is sufficient for you to fast three days in a month, for the reward of a good deed is multiplied ten times, so it will be like fasting the whole year' (Sahih al-Bukhari 1975). In another wording: 'Fasting three days a month is equal to fasting the whole year' (Sahih al-Bukhari 1979).",
      "This is why three modest days, kept consistently, are so beloved: they are light on the body yet, by Allah's generosity, weighed as a lifetime of fasting. The White Days are simply the sunnah's chosen three.",
    ],
    quran: [
      {
        surah: 6,
        ayahFrom: 160,
        label: "Qur'an 6:160",
        excerpt:
          "Whoever comes with a good deed will have ten times the like thereof, and whoever comes with an evil deed will not be recompensed except the like thereof; and they will not be wronged.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1975",
        grade: "sahih",
        excerpt:
          "It is sufficient for you to fast three days in a month, as the reward of a good deed is multiplied ten times, so it will be like fasting throughout the year.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "1979",
        grade: "sahih",
        excerpt:
          "The fasting of three days (a month) will be equal to the fasting of the whole year.",
      },
    ],
    actions: [
      "Renew your intention the night before — for Allah's sake, seeking His reward.",
      "Aim for consistency: three modest days every month rather than bursts you cannot sustain.",
    ],
  },
  {
    id: "how-to-observe",
    section: "practice",
    title: "How to fast the White Days",
    summary: "Intention, the same fast as any voluntary day, on the 13th, 14th and 15th.",
    body: [
      "The White Days are fasted exactly like any other day: abstaining from food, drink and marital relations from the true dawn (Fajr) until sunset (Maghrib), with the intention of a voluntary fast. There is no special dua or ritual unique to them — the intention to fast for Allah is enough.",
      "The Messenger of Allah ﷺ used to command fasting them by name. Ibn Milhan al-Qaysi reported from his father: 'The Messenger of Allah ﷺ used to command us to fast the White Days: the thirteenth, fourteenth and fifteenth of the month,' and he said, 'This is like fasting perpetually' (Sunan Abi Dawud 2449). Abu Dharr reported that the Prophet ﷺ told him: 'When you wish to fast three days in a month, then fast the thirteenth, fourteenth and fifteenth' (Jami' at-Tirmidhi 761).",
      "If you cannot fast all three — because of travel, illness, or a day you began without intending to fast — fast what you can; even one or two of them still earns the multiplied reward. A voluntary fast may be begun with the intention taken during the morning, as long as you have not eaten. And a woman does not fast during her menses; she simply resumes the sunnah in the months she is able, with no make-up required for voluntary fasts missed for that reason.",
    ],
    hadith: [
      {
        collection: "Sunan Abi Dawud",
        citation: "2449",
        grade: "sahih",
        excerpt:
          "The Messenger of Allah ﷺ used to command us to fast the White Days: the thirteenth, fourteenth and fifteenth of the month. He said: This is like fasting perpetually.",
      },
      {
        collection: "Jami' at-Tirmidhi",
        citation: "761",
        grade: "hasan",
        excerpt:
          "When you wish to fast three days in a month, then fast the thirteenth, fourteenth and fifteenth.",
      },
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 183,
        label: "Qur'an 2:183",
        excerpt:
          "O you who have believed, fasting is prescribed for you as it was prescribed for those before you, that you may become righteous.",
      },
    ],
    actions: [
      "Make the intention to fast the White Days for Allah, seeking His reward.",
      "Fast what you can — one or two days still carry the tenfold reward if all three are not possible.",
      "Set a suhoor reminder so you wake in time on the 13th, 14th and 15th.",
    ],
    disclaimer:
      "Rules for combining a voluntary fast with a make-up (qaza) fast, and whether one intention suffices, are detailed fiqh questions that differ by school. This is educational content, not a fatwa.",
  },
  {
    id: "part-of-monthly-sunnah",
    section: "related",
    title: "Part of the wider sunnah of fasting",
    summary: "The White Days sit alongside Mondays, Thursdays and other beloved fasts.",
    body: [
      "The White Days are one way the Prophet ﷺ kept his monthly three-day fast, but they are not the only recommended voluntary fasting. He ﷺ also frequently fasted Mondays and Thursdays. When asked about fasting on Monday, he said: 'On it I was born, and on it revelation was sent down to me' (Sahih Muslim 1162e).",
      "Some people prefer to keep their three monthly days on Mondays and Thursdays instead of the 13th–15th, and that also fulfils the sunnah of three days a month. Others combine both when they can. The goal is a steady, sincere habit of voluntary fasting rather than a rigid formula.",
      "Choose the pattern you can sustain. If the White Days suit your month, track them here; if Mondays and Thursdays are easier, keep those. What Allah loves most is the deed done consistently, even if small.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "1162e",
        grade: "sahih",
        excerpt:
          "The Messenger of Allah ﷺ was asked about fasting on Monday. He said: On it I was born, and on it revelation was sent down to me.",
      },
    ],
    actions: [
      "Pick a sustainable pattern: the White Days, or Mondays and Thursdays, or both.",
      "Keep it consistent — a small deed done regularly is beloved to Allah.",
    ],
  },
  {
    id: "track-white-days",
    section: "track",
    title: "Track the White Days in Munib",
    summary: "A monthly reminder on the home screen and a simple three-day checklist.",
    body: [
      "Munib works out each Hijri month's White Days from its own moon calendar. On the 13th, 14th and 15th you will see a gentle reminder in Today's Goal on the home screen, the same way Friday and Jumu'ah are highlighted.",
      "Open the tracker on any of the three days to mark the White Day fast as done. Your checklist is scoped to the current Hijri month, so each month starts fresh and your progress syncs across your devices when you are signed in.",
      "Use the reminder as a nudge, not a burden — intend the fast for Allah, and let the tracker help you keep the sunnah alive month after month.",
    ],
    actions: [
      "Mark the 13th, 14th and 15th in the tracker as you fast them.",
      "Let the home reminder keep the sunnah on your radar each month.",
    ],
    appLinks: [
      { label: "Open Tracker", route: "/(tabs)/tracker" },
      { label: "View moon phases", route: "/calendar" },
    ],
  },
];
