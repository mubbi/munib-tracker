import type { LearnGuideTopic } from "../types/learn-guide";

/**
 * Learn guide: Hajj & Umrah (NF-2.3). Scholar-neutral, mainstream Sunni
 * teaching drawn from the Qur'an and authentic, checkable hadith (sunnah.com
 * numbering). Weak or disputed narrations are excluded; madhhab differences on
 * arkan/wajibat lists and women's travel are noted via `madhhabNote` rather
 * than resolved as a fatwa. Practical logistics live in `prep` topics as soft
 * `actions`, not checkable rites — rite tracking is in hajj-checklist.ts and
 * umrah-checklist.ts. Bump the version when content changes.
 */
export const HAJJ_GUIDE_CONTENT_VERSION = 4;

export const HAJJ_GUIDE_SECTION_ORDER = [
  "virtues",
  "obligation",
  "types",
  "ihram",
  "umrah",
  "hajj",
  "rulings",
  "prep",
] as const;

export const HAJJ_GUIDE_TOPICS: LearnGuideTopic[] = [
  {
    id: "hajj-mabrur",
    section: "virtues",
    title: "The reward of an accepted Hajj",
    summary: "Hajj mabrur erases sins and its reward is Paradise.",
    body: [
      "Abu Hurayrah reported that the Messenger of Allah ﷺ said: 'Whoever performs Hajj for Allah's sake and does not have sexual relations or commit sin, returns as he was on the day his mother bore him' (Sahih al-Bukhari 1521; Sahih Muslim 1350).",
      "He also said: 'An accepted Hajj (Hajj mabrur) has no reward except Paradise' (Sahih al-Bukhari 1773; Sahih Muslim 1349). Acceptance is tied to sincerity and keeping the pilgrimage free of obscenity and wrongdoing — not merely completing the outward steps.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1521",
        grade: "sahih",
        excerpt:
          "Whoever performs Hajj for Allah's sake and does not have sexual relations or commit sin, returns as he was on the day his mother bore him.",
      },
      {
        collection: "Sahih Muslim",
        citation: "1350",
        grade: "sahih",
        excerpt:
          "Whoever performs Hajj for Allah's sake and does not have sexual relations or commit sin, returns as he was on the day his mother bore him.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "1773",
        grade: "sahih",
        excerpt: "An accepted Hajj has no reward except Paradise.",
      },
      {
        collection: "Sahih Muslim",
        citation: "1349",
        grade: "sahih",
        excerpt: "An accepted Hajj has no reward except Paradise.",
      },
    ],
    actions: [
      "Intend Hajj solely for Allah — protect your tongue and character throughout the journey.",
      "Use the in-app Hajj checklist only as a memory aid; keep the heart focused on acceptance.",
    ],
    appLinks: [{ label: "Hajj rites checklist", route: "/hajj/checklist" }],
  },
  {
    id: "umrah-virtue",
    section: "virtues",
    title: "The virtue of Umrah",
    summary: "Umrah to Umrah erases the sins between them.",
    body: [
      "Abu Hurayrah reported that the Prophet ﷺ said: 'The performance of Umrah is an expiation for the sins committed between it and the previous one, and an accepted Hajj has no reward except Paradise' (Sahih al-Bukhari 1773; Sahih Muslim 1349).",
      "Umrah may be performed at any time of the year. It is shorter than Hajj but still a major act of worship: ihram, tawaf, sa'i, and cutting or shaving the hair.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1773",
        grade: "sahih",
        excerpt:
          "The performance of Umrah is an expiation for the sins committed between it and the previous one, and an accepted Hajj has no reward except Paradise.",
      },
      {
        collection: "Sahih Muslim",
        citation: "1349",
        grade: "sahih",
        excerpt:
          "The performance of Umrah is an expiation for the sins committed between it and the previous one, and an accepted Hajj has no reward except Paradise.",
      },
    ],
    actions: ["Open the Umrah checklist when you are ready to walk through the rites in order."],
    appLinks: [{ label: "Umrah rites checklist", route: "/umrah/checklist" }],
  },
  {
    id: "arafah-virtue",
    section: "virtues",
    title: "The Day of Arafah",
    summary: "The standing at Arafah is the heart of Hajj — and a great day of dua.",
    body: [
      "Abd al-Rahman ibn Ya'mar reported that the Prophet ﷺ said: 'Hajj is Arafah' (Sunan Abi Dawud 1949; Jami' at-Tirmidhi 889). Whoever misses the standing within the bounds of Arafah in its time has missed that year's Hajj.",
      "For those not on pilgrimage, fasting on the Day of Arafah is a strongly recommended act: Abu Qatadah reported that fasting on Arafah expiates the sins of the past year and the coming year (Sahih Muslim 1162). Pilgrims themselves do not fast so they can devote the day to dua.",
    ],
    hadith: [
      {
        collection: "Sunan Abi Dawud",
        citation: "1949",
        grade: "sahih",
        excerpt: "Hajj is Arafah.",
      },
      {
        collection: "Jami' at-Tirmidhi",
        citation: "889",
        grade: "hasan",
        excerpt: "Hajj is Arafah.",
      },
      {
        collection: "Sahih Muslim",
        citation: "1162",
        grade: "sahih",
        excerpt:
          "Fasting on the Day of Arafah, I hope from Allah, expiates for the sins of the year before it and the year after it.",
      },
    ],
  },
  {
    id: "fifth-pillar",
    section: "obligation",
    title: "Hajj — the fifth pillar",
    summary: "Obligatory once in a lifetime upon every able Muslim.",
    body: [
      'Allah says: "And [due] to Allah from the people is a pilgrimage to the House — for whoever is able to find thereto a way. And whoever disbelieves — then indeed, Allah is free from need of the worlds" (Qur\'an 3:97).',
      'The call was proclaimed to all people: "And proclaim to the people the Hajj; they will come to you on foot and on every lean camel; they will come from every distant pass" (Qur\'an 22:27).',
      "Ibn Umar reported that the Prophet ﷺ said Islam is built on five: testimony, salah, zakat, fasting Ramadan, and Hajj to the House for whoever is able (Sahih al-Bukhari 8; Sahih Muslim 16). Scholars agree it is obligatory once in a lifetime when the conditions are met; repeating it is a voluntary virtue.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 97,
        label: "Qur'an 3:97",
        excerpt:
          "And [due] to Allah from the people is a pilgrimage to the House — for whoever is able to find thereto a way...",
      },
      {
        surah: 22,
        ayahFrom: 27,
        label: "Qur'an 22:27",
        excerpt:
          "And proclaim to the people the Hajj; they will come to you on foot and on every lean camel...",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "8",
        grade: "sahih",
        excerpt:
          "Islam is built upon five: the testimony that there is no god but Allah and that Muhammad is the Messenger of Allah, establishing salah, giving zakat, fasting Ramadan, and Hajj to the House for whoever is able.",
      },
      {
        collection: "Sahih Muslim",
        citation: "16",
        grade: "sahih",
        excerpt:
          "Islam is built upon five... and Hajj to the House for whoever is able to find a way thereto.",
      },
    ],
  },
  {
    id: "istitah",
    section: "obligation",
    title: "Ability (istita'ah)",
    summary: "Health, lawful wealth, and a safe route — without these, Hajj is not yet due.",
    body: [
      "The condition in Qur'an 3:97 is ability (istita'ah). Classical scholars summarise it as: physical health for the journey, sufficient lawful wealth to cover the trip and the needs of one's dependents while away, and a safe, open route.",
      "Whoever lacks these means this year is not sinful for delaying until able. Ability is judged case by case — illness, debt that must be repaid, or unsafe travel can lift the immediate obligation. Ask a qualified scholar when your situation is unclear.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 97,
        label: "Qur'an 3:97",
        excerpt: "...for whoever is able to find thereto a way.",
      },
    ],
    actions: [
      "Settle obligatory debts and arrange dependants' maintenance before booking.",
      "Verify packages only through official channels (see Prep topics).",
    ],
  },
  {
    id: "woman-travel",
    section: "obligation",
    title: "A woman's travel for pilgrimage",
    summary: "Majority require a mahram; some later views allow a safe trustworthy group.",
    body: [
      "Ibn Abbas reported that the Prophet ﷺ said a woman should not travel except with a mahram, and a man should not enter upon her unless a mahram is present (Sahih al-Bukhari 1862; Sahih Muslim 1341). Many scholars apply this to Hajj and Umrah travel.",
      "Some later scholars — weighing safety, necessity, and contemporary travel — permit a woman to travel for obligatory Hajj within a trustworthy group when no mahram is available. This remains a contested fiqh question.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1862",
        grade: "sahih",
        excerpt:
          "A woman should not travel except with a mahram, and a man should not enter upon her unless a mahram is with her.",
      },
      {
        collection: "Sahih Muslim",
        citation: "1341",
        grade: "sahih",
        excerpt:
          "It is not lawful for a woman who believes in Allah and the Last Day to travel for a day and night except with a mahram.",
      },
    ],
    madhhabNote:
      "The majority hold that a woman needs a mahram for pilgrimage travel. Some later scholars allow travel in a safe group of women for the obligatory Hajj. Follow a scholar you trust and your Hajj authority's regulations.",
    disclaimer: "This is an overview, not a personal fatwa for your circumstances.",
  },
  {
    id: "hajj-types",
    section: "types",
    title: "The three types of Hajj",
    summary: "Ifrad, Qiran, and Tamattu' — choose before entering ihram.",
    body: [
      "Ifrad: enter ihram for Hajj alone, with no separate Umrah in that ihram, and no sacrifice required on account of combining rites.",
      "Qiran: combine Umrah and Hajj in one ihram, remaining in ihram until Hajj is complete. A sacrifice (hady) is required.",
      "Tamattu': perform a full Umrah in the Hajj months, exit ihram, then re-enter ihram for Hajj on 8 Dhul-Hijjah. This is what most pilgrims do today; it also requires a hady.",
      'Allah says regarding those who combine the rites: "...Whoever takes advantage of Umrah to [perform] Hajj, what can be obtained with ease of sacrificial animals..." and those who cannot afford it fast three days during Hajj and seven when they return (Qur\'an 2:196).',
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 196,
        label: "Qur'an 2:196",
        excerpt:
          "And complete the Hajj and Umrah for Allah... Whoever takes advantage of Umrah to [perform] Hajj, what can be obtained with ease of sacrificial animals. And whoever cannot find [one] — then a fast of three days during Hajj and of seven when you have returned...",
      },
    ],
    actions: [
      "Decide your type with your group leader before the miqat.",
      "If doing Tamattu', complete Umrah fully before re-entering ihram for Hajj.",
    ],
    appLinks: [
      { label: "Umrah checklist", route: "/umrah/checklist" },
      { label: "Hajj checklist", route: "/hajj/checklist" },
    ],
  },
  {
    id: "miqats",
    section: "ihram",
    title: "The five mawaqit",
    summary: "Do not cross the miqat toward Makkah without entering ihram for Hajj or Umrah.",
    body: [
      "Ibn Abbas reported that the Prophet ﷺ fixed miqats for the people: Dhul-Hulayfah for Madinah, Al-Juhfah for Syria, Qarn al-Manazil for Najd, and Yalamlam for Yemen; and for those of Iraq, Dhat 'Irq. He said these are for them and for anyone who comes upon them intending Hajj or Umrah; and whoever is living within these places enters ihram from where they set out, even the people of Makkah from Makkah (Sahih al-Bukhari 1524; Sahih Muslim 1181).",
      "Modern airports and sea ports have corresponding ihram points or announced procedures — follow the guidance of your carrier and the Ministry of Hajj and Umrah so you do not pass the boundary without ihram.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1524",
        grade: "sahih",
        excerpt:
          "The Messenger of Allah ﷺ fixed Dhul-Hulayfah for the people of Madinah, Al-Juhfah for the people of Syria, Qarn al-Manazil for the people of Najd, and Yalamlam for the people of Yemen... These miqats are for the people at those places, and for those who come upon them intending Hajj or Umrah...",
      },
      {
        collection: "Sahih Muslim",
        citation: "1181",
        grade: "sahih",
        excerpt:
          "The Messenger of Allah ﷺ specified the miqats... Whoever is living within these [limits] should enter ihram from the place he sets out...",
      },
    ],
  },
  {
    id: "entering-ihram",
    section: "ihram",
    title: "Entering ihram",
    summary: "Ghusl, garments, intention, and the talbiyah begin the sacred state.",
    body: [
      "Ihram is the sacred state entered by intention for Hajj or Umrah. The Prophet ﷺ encouraged ghusl before ihram. Men wear two unsewn white sheets; women keep ordinary modest dress without covering the face or hands with gloves as ihram garments (details of niqab and gloves are discussed in fiqh).",
      "Men may apply perfume to the body before ihram, not to the ihram garments after entering the state (Sahih al-Bukhari 1539). Then form the intention and begin the talbiyah.",
      'The talbiyah taught by the Prophet ﷺ is: "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni\'mata laka wal-mulk, la sharika lak" — continuing until tawaf begins for Umrah, or until stoning Jamrat al-Aqaba for Hajj according to the well-known practice (Sahih al-Bukhari 1549; Sahih Muslim 1184).',
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1539",
        grade: "sahih",
        excerpt:
          "Aishah said: I used to perfume the Messenger of Allah ﷺ for his ihram before he entered ihram...",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "1549",
        grade: "sahih",
        excerpt:
          "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
      },
      {
        collection: "Sahih Muslim",
        citation: "1184",
        grade: "sahih",
        excerpt: "The Prophet ﷺ raised his voice with the talbiyah: Labbayk Allahumma labbayk...",
      },
    ],
    actions: [
      "Pack at least two sets of ihram for men; keep unscented toiletries ready.",
      "Practice the talbiyah before travel so it flows on the road.",
    ],
  },
  {
    id: "ihram-prohibitions",
    section: "ihram",
    title: "Prohibitions of ihram",
    summary: "What the muhrim must avoid until release from the sacred state.",
    body: [
      "While in ihram, avoid: for men — sewn/fitted clothes and covering the head; perfume; cutting hair or nails; hunting land game; contracting or conducting a marriage; and intimacy. Women avoid perfume and the other shared prohibitions while keeping modest dress.",
      "Breaking a prohibition may require an expiation (fidyah) — typically fasting, feeding the poor, or sacrifice — depending on what was done. Madhhabs classify details differently. Keep carefully to the prohibitions and ask a qualified guide if something happens unexpectedly.",
    ],
    madhhabNote:
      "Lists of violations and their expiations vary by school. Treat this as a practical warning list, then confirm details with your madhhab or Hajj guide.",
    disclaimer: "This overview is not a substitute for on-site rulings when a violation occurs.",
    actions: ["Keep perfume, nail clippers, and scissors out of easy reach while in ihram."],
  },
  {
    id: "umrah-ihram-talbiyah",
    section: "umrah",
    title: "Umrah — ihram and talbiyah",
    summary: "Enter the sacred state at or before the miqat, then answer Allah's call.",
    body: [
      "At or before your miqat, make ghusl if able, wear the ihram garments, form the intention for Umrah, and begin the talbiyah. The sacred state begins with that intention.",
      "Repeat the talbiyah often as you travel toward Makkah until you begin tawaf. It is a declaration that you answer Allah's call alone.",
    ],
    actions: ["Use the Umrah checklist to mark each rite as you complete it."],
    appLinks: [{ label: "Umrah checklist", route: "/umrah/checklist" }],
  },
  {
    id: "umrah-tawaf",
    section: "umrah",
    title: "Tawaf of the Ka'bah",
    summary: "Seven circuits anticlockwise, starting at the Black Stone.",
    body: [
      "Circle the Ka'bah seven times anticlockwise, starting and ending at the Black Stone corner. Kiss it, touch it, or point toward it with takbir if crowded — following the Prophet's ﷺ practice without harming others.",
      "Men perform raml (a brisk pace) in the first three circuits and idtiba' (baring the right shoulder) during this Umrah tawaf of arrival, in the well-known Sunnah.",
      'Between the Yemeni Corner and the Black Stone it is recommended to say: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire" (Qur\'an 2:201).',
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 201,
        label: "Qur'an 2:201",
        excerpt:
          "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
      },
    ],
  },
  {
    id: "umrah-maqam-zamzam",
    section: "umrah",
    title: "Two rakahs and Zamzam",
    summary: "Pray behind Maqam Ibrahim if possible, then drink Zamzam.",
    body: [
      "After tawaf, pray two rakahs behind Maqam Ibrahim if space allows, or elsewhere in the masjid if crowded — linking to Allah's words: \"...And take, [O believers], from the standing place of Ibrahim a place of prayer...\" (Qur'an 2:125).",
      "Then drink Zamzam water. Jabir's description of the Prophet's ﷺ Hajj includes drinking Zamzam after tawaf; the Prophet ﷺ said Zamzam is for whatever it is drunk for (authentic reports compiled by later scholars; treat intention and dua as recommended).",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 125,
        label: "Qur'an 2:125",
        excerpt:
          "...And take, [O believers], from the standing place of Ibrahim a place of prayer...",
      },
    ],
  },
  {
    id: "umrah-sai",
    section: "umrah",
    title: "Sa'i between Safa and Marwah",
    summary: "Seven courses in memory of Hajar's search for water.",
    body: [
      'Allah says: "Indeed, as-Safa and al-Marwah are among the symbols of Allah. So whoever makes Hajj to the House or performs Umrah — there is no blame upon him for walking between them..." (Qur\'an 2:158).',
      "Walk seven times between Safa and Marwah, beginning at Safa. At Safa, face the Ka'bah, raise your hands in takbir and dua as the Prophet ﷺ did. Men jog between the green markers.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 158,
        label: "Qur'an 2:158",
        excerpt:
          "Indeed, as-Safa and al-Marwah are among the symbols of Allah. So whoever makes Hajj to the House or performs Umrah — there is no blame upon him for walking between them...",
      },
    ],
  },
  {
    id: "umrah-halq",
    section: "umrah",
    title: "Halq or taqsir — completing Umrah",
    summary: "Men shave or trim; women trim a fingertip's length — then ihram lifts.",
    body: [
      "Men shave the head (halq) — which the Prophet ﷺ prayed for three times — or trim evenly (taqsir). Women gather their hair and trim about a fingertip's length. With this, Umrah is complete and ihram restrictions lift.",
      "Abdullah ibn Umar reported that the Messenger of Allah ﷺ said: 'O Allah, be merciful to those who have their heads shaved.' They said: 'And those who shorten, O Messenger of Allah?' He said: 'O Allah, be merciful to those who have their heads shaved.' They said: 'And those who shorten, O Messenger of Allah?' He said the third time: 'And those who shorten' (Sahih al-Bukhari 1727; Sahih Muslim 1301).",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1727",
        grade: "sahih",
        excerpt:
          "O Allah, be merciful to those who have their heads shaved... And (the third time) those who shorten.",
      },
      {
        collection: "Sahih Muslim",
        citation: "1301",
        grade: "sahih",
        excerpt:
          "O Allah, forgive those who get their heads shaved... then he said the third time: and those who get their hair cut short.",
      },
    ],
  },
  {
    id: "hajj-tarwiyah",
    section: "hajj",
    title: "8 Dhul-Hijjah — Day of Tarwiyah",
    summary: "Enter ihram for Hajj and spend the day in Mina.",
    body: [
      "For Tamattu' pilgrims: make the intention for Hajj and re-enter ihram from your residence in Makkah, renewing the talbiyah. Ifrad and Qiran pilgrims are already in ihram.",
      "Travel to Mina and pray Dhuhr, Asr, Maghrib, Isha, and the next Fajr, each shortened to two rakahs at its own time, following the Prophet's ﷺ practice in the Farewell Hajj as reported by Jabir (Sahih Muslim 1218). Spend the day and night in worship, awaiting Arafah.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "1218",
        grade: "sahih",
        excerpt:
          "Jabir's long narration of the Prophet's ﷺ Farewell Hajj — including the stay in Mina and the sequence of rites.",
      },
    ],
    actions: ["Open the Hajj checklist on the morning of the 8th."],
    appLinks: [{ label: "Hajj checklist", route: "/hajj/checklist" }],
  },
  {
    id: "hajj-arafah-day",
    section: "hajj",
    title: "9 Dhul-Hijjah — Day of Arafah",
    summary: "Stand within Arafah until sunset; then move to Muzdalifah.",
    body: [
      'Remain within the boundary of Arafah from after midday until sunset in dua, zikr, and repentance. The Prophet ﷺ said "Hajj is Arafah" (Sunan Abi Dawud 1949). Face the qiblah, raise your hands, and beseech Allah — it is among the greatest times for dua.',
      "Pray Dhuhr and Asr together and shortened at the time of Dhuhr (jam' taqdim), then devote the rest of the day to dua rather than optional prayer — following the Prophet's ﷺ practice (Sahih Muslim 1218).",
      "After sunset, travel calmly to Muzdalifah. Combine Maghrib and Isha (Isha shortened), rest the night, and gather pebbles for the stoning. The weak and women may leave for Mina after midnight according to well-known permissions in the Sunnah.",
    ],
    hadith: [
      {
        collection: "Sunan Abi Dawud",
        citation: "1949",
        grade: "sahih",
        excerpt: "Hajj is Arafah.",
      },
      {
        collection: "Sahih Muslim",
        citation: "1218",
        grade: "sahih",
        excerpt:
          "The Prophet ﷺ combined Dhuhr and Asr at Arafah, then departed after sunset to Muzdalifah...",
      },
    ],
  },
  {
    id: "hajj-nahr-day",
    section: "hajj",
    title: "10 Dhul-Hijjah — Day of Nahr",
    summary: "Stoning, sacrifice, hair, and Tawaf al-Ifadah.",
    body: [
      "Return toward Mina and throw seven pebbles at Jamrat al-Aqaba (the large pillar), saying Allahu akbar with each throw — the first rite of the day in the Farewell Hajj sequence.",
      "Offer the sacrifice required for Tamattu' and Qiran (Qur'an 2:196), or arrange it through a trusted agency. Meat is eaten and given to the poor.",
      "Shave (halq) or trim (taqsir); women trim a fingertip's length. After stoning and shaving/trimming, the first release (tahallul awwal) applies — most ihram restrictions lift except intimacy.",
      "Go to Makkah for Tawaf al-Ifadah — a pillar of Hajj — and the sa'i for Tamattu' pilgrims (Ifrad/Qiran who already did sa'i with their arrival tawaf follow their school's ruling). This completes the full release from ihram.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 196,
        label: "Qur'an 2:196",
        excerpt:
          "...Whoever takes advantage of Umrah to [perform] Hajj, what can be obtained with ease of sacrificial animals...",
      },
    ],
    madhhabNote:
      "Order of the Day of Nahr rites has flexibility in the Sunnah; schools differ on the exact sequence and on when sa'i is required for each type of Hajj. Follow your group's guide.",
  },
  {
    id: "hajj-tashreeq",
    section: "hajj",
    title: "11–13 Dhul-Hijjah — Days of Tashreeq",
    summary: "Nights in Mina, daily stoning of the three Jamarat, then farewell tawaf.",
    body: [
      "Spend the nights of the 11th, 12th (and 13th if not leaving early) in Mina. These are days of eating, drinking, and remembrance of Allah.",
      "Each afternoon after Dhuhr, throw seven pebbles at each of the three pillars in order — the small, then the middle, then the large — with takbir on each throw. Whoever hastens may leave after stoning on the 12th (Qur'an 2:203).",
      "Before leaving Makkah, perform Tawaf al-Wada so that the last act with the House is farewell. Ibn Abbas reported that the people were commanded that the last of their rites be at the House, except that it was lightened for the menstruating woman (Sahih al-Bukhari 1755; Sahih Muslim 1328).",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 203,
        label: "Qur'an 2:203",
        excerpt:
          "And remember Allah during [specific] numbered days. Then whoever hastens [his departure] in two days — there is no sin upon him; and whoever delays — there is no sin upon him — for him who fears Allah...",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1755",
        grade: "sahih",
        excerpt:
          "The people were ordered to perform the farewell tawaf of the Ka'bah as the last rite, except the menstruating women who were excused.",
      },
      {
        collection: "Sahih Muslim",
        citation: "1328",
        grade: "sahih",
        excerpt:
          "The people were commanded that the last of their rites should be at the House, but it was lightened for the woman in menses.",
      },
    ],
  },
  {
    id: "arkan-wajibat",
    section: "rulings",
    title: "Pillars and obligations",
    summary: "What invalidates Hajj if missed, and what is made up with a sacrifice.",
    body: [
      "Pillars (arkan) are the essence of Hajj. If a pillar is missed, the Hajj is invalid and cannot be repaired by a sacrifice alone — it must be made up. The majority typically list: ihram (intention), standing at Arafah, Tawaf al-Ifadah, and sa'i.",
      "Obligations (wajibat) include entering ihram from the miqat, staying at Muzdalifah, stoning the Jamarat, spending the nights of Tashreeq in Mina, and the Farewell Tawaf. Omitting an obligation does not invalidate Hajj but is compensated by a dam (sacrifice) according to the schools.",
    ],
    madhhabNote:
      "Exact arkan and wajibat lists differ among the four madhhabs. Confirm with a qualified guide for your school — especially if something is missed under pressure of the crowds.",
    disclaimer: "This is a practical overview, not a fatwa for missed rites.",
  },
  {
    id: "hajj-etiquette",
    section: "rulings",
    title: "Etiquette and sincerity",
    summary: "Guard the tongue and limbs — acceptance is tied to character.",
    body: [
      "The hadith of the sinless return (Bukhari 1521; Muslim 1350) makes clear that Hajj is spoiled by obscenity (rafath), sin (fusuq), and argumentation. Patience, gentleness, and helping fellow pilgrims are part of worship.",
      "Keep phones and idle talk from dominating Arafah and the masjid. Give way in tawaf; do not push toward the Black Stone. An accepted Hajj is Paradise's companion — strive for excellent character throughout.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1521",
        grade: "sahih",
        excerpt:
          "Whoever performs Hajj for Allah's sake and does not have sexual relations or commit sin, returns as he was on the day his mother bore him.",
      },
    ],
    actions: ["Set a daily intention: one act of kindness and one sincere dua above the crowd."],
  },
  {
    id: "prep-visa",
    section: "prep",
    title: "Visa and registration",
    summary: "Use official channels — Nusuk and your national Hajj authority.",
    body: [
      "Nusuk (nusuk.sa) is Saudi Arabia's official platform for Hajj and Umrah — visas, accommodation, transport, and registered packages. Unofficial brokers are a common source of scams.",
      "Each country receives an annual Hajj quota; most pilgrims apply through their national Hajj authority or a licensed agent. Umrah has no quota and can be arranged for much of the year through approved channels.",
    ],
    actions: [
      "Apply early when the season opens.",
      "Book only through Nusuk-listed agencies or your national authority.",
      "Verify payment channels before transferring money.",
    ],
    disclaimer: "Entry rules and platforms change — always confirm on official sites.",
  },
  {
    id: "prep-packing",
    section: "prep",
    title: "What to pack",
    summary: "Ihram, unscented toiletries, documents, and walking comfort.",
    body: [
      "Men: at least two sets of unsewn ihram garments and a belt for documents. Women: loose modest clothing. Open sandals that slip on easily; a small backpack and water bottle.",
      "Pack unscented soap and sunscreen — perfume is prohibited in ihram. Keep passport, visa printout, vaccination records, and emergency contacts in a slim pouch. A power bank and local SIM or eSIM help in crowds.",
    ],
    actions: [
      "Checklist: ihram ×2, sandals, unscented toiletries, documents pouch, medication, power bank.",
      "Carry blister plasters — pilgrims walk far.",
    ],
  },
  {
    id: "prep-sites",
    section: "prep",
    title: "Holy sites at a glance",
    summary: "Makkah, Madinah, Mina, Arafah, and Muzdalifah — practical notes.",
    body: [
      "Masjid al-Haram surrounds the Ka'bah — site of tawaf and sa'i; expect heavy crowds. Masjid an-Nabawi in Madinah is not part of Hajj itself but most pilgrims visit; Rawdah entry is timed via official apps.",
      "Mina is the tented city for the nights of 8 and 11–13 Dhul-Hijjah. Arafah is an open plain — hydration and shade matter on the 9th. Muzdalifah is where pilgrims rest under the open sky and collect pebbles — facilities are minimal by design.",
    ],
    actions: ["Study a simple map of Mina–Arafah–Muzdalifah before travel."],
  },
  {
    id: "prep-resources",
    section: "prep",
    title: "Official resources",
    summary: "Nusuk, your national authority, and Visit Saudi.",
    body: [
      "Start with Nusuk for visas, packages, Rawdah permits, and crowd guidance. Use your country's Hajj ministry for quota and health rules. Visit Saudi publishes general entry and travel advisories.",
      "If a deal seems unusually cheap or a broker asks for payment outside official channels, verify directly with the ministry portal before you pay.",
    ],
    actions: [
      "Bookmark nusuk.sa and your national Hajj authority site.",
      "Save emergency contacts from your group leader.",
    ],
    disclaimer: "A practical guide, not a substitute for your official Hajj/Umrah provider.",
  },
];
