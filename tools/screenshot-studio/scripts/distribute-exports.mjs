// Copies exports/ (written by the editor's Export bundle via /api/export)
// into apps/app/store-assets, organized per store console expectations.
//
// Run from repo root:  pnpm distribute:screenshot-exports
// Pipeline: docs/STORE_ASSETS.md
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const studioRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const repoRoot = path.resolve(studioRoot, "..", "..");
const spec = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "packages", "store-screenshots", "spec.json"), "utf8"),
);
const exportsDir = path.join(studioRoot, "exports");
const storeAssets = path.join(repoRoot, spec.storeAssetsRoot);

const SLIDE_NAMES = spec.slideScenes;

const PHONE_TARGETS = [
  { src: ["ios", "iphone", "1320x2868"], dest: ["ios", "screenshots", "6.9-inch"] },
  { src: ["ios", "iphone", "1242x2688"], dest: ["ios", "screenshots", "6.5-inch"] },
  { src: ["ios", "ipad", "2064x2752"], dest: ["ios", "screenshots", "13-inch"] },
  { src: ["android", "android", "1080x1920"], dest: ["android", "screenshots", "phone"] },
  {
    src: ["android", "android-7", "1200x1920"],
    dest: ["android", "screenshots", "tablet-7-inch", "portrait"],
  },
  {
    src: ["android", "android-7", "1920x1200"],
    dest: ["android", "screenshots", "tablet-7-inch", "landscape"],
  },
  {
    src: ["android", "android-10", "1600x2560"],
    dest: ["android", "screenshots", "tablet-10-inch", "portrait"],
  },
  {
    src: ["android", "android-10", "2560x1600"],
    dest: ["android", "screenshots", "tablet-10-inch", "landscape"],
  },
];

const platformFilter = (process.env.EXPORT_PLATFORMS || "all")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const targets =
  platformFilter.includes("all") || platformFilter.length === 0
    ? PHONE_TARGETS
    : PHONE_TARGETS.filter((t) => platformFilter.includes(t.src[0]));

let copied = 0;
const missing = [];

function copyLocaleSets(srcParts, destParts) {
  const srcRoot = path.join(exportsDir, ...srcParts);
  if (!fs.existsSync(srcRoot)) {
    missing.push(srcParts.join("/"));
    return;
  }
  for (const locale of fs.readdirSync(srcRoot)) {
    const srcLocale = path.join(srcRoot, locale);
    if (!fs.statSync(srcLocale).isDirectory()) continue;
    const destLocale = path.join(storeAssets, ...destParts, locale);
    fs.mkdirSync(destLocale, { recursive: true });
    for (const file of fs.readdirSync(srcLocale)) {
      if (!file.endsWith(".png")) continue;
      const prefix = file.slice(0, 2);
      const name = SLIDE_NAMES[prefix] ? `${SLIDE_NAMES[prefix]}.png` : file;
      fs.copyFileSync(path.join(srcLocale, file), path.join(destLocale, name));
      copied += 1;
    }
  }
}

for (const t of targets) copyLocaleSets(t.src, t.dest);

const includeAndroid =
  platformFilter.includes("all") ||
  platformFilter.length === 0 ||
  platformFilter.includes("android");
const fgRoot = path.join(exportsDir, "android", "feature-graphic", "1024x500");
if (includeAndroid && fs.existsSync(fgRoot)) {
  const destDir = path.join(storeAssets, "android", "feature-graphic");
  fs.mkdirSync(destDir, { recursive: true });
  for (const locale of fs.readdirSync(fgRoot)) {
    const srcLocale = path.join(fgRoot, locale);
    if (!fs.statSync(srcLocale).isDirectory()) continue;
    const png = fs.readdirSync(srcLocale).find((f) => f.endsWith(".png"));
    if (!png) continue;
    fs.copyFileSync(path.join(srcLocale, png), path.join(destDir, `${locale}.png`));
    copied += 1;
  }
} else {
  missing.push("android/feature-graphic/1024x500");
}

console.log(`Copied ${copied} files into ${storeAssets}`);
if (missing.length) console.log(`Missing export sets (not yet exported?): ${missing.join(", ")}`);
