/** Shared App Store / Play Store screenshot dimensions and asset layout for Munib Tracker. */

export const STORE_SCREENSHOT_LOCALES = ["en", "ar", "ur"] as const;
export type StoreScreenshotLocale = (typeof STORE_SCREENSHOT_LOCALES)[number];

export type ExportSize = { label: string; w: number; h: number };

export type DeviceKind =
  | "iphone"
  | "ipad"
  | "android"
  | "android-7"
  | "android-10"
  | "feature-graphic";

export const CANVAS: Record<DeviceKind, { w: number; h: number; wL?: number; hL?: number }> = {
  iphone: { w: 1320, h: 2868 },
  ipad: { w: 2064, h: 2752 },
  android: { w: 1080, h: 1920 },
  "android-7": { w: 1200, h: 1920, wL: 1920, hL: 1200 },
  "android-10": { w: 1600, h: 2560, wL: 2560, hL: 1600 },
  "feature-graphic": { w: 1024, h: 500 },
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
};

export const EXPORT_SIZES_LANDSCAPE: Partial<Record<DeviceKind, ExportSize[]>> = {
  "android-7": [{ label: '7" Landscape', w: 1920, h: 1200 }],
  "android-10": [{ label: '10" Landscape', w: 2560, h: 1600 }],
};

/** Raw app captures synced into the studio (see tools/screenshot-studio/scripts/sync-app-screenshots.mjs). */
export const CAPTURE_FILES = [
  "home",
  "tracker",
  "qaza",
  "zikr",
  "quran",
  "settings-privacy",
  "settings-sync",
] as const;

/** Marketing slide order → export filename prefix (01-home.png, …). */
export const SLIDE_SCENES: Record<string, string> = {
  "01": "01-home",
  "02": "02-salah",
  "03": "03-qaza",
  "04": "04-library",
  "05": "05-privacy",
  "06": "06-offline",
  "07": "07-more",
};

export const STORE_ASSETS_ROOT = "apps/app/store-assets";
