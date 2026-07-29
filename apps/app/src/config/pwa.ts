import { APP_DESCRIPTION, APP_NAME } from "@munib-tracker/shared/constants";
import { type AppLocale, getLocaleDefinition } from "@munib-tracker/shared/i18n";
import appJson from "../../app.json";

/** Static paths under `public/assets/images/` (synced from `assets/images/` before web export). */
export const PWA_ICON_PATHS = {
  /** iOS Safari requires 180×180 for Add to Home Screen (apple-touch-icon). */
  appleTouch180: "/assets/images/icon-180.png",
  any192: "/assets/images/icon-192.png",
  any512: "/assets/images/icon-512.png",
  /** Maskable safe zone — 192px asset avoids cropping a full-bleed 512 icon on Android. */
  maskable: "/assets/images/icon-192.png",
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
  themeColor?: string;
  backgroundColor?: string;
};

const expo = appJson.expo;
const web = (expo.web ?? {}) as ExpoWebConfig;

const themeColor = web.themeColor ?? "#152921";
const themeColorLight = "#F5F0E6";
const themeColorDark = "#152921";
const backgroundColor = web.backgroundColor ?? themeColor;
const shortName = web.shortName ?? expo.name ?? APP_NAME;

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
  orientation: "portrait" as const,
  theme_color: themeColor,
  background_color: backgroundColor,
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
  ],
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
