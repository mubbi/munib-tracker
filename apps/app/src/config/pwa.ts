import { APP_DESCRIPTION, APP_NAME } from "@munib-tracker/shared/constants";
import { type AppLocale, getLocaleDefinition } from "@munib-tracker/shared/i18n";
import { resolveTheme } from "@munib-tracker/theme/resolve";
import appJson from "../../app.json";

/** Static paths under `public/assets/images/` (synced from `assets/images/` before web export). */
export const PWA_ICON_PATHS = {
  /** iOS Safari requires 180×180 for Add to Home Screen (apple-touch-icon). */
  appleTouch180: "/assets/images/icon-180.png",
  any192: "/assets/images/icon-192.png",
  any512: "/assets/images/icon-512.png",
  /**
   * Maskable icons: the logo inside the 80% safe-zone circle on the brand
   * background (web.dev "maskable icons"), so Android / Chrome OS masks never
   * crop it. Separate from the full-bleed "any" icons — never one icon with
   * both purposes. Made by `scripts/generate-pwa-assets.py`.
   */
  maskable: "/assets/images/pwa/icon-192-maskable.png",
  maskable512: "/assets/images/pwa/icon-512-maskable.png",
  /** Multi-size ICO served at site root (browsers + Expo inject `/favicon.ico`). */
  faviconIco: "/favicon.ico",
  favicon: "/assets/images/favicon.png",
  /** Default path iOS probes when adding to home screen. */
  appleTouchRoot: "/apple-touch-icon.png",
  notification: "/assets/images/icon-192.png",
} as const;

type ExpoWebConfig = {
  name?: string;
  shortName?: string;
  description?: string;
};

const expo = appJson.expo;
const web = (expo.web ?? {}) as ExpoWebConfig;

/**
 * PWA colours come from the theme, not hand-copied hexes. The manifest takes a
 * single colour, so it uses the light page background — D-UX2 makes "system"
 * the default, and a light-OS install must not flash the dark green before a
 * cream app. Dark stays available through the `prefers-color-scheme`
 * `theme-color` metas in `+html.tsx`. `app.json` `web.themeColor` /
 * `backgroundColor` (read by `scripts/sync-pwa-manifest.mjs`) must match —
 * enforced by `pwa.test.ts`.
 */
const themeColorLight = resolveTheme("light", "light").background;
const themeColorDark = resolveTheme("dark", "dark").background;
const themeColor = themeColorLight;
const backgroundColor = themeColorLight;
const shortName = web.shortName ?? expo.name ?? APP_NAME;

/**
 * Installed-app shortcuts (long-press / right-click the app icon). URLs are
 * existing routes — the same destinations as the native quick actions. The web
 * build has no silent "mark current Salah" command, so Mark Salah opens the
 * tracker. Icons come from `scripts/generate-pwa-assets.py`.
 */
export const PWA_SHORTCUTS = [
  {
    name: "Mark Salah",
    short_name: "Mark Salah",
    description: "Open today's Salah tracker",
    url: "/tracker",
    icons: [{ src: "/assets/images/pwa/shortcut-tracker.png", sizes: "96x96", type: "image/png" }],
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
    icons: [{ src: "/assets/images/pwa/shortcut-tasbeeh.png", sizes: "96x96", type: "image/png" }],
  },
];

/**
 * Install-dialog screenshots for Chrome / Edge's richer install UI: "narrow"
 * (phone, from the light English store captures) and "wide" (desktop, from the
 * English 10-inch tablet landscape store set) — desktop only shows the richer
 * dialog with a "wide" one. One aspect ratio per form factor, ≤ 2.3:1, 320–3840px
 * (developer.chrome.com "richer PWA installation"). Made by
 * `scripts/generate-pwa-assets.py`.
 */
export const PWA_SCREENSHOTS = [
  {
    src: "/assets/images/pwa/screenshot-home.png",
    sizes: "540x1200",
    type: "image/png",
    form_factor: "narrow",
    label: "Home with today's Salah times",
  },
  {
    src: "/assets/images/pwa/screenshot-tracker.png",
    sizes: "540x1200",
    type: "image/png",
    form_factor: "narrow",
    label: "Tracker with today's Salah progress",
  },
  {
    src: "/assets/images/pwa/screenshot-qibla.png",
    sizes: "540x1200",
    type: "image/png",
    form_factor: "narrow",
    label: "Qibla compass",
  },
  {
    src: "/assets/images/pwa/screenshot-wide-home.jpg",
    sizes: "1280x800",
    type: "image/jpeg",
    form_factor: "wide",
    label: "Home with the next Salah and today's date",
  },
  {
    src: "/assets/images/pwa/screenshot-wide-salah.jpg",
    sizes: "1280x800",
    type: "image/jpeg",
    form_factor: "wide",
    label: "Salah tracker",
  },
  {
    src: "/assets/images/pwa/screenshot-wide-library.jpg",
    sizes: "1280x800",
    type: "image/jpeg",
    form_factor: "wide",
    label: "Library of Qur'an, hadith, duas and adhkar",
  },
];

/**
 * Chrome / Edge `launch_handler`: re-use the open app window (navigated to the
 * shortcut / link target) instead of stacking new windows; "auto" is the
 * fallback for browsers that don't know "navigate-existing".
 */
export const PWA_LAUNCH_HANDLER = { client_mode: ["navigate-existing", "auto"] };

/** Web app manifest fields — keep in sync via `pnpm sync:pwa-manifest`. */
export const pwaWebManifest = {
  id: "/",
  name: shortName,
  short_name: shortName,
  description: web.description ?? APP_DESCRIPTION,
  lang: "en",
  dir: "ltr" as const,
  categories: ["lifestyle", "education", "utilities"],
  start_url: "/",
  scope: "/",
  display: "standalone" as const,
  // Tablets, foldables and Chromebooks rotate — the app has wide layouts.
  orientation: "any" as const,
  theme_color: themeColor,
  background_color: backgroundColor,
  launch_handler: PWA_LAUNCH_HANDLER,
  prefer_related_applications: false,
  icons: [
    {
      src: PWA_ICON_PATHS.appleTouch180,
      sizes: "180x180",
      type: "image/png",
      purpose: "any",
    },
    {
      src: PWA_ICON_PATHS.any192,
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: PWA_ICON_PATHS.any512,
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: PWA_ICON_PATHS.maskable,
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: PWA_ICON_PATHS.maskable512,
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
  shortcuts: PWA_SHORTCUTS,
  screenshots: PWA_SCREENSHOTS,
};

export const PWA_THEME_COLOR = pwaWebManifest.theme_color;
export const PWA_THEME_COLOR_LIGHT = themeColorLight;
export const PWA_THEME_COLOR_DARK = themeColorDark;
export const PWA_SHORT_NAME = pwaWebManifest.short_name;
export const PWA_DESCRIPTION = pwaWebManifest.description;
export const PWA_APPLE_TOUCH_ICON = PWA_ICON_PATHS.appleTouch180;

/** Locale-aware manifest fields for runtime web shell (defaults to English LTR). */
export function resolvePwaManifestForLocale(locale: AppLocale = "en") {
  const entry = getLocaleDefinition(locale);
  return {
    ...pwaWebManifest,
    lang: entry.hreflang,
    dir: entry.direction,
  };
}
