/**
 * Writes public/manifest.json from app.json (web.*) — same fields as src/config/pwa.ts
 * (`pwa.test.ts` fails if the committed manifest drifts from `pwaWebManifest`).
 * Copies PWA icons from assets/images/ → public/ (and root apple-touch-icon.png), plus the
 * maskable icon / shortcut icons / screenshots in assets/images/pwa/ (made by
 * scripts/generate-pwa-assets.py).
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
  lang: "en",
  dir: "ltr",
  categories: ["lifestyle", "education", "utilities"],
  start_url: "/",
  scope: "/",
  display: "standalone",
  orientation: "any",
  theme_color: themeColor,
  background_color: backgroundColor,
  launch_handler: { client_mode: ["navigate-existing", "auto"] },
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
      src: "/assets/images/pwa/icon-192-maskable.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "/assets/images/pwa/icon-512-maskable.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
  shortcuts: [
    {
      name: "Mark Salah",
      short_name: "Mark Salah",
      description: "Open today's Salah tracker",
      url: "/tracker",
      icons: [
        { src: "/assets/images/pwa/shortcut-tracker.png", sizes: "96x96", type: "image/png" },
      ],
    },
    {
      name: "Qibla",
      short_name: "Qibla",
      description: "Find the Qibla direction",
      url: "/qibla",
      icons: [{ src: "/assets/images/pwa/shortcut-qibla.png", sizes: "96x96", type: "image/png" }],
    },
    {
      name: "Tasbeeh",
      short_name: "Tasbeeh",
      description: "Open the Tasbeeh counter",
      url: "/tasbeeh/free",
      icons: [
        { src: "/assets/images/pwa/shortcut-tasbeeh.png", sizes: "96x96", type: "image/png" },
      ],
    },
  ],
  screenshots: [
    {
      src: "/assets/images/pwa/screenshot-home.jpg",
      sizes: "720x1280",
      type: "image/jpeg",
      form_factor: "narrow",
      label: "Track your journey back to Allah",
    },
    {
      src: "/assets/images/pwa/screenshot-salah.jpg",
      sizes: "720x1280",
      type: "image/jpeg",
      form_factor: "narrow",
      label: "Build unshakeable Salah habits",
    },
    {
      src: "/assets/images/pwa/screenshot-qaza.jpg",
      sizes: "720x1280",
      type: "image/jpeg",
      form_factor: "narrow",
      label: "Clear your Qaza with clarity",
    },
    {
      src: "/assets/images/pwa/screenshot-library.jpg",
      sizes: "720x1280",
      type: "image/jpeg",
      form_factor: "narrow",
      label: "Qur'an, Zikr and hadith — offline",
    },
    {
      src: "/assets/images/pwa/screenshot-qibla.jpg",
      sizes: "720x1280",
      type: "image/jpeg",
      form_factor: "narrow",
      label: "Find the Qibla in seconds",
    },
    {
      src: "/assets/images/pwa/screenshot-wide-home.jpg",
      sizes: "1280x800",
      type: "image/jpeg",
      form_factor: "wide",
      label: "Track your journey back to Allah",
    },
    {
      src: "/assets/images/pwa/screenshot-wide-salah.jpg",
      sizes: "1280x800",
      type: "image/jpeg",
      form_factor: "wide",
      label: "Build unshakeable Salah habits",
    },
    {
      src: "/assets/images/pwa/screenshot-wide-library.jpg",
      sizes: "1280x800",
      type: "image/jpeg",
      form_factor: "wide",
      label: "Qur'an, Zikr and hadith — offline",
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

// Maskable 512 icon, shortcut icons and install screenshots (generate-pwa-assets.py).
const assetsPwa = path.join(assetsImages, "pwa");
const publicPwa = path.join(publicImages, "pwa");
for (const entry of [
  ...manifest.icons,
  ...manifest.shortcuts.flatMap((s) => s.icons),
  ...manifest.screenshots,
]) {
  if (!entry.src.startsWith("/assets/images/pwa/")) continue;
  const name = path.basename(entry.src);
  const src = path.join(assetsPwa, name);
  if (!fs.existsSync(src)) {
    console.warn(
      `Missing ${path.relative(projectRoot, src)} — run python scripts/generate-pwa-assets.py`,
    );
    continue;
  }
  fs.mkdirSync(publicPwa, { recursive: true });
  fs.copyFileSync(src, path.join(publicPwa, name));
}

const appleTouchSrc = path.join(assetsImages, "icon-180.png");
if (fs.existsSync(appleTouchSrc)) {
  fs.copyFileSync(appleTouchSrc, path.join(projectRoot, "public", "apple-touch-icon.png"));
}

const faviconIcoSrc = path.join(assetsImages, "favicon.ico");
const faviconIcoDest = path.join(projectRoot, "public", "favicon.ico");
if (fs.existsSync(faviconIcoSrc)) {
  fs.copyFileSync(faviconIcoSrc, faviconIcoDest);
} else {
  // Fallback: leave existing public/favicon.ico if present (generated by brand assets).
  if (!fs.existsSync(faviconIcoDest)) {
    console.warn(
      "Missing assets/images/favicon.ico — run generate-brand-assets.py for /favicon.ico",
    );
  }
}

const outPath = path.join(projectRoot, "public", "manifest.json");
fs.writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log("Wrote", path.relative(projectRoot, outPath));
