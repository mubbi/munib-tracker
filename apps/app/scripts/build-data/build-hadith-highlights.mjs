// D5 — build the bundled hadith highlight sets (offline):
//   assets/data/hadith/nawawi40.json
//   assets/data/hadith/riyad-as-salihin.json
//   assets/data/hadith/isnad-highlights.json  (NF-2.9 extract, also merged into items)
//   assets/data/hadith/nawawi40-sharh.json    (NF-2.8 sidecar via build-hadith-sharh)
//
// Source: AhmedBaset/hadith-json (scraped from sunnah.com; no explicit license).
// Only the small classical highlight collections are bundled; the full corpus
// is browsed via the runtime CDN (D6). See §12 licensing note.

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { buildHadithSharh } from "./build-hadith-sharh.mjs";
import { fetchJSON } from "./fetch.mjs";
import { ASSETS_DATA_DIR, datasetEntry, writeCompactJSON } from "./manifest.mjs";
import { assert } from "./schemas.mjs";

const HADITH_REPO = "https://cdn.jsdelivr.net/gh/AhmedBaset/hadith-json@main/db/by_book";
const HADITH_DIR = join(ASSETS_DATA_DIR, "hadith");
const ISNAD_FILE = join(HADITH_DIR, "isnad-highlights.json");

const PROPHET = {
  nameArabic: "رسول الله ﷺ",
  nameEnglish: "Messenger of Allah ﷺ",
  role: "prophet",
};

const SETS = [
  {
    collection: "nawawi40",
    source: "forties/nawawi40",
    reference: "Hadith 40 Nawawi",
    file: "nawawi40.json",
  },
  {
    collection: "riyad_assalihin",
    source: "other_books/riyad_assalihin",
    reference: "Riyad as-Salihin",
    file: "riyad-as-salihin.json",
  },
];

function textOf(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.title ?? value.text ?? "";
}

function normalizeChapters(chapters) {
  if (!Array.isArray(chapters)) return [];
  return chapters.map((c) => ({
    id: String(c.id ?? c.chapterId ?? ""),
    nameArabic: textOf(c.arabic),
    nameEnglish: textOf(c.english),
  }));
}

/** Strip honorifics / framing from English narrator intro → companion name. */
function companionFromEnglish(narrator) {
  if (!narrator || typeof narrator !== "string") return "";
  let s = narrator.trim();
  s = s.replace(
    /^(also\s+)?(on\s+the\s+authority\s+of|it\s+is\s+narrated\s+on\s+the\s+authority\s+of)\s+/i,
    "",
  );
  s = s.replace(/^from\s+/i, "");
  s = s.replace(/\s*\((?:ra|may\s+allah[^)]*)\)\s*/gi, " ");
  s = s.replace(/\s*(who\s+said|that\s+said|reported|narrated)\s*:?\s*$/i, "");
  s = s.replace(/\s*,?\s*who\s+said\s*:?\s*$/i, "");
  s = s
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[,:]+$/, "")
    .trim();
  return s;
}

function companionFromArabic(arabic) {
  if (!arabic || typeof arabic !== "string") return "";
  const text = arabic.replace(/^[\s\-–—]+/, "").trim();
  const m = text.match(/^عَ?نْ?\s+(.+?)(?:\s+رَضِي|\s+رضي|\s+قَال|\s+قال|\s+أَنَّ|\s+أن|\s+أنَّ)/u);
  if (!m) return "";
  return m[1].replace(/\s+/g, " ").trim();
}

/** Companion → Prophet chain as presented in Nawawi / Riyad (NF-2.9). */
function buildIsnad(englishNarrator, arabic) {
  const nameEnglish = companionFromEnglish(englishNarrator);
  const nameArabic = companionFromArabic(arabic) || nameEnglish;
  if (!nameEnglish && !nameArabic) return undefined;

  const companion = {
    order: 0,
    nameArabic: nameArabic || nameEnglish,
    role: "companion",
  };
  if (nameEnglish) companion.nameEnglish = nameEnglish;

  return [
    companion,
    {
      order: 1,
      nameArabic: PROPHET.nameArabic,
      nameEnglish: PROPHET.nameEnglish,
      role: PROPHET.role,
    },
  ];
}

async function loadCommittedIsnad() {
  try {
    const raw = await readFile(ISNAD_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return parsed?.byId && typeof parsed.byId === "object" ? parsed.byId : null;
  } catch {
    return null;
  }
}

function normalizeHadiths(raw, set, isnadById) {
  return raw.map((h) => {
    const english = typeof h.english === "string" ? { text: h.english } : (h.english ?? {});
    const number = String(h.idInBook ?? h.id);
    const id = `${set.collection}:${number}`;
    const item = {
      id,
      collection: set.collection,
      number,
      arabic: (h.arabic ?? "").trim(),
      english: (english.text ?? "").trim(),
      reference: `${set.reference} ${number}`,
    };
    if (h.chapterId != null && h.chapterId !== 0) item.chapterId = String(h.chapterId);
    if (english.narrator) item.narrator = english.narrator.trim();
    if (h.grade) item.grade = h.grade;

    const committed = isnadById?.[id]?.isnad;
    const isnad =
      Array.isArray(committed) && committed.length > 0
        ? committed
        : buildIsnad(english.narrator, h.arabic);
    if (isnad) item.isnad = isnad;

    return item;
  });
}

export async function buildHadithHighlights() {
  const written = [];
  const gaps = [];
  /** @type {Record<string, { isnad: object[] }>} */
  const isnadExtract = {};
  const committedIsnad = await loadCommittedIsnad();

  for (const set of SETS) {
    const data = await fetchJSON(`${HADITH_REPO}/${set.source}.json`);
    assert(Array.isArray(data.hadiths) && data.hadiths.length > 0, `${set.collection}: no hadiths`);

    const chapters = normalizeChapters(data.chapters);
    const items = normalizeHadiths(data.hadiths, set, committedIsnad);
    for (const item of items) {
      assert(item.arabic.length > 0, `${item.id}: empty arabic`);
      assert(item.reference.length > 0, `${item.id}: empty reference`);
      if (!item.grade) gaps.push({ id: item.id, missing: "grade" });
      if (item.isnad) isnadExtract[item.id] = { isnad: item.isnad };
    }

    const out = {
      collection: {
        id: set.collection,
        nameEnglish: textOf(data.metadata?.english) || set.reference,
        nameArabic: textOf(data.metadata?.arabic),
        bundled: true,
        bookCount: chapters.length,
      },
      chapters,
      items,
    };

    const path = join(HADITH_DIR, set.file);
    await writeCompactJSON(path, out);
    written.push(path);
    console.log(`  ${set.file} → ${items.length} hadiths, ${chapters.length} chapters`);
  }

  const isnadOut = {
    note:
      "NF-2.9 isnad extract for bundled highlights. Chains end with the Prophet ﷺ. " +
      "Companion-level presentation from AhmedBaset/hadith-json. Regenerate via " +
      "`node apps/app/scripts/build-data/extract-hadith-isnad.mjs` or `pnpm --filter app build:data`. " +
      "Optional fuller chains: HADITH_KG_PATH + better-sqlite3 (emadjumaah/hadith-kg, CC-BY-4.0).",
    version: 1,
    byId: isnadExtract,
  };
  await writeCompactJSON(ISNAD_FILE, isnadOut);
  written.push(ISNAD_FILE);
  console.log(`  isnad-highlights.json → ${Object.keys(isnadExtract).length} chains`);

  if (gaps.length) {
    const gapsPath = join(HADITH_DIR, "gaps.json");
    await writeCompactJSON(gapsPath, { note: "Hadiths missing an authenticity grade.", gaps });
    written.push(gapsPath);
    console.log(`  gaps.json → ${gaps.length} items without a grade`);
  }

  const sharhEntries = await buildHadithSharh();

  return [
    await datasetEntry({
      id: "hadith-highlights",
      kind: "hadith",
      version: 2,
      absFiles: written,
      license: "Unlicensed source (classical/public-domain hadith text)",
      attribution:
        "Hadith text via AhmedBaset/hadith-json, scraped from sunnah.com. Isnad structured from collection narrator openings (NF-2.9).",
      sourceUrl: "https://sunnah.com/",
      note: "TODO(license): source has no explicit license; only classical highlight sets are bundled.",
    }),
    ...sharhEntries,
  ];
}
