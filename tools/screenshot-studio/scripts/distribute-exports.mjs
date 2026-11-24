// Copies exports/ (written by the editor's Export bundle via /api/export)
// into apps/app/store-assets, organized per store console expectations.
//
// Run from repo root:  pnpm distribute:screenshot-exports
// Pipeline: docs/STORE_ASSETS.md
import fs from "node:fs";
import path from "node:path";
import { readSpec, repoRoot, studioRoot } from "./paths.mjs";

const spec = readSpec();
const exportsDir = path.join(studioRoot, "exports");
const storeAssets = path.join(repoRoot, spec.storeAssetsRoot);

const SLIDE_NAMES = spec.slideScenes;
const WATCH_NAMES = spec.watch.slideScenes;
const TV_NAMES = spec.tv.slideScenes;

// Multi-screen decks: exports/<platform>/<device>/<WxH>/<locale>/NN-layout.png
//   → store-assets/<dest>/<locale>/<scene>.png (scene from `names`, else original filename).
// Watch / TV / iPhone Duo land in their own folders so they never overwrite the
// native captures in watch-ultra-3/, apple-tv-1080p/, android-tv-1080p/ and
// iphone-duo/ (`pnpm screenshots:duo`).
const PHONE_TARGETS = [
  { src: ["ios", "iphone", "1320x2868"], dest: ["ios", "screenshots", "6.9-inch"] },
  { src: ["ios", "iphone", "1242x2688"], dest: ["ios", "screenshots", "6.5-inch"] },
  { src: ["ios", "iphone", "1206x2622"], dest: ["ios", "screenshots", "6.3-inch"] },
  {
    src: ["ios", "iphone-duo", "2007x2853"],
    dest: ["ios", "screenshots", "iphone-duo-studio", "portrait"],
  },
  {
    src: ["ios", "iphone-duo", "1398x2034"],
    dest: ["ios", "screenshots", "iphone-duo-studio", "portrait-compact"],
  },
  {
    src: ["ios", "iphone-duo", "2853x2007"],
    dest: ["ios", "screenshots", "iphone-duo-studio", "landscape"],
  },
  {
    src: ["ios", "iphone-duo", "2034x1398"],
    dest: ["ios", "screenshots", "iphone-duo-studio", "landscape-compact"],
  },
  { src: ["ios", "ipad", "2064x2752"], dest: ["ios", "screenshots", "13-inch"] },
  {
    src: ["ios", "apple-watch", "422x514"],
    dest: ["ios", "screenshots", "apple-watch", "422x514"],
    names: WATCH_NAMES,
  },
  {
    src: ["ios", "apple-watch", "410x502"],
    dest: ["ios", "screenshots", "apple-watch", "410x502"],
    names: WATCH_NAMES,
  },
  {
    src: ["ios", "apple-tv", "3840x2160"],
    dest: ["ios", "screenshots", "apple-tv", "3840x2160"],
    names: TV_NAMES,
  },
  {
    src: ["ios", "apple-tv", "1920x1080"],
    dest: ["ios", "screenshots", "apple-tv", "1920x1080"],
    names: TV_NAMES,
  },
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
  {
    src: ["android", "wear-os", "1024x1024"],
    dest: ["android", "screenshots", "wear-os"],
    names: {},
  },
  {
    src: ["android", "android-tv", "1920x1080"],
    dest: ["android", "screenshots", "android-tv"],
    names: TV_NAMES,
  },
];

// Single-asset slots (one image per locale): exports/<platform>/<device>/<WxH>/<locale>/*.png
//   → store-assets/<dest>/<locale>.png
const SINGLE_TARGETS = [
  { src: ["ios", "ios-header", "5244x2950"], dest: ["ios", "product-page", "header", "5244x2950"] },
  {
    src: ["ios", "ios-header-wide", "3840x1646"],
    dest: ["ios", "product-page", "header", "3840x1646"],
  },
  {
    src: ["ios", "ios-search", "5244x2950"],
    dest: ["ios", "product-page", "search-results", "5244x2950"],
  },
  {
    src: ["ios", "ios-search-3x2", "3840x2560"],
    dest: ["ios", "product-page", "search-results", "3840x2560"],
  },
  {
    src: ["ios", "ios-search-3x2", "1920x1280"],
    dest: ["ios", "product-page", "search-results", "1920x1280"],
  },
  { src: ["android", "tv-banner", "1280x720"], dest: ["android", "tv-banner"] },
  { src: ["android", "feature-graphic", "1024x500"], dest: ["android", "feature-graphic"] },
];

const platformFilter = (process.env.EXPORT_PLATFORMS || "all")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const wantPlatform = (p) =>
  platformFilter.includes("all") || platformFilter.length === 0 || platformFilter.includes(p);

let copied = 0;
const missing = [];

function copyLocaleSets(srcParts, destParts, names = SLIDE_NAMES) {
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
      const name = names[prefix] ? `${names[prefix]}.png` : file;
      fs.copyFileSync(path.join(srcLocale, file), path.join(destLocale, name));
      copied += 1;
    }
  }
}

function copySingleAssets(srcParts, destParts) {
  const srcRoot = path.join(exportsDir, ...srcParts);
  if (!fs.existsSync(srcRoot)) {
    missing.push(srcParts.join("/"));
    return;
  }
  const destDir = path.join(storeAssets, ...destParts);
  fs.mkdirSync(destDir, { recursive: true });
  for (const locale of fs.readdirSync(srcRoot)) {
    const srcLocale = path.join(srcRoot, locale);
    if (!fs.statSync(srcLocale).isDirectory()) continue;
    const png = fs.readdirSync(srcLocale).find((f) => f.endsWith(".png"));
    if (!png) continue;
    fs.copyFileSync(path.join(srcLocale, png), path.join(destDir, `${locale}.png`));
    copied += 1;
  }
}

for (const t of PHONE_TARGETS) {
  if (wantPlatform(t.src[0])) copyLocaleSets(t.src, t.dest, t.names);
}
for (const t of SINGLE_TARGETS) {
  if (wantPlatform(t.src[0])) copySingleAssets(t.src, t.dest);
}

console.log(`Copied ${copied} files into ${storeAssets}`);
if (missing.length) console.log(`Missing export sets (not yet exported?): ${missing.join(", ")}`);
