import type { LearnGuideTopic } from "../types/learn-guide";

/**
 * Practical Janazah (funeral) guide. Scholar-neutral, mainstream Sunni teaching
 * drawn from the Qur'an and authentic hadith (sunnah.com numbering). Funeral
 * duas are linked by bundled Hisnul Muslim ids (`duaId`) — never invented.
 * Washing, shrouding, and burial details differ by madhhab; notes flag that.
 * Bump the version when content changes.
 */
export const JANAZAH_GUIDE_CONTENT_VERSION = 1;

export const JANAZAH_GUIDE_SECTION_ORDER = [
  "obligation",
  "prepare",
  "salah",
  "burial",
  "duas",
  "reminders",
] as const;

export const JANAZAH_GUIDE_TOPICS: LearnGuideTopic[] = [
  {
    id: "fard-kifayah",
    section: "obligation",
    title: "A communal obligation",
    summary: "Janazah is fard kifayah — the community must fulfill it.",
    body: [
      "The funeral prayer (Salat al-Janazah) is a communal obligation (fard kifayah): if some of the community perform it, the duty is lifted from the rest; if none do, all share the blame. It is prayed standing, without ruku or sujud — a distinctive form among the prayers.",
      "Abu Hurayrah reported that the Messenger of Allah ﷺ said: 'Whoever attends the funeral until the prayer is offered will have a qirat (of reward), and whoever attends until the burial will have two qirats.' He was asked what a qirat was, and he said: 'Like two great mountains' (Sahih al-Bukhari 1325; Sahih Muslim 945).",
      "Following the funeral, helping with washing and burial according to one's capacity, and making dua for the deceased are among the rights of a Muslim over another. Treat the body with dignity and avoid extravagance or practices without evidence.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1325",
        grade: "sahih",
        excerpt:
          "Whoever attends the funeral until he offers the funeral prayer will have one qirat, and whoever attends until burial will have two qirats — each like a great mountain.",
      },
      {
        collection: "Sahih Muslim",
        citation: "945",
        grade: "sahih",
        excerpt:
          "Whoever follows the funeral of a Muslim out of faith and seeking reward, and stays until the prayer is offered and the burial is finished, will return with two qirats...",
      },
    ],
    actions: [
      "Respond quickly when a funeral is announced in your community.",
      "Intend the prayer and attendance for Allah's sake, not social display.",
      "Help with practical needs of the family when you can do so respectfully.",
    ],
    appLinks: [{ label: "Learn Salah — Janazah mention", route: "/salah-guide" }],
  },
  {
    id: "washing-and-shroud",
    section: "prepare",
    title: "Washing and shrouding",
    summary: "Ghusl of the deceased and a simple kafan — dignity without extravagance.",
    body: [
      "Muslims who die (other than martyrs of the battlefield in the classical ruling) are washed with a purifying wash, then shrouded in clean white cloth. Umm Atiyyah reported that the Prophet ﷺ said regarding his daughter's washing: 'Wash her three or five times, or more if you see fit, with water and sidr, and put camphor — or some camphor — in the last' (Sahih al-Bukhari 1253).",
      "Aisha reported that the Messenger of Allah ﷺ was shrouded in three white Yemeni cotton garments, among which was neither a shirt nor a turban (Sahih al-Bukhari 1264; Sahih Muslim 941). Simplicity is the sunnah; costly displays contradict the prophetic example.",
      "Who washes whom, how many cloths for men and women, and related details have madhhab differences. Families should follow a knowledgeable local guide or funeral service that knows the school's practice — this overview is not a wash manual.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1253",
        grade: "sahih",
        excerpt:
          "Wash her three times, or five, or more if you see that as necessary, with water and sidr, and put camphor or some camphor in the last washing.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "1264",
        grade: "sahih",
        excerpt:
          "The Messenger of Allah ﷺ was shrouded in three white Yemeni cotton garments; neither a shirt nor a turban was among them.",
      },
    ],
    madhhabNote:
      "Schools differ on exact cloth counts, perfume placement, and whether certain categories (e.g. miscarriage stages) receive full washing. Follow your local funeral committee or scholar for hands-on steps.",
    actions: [
      "Appoint trustworthy people of the same gender as the deceased when possible.",
      "Keep the shroud simple and clean — white cloth is the prophetic model.",
      "Avoid photographing or exposing the body without need.",
    ],
  },
  {
    id: "closing-eyes-dua",
    section: "prepare",
    title: "When closing the eyes of the deceased",
    summary: "A prophetic dua at the moment of death.",
    body: [
      "Umm Salamah reported that the Messenger of Allah ﷺ came to Abu Salamah when his eyes had become fixed. He closed them and said: 'When the soul is taken, the sight follows it,' and the people of his household wept. He then taught them to say only what is good, for the angels say amin to what they say, and he made dua for Abu Salamah (Sahih Muslim 920).",
      "The bundled Hisnul Muslim entry below preserves the wording used at closing the eyes. Speak gently, avoid wailing that the Prophet ﷺ forbade, and occupy the tongue with good words and seeking forgiveness.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "920",
        grade: "sahih",
        excerpt:
          "When Abu Salamah's eyes became fixed, the Prophet ﷺ closed them and said that when the soul is taken the sight follows it, then taught the household to speak only what is good.",
      },
    ],
    duaId: "hisn-155",
    actions: [
      "Close the eyes gently and make the authentic dua.",
      "Remind the family to speak good.",
    ],
  },
  {
    id: "how-to-pray-janazah",
    section: "salah",
    title: "How to pray Janazah",
    summary: "Standing prayer with four takbirs — no ruku or sujud.",
    body: [
      "The funeral prayer is performed standing. There is no ruku, no sujud, and no adhan or iqamah. The imam stands at the head of a male deceased or at the middle of a female deceased according to reports from Anas and Samurah (see Abu Dawud 3194 and related narrations), and the congregation forms rows behind.",
      "The prayer consists of four takbirs. After the first, Surat al-Fatihah is recited (Bukhari 1335). After later takbirs, salawat upon the Prophet ﷺ and dua for the deceased are made. The prayer ends with taslim. Jabir reported that the Prophet ﷺ offered the funeral prayer for Negus (the Abyssinian king) and said four takbirs (Sahih al-Bukhari 1334).",
      "Latecomers who miss a takbir should follow the imam and complete what they missed according to their school's rule for catching up — ask the imam or a local teacher if unsure.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1334",
        grade: "sahih",
        excerpt: "The Prophet ﷺ offered the funeral prayer for Negus and said four takbirs.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "1335",
        grade: "sahih",
        excerpt:
          "Ibn Abbas offered a funeral prayer and recited the Fatihah, saying it was from the sunnah.",
      },
    ],
    madhhabNote:
      "Raising the hands with each takbir, silent vs audible Fatihah, and the exact placement of salawat and dua vary slightly by school. Follow the imam leading the prayer.",
    actions: [
      "Stand in rows; do not bow or prostrate.",
      "Say four takbirs with the imam.",
      "Make sincere dua for the deceased after the appropriate takbir.",
    ],
    appLinks: [{ label: "Learn Salah hub", route: "/salah-guide" }],
  },
  {
    id: "janazah-duas-adult",
    section: "duas",
    title: "Duas in the funeral prayer (adult)",
    summary: "Authentic Hisnul Muslim wordings for the deceased.",
    body: [
      "After the takbirs, the heart of Janazah is dua for the deceased — asking Allah to forgive them, show them mercy, and grant them Paradise. Several authentic wordings are preserved in Hisnul Muslim from the Prophet ﷺ.",
      "Open the linked dua below to recite with Arabic, transliteration, and meaning. You may learn more than one authentic wording; sincerity matters more than length.",
    ],
    duaId: "hisn-156",
    actions: [
      "Memorize at least one authentic Janazah dua.",
      "Make general dua for all Muslim deceased when you attend.",
    ],
    appLinks: [{ label: "All illness & funeral duas", route: "/dua" }],
  },
  {
    id: "janazah-duas-more",
    section: "duas",
    title: "More funeral prayer duas",
    summary: "Additional authentic wordings from Hisnul Muslim.",
    body: [
      "Hisnul Muslim preserves further funeral-prayer wordings taught from the Prophet ﷺ. Use them in rotation or learn the one your community knows best.",
      "For a deceased child, specific duas ask Allah to make the child a forerunner and stored reward for the parents — see the next topic.",
    ],
    duaId: "hisn-157",
  },
  {
    id: "janazah-dua-three",
    section: "duas",
    title: "Funeral prayer dua #3",
    summary: "Another authentic wording for the adult deceased.",
    body: [
      "A further Hisnul Muslim wording for the funeral prayer. Recite it after the appropriate takbir as your imam's practice allows.",
    ],
    duaId: "hisn-158",
  },
  {
    id: "janazah-dua-four",
    section: "duas",
    title: "Funeral prayer dua #4",
    summary: "A fourth authentic wording from the sunnah corpus.",
    body: [
      "Hisnul Muslim includes this additional funeral-prayer dua. Choose authenticity and presence of heart over collecting every wording at once.",
    ],
    duaId: "hisn-159",
  },
  {
    id: "janazah-child-duas",
    section: "duas",
    title: "Duas for a deceased child",
    summary: "Specific prophetic duas when the deceased is a child.",
    body: [
      "When the deceased is a child, authentic duas ask Allah to make the child a stored treasure, a forerunner, and an answered intercessor for the parents. The Hisnul Muslim entries below preserve those wordings.",
      "Comfort the family with hope in Allah's mercy while avoiding invented rituals. The same four-takbir Janazah structure applies; the dua content is what changes.",
    ],
    duaId: "hisn-160",
    actions: [
      "Use the child-specific duas when appropriate.",
      "Support grieving parents with presence and halal help.",
    ],
  },
  {
    id: "janazah-child-dua-two",
    section: "duas",
    title: "Child funeral dua #2",
    summary: "Second Hisnul Muslim wording for a deceased child.",
    body: [
      "Another authentic wording for the funeral prayer of a child, preserved in Hisnul Muslim.",
    ],
    duaId: "hisn-161",
  },
  {
    id: "burial-and-grave",
    section: "burial",
    title: "Burial and the grave",
    summary: "Lowering the body, facing the qibla, and dua after burial.",
    body: [
      "The deceased is buried in the earth facing the qibla, with dignity and without delay beyond what preparation requires. The Prophet ﷺ said: 'Be prompt with the funeral...' (Sahih al-Bukhari 1315 — hastening the funeral).",
      "When placing the deceased in the grave, an authentic dua is preserved in Hisnul Muslim. After burial, the Prophet ﷺ would stand at the grave and say: 'Ask forgiveness for your brother, and ask that he be made steadfast, for he is now being questioned' (Sunan Abi Dawud 3221 — graded sahih by many later scholars including al-Albani).",
      "Building ornate structures over graves, plastering them for decoration, or writing that encourages exaggeration is warned against in authentic reports. Keep the mark simple where the law and local custom allow identification.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1315",
        grade: "sahih",
        excerpt:
          "Be prompt with the funeral: if it was righteous, you are hastening it to good; if otherwise, you are laying evil off your necks.",
      },
      {
        collection: "Sunan Abi Dawud",
        citation: "3221",
        grade: "sahih",
        excerpt:
          "Ask forgiveness for your brother and ask that he be made steadfast, for he is now being questioned.",
      },
    ],
    duaId: "hisn-163",
    madhhabNote:
      "Lahd vs shiqq grave styles, depth, and whether women attend the burial differ by school and culture within Islamic bounds. Follow local scholarly guidance.",
  },
  {
    id: "after-burial-dua",
    section: "burial",
    title: "After burying the deceased",
    summary: "Dua for steadfastness at the grave.",
    body: [
      "Standing briefly after burial to seek forgiveness and steadfastness for the deceased is established from the Prophet ﷺ (Abu Dawud 3221). The Hisnul Muslim wording below is for after burial.",
      "Ongoing charity, dua, and fulfilling the deceased's legitimate wills benefit them by Allah's permission — without inventing annual ceremonies that lack evidence.",
    ],
    duaId: "hisn-164",
    actions: [
      "Make dua at the grave after burial.",
      "Continue private dua and sadaqah for the deceased.",
    ],
    appLinks: [{ label: "Sadaqah goals", route: "/sadaqah" }],
  },
  {
    id: "visiting-graves",
    section: "burial",
    title: "Visiting the graves",
    summary: "The prophetic greeting when visiting the graves.",
    body: [
      "Visiting graves reminds the living of the Hereafter. Buraidah reported that the Messenger of Allah ﷺ used to teach them to say when they went out to the graveyard: a greeting of peace upon the inhabitants of the dwellings among the believers and Muslims, affirming that we will — Allah willing — join them, and asking well-being for us and them (Sahih Muslim 975; wording also in Ibn Majah).",
      "The Hisnul Muslim entry below preserves that greeting. Keep visits free of wailing, seeking help from the dead, or rituals without evidence.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "975",
        grade: "sahih",
        excerpt:
          "Peace be upon you, O inhabitants of the dwellings among the believers and Muslims. We will — Allah willing — join you. We ask Allah for well-being for us and for you.",
      },
    ],
    duaId: "hisn-165",
    actions: [
      "Greet the inhabitants of the graves with the authentic wording.",
      "Reflect on death and renew righteous deeds.",
    ],
  },
  {
    id: "common-mistakes",
    section: "reminders",
    title: "Reminders and common mistakes",
    summary: "Avoid wailing, delay for show, and baseless rituals.",
    body: [
      "The Prophet ﷺ forbade wailing over the dead while allowing tearful grief. Abdullah ibn Umar reported that Sa'd ibn Ubadah wept at a funeral and the Prophet ﷺ explained that Allah does not punish for tear of the eye or grief of the heart, but for this — and he pointed to his tongue (Sahih al-Bukhari 1304).",
      "Do not delay burial for prestige gatherings, nor spend lavishly on the shroud and feast while neglecting the poor. Do not recite or practice innovations attributed to funerals without authentic basis. Condolence, quiet dua, and practical help for the family are the sunnah path.",
      "Women's attendance at the prayer and burial is treated with nuance across schools and eras; follow trustworthy local guidance that respects both compassion and prophetic limits.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1304",
        grade: "sahih",
        excerpt:
          "Allah does not punish for the tear of the eye or the grief of the heart, but He punishes or shows mercy for this — and he pointed to his tongue.",
      },
    ],
    actions: [
      "Grieve without wailing or forbidden speech.",
      "Hasten a dignified burial.",
      "Help the family with food and affairs without burdening them with extravagance.",
    ],
    disclaimer:
      "Educational overview — not a funeral director's manual or a fatwa. Local school practice for washing, shrouding, and cemetery rules must be confirmed with qualified people.",
  },
];
