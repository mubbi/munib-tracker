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
import { readSpec, repoRoot, studioRoot } from "./paths.mjs";

const spec = readSpec();
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

// ---------- Watch / TV surfaces (optional) ----------
// Native `pnpm screenshots:watch|tvos|android-tv` write store-ready PNGs; the
// studio decks for those surfaces read them from public/screenshots/app/<surface>/.
// Missing locales fall back to the English capture so localized captions still
// render over a real screen (TV capture defaults to LOCALES=en).
const storeRoot = path.join(repoRoot, spec.storeAssetsRoot);
const WEAR_SCENES = ["01-salah-tile", "02-tasbeeh-tile"];
const SURFACES = [
  {
    surface: "apple-watch",
    src: path.join(storeRoot, "ios", "screenshots", spec.watch.preferredSize.label),
    scenes: Object.values(spec.watch.slideScenes),
    locales: ["en"],
  },
  {
    surface: "apple-tv",
    src: path.join(storeRoot, "ios", "screenshots", "apple-tv-1080p"),
    scenes: Object.values(spec.tv.slideScenes),
    locales: LOCALES,
  },
  {
    surface: "android-tv",
    src: path.join(storeRoot, "android", "screenshots", "android-tv-1080p"),
    scenes: Object.values(spec.tv.slideScenes),
    locales: LOCALES,
  },
  {
    // Raw 454×454 tile captures from the Wear OS emulator (English-only today).
    surface: "wear-os",
    src: path.join(storeRoot, "captures-native", "wear-os"),
    scenes: WEAR_SCENES,
    locales: ["en"],
  },
];

for (const { surface, src, scenes, locales } of SURFACES) {
  let surfaceCopied = 0;
  let fallbacks = 0;
  for (const locale of locales) {
    for (const scene of scenes) {
      const own = path.join(src, locale, `${scene}.png`);
      const en = path.join(src, "en", `${scene}.png`);
      const from = fs.existsSync(own) ? own : fs.existsSync(en) ? en : null;
      if (!from) continue;
      if (from === en && locale !== "en") fallbacks += 1;
      const dest = path.join(destRoot, surface, locale);
      fs.mkdirSync(dest, { recursive: true });
      fs.copyFileSync(from, path.join(dest, `${scene}.png`));
      surfaceCopied += 1;
    }
  }
  const total = locales.length * scenes.length;
  if (surfaceCopied === 0) {
    console.log(`${surface}: no native captures under ${src} (optional — skipped)`);
  } else {
    console.log(
      `${surface}: copied ${surfaceCopied}/${total}${fallbacks ? ` (${fallbacks} via en fallback)` : ""}`,
    );
  }
}
if (missing.length) {
  console.log(
    `Missing (${missing.length}): ${missing.slice(0, 12).join(", ")}${missing.length > 12 ? "…" : ""}`,
  );
  console.log(
    `Add JPEGs under ${capturesRoot}/<android|ios>/<locale>/${STUDIO_THEME}/ then re-run.`,
  );
}
