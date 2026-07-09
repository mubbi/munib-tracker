// Copies raw app captures from apps/app/store-assets/captures into
// public/screenshots/app/<locale>/ so deck paths can use {locale}.
//
// Place captures at:
//   apps/app/store-assets/captures/<locale>/<name>.jpg   (or .jpeg / .png)
// Native Maestro scripts write PNG with .jpg alias names — both work.
// (see packages/store-screenshots/spec.json → captureFiles)
//
// Run from tools/screenshot-studio:  node scripts/sync-app-screenshots.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const studioRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const repoRoot = path.resolve(studioRoot, "..", "..");
const spec = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "packages", "store-screenshots", "spec.json"), "utf8"),
);
const capturesRoot = path.join(repoRoot, spec.storeAssetsRoot, "captures");
const destRoot = path.join(studioRoot, "public", "screenshots", "app");

const { locales: LOCALES, captureFiles: FILES } = spec;

let copied = 0;
const missing = [];
for (const locale of LOCALES) {
  const srcLocale = path.join(capturesRoot, locale);
  const dest = path.join(destRoot, locale);
  fs.mkdirSync(dest, { recursive: true });
  for (const name of FILES) {
    const src =
      [".jpg", ".jpeg", ".png"]
        .map((ext) => path.join(srcLocale, `${name}${ext}`))
        .find((p) => fs.existsSync(p)) ?? null;
    if (!src) {
      missing.push(`${locale}/${name}.jpg`);
      continue;
    }
    // Deck paths always reference .jpg; PNG from native capture is fine (browser reads magic bytes).
    fs.copyFileSync(src, path.join(dest, `${name}.jpg`));
    copied += 1;
  }
}
console.log(`Copied ${copied}/${LOCALES.length * FILES.length} captures into ${destRoot}`);
if (missing.length) {
  console.log(
    `Missing (${missing.length}): ${missing.slice(0, 12).join(", ")}${missing.length > 12 ? "…" : ""}`,
  );
  console.log(`Add JPEGs under ${capturesRoot}/<locale>/ then re-run.`);
}
