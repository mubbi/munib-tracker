// Mushaf line layout — Madani 15-line Hafs (604 pages).
// Source: zonetecde/mushaf-layout (QPC V2 glyphs + Unicode words).
// Normalized to internal schema for offline mushaf rendering.

import { join } from "node:path";

import { fetchJSON } from "./fetch.mjs";
import { ASSETS_DATA_DIR, datasetEntry, writeCompactJSON, writeJSON } from "./manifest.mjs";
import { assert, TOTAL_PAGES, validateMushafLayout } from "./schemas.mjs";

const MUSHAF_SRC =
  "https://cdn.jsdelivr.net/gh/zonetecde/mushaf-layout@main/mushaf/page-{page}.json";

const LAYOUT_DIR = join(ASSETS_DATA_DIR, "quran", "layout", "madinah-15");

function pad3(n) {
  return String(n).padStart(3, "0");
}

/** Join QPC V2 glyph tokens from a zonetecde line's words array. */
function lineGlyphs(line) {
  if (line.type === "basmala") return line.qpcV2 ?? line.qpcV1 ?? "";
  if (line.type !== "text" || !Array.isArray(line.words)) return line.text ?? "";
  return line.words
    .map((w) => w.qpcV2 ?? w.qpcV1 ?? w.word ?? "")
    .join(" ")
    .trim();
}

/** Map zonetecde page JSON → internal MushafPageLayout. */
function normalizePage(raw) {
  const lines = [];
  for (const line of raw.lines ?? []) {
    if (line.type === "surah-header") {
      lines.push({
        type: "surah_name",
        surah: Number.parseInt(line.surah, 10),
        text: line.text,
      });
    } else if (line.type === "basmala") {
      lines.push({
        type: "basmala",
        glyphs: lineGlyphs(line),
      });
    } else if (line.type === "text") {
      const glyphs = lineGlyphs(line);
      if (!glyphs) continue;
      lines.push({
        type: "text",
        alignment: glyphs.length < 40 ? "centered" : "justified",
        glyphs,
        verseRange: line.verseRange,
      });
    }
  }
  return { page: raw.page, lines };
}

/**
 * Build 604-page mushaf layout JSON files.
 * @param {{ pageStarts: { page: number, surah: number, ayah: number }[] }} opts
 */
export async function buildMushafLayout({ pageStarts }) {
  console.log("  fetching mushaf layout (604 pages)…");
  const layouts = [];
  const writtenFiles = [];

  for (let page = 1; page <= TOTAL_PAGES; page++) {
    const url = MUSHAF_SRC.replace("{page}", pad3(page));
    let raw;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        raw = await fetchJSON(url);
        break;
      } catch (err) {
        if (attempt === 4) throw err;
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
    assert(raw.page === page, `page ${page}: source page mismatch ${raw.page}`);
    const normalized = normalizePage(raw);
    const path = join(LAYOUT_DIR, `${pad3(page)}.json`);
    await writeCompactJSON(path, normalized);
    writtenFiles.push(path);
    layouts.push(normalized);
    if (page % 100 === 0) console.log(`    … ${page}/${TOTAL_PAGES} pages`);
    if (page % 10 === 0) await new Promise((r) => setTimeout(r, 50));
  }

  const infoPath = join(LAYOUT_DIR, "info.json");
  await writeJSON(infoPath, {
    id: "madinah-15",
    name: "Madani Mushaf (15 lines, Hafs)",
    pageCount: TOTAL_PAGES,
    linesPerPage: 15,
    fontId: "qcf-v2",
    sourceUrl: "https://github.com/zonetecde/mushaf-layout",
  });
  writtenFiles.push(infoPath);

  validateMushafLayout({ layouts, pageStarts });
  console.log("  ✓ validated 604 mushaf layout pages");

  return {
    writtenFiles,
    dataset: await datasetEntry({
      id: "quran-mushaf-layout",
      kind: "quran",
      version: 1,
      absFiles: writtenFiles,
      license: "Open data (check source repository)",
      attribution:
        "Mushaf page layout: zonetecde/mushaf-layout (Madani 15-line Hafs, QPC V2 glyphs). QCF fonts: King Fahd Glorious Qur'an Printing Complex via nuqayah/qpc-fonts.",
      sourceUrl: "https://github.com/zonetecde/mushaf-layout",
      note: "madinah-15-line-hafs",
    }),
  };
}
