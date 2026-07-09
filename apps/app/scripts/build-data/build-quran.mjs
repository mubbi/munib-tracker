// D1 — build the bundled Qur'an assets:
//   assets/data/quran/meta.json
//   assets/data/quran/arabic/{001..114}.json          (Uthmani, verbatim)
//   assets/data/quran/translit/{001..114}.json
//   assets/data/quran/translation/{editionId}/{001..114}.json
//   assets/data/quran/ayah-meta/{001..114}.json       (page + hizb per ayah)
//   assets/data/quran/pages/index.json                (604 page start points)
// plus the generated require-map src/lib/quran-loader.ts.
//
// Arabic + transliteration + surah metadata come from risan/quran-json
// (Tanzil-derived, CC BY-SA). The public-domain translations come from
// fawazahmed0/quran-api. Per-ayah page/hizb from Quran.com API v4 (Madani
// mushaf). Juz/sajda are computed at runtime from canonical tables.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildMushafLayout } from "./build-mushaf-layout.mjs";
import { fetchJSON } from "./fetch.mjs";
import {
  APP_ROOT,
  ASSETS_DATA_DIR,
  datasetEntry,
  writeCompactJSON,
  writeFileStable,
  writeJSON,
} from "./manifest.mjs";
import { assert, TOTAL_PAGES, validateQuran, validateQuranPageMeta } from "./schemas.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EDITION_DEFS = JSON.parse(
  readFileSync(
    join(__dirname, "../../../../packages/shared/src/i18n/quran-edition-defs.json"),
    "utf8",
  ),
);

const QURAN_JSON = "https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist";
const FAWAZ = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions";
const QURAN_COM = "https://api.quran.com/api/v4";

const QURAN_DIR = join(ASSETS_DATA_DIR, "quran");

/** Bundled public-domain translation editions (single source: quran-edition-defs.json). */
const BUNDLED_TRANSLATIONS = EDITION_DEFS.filter((ed) => ed.bundled);

function pad3(n) {
  return String(n).padStart(3, "0");
}

function revelationPlace(type) {
  return type === "medinan" ? "madinah" : "makkah";
}

/** Group a flat fawazahmed0 edition (`{chapter, verse, text}[]`) into surah → text[]. */
function groupEdition(quran) {
  const bySurah = new Map();
  for (const row of quran) {
    let arr = bySurah.get(row.chapter);
    if (!arr) {
      arr = [];
      bySurah.set(row.chapter, arr);
    }
    arr[row.verse - 1] = row.text;
  }
  return bySurah;
}

/** Fetch per-ayah page + hizb for one surah from Quran.com API v4. */
async function fetchSurahPageMeta(surahNumber, ayahCount) {
  const metaByAyah = {};
  let page = 1;
  const perPage = 300;
  while (true) {
    const data = await fetchJSON(
      `${QURAN_COM}/verses/by_chapter/${surahNumber}?words=false&per_page=${perPage}&page=${page}`,
    );
    for (const verse of data.verses ?? []) {
      metaByAyah[verse.verse_number] = {
        page: verse.page_number,
        hizb: verse.hizb_number,
      };
    }
    if (!data.pagination?.next_page) break;
    page = data.pagination.next_page;
  }
  assert(
    Object.keys(metaByAyah).length === ayahCount,
    `surah ${surahNumber}: expected ${ayahCount} page meta rows, got ${Object.keys(metaByAyah).length}`,
  );
  return metaByAyah;
}

/** Derive 604 page start points from per-ayah page metadata. */
function buildPageStarts(pageMetaBySurah, surahs) {
  const starts = [];
  let expectedPage = 1;
  for (const surah of surahs) {
    const metaMap = pageMetaBySurah.get(surah.number);
    for (let ayah = 1; ayah <= surah.ayahCount; ayah++) {
      const page = metaMap[ayah].page;
      if (page === expectedPage) {
        starts.push({ page, surah: surah.number, ayah });
        expectedPage++;
        if (expectedPage > TOTAL_PAGES) break;
      }
    }
    if (expectedPage > TOTAL_PAGES) break;
  }
  return starts;
}

export async function buildQuran() {
  console.log("  fetching surah index…");
  const index = await fetchJSON(`${QURAN_JSON}/chapters/en/index.json`);
  assert(index.length === 114, `expected 114 chapters, got ${index.length}`);

  const surahs = index.map((c) => ({
    number: c.id,
    nameArabic: c.name,
    nameEnglish: c.translation,
    nameTransliteration: c.transliteration,
    revelationPlace: revelationPlace(c.type),
    ayahCount: c.total_verses,
    bismillahPre: c.id !== 9,
  }));

  // Arabic + transliteration, per surah, from quran-json.
  const arabicBySurah = new Map();
  const translitBySurah = new Map();
  for (const surah of surahs) {
    const data = await fetchJSON(`${QURAN_JSON}/chapters/en/${surah.number}.json`);
    const arabic = data.verses.map((v) => v.text);
    const translit = data.verses.map((v) => v.transliteration);
    arabicBySurah.set(surah.number, arabic);
    translitBySurah.set(surah.number, translit);
  }
  console.log("  fetched arabic + transliteration");

  // Per-ayah page + hizb metadata (Madani mushaf) from Quran.com.
  console.log("  fetching page + hizb metadata…");
  const pageMetaBySurah = new Map();
  for (const surah of surahs) {
    const metaMap = await fetchSurahPageMeta(surah.number, surah.ayahCount);
    pageMetaBySurah.set(surah.number, metaMap);
    if (surah.number % 20 === 0) console.log(`    … surah ${surah.number}/114`);
  }
  const pageStarts = buildPageStarts(pageMetaBySurah, surahs);
  validateQuranPageMeta({ surahs, pageMetaBySurah, pageStarts });
  console.log("  ✓ validated page + hizb metadata (604 pages)");

  // Public-domain translations from fawazahmed0.
  const editionMaps = {};
  for (const ed of BUNDLED_TRANSLATIONS) {
    const full = await fetchJSON(`${FAWAZ}/${ed.fawaz}.json`);
    assert(full.quran.length === 6236, `${ed.id}: expected 6236 verses, got ${full.quran.length}`);
    editionMaps[ed.id] = groupEdition(full.quran);
    console.log(`  fetched translation ${ed.id}`);
  }

  // Validate before writing anything.
  const ayahsBySurah = new Map();
  for (const surah of surahs) {
    ayahsBySurah.set(
      surah.number,
      arabicBySurah.get(surah.number).map((text, i) => ({ ayah: i + 1, arabic: text })),
    );
  }
  const editionsForValidation = { "ar-translit": translitBySurah, ...editionMaps };
  validateQuran({ surahs, ayahsBySurah, editions: editionsForValidation });
  console.log("  ✓ validated 114 surahs / 6236 ayahs / edition alignment");

  // Write per-surah files (keyed by stringified ayah number).
  const writtenFiles = [];
  function toMap(arr) {
    const out = {};
    arr.forEach((text, i) => {
      out[String(i + 1)] = text;
    });
    return out;
  }

  function toAyahMetaMap(metaMap) {
    const out = {};
    for (const [ayah, meta] of Object.entries(metaMap)) {
      out[ayah] = { page: meta.page, hizb: meta.hizb };
    }
    return out;
  }

  for (const surah of surahs) {
    const n = pad3(surah.number);
    const arabicPath = join(QURAN_DIR, "arabic", `${n}.json`);
    const translitPath = join(QURAN_DIR, "translit", `${n}.json`);
    const ayahMetaPath = join(QURAN_DIR, "ayah-meta", `${n}.json`);
    await writeCompactJSON(arabicPath, toMap(arabicBySurah.get(surah.number)));
    await writeCompactJSON(translitPath, toMap(translitBySurah.get(surah.number)));
    await writeCompactJSON(ayahMetaPath, toAyahMetaMap(pageMetaBySurah.get(surah.number)));
    writtenFiles.push(arabicPath, translitPath, ayahMetaPath);

    for (const ed of BUNDLED_TRANSLATIONS) {
      const path = join(QURAN_DIR, "translation", ed.id, `${n}.json`);
      await writeCompactJSON(path, toMap(editionMaps[ed.id].get(surah.number)));
      writtenFiles.push(path);
    }
  }

  const pagesIndexPath = join(QURAN_DIR, "pages", "index.json");
  await writeJSON(pagesIndexPath, { pageCount: TOTAL_PAGES, starts: pageStarts });
  writtenFiles.push(pagesIndexPath);

  // Edition catalogue for meta.json.
  const editions = [
    {
      id: "en-transliteration",
      kind: "transliteration",
      language: "en",
      name: "Transliteration",
      bundled: true,
      direction: "ltr",
    },
    ...BUNDLED_TRANSLATIONS.map((ed) => ({
      id: ed.id,
      kind: ed.kind ?? "translation",
      language: ed.language,
      name: ed.name,
      bundled: true,
      direction: ed.direction,
    })),
  ];

  const metaPath = join(QURAN_DIR, "meta.json");
  await writeJSON(metaPath, { surahs, editions, pageCount: TOTAL_PAGES });
  writtenFiles.push(metaPath);

  // Mushaf line layout (604 pages).
  const mushaf = await buildMushafLayout({ pageStarts });

  // Generate the static require-map loader (literal requires — Metro cannot
  // resolve variable require paths).
  const loaderPath = join(APP_ROOT, "src", "lib", "quran-loader.ts");
  await writeFileStable(loaderPath, renderLoader(surahs, BUNDLED_TRANSLATIONS));
  console.log("  wrote src/lib/quran-loader.ts");
  writtenFiles.push(loaderPath);

  return [
    await datasetEntry({
      id: "quran-core",
      kind: "quran",
      version: 2,
      absFiles: writtenFiles.filter((f) => !f.includes("layout/madinah-15")),
      license: "CC BY-SA 4.0 (Arabic & transliteration) / Public domain (translations)",
      attribution:
        "Arabic & transliteration: Tanzil.net via risan/quran-json. Translations: Pickthall, Yusuf Ali, Fateh Muhammad Jalandhry via fawazahmed0/quran-api. Page metadata: Quran.com API v4 (Madani mushaf).",
      sourceUrl: "https://tanzil.net/",
    }),
    mushaf.dataset,
  ];
}

function renderLoader(surahs, translations) {
  const rel = "../../assets/data/quran";
  const arabic = surahs
    .map((s) => `  ${s.number}: () => require("${rel}/arabic/${pad3(s.number)}.json"),`)
    .join("\n");
  const translit = surahs
    .map((s) => `  ${s.number}: () => require("${rel}/translit/${pad3(s.number)}.json"),`)
    .join("\n");
  const ayahMeta = surahs
    .map((s) => `  ${s.number}: () => require("${rel}/ayah-meta/${pad3(s.number)}.json"),`)
    .join("\n");
  const pageLayout = Array.from({ length: TOTAL_PAGES }, (_, i) => {
    const page = i + 1;
    return `  ${page}: () => require("${rel}/layout/madinah-15/${pad3(page)}.json"),`;
  }).join("\n");
  const translationBlocks = translations
    .map((ed) => {
      const rows = surahs
        .map(
          (s) =>
            `    ${s.number}: () => require("${rel}/translation/${ed.id}/${pad3(s.number)}.json"),`,
        )
        .join("\n");
      return `  "${ed.id}": {\n${rows}\n  },`;
    })
    .join("\n");

  return `// GENERATED by scripts/build-data/build-quran.mjs — do not edit by hand.
// Static require-map so Metro can bundle per-surah JSON and evaluate it lazily.

export type SurahJsonLoader = () => Record<string, string>;

export type AyahMetaLoader = () => Record<string, { page: number; hizb: number }>;

export type MushafPageLoader = () => import("@munib-tracker/shared/types").MushafPageLayout;

export const arabicLoaders: Record<number, SurahJsonLoader> = {
${arabic}
};

export const transliterationLoaders: Record<number, SurahJsonLoader> = {
${translit}
};

export const ayahMetaLoaders: Record<number, AyahMetaLoader> = {
${ayahMeta}
};

export const mushafPageLoaders: Record<number, MushafPageLoader> = {
${pageLayout}
};

export const translationLoaders: Record<string, Record<number, SurahJsonLoader>> = {
${translationBlocks}
};
`;
}
