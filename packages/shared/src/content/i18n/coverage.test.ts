import { describe, expect, it } from "vitest";
import { SCRIPTURE_MEANING_CONTENT_KEYS } from "../../i18n/scripture-meaning";
import * as content from "../index";
import * as overlays from "./all-overlays";
import { PROTECTED_CONTENT_KEYS } from "./localize";
import { parseOverlayExportName } from "./overlay-locale";

const OMITTED_KEYS = new Set([
  ...PROTECTED_CONTENT_KEYS,
  /** D45: scripture meaning text is never translated in overlays (dataset or labelled English). */
  ...SCRIPTURE_MEANING_CONTENT_KEYS,
  "label",
  "transliteration",
  "arabic",
  "reference",
  "topicId",
  "topicIds",
  "icon",
  "iconName",
  "color",
  "tone",
  "image",
  "audio",
  "emoji",
  "prophetId",
  "battleId",
  "battles",
  "type",
  "verseLabel",
  "examples",
  /** Structural filter tags on Sahaba / history — not literary copy. */
  "categories",
  "era",
  "arabicName",
  "sources",
  "certainty",
  "branch",
  "parentId",
  "siblingOf",
]);

const hasLatin = (s: string) => /[A-Za-z]/.test(s);
const hasArabic = (s: string) => /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/.test(s);
const isKeptArabic = (s: string) => hasArabic(s) && !hasLatin(s);

const EXCLUDED_BASES = new Set(["PROPHETS_TOPICS"]);

const contentBag = content as Record<string, unknown>;
const overlayBag = overlays as Record<string, unknown>;

/** Group overlay exports by base key → locale → value. */
const grouped = new Map<string, Map<string, unknown>>();

for (const exportName of Object.keys(overlayBag)) {
  const parsed = parseOverlayExportName(exportName);
  if (!parsed) continue;
  const { baseKey, locale } = parsed;
  if (!grouped.has(baseKey)) grouped.set(baseKey, new Map());
  grouped.get(baseKey)?.set(locale, overlayBag[exportName]);
}

const pairs = [...grouped.entries()]
  .map(([baseKey, byLocale]) => ({
    baseKey,
    base: contentBag[baseKey],
    byLocale,
  }))
  .filter((p) => p.base !== undefined && !EXCLUDED_BASES.has(p.baseKey));

function countTranslatedStrings(base: unknown, overlay: unknown): { total: number; done: number } {
  let total = 0;
  let done = 0;
  const walk = (b: unknown, o: unknown) => {
    if (typeof b === "string") {
      if (isKeptArabic(b)) return;
      total += 1;
      if (typeof o === "string" && o.trim().length > 0) done += 1;
      return;
    }
    if (Array.isArray(b)) {
      b.forEach((item, i) => {
        walk(item, Array.isArray(o) ? o[i] : undefined);
      });
      return;
    }
    if (b && typeof b === "object") {
      const oo = (o && typeof o === "object" ? o : {}) as Record<string, unknown>;
      for (const k of Object.keys(b as Record<string, unknown>)) {
        if (OMITTED_KEYS.has(k)) continue;
        walk((b as Record<string, unknown>)[k], oo[k]);
      }
    }
  };
  walk(base, overlay);
  return { total, done };
}

/** Every object key path inside an overlay value (for the D45 guard). */
function findScriptureKeys(value: unknown, path: string, out: string[]): string[] {
  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      findScriptureKeys(item, `${path}[${i}]`, out);
    });
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (SCRIPTURE_MEANING_CONTENT_KEYS.has(k)) out.push(`${path}.${k}`);
      findScriptureKeys(v, `${path}.${k}`, out);
    }
  }
  return out;
}

describe("Learn content translation overlays", () => {
  it("carry no scripture meaning text (D45 — dataset translation or labelled English only)", () => {
    const offenders: string[] = [];
    for (const [exportName, value] of Object.entries(overlayBag)) {
      if (!parseOverlayExportName(exportName)) continue;
      findScriptureKeys(value, exportName, offenders);
    }
    expect(offenders.slice(0, 20)).toEqual([]);
  });

  it("covers every area that has an overlay stub", () => {
    expect(pairs.length).toBeGreaterThan(10);
  });

  for (const { baseKey, base, byLocale } of pairs) {
    describe(baseKey, () => {
      it("has ur and ar overlays", () => {
        expect(byLocale.get("ur"), `${baseKey}_UR missing`).toBeDefined();
        expect(byLocale.get("ar"), `${baseKey}_AR missing`).toBeDefined();
      });

      if (Array.isArray(base)) {
        for (const [locale, overlay] of byLocale) {
          it(`overlay ${locale} does not exceed English array length`, () => {
            expect((overlay as unknown[]).length).toBeLessThanOrEqual(base.length);
          });
        }
      }

      for (const [locale, overlay] of byLocale) {
        if (locale === "en") continue;
        it(`is ≥90% translated in ${locale}`, () => {
          const { total, done } = countTranslatedStrings(base, overlay);
          const ratio = total === 0 ? 1 : done / total;
          expect(ratio, `${baseKey} ${locale} coverage ${done}/${total}`).toBeGreaterThanOrEqual(
            0.9,
          );
        });
      }
    });
  }
});
