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

/**
 * Studio device kinds — mirrors `Device` in tools/screenshot-studio/src/lib/types.ts.
 * Every export size of a kind shares its canvas aspect ratio (within ~2%), so store
 * slots whose accepted sizes differ in aspect (header 16:9 vs ~21:9, search results
 * 16:9 vs 3:2) are separate kinds.
 */
export type DeviceKind =
  // App Store
  | "iphone"
  | "iphone-duo"
  | "ipad"
  | "apple-watch"
  | "apple-tv"
  | "ios-header"
  | "ios-header-wide"
  | "ios-search"
  | "ios-search-3x2"
  // Google Play
  | "android"
  | "android-7"
  | "android-10"
  | "wear-os"
  | "android-tv"
  | "tv-banner"
  | "feature-graphic";

export const CANVAS: Record<DeviceKind, { w: number; h: number; wL?: number; hL?: number }> = {
  iphone: { w: 1320, h: 2868 },
  /** iPhone Duo (foldable, unfolded) — portrait + landscape. */
  "iphone-duo": { w: 2007, h: 2853, wL: 2853, hL: 2007 },
  ipad: { w: 2064, h: 2752 },
  /** Apple Watch Ultra 4 / 3 — App Store scales down to smaller watches. */
  "apple-watch": { w: 422, h: 514 },
  "apple-tv": { w: 3840, h: 2160 },
  /** App Store product page header (16:9). */
  "ios-header": { w: 5244, h: 2950 },
  /** App Store product page header (~21:9). */
  "ios-header-wide": { w: 3840, h: 1646 },
  /** App Store search results asset (16:9). */
  "ios-search": { w: 5244, h: 2950 },
  /** App Store search results asset (3:2). */
  "ios-search-3x2": { w: 3840, h: 2560 },
  android: { w: 1080, h: 1920 },
  "android-7": { w: 1200, h: 1920, wL: 1920, hL: 1200 },
  "android-10": { w: 1600, h: 2560, wL: 2560, hL: 1600 },
  /** Play Wear OS: 1:1, 384–3840 px per side, no transparency, ≤ 8 MB. */
  "wear-os": { w: 1024, h: 1024 },
  /** Play Android TV: 16:9 (or 9:16), 320–3840 px per side, ≤ 8 MB. */
  "android-tv": { w: 1920, h: 1080 },
  /** Play Android TV banner: exactly 1280×720. */
  "tv-banner": { w: 1280, h: 720 },
  "feature-graphic": { w: 1024, h: 500 },
};

export const EXPORT_SIZES: Record<DeviceKind, ExportSize[]> = {
  iphone: [
    { label: '6.9"', w: 1320, h: 2868 },
    { label: '6.5"', w: 1242, h: 2688 },
    /** "iPhone with Dynamic Island (medium display)". */
    { label: '6.3"', w: 1206, h: 2622 },
  ],
  "iphone-duo": [
    { label: "iPhone Duo", w: 2007, h: 2853 },
    { label: "iPhone Duo (compact)", w: 1398, h: 2034 },
  ],
  ipad: [{ label: '13" iPad', w: 2064, h: 2752 }],
  "apple-watch": [
    { label: "Ultra 4 / Ultra 3", w: 422, h: 514 },
    { label: "Ultra 2 / Ultra", w: 410, h: 502 },
  ],
  "apple-tv": [
    { label: "Apple TV 4K", w: 3840, h: 2160 },
    { label: "Apple TV 1080p", w: 1920, h: 1080 },
  ],
  "ios-header": [{ label: "Header 16:9", w: 5244, h: 2950 }],
  "ios-header-wide": [{ label: "Header wide", w: 3840, h: 1646 }],
  "ios-search": [{ label: "Search results 16:9", w: 5244, h: 2950 }],
  "ios-search-3x2": [
    { label: "Search results 3:2", w: 3840, h: 2560 },
    { label: "Search results 3:2 (small)", w: 1920, h: 1280 },
  ],
  android: [{ label: "Phone", w: 1080, h: 1920 }],
  "android-7": [{ label: '7" Portrait', w: 1200, h: 1920 }],
  "android-10": [{ label: '10" Portrait', w: 1600, h: 2560 }],
  "wear-os": [{ label: "Wear OS 1:1", w: 1024, h: 1024 }],
  "android-tv": [{ label: "Android TV 1080p", w: 1920, h: 1080 }],
  "tv-banner": [{ label: "TV banner", w: 1280, h: 720 }],
  "feature-graphic": [{ label: "Feature Graphic", w: 1024, h: 500 }],
};

/** Accepted Apple Watch screenshot sizes (upload one size consistently across locales). */
export const WATCH_SCREENSHOT_SIZES = [
  { label: "Ultra 4 / Ultra 3", w: 422, h: 514 },
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
  "iphone-duo": [
    { label: "iPhone Duo Landscape", w: 2853, h: 2007 },
    { label: "iPhone Duo Landscape (compact)", w: 2034, h: 1398 },
  ],
  "android-7": [{ label: '7" Landscape', w: 1920, h: 1200 }],
  "android-10": [{ label: '10" Landscape', w: 2560, h: 1600 }],
};

/** Raw app captures synced into the studio (see tools/screenshot-studio/scripts/sync-app-screenshots.mjs). */
export const CAPTURE_FILES: readonly string[] = spec.captureFiles;

/** Marketing slide order → export filename prefix (01-home.png, …). */
export const SLIDE_SCENES: SlideScenes = spec.slideScenes;

export const STORE_ASSETS_ROOT: string = spec.storeAssetsRoot;
