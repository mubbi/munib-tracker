import type { LearnGuideTopic } from "../types/learn-guide";

/**
 * Learn guide: ruqyah (Qur'anic/prophetic spiritual healing). Scholar-neutral,
 * mainstream Sunni teaching content drawn only from the Qur'an and authentic,
 * checkable hadith (sunnah.com numbering). Deliberately skips the olive-oil
 * folk "protocols" and unsourced lists of "signs of being affected" that
 * circulate online without a hadith basis — those are left out entirely
 * rather than repeated with a disclaimer. Verse citations are by surah/ayah
 * with short excerpts only; the app's own Qur'an reader is the source for
 * full text, so long passages are never re-transcribed here. Bump the
 * version when content changes so any cache/test notices.
 */
export const RUQYAH_CONTENT_VERSION = 1;

export const RUQYAH_SECTION_ORDER = ["basics", "verses", "daily-protection", "reminders"] as const;

export const RUQYAH_TOPICS: LearnGuideTopic[] = [
  {
    id: "what-is-ruqyah",
    section: "basics",
    title: "What is ruqyah?",
    summary: "Reciting Qur'an, Allah's Names, or prophetic du'a for healing.",
    body: [
      "Ruqyah is the practice of reciting Qur'an, the Names and Attributes of Allah, or authentic prophetic supplications over oneself or another person — often with a light blow of breath — seeking healing or protection from Allah alone. It predates Islam as a general Arab custom of incantation, and the Prophet ﷺ was asked directly whether it was permissible.",
      "'Awf ibn Malik reported that the companions said: 'We used to practise ruqyah in the pre-Islamic days; what is your view on it?' The Prophet ﷺ replied: 'Show me your ruqyah — there is no harm in ruqyah so long as it does not contain shirk' (Sahih Muslim 2200). This single hadith is the foundation for everything else in this guide: ruqyah itself is permissible; what matters is its content.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2200",
        grade: "sahih",
        excerpt:
          "We used to practise ruqyah in the pre-Islamic days, and we said: O Messenger of Allah, what is your view on that? He said: Show me your ruqyah — there is no harm in ruqyah so long as it does not contain shirk.",
      },
    ],
  },
  {
    id: "halal-vs-haram",
    section: "basics",
    title: "Halal vs. haram ruqyah",
    summary: "Qur'an, Allah's Names, and clear du'a — never shirk or the unseen.",
    body: [
      "Lawful ruqyah rests on the conditions scholars have drawn from the hadith: it uses the Qur'an, Allah's Names and Attributes, or an authentic prophetic supplication; it is in a language whose meaning is understood (not unknown syllables or symbols); and the person reciting and the person being treated both believe the ruqyah itself has no power — healing is from Allah alone, and the words are only a means He has permitted.",
      "The Prophet ﷺ modelled this personally: Aisha reported that whenever he fell ill, he would recite the Mu'awwidhat (the last two surahs) over himself and blow his breath, and when his final illness worsened, she would do the same for him, wiping his body with his own hand hoping for its blessing (Bukhari 5016). This is ruqyah in its clearest, most authentic form.",
      "Ruqyah becomes unlawful when it crosses into shirk: calling on anyone besides Allah, seeking help from jinn, using unknown words or symbols whose meaning is unclear, hanging amulets or charms, or claiming the ruqyah practitioner has knowledge of the unseen or a guaranteed cure. It is also never a substitute for the five daily prayers or for seeking appropriate medical treatment — it complements both rather than replacing either.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "5016",
        grade: "sahih",
        excerpt:
          "Whenever Allah's Messenger ﷺ became sick, he would recite the Mu'awwidhat and then blow his breath over his body. When he became seriously ill, I used to recite them and wipe his body with his hand, hoping for its blessing.",
      },
    ],
    disclaimer:
      "Ruqyah is a spiritual practice, not a medical treatment. It does not replace seeing a qualified doctor for physical or mental illness, nor does it replace the five daily prayers.",
  },
  {
    id: "fatiha-ruqyah",
    section: "verses",
    title: "Surat al-Fatiha as ruqyah",
    summary: "The opening surah — explicitly confirmed as valid ruqyah.",
    body: [
      "Abu Sa'id al-Khudri narrated that when a tribal chief was bitten by a snake, one of the Prophet's ﷺ companions recited Surat al-Fatiha over him and he was cured. When the companions later asked the Prophet ﷺ whether this was permissible, he smiled and said: 'How do you know it is a ruqyah?' — confirming that al-Fatiha, recited with sincere belief and understanding, is itself valid ruqyah (Bukhari 5736).",
      "This app's Qur'an reader carries the full text and translation of al-Fatiha; this guide only points to it as a source of ruqyah rather than reproducing it here.",
    ],
    quran: [
      {
        surah: 1,
        ayahFrom: 1,
        ayahTo: 7,
        label: "Qur'an 1 (Al-Fatiha)",
        excerpt: "In the name of Allah, the Most Gracious, the Most Merciful...",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "5736",
        grade: "sahih",
        excerpt:
          "One of them started reciting Surat al-Fatiha... the patient was cured. When they asked the Prophet ﷺ, he smiled and said: How do you know that al-Fatiha is a ruqyah?",
      },
    ],
    appLinks: [{ label: "Read Al-Fatiha", route: "/quran" }],
  },
  {
    id: "ayat-al-kursi",
    section: "verses",
    title: "Ayat al-Kursi (2:255)",
    summary: "The Throne Verse — recited at night for Allah's protection.",
    body: [
      "Ayat al-Kursi (Qur'an 2:255) describes Allah's absolute sovereignty and is widely recited for protection, especially before sleep. Abu Huraira narrated that a nightly visitor stealing from the Zakat he was guarding told him: 'Whenever you go to bed, recite Ayat al-Kursi — a guardian from Allah will stay with you, and no shaytan will approach you until morning.' When the Prophet ﷺ heard this, he confirmed: 'He told you the truth, though he is a liar — that was a shaytan' (Bukhari 5010).",
      "As with other verses in this guide, only a short excerpt is given here; read the full verse and its translation in the app's Qur'an reader.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 255,
        label: "Qur'an 2:255",
        excerpt:
          "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "5010",
        grade: "sahih",
        excerpt:
          "Whenever you go to your bed, recite Ayat al-Kursi — a guard from Allah will protect you all night, and no shaytan will come near you until morning.",
      },
    ],
    appLinks: [{ label: "Read Ayat al-Kursi", route: "/quran" }],
  },
  {
    id: "three-surahs",
    section: "verses",
    title: "Al-Ikhlas, Al-Falaq & An-Nas (112–114)",
    summary: "The three closing surahs — the Prophet's ﷺ nightly ruqyah.",
    body: [
      "Aisha described the Prophet's ﷺ nightly routine: every night before sleeping he would cup his hands together, recite Surat al-Ikhlas, Surat al-Falaq, and Surat an-Nas, blow into his hands, and wipe them over his body — starting with his head and face — repeating this three times (Bukhari 5017). These same three surahs (Al-Ikhlas affirming Allah's oneness, and the two Mu'awwidhat seeking refuge from evil) are also what he recited over himself during illness (Bukhari 5016).",
      "Together they form one of the simplest and most authentic daily ruqyah routines available — short enough to memorise, and directly attested in the Sunnah.",
    ],
    quran: [
      {
        surah: 112,
        ayahFrom: 1,
        ayahTo: 4,
        label: "Qur'an 112 (Al-Ikhlas)",
        excerpt: "Say: He is Allah, [who is] One.",
      },
      {
        surah: 113,
        ayahFrom: 1,
        ayahTo: 5,
        label: "Qur'an 113 (Al-Falaq)",
        excerpt: "Say: I seek refuge in the Lord of daybreak.",
      },
      {
        surah: 114,
        ayahFrom: 1,
        ayahTo: 6,
        label: "Qur'an 114 (An-Nas)",
        excerpt: "Say: I seek refuge in the Lord of mankind.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "5017",
        grade: "sahih",
        excerpt:
          "Whenever the Prophet ﷺ went to bed, he used to cup his hands together and blow over them after reciting Surat al-Ikhlas, al-Falaq and an-Nas, then rub his hands over whatever parts of his body he could, starting with his head and face. He used to do that three times.",
      },
    ],
    actions: [
      "Memorise Al-Ikhlas, Al-Falaq, and An-Nas.",
      "Recite them each night before sleeping, as the Prophet ﷺ did.",
    ],
    appLinks: [{ label: "Read the three surahs", route: "/quran" }],
  },
  {
    id: "daily-protection",
    section: "daily-protection",
    title: "Daily protection: morning & evening adhkar",
    summary: "The sustained, everyday form of ruqyah for protection.",
    body: [
      "Beyond ruqyah for a specific ailment, the Prophet ﷺ taught a set of morning and evening remembrances (adhkar) that function as ongoing spiritual protection — many of them the very same verses covered in this guide (Ayat al-Kursi, the three closing surahs) alongside other authentic du'a. Reciting them consistently, rather than only reaching for ruqyah when something feels wrong, is the Sunnah way to seek Allah's protection every single day.",
      "This app's adhkar library carries the full, sourced collection of morning and evening remembrances in one place, ready to read or track daily.",
    ],
    actions: [
      "Recite the morning adhkar after Fajr.",
      "Recite the evening adhkar before Maghrib/sunset.",
    ],
    appLinks: [{ label: "Morning & evening adhkar", route: "/zikr" }],
  },
  {
    id: "avoid-fortune-tellers",
    section: "reminders",
    title: "Avoid fortune-tellers and soothsayers",
    summary: "Seeking the unseen from anyone but Allah is a serious warning.",
    body: [
      "Islam draws a hard line between authentic ruqyah and consulting fortune-tellers, soothsayers, astrologers, or anyone claiming to know the unseen (ghayb) or to lift a spiritual affliction through non-Islamic means. The Prophet ﷺ warned: 'Whoever visits a fortune-teller (arraf) and asks him about anything, his prayer will not be accepted for forty nights' (Sahih Muslim 2230) — a severe warning against even testing such claims out of curiosity.",
      "If a person also believes the fortune-teller's claims about the unseen, scholars treat this as a matter of disbelief, since only Allah has knowledge of the unseen (Qur'an 27:65). Whatever difficulty prompts someone to consider such a person, the correct response in this guide's teaching is always to turn to authentic ruqyah, du'a, and trusted medical or scholarly help — never to those who claim hidden knowledge.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2230",
        grade: "sahih",
        excerpt:
          "Whoever visits a fortune-teller (arraf) and asks him about anything, his prayer will not be accepted for forty nights.",
      },
    ],
    actions: [
      "Never consult fortune-tellers, astrologers, or those who claim knowledge of the unseen.",
    ],
  },
  {
    id: "tawakkul",
    section: "reminders",
    title: "Tawakkul — reliance on Allah alone",
    summary: "Ruqyah is a means; the cure and the outcome belong to Allah.",
    body: [
      "The final and most important reminder in this guide is tawakkul: sincere reliance on Allah while using the permitted means He has given. Reciting ruqyah, seeking medical care, and asking others to pray for you are all legitimate means — but the heart's trust must rest in Allah alone, not in the words recited or the person reciting them. This mirrors exactly the condition in the very first hadith of this guide: 'There is no harm in ruqyah so long as it does not contain shirk' (Sahih Muslim 2200).",
      "This guide has deliberately left out the folk 'protocols' and symptom checklists that circulate widely online — none of these have a strong basis in the Qur'an or authentic Sunnah, and relying on them can quietly shift a person's trust away from Allah and toward a ritual or a list of guesses. Keep to what is textually grounded, and leave the rest to Allah's decree.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2200",
        grade: "sahih",
        excerpt: "There is no harm in ruqyah so long as it does not contain shirk.",
      },
    ],
    disclaimer:
      "This is general educational content summarising mainstream Sunni teaching from the Qur'an and authentic hadith. It is not a fatwa, and it is not a medical or psychological treatment. For serious or persistent affliction, consult both a qualified local scholar and an appropriate medical professional.",
  },
];
