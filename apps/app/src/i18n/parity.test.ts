import ar from "./ar.json";
import en from "./en.json";
import ur from "./ur.json";

type Json = Record<string, unknown>;

/**
 * Flattens a nested translation catalog into dot-delimited leaf keys, e.g.
 * `{ search: { cat: { quran: "…" } } }` → `["search.cat.quran"]`. Only leaf
 * string keys are collected so the comparison is structural, not value-based.
 */
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

const enKeys = flattenKeys(en as Json);

describe("i18n catalog parity", () => {
  const catalogs: Array<[string, Json]> = [
    ["ar", ar as Json],
    ["ur", ur as Json],
  ];

  it.each(catalogs)("%s has every key present in en", (name, catalog) => {
    const localeKeys = new Set(flattenKeys(catalog));
    const missing = enKeys.filter((key) => !localeKeys.has(key));

    expect({ locale: name, missing }).toEqual({ locale: name, missing: [] });
  });
});
