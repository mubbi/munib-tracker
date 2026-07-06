import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import ar from "./ar.json";
import en from "./en.json";
import ur from "./ur.json";

/**
 * i18n guard rails. These tests fail the build whenever new features or content
 * updates introduce the recurring localization problems we keep having to hand-
 * fix: inconsistent Islamic terminology in the English source, translation keys
 * referenced in code but missing from the catalog, English words left inside an
 * Urdu/Arabic value, mismatched interpolation variables, or empty translations.
 *
 * When a check fails, the message lists exactly which keys to fix. See the
 * "Internationalization" section of `apps/app/AGENTS.md` for the rules.
 */

type Json = Record<string, unknown>;

function walk(obj: unknown, prefix = ""): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj as Json)) {
      out.push(...walk(v, prefix ? `${prefix}.${k}` : k));
    }
  } else if (typeof obj === "string") {
    out.push([prefix, obj]);
  }
  return out;
}

function get(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Json)[key];
    return undefined;
  }, obj);
}

const interpVars = (s: string): string[] => [...new Set(s.match(/\{\{[^}]+\}\}/g) ?? [])].sort();

const enLeaves = walk(en);

// ---------------------------------------------------------------------------
// 1. Standardized Islamic terminology in the ENGLISH source.
//    Left = banned spelling, value = the one canonical spelling to use.
//    Keep this in sync with AGENTS.md.
// ---------------------------------------------------------------------------
const BANNED_TERMS: Array<{ re: RegExp; use: string }> = [
  { re: /\bdhikr\b/i, use: "zikr" },
  { re: /\bazan\b/i, use: "adhan" },
  { re: /\broza\b/i, use: "fasting" },
  { re: /\bnamaz\b/i, use: "salah" },
  { re: /\bmosque\b/i, use: "masjid" },
  { re: /\btasbih\b/i, use: "tasbeeh" },
  { re: /\bqad(a|ha)\b/i, use: "qaza" },
  { re: /\bdu['’]a\b/i, use: "dua" },
];

describe("i18n terminology (English source)", () => {
  it("uses standardized Islamic transliterations", () => {
    const offenders: string[] = [];
    for (const [path, value] of enLeaves) {
      // `prayerInfo.*` is long-form educational prose that intentionally keeps
      // proper compound terms (e.g. "Salat al-Wusta") — exempt it.
      if (path.startsWith("prayerInfo.")) continue;
      for (const { re, use } of BANNED_TERMS) {
        if (re.test(value)) offenders.push(`${path}: use "${use}" — "${value.slice(0, 70)}"`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('uses "Salah" (not a bare "Prayer"/"Prayers" label)', () => {
    // Discrete labels must read "Salah"; "prayer(s)" is only allowed mid-sentence.
    const offenders = enLeaves
      .filter(([, v]) => /^Prayers?$/.test(v))
      .map(([p, v]) => `${p}: "${v}"`);
    expect(offenders).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 2. Every string t("literal") reference in the code must exist in en.json.
//    Catches wrong-namespace keys (e.g. home.nextIn vs hero.nextIn) that a
//    default-value t(key, fallback) call would silently hide as English.
// ---------------------------------------------------------------------------
const PLURAL_SUFFIXES = ["", "_zero", "_one", "_two", "_few", "_many", "_other"];
const keyExists = (key: string): boolean =>
  PLURAL_SUFFIXES.some((s) => {
    const v = get(en, key + s);
    return typeof v === "string" || Array.isArray(v);
  });

function collectSourceKeys(dir: string, acc = new Map<string, string>()): Map<string, string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!/node_modules|__tests__|test-support/.test(full)) collectSourceKeys(full, acc);
    } else if (/\.(tsx?|ts)$/.test(entry.name) && !/\.test\.|\.d\.ts$/.test(entry.name)) {
      const src = readFileSync(full, "utf8");
      const re = /\bt\(\s*[`"]([a-zA-Z0-9_.]+)[`"]/g;
      let m: RegExpExecArray | null;
      // biome-ignore lint/suspicious/noAssignInExpressions: standard regex loop
      while ((m = re.exec(src)) !== null) {
        if (!acc.has(m[1])) acc.set(m[1], full);
      }
    }
  }
  return acc;
}

describe("i18n key coverage", () => {
  it('has an en.json entry for every t("literal") used in the code', () => {
    const srcRoot = join(__dirname, "..");
    const referenced = collectSourceKeys(srcRoot);
    const missing = [...referenced.entries()]
      .filter(([key]) => !keyExists(key))
      .map(([key, file]) => `${key} <- ${file.replace(/.*[\\/]src[\\/]/, "src/")}`);
    expect(missing).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 3. Translation quality: no leaked English words, matching interpolation
//    variables, no empty values.
// ---------------------------------------------------------------------------
// Key paths whose values legitimately contain Latin script (formats, brand/URL).
const LATIN_OK_KEYS =
  /appName|authorValue|placeholder|[Tt]ransliteration|brandDua|\.email|\.url|version|formatHint|importSub|sourceNote|methods\.|footer$|iosPwa|webUseAllow|permissionDismissed|expoGoMessage|webGrantedMobileNote|webLimited|installBannerMessage|installStepsViaSafari|installLinkCopied|installCopyLink|downloadIos|downloadAndroid|proofIos|proofAndroid|proofQr/;
// Proper nouns / acronyms that stay in Latin even in Urdu/Arabic. Extend as needed.
const LATIN_OK_WORDS = new Set(
  "Munib Tracker Open Meteo MET Norway Google Apple Facebook Safari iOS Android PWA GPS Allah Sahih Hasan iPhone Share Home Screen Expo JSON CSV ISNA MWL address Kiwifu adhan Umm Qura Karachi Tehran Muslim World League Egyptian Authority Gulf Region Turkey Diyanet".split(
    " ",
  ),
);

describe.each([
  ["ur", ur],
  ["ar", ar],
])("i18n translation quality (%s)", (name, catalog) => {
  it("has no leaked English words", () => {
    const offenders: string[] = [];
    for (const [path, value] of walk(catalog)) {
      if (LATIN_OK_KEYS.test(path)) continue;
      const stripped = value.replace(/\{\{[^}]+\}\}/g, "");
      const words = (stripped.match(/[A-Za-z]{4,}/g) ?? []).filter((w) => !LATIN_OK_WORDS.has(w));
      if (words.length) offenders.push(`${path}: ${words.join(", ")} — "${value.slice(0, 60)}"`);
    }
    expect(offenders).toEqual([]);
  });

  it("matches the interpolation {{variables}} of the English source", () => {
    const offenders: string[] = [];
    for (const [path, value] of enLeaves) {
      // Singular plural forms may naturally drop {{count}} ("one prayer").
      if (/_(one|zero)$/.test(path)) continue;
      const localized = get(catalog, path);
      if (typeof localized !== "string") continue;
      const a = interpVars(value);
      const b = interpVars(localized);
      if (a.length !== b.length || a.some((x, i) => x !== b[i])) {
        offenders.push(`${path}: en ${JSON.stringify(a)} vs ${name} ${JSON.stringify(b)}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("has no empty translation values", () => {
    const offenders: string[] = [];
    for (const [path] of enLeaves) {
      const v = get(catalog, path);
      if (v !== undefined && (typeof v !== "string" || v.trim() === "")) offenders.push(path);
    }
    expect(offenders).toEqual([]);
  });
});
