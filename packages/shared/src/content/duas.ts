import type { DuaCategoryId, DuaItem } from "../types/index";

export const DUA_CONTENT_VERSION = 1;

export const DUA_CATEGORY_LABELS: Record<DuaCategoryId, string> = {
  sunnah: "Sunnah Duas",
  quranic: "Quranic Duas",
  daily: "Daily Duas",
};

export const DUA_ITEMS: DuaItem[] = [
  // ── Quranic ──────────────────────────────────────────────
  {
    id: "quranic-hasanah",
    categoryId: "quranic",
    title: "Good in this world and the next",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration:
      "Rabbana atina fid-dunya hasanah, wa fil-akhirati hasanah, wa qina 'adhaban-nar",
    translation:
      "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    reference: "Quran 2:201",
  },
  {
    id: "quranic-ilma",
    categoryId: "quranic",
    title: "Increase me in knowledge",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidni 'ilma",
    translation: "My Lord, increase me in knowledge.",
    reference: "Quran 20:114",
  },
  {
    id: "quranic-sabr",
    categoryId: "quranic",
    title: "Patience and steadfastness",
    arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا",
    transliteration: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana",
    translation: "Our Lord, pour upon us patience and make firm our footing.",
    reference: "Quran 2:250",
  },

  // ── Sunnah ───────────────────────────────────────────────
  {
    id: "sunnah-huda-tuqa",
    categoryId: "sunnah",
    title: "Guidance and contentment",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
    transliteration: "Allahumma inni as'aluka al-huda wat-tuqa wal-'afafa wal-ghina",
    translation: "O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.",
    reference: "Muslim",
  },
  {
    id: "sunnah-hamm-hazan",
    categoryId: "sunnah",
    title: "Relief from anxiety and grief",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan",
    translation: "O Allah, I seek refuge in You from anxiety and grief.",
    reference: "Bukhari",
  },
  {
    id: "sunnah-afiyah",
    categoryId: "sunnah",
    title: "Well-being in body and faith",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    transliteration: "Allahumma inni as'alukal-'afiyata fid-dunya wal-akhirah",
    translation: "O Allah, I ask You for well-being in this world and the Hereafter.",
    reference: "Ibn Majah",
  },

  // ── Daily ────────────────────────────────────────────────
  {
    id: "daily-before-eating",
    categoryId: "daily",
    title: "Before eating",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah",
    translation: "In the name of Allah.",
    reference: "Abu Dawud",
  },
  {
    id: "daily-leaving-home",
    categoryId: "daily",
    title: "Leaving the home",
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "Bismillah, tawakkaltu 'alallah, wa la hawla wa la quwwata illa billah",
    translation:
      "In the name of Allah, I place my trust in Allah; there is no might nor power except with Allah.",
    reference: "Abu Dawud & Tirmidhi",
  },
  {
    id: "daily-travel",
    categoryId: "daily",
    title: "Travel",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
    transliteration: "Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrinin",
    translation:
      "Glory to Him who has subjected this to us, and we could not have done it by ourselves.",
    reference: "Quran 43:13 · Muslim",
  },
];

export function duasByCategory(categoryId: DuaCategoryId): DuaItem[] {
  return DUA_ITEMS.filter((item) => item.categoryId === categoryId);
}

export function getDuaById(id: string): DuaItem | undefined {
  return DUA_ITEMS.find((item) => item.id === id);
}
