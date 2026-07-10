// Copies raw app captures from apps/app/store-assets/captures into
// public/screenshots/app/<platform>/<locale>/ so deck paths can use {platform}/{locale}.
//
// Place captures at:
//   apps/app/store-assets/captures/<android|ios>/<locale>/<light|dark>/<name>.jpg
// Screenshot-studio marketing decks use STUDIO_THEME (default: light).
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

const PLATFORMS = spec.platforms ?? ["android", "ios"];
const { locales: LOCALES, captureFiles: FILES } = spec;
const STUDIO_THEME = (process.env.STUDIO_THEME || spec.studioTheme || "light").trim() || "light";

function resolveCapture(platform, locale, name) {
  const candidates = [
    path.join(capturesRoot, platform, locale, STUDIO_THEME, name),
    // Legacy flat path (pre theme subfolder)
    path.join(capturesRoot, platform, locale, name),
  ];
  for (const base of candidates) {
    const found = [".jpg", ".jpeg", ".png"]
      .map((ext) => `${base}${ext}`)
      .find((p) => fs.existsSync(p) && fs.statSync(p).size > 0);
    if (found) return found;
  }
  return null;
}

let copied = 0;
const missing = [];
for (const platform of PLATFORMS) {
  for (const locale of LOCALES) {
    const dest = path.join(destRoot, platform, locale);
    fs.mkdirSync(dest, { recursive: true });
    for (const name of FILES) {
      const src = resolveCapture(platform, locale, name);
      if (!src) {
        missing.push(`${platform}/${locale}/${STUDIO_THEME}/${name}.jpg`);
        continue;
      }
      fs.copyFileSync(src, path.join(dest, `${name}.jpg`));
      copied += 1;
    }
  }
}
const expected = PLATFORMS.length * LOCALES.length * FILES.length;
console.log(`Copied ${copied}/${expected} ${STUDIO_THEME} captures into ${destRoot}`);
if (missing.length) {
  console.log(
    `Missing (${missing.length}): ${missing.slice(0, 12).join(", ")}${missing.length > 12 ? "…" : ""}`,
  );
  console.log(
    `Add JPEGs under ${capturesRoot}/<android|ios>/<locale>/${STUDIO_THEME}/ then re-run.`,
  );
}
