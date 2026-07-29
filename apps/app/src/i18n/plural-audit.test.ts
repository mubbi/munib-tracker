import ar from "./ar.json";
import bn from "./bn.json";
import en from "./en.json";
import ru from "./ru.json";

const PLURAL_LOCALES = [
  { code: "ar", catalog: ar as Record<string, unknown> },
  { code: "ru", catalog: ru as Record<string, unknown> },
  { code: "bn", catalog: bn as Record<string, unknown> },
] as const;

/** Sample counts that exercise every CLDR plural category per locale. */
const PROBE_COUNTS = [0, 1, 2, 3, 4, 5, 11, 12, 21, 22, 25, 100, 101, 103, 1000];

function flattenKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...flattenKeys(value as Record<string, unknown>, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

function pluralStems(catalog: Record<string, unknown>): string[] {
  const stems = new Set<string>();
  for (const key of flattenKeys(catalog)) {
    const match = key.match(/^(.*)_(zero|one|two|few|many|other)$/);
    if (match?.[1]) stems.add(match[1]);
  }
  return [...stems].sort();
}

function requiredCategories(locale: string): string[] {
  const pr = new Intl.PluralRules(locale);
  const categories = new Set<string>();
  for (const n of PROBE_COUNTS) categories.add(pr.select(n));
  return [...categories].sort();
}

function getNested(catalog: Record<string, unknown>, dottedKey: string): unknown {
  return dottedKey.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, catalog);
}

describe("ICU plural key coverage (ar, ru, bn)", () => {
  const enStems = pluralStems(en as Record<string, unknown>);

  for (const { code, catalog } of PLURAL_LOCALES) {
    it(`${code} has required plural suffixes for every English plural stem`, () => {
      const needed = requiredCategories(code);
      const missing: string[] = [];
      for (const stem of enStems) {
        for (const category of needed) {
          const key = `${stem}_${category}`;
          const value = getNested(catalog, key);
          if (typeof value !== "string" || value.trim().length === 0) {
            missing.push(key);
          }
        }
      }
      if (missing.length > 0) {
        throw new Error(`missing ${code} plural keys: ${missing.join(", ")}`);
      }
      expect(missing).toEqual([]);
    });
  }
});
