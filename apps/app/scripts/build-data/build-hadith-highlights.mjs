// D5 — build the bundled hadith highlight sets (offline):
//   assets/data/hadith/nawawi40.json
//   assets/data/hadith/riyad-as-salihin.json
//
// Source: AhmedBaset/hadith-json (scraped from sunnah.com; no explicit license).
// Only the small classical highlight collections are bundled; the full corpus
// is browsed via the runtime CDN (D6). See §12 licensing note.

import { join } from "node:path";

import { fetchJSON } from "./fetch.mjs";
import { ASSETS_DATA_DIR, datasetEntry, writeCompactJSON } from "./manifest.mjs";
import { assert } from "./schemas.mjs";

const HADITH_REPO = "https://cdn.jsdelivr.net/gh/AhmedBaset/hadith-json@main/db/by_book";
const HADITH_DIR = join(ASSETS_DATA_DIR, "hadith");

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

function normalizeHadiths(raw, set) {
  return raw.map((h) => {
    const english = typeof h.english === "string" ? { text: h.english } : (h.english ?? {});
    const number = String(h.idInBook ?? h.id);
    const item = {
      id: `${set.collection}:${number}`,
      collection: set.collection,
      number,
      arabic: (h.arabic ?? "").trim(),
      english: (english.text ?? "").trim(),
      reference: `${set.reference} ${number}`,
    };
    if (h.chapterId != null && h.chapterId !== 0) item.chapterId = String(h.chapterId);
    if (english.narrator) item.narrator = english.narrator.trim();
    if (h.grade) item.grade = h.grade;
    return item;
  });
}

export async function buildHadithHighlights() {
  const written = [];
  const gaps = [];

  for (const set of SETS) {
    const data = await fetchJSON(`${HADITH_REPO}/${set.source}.json`);
    assert(Array.isArray(data.hadiths) && data.hadiths.length > 0, `${set.collection}: no hadiths`);

    const chapters = normalizeChapters(data.chapters);
    const items = normalizeHadiths(data.hadiths, set);
    for (const item of items) {
      assert(item.arabic.length > 0, `${item.id}: empty arabic`);
      assert(item.reference.length > 0, `${item.id}: empty reference`);
      if (!item.grade) gaps.push({ id: item.id, missing: "grade" });
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

  if (gaps.length) {
    const gapsPath = join(HADITH_DIR, "gaps.json");
    await writeCompactJSON(gapsPath, { note: "Hadiths missing an authenticity grade.", gaps });
    written.push(gapsPath);
    console.log(`  gaps.json → ${gaps.length} items without a grade`);
  }

  return [
    await datasetEntry({
      id: "hadith-highlights",
      kind: "hadith",
      version: 1,
      absFiles: written,
      license: "Unlicensed source (classical/public-domain hadith text)",
      attribution: "Hadith text via AhmedBaset/hadith-json, scraped from sunnah.com.",
      sourceUrl: "https://sunnah.com/",
      note: "TODO(license): source has no explicit license; only classical highlight sets are bundled.",
    }),
  ];
}
