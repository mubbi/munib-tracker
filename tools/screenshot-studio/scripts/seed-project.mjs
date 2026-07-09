// Seeds app-store-screenshots.json with Munib Tracker decks.
// Run from repo root:  pnpm seed:screenshot-studio
// Pipeline: docs/STORE_ASSETS.md
//
// Copy rules: one idea per headline, 3–5 words per line, intentional line breaks,
// one **emphasis** word per slide (rendered as the marketing emerald gradient).

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const specPath = path.resolve(root, "..", "..", "packages", "store-screenshots", "spec.json");
const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
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
      en: "Offline-first · Private · Free, no ads",
      ar: "بدون إنترنت · خصوصية · مجاني بلا إعلانات",
      ur: "آف لائن · نجی · مفت، بغیر اشتہارات",
    },
  },
  salah: {
    label: {
      en: "SALAH",
      ar: "الصلاة",
      ur: "نماز",
    },
    headline: {
      en: "Build unshakeable\n**salah** consistency",
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
      en: "Zikr, Qur'an,\n**hadith** — offline",
      ar: "أذكار وقرآن\n**وحديث** — بدون إنترنت",
      ur: "ذکر، قرآن،\n**حدیث** — آف لائن",
    },
  },
  privacy: {
    label: {
      en: "PRIVACY FIRST",
      ar: "الخصوصية أولاً",
      ur: "رازداری اوّل",
    },
    headline: {
      en: "Private by\n**default**",
      ar: "خصوصية\n**افتراضية**",
      ur: "بنیادی طور\n**نجی**",
    },
  },
  offline: {
    label: {
      en: "OFFLINE & SYNC",
      ar: "بدون إنترنت والمزامنة",
      ur: "آف لائن اور ہم آہنگی",
    },
    headline: {
      en: "Works **offline**.\nSync optional.",
      ar: "يعمل **بدون إنترنت**.\nالمزامنة اختيارية.",
      ur: "**آف لائن** چلتا ہے۔\nہم آہنگی اختیاری۔",
    },
  },
  more: {
    label: {
      en: "AND MORE",
      ar: "والمزيد",
      ur: "اور مزید",
    },
    headline: {
      en: "Prayer times hero\nQibla & reminders\nPIN lock\nWidgets\n**3 languages**",
      ar: "مواقيت الصلاة\nالقبلة والتذكيرات\nقفل PIN\nودجات\n**3 لغات**",
      ur: "نماز کے اوقات\nقبلہ و یاد دہانیاں\nPIN لاک\nوجٹس\n**3 زبانیں**",
    },
  },
  featureGraphic: {
    headline: {
      en: "Salah, dhikr, qaza & learning.\nOffline-first. Private by design.",
      ar: "صلاة وذكر وقضاء وتعلّم.\nبدون إنترنت. خصوصية بالتصميم.",
      ur: "نماز، ذکر، قضا اور تعلیم۔\nآف لائن۔ رازداری بنیادی اصول۔",
    },
  },
};

const SHOT = (name) => `/screenshots/app/{locale}/${name}.jpg`;

const HERO_BADGE = {
  iphone: { x: 132, y: 640, width: 1056, height: 130, fontSize: 46 },
  android: { x: 108, y: 450, width: 864, height: 96, fontSize: 34 },
  ipad: { x: 232, y: 820, width: 1600, height: 120, fontSize: 54 },
};

function phoneDeck(device) {
  const badge = HERO_BADGE[device];
  return [
    {
      id: `mt-${device}-01`,
      layout: "hero",
      label: COPY.hero.label,
      headline: COPY.hero.headline,
      screenshot: SHOT("home"),
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
                color: "#93a79d",
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
      screenshot: SHOT("tracker"),
    },
    {
      id: `mt-${device}-03`,
      layout: "device-top",
      label: COPY.qaza.label,
      headline: COPY.qaza.headline,
      screenshot: SHOT("qaza"),
      inverted: true,
    },
    {
      id: `mt-${device}-04`,
      layout: "two-devices",
      label: COPY.library.label,
      headline: COPY.library.headline,
      screenshot: SHOT("zikr"),
      screenshotSecondary: SHOT("quran"),
    },
    {
      id: `mt-${device}-05`,
      layout: "device-bottom",
      label: COPY.privacy.label,
      headline: COPY.privacy.headline,
      screenshot: SHOT("settings-privacy"),
    },
    {
      id: `mt-${device}-06`,
      layout: "hero",
      label: COPY.offline.label,
      headline: COPY.offline.headline,
      screenshot: SHOT("settings-sync"),
    },
    {
      id: `mt-${device}-07`,
      layout: "no-device",
      label: COPY.more.label,
      headline: COPY.more.headline,
      screenshot: "",
      inverted: true,
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
    iphone: phoneDeck("iphone"),
    android: phoneDeck("android"),
    ipad: phoneDeck("ipad"),
    "android-7": phoneDeck("android-7"),
    "android-10": phoneDeck("android-10"),
    "feature-graphic": [
      {
        id: "mt-feature-graphic-01",
        layout: "feature-graphic",
        label: {},
        headline: COPY.featureGraphic.headline,
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
