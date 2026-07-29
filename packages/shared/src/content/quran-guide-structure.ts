import type { QuranGuideStructureLevel } from "../types/quran-guide";

/**
 * Visual breakdown of how the Qur'an is organised. Bump
 * QURAN_GUIDE_STRUCTURE_VERSION on content change.
 */
export const QURAN_GUIDE_STRUCTURE_VERSION = 2;

export const QURAN_GUIDE_STRUCTURE_LEVELS: QuranGuideStructureLevel[] = [
  {
    id: "quran",
    label: "The Qur'an",
    count: "1 Book",
    detail:
      "One Book — kalam Allah, the literal speech of Allah, revealed to Muhammad ﷺ through the angel Jibreel, in clear Arabic, gradually over about 23 years. It is the same single text everywhere in the world.",
  },
  {
    id: "surahs",
    label: "Surahs (chapters)",
    count: "114",
    detail:
      "The Qur'an is divided into 114 surahs, ranging from just three verses to 286. Each has a name, usually taken from a key word inside it, and is classed as Makki or Madani. Their order in the mus'haf was fixed by revelation (tawqifi) and differs from the order of revelation.",
  },
  {
    id: "juz",
    label: "Juz (parts)",
    count: "30",
    detail:
      "Thirty roughly equal parts, designed to make reading manageable. Reciting one juz a day completes the whole Qur'an in a month — the classic way to finish a khatm during Ramadan.",
  },
  {
    id: "hizb",
    label: "Hizb (sections)",
    count: "60",
    detail:
      "Each juz splits into two hizb, giving 60 in total, and each hizb further into quarters. These smaller units let you set a gentle daily portion — a half or quarter hizb — and keep a steady habit.",
  },
  {
    id: "ayahs",
    label: "Ayahs (verses)",
    count: "6,236",
    detail:
      "The individual verses, numbered so any passage can be cited precisely as surah:ayah. 6,236 is the standard Madinah count; other historic counting methods differ only in how a few verse-boundaries are marked — the words themselves are identical.",
  },
  {
    id: "classification",
    label: "Makki / Madani",
    count: "2 eras",
    detail:
      "Every surah belongs to one of two revelation eras. Makki (before the Hijra) surahs are often shorter and focus on belief, tawhid, and the Hereafter. Madani (after the Hijra) surahs are often longer and add law and community guidance. A few surahs contain verses from both.",
  },
  {
    id: "themes",
    label: "Themes",
    count: "Many",
    detail:
      "The Qur'an is woven around recurring themes rather than organised topic by topic. Tawhid, prayer, the stories of the prophets, family, charity, patience, and the Hereafter run throughout the Book, reinforcing one another across many surahs.",
  },
];
