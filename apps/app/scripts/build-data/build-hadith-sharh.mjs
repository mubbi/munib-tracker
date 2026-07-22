// NF-2.8 — Nawawi 40 Arabic sharh sidecar.
//
// Source: osamayy/40-hadith-nawawi-db (Unlicense) — classical Arabic commentary
// keyed by hadith number. Never AI-translate into English.
//
// Output: assets/data/hadith/nawawi40-sharh.json
//   { "nawawi40:1": { "sharhArabic": "..." }, ... }

import { join } from "node:path";

import { fetchJSON } from "./fetch.mjs";
import { ASSETS_DATA_DIR, datasetEntry, writeCompactJSON } from "./manifest.mjs";
import { assert } from "./schemas.mjs";

const SHARH_URL =
  "https://cdn.jsdelivr.net/gh/osamayy/40-hadith-nawawi-db@main/40-hadith-nawawi.json";
const HADITH_DIR = join(ASSETS_DATA_DIR, "hadith");
const OUT_FILE = join(HADITH_DIR, "nawawi40-sharh.json");

const HEADER_RE = /^\s*شرح\s+وفوائد\s+الحديث\s*/u;

/** Strip the stock heading; keep the commentary body. */
function normalizeSharh(raw) {
  if (typeof raw !== "string") return "";
  return raw.replace(HEADER_RE, "").trim();
}

/**
 * Build the Nawawi sharh sidecar. Aligns by array index (1-based) with the
 * Forty Hadith order used by AhmedBaset / our nawawi40.json.
 */
export async function buildHadithSharh() {
  const rows = await fetchJSON(SHARH_URL);
  assert(Array.isArray(rows) && rows.length > 0, "nawawi sharh: empty source");

  /** @type {Record<string, { sharhArabic: string }>} */
  const byId = {};
  let written = 0;

  for (let i = 0; i < rows.length; i++) {
    const number = String(i + 1);
    const sharhArabic = normalizeSharh(rows[i]?.description);
    if (!sharhArabic) continue;
    byId[`nawawi40:${number}`] = { sharhArabic };
    written += 1;
  }

  assert(written >= 40, `nawawi sharh: expected ≥40 entries, got ${written}`);
  await writeCompactJSON(OUT_FILE, byId);
  console.log(`  nawawi40-sharh.json → ${written} explanations`);

  return [
    await datasetEntry({
      id: "hadith-nawawi-sharh",
      kind: "hadith",
      version: 1,
      absFiles: [OUT_FILE],
      license: "Unlicense",
      attribution:
        "Arabic sharh for an-Nawawi's Forty from osamayy/40-hadith-nawawi-db (Unlicense).",
      sourceUrl: "https://github.com/osamayy/40-hadith-nawawi-db",
      note: "NF-2.8 — Arabic only; do not AI-paraphrase into other languages.",
    }),
  ];
}
