// D7 — regenerate the bundled adhkar / duas / duroods TS content files.
//
// The curated dataset is embedded here so the build is deterministic and
// network-free. Arabic is preserved verbatim; every item carries a reference
// (Hisnul Muslim cites Qur'an/Hadith) and a transliteration. Existing item ids
// are preserved so user favorites keep resolving.

import { join } from "node:path";

import { fetchJSON, fetchText } from "./fetch.mjs";
import { datasetEntry, SHARED_CONTENT_DIR, writeFileStable } from "./manifest.mjs";

// Per-item adhkar recitation audio (D9), matched against the Hisnul Muslim
// database by normalized Arabic and streamed via jsDelivr, pinned to a commit.
const HISN_AUDIO_REPO = "sheikhhanif/Hisnul_Muslim_Database";
const HISN_AUDIO_SHA = "07533fa1494d02c4b24aecb3ad7267e09219c956";
const HISN_AUDIO_CDN = `https://cdn.jsdelivr.net/gh/${HISN_AUDIO_REPO}@${HISN_AUDIO_SHA}/audio`;
const HISN_CSV = `https://cdn.jsdelivr.net/gh/${HISN_AUDIO_REPO}@${HISN_AUDIO_SHA}/hisnul_database.csv`;

/** Strip tashkeel/diacritics/punctuation and unify letter forms for matching. */
function normalizeArabic(text) {
  return text
    .normalize("NFKD")
    .replace(/[ً-ْٰـۖ-ۭ࣓-ࣿ]/g, "")
    .replace(/[آأإٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[^ء-ي]/g, "");
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
    try {
      rows = await fetchJSON(`${DUADHIKR_BASE}/${cat.slug}/en.json`);
    } catch (err) {
      console.warn(`  [adhkar] dataset ${cat.slug} unavailable (${err.message})`);
      continue;
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
    if (!norm || seenArabic.has(norm)) continue;
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
      "Completing the tasbih after each prayer wipes away sins though they be like the foam of the sea.",
    reference: "Muslim",
    targetCount: 34,
  },
  {
    id: "after_prayer-ayatul-kursi",
    categoryId: "after_prayer",
    title: "Ayat al-Kursi",
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
    transliteration: "Allahu la ilaha illa huwal-Hayyul-Qayyum, la ta'khudhuhu sinatun wa la nawm",
    translation:
      "Allah — there is no god but He, the Ever-Living, the Sustainer. Neither drowsiness nor sleep overtakes Him.",
    virtues:
      "Whoever recites it after each prayer, nothing stands between him and Paradise but death.",
    reference: "Quran 2:255 · An-Nasa'i",
    targetCount: 1,
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
  {
    id: "morning-sayyidul-istighfar",
    categoryId: "morning",
    title: "Sayyidul Istighfar",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
    transliteration:
      "Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata't",
    translation:
      "O Allah, You are my Lord, there is no god but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can.",
    virtues:
      "The best manner of seeking forgiveness; whoever says it with certainty enters Paradise.",
    reference: "Bukhari",
    targetCount: 1,
  },
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
  {
    id: "evening-amsayna",
    categoryId: "evening",
    title: "We have reached the evening",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
    transliteration: "Amsayna wa amsal-mulku lillah, wal-hamdu lillah",
    translation:
      "We have reached the evening and at this time the whole dominion belongs to Allah, and all praise is for Allah.",
    reference: "Muslim",
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
    arabic: "اللَّهُمَّ رَبَّ هَٰذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ",
    transliteration:
      "Allahumma Rabba hadhihid-da'watit-tammah, was-salatil-qa'imah, ati Muhammadanil-wasilata wal-fadilah",
    translation:
      "O Allah, Lord of this perfect call and established prayer, grant Muhammad the intercession and favour.",
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
  {
    id: "before_sleep-name",
    categoryId: "before_sleep",
    title: "Bismika Allahumma amutu wa ahya",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
    translation: "In Your name, O Allah, I die and I live.",
    reference: "Bukhari",
    targetCount: 1,
  },
  {
    id: "before_sleep-tasbih-fatimah",
    categoryId: "before_sleep",
    title: "Tasbih of Fatimah",
    arabic: "سُبْحَانَ اللَّهِ (٣٣) الْحَمْدُ لِلَّهِ (٣٣) اللَّهُ أَكْبَرُ (٣٤)",
    transliteration: "Subhan-Allah (33), Alhamdulillah (33), Allahu Akbar (34)",
    translation: "Glory is to Allah, all praise is for Allah, Allah is the Greatest.",
    virtues: "Better for you than a servant, as the Prophet ﷺ taught Fatimah and 'Ali.",
    reference: "Bukhari & Muslim",
    targetCount: 100,
  },
  {
    id: "before_sleep-ikhlas",
    categoryId: "before_sleep",
    title: "Recite Al-Ikhlas, Al-Falaq, An-Nas",
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ … قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ … قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    transliteration: "Qul huwallahu ahad … Qul a'udhu bi-Rabbil-falaq … Qul a'udhu bi-Rabbin-nas",
    translation: "Recite the three Quls, blow into the palms, and wipe over the body three times.",
    reference: "Bukhari",
    targetCount: 3,
  },
];

const DUA_CATEGORY_LABELS = {
  sunnah: "Sunnah Duas",
  quranic: "Quranic Duas",
  daily: "Daily Duas",
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
  {
    id: "daily-distress",
    categoryId: "daily",
    title: "In times of distress",
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ",
    transliteration: "La ilaha illallahul-'Azimul-Halim, la ilaha illallahu Rabbul-'Arshil-'Azim",
    translation:
      "There is no god but Allah, the Magnificent, the Forbearing; there is no god but Allah, Lord of the Magnificent Throne.",
    virtues: "The Prophet ﷺ would say it in times of distress.",
    reference: "Bukhari & Muslim",
  },
];

const DUROOD_ITEMS = [
  {
    id: "durood-ibrahim",
    title: "Durood Ibrahim",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration:
      "Allahumma salli 'ala Muhammadin wa 'ala aali Muhammad, kama sallayta 'ala Ibrahim wa 'ala aali Ibrahim, innaka Hamidun Majid",
    translation:
      "O Allah, send blessings upon Muhammad and the family of Muhammad, as You sent blessings upon Ibrahim and the family of Ibrahim; indeed You are Praiseworthy, Glorious.",
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
  return items.map((item) =>
    audioById[item.id] ? { ...item, audioUri: audioById[item.id] } : item,
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
    "virtues",
    "reference",
    "targetCount",
    "chapter",
    "orderInChapter",
    "audioUri",
  ];
  const body = withAudio(items, audioById)
    .map((item) => serializeObject(item, order))
    .join("\n");
  return `import type { ZikrItem } from "../types/index";

/** Bump when the bundled zikr content changes so clients can re-seed. */
export const ZIKR_CONTENT_VERSION = 4;

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
    "virtues",
    "reference",
    "chapter",
    "orderInChapter",
    "audioUri",
  ];
  const body = withAudio(items, audioById)
    .map((item) => serializeObject(item, order))
    .join("\n");
  const labels = Object.entries(DUA_CATEGORY_LABELS)
    .map(([k, v]) => `  ${k}: ${str(v)},`)
    .join("\n");
  return `import type { DuaCategoryId, DuaItem } from "../types/index";

export const DUA_CONTENT_VERSION = 4;

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
    "virtues",
    "reference",
    "audioUri",
  ];
  const body = withAudio(items, audioById)
    .map((item) => serializeObject(item, order))
    .join("\n");
  return `import type { DurudItem } from "../types/index";

export const DUROOD_CONTENT_VERSION = 4;

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

function assertContent(zikr, dua) {
  const all = [...zikr, ...dua, ...DUROOD_ITEMS];
  const ids = new Set(all.map((i) => i.id));
  if (ids.size !== all.length) throw new Error("[adhkar] duplicate id across content sets");
  for (const item of [...zikr, ...dua]) {
    if (!item.reference?.trim()) {
      throw new Error(`[adhkar] item ${item.id} is missing a reference`);
    }
    if (!item.transliteration?.trim() || !item.translation?.trim()) {
      throw new Error(`[adhkar] item ${item.id} is missing transliteration/translation`);
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
  // Merge the open dua/dhikr dataset into the hand-curated base (dedup by Arabic).
  const dataset = await fetchDuaDhikrDataset();
  const zikrItems = mergeUnique(ZIKR_ITEMS, dataset.zikr);
  const duaItems = mergeUnique(DUA_ITEMS, dataset.dua);
  const duroodItems = DUROOD_ITEMS;

  assertContent(zikrItems, duaItems);

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
  console.log(
    `  zikr.ts → ${zikrItems.length}, duas.ts → ${duaItems.length}, duroods.ts → ${duroodItems.length} (${matched} with audio, +${zikrItems.length - ZIKR_ITEMS.length + duaItems.length - DUA_ITEMS.length} from dataset)`,
  );

  return [
    await datasetEntry({
      id: "adhkar",
      kind: "content",
      version: 4,
      absFiles: [zikrPath, duasPath, duroodsPath],
      license: "Text: public domain (Qur'an & Hadith). Audio: streamed, © reciter.",
      attribution: `Adhkar & duas from ${DUADHIKR_REPO} (Arabic, transliteration, translation) + Hisnul Muslim. Audio matched to ${HISN_AUDIO_REPO}.`,
      sourceUrl: `https://github.com/${DUADHIKR_REPO}`,
    }),
  ];
}
