import type { LearnDuaTopic } from "../types/learn-dua";

export { LEARN_DUA_OCCASIONS } from "./learn-dua-occasions";

/**
 * Learn Dua — educational guidance for understanding, practicing, and
 * memorizing supplications from Qur'an and authentic Sunnah.
 * This is not the full bundled dua corpus. Bump version when content changes.
 */
export const LEARN_DUA_CONTENT_VERSION = 1;

/** Ordered sections shown on the Learn Dua hub. */
export const LEARN_DUA_SECTION_ORDER = [
  "intro",
  "daily",
  "situational",
  "categories",
  "reference",
] as const;

export const LEARN_DUA_TOPICS: LearnDuaTopic[] = [
  // Intro
  {
    id: "introduction",
    section: "intro",
    title: "What is dua?",
    summary: "Dua is worship: asking Allah directly with humility and hope.",
    importance: "foundational",
    body: [
      "Dua is calling upon Allah for benefit, forgiveness, guidance, and protection. It is one of the greatest acts of worship and a sign of tawheed.",
      "A believer makes dua in ease and hardship, privately and publicly, knowing Allah hears every call and responds with wisdom.",
      "Response can come immediately, be delayed for a better time, or be stored as reward in the Hereafter. No sincere dua is lost.",
    ],
    quran: [
      {
        surah: 40,
        ayahFrom: 60,
        label: "Qur'an 40:60",
        excerpt: "Call upon Me; I will respond to you.",
      },
      {
        surah: 2,
        ayahFrom: 186,
        label: "Qur'an 2:186",
        excerpt: "I answer the call of the supplicant when he calls upon Me.",
      },
    ],
    hadith: [
      {
        collection: "Sunan al-Tirmidhi",
        citation: "3371",
        grade: "hasan",
        excerpt: "Dua is worship.",
      },
    ],
    appLinks: [{ label: "Browse duas", route: "/dua" }],
  },
  {
    id: "dua-etiquette",
    section: "intro",
    title: "Etiquettes of dua",
    summary: "Begin with praise, ask sincerely, and remain patient.",
    body: [
      "Recommended etiquette includes praising Allah, sending salawat upon the Prophet, facing qiblah when possible, and raising the hands in many contexts.",
      "Call with humility, certainty, and good expectation of Allah. Repeat important requests and ask for both deen and dunya.",
      "Do not be hasty by saying 'I asked but was not answered.' Consistency and patience are part of worship.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2735",
        grade: "sahih",
        excerpt:
          "The servant's supplication is answered so long as he is not hasty, saying: I made dua but I was not answered.",
      },
      {
        collection: "Sunan al-Tirmidhi",
        citation: "3477",
        grade: "hasan",
        excerpt:
          "When one of you makes dua, let him begin by praising his Lord and sending blessings on the Prophet.",
      },
    ],
    actions: [
      "Start dua with Alhamdulillah and salawat.",
      "Ask Allah by His beautiful names relevant to your need.",
      "Make regular dua after each prayer and before sleep.",
    ],
    appLinks: [
      { label: "Prayer duas", route: "/dua/prayer" },
      { label: "Salawat collection", route: "/duroods" },
    ],
  },
  {
    id: "dua-conditions",
    section: "intro",
    title: "Conditions for accepted dua",
    summary: "Sincerity, halal livelihood, and avoiding sin increase acceptance.",
    importance: "highly-recommended",
    body: [
      "Core conditions include sincerity to Allah alone, lawful earnings, repentance from sin, and not asking for sinful or family-cutting matters.",
      "A heart present in dua is better than words spoken mechanically. Keep returning to Allah even if you feel weak.",
      "Acceptance is by Allah's mercy; the believer combines effort with trust and does not despair.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "1015",
        grade: "sahih",
        excerpt:
          "He mentions a man whose food, drink, and clothing are from unlawful sources; how can his supplication be answered?",
      },
      {
        collection: "Sahih Muslim",
        citation: "2735",
        grade: "sahih",
        excerpt:
          "The servant's supplication continues to be answered as long as he does not ask for sin or severing family ties.",
      },
    ],
    actions: [
      "Review income and spending for halal compliance.",
      "Repent daily and seek forgiveness before long duas.",
      "Avoid wording that asks for harm or injustice.",
    ],
  },
  {
    id: "best-times",
    section: "intro",
    title: "Best times for dua",
    summary: "Some moments are especially blessed for accepted supplication.",
    body: [
      "Among the strongest times are the last third of the night, during sujud, between adhan and iqamah, while fasting, and before salam in salah.",
      "Friday includes an hour in which dua is accepted. Keep your tongue and heart active in remembrance throughout the day.",
      "Use these moments as anchors for consistency instead of waiting only for crises.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1145",
        grade: "sahih",
        excerpt:
          "Our Lord descends each night to the lowest heaven in the last third of the night and says: Who is calling upon Me so I may answer him?",
      },
      {
        collection: "Sahih Muslim",
        citation: "482",
        grade: "sahih",
        excerpt:
          "The closest a servant is to his Lord is while prostrating, so increase supplication therein.",
      },
    ],
    appLinks: [
      { label: "Prayer reminders", route: "/settings/notifications" },
      { label: "Daily adhkar", route: "/zikr" },
    ],
  },

  // Daily
  {
    id: "morning-evening",
    section: "daily",
    title: "Morning and evening adhkar",
    summary: "Protective and heart-softening duas for day and night.",
    importance: "highly-recommended",
    body: [
      "Morning and evening adhkar are from the most emphasized daily remembrances in the Sunnah.",
      "They protect from harm, strengthen tawakkul, and keep the heart connected to Allah throughout changing circumstances.",
    ],
    phrases: [
      {
        id: "morning-sayyid-istighfar",
        title: "Sayyid al-Istighfar",
        when: "Morning and evening",
        arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ...",
        transliteration:
          "Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu...",
        translation:
          "O Allah, You are my Lord; none has the right to be worshiped but You. You created me and I am Your servant, and I uphold Your covenant and promise as best as I can...",
        reference: "Sahih al-Bukhari 6306",
      },
      {
        id: "morning-hasbiyallah",
        title: "Hasbiyallahu La ilaha illa Huwa",
        when: "Seven times in morning and evening",
        arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
        transliteration:
          "Hasbiyallahu la ilaha illa Huwa, 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Azim",
        translation:
          "Allah is sufficient for me. There is no god but Him. Upon Him I rely, and He is Lord of the Mighty Throne.",
        reference: "Qur'an 9:129; reported in Abu Dawud for morning/evening practice",
      },
    ],
    appLinks: [
      { label: "Morning and evening", route: "/zikr" },
      { label: "All duas", route: "/dua" },
    ],
  },
  {
    id: "wake-sleep",
    section: "daily",
    title: "After waking and before sleep",
    summary: "Begin and end the day with remembrance and trust.",
    body: [
      "The Prophet taught specific adhkar at waking and before sleeping so a believer's first and last words are connected to Allah.",
      "Reciting these regularly builds spiritual stability and a routine of gratitude and surrender.",
    ],
    phrases: [
      {
        id: "wake-alhamdulillah",
        title: "Dua after waking",
        when: "Immediately after waking",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur",
        translation:
          "All praise is for Allah who gave us life after causing us to die, and to Him is the resurrection.",
        reference: "Sahih al-Bukhari 6312",
      },
      {
        id: "sleep-bismika",
        title: "Dua before sleep",
        when: "When lying down to sleep",
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allahumma amutu wa ahya",
        translation: "In Your name, O Allah, I die and I live.",
        reference: "Sahih al-Bukhari 6324",
      },
      {
        id: "sleep-ayat-al-kursi",
        title: "Ayat al-Kursi before sleep",
        when: "Before sleeping",
        arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ...",
        transliteration: "Allahu la ilaha illa Huwa al-Hayyul-Qayyum...",
        translation:
          "Allah - there is no deity except Him, the Ever-Living, the Sustainer of all...",
        reference: "Qur'an 2:255; Sahih al-Bukhari 2311 (protection before sleep)",
      },
    ],
    appLinks: [
      { label: "Sleep duas", route: "/dua" },
      { label: "Night adhkar", route: "/zikr" },
    ],
  },
  {
    id: "home-mosque",
    section: "daily",
    title: "Home and mosque duas",
    summary: "Maintain remembrance when entering, leaving, and attending masjid.",
    body: [
      "Saying Allah's name when entering and leaving home brings protection and blessing.",
      "Masjid duas remind the believer that prayer spaces are places of mercy, discipline, and humility.",
    ],
    phrases: [
      {
        id: "leave-home",
        title: "Dua when leaving home",
        when: "When stepping out",
        arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        transliteration: "Bismillah, tawakkaltu 'alallah, la hawla wa la quwwata illa billah",
        translation:
          "In the name of Allah; I place my trust in Allah; there is no might and no power except with Allah.",
        reference: "Sunan al-Tirmidhi 3426 (hasan)",
      },
      {
        id: "enter-mosque",
        title: "Dua entering the mosque",
        when: "Upon entering masjid",
        arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        transliteration: "Allahumma iftah li abwaba rahmatik",
        translation: "O Allah, open for me the gates of Your mercy.",
        reference: "Sahih Muslim 713",
      },
    ],
    appLinks: [
      { label: "Prayer-related duas", route: "/dua/prayer" },
      { label: "Masjid adhkar", route: "/zikr" },
    ],
  },
  {
    id: "eating",
    section: "daily",
    title: "Duas for eating and drinking",
    summary: "Simple adhkar that bring barakah and gratitude at meals.",
    body: [
      "Begin with Bismillah and end with praise to Allah. These brief duas train gratitude and mindfulness in everyday life.",
      "If one forgets Bismillah at the start, the Sunnah provides a correction phrase during the meal.",
    ],
    phrases: [
      {
        id: "before-food",
        title: "Before eating",
        when: "At start of meal",
        arabic: "بِسْمِ اللَّهِ",
        transliteration: "Bismillah",
        translation: "In the name of Allah.",
        reference: "Sunan al-Tirmidhi 1858 (sahih meaning)",
      },
      {
        id: "after-food",
        title: "After eating",
        when: "After finishing meal",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
        transliteration:
          "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
        translation:
          "All praise is for Allah who fed me this and provided it for me without any power or strength from me.",
        reference: "Sunan al-Tirmidhi 3458 (hasan)",
      },
    ],
    appLinks: [{ label: "Food duas", route: "/dua" }],
  },
  {
    id: "wudu-prayer",
    section: "daily",
    title: "Duas around wudu and prayer",
    summary: "Supplications before and after ablution, and in salah contexts.",
    body: [
      "Wudu and salah are major daily opportunities for accepted remembrance and dua.",
      "Learning authentic phrases for these moments helps connect ritual actions to conscious worship.",
    ],
    phrases: [
      {
        id: "after-wudu-shahadah",
        title: "After wudu",
        when: "Immediately after ablution",
        arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
        transliteration:
          "Ashhadu an la ilaha illa Allah wahdahu la sharika lah, wa ashhadu anna Muhammadan 'abduhu wa rasuluh",
        translation:
          "I bear witness that none has the right to be worshiped except Allah alone without partner, and I bear witness that Muhammad is His servant and messenger.",
        reference: "Sahih Muslim 234",
      },
      {
        id: "before-salam-refuge",
        title: "Before salam in salah",
        when: "Last tashahhud before ending prayer",
        arabic:
          "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ وَمِنْ عَذَابِ الْقَبْرِ وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ",
        transliteration:
          "Allahumma inni a'udhu bika min 'adhabi jahannam, wa min 'adhabil-qabr, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-masihid-dajjal",
        translation:
          "O Allah, I seek refuge in You from the punishment of Hell, from the punishment of the grave, from the trials of life and death, and from the evil trial of the False Messiah.",
        reference: "Sahih al-Bukhari 1377; Sahih Muslim 588",
      },
    ],
    appLinks: [
      { label: "Prayer duas", route: "/dua/prayer" },
      { label: "Salah adhkar", route: "/zikr" },
    ],
  },
  {
    id: "adhan-iqamah",
    section: "daily",
    title: "Dua at adhan and iqamah",
    summary: "Respond to the adhan and ask Allah for al-Wasilah.",
    body: [
      "When the adhan is called, repeat after the mu'adhdhin, then send blessings on the Prophet and recite the dua after adhan.",
      "The period between adhan and iqamah is an accepted time for personal supplication.",
    ],
    phrases: [
      {
        id: "after-adhan",
        title: "Dua after adhan",
        when: "After the adhan ends",
        arabic:
          "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ",
        transliteration:
          "Allahumma Rabba hadhihid-da'watit-tammah was-salatil-qa'imah, ati Muhammadan al-wasilata wal-fadilah, wab'athhu maqaman mahmudan alladhi wa'adtah",
        translation:
          "O Allah, Lord of this perfect call and established prayer, grant Muhammad al-Wasilah and al-Fadilah, and raise him to the praised station You promised him.",
        reference: "Sahih al-Bukhari 614",
      },
    ],
    hadith: [
      {
        collection: "Sunan al-Tirmidhi",
        citation: "212",
        grade: "hasan",
        excerpt: "Supplication between the adhan and iqamah is not rejected.",
      },
    ],
    appLinks: [
      { label: "Adhan & prayer duas", route: "/dua/prayer" },
      { label: "Adhkar library", route: "/zikr" },
    ],
  },

  // Situational
  {
    id: "anxiety-sadness",
    section: "situational",
    title: "Anxiety and sadness",
    summary: "Anchor the heart with tawakkul and prophetic supplications.",
    body: [
      "Islam teaches practical spiritual responses to stress: dua, dhikr, prayer, and trust in Allah's decree.",
      "These duas do not replace seeking professional care when needed; they complement it by strengthening the heart.",
    ],
    phrases: [
      {
        id: "hamm-hazn",
        title: "Dua for anxiety and grief",
        when: "In distress or overwhelming worry",
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ...",
        transliteration:
          "Allahumma inni a'udhu bika minal-hammi wal-hazan, wa a'udhu bika minal-'ajzi wal-kasal...",
        translation:
          "O Allah, I seek refuge in You from anxiety and sorrow, and I seek refuge in You from inability and laziness...",
        reference: "Sahih al-Bukhari 6369",
      },
      {
        id: "hasbunallah",
        title: "Allah is sufficient for us",
        when: "When feeling afraid or overwhelmed",
        arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
        transliteration: "Hasbunallahu wa ni'mal-wakil",
        translation: "Allah is sufficient for us, and He is the best disposer of affairs.",
        reference: "Qur'an 3:173",
      },
    ],
    appLinks: [
      { label: "Calmness adhkar", route: "/zikr" },
      { label: "General duas", route: "/dua" },
    ],
  },
  {
    id: "illness-fear",
    section: "situational",
    title: "Illness and fear",
    summary: "Seek healing and protection while using lawful means.",
    body: [
      "The Sunnah combines dua with treatment. Muslims seek ruqyah from Qur'an and authentic supplications while also pursuing medical care.",
      "In fear, the believer turns to Allah for safety and firmness of heart.",
    ],
    phrases: [
      {
        id: "shifa-dua",
        title: "Dua for healing",
        when: "When ill or making dua for the sick",
        arabic: "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِ أَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا",
        transliteration:
          "Allahumma Rabban-nas, adhhibil-ba's, ishfi anta ash-Shafi, la shifa'a illa shifa'uk, shifa'an la yughadiru saqama",
        translation:
          "O Allah, Lord of mankind, remove the harm and cure; You are the Curer, there is no cure except Your cure, a cure that leaves no illness.",
        reference: "Sahih al-Bukhari 5743; Sahih Muslim 2191",
      },
    ],
    appLinks: [
      { label: "Healing duas", route: "/dua" },
      { label: "Protection adhkar", route: "/zikr" },
    ],
  },
  {
    id: "forgiveness-guidance",
    section: "situational",
    title: "Forgiveness and guidance",
    summary: "Ask for tawbah, istiqamah, and right guidance.",
    body: [
      "Repeated istighfar and sincere tawbah are central to a Muslim's daily life, not only after major mistakes.",
      "Guidance is an ongoing need; even practicing believers constantly ask Allah to keep their hearts firm.",
    ],
    phrases: [
      {
        id: "astaghfirullah-wa-atubu",
        title: "Frequent repentance",
        when: "Anytime throughout the day",
        arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
        transliteration: "Astaghfirullaha wa atubu ilayh",
        translation: "I seek Allah's forgiveness and I repent to Him.",
        reference: "Sahih al-Bukhari 6307 (Prophet sought forgiveness often)",
      },
      {
        id: "ya-muqallib",
        title: "Dua for steadfast heart",
        when: "When fearing misguidance",
        arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
        transliteration: "Ya Muqallibal-qulub, thabbit qalbi 'ala dinik",
        translation: "O Turner of hearts, keep my heart firm upon Your religion.",
        reference: "Sunan al-Tirmidhi 2140 (hasan)",
      },
    ],
    appLinks: [
      { label: "Repentance duas", route: "/dua" },
      { label: "Daily istighfar", route: "/zikr" },
    ],
  },
  {
    id: "travel-rain",
    section: "situational",
    title: "Travel and rain duas",
    summary: "Supplications when setting out, returning, and during rain.",
    body: [
      "Travel and weather changes are moments of vulnerability and gratitude. The Sunnah teaches concise duas for safety and blessing.",
      "Rain is a mercy from Allah and a time in which supplication is encouraged.",
    ],
    phrases: [
      {
        id: "travel-dua",
        title: "Dua when traveling",
        when: "When mounting transport and setting out",
        arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ",
        transliteration:
          "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin wa inna ila Rabbina lamunqalibun",
        translation:
          "Glory be to the One who subjected this for us, and we could not have controlled it; and indeed to our Lord we will return.",
        reference: "Qur'an 43:13-14; Sahih Muslim 1342 travel invocation context",
      },
      {
        id: "rain-beneficial",
        title: "Dua when rain falls",
        when: "At beginning of rainfall",
        arabic: "اللَّهُمَّ صَيِّبًا نَافِعًا",
        transliteration: "Allahumma sayyiban nafi'an",
        translation: "O Allah, make it beneficial rain.",
        reference: "Sahih al-Bukhari 1032",
      },
    ],
    appLinks: [
      { label: "Travel duas", route: "/dua" },
      { label: "Travel guidance", route: "/travel" },
    ],
  },
  {
    id: "rizq-family",
    section: "situational",
    title: "Provision and family",
    summary: "Ask Allah for halal sustenance and righteousness at home.",
    body: [
      "Rizq is from Allah alone. A believer asks for lawful provision, barakah in earnings, and protection from debt.",
      "For family, ask for righteous spouses and children, and homes filled with mercy, prayer, and remembrance.",
    ],
    quran: [
      {
        surah: 25,
        ayahFrom: 74,
        label: "Qur'an 25:74",
        excerpt:
          "Our Lord, grant us from our spouses and offspring comfort to our eyes and make us leaders for the righteous.",
      },
    ],
    phrases: [
      {
        id: "rizq-halal",
        title: "Dua for halal provision",
        when: "Morning, after prayer, and when financially strained",
        arabic: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
        transliteration:
          "Allahummak-fini bihalalika 'an haramika wa aghnini bifadlika 'amman siwak",
        translation:
          "O Allah, suffice me with what You made lawful over what You made unlawful, and enrich me by Your bounty from dependence on others.",
        reference: "Sunan al-Tirmidhi 3563 (hasan)",
      },
    ],
    appLinks: [{ label: "Family and life duas", route: "/dua" }],
  },

  // Categories
  {
    id: "quranic-duas",
    section: "categories",
    title: "Qur'anic duas",
    summary: "Supplications taught directly in the Qur'an.",
    importance: "highly-recommended",
    body: [
      "Qur'anic duas are concise, comprehensive, and rooted in revelation. They are ideal for memorization and regular recitation.",
      "They cover forgiveness, guidance, steadfastness, mercy, family, and success in this life and the next.",
    ],
    phrases: [
      {
        id: "rabbana-atina",
        title: "Good in both worlds",
        when: "General dua, especially in worship",
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        transliteration:
          "Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina 'adhaban-nar",
        translation:
          "Our Lord, grant us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
        reference: "Qur'an 2:201",
      },
      {
        id: "rabbana-la-tuzigh",
        title: "Steadfastness in faith",
        when: "When fearing deviation",
        arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً",
        transliteration:
          "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmah",
        translation:
          "Our Lord, do not let our hearts deviate after You have guided us, and grant us mercy from Yourself.",
        reference: "Qur'an 3:8",
      },
    ],
    appLinks: [
      { label: "Qur'an reader", route: "/quran" },
      { label: "Qur'anic duas", route: "/dua" },
    ],
  },
  {
    id: "prophetic-duas",
    section: "categories",
    title: "Prophetic duas",
    summary: "Supplications authentically taught by the Prophet Muhammad.",
    body: [
      "Prophetic duas are practical, balanced, and deeply spiritual. They include requests for guidance, purity, health, forgiveness, and good character.",
      "Learning short, authentic duas from reliable collections is better than using weak or fabricated narrations.",
    ],
    phrases: [
      {
        id: "guidance-taqwa",
        title: "Comprehensive guidance dua",
        when: "General daily supplication",
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَىٰ وَالتُّقَىٰ وَالْعَفَافَ وَالْغِنَىٰ",
        transliteration: "Allahumma inni as'alukal-huda wat-tuqa wal-'afafa wal-ghina",
        translation: "O Allah, I ask You for guidance, piety, chastity, and contented sufficiency.",
        reference: "Sahih Muslim 2721",
      },
    ],
    appLinks: [{ label: "Prophetic duas", route: "/dua" }],
  },
  {
    id: "dhikr-tasbeeh",
    section: "categories",
    title: "Dhikr and tasbeeh",
    summary: "Short remembrances with immense reward and heart purification.",
    body: [
      "Dhikr includes tasbeeh, tahmeed, tahlil, takbir, and istighfar. These phrases are easy to recite and heavy in reward.",
      "Regular dhikr after prayers and throughout the day strengthens iman and protects from heedlessness.",
    ],
    phrases: [
      {
        id: "subhanallah-bihamdihi",
        title: "Beloved words",
        when: "Throughout day, especially morning/evening",
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        transliteration: "SubhanAllahi wa bihamdih",
        translation: "Glory be to Allah and all praise is for Him.",
        reference: "Sahih al-Bukhari 6405; Sahih Muslim 2694",
      },
      {
        id: "kalimatan-khafifatan",
        title: "Two heavy phrases",
        when: "Any time",
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
        transliteration: "SubhanAllahi wa bihamdih, SubhanAllahil-'Azim",
        translation: "Glory be to Allah and praise be to Him; Glory be to Allah the Magnificent.",
        reference: "Sahih al-Bukhari 6406",
      },
    ],
    appLinks: [{ label: "Dhikr collection", route: "/zikr" }],
  },
  {
    id: "salawat",
    section: "categories",
    title: "Salawat upon the Prophet",
    summary: "Sending prayers upon the Prophet is a daily source of mercy.",
    importance: "highly-recommended",
    body: [
      "Sending salawat upon the Prophet is commanded in the Qur'an and emphasized across authentic hadith.",
      "Frequent salawat brings mercy, forgiveness of sins, and nearness to the Prophet on the Day of Judgment.",
    ],
    quran: [
      {
        surah: 33,
        ayahFrom: 56,
        label: "Qur'an 33:56",
        excerpt:
          "Indeed Allah and His angels send blessings upon the Prophet. O believers, send blessings and peace upon him.",
      },
    ],
    phrases: [
      {
        id: "allahumma-salli",
        title: "Core salawat",
        when: "In tashahhud and throughout the day",
        arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ...",
        transliteration:
          "Allahumma salli 'ala Muhammad wa 'ala ali Muhammad kama sallayta 'ala Ibrahim...",
        translation:
          "O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon Ibrahim...",
        reference: "Sahih al-Bukhari 6357; Sahih Muslim 406",
      },
    ],
    appLinks: [{ label: "Durood collection", route: "/duroods" }],
  },

  // Reference
  {
    id: "references",
    section: "reference",
    title: "Sources and authenticity",
    summary: "Prioritize Qur'an and authentic hadith with clear citation.",
    importance: "foundational",
    body: [
      "This module is educational and scholar-neutral, built around Qur'an and widely accepted authentic hadith references.",
      "When schools differ in wording or practice, the app presents broad guidance and encourages learning from a qualified local scholar.",
      "For memorization and daily use, rely on authentic text sources and avoid forwarding duas with unknown chains.",
    ],
    actions: [
      "Verify unfamiliar narrations before sharing.",
      "Prioritize concise authentic duas you can sustain daily.",
      "Use the app's topic links to pair learning with practice.",
    ],
    disclaimer:
      "Educational content does not replace personalized fiqh advice. Ask qualified scholars for rulings on specific cases.",
    appLinks: [
      { label: "Dua library", route: "/dua" },
      { label: "Qur'an", route: "/quran" },
      { label: "Dhikr", route: "/zikr" },
      { label: "Durood", route: "/duroods" },
    ],
  },
];
