// Zero-dependency validators + canonical Qur'an reference tables for the build
// pipeline. Kept dependency-free (no zod) so the pipeline runs with only Node.

export const TOTAL_SURAHS = 114;
export const TOTAL_AYAHS = 6236;

/**
 * Canonical starting ayah of each of the 30 juz (surah:ayah). Standard Hafs
 * division — stable and well documented.
 */
export const JUZ_STARTS = [
  [1, 1],
  [2, 142],
  [2, 253],
  [3, 92],
  [4, 24],
  [4, 148],
  [5, 82],
  [6, 111],
  [7, 88],
  [8, 41],
  [9, 93],
  [11, 6],
  [12, 53],
  [15, 1],
  [17, 1],
  [18, 75],
  [21, 1],
  [23, 1],
  [25, 21],
  [27, 56],
  [29, 46],
  [33, 31],
  [36, 28],
  [39, 32],
  [41, 47],
  [46, 1],
  [51, 31],
  [58, 1],
  [67, 1],
  [78, 1],
];

/** The 15 places of prostration (sajda) in the mushaf, as surah:ayah. */
export const SAJDA_AYAHS = [
  [7, 206],
  [13, 15],
  [16, 50],
  [17, 109],
  [19, 58],
  [22, 18],
  [22, 77],
  [25, 60],
  [27, 26],
  [32, 15],
  [38, 24],
  [41, 38],
  [53, 62],
  [84, 21],
  [96, 19],
];

const SAJDA_SET = new Set(SAJDA_AYAHS.map(([s, a]) => s * 1000 + a));

/** Comparable position key for (surah, ayah). */
function pos(surah, ayah) {
  return surah * 1000 + ayah;
}

/** Juz (1..30) containing the given ayah. */
export function juzForAyah(surah, ayah) {
  const p = pos(surah, ayah);
  let juz = 1;
  for (let i = 0; i < JUZ_STARTS.length; i++) {
    const [s, a] = JUZ_STARTS[i];
    if (p >= pos(s, a)) juz = i + 1;
    else break;
  }
  return juz;
}

export function isSajdaAyah(surah, ayah) {
  return SAJDA_SET.has(pos(surah, ayah));
}

/** Throws with a descriptive message if the condition is false. */
export function assert(condition, message) {
  if (!condition) throw new Error(`[validate] ${message}`);
}

/**
 * Validate the assembled Qur'an data before it is written to disk.
 * @param {{ surahs: any[], ayahsBySurah: Map<number, any[]>, editions: Record<string, Map<number,string[]>> }} data
 */
export function validateQuran({ surahs, ayahsBySurah, editions }) {
  assert(surahs.length === TOTAL_SURAHS, `expected ${TOTAL_SURAHS} surahs, got ${surahs.length}`);

  let total = 0;
  for (const surah of surahs) {
    const ayahs = ayahsBySurah.get(surah.number);
    assert(Array.isArray(ayahs), `missing ayahs for surah ${surah.number}`);
    assert(
      ayahs.length === surah.ayahCount,
      `surah ${surah.number}: meta ayahCount ${surah.ayahCount} !== ${ayahs.length} verses`,
    );
    for (const ayah of ayahs) {
      assert(
        typeof ayah.arabic === "string" && ayah.arabic.trim().length > 0,
        `surah ${surah.number} ayah ${ayah.ayah}: empty arabic`,
      );
    }
    total += ayahs.length;
  }
  assert(total === TOTAL_AYAHS, `expected ${TOTAL_AYAHS} ayahs total, got ${total}`);

  for (const [editionId, bySurah] of Object.entries(editions)) {
    for (const surah of surahs) {
      const lines = bySurah.get(surah.number);
      assert(Array.isArray(lines), `edition ${editionId}: missing surah ${surah.number}`);
      assert(
        lines.length === surah.ayahCount,
        `edition ${editionId} surah ${surah.number}: ${lines.length} lines !== ${surah.ayahCount} ayahs`,
      );
    }
  }
}
