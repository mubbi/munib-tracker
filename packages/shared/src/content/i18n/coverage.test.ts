import { describe, expect, it } from "vitest";
import * as content from "../index";
import * as overlays from "./all-overlays";
import { PROTECTED_CONTENT_KEYS } from "./localize";
import { parseOverlayExportName } from "./overlay-locale";

const OMITTED_KEYS = new Set([
  ...PROTECTED_CONTENT_KEYS,
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

describe("Learn content translation overlays", () => {
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
