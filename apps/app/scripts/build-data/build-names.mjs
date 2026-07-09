// D8 — regenerate packages/shared/src/content/names.ts with the complete 99
// names of Allah (Asma-ul-Husna). The canonical list is embedded here (rather
// than scraped) so the build is deterministic and needs no network: the Arabic
// forms follow the standard Tirmidhi enumeration and are preserved verbatim.

import { join } from "node:path";

import { fetchJSON } from "./fetch.mjs";
import { datasetEntry, SHARED_CONTENT_DIR, writeFileStable } from "./manifest.mjs";

// Per-name recitation audio (D9), streamed via jsDelivr and pinned to a commit
// so the resolved URLs are reproducible.
const AUDIO_REPO = "ProgrammerHasan/99-names-of-allah-audios";
const AUDIO_SHA = "03c526366d460c3acb163c89fadb0201fd057b96";
const AUDIO_CDN = `https://cdn.jsdelivr.net/gh/${AUDIO_REPO}@${AUDIO_SHA}`;

// Approved multilingual name meanings (matched by normalized Arabic or number, never AI-generated).
const NAMES_ID_JSON =
  "https://gist.githubusercontent.com/olipiskandar/0f03d827c8229902d6e93f4d29bb0e72/raw/asmaul-husna.json";
const NAMES_FR_JSON =
  "https://raw.githubusercontent.com/KabDeveloper/99-Names-Of-Allah/main/99_Names_Of_Allah.json";
const NAMES_CORAL = "https://asmaul-husna-api-coral.vercel.app/api/asmaul-husna";

/** Strip tashkeel and unify Arabic letter forms for cross-source matching. */
function normalizeArabic(text) {
  return (text ?? "")
    .normalize("NFKD")
    .replace(/[ً-ْٰـۖ-ۭ࣓-ࣿ]/g, "")
    .replace(/[آأإٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[^ء-ي]/g, "");
}

async function fetchNameTranslationMaps() {
  const maps = { id: new Map(), ms: new Map(), fr: new Map(), ur: new Map(), bn: new Map() };

  try {
    const idPayload = await fetchJSON(NAMES_ID_JSON);
    for (const row of idPayload.data ?? []) {
      const n = normalizeArabic(row.arab);
      const text = (row.terjemahan ?? "").trim();
      if (n && text) maps.id.set(n, text);
    }
  } catch (err) {
    console.warn(`  [names] Indonesian translations unavailable (${err.message})`);
  }

  try {
    const msRows = await fetchJSON(
      "https://cdn.jsdelivr.net/gh/adiman-dev/islamic-json@main/asma.json",
    );
    for (const row of msRows ?? []) {
      const n = normalizeArabic(row.arabic);
      const meaning = row.meanings?.find((m) => m.lang === "ms")?.text?.trim();
      if (n && meaning) maps.ms.set(n, meaning);
    }
  } catch (err) {
    console.warn(`  [names] Malay translations unavailable (${err.message})`);
  }

  try {
    const frPayload = await fetchJSON(NAMES_FR_JSON);
    for (const row of frPayload.data ?? []) {
      const n = normalizeArabic(row.name);
      const text = row.fr?.meaning?.trim();
      if (n && text) maps.fr.set(n, text);
    }
  } catch (err) {
    console.warn(`  [names] French translations unavailable (${err.message})`);
  }

  for (const [locale, lang] of [
    ["ur", "urdu"],
    ["bn", "bangla"],
  ]) {
    try {
      const payload = await fetchJSON(`${NAMES_CORAL}?lang=${lang}`);
      for (const row of payload.results ?? []) {
        const n = normalizeArabic(row.name?.arabic);
        const text = (row.name?.translated ?? row.meaning ?? "").trim();
        if (n && text) maps[locale].set(n, text);
      }
    } catch (err) {
      console.warn(`  [names] ${locale} translations unavailable (${err.message})`);
    }
  }

  return maps;
}

/**
 * Resolve name-index (1..99) → per-name mp3 filename by parsing the leading
 * number of each file (the repo mixes `NN_name.mp3` and `audioNN_NN_name.mp3`).
 * Returns {} if the source is unreachable so the build never breaks on it.
 */
async function fetchNameAudioMap() {
  try {
    const tree = await fetchJSON(
      `https://api.github.com/repos/${AUDIO_REPO}/git/trees/${AUDIO_SHA}?recursive=1`,
    );
    const map = {};
    for (const node of tree.tree ?? []) {
      const path = node.path;
      if (!/\.mp3$/i.test(path) || /all_names/i.test(path)) continue;
      const match = path.match(/(\d+)/);
      if (!match) continue;
      const n = Number.parseInt(match[1], 10);
      if (n >= 1 && n <= 99 && !map[n]) map[n] = path;
    }
    const missing = [];
    for (let i = 1; i <= 99; i++) if (!map[i]) missing.push(i);
    if (missing.length) {
      console.warn(`  [names] audio missing for ${missing.length} names; skipping audio`);
      return {};
    }
    return map;
  } catch (err) {
    console.warn(`  [names] audio map unavailable (${err.message}); generating without audio`);
    return {};
  }
}

// [id, arabic, transliteration, translation, meaning]
const NAMES = [
  [
    "ar-rahman",
    "الرَّحْمَٰن",
    "Ar-Rahman",
    "The Most Gracious",
    "The One whose mercy embraces all creation.",
  ],
  [
    "ar-rahim",
    "الرَّحِيم",
    "Ar-Rahim",
    "The Most Merciful",
    "The One who is especially merciful to the believers.",
  ],
  ["al-malik", "الْمَلِك", "Al-Malik", "The King", "The Sovereign owner of all dominion."],
  [
    "al-quddus",
    "الْقُدُّوس",
    "Al-Quddus",
    "The Most Holy",
    "The One pure and free from every imperfection.",
  ],
  [
    "as-salam",
    "السَّلَام",
    "As-Salam",
    "The Source of Peace",
    "The One free of all flaws, the giver of peace.",
  ],
  [
    "al-mumin",
    "الْمُؤْمِن",
    "Al-Mu'min",
    "The Guardian of Faith",
    "The One who grants security and confirms His signs.",
  ],
  [
    "al-muhaymin",
    "الْمُهَيْمِن",
    "Al-Muhaymin",
    "The Protector",
    "The Guardian who watches over and preserves all things.",
  ],
  ["al-aziz", "الْعَزِيز", "Al-Aziz", "The Almighty", "The Mighty, invincible and ever-dominant."],
  [
    "al-jabbar",
    "الْجَبَّار",
    "Al-Jabbar",
    "The Compeller",
    "The One who mends and whose will always prevails.",
  ],
  [
    "al-mutakabbir",
    "الْمُتَكَبِّر",
    "Al-Mutakabbir",
    "The Supreme",
    "The One who is justly proud of His greatness.",
  ],
  [
    "al-khaliq",
    "الْخَالِق",
    "Al-Khaliq",
    "The Creator",
    "The One who brings all things into existence from nothing.",
  ],
  [
    "al-bari",
    "الْبَارِئ",
    "Al-Bari'",
    "The Maker",
    "The Originator who fashions creation free of fault.",
  ],
  [
    "al-musawwir",
    "الْمُصَوِّر",
    "Al-Musawwir",
    "The Fashioner",
    "The One who gives everything its distinct form.",
  ],
  [
    "al-ghaffar",
    "الْغَفَّار",
    "Al-Ghaffar",
    "The Ever-Forgiving",
    "The One who forgives again and again.",
  ],
  ["al-qahhar", "الْقَهَّار", "Al-Qahhar", "The Subduer", "The Dominant One who prevails over all."],
  [
    "al-wahhab",
    "الْوَهَّاب",
    "Al-Wahhab",
    "The Bestower",
    "The One who gives freely without expecting return.",
  ],
  [
    "ar-razzaq",
    "الرَّزَّاق",
    "Ar-Razzaq",
    "The Provider",
    "The Sustainer who provides for all creation.",
  ],
  [
    "al-fattah",
    "الْفَتَّاح",
    "Al-Fattah",
    "The Opener",
    "The One who opens what is closed and grants victory.",
  ],
  [
    "al-alim",
    "الْعَلِيم",
    "Al-'Alim",
    "The All-Knowing",
    "The One whose knowledge encompasses everything.",
  ],
  [
    "al-qabid",
    "الْقَابِض",
    "Al-Qabid",
    "The Withholder",
    "The One who withholds provision by His wisdom.",
  ],
  [
    "al-basit",
    "الْبَاسِط",
    "Al-Basit",
    "The Extender",
    "The One who extends provision and mercy generously.",
  ],
  [
    "al-khafid",
    "الْخَافِض",
    "Al-Khafid",
    "The Abaser",
    "The One who lowers the arrogant and disbelieving.",
  ],
  ["ar-rafi", "الرَّافِع", "Ar-Rafi'", "The Exalter", "The One who raises the humble and faithful."],
  [
    "al-muizz",
    "الْمُعِزّ",
    "Al-Mu'izz",
    "The Bestower of Honour",
    "The One who honours and strengthens whom He wills.",
  ],
  [
    "al-mudhill",
    "الْمُذِلّ",
    "Al-Mudhill",
    "The Humiliator",
    "The One who abases whom He wills by His justice.",
  ],
  [
    "as-sami",
    "السَّمِيع",
    "As-Sami'",
    "The All-Hearing",
    "The One who hears all, secret and manifest.",
  ],
  [
    "al-basir",
    "الْبَصِير",
    "Al-Basir",
    "The All-Seeing",
    "The One who sees all things without limit.",
  ],
  [
    "al-hakam",
    "الْحَكَم",
    "Al-Hakam",
    "The Judge",
    "The Arbitrator whose judgement none can overturn.",
  ],
  [
    "al-adl",
    "الْعَدْل",
    "Al-'Adl",
    "The Utterly Just",
    "The One who is perfectly just in all He does.",
  ],
  [
    "al-latif",
    "اللَّطِيف",
    "Al-Latif",
    "The Subtle",
    "The Gentle One, kind and aware of the finest matters.",
  ],
  [
    "al-khabir",
    "الْخَبِير",
    "Al-Khabir",
    "The All-Aware",
    "The One acquainted with the reality of everything.",
  ],
  [
    "al-halim",
    "الْحَلِيم",
    "Al-Halim",
    "The Forbearing",
    "The One who is patient and does not hasten to punish.",
  ],
  [
    "al-azim",
    "الْعَظِيم",
    "Al-'Azim",
    "The Magnificent",
    "The One of absolute greatness and majesty.",
  ],
  ["al-ghafur", "الْغَفُور", "Al-Ghafur", "The Forgiving", "The One who forgives abundantly."],
  [
    "ash-shakur",
    "الشَّكُور",
    "Ash-Shakur",
    "The Appreciative",
    "The One who rewards small good deeds greatly.",
  ],
  ["al-aliyy", "الْعَلِيّ", "Al-'Aliyy", "The Most High", "The One exalted above all creation."],
  [
    "al-kabir",
    "الْكَبِير",
    "Al-Kabir",
    "The Most Great",
    "The One greater than everything in majesty.",
  ],
  [
    "al-hafiz",
    "الْحَفِيظ",
    "Al-Hafiz",
    "The Preserver",
    "The One who protects and preserves all things.",
  ],
  [
    "al-muqit",
    "الْمُقِيت",
    "Al-Muqit",
    "The Sustainer",
    "The One who nourishes and maintains all creatures.",
  ],
  [
    "al-hasib",
    "الْحَسِيب",
    "Al-Hasib",
    "The Reckoner",
    "The One who is sufficient and takes account of all.",
  ],
  ["al-jalil", "الْجَلِيل", "Al-Jalil", "The Majestic", "The One of true majesty and greatness."],
  [
    "al-karim",
    "الْكَرِيم",
    "Al-Karim",
    "The Most Generous",
    "The One of endless generosity and nobility.",
  ],
  ["ar-raqib", "الرَّقِيب", "Ar-Raqib", "The Watchful", "The One who watches over and observes all."],
  [
    "al-mujib",
    "الْمُجِيب",
    "Al-Mujib",
    "The Responsive",
    "The One who answers the call of those who ask.",
  ],
  [
    "al-wasi",
    "الْوَاسِع",
    "Al-Wasi'",
    "The All-Encompassing",
    "The Vast One whose knowledge and mercy have no bounds.",
  ],
  [
    "al-hakim",
    "الْحَكِيم",
    "Al-Hakim",
    "The All-Wise",
    "The One perfect in wisdom in all He decrees.",
  ],
  [
    "al-wadud",
    "الْوَدُود",
    "Al-Wadud",
    "The Loving",
    "The One loving to His servants and beloved to the righteous.",
  ],
  ["al-majid", "الْمَجِيد", "Al-Majid", "The Most Glorious", "The One of perfect glory and honour."],
  [
    "al-baith",
    "الْبَاعِث",
    "Al-Ba'ith",
    "The Resurrector",
    "The One who raises the dead to life on Judgement Day.",
  ],
  ["ash-shahid", "الشَّهِيد", "Ash-Shahid", "The Witness", "The One who witnesses all that happens."],
  [
    "al-haqq",
    "الْحَقّ",
    "Al-Haqq",
    "The Truth",
    "The One whose being and reality are absolute truth.",
  ],
  [
    "al-wakil",
    "الْوَكِيل",
    "Al-Wakil",
    "The Trustee",
    "The One entrusted with the affairs of all creation.",
  ],
  [
    "al-qawiyy",
    "الْقَوِيّ",
    "Al-Qawiyy",
    "The Most Strong",
    "The One of complete and perfect strength.",
  ],
  ["al-matin", "الْمَتِين", "Al-Matin", "The Firm", "The Steadfast One whose strength never wavers."],
  [
    "al-waliyy",
    "الْوَلِيّ",
    "Al-Waliyy",
    "The Protecting Friend",
    "The Ally and guardian of the believers.",
  ],
  ["al-hamid", "الْحَمِيد", "Al-Hamid", "The Praiseworthy", "The One deserving of all praise."],
  [
    "al-muhsi",
    "الْمُحْصِي",
    "Al-Muhsi",
    "The Enumerator",
    "The One who records and counts all things.",
  ],
  [
    "al-mubdi",
    "الْمُبْدِئ",
    "Al-Mubdi'",
    "The Originator",
    "The One who begins creation without precedent.",
  ],
  [
    "al-muid",
    "الْمُعِيد",
    "Al-Mu'id",
    "The Restorer",
    "The One who brings creation back after its end.",
  ],
  [
    "al-muhyi",
    "الْمُحْيِي",
    "Al-Muhyi",
    "The Giver of Life",
    "The One who grants life to all living things.",
  ],
  [
    "al-mumit",
    "الْمُمِيت",
    "Al-Mumit",
    "The Bringer of Death",
    "The One who ordains death for the living.",
  ],
  ["al-hayy", "الْحَيّ", "Al-Hayy", "The Ever-Living", "The One who lives eternally without end."],
  [
    "al-qayyum",
    "الْقَيُّوم",
    "Al-Qayyum",
    "The Self-Subsisting",
    "The One who sustains all while needing none.",
  ],
  [
    "al-wajid",
    "الْوَاجِد",
    "Al-Wajid",
    "The Perceiver",
    "The One who lacks nothing and finds whatever He wills.",
  ],
  [
    "al-maajid",
    "الْمَاجِد",
    "Al-Majid",
    "The Noble",
    "The Illustrious One, abundant in glory and generosity.",
  ],
  ["al-wahid", "الْوَاحِد", "Al-Wahid", "The One", "The One without partner or equal."],
  ["al-ahad", "الْأَحَد", "Al-Ahad", "The Indivisible", "The Unique One, single in His essence."],
  [
    "as-samad",
    "الصَّمَد",
    "As-Samad",
    "The Eternal",
    "The Self-Sufficient One whom all creation needs.",
  ],
  ["al-qadir", "الْقَادِر", "Al-Qadir", "The Able", "The One with full power over all things."],
  [
    "al-muqtadir",
    "الْمُقْتَدِر",
    "Al-Muqtadir",
    "The Powerful",
    "The One who prevails and determines all.",
  ],
  [
    "al-muqaddim",
    "الْمُقَدِّم",
    "Al-Muqaddim",
    "The Expediter",
    "The One who brings forward whom He wills.",
  ],
  [
    "al-muakhkhir",
    "الْمُؤَخِّر",
    "Al-Mu'akhkhir",
    "The Delayer",
    "The One who postpones whom He wills by His wisdom.",
  ],
  ["al-awwal", "الْأَوَّل", "Al-Awwal", "The First", "The One before all things, without beginning."],
  ["al-akhir", "الْآخِر", "Al-Akhir", "The Last", "The One after all things, without end."],
  [
    "az-zahir",
    "الظَّاهِر",
    "Az-Zahir",
    "The Manifest",
    "The One evident above all through His signs.",
  ],
  [
    "al-batin",
    "الْبَاطِن",
    "Al-Batin",
    "The Hidden",
    "The One nearer than all yet beyond perception.",
  ],
  ["al-wali", "الْوَالِي", "Al-Wali", "The Governor", "The One who owns and manages all affairs."],
  [
    "al-mutaali",
    "الْمُتَعَالِي",
    "Al-Muta'ali",
    "The Most Exalted",
    "The One far above every limitation.",
  ],
  [
    "al-barr",
    "الْبَرّ",
    "Al-Barr",
    "The Source of Goodness",
    "The Kind One, ever gentle and beneficent.",
  ],
  [
    "at-tawwab",
    "التَّوَّاب",
    "At-Tawwab",
    "The Ever-Relenting",
    "The One who accepts repentance again and again.",
  ],
  [
    "al-muntaqim",
    "الْمُنْتَقِم",
    "Al-Muntaqim",
    "The Avenger",
    "The One who justly requites the persistent wrongdoer.",
  ],
  [
    "al-afuww",
    "الْعَفُوّ",
    "Al-'Afuww",
    "The Pardoner",
    "The One who effaces sins and pardons freely.",
  ],
  ["ar-rauf", "الرَّءُوف", "Ar-Ra'uf", "The Most Kind", "The One full of compassion and tenderness."],
  [
    "malik-ul-mulk",
    "مَالِكُ الْمُلْك",
    "Malik-ul-Mulk",
    "Owner of All Sovereignty",
    "The Owner of all dominion who bestows it as He wills.",
  ],
  [
    "dhul-jalali-wal-ikram",
    "ذُو الْجَلَالِ وَالْإِكْرَام",
    "Dhul-Jalali wal-Ikram",
    "Lord of Majesty and Bounty",
    "The Possessor of majesty, honour, and generosity.",
  ],
  ["al-muqsit", "الْمُقْسِط", "Al-Muqsit", "The Equitable", "The One who acts with perfect fairness."],
  [
    "al-jami",
    "الْجَامِع",
    "Al-Jami'",
    "The Gatherer",
    "The One who assembles all creation on Judgement Day.",
  ],
  ["al-ghaniyy", "الْغَنِيّ", "Al-Ghaniyy", "The Self-Sufficient", "The Rich One in need of nothing."],
  [
    "al-mughni",
    "الْمُغْنِي",
    "Al-Mughni",
    "The Enricher",
    "The One who enriches and satisfies His servants.",
  ],
  [
    "al-mani",
    "الْمَانِع",
    "Al-Mani'",
    "The Preventer",
    "The One who withholds by His wisdom to protect.",
  ],
  ["ad-darr", "الضَّارّ", "Ad-Darr", "The Distresser", "The One who can allow harm by His decree."],
  ["an-nafi", "النَّافِع", "An-Nafi'", "The Benefactor", "The One who is the source of all benefit."],
  ["an-nur", "النُّور", "An-Nur", "The Light", "The One who illuminates the heavens and the earth."],
  ["al-hadi", "الْهَادِي", "Al-Hadi", "The Guide", "The One who guides His servants to the truth."],
  [
    "al-badi",
    "الْبَدِيع",
    "Al-Badi'",
    "The Incomparable Originator",
    "The One who creates in unprecedented ways.",
  ],
  [
    "al-baqi",
    "الْبَاقِي",
    "Al-Baqi",
    "The Everlasting",
    "The One who remains after all else perishes.",
  ],
  [
    "al-warith",
    "الْوَارِث",
    "Al-Warith",
    "The Inheritor",
    "The One to whom all returns after creation ends.",
  ],
  [
    "ar-rashid",
    "الرَّشِيد",
    "Ar-Rashid",
    "The Guide to the Right Path",
    "The One who directs all to their right course.",
  ],
  [
    "as-sabur",
    "الصَّبُور",
    "As-Sabur",
    "The Patient",
    "The One who is patient and never acts in haste.",
  ],
];

function esc(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function render(audioMap, translationMaps) {
  const lines = NAMES.map(([id, arabic, transliteration, translation, meaning], index) => {
    const file = audioMap[index + 1];
    const audioLine = file ? [`    audioUri: "${AUDIO_CDN}/${esc(file)}",`] : [];
    const n = normalizeArabic(arabic);
    const translations = {};
    for (const [locale, map] of Object.entries(translationMaps)) {
      const text = map.get(n)?.trim();
      if (text) translations[locale] = text;
    }
    const translationsLine =
      Object.keys(translations).length > 0
        ? [`    translations: ${JSON.stringify(translations)},`]
        : [];
    return [
      "  {",
      `    id: "${esc(id)}",`,
      `    arabic: "${esc(arabic)}",`,
      `    transliteration: "${esc(transliteration)}",`,
      `    translation: "${esc(translation)}",`,
      `    meaning: "${esc(meaning)}",`,
      ...translationsLine,
      ...audioLine,
      "  },",
    ].join("\n");
  });

  return `import type { NameOfAllah } from "../types/index";

export const NAMES_CONTENT_VERSION = 5;

/**
 * The 99 names of Allah (Asma-ul-Husna), following the standard Tirmidhi
 * enumeration. Arabic is preserved verbatim; transliterations and meanings
 * follow widely published renderings.
 *
 * Generated by apps/app/scripts/build-data/build-names.mjs — do not edit by hand.
 */
export const NAMES_OF_ALLAH: NameOfAllah[] = [
${lines.join("\n")}
];
`;
}

export async function buildNames() {
  const ids = new Set(NAMES.map((n) => n[0]));
  if (ids.size !== NAMES.length) throw new Error("[names] duplicate id detected");
  if (NAMES.length !== 99) throw new Error(`[names] expected 99 names, got ${NAMES.length}`);

  const audioMap = await fetchNameAudioMap();
  const translationMaps = await fetchNameTranslationMaps();
  const withAudio = Object.keys(audioMap).length;
  const withId = NAMES.filter(([_, arabic]) =>
    translationMaps.id.has(normalizeArabic(arabic)),
  ).length;
  const withMs = NAMES.filter(([_, arabic]) =>
    translationMaps.ms.has(normalizeArabic(arabic)),
  ).length;
  const withFr = NAMES.filter(([_, arabic]) =>
    translationMaps.fr.has(normalizeArabic(arabic)),
  ).length;
  const withUr = NAMES.filter(([_, arabic]) =>
    translationMaps.ur.has(normalizeArabic(arabic)),
  ).length;
  const withBn = NAMES.filter(([_, arabic]) =>
    translationMaps.bn.has(normalizeArabic(arabic)),
  ).length;

  const outPath = join(SHARED_CONTENT_DIR, "names.ts");
  await writeFileStable(outPath, render(audioMap, translationMaps));
  console.log(
    `  names.ts → ${NAMES.length} names (${withAudio} with audio; id:${withId} ms:${withMs} fr:${withFr} ur:${withUr} bn:${withBn})`,
  );

  return [
    await datasetEntry({
      id: "names-99",
      kind: "content",
      version: 5,
      absFiles: [outPath],
      license: "Text: public domain (classical). Audio: streamed, © reciter.",
      attribution:
        "Asma-ul-Husna — standard Tirmidhi enumeration. Audio via ProgrammerHasan. id: olipiskandar gist; ms: adiman-dev/islamic-json; fr: KabDeveloper/99-Names-Of-Allah; ur/bn: asmaul-husna-api-coral.",
      sourceUrl: "https://sunnah.com/tirmidhi:3507",
    }),
  ];
}
