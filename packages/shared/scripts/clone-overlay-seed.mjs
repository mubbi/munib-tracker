#!/usr/bin/env node
/**
 * Clone an existing overlay .ts file to a new locale by rewriting the export
 * suffix (e.g. HAJJ_GUIDE_SECTIONS_ID → HAJJ_GUIDE_SECTIONS_MS).
 *
 * Usage:
 *   node packages/shared/scripts/clone-overlay-seed.mjs --locale ms --seed id
 *   node packages/shared/scripts/clone-overlay-seed.mjs --locale ms --seed id --module hajj
 *   node packages/shared/scripts/clone-overlay-seed.mjs --all-missing
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const I18N_DIR = path.join(ROOT, "src/content/i18n");

const MODULES = [
  "aqeedah",
  "battles",
  "hajj",
  "jahannam",
  "jannah",
  "last-day",
  "learn-dua",
  "prophets",
  "quran-guide",
  "salah-guide",
  "seerah",
  "taharah",
];

/** Best seed locale when cloning a missing overlay. */
const SEED_BY_LOCALE = {
  bn: "id",
  ms: "id",
  fa: "ar",
  ps: "ar",
  ku: "ar",
  az: "tr",
  uz: "tr",
  kk: "tr",
  tk: "tr",
  bs: "tr",
  sq: "tr",
  ky: "ru",
  tg: "ru",
  fr: "en",
  ha: "fr",
  sw: "fr",
  ru: "en",
  so: "en",
};

/** Per-module seed override when the default seed has no file. */
const MODULE_SEED = {
  aqeedah: { id: "tr", bn: "tr", ms: "tr" },
  jannah: { tr: "id" },
  "quran-guide": { tr: "id" },
  "salah-guide": {
    id: "ar",
    tr: "ar",
    bn: "ar",
    ms: "ar",
    fa: "ar",
    fr: "ar",
    ha: "ar",
    sw: "ar",
    ru: "ar",
    az: "ar",
    ps: "ar",
    so: "ar",
    uz: "ar",
    kk: "ar",
    ku: "ar",
    bs: "ar",
    sq: "ar",
    ky: "ar",
    tg: "ar",
    tk: "ar",
  },
  seerah: { tr: "id" },
  taharah: { tr: "id" },
};

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    allMissing: false,
    restoreAll: false,
    force: false,
    locale: null,
    seed: null,
    module: null,
  };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--all-missing") opts.allMissing = true;
    else if (args[i] === "--restore-all") opts.restoreAll = true;
    else if (args[i] === "--force") opts.force = true;
    else if (args[i] === "--locale") opts.locale = args[++i];
    else if (args[i] === "--seed") opts.seed = args[++i];
    else if (args[i] === "--module") opts.module = args[++i];
  }
  return opts;
}

function listOverlayFiles() {
  return fs.readdirSync(I18N_DIR).filter((f) => /^[a-z-]+\.[a-z]{2}\.ts$/.test(f));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cloneFile(module, seedLocale, targetLocale, force = false) {
  const seedPath = path.join(I18N_DIR, `${module}.${seedLocale}.ts`);
  const targetPath = path.join(I18N_DIR, `${module}.${targetLocale}.ts`);

  if (!fs.existsSync(seedPath)) {
    return { module, seedLocale, targetLocale, status: "no-seed" };
  }
  if (fs.existsSync(targetPath) && !force) {
    return { module, seedLocale, targetLocale, status: "exists" };
  }

  let text = fs.readFileSync(seedPath, "utf8");
  const seedUpper = seedLocale.toUpperCase();
  const targetUpper = targetLocale.toUpperCase();
  const seedLocaleRe = escapeRegExp(seedLocale);
  const seedUpperRe = escapeRegExp(seedUpper);
  const seedLabel = escapeRegExp(seedLocale.charAt(0).toUpperCase() + seedLocale.slice(1));
  const targetLabel = targetLocale.charAt(0).toUpperCase() + targetLocale.slice(1);

  text = text.replace(new RegExp(`(\\b[A-Z0-9_]+)_${seedUpperRe}\\b`, "g"), `$1_${targetUpper}`);
  text = text.replace(
    new RegExp(`${seedLocaleRe} translation overlay`, "gi"),
    `${targetLocale} translation overlay`,
  );
  text = text.replace(new RegExp(`// ${seedLabel}`, "g"), `// ${targetLabel}`);

  fs.writeFileSync(targetPath, text, "utf8");
  return { module, seedLocale, targetLocale, status: "created" };
}

function resolveSeed(module, targetLocale, explicitSeed) {
  if (explicitSeed) return explicitSeed;
  const override = MODULE_SEED[module]?.[targetLocale];
  if (override) return override;
  return SEED_BY_LOCALE[targetLocale] ?? "en";
}

function pickSeedForMissing(module, targetLocale) {
  const preferred = resolveSeed(module, targetLocale);
  if (preferred !== "en" && fs.existsSync(path.join(I18N_DIR, `${module}.${preferred}.ts`))) {
    return preferred;
  }
  for (const fallback of ["id", "tr", "ur", "ar"]) {
    if (fs.existsSync(path.join(I18N_DIR, `${module}.${fallback}.ts`))) return fallback;
  }
  return null;
}

function updateIndexExports() {
  const indexPath = path.join(I18N_DIR, "index.ts");
  const files = listOverlayFiles()
    .map((f) => f.replace(/\.ts$/, ""))
    .filter(
      (name) =>
        ![
          "index",
          "localize",
          "overlay-locale",
          "build-overlays",
          "coverage.test",
          "localize.test",
        ].includes(name),
    )
    .sort((a, b) => a.localeCompare(b));

  const lines = [
    ...files.map((name) => `export * from "./${name}";`),
    'export * from "./build-overlays";',
    'export * from "./localize";',
    'export * from "./overlay-locale";',
    "",
  ];
  fs.writeFileSync(indexPath, lines.join("\n"), "utf8");
}

function main() {
  const opts = parseArgs();
  const results = [];

  if (opts.restoreAll || opts.allMissing) {
    const existing = new Set(listOverlayFiles().map((f) => f.replace(/\.ts$/, "")));
    const targetLocales = Object.keys(SEED_BY_LOCALE);
    for (const locale of targetLocales) {
      for (const module of MODULES) {
        const key = `${module}.${locale}`;
        if (!opts.restoreAll && existing.has(key)) continue;
        const seed = pickSeedForMissing(module, locale);
        if (!seed) {
          results.push({ module, targetLocale: locale, status: "no-seed" });
          continue;
        }
        results.push(cloneFile(module, seed, locale, opts.restoreAll || opts.force));
      }
    }
    // Also fill gaps for id/tr partial modules
    for (const [module, seeds] of Object.entries(MODULE_SEED)) {
      for (const [locale, seed] of Object.entries(seeds)) {
        const key = `${module}.${locale}`;
        if (!opts.restoreAll && existing.has(key)) continue;
        results.push(cloneFile(module, seed, locale, opts.restoreAll || opts.force));
      }
    }
  } else if (opts.locale) {
    const modules = opts.module ? [opts.module] : MODULES;
    for (const module of modules) {
      const seed = pickSeedForMissing(module, opts.locale) ?? opts.seed;
      if (!seed) {
        results.push({ module, targetLocale: opts.locale, status: "no-seed" });
        continue;
      }
      results.push(cloneFile(module, seed, opts.locale, opts.force));
    }
  } else {
    console.error(
      "Usage: clone-overlay-seed.mjs --all-missing | --locale XX [--seed yy] [--module m]",
    );
    process.exit(1);
  }

  updateIndexExports();

  const created = results.filter((r) => r.status === "created");
  const exists = results.filter((r) => r.status === "exists");
  const missing = results.filter((r) => r.status === "no-seed");

  console.log(
    `Created ${created.length}, skipped ${exists.length} existing, ${missing.length} no seed`,
  );
  for (const r of created) {
    console.log(`  + ${r.module}.${r.targetLocale} (from ${r.seedLocale})`);
  }
  if (missing.length) {
    for (const r of missing) console.log(`  ? ${r.module}.${r.targetLocale}: no seed`);
  }
}

main();
