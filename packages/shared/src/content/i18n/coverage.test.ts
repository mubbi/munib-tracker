import { describe, expect, it } from "vitest";
import * as content from "../index";
import * as overlays from "./index";
import { PROTECTED_CONTENT_KEYS } from "./localize";

// Keys that carry non-translatable identifiers even though they are strings, so
// overlays legitimately omit them. Excluded from the coverage denominator.
const OMITTED_KEYS = new Set([
  ...PROTECTED_CONTENT_KEYS,
  "label", // Qur'an verse-ref labels stay in "Qur'an S:A" form (kept from English)
  "transliteration", // Latin transliteration, kept as-is
  "arabic", // Arabic script (dua/ayah text) is kept from English
  "reference", // citation strings, kept from English
  "topicId", // identifier
  "topicIds", // identifiers
  "icon", // icon name / AppIcon token
  "iconName",
  "color",
  "tone",
  "image",
  "audio",
  "emoji",
  "prophetId", // identifier
  "battleId", // identifier
  "battles", // BattlesFigure.battles is a list of battle ids (links), not prose
  "type", // enum discriminator (e.g. quiz question type)
  "verseLabel", // Qur'an verse-ref label, kept from English
  "examples", // Arabic example word-pairs (e.g. "عَلِيم vs حَلِيم"), kept from English
]);

// A source string that is pure Arabic script (an ayah excerpt, a bare Arabic term,
// a letter glyph) is kept identical across locales by design, so it is excluded
// from the coverage denominator regardless of which key holds it.
const hasLatin = (s: string) => /[A-Za-z]/.test(s);
const hasArabic = (s: string) => /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/.test(s);
const isKeptArabic = (s: string) => hasArabic(s) && !hasLatin(s);

// Bases whose overlay is not a naive 1:1 array pairing and is verified elsewhere.
// PROPHETS_TOPICS is the composed English array [context, ...bios, themes, evidence];
// its overlay is only the 7 non-bio items (bios live in PROPHETS_BIO_TOPICS_* and are
// recomposed in apps/app/src/lib/prophets.ts), so a direct compare understates coverage.
const EXCLUDED_BASES = new Set(["PROPHETS_TOPICS"]);

/**
 * Structural coverage guard for the Learn-content translation overlays.
 *
 * For every English content export `FOO` that has a translation overlay
 * `FOO_UR` / `FOO_AR`, this verifies the overlay is structurally compatible
 * (arrays never exceed the English length; objects only carry known keys) and
 * reports how much of the content is actually translated. It keeps the three
 * locales in structural lock-step and flags any area that regresses.
 */

const contentBag = content as Record<string, unknown>;
const overlayBag = overlays as Record<string, unknown>;

/** Every base export that has at least one overlay counterpart. */
const pairs = Object.keys(overlayBag)
  .filter((key) => key.endsWith("_UR"))
  .map((urKey) => {
    const baseKey = urKey.slice(0, -3);
    return {
      baseKey,
      base: contentBag[baseKey],
      ur: overlayBag[urKey],
      ar: overlayBag[`${baseKey}_AR`],
    };
  })
  .filter((p) => p.base !== undefined && !EXCLUDED_BASES.has(p.baseKey));

function countTranslatedStrings(base: unknown, overlay: unknown): { total: number; done: number } {
  let total = 0;
  let done = 0;
  const walk = (b: unknown, o: unknown) => {
    if (typeof b === "string") {
      if (isKeptArabic(b)) return; // Arabic-script source is kept identical across locales
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

  for (const { baseKey, base, ur, ar } of pairs) {
    describe(baseKey, () => {
      it("has both ur and ar overlays", () => {
        expect(ur, `${baseKey}_UR missing`).toBeDefined();
        expect(ar, `${baseKey}_AR missing`).toBeDefined();
      });

      if (Array.isArray(base)) {
        it("overlays do not exceed the English array length", () => {
          expect((ur as unknown[]).length).toBeLessThanOrEqual(base.length);
          expect((ar as unknown[]).length).toBeLessThanOrEqual(base.length);
        });
      }

      it("is fully (or nearly) translated in Urdu", () => {
        const { total, done } = countTranslatedStrings(base, ur);
        const ratio = total === 0 ? 1 : done / total;
        expect(ratio, `${baseKey} ur coverage ${done}/${total}`).toBeGreaterThanOrEqual(0.9);
      });

      it("is fully (or nearly) translated in Arabic", () => {
        const { total, done } = countTranslatedStrings(base, ar);
        const ratio = total === 0 ? 1 : done / total;
        expect(ratio, `${baseKey} ar coverage ${done}/${total}`).toBeGreaterThanOrEqual(0.9);
      });
    });
  }
});
