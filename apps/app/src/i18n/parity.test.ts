import { APP_LOCALE_CODES } from "@munib-tracker/shared/i18n";
import en from "./en.json";

type Json = Record<string, unknown>;

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
    const missing = enKeys.filter((key) => !localeKeys.has(key));

    expect({ locale: name, missing }).toEqual({ locale: name, missing: [] });
  });
});
