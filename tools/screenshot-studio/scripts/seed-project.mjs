// Seeds app-store-screenshots.json with Munib Tracker decks.
// Run from repo root:  pnpm seed:screenshot-studio
// Pipeline: docs/STORE_ASSETS.md
//
// Copy rules: one idea per headline, 3–5 words per line, intentional line breaks,
// one **emphasis** word per slide (rendered as the Forest accent gradient).
// App ships 23 UI locales (en + 22) — never claim "3 languages".

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
      en: "Widgets · PIN lock\nTasbeeh · Journal\n**23 languages**",
      ar: "ودجات · قفل PIN\nتسبيح · يوميات\n**23 لغة**",
      ur: "وجٹس · PIN لاک\nتسبیح · جرنل\n**23 زبانیں**",
    },
  },
  featureGraphic: {
    headline: {
      en: "Salah, Zikr, Qaza & learning — offline.\n23 languages. Private by design.",
      ar: "صلاة وذكر وقضاء وتعلّم — بدون إنترنت.\n23 لغة. خصوصية بالتصميم.",
      ur: "نماز، ذکر، قضا اور تعلیم — آف لائن۔\n23 زبانیں۔ رازداری بنیادی اصول۔",
    },
  },
};

const SHOT = (platform, name) => `/screenshots/app/${platform}/{locale}/${name}.jpg`;

/** Map studio device tabs → native capture platform folder. */
const DEVICE_CAPTURE_PLATFORM = {
  iphone: "ios",
  ipad: "ios",
  android: "android",
  "android-7": "android",
  "android-10": "android",
  "feature-graphic": "android",
};

const HERO_BADGE = {
  iphone: { x: 132, y: 520, width: 1056, height: 100, fontSize: 38 },
  android: { x: 90, y: 320, width: 900, height: 68, fontSize: 27 },
  ipad: { x: 232, y: 680, width: 1600, height: 100, fontSize: 46 },
};

function phoneDeck(device) {
  const badge = HERO_BADGE[device];
  const platform = DEVICE_CAPTURE_PLATFORM[device] ?? "android";
  const shot = (name) => SHOT(platform, name);
  return [
    {
      id: `mt-${device}-01`,
      layout: "hero",
      label: COPY.hero.label,
      headline: COPY.hero.headline,
      screenshot: shot("home"),
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
      screenshot: shot("tracker"),
    },
    {
      id: `mt-${device}-03`,
      layout: "device-top",
      label: COPY.qaza.label,
      headline: COPY.qaza.headline,
      screenshot: shot("qaza"),
      inverted: true,
    },
    {
      id: `mt-${device}-04`,
      layout: "two-devices",
      label: COPY.library.label,
      headline: COPY.library.headline,
      screenshot: shot("zikr"),
      screenshotSecondary: shot("quran"),
    },
    {
      id: `mt-${device}-05`,
      layout: "device-bottom",
      label: COPY.qibla.label,
      headline: COPY.qibla.headline,
      screenshot: shot("qibla"),
    },
    {
      id: `mt-${device}-06`,
      layout: "hero",
      label: COPY.names.label,
      headline: COPY.names.headline,
      screenshot: shot("names-of-allah"),
      inverted: true,
    },
    {
      id: `mt-${device}-07`,
      layout: "device-bottom",
      label: COPY.more.label,
      headline: COPY.more.headline,
      screenshot: shot("tasbeeh"),
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
