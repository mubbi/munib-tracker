// Seeds app-store-screenshots.json with Munib Tracker decks.
// Run from repo root:  pnpm seed:screenshot-studio
// Pipeline: docs/STORE_ASSETS.md
//
// Look: scripts/deck-style.mjs (Day Arc template storyline; restyle an existing
// project without re-seeding via scripts/apply-deck-style.mjs).
//
// Copy rules: one idea per headline, 3–5 words per line, intentional line breaks,
// one **emphasis** word per slide (rendered as the Forest accent gradient).
// App ships 24 UI locales (en + 23) — never claim "3 languages".

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { styleDeck } from "./deck-style.mjs";
import { readSpec, studioRoot as root } from "./paths.mjs";

const spec = readSpec();
const LOCALES = spec.locales;

const COPY = {
  hero: {
    label: {
      en: "MUNIB TRACKER",
      ar: "MUNIB TRACKER",
      ur: "MUNIB TRACKER",
    },
    headline: {
      en: "Track your journey\n**back to Allah**",
      ar: "تتبّع رحلتك\n**إلى الله**",
      ur: "اپنا سفر\n**اللہ کی طرف**",
    },
    badge: {
      en: "Offline-first · Private · No ads",
      ar: "بدون إنترنت · خصوصية · بلا إعلانات",
      ur: "آف لائن · نجی · بغیر اشتہارات",
    },
  },
  salah: {
    label: {
      en: "SALAH TRACKER",
      ar: "تتبّع الصلاة",
      ur: "نماز ٹریکر",
    },
    headline: {
      en: "Build unshakeable\n**salah** habits",
      ar: "ثبّت **الصلاة**\nفي يومك",
      ur: "**نماز** میں\nاستقامت پائیں",
    },
  },
  qaza: {
    label: {
      en: "QAZA",
      ar: "القضاء",
      ur: "قضا",
    },
    headline: {
      en: "Clear your **qaza**\nwith clarity",
      ar: "أنجِ **القضاء**\nبوضوح",
      ur: "**قضا** واضح\nطریقے سے",
    },
  },
  library: {
    label: {
      en: "LEARNING LIBRARY",
      ar: "مكتبة التعلّم",
      ur: "لرننگ لائبریری",
    },
    headline: {
      en: "Qur'an, Zikr &\n**hadith** — offline",
      ar: "قرآن وأذكار\n**وحديث** — بدون إنترنت",
      ur: "قرآن، ذکر،\n**حدیث** — آف لائن",
    },
  },
  qibla: {
    label: {
      en: "QIBLA",
      ar: "القبلة",
      ur: "قبلہ",
    },
    headline: {
      en: "Find the **Qibla**\nin seconds",
      ar: "اعثر على **القبلة**\nفي ثوانٍ",
      ur: "**قبلہ** چند\nسیکنڈ میں",
    },
  },
  names: {
    label: {
      en: "99 NAMES",
      ar: "الأسماء الحسنى",
      ur: "۹۹ نام",
    },
    headline: {
      en: "Asma-ul-Husna\nwith **audio**",
      ar: "الأسماء الحسنى\nمع **الصوت**",
      ur: "اسماء الحسنیٰ\nمع **آڈیو**",
    },
  },
  more: {
    label: {
      en: "AND MORE",
      ar: "والمزيد",
      ur: "اور مزید",
    },
    headline: {
      en: "Widgets · PIN lock\nTasbeeh · Journal\n**24 languages**",
      ar: "ودجات · قفل PIN\nتسبيح · يوميات\n**24 لغة**",
      ur: "وجٹس · PIN لاک\nتسبیح · جرنل\n**24 زبانیں**",
    },
  },
};

const SHOT = (platform, name) => `/screenshots/app/${platform}/{locale}/${name}.jpg`;

/** Map studio device tabs → native capture platform folder. */
const DEVICE_CAPTURE_PLATFORM = {
  iphone: "ios",
  "iphone-duo": "ios",
  // Native iPad Pro 13" captures (`pnpm screenshots:ipad`) — 3:4 fills the iPad frame.
  ipad: "ipad",
  "ios-universal": "ios",
  "ios-header-wide": "ios",
  "ios-search-3x2": "ios",
  android: "android",
  "android-7": "android",
  "android-10": "android",
  "feature-graphic": "android",
};

/**
 * Landscape tablet decks use native Android tablet captures (Tablet_API_35,
 * 2560×1600 — `CAPTURE_TARGET=android-tablet pnpm screenshots:android`), synced
 * into public/screenshots/app/android-tablet/. Portrait has no native capture,
 * so it keeps the phone screens.
 */
const DEVICE_LANDSCAPE_PLATFORM = {
  "android-7": "android-tablet",
  "android-10": "android-tablet",
};

// Watch / TV decks read native store captures synced by sync-app-screenshots.mjs
// into public/screenshots/app/<apple-watch|apple-tv|android-tv>/<locale>/<scene>.png.
const SURFACE_SHOT = (surface, locale, scene) =>
  `/screenshots/app/${surface}/${locale}/${scene}.png`;

// Badge sits under the hero headline; y leaves room for 2 lines of Urdu Nastaliq.
const HERO_BADGE = {
  iphone: { x: 132, y: 600, width: 1056, height: 100, fontSize: 38 },
  android: { x: 90, y: 384, width: 900, height: 68, fontSize: 27 },
  ipad: { x: 232, y: 640, width: 1600, height: 70, fontSize: 46 },
};

function phoneDeck(device) {
  const badge = HERO_BADGE[device];
  const platform = DEVICE_CAPTURE_PLATFORM[device] ?? "android";
  const shot = (name) => SHOT(platform, name);
  const landPlatform = DEVICE_LANDSCAPE_PLATFORM[device];
  /** Slide screenshot fields, plus landscape overrides for tablets. */
  const shots = (name, secondary) => ({
    screenshot: shot(name),
    ...(secondary ? { screenshotSecondary: shot(secondary) } : {}),
    ...(landPlatform ? { screenshotLandscape: SHOT(landPlatform, name) } : {}),
    ...(landPlatform && secondary
      ? { screenshotSecondaryLandscape: SHOT(landPlatform, secondary) }
      : {}),
  });
  return [
    {
      id: `mt-${device}-01`,
      layout: "hero",
      label: COPY.hero.label,
      headline: COPY.hero.headline,
      ...shots("home"),
      ...(badge
        ? {
            textElements: [
              {
                id: "hero-badge",
                text: COPY.hero.badge,
                transform: {
                  x: badge.x,
                  y: badge.y,
                  width: badge.width,
                  height: badge.height,
                  zIndex: 5,
                },
                fontSize: badge.fontSize,
                fontWeight: 600,
                color: "#A9C6BB",
                align: "center",
              },
            ],
          }
        : {}),
    },
    {
      id: `mt-${device}-02`,
      layout: "device-bottom",
      label: COPY.salah.label,
      headline: COPY.salah.headline,
      ...shots("tracker"),
    },
    {
      id: `mt-${device}-03`,
      layout: "device-top",
      label: COPY.qaza.label,
      headline: COPY.qaza.headline,
      ...shots("qaza"),
      inverted: true,
    },
    {
      id: `mt-${device}-04`,
      layout: "two-devices",
      label: COPY.library.label,
      headline: COPY.library.headline,
      ...shots("zikr", "quran"),
    },
    {
      id: `mt-${device}-05`,
      layout: "device-bottom",
      label: COPY.qibla.label,
      headline: COPY.qibla.headline,
      ...shots("qibla"),
    },
    {
      id: `mt-${device}-06`,
      layout: "hero",
      label: COPY.names.label,
      headline: COPY.names.headline,
      ...shots("names-of-allah"),
      inverted: true,
    },
    {
      id: `mt-${device}-07`,
      layout: "device-bottom",
      label: COPY.more.label,
      headline: COPY.more.headline,
      ...shots("tasbeeh"),
      inverted: true,
    },
  ];
}

/** Apple Watch — raw app UI, one full-bleed slide per watch scene (watch UI is English-only). */
function watchDeck() {
  return Object.values(spec.watch.slideScenes).map((scene) => ({
    id: `mt-apple-watch-${scene}`,
    layout: "full-bleed",
    label: {},
    headline: {},
    screenshot: SURFACE_SHOT("apple-watch", "en", scene),
  }));
}

/** Wear OS — Play wants app UI only (1:1, no frame/text): raw tile captures, full-bleed. */
function wearDeck() {
  return ["01-salah-tile", "02-tasbeeh-tile"].map((scene) => ({
    id: `mt-wear-os-${scene}`,
    layout: "full-bleed",
    label: {},
    headline: {},
    screenshot: SURFACE_SHOT("wear-os", "en", scene),
  }));
}

/** Apple TV / Android TV — framed marketing for the first scenes, raw full-bleed for the rest. */
function tvDeck(device) {
  const scenes = Object.values(spec.tv.slideScenes);
  const framed = [
    { layout: "hero", copy: COPY.hero },
    { layout: "device-bottom", copy: COPY.salah },
    { layout: "device-top", copy: COPY.library, inverted: true },
  ];
  return scenes.map((scene, i) => {
    const shot = SURFACE_SHOT(device, "{locale}", scene);
    const f = framed[i];
    if (!f) {
      return {
        id: `mt-${device}-${scene}`,
        layout: "full-bleed",
        label: {},
        headline: {},
        screenshot: shot,
      };
    }
    return {
      id: `mt-${device}-${scene}`,
      layout: f.layout,
      label: f.copy.label,
      headline: f.copy.headline,
      screenshot: shot,
      ...(f.inverted ? { inverted: true } : {}),
    };
  });
}

/**
 * App Store creative assets (product page header / search results) — one per
 * locale. The studio pins the icon + phrase inside Apple's art safe area; the
 * two phones (home + Qur'an) sit in the auxiliary area and may be cropped.
 * No label: the App Store already prints the app name beside the artwork.
 */
function creativeDeck(device) {
  return [
    {
      id: `mt-${device}-01`,
      layout: "creative-asset",
      label: {},
      headline: COPY.hero.headline,
      screenshot: SHOT("ios", "home"),
      screenshotSecondary: SHOT("ios", "quran"),
    },
  ];
}

const state = {
  schemaVersion: 2,
  appName: "Munib Tracker",
  themeId: "munib-tracker",
  connectedCanvas: false,
  locales: LOCALES,
  locale: "en",
  device: "iphone",
  orientation: "portrait",
  appIcon: "/app-icon.png",
  slidesByDevice: {
    iphone: styleDeck("iphone", phoneDeck("iphone")),
    android: styleDeck("android", phoneDeck("android")),
    ipad: styleDeck("ipad", phoneDeck("ipad")),
    "android-7": styleDeck("android-7", phoneDeck("android-7")),
    "android-10": styleDeck("android-10", phoneDeck("android-10")),
    "iphone-duo": styleDeck("iphone-duo", phoneDeck("iphone-duo")),
    "apple-watch": watchDeck(),
    "apple-tv": styleDeck("apple-tv", tvDeck("apple-tv")),
    "ios-universal": creativeDeck("ios-universal"),
    "ios-header-wide": creativeDeck("ios-header-wide"),
    "ios-search-3x2": creativeDeck("ios-search-3x2"),
    "wear-os": wearDeck(),
    "android-tv": styleDeck("android-tv", tvDeck("android-tv")),
    // Android TV banner = the full logo only (icon + app name); Google forbids
    // extra-info text, so no headline.
    "tv-banner": [
      {
        id: "mt-tv-banner-01",
        layout: "feature-graphic",
        label: {},
        headline: {},
        screenshot: "",
      },
    ],
    // Play feature graphic: app name + one short value phrase, centred (no device
    // imagery or icon-style branding, per Google's feature graphic guidelines).
    "feature-graphic": [
      {
        id: "mt-feature-graphic-01",
        layout: "feature-graphic",
        label: {},
        headline: COPY.hero.headline,
        screenshot: "",
      },
    ],
  },
  crossScreenMockupsByDevice: {
    iphone: [],
    ipad: [],
    android: [],
    "android-7": [],
    "android-10": [],
    "feature-graphic": [],
  },
};

const out = path.join(root, "app-store-screenshots.json");
fs.writeFileSync(out, `${JSON.stringify(state, null, 2)}\n`);
console.log(`Wrote ${out}`);
console.log(
  `Locales: ${LOCALES.length}, iphone slides: ${state.slidesByDevice.iphone.length}, android slides: ${state.slidesByDevice.android.length}`,
);

const brandSync = spawnSync(process.execPath, ["scripts/sync-brand-assets.mjs"], {
  cwd: root,
  stdio: "inherit",
});
if (brandSync.status !== 0) {
  process.exit(brandSync.status ?? 1);
}
