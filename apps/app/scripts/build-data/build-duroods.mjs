// Duroods / salawat upon the Prophet ﷺ — sourced from open hadith datasets (D11).
//
// Every durood's Arabic wording, English meaning, citation and grade is cut
// verbatim out of a pinned dataset record; nothing here is hand-written except
// the *mapping* (which record, which span) and the stable ids. Each span is
// located by start/end markers that must exist in the record — if the dataset
// drifts the build fails instead of shipping a wrong wording.
//
// Sources:
//   - fawazahmed0/hadith-api (Unlicense) pinned to HADITH_API_SHA — Arabic,
//     English and the ur/id/tr/bn/fr/ru editions, with published grades.
//   - sheikhhanif/Hisnul_Muslim_Database (the Hisnul Muslim CSV + audio the
//     adhkar build already uses) — rows passed in by build-adhkar.mjs.
// Proof log: docs/proofs/duroods.md.

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { CACHE_DIR, fetchJSON } from "./fetch.mjs";

export const HADITH_API_REPO = "fawazahmed0/hadith-api";
/** Pinned commit of fawazahmed0/hadith-api (branch `1`, 2026-06-03). */
export const HADITH_API_SHA = "df57907be35291c91ad6a6691180e22ca9920784";
const HADITH_API_BASES = [
  `https://cdn.jsdelivr.net/gh/${HADITH_API_REPO}@${HADITH_API_SHA}`,
  `https://raw.githubusercontent.com/${HADITH_API_REPO}/${HADITH_API_SHA}`,
];

/** App locale → fawazahmed0 edition prefix (mirrors shared/i18n/hadith-editions.ts). */
const TRANSLATION_EDITIONS = { ur: "urd", id: "ind", tr: "tur", bn: "ben", fr: "fra", ru: "rus" };

const COLLECTION_NAMES = {
  bukhari: "Sahih al-Bukhari",
  muslim: "Sahih Muslim",
  abudawud: "Sunan Abi Dawud",
  tirmidhi: "Jami' at-Tirmidhi",
  nasai: "Sunan an-Nasa'i",
  ibnmajah: "Sunan Ibn Majah",
};
/** The two Sahih collections carry no per-hadith grade: every hadith in them is sahih. */
const SAHIHAYN = new Set(["bukhari", "muslim"]);
/** Grader whose published grade we show for the Sunan (the app-wide convention). */
const PRIMARY_GRADER = "Al-Albani";

/**
 * The durood set. `wording` = the record (and Arabic span) the recited words
 * come from; `meaning` = the record whose English renders exactly that wording
 * (same record, a parallel narration whose Arabic formula is identical —
 * asserted — or the matching Hisnul Muslim row). `also` = other narrations of
 * the same report (same Companion), cited alongside. `hisnAudio` = the Hisnul
 * Muslim row whose Arabic must equal the wording for its recording to attach.
 *
 * `hadithNumber` is the API's `hadithnumber` (Muslim: sequential; the citation
 * uses the Abdul Baqi number from `arabicnumber`).
 */
const DUROOD_SPECS = [
  {
    id: "durood-ibrahim",
    kind: "salawat",
    title: "Durood Ibrahim",
    wording: {
      collection: "bukhari",
      hadithNumber: 3370,
      from: "اللهم صل على محمد",
      to: "كما باركت على إبراهيم وعلى آل إبراهيم إنك حميد مجيد",
    },
    meaning: { collection: "bukhari", hadithNumber: 3370, from: "O Allah! Send Your Mercy" },
    narrator: "كعب بن عجرة",
    also: [
      { collection: "muslim", hadithNumber: 908 },
      { collection: "abudawud", hadithNumber: 976 },
    ],
    hisnAudio: "53",
    keepTransliteration:
      "Allahumma salli 'ala Muhammadin wa 'ala aali Muhammad, kama sallayta 'ala Ibrahim wa 'ala aali Ibrahim, innaka Hamidun Majid. Allahumma barik 'ala Muhammadin wa 'ala aali Muhammad, kama barakta 'ala Ibrahim wa 'ala aali Ibrahim, innaka Hamidun Majid",
    virtue:
      "Taught by the Prophet ﷺ when the Companions asked how to send salah upon him; Hisn al-Muslim lists it for the tashahhud.",
  },
  {
    id: "durood-abu-humayd",
    kind: "salawat",
    wording: {
      collection: "muslim",
      hadithNumber: 911,
      from: "اللهم صل على محمد",
      to: "إنك حميد مجيد",
    },
    meaning: { hisn: "54" },
    narrator: "أبو حميد الساعدي",
    also: [
      { collection: "bukhari", hadithNumber: 3369 },
      { collection: "abudawud", hadithNumber: 979 },
    ],
    hisnAudio: "54",
    virtue:
      "Taught by the Prophet ﷺ when the Companions asked how to send salah upon him; Hisn al-Muslim lists it for the tashahhud.",
  },
  {
    id: "durood-abu-masud",
    kind: "salawat",
    wording: {
      collection: "muslim",
      hadithNumber: 907,
      from: "اللهم صل على محمد",
      to: "في العالمين إنك حميد مجيد",
    },
    meaning: {
      collection: "nasai",
      hadithNumber: 1285,
      arabicFrom: "اللهم صل على محمد",
      arabicTo: "في العالمين إنك حميد مجيد",
      from: "(O Allah, send salah",
      to: "Full of glory.)",
    },
    narrator: "أبي مسعود الأنصاري",
    also: [
      { collection: "nasai", hadithNumber: 1285 },
      { collection: "tirmidhi", hadithNumber: 3220 },
    ],
  },
  {
    // Kept id (was a hand-written "'abdika wa rasulika" form with an unsourced
    // addition); now the wording of Abu Sa'id al-Khudri's report.
    id: "durood-afdal",
    kind: "salawat",
    wording: {
      collection: "ibnmajah",
      hadithNumber: 903,
      from: "اللهم صل على محمد عبدك ورسولك",
      to: "كما باركت على إبراهيم",
    },
    meaning: { collection: "ibnmajah", hadithNumber: 903, from: "[O Allah", to: "upon Ibrahim]" },
    transliteration: {
      collection: "ibnmajah",
      hadithNumber: 903,
      from: "Allahumma salli",
      to: "kama barakta ‘ala Ibrahima",
    },
    narrator: "أبي سعيد الخدري",
    also: [
      { collection: "bukhari", hadithNumber: 4798 },
      { collection: "bukhari", hadithNumber: 6358 },
    ],
  },
  {
    id: "durood-zayd-ibn-kharijah",
    kind: "salawat",
    wording: {
      collection: "nasai",
      hadithNumber: 1292,
      from: "اللهم صل على محمد",
      to: "وعلى آل محمد",
    },
    meaning: {
      collection: "nasai",
      hadithNumber: 1292,
      from: "(O Allah, send salah",
      to: "family of Muhammad)",
    },
    narrator: "زيد بن خارجة",
    virtue: "The Prophet ﷺ said: send salah upon me, strive hard in supplication, and say it.",
  },
  {
    // Outside the six books: the wording, its English and its citation are the
    // Hisnul Muslim morning-and-evening row (al-Tabarani; Sahih at-Targhib 656).
    id: "durood-short",
    kind: "salawat",
    title: "Short Salawat",
    hisnWording: "98",
    hisnAudio: "98",
    virtue: "Hisn al-Muslim lists it among the morning and evening remembrances, ten times.",
    keepTransliteration: "Allahumma salli wa sallim 'ala Nabiyyina Muhammad",
  },
  {
    // The formula said on hearing his name ﷺ: present verbatim in the record,
    // which is the evidence for saying it.
    id: "durood-salli-ala",
    kind: "salawat",
    title: "Salli 'ala Muhammad",
    fixedWording: {
      arabic: "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ",
      transliteration: "Sallallahu 'alayhi wa sallam",
      translation: "May Allah send blessings and peace upon him.",
    },
    evidence: { collection: "tirmidhi", hadithNumber: 3546, marker: "صلى الله عليه وسلم" },
    virtue:
      "The Prophet ﷺ called the one who hears him mentioned and does not send salah upon him stingy (Tirmidhi 3546).",
  },
  // ── Virtues of sending salah (the Hisnul Muslim ch.107 reports, re-sourced) ──
  {
    id: "durood-hisn-219",
    kind: "virtue",
    wording: {
      collection: "muslim",
      hadithNumber: 912,
      from: "من صلى علي واحدة",
      to: "صلى الله عليه عشرا",
    },
    meaning: { collection: "muslim", hadithNumber: 912, from: "He who blesses me once" },
  },
  {
    id: "durood-virtue-ten-degrees",
    kind: "virtue",
    wording: {
      collection: "nasai",
      hadithNumber: 1297,
      from: "من صلى علي صلاة واحدة",
      to: "عشر درجات",
    },
    meaning: { collection: "nasai", hadithNumber: 1297, from: "Whoever sends salah upon me" },
  },
  {
    id: "durood-virtue-friday",
    kind: "virtue",
    wording: {
      collection: "abudawud",
      hadithNumber: 1047,
      from: "إن من أفضل أيامكم",
      to: "فإن صلاتكم معروضة علي",
    },
    meaning: {
      collection: "abudawud",
      hadithNumber: 1047,
      from: "Among the most excellent",
      to: "submitted to me.",
    },
  },
  {
    id: "durood-hisn-220",
    kind: "virtue",
    wording: {
      collection: "abudawud",
      hadithNumber: 2042,
      from: "لا تجعلوا بيوتكم قبورا",
      to: "حيث كنتم",
    },
    meaning: { collection: "abudawud", hadithNumber: 2042, from: "Do not make your houses" },
  },
  {
    id: "durood-hisn-221",
    kind: "virtue",
    wording: {
      collection: "tirmidhi",
      hadithNumber: 3546,
      from: "البخيل الذي",
      to: "فلم يصل علي",
    },
    meaning: { collection: "tirmidhi", hadithNumber: 3546, from: "The stingy person" },
  },
  {
    id: "durood-hisn-222",
    kind: "virtue",
    wording: {
      collection: "nasai",
      hadithNumber: 1282,
      from: "إن لله ملائكة",
      to: "من أمتي السلام",
    },
    meaning: { collection: "nasai", hadithNumber: 1282, from: "Allah (SWT) has angels" },
  },
  {
    id: "durood-hisn-223",
    kind: "virtue",
    wording: {
      collection: "abudawud",
      hadithNumber: 2041,
      from: "ما من أحد يسلم علي",
      to: "حتى أرد عليه السلام",
    },
    meaning: { collection: "abudawud", hadithNumber: 2041, from: "If any one of you greets me" },
  },
];

// ── Text helpers ──────────────────────────────────────────────────────────

/** Harakat / Qur'anic marks that attach to the preceding letter. */
const COMBINING = /[ً-ٰٟۖ-ۭ]/;

/**
 * Normalize each character on its own and remember where it came from, so a
 * match in the normalized text maps back to an exact span of the original.
 */
function indexedNormal(text, normalizeArabic) {
  let norm = "";
  const at = [];
  for (let i = 0; i < text.length; i++) {
    const n = normalizeArabic(text[i].replace(/ى/g, "ي"));
    for (const ch of n) {
      norm += ch;
      at.push(i);
    }
  }
  return { norm, at };
}

function normalizeMarker(marker, normalizeArabic) {
  return normalizeArabic(marker.replace(/ى/g, "ي"));
}

/** Verbatim Arabic between two markers (inclusive), harakat and all. */
function sliceArabic(text, from, to, normalizeArabic, label) {
  const { norm, at } = indexedNormal(text, normalizeArabic);
  const f = normalizeMarker(from, normalizeArabic);
  const t = normalizeMarker(to, normalizeArabic);
  const start = norm.indexOf(f);
  if (start < 0) throw new Error(`[duroods] ${label}: start marker not found — mapping drifted`);
  const endAt = norm.indexOf(t, start);
  if (endAt < 0) throw new Error(`[duroods] ${label}: end marker not found — mapping drifted`);
  let end = at[endAt + t.length - 1] + 1;
  while (end < text.length && COMBINING.test(text[end])) end++;
  return text
    .slice(at[start], end)
    .replace(/[‏"“”«»]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Verbatim English between two markers (inclusive); `to` omitted = to the end. */
function sliceEnglish(text, from, to, label) {
  const start = text.indexOf(from);
  if (start < 0) throw new Error(`[duroods] ${label}: English start "${from}" not found`);
  let end = text.length;
  if (to) {
    const at = text.indexOf(to, start + from.length);
    if (at < 0) throw new Error(`[duroods] ${label}: English end "${to}" not found`);
    end = at + to.length;
  }
  let out = text.slice(start, end).trim();
  // Brackets / parentheses that only wrap the rendering in the source text.
  if (/^[([]/.test(out) && /[)\]]$/.test(out)) out = out.slice(1, -1).trim();
  out = out.replace(/^["'“‘]+|["'”’]+$/g, "").trim();
  if (!/[.!?]$/.test(out)) out = `${out}.`;
  return out;
}

// ── Dataset access ────────────────────────────────────────────────────────

async function fetchEdition(path) {
  let lastErr;
  for (const base of HADITH_API_BASES) {
    try {
      return await fetchJSON(`${base}/${path}`);
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error(`no edition ${path}`);
}

async function fetchRecord(edition, hadithNumber) {
  const data = await fetchEdition(`editions/${edition}/${Math.floor(hadithNumber)}.json`);
  const rec = (data.hadiths ?? []).find((h) => Number(h.hadithnumber) === hadithNumber);
  if (!rec) throw new Error(`[duroods] ${edition} ${hadithNumber} missing from the dataset`);
  return rec;
}

function citationOf(collection, record) {
  const number =
    collection === "muslim" ? Math.floor(Number(record.arabicnumber)) : record.hadithnumber;
  return `${COLLECTION_NAMES[collection]} ${number}`;
}

/** Published grade: sahihayn → Sahih; Sunan → Al-Albani's grade from the edition. */
function gradeOf(collection, ...records) {
  if (SAHIHAYN.has(collection)) return "Sahih";
  const grades = records.flatMap((r) => r?.grades ?? []);
  const primary = grades.find((g) => g.name === PRIMARY_GRADER) ?? grades[0];
  if (!primary?.grade) throw new Error(`[duroods] ${collection}: no published grade`);
  return `${primary.grade.trim()} (${primary.name})`;
}

/** Only sahih / hasan narrations ship (D11). */
function assertAcceptedGrade(grade, label) {
  const lead = grade.trim().toLowerCase();
  if (!(lead.startsWith("sahih") || lead.startsWith("hasan"))) {
    throw new Error(`[duroods] ${label} is graded "${grade}" — only sahih/hasan ship`);
  }
}

/** Cached HEAD check (offline re-runs stay deterministic). */
async function headOk(url) {
  const hash = createHash("sha256").update(`HEAD ${url}`).digest("hex").slice(0, 40);
  const cachePath = join(CACHE_DIR, `${hash}.head`);
  try {
    return (await readFile(cachePath, "utf8")).trim() === "ok";
  } catch {
    // cache miss → request below
  }
  const res = await fetch(url, {
    method: "HEAD",
    headers: { "user-agent": "munib-tracker-build" },
  });
  const contentType = res.headers.get("content-type") ?? "";
  const ok = res.ok && /audio|mpeg|octet-stream/.test(contentType);
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(cachePath, ok ? "ok" : `fail ${res.status} ${contentType}`, "utf8");
  return ok;
}

/** One narration as a ZikrSourceHadith (verbatim, with dataset translations). */
async function buildSource(ref, editions, { cleanHadithText, sanitizeEnglishDisplay }) {
  const ara = await fetchRecord(`ara-${ref.collection}`, ref.hadithNumber);
  const eng = await fetchRecord(`eng-${ref.collection}`, ref.hadithNumber);
  const grade = gradeOf(ref.collection, eng, ara);
  const reference = citationOf(ref.collection, ara);
  assertAcceptedGrade(grade, reference);
  const translations = {};
  for (const [locale, prefix] of Object.entries(TRANSLATION_EDITIONS)) {
    const edition = `${prefix}-${ref.collection}`;
    if (!editions.has(edition)) continue;
    const text = cleanHadithText((await fetchRecord(edition, ref.hadithNumber)).text);
    if (text) translations[locale] = text;
  }
  return {
    ara,
    eng,
    source: {
      collection: ref.collection,
      hadithNumber: ref.hadithNumber,
      reference,
      grade,
      arabic: cleanHadithText(ara.text),
      english: sanitizeEnglishDisplay(cleanHadithText(eng.text)),
      ...(Object.keys(translations).length ? { translations } : {}),
    },
  };
}

/** Rank for "keep the strongest source" when two wordings collapse together. */
function sourceRank(collection) {
  return ["bukhari", "muslim", "abudawud", "tirmidhi", "nasai", "ibnmajah"].indexOf(collection);
}

/**
 * Build the durood list + its source narrations.
 * @returns {{ items: object[], sources: Record<string, { sources: object[] }>, credits: string }}
 */
export async function buildDuroods({
  hisnDuas,
  hisnAudioCdn,
  translitLookup,
  normalizeArabic,
  cleanHadithText,
  sanitizeEnglishDisplay,
}) {
  const editionIndex = await fetchEdition("editions.min.json");
  const editions = new Set(
    Object.values(editionIndex).flatMap((book) => (book.collection ?? []).map((e) => e.name)),
  );
  const helpers = { cleanHadithText, sanitizeEnglishDisplay };
  const hisnById = new Map(hisnDuas.map((h) => [String(h.hisnId), h]));
  const hisnRow = (id, label) => {
    const row = hisnById.get(String(id));
    if (!row) throw new Error(`[duroods] ${label}: Hisnul Muslim row ${id} missing`);
    return row;
  };
  const clean = (text) => cleanHadithText(text);

  const items = [];
  const sourcesById = {};
  for (const spec of DUROOD_SPECS) {
    const label = spec.id;
    const item = { id: spec.id, kind: spec.kind };
    const narrations = [];

    if (spec.wording) {
      const primary = await buildSource(spec.wording, editions, helpers);
      narrations.push(primary.source);
      item.arabic = sliceArabic(
        clean(primary.ara.text),
        spec.wording.from,
        spec.wording.to,
        normalizeArabic,
        label,
      );
      if (spec.narrator) {
        const n = normalizeMarker(spec.narrator, normalizeArabic);
        if (!normalizeArabic(clean(primary.ara.text).replace(/ى/g, "ي")).includes(n)) {
          throw new Error(`[duroods] ${label}: narrator not in ${primary.source.reference}`);
        }
      }
      item.grade = primary.source.grade;
      const refs = [primary.source.reference];
      for (const also of spec.also ?? []) {
        const extra = await buildSource(also, editions, helpers);
        // A parallel narration must be the same report (same Companion) and
        // carry the salawat formula — never an unrelated hadith.
        const text = normalizeArabic(clean(extra.ara.text).replace(/ى/g, "ي"));
        if (
          (spec.narrator && !text.includes(normalizeMarker(spec.narrator, normalizeArabic))) ||
          !text.includes(normalizeMarker("صل على محمد", normalizeArabic))
        ) {
          throw new Error(`[duroods] ${label}: ${extra.source.reference} is not the same report`);
        }
        if (!narrations.some((s) => s.reference === extra.source.reference)) {
          narrations.push(extra.source);
        }
        refs.push(extra.source.reference);
      }
      item.reference = [...new Set(refs)].join("; ");
      item.title =
        spec.title ??
        (spec.kind === "virtue"
          ? `Virtue of salawat — ${primary.source.reference}`
          : `Salawat — ${primary.source.reference}`);

      // English meaning of exactly this wording.
      if (spec.meaning.hisn) {
        const row = hisnRow(spec.meaning.hisn, label);
        if (normalizeArabic(row.arabic) !== normalizeArabic(item.arabic)) {
          throw new Error(`[duroods] ${label}: Hisnul ${row.hisnId} wording differs`);
        }
        item.translation = row.translation;
      } else {
        const sameRecord =
          spec.meaning.collection === spec.wording.collection &&
          spec.meaning.hadithNumber === spec.wording.hadithNumber;
        const meaningEng = sameRecord
          ? primary.eng
          : await fetchRecord(`eng-${spec.meaning.collection}`, spec.meaning.hadithNumber);
        if (!sameRecord) {
          const ara = await fetchRecord(
            `ara-${spec.meaning.collection}`,
            spec.meaning.hadithNumber,
          );
          const formula = sliceArabic(
            clean(ara.text),
            spec.meaning.arabicFrom,
            spec.meaning.arabicTo,
            normalizeArabic,
            `${label} (meaning)`,
          );
          if (normalizeArabic(formula) !== normalizeArabic(item.arabic)) {
            throw new Error(`[duroods] ${label}: meaning record renders a different wording`);
          }
        }
        item.translation = sliceEnglish(
          clean(meaningEng.text),
          spec.meaning.from,
          spec.meaning.to,
          label,
        );
      }
    } else if (spec.hisnWording) {
      const row = hisnRow(spec.hisnWording, label);
      item.arabic = row.arabic;
      item.translation = row.translation
        .replace(/\[[^\]]*\]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      item.reference = row.reference;
      item.title = spec.title;
    } else if (spec.fixedWording) {
      const ev = await buildSource(spec.evidence, editions, helpers);
      const text = normalizeArabic(clean(ev.ara.text).replace(/ى/g, "ي"));
      if (!text.includes(normalizeMarker(spec.evidence.marker, normalizeArabic))) {
        throw new Error(`[duroods] ${label}: formula not in ${ev.source.reference}`);
      }
      Object.assign(item, spec.fixedWording);
      item.title = spec.title;
      item.reference = ev.source.reference;
      item.grade = ev.source.grade;
      narrations.push(ev.source);
    }

    // Transliteration: dataset romanization, else a clean dataset match, else
    // the previously shipped one when the wording is unchanged.
    if (spec.transliteration) {
      const t = spec.transliteration;
      const eng = await fetchRecord(`eng-${t.collection}`, t.hadithNumber);
      item.transliteration = sliceEnglish(clean(eng.text), t.from, t.to, label).replace(/\.$/, "");
    } else if (!item.transliteration) {
      const found = translitLookup.get(normalizeArabic(item.arabic));
      if (found) item.transliteration = found;
      else if (spec.keepTransliteration) item.transliteration = spec.keepTransliteration;
    }

    if (spec.virtue) item.virtues = spec.virtue;

    // Recorded audio only where a Hisnul Muslim row has exactly this wording,
    // and only once the pinned file answers a HEAD request.
    if (spec.hisnAudio) {
      const row = hisnRow(spec.hisnAudio, label);
      if (normalizeArabic(row.arabic) !== normalizeArabic(item.arabic)) {
        throw new Error(`[duroods] ${label}: Hisnul ${row.hisnId} audio is a different wording`);
      }
      if (!row.audioFile) throw new Error(`[duroods] ${label}: Hisnul ${row.hisnId} has no audio`);
      const url = `${hisnAudioCdn}/${row.audioFile}`;
      if (await headOk(url)) item.audioUri = url;
      else
        console.warn(`  [duroods] ${label}: ${url} did not answer HEAD — shipping without audio`);
    }

    items.push(item);
    if (narrations.length) sourcesById[item.id] = { sources: narrations };
  }

  // Near-identical wordings collapse to the one with the strongest source.
  const byNorm = new Map();
  const kept = [];
  for (const item of items) {
    const n = normalizeArabic(item.arabic);
    const prior = byNorm.get(n);
    if (!prior) {
      byNorm.set(n, item);
      kept.push(item);
      continue;
    }
    const rank = (it) => sourceRank(sourcesById[it.id]?.sources[0]?.collection ?? "") >>> 0;
    const [winner, loser] = rank(item) < rank(prior) ? [item, prior] : [prior, item];
    console.warn(`  [duroods] ${loser.id} duplicates ${winner.id} — kept ${winner.id}`);
    kept.splice(kept.indexOf(prior), 1, winner);
    byNorm.set(n, winner);
    delete sourcesById[loser.id];
  }

  for (const item of kept) {
    for (const key of ["arabic", "translation", "title"]) {
      if (!item[key]?.trim()) throw new Error(`[duroods] ${item.id} is missing ${key}`);
    }
  }

  return {
    items: kept,
    sources: sourcesById,
    credits: `Duroods: salawat wordings, citations and grades from ${HADITH_API_REPO} @${HADITH_API_SHA.slice(0, 7)} (Unlicense) and Hisnul Muslim.`,
  };
}
