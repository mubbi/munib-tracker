import type { JannahHadithRef, JannahQuranRef } from "@munib-tracker/shared/types";

/** Qur'an evidence ref (Al-Imran 3:133) for Learn / Jannah-family evidence cards. */
export function buildJannahQuranRef(overrides: Partial<JannahQuranRef> = {}): JannahQuranRef {
  return {
    surah: 3,
    ayahFrom: 133,
    label: "Qur'an 3:133",
    excerpt: "And hasten to forgiveness from your Lord and a garden as wide as the heavens.",
    ...overrides,
  };
}

/** Graded hadith evidence ref for Learn / Jannah-family evidence cards. */
export function buildJannahHadithRef(overrides: Partial<JannahHadithRef> = {}): JannahHadithRef {
  return {
    collection: "Sahih al-Bukhari",
    citation: "3244",
    grade: "sahih",
    excerpt: "I have prepared for My righteous servants what no eye has seen.",
    ...overrides,
  };
}
