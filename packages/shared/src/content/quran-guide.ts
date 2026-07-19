import type { QuranGuideTopic } from "../types/quran-guide";

export { QURAN_GUIDE_APPLY_CHALLENGES } from "./quran-guide-apply";
export {
  AL_FATIHA_PRACTICE_AUDIO,
  QURAN_GUIDE_AUDIO_VERSION,
  QURAN_GUIDE_EXAMPLE_AUDIO,
  QURAN_GUIDE_GLYPH_AUDIO_URI,
  QURAN_GUIDE_LETTER_AUDIO_URI,
  QURAN_GUIDE_MEMORIZATION_LISTEN,
  resolveExampleAudio,
  resolveGlyphAudioUri,
  resolveLetterAudioUri,
} from "./quran-guide-audio";
export { QURAN_GUIDE_DAILY_LESSONS } from "./quran-guide-daily";
export { QURAN_GUIDE_READING_LEVELS } from "./quran-guide-learn-to-read";
export { QURAN_GUIDE_LETTERS } from "./quran-guide-letters";
export { QURAN_GUIDE_MEMORIZATION_PLANS } from "./quran-guide-memorization";
export { QURAN_GUIDE_PRONUNCIATION } from "./quran-guide-pronunciation";
export { QURAN_GUIDE_QUIZ } from "./quran-guide-quiz";
export { QURAN_GUIDE_STORIES } from "./quran-guide-stories";
export { QURAN_GUIDE_STRUCTURE_LEVELS } from "./quran-guide-structure";
export { QURAN_GUIDE_TADABBUR_PROMPTS } from "./quran-guide-tadabbur";
export { QURAN_GUIDE_TAJWEED } from "./quran-guide-tajweed";
export { QURAN_GUIDE_THEMES } from "./quran-guide-themes";
export { QURAN_GUIDE_TIMELINE } from "./quran-guide-timeline";
export { QURAN_GUIDE_VOCABULARY } from "./quran-guide-vocabulary";

/**
 * Learn Qur'an — authentic knowledge journey: Read → Understand → Reflect →
 * Memorize → Practice → Live. Scholar-neutral; cites Qur'an, graded hadith,
 * and named tafsir. Bump version on content change.
 */
export const QURAN_GUIDE_CONTENT_VERSION = 3;

export const QURAN_GUIDE_JOURNEY_ORDER = [
  "read",
  "understand",
  "reflect",
  "memorize",
  "practice",
  "live",
  "evidence",
] as const;

export const QURAN_GUIDE_TOPICS: QuranGuideTopic[] = [
  {
    id: "introduction",
    journey: "read",
    title: "Introduction",
    summary: "What is the Qur'an, why it was revealed, and virtues of recitation.",
    importance: "foundational",
    body: [
      "The word Qur'an comes from the Arabic root qara'a, meaning to recite or to read aloud — so the Book carries its purpose in its very name: it is meant to be recited, again and again, on the tongue and in the heart. In mainstream Sunni belief the Qur'an is the literal, uncreated speech of Allah, revealed in clear Arabic to the Prophet Muhammad ﷺ through the angel Jibreel over roughly 23 years, from the first words in Cave Hira until shortly before the Prophet's ﷺ passing.",
      "It is the final scripture sent to humanity, confirming the truth in the earlier revelations given to Musa, Dawud, and Isa (peace be upon them) and completing the message they carried. Allah describes its purpose plainly: it was sent down 'as guidance for mankind' — to bring people out of the darkness of confusion and idolatry into the light of tawheed, sincere worship of Allah alone, upright character, and serious preparation for the life to come. Every prophet called to that same core; the Qur'an is its final, protected form.",
      "Reciting the Qur'an is itself an act of worship, not merely reading information. The Prophet ﷺ taught that every single letter recited earns a good deed, and each good deed is multiplied at least tenfold — so even a beginner sounding out one line is already accumulating reward. On the Day of Resurrection the Qur'an will come as an intercessor, pleading on behalf of those who kept its company in this life. The one who recites it fluently is in the company of the noble angel-scribes, and the one who stumbles over it, struggling to learn, earns a double reward for the effort.",
      "It helps to be clear on what the Qur'an is not. The Qur'an is Allah's own verbatim words in Arabic, unchanged since revelation. The hadith — the Prophet's ﷺ sayings, actions, and silent approvals — are separate: they explain and demonstrate the Qur'an but are the Prophet's ﷺ expression, preserved through named chains of narrators and graded by scholars as sahih (authentic), hasan (good), or da'if (weak). Both are revelation and both are binding, but only the Qur'an is recited as worship in prayer, and only the Qur'an is the miraculous, inimitable speech of Allah.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 185,
        label: "Qur'an 2:185",
        excerpt: "The month of Ramadan in which the Qur'an was revealed as guidance for mankind…",
      },
      {
        surah: 17,
        ayahFrom: 88,
        label: "Qur'an 17:88",
        excerpt:
          "Say: If mankind and jinn gathered to produce the like of this Qur'an, they could not…",
      },
    ],
    hadith: [
      {
        collection: "Jami' at-Tirmidhi",
        citation: "Hadith 2910",
        grade: "hasan",
        excerpt:
          "Whoever recites a letter from the Book of Allah receives a hasanah, and the hasanah is multiplied by ten.",
      },
      {
        collection: "Sahih Muslim",
        citation: "Hadith 804a",
        grade: "sahih",
        excerpt:
          "Read the Qur'an, for it will come as an intercessor for its companions on the Day of Resurrection.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 4937",
        grade: "sahih",
        excerpt:
          "The one who is proficient in the Qur'an is with the noble, righteous scribes, and the one who recites it with difficulty, stammering over it, has a double reward.",
      },
    ],
    actions: [
      "Set a fixed daily time for Qur'an — even five focused minutes builds barakah and consistency.",
      "Read at least one line with meaning: recite the Arabic, then read the translation slowly.",
      "Open Munib's Qur'an reader and continue exactly where you left off.",
    ],
    appLinks: [
      { label: "Read Qur'an", route: "/quran" },
      { label: "Daily lesson", route: "/learn-quran/daily" },
    ],
  },
  {
    id: "revelation",
    journey: "read",
    title: "How the Qur'an was revealed",
    summary: "Cave of Hira, Jibreel, Makkan and Madinan periods, compilation, preservation.",
    importance: "foundational",
    body: [
      "Revelation began in the month of Ramadan, when the Prophet ﷺ was forty years old and had withdrawn to the Cave of Hira on a mountain outside Makkah for solitude and reflection. There the angel Jibreel came to him and commanded, 'Read!' The Prophet ﷺ, who did not read or write, answered that he could not — until the angel embraced him and conveyed the first five verses of Surah al-Alaq: 'Read in the name of your Lord who created.' Shaken, he returned home to his wife Khadijah, who reassured him and took him to her relative Waraqah ibn Nawfal, a learned man who recognised the angel of revelation and confirmed this was the same messenger who had come to Musa.",
      "There followed a brief pause in revelation (the fatrah), a period of quiet that made the Prophet ﷺ long for more; then it resumed and continued in stages for the rest of his life. Revelation did not descend all at once but was sent down in response to events, questions, and the growing needs of the community — a gradual method Allah describes as strengthening the Prophet's ﷺ heart and easing the Book into people's lives.",
      "The Makkan period lasted roughly thirteen years. Its surahs are often short, rhythmic, and powerful; they hammer home the foundations — the oneness of Allah, the certainty of resurrection and accountability, the stories of earlier prophets who were rejected then vindicated, and a sweeping call to moral reform in a society steeped in idolatry and injustice.",
      "After the Hijra to Madinah in 622 CE, the Muslims were no longer a persecuted few but a community building a society. The Madinan revelations are generally longer and more detailed, laying down the law and social order the new ummah needed: the specifics of salah, zakat, fasting, inheritance, marriage and divorce, contracts, warfare, and treaties, alongside firm words for the hypocrites who undermined the community from within.",
      "Preservation of the text began in the Prophet's ﷺ own lifetime. The companions memorised the revelation as it came, and scribes wrote it down on parchment, palm-stalks, bone, and stone under the Prophet's ﷺ direct supervision. After many memorisers were martyred at the Battle of Yamama, Abu Bakr ordered Zayd ibn Thabit to gather the written Qur'an into a single collection (the suhuf). Later, as the empire spread and dialects varied, Uthman had authoritative copies made in the dialect of the Quraysh and sent to the major cities, standardising one written text for the whole ummah.",
      "Allah Himself guaranteed the Qur'an's protection: 'Indeed, We sent down the Reminder, and indeed We will preserve it.' That promise has been fulfilled through three interlocking safeguards — mass memorisation in every generation, careful written transmission, and unbroken teacher-to-student chains of recitation (qira'at) reaching back to the Prophet ﷺ. For the believer this is a theological sign; for the historian it is a documented fact: the Qur'an recited today is the same text revealed fourteen centuries ago.",
    ],
    quran: [
      {
        surah: 15,
        ayahFrom: 9,
        label: "Qur'an 15:9",
        excerpt: "Indeed, We have sent down the Reminder and indeed, We will preserve it.",
      },
      {
        surah: 96,
        ayahFrom: 1,
        ayahTo: 5,
        label: "Qur'an 96:1–5",
        excerpt: "Read in the name of your Lord who created…",
      },
    ],
    appLinks: [
      { label: "Revelation timeline", route: "/learn-quran/revelation" },
      { label: "Seerah", route: "/seerah" },
    ],
  },
  {
    id: "structure",
    journey: "read",
    title: "Structure of the Qur'an",
    summary: "114 surahs, 30 juz, ayahs, Makki/Madani, order vs revelation.",
    importance: "foundational",
    body: [
      "The mus'haf — the physical copy of the Qur'an — contains 114 surahs (chapters), each with its own name, usually taken from a striking word within it. They are arranged mostly from longest to shortest, though not strictly: Al-Fatiha, the short opening chapter, comes first as the gateway to the Book, and the long Al-Baqarah follows. This arrangement is tawqifi — the order was taught to the Prophet ﷺ by Jibreel and is not the order in which the verses were revealed. So the sequence you read in the mus'haf is deliberate and divinely fixed, not chronological.",
      "Every surah is classified as Makki (revealed before the Hijra) or Madani (revealed after it), and a few contain verses of both. As a rule of thumb, Makki surahs concentrate on belief — tawhid, the resurrection, and stories of the prophets — in shorter, more urgent passages, while Madani surahs add the detailed legislation and community guidance a settled society needs. Knowing which is which helps you read a surah in its proper light.",
      "For manageable reading, the Qur'an is also divided into 30 equal parts called juz (plural ajza'), and each juz into two halves called hizb, giving 60 hizb in total. This is what makes a Ramadan khatm — completing the whole Qur'an in a month — so natural: one juz a day finishes the Book in thirty days, and a half-juz twice daily is gentler still. Within each surah the ayahs (verses) are numbered so any passage can be cited precisely as surah:ayah; the standard Madinah count is 6,236 ayahs, with only tiny, well-documented differences in how a few verse-boundaries are numbered — the text itself is identical.",
      "Understanding this structure turns vague intentions into a concrete plan. You can commit to a fixed daily portion, target Juz Amma (the last, thirtieth part, full of short surahs) for memorisation, follow a single theme such as patience across several surahs, or schedule a complete reading around Ramadan. Structure is the scaffolding that makes a lifelong relationship with the Qur'an achievable.",
    ],
    quran: [
      {
        surah: 25,
        ayahFrom: 32,
        label: "Qur'an 25:32",
        excerpt: "…a Book whose verses are detailed, an Arabic Qur'an for a people who know.",
      },
    ],
    appLinks: [
      { label: "Structure visual", route: "/learn-quran/structure" },
      { label: "Browse surahs", route: "/quran" },
    ],
  },
  {
    id: "learn-to-read",
    journey: "practice",
    title: "Learn to read",
    summary: "Seven levels from alphabet to fluent recitation — for absolute beginners.",
    importance: "foundational",
    body: [
      "Almost every Muslim longs to read the Qur'an in its original Arabic, and it is a goal fully within reach at any age — countless adults with no prior Arabic learn to recite fluently. Understanding a translation is valuable, but reciting the actual Arabic words is itself worship, and it is worth the effort. This path takes you step by step from not recognising a single letter to reading verses with correct pronunciation.",
      "The journey moves through seven natural stages. Levels 1 and 2 build letter recognition — first the 28 letters in their isolated form, then how their shapes change at the start, middle, and end of a word. Level 3 introduces the harakat, the small marks (fatha, kasra, damma, sukun, shaddah, tanween) that tell you which vowel each letter carries. Levels 4 and 5 are where it clicks: you join letters into syllables and sound out whole words, including the sun and moon letter rules for the definite article 'al-'. Levels 6 and 7 move to short verses and then smooth, fluent recitation with the basic rules of tajweed applied.",
      "Two habits accelerate everything. First, listen constantly to a qualified reciter and imitate exactly — the Qur'an was passed down by ear, from mouth to mouth, so your ear is your best teacher; copy the rhythm, the length of vowels, and the shape of each sound. Second, trace and write the letters, on paper or screen, because the hand reinforces what the eye and tongue are learning.",
      "One caution: apps and recordings are excellent support, but they cannot correct you the way a person can. The Prophet ﷺ learned the Qur'an directly from Jibreel and taught it face to face to the companions, and that living chain of correction is how accurate recitation has always been preserved. Find a local teacher or a structured online tajweed programme to listen to you and fix mistakes you cannot hear yourself.",
    ],
    actions: [
      "Study one letter a day in the Arabic letters section — see it, hear it, say it, write it.",
      "Listen to Surah al-Fatiha on repeat while following the words in a mushaf.",
      "Arrange a teacher — local or online — to hear you recite and correct you weekly.",
    ],
    appLinks: [
      { label: "Reading levels", route: "/learn-quran/learn-to-read" },
      { label: "Arabic letters", route: "/learn-quran/letters" },
    ],
    comingSoon: false,
  },
  {
    id: "tajweed",
    journey: "practice",
    title: "Tajweed",
    summary: "Rules of beautiful and correct recitation — noon sakin, madd, waqf, and more.",
    importance: "highly-recommended",
    body: [
      "Tajweed comes from a root meaning to make something excellent or beautiful. As a science it means giving every letter its due — its correct point of articulation in the mouth or throat (makhraj), its inherent qualities (sifat), and the proper timing of vowels and pauses. In short, tajweed is the art of reciting the Qur'an exactly as it was revealed.",
      "This matters because the Qur'an is not just any text to be read casually. It came down with tajweed already built in: Jibreel recited it to the Prophet ﷺ with precise pronunciation, the Prophet ﷺ recited it the same way to the companions, and they passed it on unbroken to us. Getting a letter wrong is not a small thing — mispronouncing a letter can change a word entirely (for example confusing the emphatic ص with a plain س, or the throat letters ع and ح), and in some places that alters the meaning of Allah's words. The science of tajweed exists to guard against exactly that.",
      "You do not need to master everything at once. The core rules are learned in order: the rulings of noon sakinah and tanween (izhar, idgham, iqlab, ikhfa), the rulings of meem sakinah, the different kinds of madd (elongation), qalqalah (the light bounce on certain letters), ghunnah (nasal resonance), and waqf (where and how to stop). Each has a clear definition, everyday examples, and something to practise, and this hub walks through them one at a time.",
      "A firm rule of thumb: learn tajweed by ear from a qualified teacher, not from books or apps alone. Recite to someone who can hear your mistakes and correct them — this is how tajweed has always been taught, and it is the only reliable path to real accuracy and, eventually, an ijazah (a certified chain of recitation).",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 5027",
        grade: "sahih",
        excerpt: "The best of you are those who learn the Qur'an and teach it.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 4937",
        grade: "sahih",
        excerpt:
          "The one who is proficient in the Qur'an is with the noble, righteous scribes, and the one who recites it with difficulty, stammering over it, has a double reward.",
      },
    ],
    appLinks: [{ label: "Tajweed lessons", route: "/learn-quran/tajweed" }],
  },
  {
    id: "arabic-letters",
    journey: "practice",
    title: "Arabic letters",
    summary: "Interactive alphabet — name, sound, examples for each of 28 letters.",
    importance: "foundational",
    body: [
      "The Arabic alphabet has 28 letters, written and read from right to left. Unlike English, most letters connect to the ones beside them, so a single letter can take a slightly different shape depending on whether it stands alone or sits at the start, middle, or end of a word. Learning to spot the same letter in its different forms is one of the first real breakthroughs.",
      "Qur'anic Arabic layers a few extra features on top of the basic letters: the hamza (a glottal stop), the long-vowel letters alif, waw, and ya that stretch a sound, and the sun and moon letter rule that decides whether the 'l' of the definite article 'al-' is pronounced or silently merged into the next letter. These are simple once you meet them in real words.",
      "Each letter card in this section gives you the isolated form of the letter, its name, a transliteration, a practical pronunciation tip, and real Qur'anic examples so you learn the sound in context rather than in the abstract. The most effective routine is a four-step loop for every letter: see it, hear it recited, say it aloud yourself, then write it.",
      "Anchor each new letter to words you may already recognise — Allah, Rabb (Lord), ar-Rahman (the Most Merciful), Bismillah. Connecting unfamiliar shapes to familiar meaning makes them stick far faster than drilling letters in isolation.",
    ],
    appLinks: [
      { label: "Letter browser", route: "/learn-quran/letters" },
      { label: "Pronunciation guide", route: "/learn-quran/pronunciation" },
    ],
  },
  {
    id: "pronunciation",
    journey: "practice",
    title: "Pronunciation",
    summary: "Master difficult letters — ayn, ha, sad, dad, qaf, and emphatics.",
    importance: "recommended",
    body: [
      "Arabic contains several sounds that have no exact equivalent in English, and this is where non-native speakers most often slip. The commonest confusions are between letters that sound alike to an untrained ear but are pronounced from different places in the mouth or throat — and mixing them up can change the meaning of a word, which is why they deserve dedicated practice.",
      "The emphatic letters — ṣ (ص), ḍ (ض), ṭ (ط), and ẓ (ظ) — are 'heavy' versions of lighter letters. To produce them you raise the back of the tongue and fill the mouth with a fuller, deeper sound, something native speakers absorb in childhood but learners must build consciously. Compare each emphatic directly with its light counterpart: س against ص, د against ض, ت against ط, ذ against ظ.",
      "The throat letters are the other big hurdle. Ayn (ع) is a voiced constriction from the middle of the throat, and ha (ح) is a strong, breathy friction — neither exists in English, and no written description fully substitutes for hearing them. Qaf (ق) is a deep 'k' from the very back of the tongue, distinct from the forward kaf (ك).",
      "The reliable method is to compare pairs side by side, then check yourself against a slow, clear murattal recitation. Record your own voice reciting a short word, play it against the reciter, and adjust. Even better, have a qualified teacher listen — some errors are almost impossible to catch in your own recording.",
    ],
    appLinks: [{ label: "Letter comparisons", route: "/learn-quran/pronunciation" }],
  },
  {
    id: "vocabulary",
    journey: "understand",
    title: "Qur'anic vocabulary",
    summary: "High-frequency words — understand more every time you recite.",
    importance: "highly-recommended",
    body: [
      "Here is an encouraging fact: a relatively small set of high-frequency words — on the order of a few hundred — accounts for a very large share of the running text of the Qur'an, because the same key words recur again and again. Learning that core vocabulary is the single highest-leverage step you can take, because it transforms recitation from a stream of sound into words whose meaning you actually catch as you read.",
      "You do not translate the Qur'an word for word this way — that is the work of tafsir and translation — but you begin to recognise Allah's names, the commands, the promises, and the warnings live, in the moment of reciting. Start with the words that appear most and carry the most weight: Allah, Rabb (Lord), rahmah (mercy), iman (faith), sabr (patience), taqwa (God-consciousness), dunya (this world), and akhirah (the Hereafter). From that anchor set, expand outward a little at a time.",
      "Use spaced repetition rather than cramming. Learning five new words a week and reviewing all of them daily will take you far further in a year than memorising fifty in one sitting and forgetting them. Allah promises that the Qur'an has been made easy to take to heart — approach its vocabulary steadily and you will feel that ease firsthand.",
    ],
    quran: [
      {
        surah: 54,
        ayahFrom: 17,
        label: "Qur'an 54:17",
        excerpt:
          "And We have certainly made the Qur'an easy for remembrance, so is there any who will remember?",
      },
    ],
    appLinks: [{ label: "Vocabulary list", route: "/learn-quran/vocabulary" }],
  },
  {
    id: "tafsir",
    journey: "understand",
    title: "Tafsir",
    summary: "Understanding revelation — overview, context, and recognised scholarly sources.",
    importance: "foundational",
    body: [
      "Tafsir means the explanation and interpretation of the Qur'an — clarifying what a verse means, why it was revealed, and how it applies. Because these are Allah's words, the scholars established a strict order of authority for how the Qur'an should be explained, and staying within it protects you from error.",
      "The soundest tafsir is the Qur'an explaining itself: a verse that is brief in one place is often expanded elsewhere, so the Qur'an is its own best commentary. Next comes explanation by the Sunnah, since the Prophet ﷺ was sent precisely to make the revelation clear and his words and practice show us how it was lived. After that comes the understanding of the companions, who witnessed the revelation and knew its context directly, followed by the great scholars who came after them. Last and lowest is interpretation by the Arabic language itself. What has no place at all is unqualified personal opinion — reading your own ideas into the text.",
      "A key tool in tafsir is asbab al-nuzul, the occasions of revelation: knowing the event or question that prompted a verse often unlocks its meaning. But these reports must themselves be authenticated, since not every narrated 'occasion' is reliable. For each surah, good tafsir gives you its historical setting where established, its major themes, its pivotal verses, and the practical lessons to carry away.",
      "Among the most recognised and trustworthy references are Tafsir Ibn Kathir (comprehensive and careful to cite hadith and the sayings of the early generations), Tafsir as-Sa'di (clear, contemporary, and focused on practical guidance), and the classical Tafsir al-Tabari (encyclopaedic, preserving the earliest interpretations). Whenever you learn a meaning, note which source it came from. This hub teaches the methodology; use Munib's Qur'an reader, which links bundled and remote tafsir, for verse-by-verse study.",
    ],
    sources: [
      "Tafsir Ibn Kathir — abridged English widely available",
      "Tafsir as-Sa'di — accessible summaries",
      "Asbab al-Nuzul by al-Wahidi — revelation occasions (verify authenticity per incident)",
    ],
    disclaimer:
      "Tafsir varies in depth. When scholars differ, note the difference without claiming certainty where Allah did not make it clear.",
    appLinks: [{ label: "Open Qur'an reader", route: "/quran" }],
  },
  {
    id: "themes",
    journey: "understand",
    title: "Themes of the Qur'an",
    summary: "Faith, prayer, patience, charity, prophets — verses grouped by topic.",
    importance: "recommended",
    body: [
      "The Qur'an is not laid out like a textbook, one subject per chapter. Instead its great themes — the oneness of Allah, prayer, patience, charity, the prophets, the Hereafter, justice, family — are woven throughout, appearing and reappearing across many surahs, each time from a fresh angle. What looks at first like repetition is actually reinforcement: a theme is introduced, then deepened, then connected to another, until the whole message stands as one coherent call.",
      "Studying the Qur'an by theme reveals that unity. When you gather what the Qur'an says about, say, gratitude or trust in Allah from across its surahs, the separate verses illuminate each other and the lesson becomes vivid and complete. Each theme entry in this hub pulls together the relevant verses, supporting authentic hadith where they add clarity, the core lessons, and concrete actions so the knowledge does not stay theoretical.",
      "Above all, connect the themes to your own life. Kindness to parents, honesty in business, fairness in marriage, standing for justice even against your own interest — these are not abstract chapters to admire but daily decisions the Qur'an is asking you to make. Read each theme as a question directed personally at you: how does this change what I do today?",
    ],
    appLinks: [{ label: "Browse themes", route: "/learn-quran/themes" }],
  },
  {
    id: "stories",
    journey: "understand",
    title: "Stories in the Qur'an",
    summary: "Prophets from Adam to Muhammad ﷺ — lessons, locations, related verses.",
    importance: "recommended",
    body: [
      "The Qur'an tells the stories of the prophets — Adam, Nuh, Ibrahim, Yusuf, Musa, Isa, and many others — and it tells us plainly why: 'In their stories is a lesson for those of understanding.' These accounts are not folklore or entertainment. They are instruction, chosen and told by Allah to teach faith, patience, and how to face the same trials that recur in every age.",
      "Notice the pattern that runs through them. Prophets called their people to the worship of Allah alone; they were mocked, opposed, and often driven out; they endured with patience and complete reliance on Allah (tawakkul); and in the end Allah's promise came true. When you read of their hardships, draw strength from how they responded — without ever imagining your rank equals theirs. The point is to absorb their steadfastness and trust, not to compare status.",
      "The Qur'an itself singles out one narrative: Surah Yusuf, which Allah calls 'the best of stories'. Unusually, it is told from beginning to end in a single surah, so read it in one sitting as a continuous journey — betrayal, patience through slavery and prison, and finally forgiveness and reunion — and watch how Allah's plan unfolds behind years of apparent misfortune.",
    ],
    quran: [
      {
        surah: 12,
        ayahFrom: 111,
        label: "Qur'an 12:111",
        excerpt: "In their stories is certainly a lesson for those of understanding…",
      },
    ],
    appLinks: [{ label: "Prophet stories", route: "/learn-quran/stories" }],
  },
  {
    id: "miracles",
    journey: "understand",
    title: "Miracles of the Qur'an",
    summary: "Linguistic inimitability, preservation, prophecies — with scholarly caution.",
    importance: "recommended",
    body: [
      "The central miracle of the Qur'an is the Qur'an itself. Revealed to an unlettered man in the most eloquent age of Arabic poetry, it issued an open challenge to its fiercest opponents — masters of the language — to produce even a single surah like it. Fourteen centuries later that challenge stands unmet. Its rhetorical power, its structure, the way its themes interlock, and the coherence of its guidance and law are studied in the classical science of eloquence (ilm al-balagha), and they remain, by the Qur'an's own claim, inimitable.",
      "Its preservation is a second, verifiable sign. The text has been protected both in writing, through carefully transmitted manuscripts, and orally, through the qira'at — unbroken chains of reciters memorising and teaching it exactly, generation after generation. This is documented history, not pious speculation, and it fulfils Allah's own promise to guard the Reminder.",
      "You will also hear about 'scientific miracles' — verses touching on the stages of the embryo, the expansion of the cosmos, and the like. Handle these with care. Classical tafsir often understood such verses in ways quite different from modern apologists, and forcing the Qur'an to match every shifting scientific hypothesis can backfire when theories change. Distinguish firmly between established interpretation and contemporary conjecture.",
      "Historical prophecies are likewise cited by scholars — the foretold victory of the Romans, the peaceful opening of Makkah — and they are worth studying, but through sober tafsir and seerah, not sensational video clips. The strongest case for the Qur'an has always been its tawhid, its moral transformation of a people, and its unmatched language and preservation.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 23,
        label: "Qur'an 2:23",
        excerpt: "Then produce a surah like it… if you are truthful.",
      },
    ],
    disclaimer:
      "Avoid overstated scientific miracle claims that embarrass the dawah when scrutinised. Lead with tawheed, morality, and the Qur'an's linguistic and historical proofs.",
  },
  {
    id: "memorization",
    journey: "memorize",
    title: "Memorization (Hifz)",
    summary: "Plans from Juz Amma to full hifz — revision, audio, daily goals.",
    importance: "highly-recommended",
    body: [
      "Memorising the Qur'an (hifz) is one of the noblest pursuits in a believer's life, and it is not reserved for scholars or children — adults complete it too. The Prophet ﷺ taught that on the Day of Resurrection the one who carried the Qur'an will be told, 'Recite and ascend,' rising in rank with each verse. Begin where everyone begins: Surah al-Fatiha, which you already recite in every prayer, then the short surahs at the very end of the mus'haf, working backwards.",
      "The most important lesson in hifz is counter-intuitive: revision (muraja'ah) matters more than adding new material. The Prophet ﷺ warned that the memorised Qur'an slips away faster than a tied camel breaks loose — leave it unrevised and it is gone. So the rule is simple and strict: never add a new portion until you have firmly revised what you already hold. A little memorised solidly beats a lot memorised loosely.",
      "Practical method: use spaced repetition, stick to a single reciter so the melody itself cues your memory, recite from memory daily rather than only reading, and have a teacher listen and mark your mistakes — errors you cannot hear yourself. Munib's hifz tracker records progress down to the individual ayah so you always know what is due for revision.",
      "Choose a plan that fits your stage. Beginner: memorise Juz Amma, the last part, full of short surahs. Intermediate: add ten frequently recited surahs such as al-Mulk, Ya-Sin, and al-Kahf. Advanced: complete a full juz with strong revision of everything before it. And the Hafiz journey: the entire mus'haf, memorised with a qualified teacher and, ideally, a sanad — a certified chain of transmission back to the Prophet ﷺ.",
    ],
    hadith: [
      {
        collection: "Jami' at-Tirmidhi",
        citation: "Hadith 2914",
        grade: "hasan",
        excerpt:
          "It will be said to the companion of the Qur'an: Recite and ascend as you used to recite in the world, for your rank will be at the last verse you recite.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 5031",
        grade: "sahih",
        excerpt:
          "The parable of the companion of the Qur'an is that of the owner of a tethered camel: if he tends to it he keeps it, and if he lets it go he loses it.",
      },
    ],
    appLinks: [
      { label: "Memorization plans", route: "/learn-quran/memorization" },
      { label: "Hifz tracker", route: "/quran" },
    ],
  },
  {
    id: "daily-lessons",
    journey: "read",
    title: "Daily lessons",
    summary: "One verse, context, reflection, and action — each day.",
    importance: "recommended",
    body: [
      "A lifelong attachment to the Qur'an is built the same way any deep habit is built — a little, every day, without fail. The Prophet ﷺ taught that the deeds most beloved to Allah are those done consistently, even if small, and that principle is the whole idea behind a daily lesson. Each one gives you a single verse in Arabic, its translation, a note on its historical context, a reflection question to sit with, and one concrete action to carry into your day.",
      "Treat these verses as living guidance, not passing reading. Bookmark the ones that strike your heart, return to them, and share what moved you with your family — when someone else acts on a good you passed along, its reward reaches you too, so teaching multiplies the benefit.",
      "Do not let the small size fool you. Consistency beats intensity every time: five honest minutes with the Qur'an every single day will transform you far more than a rare, heroic hour once a month. Show up daily, and let the days accumulate.",
    ],
    appLinks: [{ label: "Today's lesson", route: "/learn-quran/daily" }],
  },
  {
    id: "tadabbur",
    journey: "reflect",
    title: "Reflection (Tadabbur)",
    summary: "Guided questions — what does Allah teach, and how will you live it?",
    importance: "foundational",
    body: [
      "Tadabbur means to ponder the Qur'an deeply, turning a verse over in the heart until it moves you to change. It is a direct command, not an optional extra: Allah asks, 'Do they not reflect upon the Qur'an, or are there locks upon their hearts?' The purpose of reciting was never mere sound — it was to reach the heart and reshape a life.",
      "Tadabbur is not the same as tafsir. Tafsir is the scholarly explanation of what a verse means; tadabbur is your personal, reverent response to that meaning once you understand it. The two work together: you first learn the sound meaning from tafsir, then you sit with it and ask how it speaks to you. A helpful frame is three questions — What is Allah teaching me here? How does this change what I do today? What one habit must I build or break because of it?",
      "One firm boundary keeps tadabbur safe: reflect on what a verse asks of you, but never invent new meanings for the text itself. Let authentic tafsir set the limits of interpretation, and keep your personal reflections in their own place — a private journal, such as Munib's, is ideal for capturing what a verse stirred in you and returning to it later.",
    ],
    quran: [
      {
        surah: 47,
        ayahFrom: 24,
        label: "Qur'an 47:24",
        excerpt: "Do they not reflect upon the Qur'an, or are there locks upon their hearts?",
      },
      {
        surah: 4,
        ayahFrom: 82,
        label: "Qur'an 4:82",
        excerpt:
          "Then do they not reflect upon the Qur'an? If it had been from other than Allah, they would have found much contradiction in it.",
      },
    ],
    appLinks: [
      { label: "Tadabbur prompts", route: "/learn-quran/tadabbur" },
      { label: "Journal", route: "/journal" },
    ],
  },
  {
    id: "apply-the-quran",
    journey: "live",
    title: "Apply the Qur'an",
    summary: "Today's challenge from a verse — track completion, live the ayah.",
    importance: "highly-recommended",
    body: [
      "Knowledge of the Qur'an is meant to become action. Allah sharply criticised those before us who recited the Book yet lived against it: 'Do you order righteousness of others and forget yourselves while you recite the Scripture?' The Qur'an is a covenant between you and your Lord, and every ayah is quietly asking something of you — the question is whether you answer.",
      "That is what these challenges are for. Each one links a specific verse to a single, doable behaviour for today: guarding your tongue with kind speech, giving a quiet charity, lowering your gaze from what is forbidden, letting go of a grudge you have carried. One verse, one action — small enough to actually do, real enough to change you.",
      "Mark a challenge complete only when you have truly done it. The point of tracking is not display — that would defeat the purpose — but honest accountability with Allah, who sees what others do not. Over time, verse by verse, this is how recitation turns into character.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 44,
        label: "Qur'an 2:44",
        excerpt:
          "Do you order righteousness of others and forget yourselves while you recite the Scripture?",
      },
    ],
    appLinks: [{ label: "Today's challenge", route: "/learn-quran/apply" }],
  },
  {
    id: "quiz",
    journey: "practice",
    title: "Qur'an quiz",
    summary: "Review surah names, structure, tajweed, vocabulary, and stories.",
    importance: "recommended",
    body: [
      "Testing yourself is one of the most effective ways to make knowledge stick — recalling an answer strengthens memory far more than simply re-reading. This quiz draws on everything in the hub: the number of surahs and juz, the first revelation and how the Qur'an was preserved, tajweed rules such as madd and qalqalah, high-frequency vocabulary, and the prophets whose stories the Qur'an tells.",
      "Keep the intention right. A score is only a mirror for your learning — it is never a measure of your rank with Allah, which belongs to Him alone. Use each question to expose a weak spot, then return to the matching lesson and study exactly that topic rather than chasing a number.",
      "The final prompt is a reflection, not a graded question: choose one surah or passage to understand and memorize next, so your review always ends by pointing you back to the Book itself.",
    ],
    appLinks: [{ label: "Start the quiz", route: "/learn-quran/quiz" }],
  },
  {
    id: "references",
    journey: "evidence",
    title: "References & sources",
    summary: "How we cite Qur'an, hadith, tafsir, and scholarly differences.",
    importance: "foundational",
    body: [
      "Sound Islamic learning is built on transparent evidence, so every lesson in this hub aims to show its working. A claim about the Qur'an is backed by a reference in the form surah:ayah; a claim from the Sunnah names the collection (Bukhari, Muslim, Tirmidhi, and so on), the hadith number, and its grade (sahih, hasan, or weaker); a claim about a verse's meaning names the tafsir it comes from; and where the scholars genuinely differ, the difference is noted rather than hidden.",
      "It also matters to distinguish what is certain from what is interpretive. Established facts — the five daily prayers, the preservation of the Qur'an, the major events of the seerah — are stated plainly. Matters where sincere scholars have long differed, such as the fine details of eschatology or the reading of scientific allusions, are presented as interpretation, not as settled certainty. Confidence should match the strength of the evidence.",
      "For deeper study, lean on established references: reliable Qur'an translations (such as Sahih International or Pickthall), the primary hadith collections (Sahih al-Bukhari and Sahih Muslim foremost), respected tafsir (Ibn Kathir and as-Sa'di), and trustworthy seerah (Ibn Hisham's classic, and ar-Raheeq al-Makhtum, 'The Sealed Nectar,' for a modern narrative).",
      "Finally, know the limits of an app. Munib educates and points you to sources, but it does not issue religious rulings. For the fiqh of recitation, for a tajweed ijazah, or for any question that affects your worship or life decisions, consult a qualified scholar in your own school and locale.",
    ],
    sources: [
      "Qur'an — King Fahd Complex print / authenticated digital mushaf",
      "Hadith — sunnah.com grading cross-reference",
      "Tafsir Ibn Kathir (abridged Darussalam)",
      "Tafsir as-Sa'di (English)",
    ],
    disclaimer:
      "Munib aggregates open educational content. Verify critical matters with qualified scholars in your madhhab and locale.",
  },
];
