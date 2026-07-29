#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../../..");
const dir = join(root, "packages/shared/src/content/i18n");
const out = join(root, "apps/app/src/lib/content-overlay-loaders.ts");

const CORPORA = [
  "aqeedah",
  "battles",
  "eid-guide",
  "fidyah-guide",
  "friday-guide",
  "hajj",
  "islamic-finance",
  "islamic-history",
  "jahannam",
  "janazah-guide",
  "jannah",
  "last-day",
  "laylat-al-qadr",
  "learn-dua",
  "new-muslim",
  "prophets",
  "prophets-genealogy",
  "quran-guide",
  "ruqyah",
  "sahaba",
  "salah-guide",
  "seerah",
  "taharah",
  "white-days-guide",
];
const LOCALES = [
  "ar",
  "az",
  "bn",
  "bs",
  "fa",
  "fr",
  "ha",
  "id",
  "kk",
  "ku",
  "ky",
  "ms",
  "ps",
  "ru",
  "so",
  "sq",
  "sw",
  "tg",
  "tk",
  "tr",
  "ur",
  "uz",
];

const baseKeys = {};
for (const corpus of CORPORA) {
  const src = readFileSync(join(dir, `${corpus}.ar.ts`), "utf8");
  for (const em of src.matchAll(/export const ([A-Z0-9_]+)_AR\b/g)) {
    baseKeys[em[1]] = corpus;
  }
}

const lines = [];
lines.push("/**");
lines.push(" * Lazy loaders for Learn-content overlay modules.");
lines.push(" * Generated — do not edit by hand. Re-run:");
lines.push(" *   node apps/app/scripts/generate-content-overlay-loaders.mjs");
lines.push(" *");
lines.push(" * Dynamic import() keeps inactive locales out of the web entry chunk");
lines.push(" * and defers native module evaluation until a locale is preloaded.");
lines.push(" */");
lines.push('import type { OverlayLocale } from "@munib-tracker/shared/content-i18n";');
lines.push("");
lines.push(`export const CONTENT_OVERLAY_CORPORA = ${JSON.stringify(CORPORA)} as const;`);
lines.push("export type ContentOverlayCorpus = (typeof CONTENT_OVERLAY_CORPORA)[number];");
lines.push("");
lines.push(
  `export const OVERLAY_BASE_KEY_CORPUS: Record<string, ContentOverlayCorpus> = ${JSON.stringify(baseKeys, null, 2)};`,
);
lines.push("");
lines.push("type OverlayModule = Record<string, unknown>;");
lines.push("type LocaleLoader = () => Promise<OverlayModule>;");
lines.push("");
lines.push(
  "export const CONTENT_OVERLAY_LOADERS: Record<ContentOverlayCorpus, Record<OverlayLocale, LocaleLoader>> = {",
);
for (const corpus of CORPORA) {
  lines.push(`  "${corpus}": {`);
  for (const locale of LOCALES) {
    lines.push(
      `    ${locale}: () => import("@munib-tracker/shared/content/i18n/${corpus}.${locale}") as Promise<OverlayModule>,`,
    );
  }
  lines.push("  },");
}
lines.push("};");
lines.push("");

writeFileSync(out, `${lines.join("\n")}\n`);
console.log(`Wrote ${out} (${CORPORA.length} corpora × ${LOCALES.length} locales)`);
