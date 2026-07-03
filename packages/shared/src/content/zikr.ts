import type { ZikrItem } from "../types/index";

/** Bump when the bundled zikr content changes so clients can re-seed. */
export const ZIKR_CONTENT_VERSION = 1;

/**
 * A curated starter set of well-known adhkar (at least three per category).
 * Translations are kept close to widely published renderings. This is an
 * introductory selection — verify against a trusted source before relying on it.
 */
export const ZIKR_ITEMS: ZikrItem[] = [
  // ── Anytime ──────────────────────────────────────────────
  {
    id: "anytime-subhanallah-bihamdihi",
    categoryId: "anytime",
    title: "SubhanAllahi wa bihamdihi",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    transliteration: "Subhan-Allahi wa bihamdihi",
    translation: "Glory is to Allah and praise is to Him.",
    virtues:
      "Whoever says it 100 times a day has his sins wiped away, though they be like the foam of the sea.",
    reference: "Bukhari & Muslim",
    targetCount: 100,
  },
  {
    id: "anytime-tahlil",
    categoryId: "anytime",
    title: "La ilaha illallah, wahdahu la sharika lah",
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration:
      "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir",
    translation:
      "There is no god but Allah, alone, without partner. His is the dominion and His is the praise, and He is over all things capable.",
    virtues: "Whoever says it 100 times has a reward equal to freeing ten slaves.",
    reference: "Bukhari & Muslim",
    targetCount: 100,
  },
  {
    id: "anytime-istighfar",
    categoryId: "anytime",
    title: "Astaghfirullah",
    arabic: "أَسْتَغْفِرُ اللَّهَ",
    transliteration: "Astaghfirullah",
    translation: "I seek the forgiveness of Allah.",
    virtues: "The Prophet ﷺ would seek forgiveness more than seventy times a day.",
    reference: "Bukhari",
    targetCount: 100,
  },
  {
    id: "anytime-hawqala",
    categoryId: "anytime",
    title: "La hawla wa la quwwata illa billah",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "La hawla wa la quwwata illa billah",
    translation: "There is no might nor power except with Allah.",
    virtues: "A treasure from the treasures of Paradise.",
    reference: "Bukhari & Muslim",
    targetCount: 33,
  },

  // ── After Prayer ─────────────────────────────────────────
  {
    id: "after_prayer-tasbih",
    categoryId: "after_prayer",
    title: "SubhanAllah (x33)",
    arabic: "سُبْحَانَ اللَّهِ",
    transliteration: "Subhan-Allah",
    translation: "Glory is to Allah.",
    reference: "Muslim",
    targetCount: 33,
  },
  {
    id: "after_prayer-tahmid",
    categoryId: "after_prayer",
    title: "Alhamdulillah (x33)",
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: "Alhamdulillah",
    translation: "All praise is for Allah.",
    reference: "Muslim",
    targetCount: 33,
  },
  {
    id: "after_prayer-takbir",
    categoryId: "after_prayer",
    title: "Allahu Akbar (x34)",
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    translation: "Allah is the Greatest.",
    virtues:
      "Completing the tasbih after each prayer wipes away sins though they be like the foam of the sea.",
    reference: "Muslim",
    targetCount: 34,
  },

  // ── Morning ──────────────────────────────────────────────
  {
    id: "morning-tasbih-hundred",
    categoryId: "morning",
    title: "SubhanAllahi wa bihamdihi (x100)",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    transliteration: "Subhan-Allahi wa bihamdihi",
    translation: "Glory is to Allah and praise is to Him.",
    virtues:
      "None will come on the Day of Judgement with better than this, except one who did the same or more.",
    reference: "Muslim",
    targetCount: 100,
  },
  {
    id: "morning-protection",
    categoryId: "morning",
    title: "Bismillahilladhi la yadurru (x3)",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration:
      "Bismillahilladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama', wa huwas-Sami'ul-'Alim",
    translation:
      "In the name of Allah, with whose name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
    virtues: "Whoever says it three times, nothing will harm him.",
    reference: "Abu Dawud & Tirmidhi",
    targetCount: 3,
  },
  {
    id: "morning-sayyidul-istighfar",
    categoryId: "morning",
    title: "Sayyidul Istighfar",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
    transliteration:
      "Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata't",
    translation:
      "O Allah, You are my Lord, there is no god but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can.",
    virtues:
      "The best manner of seeking forgiveness; whoever says it with certainty enters Paradise.",
    reference: "Bukhari",
    targetCount: 1,
  },

  // ── Evening ──────────────────────────────────────────────
  {
    id: "evening-tasbih-hundred",
    categoryId: "evening",
    title: "SubhanAllahi wa bihamdihi (x100)",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    transliteration: "Subhan-Allahi wa bihamdihi",
    translation: "Glory is to Allah and praise is to Him.",
    reference: "Muslim",
    targetCount: 100,
  },
  {
    id: "evening-protection",
    categoryId: "evening",
    title: "Bismillahilladhi la yadurru (x3)",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration:
      "Bismillahilladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama', wa huwas-Sami'ul-'Alim",
    translation:
      "In the name of Allah, with whose name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
    reference: "Abu Dawud & Tirmidhi",
    targetCount: 3,
  },
  {
    id: "evening-refuge",
    categoryId: "evening",
    title: "A'udhu bikalimatillahit-tammat (x3)",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
    translation:
      "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    virtues: "Whoever says it three times in the evening, no venom will harm him that night.",
    reference: "Muslim",
    targetCount: 3,
  },

  // ── After Azan ───────────────────────────────────────────
  {
    id: "after_azan-salawat",
    categoryId: "after_azan",
    title: "Salawat upon the Prophet ﷺ",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ",
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad",
    translation: "O Allah, send blessings upon Muhammad and upon the family of Muhammad.",
    virtues:
      "Whoever sends blessings upon the Prophet ﷺ once, Allah sends blessings upon him tenfold.",
    reference: "Muslim",
    targetCount: 10,
  },
  {
    id: "after_azan-wasila",
    categoryId: "after_azan",
    title: "Dua after the Adhan",
    arabic: "اللَّهُمَّ رَبَّ هَٰذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ",
    transliteration:
      "Allahumma Rabba hadhihid-da'watit-tammah, was-salatil-qa'imah, ati Muhammadanil-wasilata wal-fadilah",
    translation:
      "O Allah, Lord of this perfect call and established prayer, grant Muhammad the intercession and favour.",
    virtues: "Whoever says it after the adhan, intercession is made permissible for him.",
    reference: "Bukhari",
    targetCount: 1,
  },
  {
    id: "after_azan-repeat",
    categoryId: "after_azan",
    title: "Repeat after the Muadhin",
    arabic: "وَأَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ",
    transliteration: "Wa ashhadu an la ilaha illallah wa anna Muhammadan rasulullah",
    translation:
      "And I bear witness that there is no god but Allah and that Muhammad is the Messenger of Allah.",
    reference: "Muslim",
    targetCount: 1,
  },

  // ── Before Prayer ────────────────────────────────────────
  {
    id: "before_prayer-intention",
    categoryId: "before_prayer",
    title: "Settle the heart before salah",
    arabic: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا",
    transliteration: "Innas-salata kanat 'alal-mu'minina kitaban mawquta",
    translation: "Indeed, prayer has been decreed upon the believers a decree of specified times.",
    reference: "Quran 4:103",
    targetCount: 1,
  },
  {
    id: "before_prayer-taawwudh",
    categoryId: "before_prayer",
    title: "Seek refuge from Shaytan",
    arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    transliteration: "A'udhu billahi minash-shaytanir-rajim",
    translation: "I seek refuge in Allah from the accursed Shaytan.",
    reference: "Quran 16:98",
    targetCount: 1,
  },
  {
    id: "before_prayer-salawat",
    categoryId: "before_prayer",
    title: "Salawat before standing",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ",
    transliteration: "Allahumma salli 'ala Muhammad",
    translation: "O Allah, send blessings upon Muhammad.",
    reference: "Muslim",
    targetCount: 3,
  },

  // ── Before Sleep ─────────────────────────────────────────
  {
    id: "before_sleep-name",
    categoryId: "before_sleep",
    title: "Bismika Allahumma amutu wa ahya",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
    translation: "In Your name, O Allah, I die and I live.",
    reference: "Bukhari",
    targetCount: 1,
  },
  {
    id: "before_sleep-tasbih-fatimah",
    categoryId: "before_sleep",
    title: "Tasbih of Fatimah",
    arabic: "سُبْحَانَ اللَّهِ (٣٣) الْحَمْدُ لِلَّهِ (٣٣) اللَّهُ أَكْبَرُ (٣٤)",
    transliteration: "Subhan-Allah (33), Alhamdulillah (33), Allahu Akbar (34)",
    translation: "Glory is to Allah, all praise is for Allah, Allah is the Greatest.",
    virtues: "Better for you than a servant, as the Prophet ﷺ taught Fatimah and 'Ali.",
    reference: "Bukhari & Muslim",
    targetCount: 100,
  },
  {
    id: "before_sleep-ikhlas",
    categoryId: "before_sleep",
    title: "Recite Al-Ikhlas, Al-Falaq, An-Nas",
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ … قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ … قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    transliteration: "Qul huwallahu ahad … Qul a'udhu bi-Rabbil-falaq … Qul a'udhu bi-Rabbin-nas",
    translation: "Recite the three Quls, blow into the palms, and wipe over the body three times.",
    reference: "Bukhari",
    targetCount: 3,
  },
];

export function getZikrById(id: string): ZikrItem | undefined {
  return ZIKR_ITEMS.find((item) => item.id === id);
}
