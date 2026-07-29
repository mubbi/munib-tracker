import type { SalahGuidePhrase } from "../types/salah-guide";

/**
 * Core phrases recited in salah — full Arabic, transliteration, translation, and
 * a short meaning to build khushu. Ordered as they occur in the prayer. Arabic
 * is shipped complete (never truncated); references are verified against the
 * standard printed collections (sunnah.com).
 */
export const SALAH_GUIDE_PHRASES: SalahGuidePhrase[] = [
  {
    id: "wudu-dua",
    title: "After completing wudu",
    when: "Immediately after finishing ablution, before salah.",
    arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration:
      "Ashhadu an la ilaha illallahu wahdahu la sharika lah, wa ashhadu anna Muhammadan 'abduhu wa rasuluh",
    translation:
      "I bear witness that there is no god except Allah alone, with no partner, and I bear witness that Muhammad is His slave and Messenger.",
    meaning:
      "Renewing the testimony of faith while your body is freshly purified. The Prophet ﷺ promised that whoever says this after wudu, the eight gates of Paradise are opened for him to enter by whichever he wishes.",
    reference: "Sahih Muslim 234",
  },
  {
    id: "takbir",
    title: "Takbirat al-Ihram",
    when: "At the very start of salah, and when moving between positions.",
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    translation: "Allah is the Greatest.",
    meaning:
      "The prayer begins here — 'al-ihram' means it makes forbidden upon you the things of the world (speech, eating, turning away). You declare Allah greater than anything that could distract you, and step fully into His presence. Every takbir that follows renews that surrender.",
    reference: "Sahih al-Bukhari 631; the opening takbir is a pillar of salah",
  },
  {
    id: "subhanaka",
    title: "Dua al-Istiftah (opening supplication)",
    when: "Silently after the opening takbir, before Al-Fatihah.",
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَىٰ جَدُّكَ، وَلَا إِلَٰهَ غَيْرُكَ",
    transliteration:
      "Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta'ala jadduka, wa la ilaha ghayruk",
    translation:
      "Glory is to You, O Allah, and praise. Blessed is Your name and exalted is Your majesty. There is no god other than You.",
    meaning:
      "You open the conversation by glorifying and praising Allah and affirming His oneness, settling the heart before you recite His words. Several authentic opening supplications exist — this is one of the most widely used.",
    reference: "Sunan Abi Dawud 776; Jami' at-Tirmidhi 243 (hasan, from 'Aishah)",
  },
  {
    id: "fatiha",
    title: "Surah Al-Fatihah",
    when: "Standing in every rakah — a pillar without which the rakah is invalid.",
    arabic:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    transliteration:
      "Bismillahir-Rahmanir-Rahim. Al-hamdu lillahi Rabbil-'alamin. Ar-Rahmanir-Rahim. Maliki yawmid-din. Iyyaka na'budu wa iyyaka nasta'in. Ihdinas-siratal-mustaqim. Siratal-ladhina an'amta 'alayhim ghayril-maghdubi 'alayhim wa lad-dallin.",
    translation:
      "In the name of Allah, the Entirely Merciful, the Especially Merciful. All praise is due to Allah, Lord of the worlds — the Entirely Merciful, the Especially Merciful, Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path — the path of those upon whom You have bestowed favour, not of those who have earned anger or of those who are astray.",
    meaning:
      "The 'Mother of the Book': half praise of Allah and half a plea for guidance, with 'It is You we worship' as the hinge between them. Allah said He divided this surah between Himself and His servant — as you recite each line, He responds. The Prophet ﷺ said there is no prayer for one who does not recite it.",
    reference: "Qur'an 1:1–7; Sahih al-Bukhari 756, Sahih Muslim 395",
  },
  {
    id: "ruku-dhikr",
    title: "Zikr in ruku",
    when: "While bowing, with a flat, settled back.",
    arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
    transliteration: "Subhana Rabbiyal-'Adheem",
    translation: "Glory is to my Lord, the Magnificent.",
    meaning:
      "Bowing is the posture of reverence, so you glorify Allah's magnificence — said three or more times, without haste. The Prophet ﷺ taught that in ruku we exalt the Lord, so hope for your supplication to be answered.",
    reference: "Sunan Abi Dawud 870; Sahih Muslim 772",
  },
  {
    id: "rising-ruku",
    title: "Rising from ruku",
    when: "Standing fully upright after bowing.",
    arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ، رَبَّنَا وَلَكَ الْحَمْدُ",
    transliteration: "Sami'Allahu liman hamidah — Rabbana wa lakal-hamd",
    translation: "Allah hears whoever praises Him. Our Lord, to You belongs all praise.",
    meaning:
      "You affirm that Allah truly hears the one who praises Him, then return all praise to Him. The Prophet ﷺ said that when the imam says this and the people answer, whoever's words coincide with the angels' has their past sins forgiven.",
    reference: "Sahih al-Bukhari 796",
  },
  {
    id: "sujud-dhikr",
    title: "Zikr in sujud",
    when: "In prostration — the position nearest to Allah.",
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَىٰ",
    transliteration: "Subhana Rabbiyal-A'la",
    translation: "Glory is to my Lord, the Most High.",
    meaning:
      "At the lowest physical point you glorify the Most High — the paradox at the heart of worship. The Prophet ﷺ said a servant is nearest to his Lord while prostrating, so pour out supplication here after the zikr.",
    reference: "Sahih Muslim 772; Sahih Muslim 482 (nearness in sujud)",
  },
  {
    id: "sitting-dhikr",
    title: "Between the two prostrations",
    when: "Sitting calmly between the first and second sujud of each rakah.",
    arabic: "رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي",
    transliteration: "Rabbi ighfir li, Rabbi ighfir li",
    translation: "My Lord, forgive me. My Lord, forgive me.",
    meaning:
      "A brief but direct plea for forgiveness in every rakah — a reminder that even mid-prayer we stand in need of Allah's pardon. Sit until you are at ease before the second prostration.",
    reference: "Sunan Abi Dawud 874; Sunan Ibn Majah 897 (Hudhayfah)",
  },
  {
    id: "tashahhud",
    title: "At-Tahiyyat (Tashahhud)",
    when: "In the middle sitting and the final sitting of salah.",
    arabic:
      "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration:
      "At-tahiyyatu lillahi was-salawatu wat-tayyibat, as-salamu 'alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh, as-salamu 'alayna wa 'ala 'ibadillahis-salihin, ashhadu an la ilaha illallah, wa ashhadu anna Muhammadan 'abduhu wa rasuluh",
    translation:
      "All greetings, prayers, and pure words are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god except Allah, and I bear witness that Muhammad is His slave and Messenger.",
    meaning:
      "The sitting heart of salah: you offer every kind of worship to Allah alone, send peace upon the Prophet ﷺ and the righteous, and re-declare the two testimonies. Ibn Mas'ud learned it from the Prophet ﷺ word for word, as one learns a surah.",
    reference: "Sahih al-Bukhari 831; Sahih Muslim 402 (Ibn Mas'ud)",
  },
  {
    id: "salawat",
    title: "Salawat Ibrahimiyyah",
    when: "In the final tashahhud, after At-Tahiyyat.",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration:
      "Allahumma salli 'ala Muhammad wa 'ala ali Muhammad, kama sallayta 'ala Ibrahim wa 'ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik 'ala Muhammad wa 'ala ali Muhammad, kama barakta 'ala Ibrahim wa 'ala ali Ibrahim, innaka Hamidun Majid.",
    translation:
      "O Allah, send blessings upon Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim; indeed You are Praiseworthy, Glorious. O Allah, bestow favour upon Muhammad and the family of Muhammad, as You favoured Ibrahim and the family of Ibrahim; indeed You are Praiseworthy, Glorious.",
    meaning:
      "When the Companions asked how to send blessings upon him, the Prophet ﷺ taught them these exact words — the most authenticated salawat in the Sunnah. You honour the Messenger ﷺ as Allah commanded, completing your prayer with love for the one who taught you to pray.",
    reference: "Sahih al-Bukhari 3370 (Ka'b ibn 'Ujrah); Sahih Muslim 406",
  },
  {
    id: "dua-before-salam",
    title: "Seeking refuge before the salam",
    when: "After the final tashahhud and salawat, just before ending the prayer.",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَمِنْ عَذَابِ جَهَنَّمَ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ",
    transliteration:
      "Allahumma inni a'udhu bika min 'adhabil-qabri, wa min 'adhabi jahannam, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-masihid-dajjal",
    translation:
      "O Allah, I seek refuge in You from the punishment of the grave, from the punishment of Hell, from the trial of life and death, and from the evil of the trial of the False Messiah (the Dajjal).",
    meaning:
      "The Prophet ﷺ instructed that after the final tashahhud a person seek refuge from these four dangers before giving salam — the last plea of the prayer covers this life, the grave, the Fire, and the greatest trial to come.",
    reference: "Sahih Muslim 588 (Abu Hurayrah)",
  },
  {
    id: "salam",
    title: "Taslim (the closing salam)",
    when: "Ending salah — turning the face to the right, then to the left.",
    arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
    transliteration: "As-salamu 'alaykum wa rahmatullah",
    translation: "Peace and the mercy of Allah be upon you.",
    meaning:
      "You leave the prayer as you would leave the company of the honoured — with a greeting of peace to the angels recording on each shoulder and to those praying beside you. The salam is a pillar; with it the prayer is complete.",
    reference: "Sunan Abi Dawud 996; the taslim is a pillar of salah",
  },
];
