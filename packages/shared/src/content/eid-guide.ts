import type { LearnGuideTopic } from "../types/learn-guide";

/**
 * Learn guide: the two Eids (Eid al-Fitr and Eid al-Adha). Scholar-neutral,
 * mainstream Sunni teaching content drawn only from the Qur'an and authentic,
 * checkable hadith (sunnah.com numbering). Presents the Hanafi (3+3 extra
 * takbir) and Shafi'i (7+5 extra takbir) prayer counts side by side via
 * `madhhabNote` rather than picking a side — see Sunan Abi Dawud 1149/1151 for
 * the 7+5 narration; the Hanafi 3+3 count is a fiqh position without an
 * authentic marfu' hadith of its own, so it is presented as such. Deliberately
 * skips cultural food-tourism content, which has no place in a worship guide.
 * Bump the version when content changes so any cache/test notices.
 */
export const EID_GUIDE_CONTENT_VERSION = 1;

export const EID_GUIDE_SECTION_ORDER = [
  "fitr",
  "adha",
  "prayer",
  "sunnah",
  "zakat-fitr",
  "udhiyah",
] as const;

export const EID_GUIDE_TOPICS: LearnGuideTopic[] = [
  {
    id: "eid-al-fitr",
    section: "fitr",
    title: "Eid al-Fitr — the festival of breaking the fast",
    summary: "The first day of Shawwal, marking the end of Ramadan's fast.",
    body: [
      "Eid al-Fitr falls on the 1st of Shawwal, immediately after Ramadan, and is a day of joy and gratitude for having been enabled to fast and worship through the month. The Qur'an ties the end of the fast directly to remembrance and thanks: '...that you complete the number [of days] and that you glorify Allah for that He has guided you, and that you may be grateful' (Qur'an 2:185).",
      "Fasting on this day is expressly forbidden, not merely discouraged — the Prophet ﷺ named it, alongside Eid al-Adha, as one of the two days on which Muslims are commanded to eat rather than fast (Bukhari 1990). The day begins with Zakat al-Fitr and the Eid prayer, and continues with visiting family, exchanging good wishes, and general festivity within Islamic bounds.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 185,
        label: "Qur'an 2:185",
        excerpt:
          "...that you complete the number [of days] and that you glorify Allah for that He has guided you, and that you may be grateful.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1990",
        grade: "sahih",
        excerpt:
          "These are two days on which the Messenger of Allah ﷺ forbade fasting: the day you break your fast (of Ramadan), and the day on which you eat from your sacrifice.",
      },
    ],
  },
  {
    id: "eid-al-adha",
    section: "adha",
    title: "Eid al-Adha — the festival of sacrifice",
    summary: "The 10th of Dhul-Hijjah, commemorating Ibrahim's sacrifice.",
    body: [
      "Eid al-Adha falls on the 10th of Dhul-Hijjah, the Day of Nahr during Hajj, and commemorates Ibrahim's willingness to sacrifice his son in obedience to Allah, and Allah's mercy in ransoming him with a sacrificial animal instead (Qur'an 37:102–107). It is the greater of the two Eids in many scholars' view, coinciding with the culmination of Hajj for those on pilgrimage.",
      "Like Eid al-Fitr, fasting on this day is forbidden (Bukhari 1990). Its central additional rite is the udhiyah (sacrifice), offered by those who are able, in remembrance of Ibrahim's submission and as an act of worship and charity combined.",
    ],
    quran: [
      {
        surah: 37,
        ayahFrom: 102,
        ayahTo: 107,
        label: "Qur'an 37:102–107",
        excerpt:
          "So when he had reached the age to work with him, Ibrahim said: O my son, indeed I have seen in a dream that I should sacrifice you... And We ransomed him with a great sacrifice.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1990",
        grade: "sahih",
        excerpt:
          "These are two days on which the Messenger of Allah ﷺ forbade fasting: the day you break your fast (of Ramadan), and the day on which you eat from your sacrifice.",
      },
    ],
  },
  {
    id: "eid-prayer-how-to",
    section: "prayer",
    title: "How to pray Eid salah",
    summary: "Two rakahs with extra takbirs — no adhan or iqamah.",
    body: [
      "The Eid prayer is two rakahs, prayed in congregation without any adhan or iqamah beforehand — Jabir ibn Abdullah and Ibn Abbas both confirmed that no call to prayer was given for either Eid in the Prophet's ﷺ time (Sahih Muslim 886). The prayer is followed by a khutbah (sermon), unlike the Friday prayer where the khutbah comes first.",
      "Extra takbirs (saying 'Allahu Akbar') are added before the recitation in each rakah, on top of the normal takbirs of the prayer. Aisha narrated that the Prophet ﷺ said the takbir seven times in the first rakah and five times in the second, for both Eids (Sunan Abi Dawud 1149), a count also reported from Abdullah ibn Amr (Sunan Abi Dawud 1151).",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "886",
        grade: "sahih",
        excerpt:
          "There is neither any Adhan on Id-ul-Fitr when the Imam comes out, nor even after his coming out; there is neither Iqama nor call nor anything of that sort on that day.",
      },
      {
        collection: "Sunan Abi Dawud",
        citation: "1149",
        grade: "sahih",
        excerpt:
          "The Messenger of Allah ﷺ would say the takbir seven times in the first rakah and five times in the second rakah on the day of the breaking of the fast and on the day of sacrifice.",
      },
    ],
    madhhabNote:
      "Schools differ on the exact extra-takbir count. Shafi'i, Maliki, and Hanbali jurists follow the 7-and-5 narration (Abu Dawud 1149/1151) — Maliki and Hanbali count the opening takbir within the seven, so state 6-and-5. The Hanafi school instead holds 3 extra takbirs before the recitation in the first rakah and 3 before the bowing in the second (6 total) — a position of the Kufan jurists for which there is no separately authenticated marfu' hadith; follow whichever your congregation's imam leads.",
    actions: [
      "Arrive in time — there is no adhan or iqamah to signal the start.",
      "Follow your imam's takbir count; either school's practice is valid.",
      "Stay for the khutbah after the prayer.",
    ],
  },
  {
    id: "sunnah-practices",
    section: "sunnah",
    title: "Sunnah practices on the day",
    summary: "Ghusl, best clothes, eating before/after, and two different routes.",
    body: [
      "Several small Sunnahs are recommended before and after the Eid prayer. On Eid al-Fitr, the Prophet ﷺ would not leave for the prayer until he had eaten some dates, taken in an odd number (Bukhari 953) — the opposite of Eid al-Adha, where it is recommended to wait and eat from the sacrifice after returning from prayer.",
      "It is Sunnah to make ghusl and wear one's best (clean, modest) clothing for the occasion, following the general practice of the companions on the two Eids, though this specific narration is less strongly attested than the others here and is a widely followed practice rather than a single sahih-graded hadith citation.",
      "A distinctive Sunnah is taking a different route home from the one taken to the prayer. Jabir ibn Abdullah reported: 'On the day of Eid the Prophet ﷺ used to return (after offering the Eid prayer) through a way different from that by which he went' (Bukhari 986) — commonly explained as multiplying the places that bear witness to one's worship and displaying the rites of Islam more widely.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "953",
        grade: "sahih",
        excerpt:
          "The Prophet ﷺ never proceeded (for the prayer) on the Day of Id-ul-Fitr unless he had eaten some dates, which he used to eat in an odd number.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "986",
        grade: "sahih",
        excerpt:
          "On the day of Eid the Prophet ﷺ used to return (after offering the Eid prayer) through a way different from that by which he went.",
      },
    ],
    actions: [
      "Make ghusl and wear your best modest clothing.",
      "Eat an odd number of dates before Eid al-Fitr prayer; wait to eat until after Eid al-Adha prayer.",
      "Take a different route home from the one you took to the prayer.",
    ],
  },
  {
    id: "zakat-fitr-basics",
    section: "zakat-fitr",
    title: "Zakat al-Fitr — the basics",
    summary: "A small obligatory charity, due before the Eid al-Fitr prayer.",
    body: [
      "Zakat al-Fitr (Sadaqat al-Fitr) is a distinct, smaller charity from wealth-based zakat, obligatory on every Muslim — young or old, male or female, free or dependent — paid on their behalf by the head of the household. Ibn Umar reported that the Prophet ﷺ enjoined one sa' (roughly 2–3 kg) of dates or barley on every Muslim, to be paid before people go out to the Eid prayer (Bukhari 1503).",
      "Its purpose is explicitly stated in the Sunnah: 'purification for the fasting person from idle and obscene talk, and food for the poor' (Sunan Abi Dawud 1609). Paying it before the Eid prayer counts as this specific zakat; paying it after the prayer still counts as general charity, but misses the distinct reward tied to timing.",
      "Most communities today calculate the value in local currency rather than distributing dates or barley directly, following the guidance of local scholars and zakat authorities on current staple-food values — a practical accommodation, not a change to the underlying obligation.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1503",
        grade: "sahih",
        excerpt:
          "The Messenger of Allah ﷺ enjoined the payment of one Sa' of dates or one Sa' of barley as Zakat-ul-Fitr on every Muslim, slave or free, male or female, young or old, and he ordered that it be paid before the people went out to offer the Id prayer.",
      },
      {
        collection: "Sunan Abi Dawud",
        citation: "1609",
        grade: "sahih",
        excerpt:
          "The Messenger of Allah ﷺ prescribed Zakat al-Fitr as a purification for the fasting person from idle and obscene talk, and as food for the poor. Whoever pays it before the prayer, it is an accepted zakat; whoever pays it after the prayer, it is (ordinary) charity.",
      },
    ],
    actions: [
      "Calculate and set aside Zakat al-Fitr for yourself and your dependents.",
      "Pay it before leaving for the Eid al-Fitr prayer if possible.",
    ],
    appLinks: [{ label: "Zakat calculator", route: "/zakat" }],
  },
  {
    id: "udhiyah-basics",
    section: "udhiyah",
    title: "Udhiyah (sacrifice) — the basics",
    summary: "An animal sacrifice offered on Eid al-Adha, shared with the poor.",
    body: [
      "Udhiyah is the sacrifice of a qualifying animal (sheep, goat, cow, or camel, meeting age and health conditions) on Eid al-Adha and the following days of Tashreeq, in remembrance of Ibrahim's sacrifice. Anas reported that the Prophet ﷺ himself slaughtered two black-and-white rams with his own hands, saying Allah's name and the takbir over them (Bukhari 5558) — establishing that performing the slaughter oneself, where able, is the more excellent practice, though having it done on one's behalf is also valid.",
      "The Qur'an directly ties the sacrifice to sharing its meat: '...eat from them and feed the needy and the beggar' (Qur'an 22:36). The meat is generally shared between one's own household, family and friends, and the poor, so that the occasion combines worship, generosity, and gratitude.",
      "The sacrifice should take place after the Eid prayer, not before — one companion who had slaughtered early was told by the Prophet ﷺ to repeat it, since a sacrifice offered before the prayer is not counted as udhiyah. Rulings on who exactly is obligated to offer it, and precise timing windows, vary by school; consult a qualified local scholar for your situation.",
    ],
    quran: [
      {
        surah: 22,
        ayahFrom: 36,
        label: "Qur'an 22:36",
        excerpt:
          "...for you therein is good. So mention the name of Allah upon them when lined up [for sacrifice]; and when they are [lifeless] on their sides, then eat from them and feed the needy and the beggar.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "5558",
        grade: "sahih",
        excerpt:
          "The Prophet ﷺ slaughtered two rams, black and white in colour, and I saw him putting his foot on their sides and mentioning Allah's Name and saying the takbir. Then he slaughtered them with his own hands.",
      },
    ],
    actions: [
      "Arrange your udhiyah before Eid al-Adha if you are able and it is due upon you.",
      "Ensure the sacrifice happens after the Eid prayer, not before.",
      "Share the meat between your household, family/friends, and the poor.",
    ],
    disclaimer:
      "Who exactly udhiyah is obligatory upon, and the precise valid window for slaughter, are detailed fiqh questions that differ by school. This is general educational content, not a fatwa — consult a qualified local scholar for your situation.",
  },
];
