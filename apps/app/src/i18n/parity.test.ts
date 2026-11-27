import { APP_LOCALE_CODES, isScriptureMeaningCatalogKey } from "@munib-tracker/shared/i18n";
import en from "./en.json";

type Json = Record<string, unknown>;

/** Leaf paths; arrays count as one leaf (i18next `returnObjects` lists). */
function flattenKeys(obj: Json, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...flattenKeys(value as Json, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

/** Leaf paths with array elements addressed by index (`zakat.quran.0.excerpt`). */
function deepLeafKeys(obj: unknown, prefix = "", out: string[] = []): string[] {
  if (obj !== null && typeof obj === "object") {
    for (const [key, value] of Object.entries(obj as Json)) {
      deepLeafKeys(value, prefix ? `${prefix}.${key}` : key, out);
    }
  } else if (prefix) {
    out.push(prefix);
  }
  return out;
}

const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;
const enKeys = flattenKeys(en as Json);
const enKeySet = new Set(enKeys);
const enPluralBases = new Set(
  enKeys.filter((k) => PLURAL_SUFFIX.test(k)).map((k) => k.replace(PLURAL_SUFFIX, "")),
);

const catalogs: Array<[string, Json]> = APP_LOCALE_CODES.filter((code) => code !== "en").map(
  (code) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const catalog = require(`./${code}.json`) as Json;
    return [code, catalog];
  },
);

describe("i18n catalog parity", () => {
  it.each(catalogs)("%s has every key present in en", (name, catalog) => {
    const localeKeys = new Set(flattenKeys(catalog));
    // D45: scripture meaning keys are en-only — other locales fall back to the labelled English.
    const missing = enKeys.filter(
      (key) => !localeKeys.has(key) && !isScriptureMeaningCatalogKey(key),
    );

    expect({ locale: name, missing }).toEqual({ locale: name, missing: [] });
  });

  // Orphans are keys removed/renamed in en (or `a[0].b` bracket paths) that linger in a locale.
  // `apply-patch-i18n.mjs` prunes them; this fails if one is reintroduced by hand or by a script.
  it.each(catalogs)("%s has no orphan keys that are absent from en", (name, catalog) => {
    const orphans = flattenKeys(catalog).filter(
      (key) =>
        !enKeySet.has(key) &&
        !(PLURAL_SUFFIX.test(key) && enPluralBases.has(key.replace(PLURAL_SUFFIX, ""))),
    );

    expect({ locale: name, orphans }).toEqual({ locale: name, orphans: [] });
  });

  // D45: never AI-translated scripture — the meaning comes from a dataset or is the labelled English.
  it.each(catalogs)("%s carries no scripture meaning text (D45)", (name, catalog) => {
    const scripture = deepLeafKeys(catalog).filter(isScriptureMeaningCatalogKey);

    expect({ locale: name, scripture }).toEqual({ locale: name, scripture: [] });
  });
});
