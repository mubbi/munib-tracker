import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { APP_DESCRIPTION } from "../constants/branding";
import {
  APP_FEATURE_PILLARS,
  APP_HOME_FEATURES,
  APP_VALUE_PROPS,
  ZIKR_CATEGORY_LABELS,
} from "../constants/index";

/**
 * Guard English display copy in shared content + chrome constants.
 * Keep in sync with apps/app/AGENTS.md and apps/app/src/i18n/i18n-guard.test.ts.
 *
 * Skips: ids, routes, URIs, credit URLs, and `transliteration` field values
 * (Arabic phonetics may legitimately contain `dhikr` word-roots).
 */

const BANNED_TERMS: Array<{ re: RegExp; use: string }> = [
  { re: /\bdhikr\b/i, use: "zikr" },
  { re: /\bazan\b/i, use: "adhan" },
  { re: /\broza\b/i, use: "fasting" },
  { re: /\bnamaz\b/i, use: "salah" },
  { re: /\bmosque\b/i, use: "masjid" },
  { re: /\btasbih\b/i, use: "tasbeeh" },
  { re: /\bqad(a|ha)\b/i, use: "qaza" },
  { re: /\bdu['’]a\b/i, use: "dua" },
  { re: /\brak['’]ahs?\b/i, use: "rakah(s)" },
  { re: /\brakaats?\b/i, use: "rakah(s)" },
  { re: /\brakats?\b/i, use: "rakah(s)" },
  { re: /\btaraweeh\b/i, use: "tarawih" },
];

/** Object keys whose string values are ids / URLs / phonetics — not brand English. */
const SKIP_KEYS = new Set([
  "id",
  "ids",
  "topicId",
  "route",
  "href",
  "path",
  "url",
  "audioUri",
  "audio",
  "icon",
  "categoryId",
  "transliteration",
  "slug",
]);

function walkStrings(
  value: unknown,
  path: string,
  out: Array<{ path: string; text: string }>,
): void {
  if (typeof value === "string") {
    out.push({ path, text: value });
    return;
  }
  if (Array.isArray(value)) {
    for (const [i, item] of value.entries()) {
      walkStrings(item, `${path}[${i}]`, out);
    }
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (SKIP_KEYS.has(key)) continue;
      walkStrings(child, path ? `${path}.${key}` : key, out);
    }
  }
}

function findOffenders(label: string, text: string): string[] {
  const hits: string[] = [];
  for (const { re, use } of BANNED_TERMS) {
    if (re.test(text)) hits.push(`${label}: use "${use}" — "${text.slice(0, 80)}"`);
  }
  return hits;
}

const CONTENT_DIR = join(import.meta.dirname);

function englishContentModules(): string[] {
  return readdirSync(CONTENT_DIR)
    .filter(
      (name) =>
        name.endsWith(".ts") &&
        !name.endsWith(".test.ts") &&
        name !== "index.ts" &&
        name !== "content-verification.ts",
    )
    .map((name) => join(CONTENT_DIR, name));
}

describe("English Islamic terminology (shared content)", () => {
  it("uses standardized spellings in chrome labels and feature blurbs", () => {
    const offenders: string[] = [];

    for (const [id, label] of Object.entries(ZIKR_CATEGORY_LABELS)) {
      offenders.push(...findOffenders(`ZIKR_CATEGORY_LABELS.${id}`, label));
    }
    offenders.push(...findOffenders("APP_DESCRIPTION", APP_DESCRIPTION));

    for (const pillar of APP_FEATURE_PILLARS) {
      offenders.push(...findOffenders(`pillars.${pillar.id}.title`, pillar.title));
      offenders.push(...findOffenders(`pillars.${pillar.id}.summary`, pillar.summary));
      pillar.highlights.forEach((h, i) => {
        offenders.push(...findOffenders(`pillars.${pillar.id}.highlights[${i}]`, h));
      });
    }
    for (const feature of APP_HOME_FEATURES) {
      offenders.push(...findOffenders(`homeFeatures.${feature.id}.title`, feature.title));
      offenders.push(
        ...findOffenders(`homeFeatures.${feature.id}.description`, feature.description),
      );
    }
    for (const [i, prop] of APP_VALUE_PROPS.entries()) {
      offenders.push(...findOffenders(`valueProps[${i}].title`, prop.title));
      offenders.push(...findOffenders(`valueProps[${i}].description`, prop.description));
    }

    expect(offenders).toEqual([]);
  });

  it("uses standardized spellings in English learn/guide content modules", async () => {
    const offenders: string[] = [];

    for (const file of englishContentModules()) {
      const mod = (await import(file)) as Record<string, unknown>;
      const leaves: Array<{ path: string; text: string }> = [];
      for (const [exportName, value] of Object.entries(mod)) {
        if (exportName.endsWith("_VERSION") || exportName.endsWith("Version")) continue;
        walkStrings(value, exportName, leaves);
      }
      const rel = file.replace(/.*[\\/]content[\\/]/, "content/");
      for (const { path, text } of leaves) {
        // Skip OSS / credit URLs and github paths that embed source repo names.
        if (/https?:\/\//i.test(text) || /github\.com|dua-dhikr|jsdelivr/i.test(text)) continue;
        // Stable content ids as free strings / array entries (e.g. "dhikr", "home-mosque").
        if (/^[a-z][a-z0-9_-]*$/i.test(text) && text.length < 80) continue;
        offenders.push(...findOffenders(`${rel}:${path}`, text));
      }
    }

    expect(offenders).toEqual([]);
  }, 30_000);

  it("keeps English content source files free of banned display spellings", () => {
    // Source-text sweep catches string literals the import walker might miss
    // (e.g. private helpers). Skip id:/transliteration:/url lines and URI literals.
    const offenders: string[] = [];
    for (const file of englishContentModules()) {
      const src = readFileSync(file, "utf8");
      const rel = file.replace(/.*[\\/]content[\\/]/, "content/");
      for (const [index, line] of src.split(/\r?\n/).entries()) {
        const trimmed = line.trim();
        if (
          /^\s*(\/\/|\*|id:|topicId:|categoryId:|route:|href:|url:|audioUri:|transliteration:|icon:)/.test(
            line,
          )
        )
          continue;
        if (/https?:\/\//i.test(trimmed) || /dua-dhikr/i.test(trimmed)) continue;
        // Id-like string literals in arrays / lists of topic ids.
        if (/^["'][a-z][a-z0-9_-]*["'],?$/i.test(trimmed)) continue;
        for (const { re, use } of BANNED_TERMS) {
          if (re.test(line)) {
            offenders.push(`${rel}:${index + 1}: use "${use}" — ${trimmed.slice(0, 90)}`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
