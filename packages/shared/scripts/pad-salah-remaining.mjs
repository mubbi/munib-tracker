import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { transformSync } from "esbuild";

const i18nDir = "packages/shared/src/content/i18n";
const locales = ["az", "bn", "kk", "ku", "ky", "ps", "tg", "tk"];

const TAYAMMUM_EN = {
  title: "Tayammum — dry purification",
  summary: "When water cannot be used, clean earth lifts impurity so prayer is not delayed.",
  body: [
    "Tayammum is the dry purification Allah legislated when water is genuinely unavailable, or when using it would cause harm because of illness or severe cold. It is not a lesser workaround for convenience — it is a complete substitute that lifts minor or major impurity for prayer until water can be used again.",
    "The Qur'an names it in the same verse as wudu and ghusl (5:6): wipe the face and hands with clean earth after striking it. The Prophet ﷺ taught the companions this concession as mercy, not as a loophole to skip searching for water when it is reasonably available.",
    "Practically: intend tayammum, say Bismillah, strike clean earth once (or twice according to some schools), wipe the face, then wipe the hands to the wrists (many scholars include up to the elbows in continuity with wudu). What breaks wudu or ghusl also ends the corresponding tayammum; finding usable water ends the concession and you return to ordinary purification.",
    "If you prayed validly with tayammum and only found water afterward, the majority hold that the completed prayer need not be repeated. If water appears before you pray, you must use it. For casts, wounds, and illness, combine wiping over dressings with tayammum as your school and doctor advise — see the full Taharah guide for detail.",
  ],
  steps: [
    {
      title: "Confirm the need",
      body: "Search reasonably for usable water, or confirm that using water would harm you (illness, severe cold, medical advice).",
    },
    {
      title: "Intention & Bismillah",
      body: "Intend tayammum in place of wudu or ghusl, and begin with Bismillah.",
      transliteration: "Bismillah",
    },
    {
      title: "Strike clean earth",
      body: "Strike clean earth (or a clean dusty surface) with both hands once — some schools strike twice.",
    },
    {
      title: "Wipe the face",
      body: "Wipe the entire face with the dust remaining on the hands.",
    },
    {
      title: "Wipe the hands",
      body: "Wipe the hands — at minimum to the wrists; many scholars wipe to the elbows.",
    },
  ],
  quran: [
    {
      excerpt:
        "…and you find no water, then perform tayammum with clean earth and wipe your faces and your hands with it.",
    },
  ],
  hadith: [
    {
      excerpt:
        "Reported in the chapters of tayammum: the concession to purify with clean earth in the absence of usable water.",
    },
  ],
  actions: [
    "Know when tayammum applies before travel or illness so prayer is never skipped for lack of water.",
    "Open the full Taharah tayammum lessons for school differences on striking and wiping.",
  ],
  disclaimer:
    "Schools differ on details (one strike vs two, wrists vs elbows, renewing per prayer). This is a mainstream educational summary — follow reliable local scholarship for your practice.",
};

function loadExport(filePath, exportName) {
  let src = readFileSync(filePath, "utf8");
  src = src.replace(/^import\s+[\s\S]*?;\s*$/gm, "");
  src = src.replace(/:\s*DeepPartial<[^>]+>\[\]/g, "");
  const { code } = transformSync(src, { loader: "ts", format: "cjs", target: "es2020" });
  const module = { exports: {} };
  new Function("exports", "module", "require", code)(module.exports, module, () => ({}));
  return module.exports[exportName];
}

for (const locale of locales) {
  const path = join(i18nDir, `salah-guide.${locale}.ts`);
  const exportName = `SALAH_GUIDE_TOPICS_${locale.toUpperCase()}`;
  const arr = loadExport(path, exportName);
  if (!Array.isArray(arr)) {
    console.log(locale, "no array");
    continue;
  }
  if (arr.some((t) => /tayammum|تيمم|تیمم/i.test(t?.title ?? ""))) {
    console.log(locale, "already");
    continue;
  }
  const insertAt = 7;
  const next = [...arr.slice(0, insertAt), TAYAMMUM_EN, ...arr.slice(insertAt)];
  const src = readFileSync(path, "utf8");
  const marker = `export const ${exportName}`;
  const start = src.indexOf(marker);
  const eq = src.indexOf("=", start);
  const arrStart = src.indexOf("[", eq);
  let depth = 0;
  let end = -1;
  for (let i = arrStart; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const header = src.slice(0, arrStart + 1);
  const after = src.slice(end + 1);
  const items = next
    .map((item) =>
      JSON.stringify(item, null, 2)
        .replace(/^/gm, "  ")
        .replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, "$1:"),
    )
    .join(",\n");
  writeFileSync(path, `${header}\n${items}\n]${after}`, "utf8");
  console.log("padded", locale, "->", next.length);
}
