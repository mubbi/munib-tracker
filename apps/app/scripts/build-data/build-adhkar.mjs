// D7 — regenerate the bundled adhkar / duas / duroods TS content files.
//
// The curated dataset is embedded here so the build is deterministic and
// network-free. Arabic is preserved verbatim; every item carries a reference
// (Hisnul Muslim cites Qur'an/Hadith) and a transliteration. Existing item ids
// are preserved so user favorites keep resolving.

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { fetchJSON, fetchText } from "./fetch.mjs";
import { APP_ROOT, datasetEntry, SHARED_CONTENT_DIR, writeFileStable } from "./manifest.mjs";

// Per-item adhkar recitation audio (D9), matched against the Hisnul Muslim
// database by normalized Arabic and streamed via jsDelivr, pinned to a commit.
const HISN_AUDIO_REPO = "sheikhhanif/Hisnul_Muslim_Database";
const HISN_AUDIO_SHA = "07533fa1494d02c4b24aecb3ad7267e09219c956";
const HISN_AUDIO_CDN = `https://cdn.jsdelivr.net/gh/${HISN_AUDIO_REPO}@${HISN_AUDIO_SHA}/audio`;
const HISN_CSV = `https://cdn.jsdelivr.net/gh/${HISN_AUDIO_REPO}@${HISN_AUDIO_SHA}/hisnul_database.csv`;

// Bengali Hisnul Muslim segment translations (MIT). Data is served from Cloudflare
// Workers/D1; the public GitHub repo documents the API but does not ship CSV dumps.
const THELIGHTHUB_DUA_API = "https://dua-api.hisnul.workers.dev";
const THELIGHTHUB_REPO = "ThelightHub/dua-api";

/** Strip tashkeel/diacritics/punctuation and unify letter forms for matching. */
function normalizeArabic(text) {
  return text
    .normalize("NFKD")
    .replace(/[ً-ْٰـۖ-ۭ࣓-ࣿ]/g, "")
    .replace(/[آأإٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[^ء-ي]/g, "");
}

/**
 * Canonical English Islamic spellings (keep in sync with
 * packages/shared/src/content/terminology.test.ts). Applied to display fields
 * only — never ids or transliteration (phonetics may contain `dhikr` roots).
 */
function sanitizeEnglishDisplay(text) {
  if (typeof text !== "string" || !text) return text;
  const keepCase = (match, replacement) =>
    match[0] === match[0].toUpperCase()
      ? replacement[0].toUpperCase() + replacement.slice(1)
      : replacement;
  return text
    .replace(/\bdhikr\b/gi, (m) => keepCase(m, "zikr"))
    .replace(/\btasbih\b/gi, (m) => keepCase(m, "tasbeeh"))
    .replace(/\bdu['’]a\b/gi, (m) => keepCase(m, "dua"))
    .replace(/\brak['’]ahs?\b/gi, (m) => keepCase(m, /s$/i.test(m) ? "rakahs" : "rakah"))
    .replace(/\braka['’]ahs?\b/gi, (m) => keepCase(m, /s$/i.test(m) ? "rakahs" : "rakah"))
    .replace(/\brakaats?\b/gi, (m) => keepCase(m, /s$/i.test(m) ? "rakahs" : "rakah"))
    .replace(/\brakats?\b/gi, (m) => keepCase(m, /s$/i.test(m) ? "rakahs" : "rakah"))
    .replace(/\btaraweeh\b/gi, (m) => keepCase(m, "tarawih"))
    .replace(/\bazan\b/gi, (m) => keepCase(m, "adhan"))
    .replace(/\bmosque\b/gi, (m) => keepCase(m, "masjid"));
}

const ENGLISH_DISPLAY_KEYS = ["title", "translation", "virtues", "reference"];

function sanitizeItemEnglish(item) {
  const out = { ...item };
  for (const key of ENGLISH_DISPLAY_KEYS) {
    if (typeof out[key] === "string") out[key] = sanitizeEnglishDisplay(out[key]);
  }
  if (Array.isArray(out.variants)) {
    out.variants = out.variants.map((variant) => {
      const v = { ...variant };
      for (const key of ENGLISH_DISPLAY_KEYS) {
        if (typeof v[key] === "string") v[key] = sanitizeEnglishDisplay(v[key]);
      }
      return v;
    });
  }
  return out;
}

/** Minimal RFC-4180 CSV parser (handles quoted fields with commas/newlines). */
function parseCSV(text) {
  const rows = [];
  let i = 0;
  let field = "";
  let row = [];
  let quoted = false;
  while (i < text.length) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        quoted = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      quoted = true;
      i++;
    } else if (c === ",") {
      row.push(field);
      field = "";
      i++;
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
    } else {
      field += c;
      i++;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/**
 * Fetch and index the Hisnul Muslim audio database. Returns [] on any failure so
 * content still builds (items simply won't have audio).
 */
async function fetchAdhkarAudioDb() {
  try {
    const rows = parseCSV(await fetchText(HISN_CSV)).slice(1);
    return rows
      .filter((r) => r.length >= 8 && r[7])
      .map((r) => ({ audio: r[7], norm: normalizeArabic(r[2]) }))
      .filter((r) => r.norm.length > 0);
  } catch (err) {
    console.warn(`  [adhkar] audio db unavailable (${err.message}); building without audio`);
    return [];
  }
}

/**
 * Match an item's Arabic to a DB entry via a prefix relationship (dhikr entries
 * begin with the phrase). Conservative on purpose — no match beats a wrong one.
 */
function matchAdhkarAudio(arabic, db) {
  const n = normalizeArabic(arabic);
  if (n.length < 10) return undefined;
  const candidates = db.filter((d) => d.norm.startsWith(n) || n.startsWith(d.norm));
  if (!candidates.length) return undefined;
  candidates.sort(
    (a, b) => Math.abs(a.norm.length - n.length) - Math.abs(b.norm.length - n.length),
  );
  const best = candidates[0];
  const ratio = Math.max(best.norm.length, n.length) / Math.min(best.norm.length, n.length);
  if (ratio > 3) return undefined;
  return `${HISN_AUDIO_CDN}/${best.audio}`;
}

// ── Full Hisnul Muslim dua corpus (sheikhhanif database CSV) ────────────────
// The same CSV that supplies per-item audio also carries the complete Fortress
// of the Muslim: Arabic (verbatim), English translation, Qur'an/Hadith
// reference, chapter (group_id) and audio filename for all ~267 supplications.
// It has no transliteration — that is layered on later from clean open sources.

/** Does the string contain at least one Arabic letter (not just an instruction)? */
function hasArabic(text) {
  return /[ء-ي]/.test(text ?? "");
}

/**
 * Strip the source's editorial notation from a Hisnul Muslim Arabic field:
 * footnote markers `--(1)--`, count/timing brackets (`[ثلاث مرات]`), and
 * ellipsis-abbreviated brackets. Authentic optional phrases in `[…]` are
 * unwrapped into the text — stripping them left incomplete duas (e.g. hisn-36
 * ending mid-list at وَعَصَبِي ،). Entries still carrying a bare `…` after this
 * are dropped by the caller (abbreviated Qur'an directives).
 */
// `--(1)--` footnote markers, with ASCII, Arabic-Indic (٠-٩) or Persian (۰-۹) digits.
const HISN_FOOTNOTE = /--\([0-9٠-٩۰-۹]+\)--/g;
/** Count / timing instructions Hisnul wraps in brackets — not dua wording. */
const HISN_COUNT_BRACKET =
  /^(?:ثَ?لَ?اث(?:َ?اً)?|أرْ?بَ?ع|سَ?بْ?ع|عَ?شْ?ر|مِ?ئَ?ة|مئة|مرة|مرات|ثلاث مرات|أربع مرات|عشر مرات)/u;

function cleanHisnBracketInner(inner) {
  const t = inner.trim();
  if (!t) return " ";
  // Abbreviated / editorial snippets — drop.
  if (/…|\.\.\./.test(t)) return " ";
  // Pure count / timing notes — drop (targetCount lives elsewhere when known).
  if (HISN_COUNT_BRACKET.test(t) || /مرات|مرةٍ|مرةً|مرةٍ|إذا أصْ?بَح|إذا أمْ?سَى/.test(t)) {
    // Keep if the bracket is mostly dua text that merely ends with a count note
    // (rare); otherwise drop short instruction-only brackets.
    const withoutCount = t
      .replace(/ثَ?لَ?اث(?:َ?اً)?|أرْ?بَ?ع|سَ?بْ?ع|عَ?شْ?ر|مِ?ئَ?ة|مئة|مرات|مرة|إذا أصْ?بَحَ?|إذا أمْ?سَى/gu, "")
      .replace(/\s+/g, "");
    if (withoutCount.length < 12) return " ";
  }
  // Authentic optional / variant wording — keep.
  return ` ${t} `;
}

function cleanHisnArabic(text) {
  return (text ?? "")
    .replace(/\[[^\]]*\]/g, (m) => cleanHisnBracketInner(m.slice(1, -1)))
    .replace(HISN_FOOTNOTE, " ")
    .replace(/\s*\.\s*\.\s*/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([،,.])/g, "$1")
    .trim();
}

/** Fetch + parse the full Hisnul Muslim dua corpus. Returns [] on any failure. */
async function fetchHisnDuas() {
  try {
    const rows = parseCSV(await fetchText(HISN_CSV)).slice(1); // skip header
    // Columns: id,group_id,ar_dua,en_translation,en_reference,bn_translation,subtitle,audio
    return rows
      .filter((r) => r.length >= 8 && hasArabic(r[2]) && r[3]?.trim())
      .map((r) => ({
        hisnId: r[0],
        groupId: Number.parseInt(r[1], 10),
        arabic: cleanHisnArabic(r[2]),
        // Strip the source's `--(1)--` footnote markers from the translation.
        translation: r[3]
          .replace(HISN_FOOTNOTE, " ")
          .replace(/[ \t]+/g, " ")
          .trim(),
        translations: r[5]?.trim()
          ? {
              bn: r[5]
                .replace(HISN_FOOTNOTE, " ")
                .replace(/[ \t]+/g, " ")
                .trim(),
            }
          : undefined,
        reference: (r[4] ?? "").trim(),
        title: (r[6] ?? "").trim(),
        audioFile: (r[7] ?? "").trim(),
      }))
      .filter((d) => hasArabic(d.arabic) && !/…|\.\.\./.test(d.arabic));
  } catch (err) {
    console.warn(`  [adhkar] Hisnul Muslim corpus unavailable (${err.message})`);
    return [];
  }
}

/**
 * Build a normalized-Arabic → transliteration lookup from clean, trusted
 * sources only (hand-curated base + fitrahive dataset). Transliteration is
 * never fabricated, so items with no clean source simply carry none.
 */
function buildTranslitLookup(datasetItems) {
  const map = new Map();
  const add = (arabic, translit) => {
    const n = normalizeArabic(arabic);
    const t = (translit ?? "").trim();
    if (n && t && !map.has(n)) map.set(n, t);
  };
  // Every clean transliteration we ship — curated duas + curated adhkar + the
  // fitrahive dataset (dua + dhikr). The morning/evening/after-salah adhkar
  // overlap heavily with Hisnul Muslim chapters, so they lift dua coverage.
  for (const item of DUA_ITEMS) add(item.arabic, item.transliteration);
  for (const item of ZIKR_ITEMS) add(item.arabic, item.transliteration);
  for (const item of datasetItems) add(item.arabic, item.transliteration);
  return map;
}

/** Exact normalized-Arabic transliteration match (no fuzzy pairing — accuracy). */
function findTranslit(arabic, lookup) {
  return lookup.get(normalizeArabic(arabic));
}

/**
 * Merge the full Hisnul Muslim corpus onto the curated base: keep every curated
 * item (preserving ids/titles/transliteration/favorites), then append each
 * Hisnul dua whose Arabic isn't already present, categorized by its chapter.
 */
function buildDuaCorpus(hisnDuas, translitLookup) {
  const seenArabic = new Set();
  const seenIds = new Set();
  const merged = [];

  for (const item of DUA_ITEMS) {
    const categoryId = BASE_CATEGORY_OVERRIDE[item.id] ?? item.categoryId;
    merged.push({ ...item, categoryId });
    const n = normalizeArabic(item.arabic);
    if (n) seenArabic.add(n);
    seenIds.add(item.id);
  }

  for (const h of hisnDuas) {
    const n = normalizeArabic(h.arabic);
    if (!n || seenArabic.has(n)) continue;
    seenArabic.add(n);
    let id = `hisn-${h.hisnId}`;
    let k = 2;
    while (seenIds.has(id)) id = `hisn-${h.hisnId}-${k++}`;
    seenIds.add(id);

    const item = {
      id,
      categoryId: HISN_CATEGORY_BY_GROUP[h.groupId] ?? "social",
      title: h.title || `Supplication ${h.hisnId}`,
      arabic: h.arabic,
      translation: h.translation,
      ...(h.translations ? { translations: h.translations } : {}),
      reference: h.reference || "Hisn al-Muslim",
    };
    const translit = findTranslit(h.arabic, translitLookup);
    if (translit) item.transliteration = translit;
    if (h.audioFile) item.audioUri = `${HISN_AUDIO_CDN}/${h.audioFile}`;
    merged.push(item);
  }

  return merged;
}

// ── Completeness helpers (source full verbatim text, never hand-written) ─────

const QURAN_DIR = join(APP_ROOT, "assets", "data", "quran");

/** Resolve the on-disk subfolder for a mushaf kind. */
function quranKindSub(kind) {
  if (kind === "arabic") return "arabic";
  if (kind === "translit") return "translit";
  if (kind.startsWith("translation/")) return kind;
  return "translation/en-pickthall";
}

/** Load a bundled Qur'an surah JSON keyed by ayah number. Returns null if missing. */
function loadQuranSurahObj(kind, surah) {
  const s = String(surah).padStart(3, "0");
  try {
    return JSON.parse(readFileSync(join(QURAN_DIR, quranKindSub(kind), `${s}.json`), "utf8"));
  } catch {
    return null;
  }
}

/** Read a bundled Qur'an surah file for a given kind, joined into one string. */
function quranSurahText(kind, surah) {
  const obj = loadQuranSurahObj(kind, surah);
  if (!obj) {
    if (kind === "arabic" || kind === "translit" || kind === "translation") {
      throw new Error(
        `[adhkar] missing required mushaf ${quranKindSub(kind)}/${String(surah).padStart(3, "0")}`,
      );
    }
    return "";
  }
  return Object.keys(obj)
    .map(Number)
    .sort((a, b) => a - b)
    .map((k) => obj[String(k)])
    .join(" ")
    .trim();
}

/**
 * Read an inclusive ayah range from a bundled surah (e.g. 2:285–286).
 * Ayah numbers are 1-based as in the mushaf JSON keys.
 */
function quranAyahRangeText(kind, surah, fromAyah, toAyah) {
  const obj = loadQuranSurahObj(kind, surah);
  if (!obj) {
    if (kind === "arabic" || kind === "translit" || kind === "translation") {
      throw new Error(
        `[adhkar] missing required mushaf ${quranKindSub(kind)}/${String(surah).padStart(3, "0")}`,
      );
    }
    return "";
  }
  const parts = [];
  for (let a = fromAyah; a <= toAyah; a++) {
    const t = obj[String(a)];
    if (!t) {
      if (kind === "arabic" || kind === "translit" || kind === "translation") {
        throw new Error(`[adhkar] missing ${surah}:${a} in ${quranKindSub(kind)}`);
      }
      return "";
    }
    parts.push(t);
  }
  return parts.join(" ").trim();
}

/**
 * App locales → bundled Qur'an edition ids (mirrors locale-registry `quranEditionId`).
 * Used to layer dataset-backed dua/zikr translations from the offline mushaf.
 */
const LOCALE_QURAN_EDITIONS = [
  ["ur", "ur-jalandhry"],
  ["id", "id-indonesianislam"],
  ["tr", "tr-diyanet"],
  ["tk", "tr-diyanet"],
  ["bn", "bn-muhiuddinkhan"],
  ["ms", "ms-basmeih"],
  ["fa", "fa-makarem"],
  ["fr", "fr-hamidullah"],
  ["ha", "ha-gumi"],
  ["sw", "sw-basmeih"],
  ["ru", "ru-kuliev"],
  ["az", "az-mammadaliyev"],
  ["ps", "ps-khan"],
  ["so", "so-hassan"],
  ["uz", "uz-mansour"],
  ["kk", "kk-altai"],
  ["ku", "ku-tanzil"],
  ["bs", "bs-korkut"],
  ["sq", "sq-ahmeti"],
  ["ky", "ky-hakim"],
  ["tg", "tg-ayati"],
];

/** Parse a single-ayah `Quran S:A` reference from a Hisnul Muslim cite string.
 *  Ranges like `Quran 2:285-286` are intentionally ignored (filled from mushaf). */
function parseQuranRef(reference) {
  if (!reference) return null;
  if (/Quran\s+\d+\s*:\s*\d+\s*[-–]\s*\d+/i.test(reference)) return null;
  const m = reference.match(/Quran\s+(\d+)\s*:\s*(\d+)/i);
  if (!m) return null;
  return { surah: Number.parseInt(m[1], 10), ayah: Number.parseInt(m[2], 10) };
}

const bundledAyahCache = new Map();

/** Read one ayah from a bundled translation edition (requires `build:quran` first). */
function loadBundledAyahTranslation(editionId, surah, ayah) {
  const key = `${editionId}:${surah}:${ayah}`;
  if (bundledAyahCache.has(key)) return bundledAyahCache.get(key);
  const surahPad = String(surah).padStart(3, "0");
  let text = "";
  try {
    const obj = JSON.parse(
      readFileSync(join(QURAN_DIR, "translation", editionId, `${surahPad}.json`), "utf8"),
    );
    text = obj[String(ayah)] ?? "";
  } catch {
    text = "";
  }
  bundledAyahCache.set(key, text);
  return text;
}

/** Layer bundled Qur'an ayah translations onto items with a `Quran S:A` reference. */
function applyQuranLocaleTranslations(items) {
  for (const item of items) {
    const ref = parseQuranRef(item.reference);
    if (!ref) continue;
    const translations = { ...(item.translations ?? {}) };
    for (const [locale, editionId] of LOCALE_QURAN_EDITIONS) {
      const text = loadBundledAyahTranslation(editionId, ref.surah, ref.ayah)?.trim();
      if (text) translations[locale] = text;
    }
    if (Object.keys(translations).length) item.translations = translations;
  }
}

/** Build normalized-Arabic → Bengali map from the Hisnul Muslim CSV. */
function buildBnTranslationMap(hisnDuas) {
  const map = new Map();
  for (const h of hisnDuas) {
    const bn = h.translations?.bn?.trim();
    if (!bn) continue;
    const n = normalizeArabic(h.arabic);
    if (n) map.set(n, bn);
  }
  return map;
}

/** Register Bengali text under normalized Arabic (first wins). */
function addBnSegment(map, arabic, bn) {
  const n = normalizeArabic(arabic ?? "");
  const t = (bn ?? "").trim();
  if (n && t && !map.has(n)) map.set(n, t);
}

/**
 * Fetch Bengali Hisnul Muslim translations from ThelightHub dua-api (book 1).
 * Builds a normalized-Arabic → Bengali map from per-segment and joined multi-segment duas.
 */
async function buildBnTranslationMapFromThelightHub() {
  const map = new Map();
  const chaptersRes = await fetchJSON(`${THELIGHTHUB_DUA_API}/api/books/1/chapters?limit=200`);
  const chapters = chaptersRes?.data ?? [];

  const batchSize = 8;
  for (let i = 0; i < chapters.length; i += batchSize) {
    const batch = chapters.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (ch) => {
        const res = await fetchJSON(
          `${THELIGHTHUB_DUA_API}/api/books/1/chapters/${ch.chap_id}/duas`,
        );
        for (const dua of res?.data ?? []) {
          const segments = dua.segments ?? [];
          for (const seg of segments) {
            addBnSegment(map, seg.arabic || seg.arabic_diacless, seg.translations);
          }
          if (segments.length > 1) {
            const arabic = segments.map((s) => s.arabic || s.arabic_diacless || "").join(" ");
            const bn = segments
              .map((s) => (s.translations ?? "").trim())
              .filter(Boolean)
              .join(" ");
            addBnSegment(map, arabic, bn);
          }
        }
      }),
    );
  }

  return map;
}

/** Fetch fitrahive Indonesian translations keyed by normalized Arabic. */
async function buildIdTranslationMap() {
  const map = new Map();
  for (const cat of DUADHIKR_CATEGORIES) {
    let rows;
    try {
      rows = await fetchJSON(`${DUADHIKR_BASE}/${cat.slug}/id.json`);
    } catch {
      continue;
    }
    for (const row of rows ?? []) {
      const arabic = (row.arabic ?? "").trim();
      const translation = (row.translation ?? "").trim();
      const n = normalizeArabic(arabic);
      if (n && translation && !map.has(n)) map.set(n, translation);
    }
  }
  return map;
}

/** Merge locale translation maps onto items by normalized Arabic (never overwrites English). */
function mergeTranslationMaps(items, localeMaps) {
  for (const item of items) {
    const n = normalizeArabic(item.arabic);
    if (!n) continue;
    const translations = { ...(item.translations ?? {}) };
    for (const [locale, map] of Object.entries(localeMaps)) {
      const text = map.get(n)?.trim();
      if (text) translations[locale] = text;
    }
    if (Object.keys(translations).length) item.translations = translations;
  }
}

/**
 * Fill a zikr item from one or more mushaf spans.
 * Each span is either `{ surah }` (full surah) or `{ surah, from, to }` (ayah range).
 * Joins multiple spans with newlines (used for the three Quls). Never hand-writes
 * Arabic — Hisnul Muslim drops abbreviated Qur'an directives (`…`); we restore
 * them here from the bundled mushaf.
 */
function fillItemFromMushaf(item, spans) {
  if (!item) return;
  const joinSpans = (kind) =>
    spans
      .map((span) =>
        span.from != null
          ? quranAyahRangeText(kind, span.surah, span.from, span.to)
          : quranSurahText(kind, span.surah),
      )
      .join("\n");
  item.arabic = joinSpans("arabic");
  item.transliteration = joinSpans("translit");
  item.translation = joinSpans("translation");
  const translations = { ...(item.translations ?? {}) };
  for (const [locale, editionId] of LOCALE_QURAN_EDITIONS) {
    const text = joinSpans(`translation/${editionId}`).trim();
    if (text) translations[locale] = text;
  }
  if (Object.keys(translations).length) item.translations = translations;
}

/**
 * Complete before-sleep Qur'an remembrances from the bundled mushaf.
 * Canonical set (Hisnul Muslim ch.28 + well-known authentic night sunnah):
 * Ayat al-Kursi, last two of al-Baqarah, the three Quls, al-Sajdah, al-Mulk.
 * Surah al-Fatiha is intentionally omitted — it is not a sleep-specific sunnah
 * (salah / ruqyah), despite popular bedtime collections sometimes listing it.
 */
function fillBeforeSleepQuran(items) {
  const byId = (id) => items.find((z) => z.id === id);
  fillItemFromMushaf(byId("before_sleep-ayat-kursi"), [{ surah: 2, from: 255, to: 255 }]);
  fillItemFromMushaf(byId("before_sleep-baqarah-end"), [{ surah: 2, from: 285, to: 286 }]);
  fillItemFromMushaf(byId("before_sleep-ikhlas"), [{ surah: 112 }, { surah: 113 }, { surah: 114 }]);
  fillItemFromMushaf(byId("before_sleep-sajdah"), [{ surah: 32 }]);
  fillItemFromMushaf(byId("before_sleep-mulk"), [{ surah: 67 }]);
}

// Which after-fard prayers an after-salah dhikr is specific to (by a distinctive
// Arabic phrase). Untagged items are recited after every fard prayer, so they
// surface under every prayer's filter. Sourced from authentic hadith.
const AFTER_PRAYER_PRAYER_TAGS = [
  { marker: "عِلْمًا نَافِعًا", prayers: ["fajr"] }, // Umm Salamah's dua after Fajr
  { marker: "يُحْيِي وَيُمِيتُ", prayers: ["fajr", "maghrib"] }, // tahlil ×10 after Fajr & Maghrib
  { marker: "أَجِرْنِي مِنَ النَّارِ", prayers: ["fajr", "maghrib"] }, // ×7 after Fajr & Maghrib
];

/** Tag prayer-specific after-salah adhkar so the UI can filter by salah. */
function tagAfterPrayerPrayers(items) {
  for (const item of items) {
    if (item.categoryId !== "after_prayer") continue;
    const norm = normalizeArabic(item.arabic);
    for (const { marker, prayers } of AFTER_PRAYER_PRAYER_TAGS) {
      if (norm.includes(normalizeArabic(marker))) {
        item.prayers = prayers;
        break;
      }
    }
  }
}

// Hisnul Muslim chapter 107 = "Excellence of sending prayers upon the Prophet".
const HISN_DUROOD_GROUP = 107;

/** Extract the ch.107 salawat as DurudItems (transliteration where clean). */
function buildHisnDuruds(hisnDuas, translitLookup) {
  const out = [];
  let n = 1;
  for (const h of hisnDuas) {
    if (h.groupId !== HISN_DUROOD_GROUP) continue;
    const item = {
      id: `durood-hisn-${h.hisnId}`,
      title: `Salawat upon the Prophet ﷺ (${n++})`,
      arabic: h.arabic,
      translation: h.translation,
      ...(h.translations ? { translations: h.translations } : {}),
      reference: h.reference || "Hisn al-Muslim",
    };
    const translit = findTranslit(h.arabic, translitLookup);
    if (translit) item.transliteration = translit;
    if (h.audioFile) item.audioUri = `${HISN_AUDIO_CDN}/${h.audioFile}`;
    out.push(item);
  }
  return out;
}

/** Append Hisnul salawat that aren't already in the curated durood base. */
function mergeDuruds(base, extra) {
  const seenArabic = new Set(base.map((d) => normalizeArabic(d.arabic)));
  const merged = [...base];
  for (const item of extra) {
    const norm = normalizeArabic(item.arabic);
    if (!norm || seenArabic.has(norm)) continue;
    seenArabic.add(norm);
    merged.push(item);
  }
  return merged;
}

// ── Open-source dua/dhikr dataset (fitrahive/dua-dhikr) ─────────────────────
// Provides Arabic + latin transliteration + English translation + source, keyed
// by exactly the categories we track. Pinned to a commit for reproducibility.
const DUADHIKR_REPO = "fitrahive/dua-dhikr";
const DUADHIKR_SHA = "f42f895f914319a844c3e3c2279483cae060ea19";
const DUADHIKR_BASE = `https://cdn.jsdelivr.net/gh/${DUADHIKR_REPO}@${DUADHIKR_SHA}/data/dua-dhikr`;

// Each dataset category → our content kind + tracker category.
const DUADHIKR_CATEGORIES = [
  { slug: "dhikr-after-salah", kind: "zikr", categoryId: "after_prayer" },
  { slug: "morning-dhikr", kind: "zikr", categoryId: "morning" },
  { slug: "evening-dhikr", kind: "zikr", categoryId: "evening" },
  { slug: "daily-dua", kind: "dua", categoryId: "daily" },
  { slug: "selected-dua", kind: "dua", categoryId: "sunnah" },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

/** Parse a repeat count from a notes string like "Read 3x" / "Recite 100x". */
function parseRepeatCount(notes) {
  if (!notes) return undefined;
  const m = notes.match(/(\d+)\s*x/i) || notes.match(/(\d+)\s*times/i);
  if (!m) return undefined;
  const n = Number.parseInt(m[1], 10);
  return n > 1 ? n : undefined;
}

/**
 * Fetch and normalize the open dua/dhikr dataset into our ZikrItem/DuaItem
 * shapes. Returns { zikr: [], dua: [] }. Best-effort: returns empty on failure.
 */
async function fetchDuaDhikrDataset() {
  const out = { zikr: [], dua: [] };
  for (const cat of DUADHIKR_CATEGORIES) {
    let rows;
    let idRows = [];
    try {
      rows = await fetchJSON(`${DUADHIKR_BASE}/${cat.slug}/en.json`);
    } catch (err) {
      console.warn(`  [adhkar] dataset ${cat.slug} unavailable (${err.message})`);
      continue;
    }
    try {
      idRows = await fetchJSON(`${DUADHIKR_BASE}/${cat.slug}/id.json`);
    } catch {
      // Indonesian locale file is optional per category.
    }
    const idByArabic = new Map();
    for (const row of idRows) {
      const n = normalizeArabic(row.arabic ?? "");
      const tr = (row.translation ?? "").trim();
      if (n && tr) idByArabic.set(n, tr);
    }
    rows.forEach((row, i) => {
      const arabic = (row.arabic ?? "").trim();
      const transliteration = (row.latin ?? "").trim();
      const translation = (row.translation ?? "").trim();
      if (!arabic || !transliteration || !translation) return;
      const item = {
        id: `${cat.categoryId}-${slugify(row.title ?? String(i))}`,
        categoryId: cat.categoryId,
        title: (row.title ?? "").trim(),
        arabic,
        transliteration,
        translation,
        reference: (row.source ?? "").trim() || "Hisn al-Muslim",
      };
      const idTranslation = idByArabic.get(normalizeArabic(arabic));
      if (idTranslation) item.translations = { id: idTranslation };
      const virtues = (row.benefits ?? row.notes ?? "").trim();
      if (virtues) item.virtues = virtues;
      const count = parseRepeatCount(row.notes);
      if (count) item.targetCount = count;
      out[cat.kind].push(item);
    });
  }
  return out;
}

/**
 * Merge dataset items into a base list, skipping any whose Arabic already
 * exists (keep the hand-curated version) and de-duplicating within the dataset.
 * Guarantees unique ids.
 */
function mergeUnique(baseItems, datasetItems) {
  const seenArabic = new Set(baseItems.map((it) => normalizeArabic(it.arabic)));
  const seenIds = new Set(baseItems.map((it) => it.id));
  const merged = [...baseItems];
  for (const item of datasetItems) {
    const norm = normalizeArabic(item.arabic);
    if (!norm) continue;
    if (seenArabic.has(norm)) {
      const existing = merged.find((it) => normalizeArabic(it.arabic) === norm);
      if (existing?.translations && item.translations) {
        existing.translations = { ...existing.translations, ...item.translations };
      }
      continue;
    }
    seenArabic.add(norm);
    let id = item.id;
    let n = 2;
    while (seenIds.has(id)) id = `${item.id}-${n++}`;
    seenIds.add(id);
    merged.push({ ...item, id });
  }
  return merged;
}

const ZIKR_ITEMS = [
  // ── Anytime ──────────────────────────────────────────────
  {
    id: "anytime-subhanallah-bihamdihi",
    categoryId: "anytime",
    title: "SubhanAllahi wa bihamdihi",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    transliteration: "Subhan-Allahi wa bihamdihi",
    translation: "Glory is to Allah and praise is to Him.",
    virtues:
      "Whoever says it 100 times a day has his sins wiped away, though they be like the foam of the sea.",
    reference: "Bukhari & Muslim",
    targetCount: 100,
  },
  {
    id: "anytime-tahlil",
    categoryId: "anytime",
    title: "La ilaha illallah, wahdahu la sharika lah",
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration:
      "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir",
    translation:
      "There is no god but Allah, alone, without partner. His is the dominion and His is the praise, and He is over all things capable.",
    virtues: "Whoever says it 100 times has a reward equal to freeing ten slaves.",
    reference: "Bukhari & Muslim",
    targetCount: 100,
  },
  {
    id: "anytime-istighfar",
    categoryId: "anytime",
    title: "Astaghfirullah",
    arabic: "أَسْتَغْفِرُ اللَّهَ",
    transliteration: "Astaghfirullah",
    translation: "I seek the forgiveness of Allah.",
    virtues: "The Prophet ﷺ would seek forgiveness more than seventy times a day.",
    reference: "Bukhari",
    targetCount: 100,
  },
  {
    id: "anytime-hawqala",
    categoryId: "anytime",
    title: "La hawla wa la quwwata illa billah",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "La hawla wa la quwwata illa billah",
    translation: "There is no might nor power except with Allah.",
    virtues: "A treasure from the treasures of Paradise.",
    reference: "Bukhari & Muslim",
    targetCount: 33,
  },
  {
    id: "anytime-tasbih-set",
    categoryId: "anytime",
    title: "The four most beloved words",
    arabic: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَٰهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",
    transliteration: "Subhan-Allah, wal-hamdu lillah, wa la ilaha illallah, wallahu akbar",
    translation:
      "Glory is to Allah, all praise is for Allah, there is no god but Allah, and Allah is the Greatest.",
    virtues: "The most beloved words to Allah.",
    reference: "Muslim",
    targetCount: 25,
  },
  {
    id: "anytime-kalimatan",
    categoryId: "anytime",
    title: "Two light words, heavy on the scale",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    transliteration: "Subhan-Allahi wa bihamdih, subhan-Allahil-'Azim",
    translation: "Glory and praise is to Allah, glory is to Allah the Magnificent.",
    virtues: "Two phrases light on the tongue, heavy on the scale, beloved to the Most Merciful.",
    reference: "Bukhari & Muslim",
    targetCount: 10,
  },

  // ── After Prayer ─────────────────────────────────────────
  {
    id: "after_prayer-tasbih",
    categoryId: "after_prayer",
    title: "SubhanAllah (x33)",
    arabic: "سُبْحَانَ اللَّهِ",
    transliteration: "Subhan-Allah",
    translation: "Glory is to Allah.",
    reference: "Muslim",
    targetCount: 33,
  },
  {
    id: "after_prayer-tahmid",
    categoryId: "after_prayer",
    title: "Alhamdulillah (x33)",
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: "Alhamdulillah",
    translation: "All praise is for Allah.",
    reference: "Muslim",
    targetCount: 33,
  },
  {
    id: "after_prayer-takbir",
    categoryId: "after_prayer",
    title: "Allahu Akbar (x34)",
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    translation: "Allah is the Greatest.",
    virtues:
      "Completing the tasbeeh after each prayer wipes away sins though they be like the foam of the sea.",
    reference: "Muslim",
    targetCount: 34,
  },
  // Ayat al-Kursi is supplied complete (verbatim, with transliteration) by the
  // fitrahive dhikr-after-salah dataset — the truncated hand-curated copy was
  // removed so only the full verse remains.
  {
    id: "after_prayer-tahlil-hundred",
    categoryId: "after_prayer",
    title: "La ilaha illallah (completing the hundred)",
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration:
      "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir",
    translation:
      "There is no god but Allah, alone, without partner. His is the dominion and His is the praise, and He is over all things capable.",
    virtues:
      "Whoever, after every prayer, glorifies Allah 33 times, praises Him 33 times, and magnifies Him 33 times — that is 99 — then completes the hundred with this, his sins are forgiven though they be like the foam of the sea.",
    reference: "Muslim 597",
    targetCount: 1,
  },
  {
    id: "after_prayer-tahlil-ten",
    categoryId: "after_prayer",
    title: "La ilaha illallah (x10 after Fajr & Maghrib)",
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration:
      "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, yuhyi wa yumit, wa huwa 'ala kulli shay'in qadir",
    translation:
      "There is no god but Allah, alone, without partner. His is the dominion and His is the praise. He gives life and causes death, and He is over all things capable.",
    virtues:
      "Whoever says it ten times after Maghrib and after Fajr: Allah records for him ten good deeds, erases ten sins, raises him ten degrees, and it is a protection for him that day from every disliked thing and a guard from Shaytan.",
    reference: "Tirmidhi 3474",
    targetCount: 10,
    prayers: ["fajr", "maghrib"],
  },
  {
    id: "after_prayer-ajirni-min-an-nar",
    categoryId: "after_prayer",
    title: "Allahumma ajirni min an-nar (x7 after Fajr & Maghrib)",
    arabic: "اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ",
    transliteration: "Allahumma ajirni minan-nar",
    translation: "O Allah, save me from the Fire.",
    virtues:
      "Whoever says it seven times after the Maghrib prayer before speaking, then dies that night, is protected from the Fire; and whoever says it after Fajr before speaking, then dies that day, is protected from the Fire.",
    reference: "Abu Dawud 5079",
    targetCount: 7,
    prayers: ["fajr", "maghrib"],
  },
  {
    id: "after_prayer-muadh-dhikr-shukr",
    categoryId: "after_prayer",
    title: "Help me to remember and thank You",
    arabic: "اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    transliteration: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik",
    translation:
      "O Allah, help me to remember You, to thank You, and to worship You in the best manner.",
    virtues:
      "The Prophet ﷺ took Mu'adh by the hand and said, 'By Allah, I love you,' then advised him never to leave saying this after every prayer.",
    reference: "Abu Dawud 1522 & An-Nasa'i",
    targetCount: 1,
  },
  {
    id: "after_prayer-nur",
    categoryId: "after_prayer",
    title: "Supplication for Light (after Fajr)",
    arabic:
      "اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا، وَفِي لِسَانِي نُورًا، وَفِي سَمْعِي نُورًا، وَفِي بَصَرِي نُورًا، وَمِنْ فَوْقِي نُورًا، وَمِنْ تَحْتِي نُورًا، وَعَنْ يَمِينِي نُورًا، وَعَنْ شِمَالِي نُورًا، وَمِنْ أَمَامِي نُورًا، وَمِنْ خَلْفِي نُورًا، وَاجْعَلْ فِي نَفْسِي نُورًا، وَأَعْظِمْ لِي نُورًا",
    transliteration:
      "Allahumma-j'al fi qalbi nuran, wa fi lisani nuran, wa fi sam'i nuran, wa fi basari nuran, wa min fawqi nuran, wa min tahti nuran, wa 'an yamini nuran, wa 'an shimali nuran, wa min amami nuran, wa min khalfi nuran, waj'al fi nafsi nuran, wa a'zim li nuran",
    translation:
      "O Allah, place light in my heart, light in my tongue, light in my hearing, light in my sight, light above me, light below me, light on my right, light on my left, light before me, light behind me; place light in my soul, and make light abundant for me.",
    virtues:
      "A supplication of the Prophet ﷺ, reported among the adhkar said after the Fajr prayer.",
    reference: "Muslim 763",
    targetCount: 1,
    prayers: ["fajr"],
  },
  {
    id: "after_prayer-kaffarat-al-majlis",
    categoryId: "after_prayer",
    title: "Expiation of the sitting",
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
    transliteration:
      "Subhanaka-llahumma wa bihamdik, ashhadu an la ilaha illa anta, astaghfiruka wa atubu ilayk",
    translation:
      "Glory is to You, O Allah, and praise; I bear witness that there is no god but You; I seek Your forgiveness and repent to You.",
    virtues:
      "'A'ishah reported that the Prophet ﷺ would say this at the end of a sitting. Whoever says it, what occurred in that gathering is forgiven for him.",
    reference: "Tirmidhi 3433 & An-Nasa'i",
    targetCount: 1,
  },
  {
    id: "after_prayer-malik-quddus",
    categoryId: "after_prayer",
    title: "Subhanal Malikil Quddus (x3 after Witr)",
    arabic: "سُبْحَانَ الْمَلِكِ الْقُدُّوسِ",
    transliteration: "Subhanal-Malikil-Quddus",
    translation: "Glory be to the King, the Most Holy.",
    virtues:
      "After the salam of the Witr prayer the Prophet ﷺ would say it three times, raising and prolonging his voice on the third, adding: 'Rabbil-mala'ikati war-ruh' (Lord of the angels and the Spirit). Witr is prayed after the Isha prayer.",
    reference: "An-Nasa'i 1699",
    targetCount: 3,
    prayers: ["witr"],
  },

  // ── Morning ──────────────────────────────────────────────
  {
    id: "morning-tasbih-hundred",
    categoryId: "morning",
    title: "SubhanAllahi wa bihamdihi (x100)",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    transliteration: "Subhan-Allahi wa bihamdihi",
    translation: "Glory is to Allah and praise is to Him.",
    virtues:
      "None will come on the Day of Judgement with better than this, except one who did the same or more.",
    reference: "Muslim",
    targetCount: 100,
  },
  {
    id: "morning-protection",
    categoryId: "morning",
    title: "Bismillahilladhi la yadurru (x3)",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration:
      "Bismillahilladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama', wa huwas-Sami'ul-'Alim",
    translation:
      "In the name of Allah, with whose name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
    virtues: "Whoever says it three times, nothing will harm him.",
    reference: "Abu Dawud & Tirmidhi",
    targetCount: 3,
  },
  // Sayyidul Istighfar is supplied complete (verbatim, with transliteration) by
  // the fitrahive morning-dhikr dataset — the truncated hand-curated copy was
  // removed so only the full supplication remains.
  {
    id: "morning-radeetu",
    categoryId: "morning",
    title: "Contentment with Allah, Islam, and the Prophet ﷺ",
    arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا",
    transliteration: "Radeetu billahi Rabban, wa bil-Islami dinan, wa bi-Muhammadin ﷺ nabiyya",
    translation:
      "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.",
    virtues:
      "Whoever says it three times, it is a right upon Allah to please him on Judgement Day.",
    reference: "Abu Dawud & Tirmidhi",
    targetCount: 3,
  },

  // ── Evening ──────────────────────────────────────────────
  {
    id: "evening-tasbih-hundred",
    categoryId: "evening",
    title: "SubhanAllahi wa bihamdihi (x100)",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    transliteration: "Subhan-Allahi wa bihamdihi",
    translation: "Glory is to Allah and praise is to Him.",
    reference: "Muslim",
    targetCount: 100,
  },
  {
    id: "evening-protection",
    categoryId: "evening",
    title: "Bismillahilladhi la yadurru (x3)",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration:
      "Bismillahilladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama', wa huwas-Sami'ul-'Alim",
    translation:
      "In the name of Allah, with whose name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
    reference: "Abu Dawud & Tirmidhi",
    targetCount: 3,
  },
  {
    id: "evening-refuge",
    categoryId: "evening",
    title: "A'udhu bikalimatillahit-tammat (x3)",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
    translation:
      "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    virtues: "Whoever says it three times in the evening, no venom will harm him that night.",
    reference: "Muslim",
    targetCount: 3,
  },
  // Full Sahih Muslim 2723 narration (not the truncated opening line alone).
  // Arabic matches the fitrahive/Hisnul evening entry so mergeUnique dedupes
  // and layers bn/id translations onto this preserved id.
  {
    id: "evening-amsayna",
    categoryId: "evening",
    title: "We have reached the evening",
    arabic:
      "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ للهِ، وَالْحَمْدُ للهِ، لَا إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُبِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُبِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُبِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    transliteration:
      "Amsayna wa amsal-mulku lillah, wal-hamdu lillah. La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir. Rabbi as'aluka khayra ma fi hadhihil-laylah wa khayra ma ba'daha, wa a'udhu bika min sharri ma fi hadhihil-laylah wa sharri ma ba'daha. Rabbi a'udhu bika minal-kasali wa su'il-kibar. Rabbi a'udhu bika min 'adhabin fin-nar wa 'adhabin fil-qabr",
    translation:
      "We have reached the evening and at this time the whole dominion belongs to Allah, and all praise is for Allah. There is no deity worthy of worship except Allah alone, He has no partner. To Him belongs the dominion and to Him is praise, and He is over all things competent. My Lord, I ask You for the good of this night and the good of what follows it, and I seek refuge in You from the evil of this night and the evil of what follows it. My Lord, I seek refuge in You from laziness and the evil of old age. My Lord, I seek refuge in You from the punishment of the Fire and the punishment of the grave.",
    reference: "Muslim 2723",
    targetCount: 1,
  },

  // ── After Azan ───────────────────────────────────────────
  {
    id: "after_azan-salawat",
    categoryId: "after_azan",
    title: "Salawat upon the Prophet ﷺ",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ",
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad",
    translation: "O Allah, send blessings upon Muhammad and upon the family of Muhammad.",
    virtues:
      "Whoever sends blessings upon the Prophet ﷺ once, Allah sends blessings upon him tenfold.",
    reference: "Muslim",
    targetCount: 10,
  },
  {
    id: "after_azan-wasila",
    categoryId: "after_azan",
    title: "Dua after the Adhan",
    arabic:
      "اللَّهُمَّ رَبَّ هَٰذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ",
    transliteration:
      "Allahumma Rabba hadhihid-da'watit-tammah, was-salatil-qa'imah, ati Muhammadanil-wasilata wal-fadilah, wab'ath-hu maqaman mahmudanil-ladhi wa'adtah",
    translation:
      "O Allah, Lord of this perfect call and established prayer, grant Muhammad the intercession (wasilah) and eminence, and raise him to the praiseworthy station that You have promised him.",
    virtues: "Whoever says it after the adhan, intercession is made permissible for him.",
    reference: "Bukhari",
    targetCount: 1,
  },
  {
    id: "after_azan-repeat",
    categoryId: "after_azan",
    title: "Repeat after the Muadhin",
    arabic: "وَأَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ",
    transliteration: "Wa ashhadu an la ilaha illallah wa anna Muhammadan rasulullah",
    translation:
      "And I bear witness that there is no god but Allah and that Muhammad is the Messenger of Allah.",
    reference: "Muslim",
    targetCount: 1,
  },

  // ── Before Prayer ────────────────────────────────────────
  {
    id: "before_prayer-intention",
    categoryId: "before_prayer",
    title: "Settle the heart before salah",
    arabic: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا",
    transliteration: "Innas-salata kanat 'alal-mu'minina kitaban mawquta",
    translation: "Indeed, prayer has been decreed upon the believers a decree of specified times.",
    reference: "Quran 4:103",
    targetCount: 1,
  },
  {
    id: "before_prayer-taawwudh",
    categoryId: "before_prayer",
    title: "Seek refuge from Shaytan",
    arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    transliteration: "A'udhu billahi minash-shaytanir-rajim",
    translation: "I seek refuge in Allah from the accursed Shaytan.",
    reference: "Quran 16:98",
    targetCount: 1,
  },
  {
    id: "before_prayer-salawat",
    categoryId: "before_prayer",
    title: "Salawat before standing",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ",
    transliteration: "Allahumma salli 'ala Muhammad",
    translation: "O Allah, send blessings upon Muhammad.",
    reference: "Muslim",
    targetCount: 3,
  },

  // ── Before Sleep ─────────────────────────────────────────
  // Qur'anic remembrances first (Hisnul Muslim ch.28 order), then short duas.
  // Arabic for mushaf-backed items is filled by fillBeforeSleepQuran().
  {
    id: "before_sleep-ayat-kursi",
    categoryId: "before_sleep",
    title: "Ayat al-Kursi",
    arabic: "",
    transliteration: "",
    translation: "",
    virtues:
      "When you go to your bed, recite Ayat al-Kursi — a guardian from Allah stays with you, and no shaytan approaches until morning.",
    reference: "Quran 2:255 · Bukhari 5010",
    targetCount: 1,
  },
  {
    id: "before_sleep-baqarah-end",
    categoryId: "before_sleep",
    title: "Last two ayahs of Al-Baqarah",
    arabic: "",
    transliteration: "",
    translation: "",
    virtues:
      "Whoever recites the last two ayahs of Surat al-Baqarah at night, they will suffice him (as protection).",
    reference: "Quran 2:285-286 · Bukhari 5009 · Muslim 807",
    targetCount: 1,
  },
  {
    // arabic / transliteration / translation filled from Surahs 112-114.
    id: "before_sleep-ikhlas",
    categoryId: "before_sleep",
    title: "The Three Quls",
    arabic: "",
    transliteration: "",
    translation: "",
    virtues:
      "Cup the palms, recite Al-Ikhlas, Al-Falaq, and An-Nas, blow into the hands, and wipe over the body — starting with the head and face — three times.",
    reference: "Quran 112-114 · Bukhari 5017",
    targetCount: 3,
  },
  {
    id: "before_sleep-sajdah",
    categoryId: "before_sleep",
    title: "Surah As-Sajdah",
    arabic: "",
    transliteration: "",
    translation: "",
    virtues:
      "The Prophet ﷺ would not sleep until he had recited Surat as-Sajdah and Surat al-Mulk.",
    reference: "Quran 32 · Tirmidhi 2892 · Hisn al-Muslim",
    targetCount: 1,
  },
  {
    id: "before_sleep-mulk",
    categoryId: "before_sleep",
    title: "Surah Al-Mulk",
    arabic: "",
    transliteration: "",
    translation: "",
    virtues:
      "A surah of thirty ayahs that intercedes for its companion until he is forgiven. The Prophet ﷺ would not sleep until he had recited it (with Surat as-Sajdah).",
    reference: "Quran 67 · Tirmidhi 2891 · Abu Dawud 1400",
    targetCount: 1,
  },
  {
    // Primary wording = Bukhari 6324 (matches Hisnul Muslim audio). Bukhari 6314
    // has the equally authentic order اللَّهُمَّ بِاسْمِكَ — both are sahih.
    id: "before_sleep-name",
    categoryId: "before_sleep",
    title: "Bismika Allahumma amutu wa ahya",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
    translation: "In Your name, O Allah, I die and I live.",
    virtues:
      "Both wordings are authentically transmitted in Sahih al-Bukhari — neither is a correction of the other.",
    reference: "Bukhari 6324 · Bukhari 6314",
    variants: [
      {
        arabic: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
        transliteration: "Allahumma bismika amutu wa ahya",
        translation: "O Allah, in Your name I die and I live.",
        reference: "Bukhari 6314",
      },
    ],
    targetCount: 1,
  },
  {
    id: "before_sleep-tasbih-fatimah",
    categoryId: "before_sleep",
    title: "Tasbeeh of Fatimah",
    arabic: "سُبْحَانَ اللَّهِ (٣٣) الْحَمْدُ لِلَّهِ (٣٣) اللَّهُ أَكْبَرُ (٣٤)",
    transliteration: "Subhan-Allah (33), Alhamdulillah (33), Allahu Akbar (34)",
    translation: "Glory is to Allah, all praise is for Allah, Allah is the Greatest.",
    virtues: "Better for you than a servant, as the Prophet ﷺ taught Fatimah and 'Ali.",
    reference: "Bukhari 3705 · Muslim 2727",
    targetCount: 100,
  },
];

// Expanded, situational + source-based dua taxonomy mirroring how mainstream
// apps (GTAF Hisnul Muslim, Athan, IslamicFinder) group the Fortress-of-the-
// Muslim corpus. Order here is the on-screen display order.
const DUA_CATEGORY_LABELS = {
  morning_evening: "Morning & Evening",
  sleep: "Sleep & Waking",
  prayer: "Salah & Masjid",
  forgiveness: "Forgiveness & Gratitude",
  distress: "Distress & Hardship",
  protection: "Protection & Refuge",
  quranic: "Quranic Duas",
  food: "Food & Drink",
  home: "Home & Clothing",
  travel: "Travel",
  family: "Family & Marriage",
  illness: "Sickness & Death",
  weather: "Weather & Nature",
  hajj: "Hajj & Umrah",
  purification: "Purification",
  social: "Manners & Social",
};

// Hisnul Muslim chapter (group_id in the sheikhhanif database) → our category.
// Derived from the canonical 132-chapter Fortress of the Muslim index.
const HISN_CATEGORY_BY_GROUP = {
  1: "sleep", // upon waking
  2: "home",
  3: "home",
  4: "home",
  5: "home",
  6: "purification",
  7: "purification",
  8: "purification",
  9: "purification",
  10: "home",
  11: "home",
  12: "prayer",
  13: "prayer",
  14: "prayer",
  15: "prayer",
  16: "prayer",
  17: "prayer",
  18: "prayer",
  19: "prayer",
  20: "prayer",
  21: "prayer",
  22: "prayer",
  23: "prayer",
  24: "prayer",
  25: "prayer",
  26: "prayer",
  27: "morning_evening",
  28: "sleep",
  29: "sleep",
  30: "sleep",
  31: "sleep",
  32: "prayer",
  33: "prayer",
  34: "distress",
  35: "distress",
  36: "distress",
  37: "distress",
  38: "distress",
  39: "distress",
  40: "protection",
  41: "distress",
  42: "protection",
  43: "distress",
  44: "forgiveness",
  45: "protection",
  46: "distress",
  47: "family",
  48: "family",
  49: "illness",
  50: "illness",
  51: "illness",
  52: "illness",
  53: "distress",
  54: "illness",
  55: "illness",
  56: "illness",
  57: "illness",
  58: "illness",
  59: "illness",
  60: "illness",
  61: "weather",
  62: "weather",
  63: "weather",
  64: "weather",
  65: "weather",
  66: "weather",
  67: "weather",
  68: "food",
  69: "food",
  70: "food",
  71: "food",
  72: "food",
  73: "food",
  74: "food",
  75: "food",
  76: "food",
  77: "social",
  78: "social",
  79: "family",
  80: "family",
  81: "family",
  82: "distress",
  83: "social",
  84: "social",
  85: "forgiveness",
  86: "social",
  87: "social",
  88: "protection",
  89: "social",
  90: "social",
  91: "social",
  92: "protection",
  93: "social",
  94: "protection",
  95: "travel",
  96: "travel",
  97: "travel",
  98: "travel",
  99: "travel",
  100: "travel",
  101: "travel",
  102: "travel",
  103: "travel",
  104: "travel",
  105: "travel",
  106: "social",
  107: "social",
  108: "social",
  109: "social",
  110: "protection",
  111: "protection",
  112: "social",
  113: "social",
  114: "social",
  115: "hajj",
  116: "hajj",
  117: "hajj",
  118: "hajj",
  119: "hajj",
  120: "hajj",
  121: "hajj",
  122: "social",
  123: "social",
  124: "illness",
  125: "protection",
  126: "protection",
  127: "food",
  128: "protection",
  129: "forgiveness",
  130: "forgiveness",
  131: "forgiveness",
  132: "protection",
};

// Re-map the hand-curated base items (which predate the taxonomy) onto the new
// categories. Ids are preserved so existing saved-dua favorites still resolve.
// `quranic-*` items already carry a valid category, so they need no entry.
const BASE_CATEGORY_OVERRIDE = {
  "sunnah-huda-tuqa": "forgiveness",
  "sunnah-hamm-hazan": "distress",
  "sunnah-afiyah": "protection",
  "sunnah-dhikr-shukr": "prayer",
  "sunnah-thabbit-qalbi": "protection",
  "sunnah-laylat-qadr-afw": "forgiveness",
  "daily-before-eating": "food",
  "daily-after-eating": "food",
  "daily-leaving-home": "home",
  "daily-entering-home": "home",
  "daily-travel": "travel",
  "daily-entering-masjid": "prayer",
  "daily-distress": "distress",
};

const DUA_ITEMS = [
  // ── Quranic ──────────────────────────────────────────────
  {
    id: "quranic-hasanah",
    categoryId: "quranic",
    title: "Good in this world and the next",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration:
      "Rabbana atina fid-dunya hasanah, wa fil-akhirati hasanah, wa qina 'adhaban-nar",
    translation:
      "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    reference: "Quran 2:201",
  },
  {
    id: "quranic-ilma",
    categoryId: "quranic",
    title: "Increase me in knowledge",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidni 'ilma",
    translation: "My Lord, increase me in knowledge.",
    reference: "Quran 20:114",
  },
  {
    id: "quranic-sabr",
    categoryId: "quranic",
    title: "Patience and steadfastness",
    arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا",
    transliteration: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana",
    translation: "Our Lord, pour upon us patience and make firm our footing.",
    reference: "Quran 2:250",
  },
  {
    id: "quranic-light",
    categoryId: "quranic",
    title: "Light and forgiveness",
    arabic: "رَبَّنَا أَتْمِمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا إِنَّكَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "Rabbana atmim lana nurana waghfir lana innaka 'ala kulli shay'in qadir",
    translation:
      "Our Lord, perfect for us our light and forgive us; indeed You are over all things competent.",
    reference: "Quran 66:8",
  },
  {
    id: "quranic-tawakkul",
    categoryId: "quranic",
    title: "Reliance upon Allah",
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    transliteration: "Hasbunallahu wa ni'mal-wakil",
    translation: "Allah is sufficient for us, and He is the best disposer of affairs.",
    reference: "Quran 3:173",
  },
  {
    id: "quranic-dhun-nun",
    categoryId: "quranic",
    title: "The supplication of Yunus",
    arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    transliteration: "La ilaha illa anta subhanaka inni kuntu minaz-zalimin",
    translation: "There is no god but You; glory be to You. Indeed, I have been of the wrongdoers.",
    virtues: "No Muslim supplicates with it for anything but Allah answers him.",
    reference: "Quran 21:87 · Tirmidhi",
  },

  // ── Sunnah ───────────────────────────────────────────────
  {
    id: "sunnah-huda-tuqa",
    categoryId: "sunnah",
    title: "Guidance and contentment",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
    transliteration: "Allahumma inni as'aluka al-huda wat-tuqa wal-'afafa wal-ghina",
    translation: "O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.",
    reference: "Muslim",
  },
  {
    id: "sunnah-hamm-hazan",
    categoryId: "sunnah",
    title: "Relief from anxiety and grief",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan",
    translation: "O Allah, I seek refuge in You from anxiety and grief.",
    reference: "Bukhari",
  },
  {
    id: "sunnah-afiyah",
    categoryId: "sunnah",
    title: "Well-being in body and faith",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    transliteration: "Allahumma inni as'alukal-'afiyata fid-dunya wal-akhirah",
    translation: "O Allah, I ask You for well-being in this world and the Hereafter.",
    reference: "Ibn Majah",
  },
  {
    id: "sunnah-dhikr-shukr",
    categoryId: "sunnah",
    title: "Help to remember and thank Allah",
    arabic: "اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    transliteration: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik",
    translation:
      "O Allah, help me to remember You, to thank You, and to worship You in the best manner.",
    virtues: "The Prophet ﷺ advised Mu'adh never to leave this after every prayer.",
    reference: "Abu Dawud & An-Nasa'i",
  },
  {
    id: "sunnah-thabbit-qalbi",
    categoryId: "sunnah",
    title: "Make my heart firm upon Your religion",
    arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَىٰ دِينِكَ",
    transliteration: "Ya muqallibal-qulub thabbit qalbi 'ala dinik",
    translation: "O Turner of the hearts, make my heart firm upon Your religion.",
    reference: "Tirmidhi",
  },
  {
    id: "sunnah-laylat-qadr-afw",
    categoryId: "sunnah",
    title: "Laylat al-Qadr forgiveness dua",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
    translation: "O Allah, You are Forgiving, and You love forgiveness, so forgive me.",
    virtues:
      "Aisha asked the Prophet ﷺ what to say if she knew which night was Laylat al-Qadr; he taught her this dua.",
    reference: "Sunan al-Tirmidhi 3513",
  },

  // ── Daily ────────────────────────────────────────────────
  {
    id: "daily-before-eating",
    categoryId: "daily",
    title: "Before eating",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah",
    translation: "In the name of Allah.",
    reference: "Abu Dawud",
  },
  {
    id: "daily-after-eating",
    categoryId: "daily",
    title: "After eating",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    transliteration:
      "Alhamdu lillahilladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
    translation:
      "All praise is for Allah who fed me this and provided it for me without any might or power on my part.",
    virtues: "Whoever says it after eating has his past sins forgiven.",
    reference: "Abu Dawud & Tirmidhi",
  },
  {
    id: "daily-leaving-home",
    categoryId: "daily",
    title: "Leaving the home",
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "Bismillah, tawakkaltu 'alallah, wa la hawla wa la quwwata illa billah",
    translation:
      "In the name of Allah, I place my trust in Allah; there is no might nor power except with Allah.",
    reference: "Abu Dawud & Tirmidhi",
  },
  {
    id: "daily-entering-home",
    categoryId: "daily",
    title: "Entering the home",
    arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَىٰ رَبِّنَا تَوَكَّلْنَا",
    transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala Rabbina tawakkalna",
    translation:
      "In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we place our trust.",
    reference: "Abu Dawud",
  },
  {
    id: "daily-travel",
    categoryId: "daily",
    title: "Travel",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
    transliteration: "Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrinin",
    translation:
      "Glory to Him who has subjected this to us, and we could not have done it by ourselves.",
    reference: "Quran 43:13 · Muslim",
  },
  {
    id: "daily-entering-masjid",
    categoryId: "daily",
    title: "Entering the masjid",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    transliteration: "Allahummaftah li abwaba rahmatik",
    translation: "O Allah, open for me the gates of Your mercy.",
    reference: "Muslim",
  },
  // Full Bukhari/Muslim 2730 narration (three phrases) — matches Hisnul #122 so
  // buildDuaCorpus dedupes onto this preserved id instead of shipping a half dua.
  {
    id: "daily-distress",
    categoryId: "daily",
    title: "In times of distress",
    arabic:
      "لَا إِلَٰهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ السَّمَوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
    transliteration:
      "La ilaha illallahul-'Azimul-Halim, la ilaha illallahu Rabbul-'Arshil-'Azim, la ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-'Arshil-Karim",
    translation:
      "There is no god but Allah, the Magnificent, the Forbearing; there is no god but Allah, Lord of the Magnificent Throne; there is no god but Allah, Lord of the heavens, Lord of the earth, and Lord of the Noble Throne.",
    virtues: "The Prophet ﷺ would say it in times of distress.",
    reference: "Bukhari & Muslim 2730",
  },

  // ── Added from the docs/zikr-duas collection ─────────────
  {
    id: "quranic-yusuf-ending",
    categoryId: "quranic",
    title: "Yusuf's dua for a good ending",
    arabic: "فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ أَنْتَ وَلِيِّي فِي الدُّنْيَا وَالْآخِرَةِ، تَوَفَّنِي مُسْلِمًا وَأَلْحِقْنِي بِالصَّالِحِينَ",
    transliteration:
      "Fatiras-samawati wal-ard, anta waliyyi fid-dunya wal-akhirah, tawaffani musliman wa alhiqni bis-salihin",
    translation:
      "Creator of the heavens and the earth, You are my Protector in this world and the Hereafter. Cause me to die a Muslim and join me with the righteous.",
    reference: "Quran 12:101",
  },
  {
    id: "quranic-parents",
    categoryId: "quranic",
    title: "Mercy for one's parents",
    arabic: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    transliteration: "Rabbi-rhamhuma kama rabbayani saghira",
    translation: "My Lord, have mercy upon them as they raised me when I was small.",
    reference: "Quran 17:24",
  },
  {
    id: "quranic-gratitude",
    categoryId: "quranic",
    title: "Gratitude for Allah's favour",
    arabic:
      "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَصْلِحْ لِي فِي ذُرِّيَّتِي، إِنِّي تُبْتُ إِلَيْكَ وَإِنِّي مِنَ الْمُسْلِمِينَ",
    transliteration:
      "Rabbi awzi'ni an ashkura ni'matakal-lati an'amta 'alayya wa 'ala walidayya wa an a'mala salihan tardah, wa aslih li fi dhurriyyati, inni tubtu ilayka wa inni minal-muslimin",
    translation:
      "My Lord, enable me to be grateful for Your favour which You have bestowed upon me and upon my parents, and to do righteousness of which You approve, and make my offspring righteous. Indeed, I have repented to You, and I am of the Muslims.",
    reference: "Quran 46:15",
  },
  {
    id: "quranic-zalamna",
    categoryId: "quranic",
    title: "We have wronged ourselves",
    arabic: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    transliteration:
      "Rabbana zalamna anfusana wa il-lam taghfir lana wa tarhamna lanakunanna minal-khasirin",
    translation:
      "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
    reference: "Quran 7:23",
  },
  {
    id: "quranic-waliyyuna",
    categoryId: "quranic",
    title: "You are our Protector",
    arabic: "أَنْتَ وَلِيُّنَا فَاغْفِرْ لَنَا وَارْحَمْنَا وَأَنْتَ خَيْرُ الْغَافِرِينَ",
    transliteration: "Anta waliyyuna faghfir lana warhamna wa anta khayrul-ghafirin",
    translation:
      "You are our Protector, so forgive us and have mercy upon us; and You are the best of forgivers.",
    reference: "Quran 7:155",
  },
  {
    id: "quranic-nuh-refuge",
    categoryId: "quranic",
    title: "Refuge from asking without knowledge",
    arabic: "رَبِّ إِنِّي أَعُوذُ بِكَ أَنْ أَسْأَلَكَ مَا لَيْسَ لِي بِهِ عِلْمٌ، وَإِلَّا تَغْفِرْ لِي وَتَرْحَمْنِي أَكُنْ مِنَ الْخَاسِرِينَ",
    transliteration:
      "Rabbi inni a'udhu bika an as'alaka ma laysa li bihi 'ilm, wa il-la taghfir li wa tarhamni akum-minal-khasirin",
    translation:
      "My Lord, I seek refuge in You from asking You that of which I have no knowledge. And unless You forgive me and have mercy upon me, I will be among the losers.",
    reference: "Quran 11:47",
  },
  {
    id: "quranic-taqabbal",
    categoryId: "quranic",
    title: "Accept from us",
    arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Rabbana taqabbal minna innaka antas-Sami'ul-'Alim",
    translation:
      "Our Lord, accept [this] from us. Indeed, You are the All-Hearing, the All-Knowing.",
    reference: "Quran 2:127",
  },
  {
    id: "forgiveness-istighfar-hayyul-qayyum",
    categoryId: "forgiveness",
    title: "The istighfar that erases even great sins",
    arabic: "أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullahal-ladhi la ilaha illa huwal-Hayyul-Qayyumu wa atubu ilayh",
    translation:
      "I seek forgiveness from Allah, besides whom there is no deity, the Ever-Living, the Sustainer, and I turn to Him in repentance.",
    virtues: "Whoever says it, his sins are forgiven even if he had fled from the battlefield.",
    reference: "Abu Dawud & Tirmidhi",
  },
  {
    id: "protection-purify-soul",
    categoryId: "protection",
    title: "Purification of the soul",
    arabic:
      "اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا، وَزَكِّهَا أَنْتَ خَيْرُ مَنْ زَكَّاهَا، أَنْتَ وَلِيُّهَا وَمَوْلَاهَا، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ، وَمِنْ قَلْبٍ لَا يَخْشَعُ، وَمِنْ نَفْسٍ لَا تَشْبَعُ، وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا",
    transliteration:
      "Allahumma ati nafsi taqwaha, wa zakkiha anta khayru man zakkaha, anta waliyyuha wa mawlaha. Allahumma inni a'udhu bika min 'ilmin la yanfa', wa min qalbin la yakhsha', wa min nafsin la tashba', wa min da'watin la yustajabu laha",
    translation:
      "O Allah, grant my soul its piety and purify it, for You are the best to purify it; You are its Guardian and Master. O Allah, I seek refuge in You from knowledge that does not benefit, from a heart that does not fear, from a soul that is never satisfied, and from a supplication that is not answered.",
    reference: "Muslim",
  },
  {
    id: "protection-evil-of-faculties",
    categoryId: "protection",
    title: "Refuge from the evil of one's own faculties",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ سَمْعِي، وَمِنْ شَرِّ بَصَرِي، وَمِنْ شَرِّ لِسَانِي، وَمِنْ شَرِّ قَلْبِي، وَمِنْ شَرِّ مَنِيِّي",
    transliteration:
      "Allahumma inni a'udhu bika min sharri sam'i, wa min sharri basari, wa min sharri lisani, wa min sharri qalbi, wa min sharri maniyyi",
    translation:
      "O Allah, I seek refuge in You from the evil of my hearing, the evil of my sight, the evil of my tongue, the evil of my heart, and the evil of my desire.",
    reference: "Abu Dawud & Tirmidhi",
  },
  {
    id: "illness-martyrdom",
    categoryId: "illness",
    title: "Asking for martyrdom in Allah's path",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ شَهَادَةً فِي سَبِيلِكَ",
    transliteration: "Allahumma inni as'aluka shahadatan fi sabilik",
    translation: "O Allah, I ask You for martyrdom in Your path.",
    virtues:
      "Whoever sincerely asks Allah for martyrdom, Allah raises him to the rank of the martyrs even if he dies in his bed.",
    reference: "Muslim",
  },
  {
    id: "prayer-qunut-witr",
    categoryId: "prayer",
    title: "Dua al-Qunut (recited in Witr)",
    arabic:
      "اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ، وَنَشْكُرُكَ وَلَا نَكْفُرُكَ، وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ، اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ، وَإِلَيْكَ نَسْعَىٰ وَنَحْفِدُ، نَرْجُو رَحْمَتَكَ وَنَخْشَىٰ عَذَابَكَ، إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ",
    transliteration:
      "Allahumma inna nasta'inuka wa nastaghfiruka wa nu'minu bika wa natawakkalu 'alayka wa nuthni 'alaykal-khayr, wa nashkuruka wa la nakfuruk, wa nakhla'u wa natruku man yafjuruk. Allahumma iyyaka na'budu wa laka nusalli wa nasjud, wa ilayka nas'a wa nahfid, narju rahmataka wa nakhsha 'adhabak, inna 'adhabaka bil-kuffari mulhiq",
    translation:
      "O Allah, we seek Your help and Your forgiveness, we believe in You and rely upon You, and we praise You for all good. We thank You and are not ungrateful to You, and we forsake and turn away from whoever disobeys You. O Allah, You alone we worship, and to You we pray and prostrate; to You we strive and hasten. We hope for Your mercy and fear Your punishment; indeed, Your punishment will overtake the disbelievers.",
    virtues: "Recited standing in the Witr prayer (qunut).",
    reference: "Reported from 'Umar ibn al-Khattab · al-Bayhaqi",
  },
  {
    id: "home-spacious-rizq",
    categoryId: "home",
    title: "A spacious home and blessed provision",
    arabic: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي، وَوَسِّعْ لِي فِي دَارِي، وَبَارِكْ لِي فِي رِزْقِي",
    transliteration: "Allahumma-ghfir li dhanbi, wa wassi' li fi dari, wa barik li fi rizqi",
    translation:
      "O Allah, forgive my sin, make my home spacious for me, and bless me in my provision.",
    virtues: "A supplication taught by the Prophet ﷺ, reported by Abu Musa al-Ash'ari.",
    reference: "Tirmidhi & Ahmad",
  },
  {
    id: "protection-bad-neighbour",
    categoryId: "protection",
    title: "Refuge from a bad neighbour",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ جَارِ السُّوءِ فِي دَارِ الْمُقَامَةِ، فَإِنَّ جَارَ الْبَادِيَةِ يَتَحَوَّلُ",
    transliteration:
      "Allahumma inni a'udhu bika min jaris-su'i fi daril-muqamah, fa inna jaral-badiyati yatahawwal",
    translation:
      "O Allah, I seek refuge in You from a bad neighbour in my permanent home, for the neighbour of the desert moves on.",
    reference: "An-Nasa'i",
  },
  {
    id: "protection-chastity",
    categoryId: "protection",
    title: "Purity of heart and chastity",
    arabic: "اللَّهُمَّ اغْفِرْ ذَنْبِي، وَطَهِّرْ قَلْبِي، وَحَصِّنْ فَرْجِي",
    transliteration: "Allahumma-ghfir dhanbi, wa tahhir qalbi, wa hassin farji",
    translation: "O Allah, forgive my sin, purify my heart, and guard my chastity.",
    virtues:
      "From the Prophet's ﷺ supplication for a young man seeking to be freed from unlawful desire.",
    reference: "Ahmad",
  },
  {
    id: "protection-good-outcome",
    categoryId: "protection",
    title: "A good outcome and refuge from disgrace",
    arabic: "اللَّهُمَّ أَحْسِنْ عَاقِبَتَنَا فِي الْأُمُورِ كُلِّهَا، وَأَجِرْنَا مِنْ خِزْيِ الدُّنْيَا وَعَذَابِ الْآخِرَةِ",
    transliteration:
      "Allahumma ahsin 'aqibatana fil-umuri kulliha, wa ajirna min khizyid-dunya wa 'adhabil-akhirah",
    translation:
      "O Allah, grant us a good outcome in all our affairs, and protect us from disgrace in this world and the punishment of the Hereafter.",
    reference: "Ibn Hibban & Ahmad",
  },
];

const DUROOD_ITEMS = [
  {
    id: "durood-ibrahim",
    title: "Durood Ibrahim",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration:
      "Allahumma salli 'ala Muhammadin wa 'ala aali Muhammad, kama sallayta 'ala Ibrahim wa 'ala aali Ibrahim, innaka Hamidun Majid. Allahumma barik 'ala Muhammadin wa 'ala aali Muhammad, kama barakta 'ala Ibrahim wa 'ala aali Ibrahim, innaka Hamidun Majid",
    translation:
      "O Allah, send blessings upon Muhammad and the family of Muhammad, as You sent blessings upon Ibrahim and the family of Ibrahim; indeed You are Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim; indeed You are Praiseworthy, Glorious.",
    virtues:
      "Recited in every prayer; the most complete form of sending blessings on the Prophet ﷺ.",
    reference: "Bukhari & Muslim",
  },
  {
    id: "durood-short",
    title: "Short Salawat",
    arabic: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ",
    transliteration: "Allahumma salli wa sallim 'ala Nabiyyina Muhammad",
    translation: "O Allah, send blessings and peace upon our Prophet Muhammad.",
    virtues: "Whoever sends blessings once, Allah sends ten upon him.",
    reference: "Muslim",
  },
  {
    id: "durood-salli-ala",
    title: "Salli 'ala Muhammad",
    arabic: "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ",
    transliteration: "Sallallahu 'alayhi wa sallam",
    translation: "May Allah send blessings and peace upon him.",
    virtues: "Said upon hearing the name of the Prophet ﷺ.",
    reference: "Tirmidhi",
  },
  {
    id: "durood-afdal",
    title: "Blessings and peace",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ عَبْدِكَ وَرَسُولِكَ وَصَلِّ عَلَى الْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ",
    transliteration:
      "Allahumma salli 'ala Muhammadin 'abdika wa rasulika, wa salli 'alal-mu'minina wal-mu'minat",
    translation:
      "O Allah, send blessings upon Muhammad, Your servant and messenger, and upon the believing men and women.",
    reference: "Bukhari",
  },
];

// ── Serialization ──────────────────────────────────────────

function str(value) {
  return JSON.stringify(value);
}

function serializeObject(obj, fieldOrder) {
  const lines = ["  {"];
  for (const key of fieldOrder) {
    if (obj[key] === undefined) continue;
    lines.push(`    ${key}: ${str(obj[key])},`);
  }
  lines.push("  },");
  return lines.join("\n");
}

function withAudio(items, audioById) {
  // An item's own audioUri (e.g. the exact Hisnul Muslim track carried on each
  // dua row) wins over a fuzzy match; fuzzy matching only fills the gaps.
  return items.map((item) =>
    item.audioUri || !audioById[item.id] ? item : { ...item, audioUri: audioById[item.id] },
  );
}

function renderZikr(items, audioById) {
  const order = [
    "id",
    "categoryId",
    "title",
    "arabic",
    "transliteration",
    "translation",
    "translations",
    "virtues",
    "reference",
    "variants",
    "targetCount",
    "prayers",
    "chapter",
    "orderInChapter",
    "audioUri",
  ];
  const body = withAudio(items, audioById)
    .map((item) => serializeObject(sanitizeItemEnglish(item), order))
    .join("\n");
  return `import type { ZikrItem } from "../types/index";

/** Bump when the bundled zikr content changes so clients can re-seed. */
export const ZIKR_CONTENT_VERSION = 7;

/**
 * Curated adhkar for every part of the day. Generated by
 * apps/app/scripts/build-data/build-adhkar.mjs — do not edit by hand.
 */
export const ZIKR_ITEMS: ZikrItem[] = [
${body}
];

export function getZikrById(id: string): ZikrItem | undefined {
  return ZIKR_ITEMS.find((item) => item.id === id);
}
`;
}

function renderDuas(items, audioById) {
  const order = [
    "id",
    "categoryId",
    "title",
    "arabic",
    "transliteration",
    "translation",
    "translations",
    "virtues",
    "reference",
    "chapter",
    "orderInChapter",
    "audioUri",
  ];
  const body = withAudio(items, audioById)
    .map((item) => serializeObject(sanitizeItemEnglish(item), order))
    .join("\n");
  const labels = Object.entries(DUA_CATEGORY_LABELS)
    .map(([k, v]) => `  ${k}: ${str(v)},`)
    .join("\n");
  return `import type { DuaCategoryId, DuaItem } from "../types/index";

export const DUA_CONTENT_VERSION = 6;

export const DUA_CATEGORY_LABELS: Record<DuaCategoryId, string> = {
${labels}
};

/**
 * Curated supplications. Generated by
 * apps/app/scripts/build-data/build-adhkar.mjs — do not edit by hand.
 */
export const DUA_ITEMS: DuaItem[] = [
${body}
];

export function duasByCategory(categoryId: DuaCategoryId): DuaItem[] {
  return DUA_ITEMS.filter((item) => item.categoryId === categoryId);
}

export function getDuaById(id: string): DuaItem | undefined {
  return DUA_ITEMS.find((item) => item.id === id);
}
`;
}

function renderDuroods(items, audioById) {
  const order = [
    "id",
    "title",
    "arabic",
    "transliteration",
    "translation",
    "translations",
    "virtues",
    "reference",
    "audioUri",
  ];
  const body = withAudio(items, audioById)
    .map((item) => serializeObject(sanitizeItemEnglish(item), order))
    .join("\n");
  return `import type { DurudItem } from "../types/index";

export const DUROOD_CONTENT_VERSION = 6;

/**
 * Duroods and salawat upon the Prophet ﷺ. Generated by
 * apps/app/scripts/build-data/build-adhkar.mjs — do not edit by hand.
 */
export const DUROOD_ITEMS: DurudItem[] = [
${body}
];

export function getDurudById(id: string): DurudItem | undefined {
  return DUROOD_ITEMS.find((item) => item.id === id);
}
`;
}

function assertContent(zikr, dua, durood) {
  const all = [...zikr, ...dua, ...durood];
  const ids = new Set(all.map((i) => i.id));
  if (ids.size !== all.length) throw new Error("[adhkar] duplicate id across content sets");
  // No item may ship truncated Arabic — a `…`/`...` means we saved a snippet
  // instead of the full text. Source the complete verbatim text instead.
  for (const item of all) {
    if (/…|\.\.\./.test(item.arabic ?? "")) {
      throw new Error(`[adhkar] ${item.id} has truncated Arabic (contains "…")`);
    }
    // Trailing list punctuation usually means a bracketed phrase was stripped
    // and the sentence was left unfinished (see hisn-36).
    if (/[،,;]\s*$/.test((item.arabic ?? "").trim())) {
      throw new Error(
        `[adhkar] ${item.id} Arabic ends with trailing punctuation (likely truncated)`,
      );
    }
  }
  for (const item of [...zikr, ...dua]) {
    if (!item.reference?.trim()) {
      throw new Error(`[adhkar] item ${item.id} is missing a reference`);
    }
    if (!item.translation?.trim()) {
      throw new Error(`[adhkar] item ${item.id} is missing a translation`);
    }
  }
  // Zikr must keep transliteration; dua transliteration is optional (the full
  // Hisnul Muslim corpus is ingested for breadth and only partly transliterated).
  for (const item of zikr) {
    if (!item.transliteration?.trim()) {
      throw new Error(`[adhkar] zikr ${item.id} is missing transliteration`);
    }
  }
  const cats = [
    "morning",
    "evening",
    "before_prayer",
    "after_prayer",
    "after_azan",
    "before_sleep",
    "anytime",
  ];
  for (const cat of cats) {
    const count = zikr.filter((i) => i.categoryId === cat).length;
    if (count < 3) throw new Error(`[adhkar] category ${cat} has only ${count} items (need >= 3)`);
  }
}

export async function buildAdhkar() {
  // Complete before-sleep Qur'an remembrances from the bundled mushaf before
  // anything else so dedup + assertions see the full text.
  fillBeforeSleepQuran(ZIKR_ITEMS);
  // Zikr: merge the open dua/dhikr dataset onto the curated base (dedup by Arabic).
  const dataset = await fetchDuaDhikrDataset();
  const zikrItems = mergeUnique(ZIKR_ITEMS, dataset.zikr);
  tagAfterPrayerPrayers(zikrItems);
  // Duas: the full Hisnul Muslim corpus merged onto the curated base, with clean
  // transliteration layered from the curated + dataset sources where it exists.
  const hisnDuas = await fetchHisnDuas();
  const translitLookup = buildTranslitLookup([...dataset.dua, ...dataset.zikr]);
  const duaItems = buildDuaCorpus(hisnDuas, translitLookup);
  // Duroods: curated base + authentic Hisnul Muslim ch.107 salawat.
  const duroodItems = mergeDuruds(DUROOD_ITEMS, buildHisnDuruds(hisnDuas, translitLookup));

  const bnCsvMap = buildBnTranslationMap(hisnDuas);
  const bnApiMap = await buildBnTranslationMapFromThelightHub();
  const bnMap = new Map([...bnApiMap, ...bnCsvMap]);
  console.log(`  [adhkar] Bengali: ${bnMap.size} keys (${bnApiMap.size} from ${THELIGHTHUB_REPO})`);
  const idMap = await buildIdTranslationMap();
  for (const list of [zikrItems, duaItems, duroodItems]) {
    mergeTranslationMaps(list, { bn: bnMap, id: idMap });
    applyQuranLocaleTranslations(list);
  }

  assertContent(zikrItems, duaItems, duroodItems);

  // Match each item to a Hisnul Muslim recitation (best-effort).
  const audioDb = await fetchAdhkarAudioDb();
  const audioById = {};
  let matched = 0;
  for (const item of [...zikrItems, ...duaItems, ...duroodItems]) {
    const uri = audioDb.length ? matchAdhkarAudio(item.arabic, audioDb) : undefined;
    if (uri) {
      audioById[item.id] = uri;
      matched++;
    }
  }

  const zikrPath = join(SHARED_CONTENT_DIR, "zikr.ts");
  const duasPath = join(SHARED_CONTENT_DIR, "duas.ts");
  const duroodsPath = join(SHARED_CONTENT_DIR, "duroods.ts");

  await writeFileStable(zikrPath, renderZikr(zikrItems, audioById));
  await writeFileStable(duasPath, renderDuas(duaItems, audioById));
  await writeFileStable(duroodsPath, renderDuroods(duroodItems, audioById));
  const duasWithTranslit = withAudio(duaItems, audioById).filter((d) =>
    d.transliteration?.trim(),
  ).length;
  const duasWithAudio = withAudio(duaItems, audioById).filter((d) => d.audioUri).length;
  console.log(
    `  zikr.ts → ${zikrItems.length}, duas.ts → ${duaItems.length} (${duasWithTranslit} transliterated, ${duasWithAudio} with audio), duroods.ts → ${duroodItems.length} (${matched} matched via audio db)`,
  );

  return [
    await datasetEntry({
      id: "adhkar",
      kind: "content",
      version: 7,
      absFiles: [zikrPath, duasPath, duroodsPath],
      license: "Text: public domain (Qur'an & Hadith). Audio: streamed, © reciter.",
      attribution: `Duas from the full Hisnul Muslim (Fortress of the Muslim) corpus (${HISN_AUDIO_REPO}); adhkar & transliteration from ${DUADHIKR_REPO} (Arabic, transliteration, translation). Bengali Hisnul translations from ${THELIGHTHUB_REPO} (MIT, ${THELIGHTHUB_DUA_API}). Indonesian subset from fitrahive/dua-dhikr. Audio streamed from ${HISN_AUDIO_REPO}.`,
      sourceUrl: `https://github.com/${THELIGHTHUB_REPO}`,
    }),
  ];
}
