import type { QuranGuideStructureLevel } from "../types/quran-guide";

/** Visual breakdown of how the Qur'an is organised. */
export const QURAN_GUIDE_STRUCTURE_LEVELS: QuranGuideStructureLevel[] = [
  {
    id: "quran",
    label: "The Qur'an",
    count: "1 Book",
    detail:
      "Kalām Allah — speech revealed to Muhammad ﷺ through Jibreel, in Arabic, across 23 years.",
  },
  {
    id: "surahs",
    label: "Surahs (chapters)",
    count: "114",
    detail:
      "Each surah has a name (often from a key word), a Makki or Madani classification, and a place in the mus'haf order — which differs from revelation order.",
  },
  {
    id: "juz",
    label: "Juz (parts)",
    count: "30",
    detail:
      "Equal divisions for monthly recitation — one juz per day in Ramadan is a common khatm plan.",
  },
  {
    id: "hizb",
    label: "Hizb (sections)",
    count: "60",
    detail: "Each juz has two hizb — useful for splitting daily reading into smaller portions.",
  },
  {
    id: "ayahs",
    label: "Ayahs (verses)",
    count: "6,236",
    detail:
      "The standard count used in the Madinah mushaf. Scholars have noted slight variations in numbering at surah boundaries — the text is the same.",
  },
  {
    id: "classification",
    label: "Makki / Madani",
    count: "2 eras",
    detail:
      "Makki: revealed before Hijra (often shorter, focused on belief). Madani: after Hijra (often longer, with law and community guidance). Some surahs contain both.",
  },
  {
    id: "themes",
    label: "Themes",
    count: "Many",
    detail:
      "Tawheed, prayer, stories of prophets, family, charity, patience, and the Hereafter weave throughout — not isolated to single surahs.",
  },
];
