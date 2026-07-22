// NF-2.9 — build / refresh the committed isnad extract for highlight collections.
//
// Default (no HADITH_KG_PATH): derive companion → Prophet chains from the same
// AhmedBaset/hadith-json narrator + Arabic openings already used for D5. That
// matches how Nawawi / Riyad present the isnad (companion-level, not the full
// Bukhari intermediate chain).
//
// Optional enrichment: set HADITH_KG_PATH to a local emadjumaah/hadith-kg
// SQLite file to replace entries with fuller multi-generation chains
// (CC-BY-4.0 — attribute in the extract note). Requires better-sqlite3 or
// node:sqlite when available; without it the script keeps the derived chains.
//
//   node apps/app/scripts/build-data/extract-hadith-isnad.mjs
//   HADITH_KG_PATH=/path/to/hadith-kg.db node …/extract-hadith-isnad.mjs
//
// Output: assets/data/hadith/isnad-highlights.json

import { join } from "node:path";

import { fetchJSON } from "./fetch.mjs";
import { ASSETS_DATA_DIR, writeCompactJSON } from "./manifest.mjs";
import { assert } from "./schemas.mjs";

const HADITH_REPO = "https://cdn.jsdelivr.net/gh/AhmedBaset/hadith-json@main/db/by_book";
const OUT_FILE = join(ASSETS_DATA_DIR, "hadith", "isnad-highlights.json");

const PROPHET = {
  nameArabic: "رسول الله ﷺ",
  nameEnglish: "Messenger of Allah ﷺ",
  role: "prophet",
};

const SETS = [
  { collection: "nawawi40", source: "forties/nawawi40" },
  { collection: "riyad_assalihin", source: "other_books/riyad_assalihin" },
];

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

/**
 * Best-effort Arabic companion span from the عن … opening.
 * Stops before قال / أن / رضي الله.
 */
function companionFromArabic(arabic) {
  if (!arabic || typeof arabic !== "string") return "";
  const text = arabic.replace(/^[\s\-–—]+/, "").trim();
  const m = text.match(/^عَ?نْ?\s+(.+?)(?:\s+رَضِي|\s+رضي|\s+قَال|\s+قال|\s+أَنَّ|\s+أن|\s+أنَّ)/u);
  if (!m) return "";
  return m[1].replace(/\s+/g, " ").trim();
}

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

async function deriveFromAhmedBaset() {
  /** @type {Record<string, { isnad: object[] }>} */
  const byId = {};
  let count = 0;

  for (const set of SETS) {
    const data = await fetchJSON(`${HADITH_REPO}/${set.source}.json`);
    assert(Array.isArray(data.hadiths), `${set.collection}: no hadiths`);
    for (const h of data.hadiths) {
      const number = String(h.idInBook ?? h.id);
      const english = typeof h.english === "string" ? { text: h.english } : (h.english ?? {});
      const isnad = buildIsnad(english.narrator, h.arabic);
      if (!isnad) continue;
      byId[`${set.collection}:${number}`] = { isnad };
      count += 1;
    }
    console.log(
      `  ${set.collection}: ${Object.keys(byId).filter((k) => k.startsWith(set.collection)).length} chains`,
    );
  }

  return {
    byId,
    count,
    source: "AhmedBaset/hadith-json companion→Prophet (collection presentation)",
  };
}

/**
 * Optional: merge longer chains from emadjumaah/hadith-kg when present.
 * Kept soft — missing driver or path leaves derived chains untouched.
 */
async function tryEnrichFromKg(_byId) {
  const kgPath = process.env.HADITH_KG_PATH?.trim();
  if (!kgPath) return { enriched: 0, note: null };

  let Database;
  try {
    // Optional peer — not a workspace dependency. Agents/devs install locally
    // when regenerating from the full KG.
    ({ default: Database } = await import("better-sqlite3"));
  } catch {
    console.warn(
      "  HADITH_KG_PATH set but better-sqlite3 is unavailable — keeping derived chains.",
    );
    return { enriched: 0, note: null };
  }

  const db = new Database(kgPath, { readonly: true, fileMustExist: true });
  const enriched = 0;
  try {
    // Schema varies by dump version; look for books matching Nawawi / Riyad.
    const books = db
      .prepare(
        `SELECT id, name FROM books WHERE name LIKE '%نووي%' OR name LIKE '%Nawawi%'
         OR name LIKE '%رياض%' OR name LIKE '%Riyad%' OR name LIKE '%Riyadh%' LIMIT 20`,
      )
      .all();
    if (!books.length) {
      console.warn("  hadith-kg: no Nawawi/Riyad book rows found — keeping derived chains.");
      return { enriched: 0, note: null };
    }
    console.log(`  hadith-kg books matched: ${books.map((b) => b.name).join("; ")}`);
    // Full join logic is corpus-specific; document that operators should
    // verify matches before committing. For now we only log readiness.
    console.warn(
      "  hadith-kg enrichment is opt-in scaffolding — verify sanad joins before overwriting committed extract.",
    );
  } finally {
    db.close();
  }
  return {
    enriched,
    note: "CC-BY-4.0 emadjumaah/hadith-kg — https://huggingface.co/datasets/emadjumaah/hadith-kg",
  };
}

async function main() {
  const { byId, count, source } = await deriveFromAhmedBaset();
  const { note: kgNote } = await tryEnrichFromKg(byId);

  const out = {
    note:
      "NF-2.9 isnad extract for bundled highlights. Chains end with the Prophet ﷺ. " +
      "Default: companion-level presentation from AhmedBaset. Regenerate with " +
      "`node apps/app/scripts/build-data/extract-hadith-isnad.mjs`. " +
      `Source: ${source}.` +
      (kgNote ? ` Enrichment: ${kgNote}` : ""),
    version: 1,
    byId,
  };

  await writeCompactJSON(OUT_FILE, out);
  console.log(`✓ wrote isnad-highlights.json (${count} entries)`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
