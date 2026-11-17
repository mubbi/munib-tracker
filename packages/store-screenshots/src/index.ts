/**
 * Shared App Store / Play Store screenshot dimensions and asset layout for Munib Tracker.
 *
 * `spec.json` is the single source of truth for locales, capture files and slide scenes
 * (the screenshot-studio and capture scripts read it directly); this module re-exports
 * those values typed, plus canvas/export sizes that only TS consumers need.
 */

import spec from "../spec.json" with { type: "json" };

export type StoreScreenshotLocale = string;
export type SlideScenes = Readonly<Record<string, string>>;

/** Marketing deck locales (a subset of the app's 24 UI locales). */
export const STORE_SCREENSHOT_LOCALES: readonly StoreScreenshotLocale[] = spec.locales;

/** Default studio theme subfolder (`captures/<platform>/<locale>/<theme>/`). */
export const STUDIO_THEME: "light" | "dark" = spec.studioTheme === "dark" ? "dark" : "light";

export type ExportSize = { label: string; w: number; h: number };

export type DeviceKind =
  | "iphone"
  | "ipad"
  | "android"
  | "android-7"
  | "android-10"
  | "feature-graphic"
  | "watch"
  | "apple-tv"
  | "android-tv";

export const CANVAS: Record<DeviceKind, { w: number; h: number; wL?: number; hL?: number }> = {
  iphone: { w: 1320, h: 2868 },
  ipad: { w: 2064, h: 2752 },
  android: { w: 1080, h: 1920 },
  "android-7": { w: 1200, h: 1920, wL: 1920, hL: 1200 },
  "android-10": { w: 1600, h: 2560, wL: 2560, hL: 1600 },
  "feature-graphic": { w: 1024, h: 500 },
  /** Apple Watch Ultra 3 — App Store scales down to smaller watches. */
  watch: { w: 422, h: 514 },
  /** Apple TV / Android TV / Fire TV marketing screenshots (1080p landscape). */
  "apple-tv": { w: 1920, h: 1080 },
  "android-tv": { w: 1920, h: 1080 },
};

export const EXPORT_SIZES: Record<DeviceKind, ExportSize[]> = {
  iphone: [
    { label: '6.9"', w: 1320, h: 2868 },
    { label: '6.5"', w: 1242, h: 2688 },
  ],
  ipad: [{ label: '13" iPad', w: 2064, h: 2752 }],
  android: [{ label: "Phone", w: 1080, h: 1920 }],
  "android-7": [{ label: '7" Portrait', w: 1200, h: 1920 }],
  "android-10": [{ label: '10" Portrait', w: 1600, h: 2560 }],
  "feature-graphic": [{ label: "Feature Graphic", w: 1024, h: 500 }],
  watch: [{ label: "Ultra 3", w: 422, h: 514 }],
  "apple-tv": [{ label: "Apple TV 1080p", w: 1920, h: 1080 }],
  "android-tv": [{ label: "Android TV / Fire TV 1080p", w: 1920, h: 1080 }],
};

/** Accepted Apple Watch screenshot sizes (upload one size consistently across locales). */
export const WATCH_SCREENSHOT_SIZES = [
  { label: "Ultra 3", w: 422, h: 514 },
  { label: "Ultra 2 / Ultra", w: 410, h: 502 },
  { label: "Series 11 / 10", w: 416, h: 496 },
  { label: "Series 9 / 8 / 7", w: 396, h: 484 },
  { label: "Series 6 / 5 / 4 / SE", w: 368, h: 448 },
  { label: "Series 3", w: 312, h: 390 },
] as const;

/** Preferred capture size — Apple auto-scales to smaller watches. */
export const WATCH_PREFERRED_SIZE = WATCH_SCREENSHOT_SIZES[0];

/** Watch store slide filenames produced by `pnpm screenshots:watch`. */
export const WATCH_SLIDE_SCENES: SlideScenes = spec.watch.slideScenes;

/** Preferred TV store size (Apple TV + Android TV / Fire TV screenshots). */
export const TV_PREFERRED_SIZE: ExportSize = spec.tv.preferredSize;

/** TV store slide filenames from `pnpm screenshots:tvos` / `screenshots:android-tv`. */
export const TV_SLIDE_SCENES: SlideScenes = spec.tv.slideScenes;

/** Amazon Fire TV console assets (not in APK) — regenerate via `pnpm generate:app:brand-assets`. */
export const FIRE_TV_CONSOLE_ASSETS = [
  { file: "firetv-background-1920x1080.png", w: 1920, h: 1080, role: "background" },
  { file: "firetv-icon-1280x720.png", w: 1280, h: 720, role: "icon-large" },
  { file: "firetv-icon-512.png", w: 512, h: 512, role: "icon-512" },
  { file: "firetv-icon-114.png", w: 114, h: 114, role: "icon-114" },
] as const;

export const EXPORT_SIZES_LANDSCAPE: Partial<Record<DeviceKind, ExportSize[]>> = {
  "android-7": [{ label: '7" Landscape', w: 1920, h: 1200 }],
  "android-10": [{ label: '10" Landscape', w: 2560, h: 1600 }],
  "apple-tv": [{ label: "Apple TV 1080p", w: 1920, h: 1080 }],
  "android-tv": [{ label: "Android TV / Fire TV 1080p", w: 1920, h: 1080 }],
};

/** Raw app captures synced into the studio (see tools/screenshot-studio/scripts/sync-app-screenshots.mjs). */
export const CAPTURE_FILES: readonly string[] = spec.captureFiles;

/** Marketing slide order → export filename prefix (01-home.png, …). */
export const SLIDE_SCENES: SlideScenes = spec.slideScenes;

export const STORE_ASSETS_ROOT: string = spec.storeAssetsRoot;
