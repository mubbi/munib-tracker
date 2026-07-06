import type { SalahGuidePhrase } from "../types/salah-guide";

/** Core phrases recited in salah — Arabic, translation, and meaning for khushu. */
export const SALAH_GUIDE_PHRASES: SalahGuidePhrase[] = [
  {
    id: "takbir",
    title: "Takbirat al-Ihram",
    when: "At the start of salah and when moving between positions.",
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    translation: "Allah is the Greatest.",
    meaning:
      "You affirm that nothing is greater than Allah — turning your heart away from the world and toward the One you stand before. Every takbir renews that surrender.",
    reference: "Agreed upon in the prayer of the Prophet ﷺ",
  },
  {
    id: "subhanaka",
    title: "Subhanaka (opening supplication)",
    when: "After the opening takbir, before reciting Al-Fatihah.",
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَٰهَ غَيْرُكَ",
    transliteration:
      "Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta'ala jadduka, wa la ilaha ghayruk",
    translation:
      "Glory is to You, O Allah, and praise. Blessed is Your name and exalted is Your majesty. There is no god worthy of worship except You.",
    meaning:
      "You open salah by glorifying Allah, praising Him, and renewing the testimony of tawhid — preparing the heart before recitation.",
    reference: "Muslim",
  },
  {
    id: "fatiha",
    title: "Surah Al-Fatihah",
    when: "Standing in every rak'ah — recited by the imam and each person praying alone.",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ …",
    transliteration: "Bismillahir-Rahmanir-Raheem …",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful …",
    meaning:
      "The 'mother of the Book' — praise, tawhid, asking for guidance, and seeking the straight path. The Prophet ﷺ said there is no salah for one who does not recite it.",
    reference: "Qur'an 1; al-Tirmidhi",
  },
  {
    id: "ruku-dhikr",
    title: "Dhikr in ruku",
    when: "While bowing, with a still back.",
    arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
    transliteration: "Subhana Rabbiyal-'Adheem",
    translation: "Glory is to my Lord, the Magnificent.",
    meaning:
      "In the position of humility you glorify Allah's greatness. Say it with presence — the Prophet ﷺ would lengthen this posture.",
    reference: "Agreed upon",
  },
  {
    id: "rising-ruku",
    title: "Rising from ruku",
    when: "Standing upright after bowing.",
    arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ، رَبَّنَا وَلَكَ الْحَمْدُ",
    transliteration: "Sami'Allahu liman hamidah, Rabbana wa lakal-hamd",
    translation: "Allah hears the one who praises Him. Our Lord, to You is all praise.",
    meaning:
      "You acknowledge that Allah hears your praise and that all praise belongs to Him alone — gratitude rising with your body.",
    reference: "Agreed upon",
  },
  {
    id: "sujud-dhikr",
    title: "Dhikr in sujud",
    when: "In prostration — the closest a servant is to Allah.",
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَىٰ",
    transliteration: "Subhana Rabbiyal-A'la",
    translation: "Glory is to my Lord, the Most High.",
    meaning:
      "The Prophet ﷺ said a servant is nearest to his Lord in sujud — so increase supplication here. This dhikr glorifies Allah's loftiness.",
    reference: "Agreed upon",
  },
  {
    id: "tashahhud",
    title: "At-Tahiyyat (Tashahhud)",
    when: "Sitting in the middle or final sitting of salah.",
    arabic: "التَّحِيَّاتُ لِلَّهِ …",
    transliteration: "At-tahiyyatu lillah …",
    translation: "All greetings, prayers, and good words are for Allah …",
    meaning:
      "A comprehensive declaration of worship, peace upon the Prophet ﷺ, and testimony of faith — the sitting heart of salah.",
    reference: "Agreed upon",
  },
  {
    id: "salawat",
    title: "Salawat on the Prophet ﷺ",
    when: "In the final tashahhud, after At-Tahiyyat.",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ …",
    transliteration: "Allahumma salli 'ala Muhammad …",
    translation: "O Allah, send prayers upon Muhammad …",
    meaning:
      "Honouring the Messenger ﷺ as Allah commanded — completing salah with love and obedience to the one who taught us how to pray.",
    reference: "Agreed upon",
  },
  {
    id: "salam",
    title: "Taslim (salam)",
    when: "Ending salah, turning right then left.",
    arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
    transliteration: "As-salamu 'alaykum wa rahmatullah",
    translation: "Peace and mercy of Allah be upon you.",
    meaning:
      "You exit salah with a greeting of peace — to the angels recorded on each shoulder and to those beside you in congregation.",
    reference: "Agreed upon",
  },
  {
    id: "wudu-dua",
    title: "After completing wudu",
    when: "After finishing ablution, before salah.",
    arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration:
      "Ashhadu an la ilaha illallah wahdahu la sharika lah, wa ashhadu anna Muhammadan 'abduhu wa rasuluh",
    translation:
      "I bear witness that there is no god except Allah alone, with no partner, and I bear witness that Muhammad is His slave and Messenger.",
    meaning:
      "Renewing shahadah after purification — the Prophet ﷺ said whoever says this after wudu, the eight gates of Paradise are opened for him.",
    reference: "Muslim",
  },
];
