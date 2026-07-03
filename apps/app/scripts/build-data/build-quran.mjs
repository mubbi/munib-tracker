// D1 — build the bundled Qur'an assets:
//   assets/data/quran/meta.json
//   assets/data/quran/arabic/{001..114}.json          (Uthmani, verbatim)
//   assets/data/quran/translit/{001..114}.json
//   assets/data/quran/translation/{editionId}/{001..114}.json
// plus the generated require-map src/lib/quran-loader.ts.
//
// Arabic + transliteration + surah metadata come from risan/quran-json
// (Tanzil-derived, CC BY-SA). The public-domain translations come from
// fawazahmed0/quran-api. Per-ayah juz/sajda are computed at runtime from
// canonical tables, so only text is stored here.

import { join } from "node:path";

import { fetchJSON } from "./fetch.mjs";
import {
  APP_ROOT,
  ASSETS_DATA_DIR,
  datasetEntry,
  writeCompactJSON,
  writeFileStable,
  writeJSON,
} from "./manifest.mjs";
import { assert, validateQuran } from "./schemas.mjs";

const QURAN_JSON = "https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist";
const FAWAZ = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions";

const QURAN_DIR = join(ASSETS_DATA_DIR, "quran");

/** Bundled public-domain translation editions (fawazahmed0 full-edition files). */
const BUNDLED_TRANSLATIONS = [
  {
    id: "en-pickthall",
    fawaz: "eng-mohammedmarmadu",
    language: "en",
    name: "Pickthall",
    direction: "ltr",
  },
  {
    id: "en-yusufali",
    fawaz: "eng-abdullahyusufal",
    language: "en",
    name: "Yusuf Ali",
    direction: "ltr",
  },
  {
    id: "ur-jalandhry",
    fawaz: "urd-fatehmuhammadja",
    language: "ur",
    name: "Jalandhry",
    direction: "rtl",
  },
];

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

  for (const surah of surahs) {
    const n = pad3(surah.number);
    const arabicPath = join(QURAN_DIR, "arabic", `${n}.json`);
    const translitPath = join(QURAN_DIR, "translit", `${n}.json`);
    await writeCompactJSON(arabicPath, toMap(arabicBySurah.get(surah.number)));
    await writeCompactJSON(translitPath, toMap(translitBySurah.get(surah.number)));
    writtenFiles.push(arabicPath, translitPath);

    for (const ed of BUNDLED_TRANSLATIONS) {
      const path = join(QURAN_DIR, "translation", ed.id, `${n}.json`);
      await writeCompactJSON(path, toMap(editionMaps[ed.id].get(surah.number)));
      writtenFiles.push(path);
    }
  }

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
      kind: "translation",
      language: ed.language,
      name: ed.name,
      bundled: true,
      direction: ed.direction,
    })),
  ];

  const metaPath = join(QURAN_DIR, "meta.json");
  await writeJSON(metaPath, { surahs, editions });
  writtenFiles.push(metaPath);

  // Generate the static require-map loader (literal requires — Metro cannot
  // resolve variable require paths).
  const loaderPath = join(APP_ROOT, "src", "lib", "quran-loader.ts");
  await writeFileStable(loaderPath, renderLoader(surahs, BUNDLED_TRANSLATIONS));
  console.log("  wrote src/lib/quran-loader.ts");

  return [
    await datasetEntry({
      id: "quran-core",
      kind: "quran",
      version: 1,
      absFiles: [...writtenFiles, loaderPath],
      license: "CC BY-SA 4.0 (Arabic & transliteration) / Public domain (translations)",
      attribution:
        "Arabic & transliteration: Tanzil.net via risan/quran-json. Translations: Pickthall, Yusuf Ali, Fateh Muhammad Jalandhry via fawazahmed0/quran-api.",
      sourceUrl: "https://tanzil.net/",
    }),
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

export const arabicLoaders: Record<number, SurahJsonLoader> = {
${arabic}
};

export const transliterationLoaders: Record<number, SurahJsonLoader> = {
${translit}
};

export const translationLoaders: Record<string, Record<number, SurahJsonLoader>> = {
${translationBlocks}
};
`;
}
