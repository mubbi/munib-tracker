import type { LearnGuideTopic } from "../types/learn-guide";

/**
 * Learn guide: Friday (Jumu'ah) practices. Scholar-neutral, mainstream Sunni
 * teaching drawn only from the Qur'an and authentic, checkable hadith
 * (sunnah.com numbering). Weak or disputed narrations (e.g. dying on Friday)
 * are excluded. Where grading rests on later authentication (al-Albani), the
 * grade field and disclaimer make that explicit. Bump the version when content
 * changes so any cache/test notices.
 */
export const FRIDAY_GUIDE_CONTENT_VERSION = 1;

export const FRIDAY_GUIDE_SECTION_ORDER = [
  "virtues",
  "obligation",
  "prepare",
  "kahf",
  "salawat",
  "dua",
] as const;

export const FRIDAY_GUIDE_TOPICS: LearnGuideTopic[] = [
  {
    id: "virtues-of-friday",
    section: "virtues",
    title: "The virtues of Friday",
    summary: "The best day the sun rises on — Adam's creation, and forgiveness between Fridays.",
    body: [
      "Friday (Yawm al-Jumu'ah) is the weekly gathering day of this Ummah. Abu Hurayrah reported that the Messenger of Allah ﷺ said: 'The best day on which the sun has risen is Friday; on it Adam was created, on it he was made to enter Paradise, on it he was expelled from it, and the Last Hour will take place on no day other than Friday' (Sahih Muslim 854).",
      "Its worship also carries a standing promise of forgiveness. Abu Hurayrah reported that the Prophet ﷺ said: 'Whoever takes a bath on Friday, then comes to the Friday prayer, and listens and remains silent while the imam is delivering the sermon, his sins between that Friday and the next Friday will be forgiven, plus three more days' (Sahih Muslim 857).",
      "These virtues are a call to prepare early, listen attentively, and treat Friday as a weekly spiritual reset — not merely a day off work.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "854",
        grade: "sahih",
        excerpt:
          "The best day on which the sun has risen is Friday; on it Adam was created, on it he was made to enter Paradise, on it he was expelled from it, and the Last Hour will take place on no day other than Friday.",
      },
      {
        collection: "Sahih Muslim",
        citation: "857",
        grade: "sahih",
        excerpt:
          "Whoever takes a bath on Friday, then comes to the Friday prayer, and listens and remains silent while the imam is delivering the sermon, his sins between that Friday and the next Friday will be forgiven, plus three more days.",
      },
    ],
    actions: [
      "Set a Friday morning intention: ghusl, best clothes, and arriving early.",
      "Treat the khutbah as worship — silence and attention are part of the reward.",
    ],
  },
  {
    id: "jumuah-obligation",
    section: "obligation",
    title: "Jumu'ah — the weekly obligation",
    summary:
      "The congregational Friday prayer commanded in the Qur'an, replacing Dhuhr for those who attend.",
    body: [
      "Allah commands the Friday prayer by name: 'O you who believe, when the call is made for prayer on Friday, hasten to the remembrance of Allah and leave off trade. That is better for you, if you only knew' (Qur'an 62:9). The following ayahs then restore permission to disperse and seek Allah's bounty after the prayer (Qur'an 62:10–11).",
      "Jumu'ah consists of a two-part khutbah followed by two rakahs prayed aloud behind the imam, and it takes the place of Dhuhr for those who attend. Tariq ibn Shihab reported that the Prophet ﷺ said the Friday prayer in congregation is a binding duty upon every Muslim except four: a slave, a woman, a child, or one who is ill (Sunan Abi Dawud 1067).",
      "Neglect is a grave warning: Abu al-Ja'd reported that whoever abandons three Friday prayers out of heedlessness, Allah places a seal over his heart (Sunan an-Nasa'i 1369). During the sermon, idle talk wastes the reward — Abu Hurayrah reported that if you say to your companion 'Be quiet' while the imam is speaking, you have spoken wrongly (Sahih al-Bukhari 934).",
      "After Jumu'ah it is recommended to pray four rakahs: Abu Hurayrah reported that the Prophet ﷺ said, 'When one of you has prayed the Friday prayer, let him pray four (rakahs) afterwards' (Sahih Muslim 881).",
    ],
    quran: [
      {
        surah: 62,
        ayahFrom: 9,
        ayahTo: 11,
        label: "Qur'an 62:9–11",
        excerpt:
          "O you who believe, when the call is made for prayer on Friday, hasten to the remembrance of Allah and leave off trade. That is better for you, if you only knew. And when the prayer has been concluded, disperse within the land and seek from the bounty of Allah...",
      },
    ],
    hadith: [
      {
        collection: "Sunan Abi Dawud",
        citation: "1067",
        grade: "hasan",
        excerpt:
          "The Friday prayer in congregation is a binding duty upon every Muslim, except four: a slave, a woman, a child, or one who is ill.",
      },
      {
        collection: "Sunan an-Nasa'i",
        citation: "1369",
        grade: "hasan",
        excerpt:
          "Whoever abandons three Friday prayers out of heedlessness, Allah will place a seal over his heart.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "934",
        grade: "sahih",
        excerpt:
          "If you say to your companion 'Be quiet' on Friday while the imam is delivering the sermon, you have spoken wrongly (laghawta).",
      },
      {
        collection: "Sahih Muslim",
        citation: "881",
        grade: "sahih",
        excerpt:
          "When one of you has prayed the Friday prayer, let him pray four (rakahs) afterwards.",
      },
    ],
    actions: [
      "Plan travel so you can reach the masjid before the khutbah begins.",
      "Keep phones silent and avoid speaking during the sermon.",
      "Pray four rakahs after Jumu'ah when you can.",
    ],
    appLinks: [
      { label: "Learn Salah — Jumu'ah lesson", route: "/salah-guide/jumuah" },
      { label: "Open Tracker", route: "/(tabs)/tracker" },
    ],
    disclaimer:
      "The minimum number of attendees for a valid Jumu'ah, and whether women and travellers are encouraged to attend, are detailed fiqh questions that differ by school and local custom. Women, travellers, and the sick who do not attend pray Dhuhr instead. This is educational content, not a fatwa.",
  },
  {
    id: "preparing-for-jumuah",
    section: "prepare",
    title: "Preparing for Jumu'ah",
    summary: "Ghusl, clean clothes, fragrance, and arriving early for the greatest reward.",
    body: [
      "Preparation is part of the Friday sunnah. Abu Sa'id al-Khudri reported that the Messenger of Allah ﷺ said: 'Ghusl on Friday is obligatory upon every one who has reached puberty' (Sahih Muslim 846). A parallel wording in Sahih al-Bukhari (877) likewise ties Friday bathing to those who have reached puberty.",
      "Beyond ghusl, the Prophet ﷺ encouraged looking one's best. Salman al-Farisi reported that the Prophet ﷺ said: 'Whoever takes a bath on Friday, purifies himself as much as he can, then uses his (hair) oil or perfume, then goes out, and without squeezing between two persons sits in his place listening to the imam till he finishes, then prays what is prescribed for him — then his sins between that Friday and the next are forgiven' (Sahih al-Bukhari 883).",
      "Coming early multiplies the reward. Abu Hurayrah reported that whoever goes in the first hour is like one who offers a camel, then a cow, then a ram, then a chicken, then an egg — and when the imam comes out the angels fold their scrolls and listen to the reminder (Sahih al-Bukhari 881).",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "846",
        grade: "sahih",
        excerpt: "Ghusl on Friday is obligatory upon every one who has reached puberty.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "877",
        grade: "sahih",
        excerpt:
          "The taking of a bath on Friday is compulsory for every male Muslim who has attained the age of puberty.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "883",
        grade: "sahih",
        excerpt:
          "Whoever takes a bath on Friday, purifies himself as much as he can, then uses his oil or perfume, then goes out, and without squeezing between two persons sits in his place listening to the imam till he finishes, then prays what is prescribed for him — his sins between that Friday and the next are forgiven.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "881",
        grade: "sahih",
        excerpt:
          "Whoever takes a bath on Friday, then goes early (to the masjid), it is as if he has sacrificed a camel... then a cow... then a ram... then a chicken... then an egg. When the imam comes out, the angels present themselves to listen to the reminder.",
      },
    ],
    actions: [
      "Make ghusl on Friday morning (or before leaving for the masjid).",
      "Wear clean, modest best clothes and apply a light fragrance if able.",
      "Leave early — the earliest attendees earn the greatest reward.",
    ],
    appLinks: [{ label: "Learn Purification — Ghusl", route: "/taharah" }],
    disclaimer:
      "Whether Friday ghusl is a strict obligation or a strongly emphasised sunnah is a classical point of difference among the schools. All agree on its great virtue; follow the reliable practice of your community.",
  },
  {
    id: "surah-al-kahf",
    section: "kahf",
    title: "Surah al-Kahf on Friday",
    summary: "A light between the two Fridays, and protection in the first ten ayahs.",
    body: [
      "Reciting Surah al-Kahf (Qur'an 18) on Friday is a beloved weekly practice. Abu Sa'id al-Khudri reported that the Prophet ﷺ said: 'Whoever reads Surah al-Kahf on Friday, a light will shine for him between the two Fridays.' This wording is reported via al-Hakim and al-Bayhaqi and was graded sahih by Shaykh al-Albani; many communities follow it as an established Friday sunnah.",
      "Separately, the first ten ayahs of Surah al-Kahf are a shield against the tribulation of the Dajjal. Abu Darda' reported that the Prophet ﷺ said: 'Whoever memorises ten ayahs from the beginning of Surah al-Kahf will be protected from the Dajjal' (Sahih Muslim 809).",
      "Make time sometime between Thursday night and Friday Maghrib to read the surah — even if you cannot finish the whole chapter, begin with the opening ayahs and return as you are able.",
    ],
    quran: [
      {
        surah: 18,
        ayahFrom: 1,
        ayahTo: 10,
        label: "Qur'an 18:1–10",
        excerpt:
          "All praise is for Allah who revealed the Book to His servant and did not make therein any crookedness... Or have you thought that the companions of the cave and the inscription were among Our signs a wonder?",
      },
    ],
    hadith: [
      {
        collection: "Mustadrak al-Hakim / Bayhaqi",
        citation: "al-Kahf Friday",
        grade: "sahih",
        excerpt:
          "Whoever reads Surah al-Kahf on Friday, a light will shine for him between the two Fridays. (Graded sahih by al-Albani)",
      },
      {
        collection: "Sahih Muslim",
        citation: "809",
        grade: "sahih",
        excerpt:
          "Whoever memorises ten ayahs from the beginning of Surah al-Kahf will be protected from the Dajjal.",
      },
    ],
    actions: [
      "Open Surah al-Kahf on Friday and read what you can with presence of heart.",
      "Memorise or review the first ten ayahs for protection from the Dajjal.",
    ],
    appLinks: [{ label: "Read Surah al-Kahf", route: "/quran/18" }],
    disclaimer:
      "The 'light between Fridays' narration is not in the Six Books; it is widely accepted based on later authentication. The protection of the first ten ayahs (Muslim 809) is sahih without dispute.",
  },
  {
    id: "salawat-on-friday",
    section: "salawat",
    title: "Salawat upon the Prophet ﷺ on Friday",
    summary: "Increase blessings upon the Prophet ﷺ on the best day of the week.",
    body: [
      "Friday is singled out for abundant salawat. Aws ibn Aws reported that the Prophet ﷺ said: 'Among the best of your days is Friday; so increase your salawat upon me on it, for your salawat will be presented to me.' They said: 'O Messenger of Allah, how will our salawat be presented to you when you have decomposed?' He said: 'Allah has forbidden the earth to consume the bodies of the prophets' (Sunan Abi Dawud 1047).",
      "Any authentic formula of salawat counts — the duroods taught in the prayer, or longer forms from the Sunnah. The point is abundance and sincerity on Friday, not a single fixed count.",
    ],
    hadith: [
      {
        collection: "Sunan Abi Dawud",
        citation: "1047",
        grade: "sahih",
        excerpt:
          "Among the best of your days is Friday; so increase your salawat upon me on it, for your salawat will be presented to me.",
      },
    ],
    actions: [
      "Set a personal target of salawat on Friday — even a modest, consistent number.",
      "Use the duroods collection in the app if you want a ready formula.",
    ],
    appLinks: [{ label: "Duroods", route: "/duroods" }],
  },
  {
    id: "hour-of-acceptance",
    section: "dua",
    title: "The hour of acceptance",
    summary: "An hour on Friday when dua is not refused — seek it especially after Asr.",
    body: [
      "Abu Hurayrah reported that the Messenger of Allah ﷺ mentioned Friday and said: 'There is an hour on Friday in which no Muslim servant stands and asks Allah for something but He will give it to him' — and he indicated with his hand that it is short (Sahih al-Bukhari 935; also Sahih Muslim 852).",
      "Scholars differed on when exactly that hour falls. One strong opinion places it in the last part of Friday after Asr: Jabir ibn Abdullah reported that the Prophet ﷺ said: 'Friday is twelve hours, and there is an hour in it in which no Muslim servant asks Allah for anything but He will give it to him — so seek it in the last hour after Asr' (Sunan Abi Dawud 1048).",
      "Whatever view you follow, fill Friday — especially the late afternoon — with sincere dua, istighfar, and salawat, trusting Allah's promise of response.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "935",
        grade: "sahih",
        excerpt:
          "There is an hour on Friday in which no Muslim servant stands and asks Allah for something but He will give it to him — and he indicated with his hand that it is short.",
      },
      {
        collection: "Sahih Muslim",
        citation: "852",
        grade: "sahih",
        excerpt:
          "There is an hour on Friday in which no Muslim finds himself praying and asking Allah for something but He will give it to him.",
      },
      {
        collection: "Sunan Abi Dawud",
        citation: "1048",
        grade: "sahih",
        excerpt:
          "Friday is twelve hours, and there is an hour in it in which no Muslim servant asks Allah for anything but He will give it to him — so seek it in the last hour after Asr.",
      },
    ],
    actions: [
      "After Asr on Friday, sit with a short list of duas and ask with presence.",
      "Combine dua with salawat — both are emphasised on this day.",
    ],
    appLinks: [{ label: "Dua collection", route: "/dua" }],
    disclaimer:
      "The exact timing of the accepted hour is a matter of scholarly difference (during the khutbah, after Asr, and other views). The existence of the hour itself is established in Bukhari and Muslim.",
  },
];
