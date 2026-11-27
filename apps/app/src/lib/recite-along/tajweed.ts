/**
 * Tajweed links from the Arabic letters page (D68). The qalqalah letters — ق ط ب
 * ج د ("qutbu jad") — echo when they carry a sukun; their card links to the
 * qalqalah pronunciation drill (`/learn-quran/tajweed/drill/qalqalah`), which
 * exists because `LESSON_DRILL_HEAD` has a `qalqalah` head.
 */
export const QALQALAH_DRILL_LESSON = "qalqalah";

/** Letter ids (`QURAN_GUIDE_LETTERS`) of the five qalqalah letters. */
export const QALQALAH_LETTER_IDS: readonly string[] = ["qaf", "ta-emph", "ba", "jim", "dal"];

export function isQalqalahLetter(letterId: string): boolean {
  return QALQALAH_LETTER_IDS.includes(letterId);
}
