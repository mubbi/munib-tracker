// Zero-dependency validators + canonical Qur'an reference tables for the build
// pipeline. Kept dependency-free (no zod) so the pipeline runs with only Node.

export const TOTAL_SURAHS = 114;
export const TOTAL_AYAHS = 6236;
export const TOTAL_PAGES = 604;
export const TOTAL_HIZBS = 60;

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

/**
 * Validate per-ayah page/hizb metadata and the 604-page start index.
 * @param {{ surahs: any[], pageMetaBySurah: Map<number, Record<number, { page: number, hizb: number }>>, pageStarts: { page: number, surah: number, ayah: number }[] }} data
 */
export function validateQuranPageMeta({ surahs, pageMetaBySurah, pageStarts }) {
  assert(
    pageStarts.length === TOTAL_PAGES,
    `expected ${TOTAL_PAGES} page starts, got ${pageStarts.length}`,
  );
  assert(
    pageStarts[0].page === 1 && pageStarts[0].surah === 1 && pageStarts[0].ayah === 1,
    "page 1 must start at 1:1",
  );

  let prevPage = 0;
  let prevPos = 0;
  for (const start of pageStarts) {
    assert(start.page === prevPage + 1, `page starts not sequential at page ${start.page}`);
    prevPage = start.page;
    const p = pos(start.surah, start.ayah);
    assert(p >= prevPos, `page ${start.page} start ${start.surah}:${start.ayah} not monotonic`);
    prevPos = p;
    const meta = pageMetaBySurah.get(start.surah)?.[start.ayah];
    assert(meta?.page === start.page, `page ${start.page} start meta mismatch`);
  }

  let total = 0;
  let lastPage = 0;
  for (const surah of surahs) {
    const metaMap = pageMetaBySurah.get(surah.number);
    assert(metaMap, `missing page meta for surah ${surah.number}`);
    for (let ayah = 1; ayah <= surah.ayahCount; ayah++) {
      const meta = metaMap[ayah];
      assert(meta, `missing page meta for ${surah.number}:${ayah}`);
      assert(
        meta.page >= 1 && meta.page <= TOTAL_PAGES,
        `${surah.number}:${ayah} page ${meta.page} out of range`,
      );
      assert(
        meta.hizb >= 1 && meta.hizb <= TOTAL_HIZBS,
        `${surah.number}:${ayah} hizb ${meta.hizb} out of range`,
      );
      assert(meta.page >= lastPage, `${surah.number}:${ayah} page regresses`);
      lastPage = meta.page;
      assert(juzForAyah(surah.number, ayah) >= 1, `juz check failed for ${surah.number}:${ayah}`);
      total++;
    }
  }
  assert(total === TOTAL_AYAHS, `expected ${TOTAL_AYAHS} ayah meta rows, got ${total}`);

  const last = pageStarts[TOTAL_PAGES - 1];
  assert(last.surah === 112 && last.ayah === 1, "page 604 must start at 112:1");
}

/**
 * Validate normalized mushaf layout pages (604 files).
 * @param {{ layouts: { page: number, lines: any[] }[], pageStarts: { page: number, surah: number, ayah: number }[] }} data
 */
export function validateMushafLayout({ layouts, pageStarts }) {
  assert(
    layouts.length === TOTAL_PAGES,
    `expected ${TOTAL_PAGES} layout pages, got ${layouts.length}`,
  );
  for (const layout of layouts) {
    assert(layout.page >= 1 && layout.page <= TOTAL_PAGES, `invalid layout page ${layout.page}`);
    assert(
      Array.isArray(layout.lines) && layout.lines.length > 0,
      `page ${layout.page}: empty lines`,
    );
    for (const line of layout.lines) {
      assert(typeof line.type === "string", `page ${layout.page}: line missing type`);
      if (line.type === "surah_name") {
        assert(
          line.surah >= 1 && line.surah <= TOTAL_SURAHS,
          `page ${layout.page}: bad surah_name`,
        );
        assert(
          typeof line.text === "string" && line.text.length > 0,
          `page ${layout.page}: empty surah_name`,
        );
      } else if (line.type === "basmala") {
        assert(
          typeof line.glyphs === "string" && line.glyphs.length > 0,
          `page ${layout.page}: empty basmala`,
        );
      } else if (line.type === "text") {
        assert(
          typeof line.glyphs === "string" && line.glyphs.length > 0,
          `page ${layout.page}: empty text line`,
        );
        assert(
          line.alignment === "centered" || line.alignment === "justified",
          `page ${layout.page}: bad alignment`,
        );
      } else {
        assert(false, `page ${layout.page}: unknown line type ${line.type}`);
      }
    }
  }
  const startByPage = new Map(pageStarts.map((s) => [s.page, s]));
  for (const layout of layouts) {
    assert(startByPage.has(layout.page), `layout page ${layout.page} missing from page starts`);
  }
}
