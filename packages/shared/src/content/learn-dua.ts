import type { LearnDuaTopic } from "../types/learn-dua";

export { LEARN_DUA_OCCASIONS } from "./learn-dua-occasions";

/**
 * Learn Dua — a course on understanding, practising, and memorising supplication
 * from the Qur'an and authentic Sunnah. Every featured dua ships with complete
 * Arabic and a verified reference (checked against the standard editions on
 * sunnah.com). This is a teaching module, not the full bundled dua corpus.
 * Bump the version when content changes.
 */
export const LEARN_DUA_CONTENT_VERSION = 2;

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
    summary: "Dua is worship: calling upon Allah directly, with humility and hope.",
    importance: "foundational",
    body: [
      "Dua (دعاء) is calling upon Allah — asking Him for benefit, forgiveness, guidance, and protection, and turning to Him in need. Far from being a lesser act, the Prophet ﷺ declared, 'Dua is worship,' and then recited Allah's command, 'Call upon Me; I will respond to you.' To ask Allah is itself an act of pure tawheed, because it admits that He alone hears, owns, and controls all outcomes.",
      "There are two kinds of dua that flow together: du'a al-mas'alah, asking Allah for something, and du'a al-'ibadah, worshipping Him through prayer, dhikr, and obedience — for every act of worship is, in essence, a silent request for His acceptance and reward. This is why directing dua to anyone besides Allah is a form of shirk: it gives to another what belongs to Him alone.",
      "A believer makes dua in ease and hardship, aloud and in secret, certain that Allah hears every call and never turns away a sincere one empty-handed. He is so near that He says, 'I answer the call of the caller when he calls upon Me.'",
      "The response takes one of three forms, taught by the Prophet ﷺ: Allah gives what was asked; or He withholds it and stores an equal or greater reward for the Hereafter; or He turns away a harm equal to it. So no sincere dua is ever truly unanswered — sometimes the greatest mercy is in the answer we do not see.",
    ],
    quran: [
      {
        surah: 40,
        ayahFrom: 60,
        label: "Qur'an 40:60",
        excerpt: "And your Lord says, 'Call upon Me; I will respond to you.'",
      },
      {
        surah: 2,
        ayahFrom: 186,
        label: "Qur'an 2:186",
        excerpt:
          "And when My servants ask you concerning Me — indeed I am near. I respond to the call of the caller when he calls upon Me.",
      },
    ],
    hadith: [
      {
        collection: "Jami' at-Tirmidhi",
        citation: "3247",
        grade: "sahih",
        excerpt:
          "Dua is worship. — then he ﷺ recited, 'And your Lord says, Call upon Me; I will respond to you.' (an-Nu'man ibn Bashir)",
      },
    ],
    appLinks: [{ label: "Browse duas", route: "/dua" }],
  },
  {
    id: "dua-etiquette",
    section: "intro",
    title: "Etiquettes of dua",
    summary: "Begin with praise, send salawat, ask sincerely, and never give up.",
    body: [
      "Dua has an etiquette (adab) that the Prophet ﷺ taught and modelled, and observing it makes acceptance more likely. Begin by praising Allah with His beautiful names, then send salawat (blessings) upon the Prophet ﷺ — he taught that a dua is 'suspended' until the one praying does both — and only then present your request.",
      "Call upon Allah with three inner qualities: humility, certainty that He can and will respond, and a good opinion of Him (husn al-zann). Face the qiblah where you can, raise your hands, choose the blessed times, and ask for the affairs of both this life and the Hereafter. It is recommended to repeat the important requests, and to end as you began — with praise and salawat.",
      "Above all, do not be hasty. The Prophet ﷺ warned that a dua is answered so long as a person does not despair and say, 'I called and called but was not answered,' and then abandon it. Persistence in asking is itself worship, and Allah loves the servant who keeps knocking at His door.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2735",
        grade: "sahih",
        excerpt:
          "The servant's dua continues to be answered so long as he is not hasty — saying, 'I made dua but was not answered.' (Abu Hurayrah)",
      },
      {
        collection: "Jami' at-Tirmidhi",
        citation: "3477",
        grade: "hasan",
        excerpt:
          "When one of you prays, let him begin by praising and glorifying his Lord, then send blessings upon the Prophet ﷺ, then ask for what he wishes. (Fadalah ibn 'Ubayd)",
      },
    ],
    actions: [
      "Open every dua with Alhamdulillah and salawat upon the Prophet ﷺ.",
      "Ask Allah by the names most fitting your need (e.g. Ya Razzaq for provision, Ya Ghafur for forgiveness).",
      "Make dua a daily habit — after each prayer, in sujud, and before sleep.",
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
    summary: "Sincerity, lawful earnings, and turning from sin open the doors of response.",
    body: [
      "Beyond etiquette, certain conditions strongly affect whether a dua is accepted. The foremost is ikhlas — sincerity to Allah alone, with no showing off and no calling upon others beside Him. A heart truly present in the dua is worth more than a tongue reciting mechanically.",
      "Lawful sustenance is a powerful key. The Prophet ﷺ described a traveller who raises his hands to the sky crying 'O Lord, O Lord,' yet 'his food is unlawful, his drink is unlawful, his clothing is unlawful, and he is nourished by the unlawful — so how can he be answered?' Guarding one's income, repenting from sin, and not asking for anything sinful or for the severing of family ties all remove the barriers between a dua and its acceptance.",
      "Even so, acceptance is ultimately Allah's mercy, not a transaction we control. The believer therefore combines his best effort — sincerity, halal living, repentance — with humble trust, and never despairs if the answer is delayed. Weakness and past sins are no reason to stop asking; they are all the more reason to turn back to the Most Merciful.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "1015",
        grade: "sahih",
        excerpt:
          "…his food is unlawful, his drink unlawful, his clothing unlawful, nourished by the unlawful — so how can he be answered? (Abu Hurayrah)",
      },
      {
        collection: "Sahih Muslim",
        citation: "2735",
        grade: "sahih",
        excerpt:
          "The servant's dua is answered so long as he does not ask for something sinful or for the severing of family ties. (Abu Hurayrah)",
      },
    ],
    actions: [
      "Review your income and spending for lawfulness — it directly affects your dua.",
      "Precede long supplications with istighfar and sincere repentance.",
      "Never word a dua to ask for harm, sin, or injustice.",
    ],
  },
  {
    id: "best-times",
    section: "intro",
    title: "Best times and places for dua",
    summary: "Some moments are especially blessed for accepted supplication.",
    body: [
      "While dua is answered at any time, the Prophet ﷺ singled out certain moments and states when acceptance is most hoped for. Anchor your requests to these rather than waiting only for a crisis.",
      "Among the strongest are: the last third of the night, when Allah descends (in a manner befitting His majesty) to the lowest heaven and calls, 'Who will ask of Me, that I may give him?'; the prostration in prayer, the position nearest to Allah; the moment between the adhan and the iqamah; while a person is fasting, especially at the time of breaking the fast; during the rain; and the last hour of Friday before sunset, in which there is an hour when no dua is refused.",
      "Blessed places and states include standing at 'Arafah during Hajj, being inside the sacred precincts, and the dua of a traveller, a parent for their child, and one wronged. Use these as fixed anchors for a consistent life of supplication.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1145",
        grade: "sahih",
        excerpt:
          "Our Lord descends each night to the lowest heaven in the last third of the night and says: Who is calling upon Me, that I may answer him? Who is asking of Me, that I may give him? (Abu Hurayrah)",
      },
      {
        collection: "Sahih Muslim",
        citation: "482",
        grade: "sahih",
        excerpt:
          "The closest a servant is to his Lord is while he is prostrating, so make much supplication therein. (Abu Hurayrah)",
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
    summary:
      "The daily 'fortress of the Muslim' — protection and connection at both ends of the day.",
    importance: "highly-recommended",
    body: [
      "The morning and evening adhkar are among the most emphasised daily remembrances in the Sunnah — a spiritual fortress a believer renews at the start and close of each day. Allah commands the believers to 'remember Allah with much remembrance, and glorify Him morning and evening' (33:41–42).",
      "Recited consistently, they guard against harm and the whispers of Shaytan, renew reliance upon Allah (tawakkul), and keep the heart tethered to Him through all the day's changing circumstances. Two of the most important are below; the app's adhkar collection carries the full set.",
    ],
    phrases: [
      {
        id: "morning-sayyid-istighfar",
        title: "Sayyid al-Istighfar (the chief of seeking forgiveness)",
        when: "Once each morning and evening",
        arabic:
          "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        transliteration:
          "Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bi-ni'matika 'alayya, wa abu'u bi-dhanbi faghfir li fa-innahu la yaghfiru adh-dhunuba illa anta",
        translation:
          "O Allah, You are my Lord; there is no god but You. You created me and I am Your servant, and I hold to Your covenant and promise as much as I can. I seek refuge in You from the evil I have done. I acknowledge Your favour upon me and I confess my sin, so forgive me — for none forgives sins but You.",
        reference:
          "Sahih al-Bukhari 6306 — whoever says it by day with certainty and dies that day is of the people of Paradise",
      },
      {
        id: "morning-hasbiyallah",
        title: "Hasbiyallahu la ilaha illa Huwa",
        when: "Seven times each morning and evening",
        arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
        transliteration:
          "Hasbiyallahu la ilaha illa Huwa, 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Azim",
        translation:
          "Allah is sufficient for me; there is no god but Him. Upon Him I rely, and He is the Lord of the Mighty Throne.",
        reference:
          "Qur'an 9:129 (the words); Sunan Abi Dawud 5081 for the morning/evening practice",
      },
    ],
    appLinks: [
      { label: "Morning and evening adhkar", route: "/zikr" },
      { label: "All duas", route: "/dua" },
    ],
  },
  {
    id: "wake-sleep",
    section: "daily",
    title: "After waking and before sleep",
    summary: "Make your first and last words of the day a connection with Allah.",
    body: [
      "The Prophet ﷺ taught specific remembrances for waking and for lying down, so that a believer's first conscious words each day are gratitude, and the last are surrender. Sleep, he taught, is a 'minor death,' and waking a small resurrection — so the adhkar frame the whole cycle in awareness of Allah.",
      "Reciting them regularly builds spiritual steadiness: a routine of thankfulness on waking and of entrusting the soul to Allah before sleep. Before sleeping, the Prophet ﷺ especially urged reciting Ayat al-Kursi, promising that a guardian from Allah stays with the reciter and no devil approaches until morning.",
    ],
    phrases: [
      {
        id: "wake-alhamdulillah",
        title: "Dua on waking",
        when: "Immediately upon waking",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur",
        translation:
          "All praise is for Allah who gave us life after having caused us to die, and to Him is the resurrection.",
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
        arabic:
          "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        transliteration:
          "Allahu la ilaha illa Huwal-Hayyul-Qayyum, la ta'khudhuhu sinatun wa la nawm, lahu ma fis-samawati wa ma fil-ard, man dhal-ladhi yashfa'u 'indahu illa bi-idhnih, ya'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bi-shay'in min 'ilmihi illa bima sha', wasi'a kursiyyuhus-samawati wal-ard, wa la ya'uduhu hifzuhuma, wa Huwal-'Aliyyul-'Azim",
        translation:
          "Allah — there is no god but He, the Ever-Living, the Sustainer of all. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and the earth. Who can intercede with Him except by His permission? He knows what lies before them and behind them, and they encompass nothing of His knowledge except what He wills. His Throne extends over the heavens and the earth, and their preservation tires Him not. He is the Most High, the Magnificent.",
        reference:
          "Qur'an 2:255; Sahih al-Bukhari 2311 — a guardian remains with the reciter until morning",
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
    summary: "Carry remembrance as you enter and leave your home and the masjid.",
    body: [
      "The Prophet ﷺ attached short supplications to the everyday thresholds of life. Mentioning Allah's name when leaving and entering the home brings protection and blessing, and shuts the door on Shaytan; he taught that when a person enters mentioning Allah, Shaytan says to his companions, 'You have no place to spend the night here.'",
      "The masjid has its own etiquette: enter with the right foot asking for the gates of mercy, and leave with the left asking for Allah's bounty — reminders that the mosque is a place of mercy, discipline, and humility before Allah.",
    ],
    phrases: [
      {
        id: "leave-home",
        title: "Dua when leaving home",
        when: "When stepping out of the house",
        arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        transliteration: "Bismillah, tawakkaltu 'alallah, la hawla wa la quwwata illa billah",
        translation:
          "In the name of Allah; I place my trust in Allah; there is no might and no power except with Allah.",
        reference: "Sunan Abi Dawud 5095; Jami' at-Tirmidhi 3426 (hasan sahih)",
      },
      {
        id: "enter-mosque",
        title: "Dua entering the mosque",
        when: "On entering, stepping in with the right foot",
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
    summary: "Short adhkar that bring barakah and gratitude to every meal.",
    body: [
      "Islam turns the ordinary act of eating into worship through remembrance. Begin with 'Bismillah' — which invites blessing and keeps Shaytan from sharing the meal — and end with praise to Allah, training the heart in gratitude and mindfulness several times a day.",
      "The Sunnah even provides a correction for forgetfulness: if you forget to say 'Bismillah' at the start, say when you remember, 'Bismillahi awwalahu wa akhirahu' (In the name of Allah, at its beginning and its end).",
    ],
    phrases: [
      {
        id: "before-food",
        title: "Before eating",
        when: "At the start of a meal",
        arabic: "بِسْمِ اللَّهِ",
        transliteration: "Bismillah",
        translation: "In the name of Allah.",
        reference:
          "Sahih al-Bukhari 5376; Jami' at-Tirmidhi 1858 (with the correction if forgotten)",
      },
      {
        id: "after-food",
        title: "After eating",
        when: "On finishing a meal",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
        transliteration:
          "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
        translation:
          "All praise is for Allah who fed me this and provided it for me without any might or power on my part.",
        reference: "Jami' at-Tirmidhi 3458 (hasan) — his past sins are forgiven",
      },
    ],
    appLinks: [{ label: "Food duas", route: "/dua" }],
  },
  {
    id: "wudu-prayer",
    section: "daily",
    title: "Duas around wudu and prayer",
    summary: "Supplications before and after ablution, and within the prayer itself.",
    body: [
      "Wudu and salah are the greatest daily openings for accepted remembrance, so the Sunnah fills them with dua. Completing wudu with the testimony of faith opens the eight gates of Paradise; and within the prayer — in sujud and just before the final salam — are two of the most accepted moments in a believer's day.",
      "Learning the authentic phrases for these moments transforms ritual motions into conscious conversation with Allah.",
    ],
    phrases: [
      {
        id: "after-wudu-shahadah",
        title: "After wudu",
        when: "Immediately after completing ablution",
        arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
        transliteration:
          "Ashhadu an la ilaha illa Allah wahdahu la sharika lah, wa ashhadu anna Muhammadan 'abduhu wa rasuluh",
        translation:
          "I bear witness that there is no god but Allah alone, with no partner, and I bear witness that Muhammad is His servant and Messenger.",
        reference: "Sahih Muslim 234",
      },
      {
        id: "before-salam-refuge",
        title: "Before the salam in salah",
        when: "In the final tashahhud, before ending the prayer",
        arabic:
          "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ وَمِنْ عَذَابِ الْقَبْرِ وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ",
        transliteration:
          "Allahumma inni a'udhu bika min 'adhabi jahannam, wa min 'adhabil-qabr, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-masihid-dajjal",
        translation:
          "O Allah, I seek refuge in You from the punishment of Hell, from the punishment of the grave, from the trial of life and death, and from the evil of the trial of the False Messiah (the Dajjal).",
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
    title: "Dua at the adhan and iqamah",
    summary: "Answer the call, ask Allah for the Prophet's ﷺ station, then supplicate.",
    body: [
      "When the adhan is called, the Sunnah is to repeat after the mu'adhdhin, then send salawat upon the Prophet ﷺ, then recite the du'a asking Allah to grant him al-Wasilah — the Prophet ﷺ promised his intercession to whoever does so.",
      "The window between the adhan and the iqamah is one of the accepted times for personal supplication; the Prophet ﷺ said the dua made then is not turned away, so use it to ask Allah for your own needs.",
    ],
    phrases: [
      {
        id: "after-adhan",
        title: "Dua after the adhan",
        when: "When the adhan finishes",
        arabic:
          "اللَّهُمَّ رَبَّ هَٰذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ",
        transliteration:
          "Allahumma Rabba hadhihid-da'watit-tammah was-salatil-qa'imah, ati Muhammadan al-wasilata wal-fadilah, wab'athhu maqaman mahmudan alladhi wa'adtah",
        translation:
          "O Allah, Lord of this perfect call and established prayer, grant Muhammad al-Wasilah and al-Fadilah, and raise him to the praised station You have promised him.",
        reference: "Sahih al-Bukhari 614",
      },
    ],
    hadith: [
      {
        collection: "Sunan Abi Dawud",
        citation: "521",
        grade: "sahih",
        excerpt:
          "The dua made between the adhan and the iqamah is not rejected. (Anas ibn Malik; also at-Tirmidhi 212)",
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
    summary: "Anchor the heart with tawakkul and the Prophet's ﷺ own supplications.",
    body: [
      "Islam meets distress with practical spiritual tools: dua, dhikr, prayer, and trust in Allah's decree. The Prophet ﷺ, who himself faced grief and hardship, taught precise supplications for anxiety (hamm), sadness (hazan), and fear — words that reorient the heart from the problem toward the One who controls it.",
      "These duas do not replace seeking help through lawful means, including medical or professional care when it is needed. Rather, they strengthen the heart alongside those means, reminding the believer that ultimate sufficiency is with Allah alone.",
    ],
    phrases: [
      {
        id: "hamm-hazn",
        title: "Dua for anxiety and grief",
        when: "In distress, worry, or overwhelming sorrow",
        arabic:
          "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ",
        transliteration:
          "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa dala'id-dayn, wa ghalabatir-rijal",
        translation:
          "O Allah, I seek refuge in You from anxiety and grief, from incapacity and laziness, from miserliness and cowardice, from the burden of debt, and from being overpowered by others.",
        reference: "Sahih al-Bukhari 6369 (Anas ibn Malik)",
      },
      {
        id: "hasbunallah",
        title: "Allah is sufficient for us",
        when: "When afraid or overwhelmed",
        arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
        transliteration: "Hasbunallahu wa ni'mal-wakil",
        translation: "Allah is sufficient for us, and He is the best disposer of affairs.",
        reference: "Qur'an 3:173 — the words of the believers when threatened",
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
    summary: "Seek healing from Allah while taking the lawful means of treatment.",
    body: [
      "The Sunnah joins dua with treatment: the Prophet ﷺ taught, 'For every disease there is a cure,' and commanded seeking treatment, while also curing hearts and bodies through ruqyah — reciting the Qur'an and authentic supplications over the sick. The believer does both: takes the medicine and turns to the Healer.",
      "The name of the acting cause is important: Allah is ash-Shafi, the Healer, and medicine is only a means He created. In fear, too, the heart turns to Him for safety and firmness — for He alone grants security.",
    ],
    phrases: [
      {
        id: "shifa-dua",
        title: "Dua for healing",
        when: "When ill, or praying over someone who is sick",
        arabic: "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِ أَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا",
        transliteration:
          "Allahumma Rabban-nas, adhhibil-ba's, ishfi anta ash-Shafi, la shifa'a illa shifa'uk, shifa'an la yughadiru saqama",
        translation:
          "O Allah, Lord of mankind, remove the affliction and grant healing — You are the Healer; there is no cure but Your cure — a cure that leaves behind no illness.",
        reference: "Sahih al-Bukhari 5743; Sahih Muslim 2191 ('Aishah)",
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
    summary: "Ask constantly for pardon, steadfastness, and right guidance.",
    body: [
      "Seeking forgiveness (istighfar) is not reserved for after major sins — it is a daily rhythm of the believer. The Prophet ﷺ, who was already forgiven, sought Allah's forgiveness more than seventy times a day, teaching that the heart needs constant polishing.",
      "Guidance, likewise, is a continuous need, not a one-time event. Even firmly practising believers ask Allah to keep their hearts steady, because hearts turn — and the One who turns them is Allah. The Prophet ﷺ frequently prayed for a heart made firm upon the religion.",
    ],
    phrases: [
      {
        id: "astaghfirullah-wa-atubu",
        title: "Frequent repentance",
        when: "Repeatedly, throughout the day",
        arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
        transliteration: "Astaghfirullaha wa atubu ilayh",
        translation: "I seek the forgiveness of Allah and I turn to Him in repentance.",
        reference:
          "Sahih al-Bukhari 6307 — the Prophet ﷺ sought forgiveness more than 70 times a day",
      },
      {
        id: "ya-muqallib",
        title: "Dua for a steadfast heart",
        when: "When fearing misguidance or wavering",
        arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَىٰ دِينِكَ",
        transliteration: "Ya Muqallibal-qulub, thabbit qalbi 'ala dinik",
        translation: "O Turner of hearts, make my heart firm upon Your religion.",
        reference: "Jami' at-Tirmidhi 2140 (hasan) — his most frequent oath and dua",
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
    summary: "Supplications for setting out, and for the mercy of falling rain.",
    body: [
      "Travel is a state of both vulnerability and heightened acceptance — the Prophet ﷺ taught that the dua of the traveller is answered, and gave a supplication for mounting a vehicle and setting out that acknowledges Allah's power and our return to Him.",
      "Rain is a mercy descending from Allah, and the moment of its falling is a time to supplicate. The Prophet ﷺ would greet rain with a short dua asking that it be made beneficial, not a cause of harm.",
    ],
    phrases: [
      {
        id: "travel-dua",
        title: "Dua when setting out to travel",
        when: "On mounting your transport and departing",
        arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ",
        transliteration:
          "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin wa inna ila Rabbina lamunqalibun",
        translation:
          "Glory be to the One who subjected this to us, when we could not have done so ourselves; and indeed, to our Lord we will surely return.",
        reference:
          "Qur'an 43:13–14 (the words); Sahih Muslim 1342 (the Prophet's ﷺ travel practice)",
      },
      {
        id: "rain-beneficial",
        title: "Dua when rain falls",
        when: "At the beginning of rainfall",
        arabic: "اللَّهُمَّ صَيِّبًا نَافِعًا",
        transliteration: "Allahumma sayyiban nafi'an",
        translation: "O Allah, make it a beneficial downpour.",
        reference: "Sahih al-Bukhari 1032 ('Aishah)",
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
    summary: "Ask Allah for lawful sustenance and righteousness in the home.",
    body: [
      "Provision (rizq) is from Allah alone; the believer ties his camel — working and earning — then asks the Provider for lawful sustenance, barakah in what he earns, freedom from debt, and independence from needing others. The Prophet ﷺ taught a beautiful dua that asks for exactly this.",
      "For the home, the Qur'an itself teaches the prayer of the righteous: to be granted spouses and children who are 'a comfort to the eyes,' and to lead a household bound together by faith, prayer, and mercy.",
    ],
    quran: [
      {
        surah: 25,
        ayahFrom: 74,
        label: "Qur'an 25:74",
        excerpt:
          "Our Lord, grant us from among our spouses and offspring comfort to our eyes, and make us leaders for the righteous.",
      },
    ],
    phrases: [
      {
        id: "rizq-halal",
        title: "Dua for lawful provision",
        when: "Mornings, after prayer, and in financial strain",
        arabic: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
        transliteration:
          "Allahummak-fini bihalalika 'an haramik, wa aghnini bifadlika 'amman siwak",
        translation:
          "O Allah, suffice me with what You have made lawful against what You have made unlawful, and enrich me by Your bounty so I need none besides You.",
        reference: "Jami' at-Tirmidhi 3563 (hasan) ('Ali ibn Abi Talib)",
      },
    ],
    appLinks: [{ label: "Family and life duas", route: "/dua" }],
  },

  // Categories
  {
    id: "quranic-duas",
    section: "categories",
    title: "Qur'anic duas",
    summary: "Supplications taught by Allah Himself within the Qur'an.",
    importance: "highly-recommended",
    body: [
      "The Qur'anic duas are words Allah placed on the tongues of the prophets and the believers, then preserved for us to repeat — concise, comprehensive, and impossible to improve upon. Many begin with 'Rabbana' (our Lord), and they are ideal for memorisation and constant recitation.",
      "Between them they cover the whole of a believer's needs: forgiveness, guidance, steadfastness, mercy, righteous family, protection from the Fire, and success in both worlds. Praying with Allah's own words is among the surest forms of dua.",
    ],
    phrases: [
      {
        id: "rabbana-atina",
        title: "Good in both worlds",
        when: "A general, all-purpose dua — the Prophet's ﷺ most frequent",
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        transliteration:
          "Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina 'adhaban-nar",
        translation:
          "Our Lord, grant us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
        reference: "Qur'an 2:201 (the most frequent dua of the Prophet ﷺ — Sahih al-Bukhari 6389)",
      },
      {
        id: "rabbana-la-tuzigh",
        title: "Steadfastness in faith",
        when: "When fearing deviation or after being guided",
        arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ",
        transliteration:
          "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmah, innaka antal-Wahhab",
        translation:
          "Our Lord, let not our hearts deviate after You have guided us, and grant us mercy from Yourself. Indeed, You are the Bestower.",
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
    summary: "Supplications authentically taught by the Prophet Muhammad ﷺ.",
    body: [
      "The Prophet ﷺ was given 'the most comprehensive speech' (jawami' al-kalim), and his supplications reflect it: short in words, vast in meaning, and perfectly balanced between the needs of this life and the next. They ask for guidance, purity of heart, health, forgiveness, protection, and good character.",
      "A key principle: hold to authentic, well-attested duas from reliable collections, and avoid circulating weak or fabricated ones with invented rewards. The genuine treasure of the Sunnah is more than enough.",
    ],
    phrases: [
      {
        id: "guidance-taqwa",
        title: "Comprehensive dua of the four",
        when: "A general daily supplication",
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَىٰ وَالتُّقَىٰ وَالْعَفَافَ وَالْغِنَىٰ",
        transliteration: "Allahumma inni as'alukal-huda wat-tuqa wal-'afafa wal-ghina",
        translation: "O Allah, I ask You for guidance, piety, chastity, and contented sufficiency.",
        reference: "Sahih Muslim 2721 (Ibn Mas'ud)",
      },
    ],
    appLinks: [{ label: "Prophetic duas", route: "/dua" }],
  },
  {
    id: "dhikr-tasbeeh",
    section: "categories",
    title: "Dhikr and tasbeeh",
    summary: "Short remembrances of immense weight and reward.",
    body: [
      "Dhikr — the remembrance of Allah — includes tasbeeh (SubhanAllah), tahmid (Alhamdulillah), tahlil (La ilaha illallah), takbir (Allahu Akbar), and istighfar. These are among the lightest words on the tongue yet the heaviest in the Scale, and they are the living heart's defence against heedlessness.",
      "The Prophet ﷺ described phrases 'light on the tongue, heavy on the Scale, beloved to the Most Merciful,' and taught that whoever says 'SubhanAllahi wa bihamdih' a hundred times a day has his sins wiped away though they be like the foam of the sea. Kept up after prayers and throughout the day, dhikr keeps iman alive.",
    ],
    phrases: [
      {
        id: "subhanallah-bihamdihi",
        title: "Beloved and sin-erasing words",
        when: "Throughout the day; 100 times erases sins",
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        transliteration: "SubhanAllahi wa bihamdih",
        translation: "Glory be to Allah, and all praise is His.",
        reference: "Sahih al-Bukhari 6405; Sahih Muslim 2691",
      },
      {
        id: "kalimatan-khafifatan",
        title: "Two words heavy on the Scale",
        when: "Any time",
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
        transliteration: "SubhanAllahi wa bihamdih, SubhanAllahil-'Azim",
        translation: "Glory be to Allah and His is the praise; glory be to Allah the Magnificent.",
        reference:
          "Sahih al-Bukhari 6406; Sahih Muslim 2694 — light on the tongue, heavy on the Scale",
      },
    ],
    appLinks: [{ label: "Dhikr collection", route: "/zikr" }],
  },
  {
    id: "salawat",
    section: "categories",
    title: "Salawat upon the Prophet ﷺ",
    summary: "Sending blessings on the Prophet ﷺ is a daily wellspring of mercy.",
    importance: "highly-recommended",
    body: [
      "Sending salawat upon the Prophet ﷺ is commanded by Allah in the Qur'an — 'Indeed, Allah and His angels send blessings upon the Prophet; O believers, send blessings upon him and greetings of peace' — and no other dua carries such a guaranteed return: the Prophet ﷺ said that whoever sends one blessing upon him, Allah sends ten upon that person.",
      "Frequent salawat brings mercy, raises ranks, wipes away sins, and draws a person nearest to the Prophet ﷺ on the Day of Judgment. The complete Ibrahimic form below — the one he taught his Companions when they asked how to send blessings upon him — is recited in every prayer's tashahhud and is excellent to keep on the tongue throughout the day.",
    ],
    quran: [
      {
        surah: 33,
        ayahFrom: 56,
        label: "Qur'an 33:56",
        excerpt:
          "Indeed, Allah and His angels send blessings upon the Prophet. O you who believe, send blessings upon him and greetings of peace.",
      },
    ],
    phrases: [
      {
        id: "allahumma-salli",
        title: "The complete Salawat Ibrahimiyyah",
        when: "In the tashahhud of prayer and throughout the day",
        arabic:
          "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
        transliteration:
          "Allahumma salli 'ala Muhammad wa 'ala ali Muhammad, kama sallayta 'ala Ibrahim wa 'ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik 'ala Muhammad wa 'ala ali Muhammad, kama barakta 'ala Ibrahim wa 'ala ali Ibrahim, innaka Hamidun Majid.",
        translation:
          "O Allah, send blessings upon Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim; indeed You are Praiseworthy, Glorious. O Allah, bestow favour upon Muhammad and the family of Muhammad, as You favoured Ibrahim and the family of Ibrahim; indeed You are Praiseworthy, Glorious.",
        reference: "Sahih al-Bukhari 3370; Sahih Muslim 406 (Ka'b ibn 'Ujrah)",
      },
    ],
    appLinks: [{ label: "Durood collection", route: "/duroods" }],
  },

  // Reference
  {
    id: "references",
    section: "reference",
    title: "Sources and authenticity",
    summary: "Prioritise the Qur'an and authentic hadith with clear citation.",
    importance: "foundational",
    body: [
      "This module is educational and non-partisan, built entirely on the Qur'an and widely-accepted authentic (sahih/hasan) hadith, each with a traceable reference. The gold standard for daily duas is precisely this: verified text with a known source.",
      "A serious caution applies to supplication: many duas circulate online with invented wordings and exaggerated rewards ('recite this and all your sins vanish'). Fabricated hadith are a grave matter, so verify an unfamiliar narration before adopting or forwarding it.",
      "For memorisation and daily practice, prefer the short, authentic duas you can genuinely sustain over long ones you will abandon — consistency is more beloved to Allah than volume. Where the schools differ in wording, learn from a qualified local scholar.",
    ],
    actions: [
      "Verify any unfamiliar dua's source before sharing it.",
      "Choose a few concise authentic duas and keep them daily rather than many you cannot sustain.",
      "Use the app's topic links to pair each lesson with real practice.",
    ],
    disclaimer:
      "Educational content does not replace personalised fiqh advice. Ask qualified scholars for rulings on specific cases.",
    appLinks: [
      { label: "Dua library", route: "/dua" },
      { label: "Qur'an", route: "/quran" },
      { label: "Dhikr", route: "/zikr" },
      { label: "Durood", route: "/duroods" },
    ],
  },
];
