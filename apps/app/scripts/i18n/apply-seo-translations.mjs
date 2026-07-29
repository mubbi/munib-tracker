#!/usr/bin/env node
/** Merge per-locale SEO translation overlays into seo-routes-locale/*.json */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const SRC = join(ROOT, "src/config/seo-routes.data.json");
const OUT_DIR = join(ROOT, "src/config/seo-routes-locale");
const DATA_DIR = join(__dirname, "seo-translations");

const LOCALES = (process.argv[2] ?? "all")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const en = JSON.parse(readFileSync(SRC, "utf8"));

async function loadLocale(locale) {
  const modPath = join(DATA_DIR, `${locale}.mjs`);
  const mod = await import(pathToFileURL(modPath).href);
  return mod.default;
}

function buildLocaleFile(overlay) {
  const out = {};
  for (const [path, route] of Object.entries(en)) {
    const tr = overlay[path];
    if (!tr) {
      console.warn(`  missing overlay for ${path}`);
      continue;
    }
    const entry = {
      title: tr.title,
      description: tr.description,
    };
    if (tr.keywords) entry.keywords = tr.keywords;
    if (tr.imageAlt) entry.imageAlt = tr.imageAlt;
    if (route.index === false) entry.index = false;
    out[path] = entry;
  }
  return out;
}

const allLocales =
  LOCALES[0] === "all"
    ? [
        "ar",
        "ur",
        "id",
        "tr",
        "bn",
        "ms",
        "fa",
        "fr",
        "ha",
        "sw",
        "ru",
        "az",
        "ps",
        "so",
        "uz",
        "kk",
        "ku",
        "bs",
        "sq",
        "ky",
        "tg",
        "tk",
      ]
    : LOCALES;

for (const locale of allLocales) {
  const overlay = await loadLocale(locale);
  const missing = Object.keys(en).filter((k) => !overlay[k]);
  if (missing.length) {
    console.error(
      `${locale}: missing ${missing.length} routes — ${missing.slice(0, 3).join(", ")}...`,
    );
    process.exitCode = 1;
    continue;
  }
  const out = buildLocaleFile(overlay);
  writeFileSync(join(OUT_DIR, `${locale}.json`), `${JSON.stringify(out, null, 2)}\n`, "utf8");
  console.log(`${locale}: wrote ${Object.keys(out).length} routes`);
}

console.log("Done.");
