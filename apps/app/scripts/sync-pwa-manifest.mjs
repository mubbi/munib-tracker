/**
 * Writes public/manifest.json from app.json (web.*) — same fields as src/config/pwa.ts.
 * Copies PWA icons from assets/images/ → public/ (and root apple-touch-icon.png).
 * Run before `expo export --platform web` (see package.json build:web).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const appJson = JSON.parse(fs.readFileSync(path.join(projectRoot, "app.json"), "utf8"));

const expo = appJson.expo ?? {};
const web = expo.web ?? {};
const themeColor = web.themeColor ?? "#152921";
const backgroundColor = web.backgroundColor ?? themeColor;
const shortName = web.shortName ?? expo.name ?? "Munib Tracker";

const manifest = {
  id: "/",
  name: shortName,
  short_name: shortName,
  description:
    web.description ??
    "Track salah, dhikr, and qadha with prayer times, reminders, and a beautiful Islamic companion app.",
  start_url: "/",
  scope: "/",
  display: "standalone",
  orientation: "portrait",
  theme_color: themeColor,
  background_color: backgroundColor,
  prefer_related_applications: false,
  icons: [
    {
      src: "/assets/images/icon-180.png",
      sizes: "180x180",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/assets/images/icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/assets/images/icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/assets/images/icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
  ],
};

const assetsImages = path.join(projectRoot, "assets", "images");
const publicImages = path.join(projectRoot, "public", "assets", "images");
const iconNames = ["icon-180.png", "icon-192.png", "icon-512.png", "favicon.png"];

for (const name of iconNames) {
  const src = path.join(assetsImages, name);
  if (!fs.existsSync(src)) {
    console.warn(
      `Missing ${path.relative(projectRoot, src)} — run icon generation or add manually`,
    );
    continue;
  }
  fs.mkdirSync(publicImages, { recursive: true });
  fs.copyFileSync(src, path.join(publicImages, name));
}

const appleTouchSrc = path.join(assetsImages, "icon-180.png");
if (fs.existsSync(appleTouchSrc)) {
  fs.copyFileSync(appleTouchSrc, path.join(projectRoot, "public", "apple-touch-icon.png"));
}

const outPath = path.join(projectRoot, "public", "manifest.json");
fs.writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log("Wrote", path.relative(projectRoot, outPath));
