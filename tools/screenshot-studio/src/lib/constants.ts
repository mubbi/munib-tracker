import type { Device, Orientation, Platform, SlideLayout, Theme, ThemeId } from "./types";

// ---------- Canvas dimensions (design at largest required resolution) ----------
// Every export size of a device must share the canvas aspect ratio (within ~2%;
// see captureSlide in screenshot-editor.tsx). Store slots whose accepted sizes
// have *different* aspect ratios (App Store creative assets: universal 16:9,
// header 21:9, search results 3:2) are therefore modelled as separate devices/decks.
export const CANVAS: Record<Device, { w: number; h: number; wL?: number; hL?: number }> = {
  iphone: { w: 1320, h: 2868 },
  "iphone-duo": { w: 2007, h: 2853, wL: 2853, hL: 2007 },
  ipad: { w: 2064, h: 2752 },
  "apple-watch": { w: 422, h: 514 },
  "apple-tv": { w: 3840, h: 2160 },
  "ios-universal": { w: 5244, h: 2950 },
  "ios-header-wide": { w: 3840, h: 1646 },
  "ios-search-3x2": { w: 3840, h: 2560 },
  android: { w: 1080, h: 1920 },
  "android-7": { w: 1200, h: 1920, wL: 1920, hL: 1200 },
  "android-10": { w: 1600, h: 2560, wL: 2560, hL: 1600 },
  // Play: 1:1, each side 384–3840 px, PNG/JPEG without transparency, ≤ 8 MB.
  "wear-os": { w: 1024, h: 1024 },
  // Play: 16:9, each side 320–3840 px, ≤ 8 MB (1080p keeps PNGs well under the cap).
  "android-tv": { w: 1920, h: 1080 },
  "tv-banner": { w: 1280, h: 720 },
  "feature-graphic": { w: 1024, h: 500 },
};

// ---------- Export sizes per device ----------
export type ExportSize = { label: string; w: number; h: number };

export const EXPORT_SIZES: Record<Device, ExportSize[]> = {
  // App Store Connect iPhone slots for Munib Tracker
  // (apps/app/store-assets/ios/screenshots/{6.9-inch,6.5-inch,6.3-inch}).
  // 6.3" = "iPhone with Dynamic Island (medium display)".
  iphone: [
    { label: '6.9"', w: 1320, h: 2868 },
    { label: '6.5"', w: 1242, h: 2688 },
    { label: '6.3"', w: 1206, h: 2622 },
  ],
  // iPhone Duo (foldable). ASC accepts either size per orientation.
  "iphone-duo": [
    { label: "iPhone Duo", w: 2007, h: 2853 },
    { label: "iPhone Duo (compact)", w: 1398, h: 2034 },
  ],
  // Single 13" iPad set for the App Store Connect iPad 13" display slot.
  ipad: [{ label: '13" iPad', w: 2064, h: 2752 }],
  // ASC "Apple Watch Ultra 4" slot — Apple scales down to smaller watches.
  "apple-watch": [
    { label: "Ultra 4 / Ultra 3", w: 422, h: 514 },
    { label: "Ultra 2 / Ultra", w: 410, h: 502 },
  ],
  "apple-tv": [
    { label: "Apple TV 4K", w: 3840, h: 2160 },
    { label: "Apple TV 1080p", w: 1920, h: 1080 },
  ],
  // App Store creative assets — one per locale (see CREATIVE_SAFE_AREA).
  "ios-universal": [{ label: "Universal 16:9", w: 5244, h: 2950 }],
  "ios-header-wide": [{ label: "Header 21:9", w: 3840, h: 1646 }],
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

// Landscape sizes (tablets + foldable). TV / banner canvases are landscape by
// definition and don't need an orientation toggle.
export const EXPORT_SIZES_LANDSCAPE: Partial<Record<Device, ExportSize[]>> = {
  "iphone-duo": [
    { label: "iPhone Duo Landscape", w: 2853, h: 2007 },
    { label: "iPhone Duo Landscape (compact)", w: 2034, h: 1398 },
  ],
  "android-7": [{ label: '7" Landscape', w: 1920, h: 1200 }],
  "android-10": [{ label: '10" Landscape', w: 2560, h: 1600 }],
};

// ---------- Device metadata ----------
export const DEVICE_PLATFORM: Record<Device, Platform> = {
  iphone: "ios",
  "iphone-duo": "ios",
  ipad: "ios",
  "apple-watch": "ios",
  "apple-tv": "ios",
  "ios-universal": "ios",
  "ios-header-wide": "ios",
  "ios-search-3x2": "ios",
  android: "android",
  "android-7": "android",
  "android-10": "android",
  "wear-os": "android",
  "android-tv": "android",
  "tv-banner": "android",
  "feature-graphic": "android",
};

/** Toolbar dropdown order per platform tab. */
export const DEVICES_BY_PLATFORM: Record<Platform, Device[]> = {
  ios: [
    "iphone",
    "iphone-duo",
    "ipad",
    "apple-watch",
    "apple-tv",
    "ios-universal",
    "ios-header-wide",
    "ios-search-3x2",
  ],
  android: [
    "android",
    "android-7",
    "android-10",
    "wear-os",
    "android-tv",
    "tv-banner",
    "feature-graphic",
  ],
};

/** Devices that only render the brand banner (icon + name + tagline). */
const BRAND_ONLY_DEVICES: ReadonlySet<Device> = new Set<Device>(["feature-graphic", "tv-banner"]);

// ---------- App Store creative assets (product page header / search results) ----------
// Apple, "Creative assets specifications" (App Store Connect Help) +
// https://developer.apple.com/app-store/asset-best-practices/ — iOS/iPadOS 27+.
// The App Store crops these canvases differently per device, orientation and
// placement; only the *art safe area* is guaranteed visible. Everything outside
// it is the "auxiliary art area": background atmosphere only, never text,
// the focal point, or anything that must be read. PNG without alpha.
export type SafeArea = { x: number; y: number; w: number; h: number };
export const CREATIVE_SAFE_AREA: Partial<Record<Device, SafeArea>> = {
  // Universal 16:9 — one image for both header and search results (PNG only).
  // Note the safe area sits *above* centre: the bottom is under App Store chrome.
  "ios-universal": { x: 1921, y: 660, w: 1402, h: 962 },
  // Product page header 21:9 (PNG only).
  "ios-header-wide": { x: 1097, y: 493, w: 1646, h: 661 },
  // Search results 3:2, max size; scales proportionally down to 1920×1280.
  "ios-search-3x2": { x: 836, y: 765, w: 2168, h: 1030 },
  // Google Play feature graphic 1024×500 (JPEG / 24-bit PNG, no alpha). Google
  // marks "cutoff zones" at the edges (UI overlays in some formats) but gives no
  // pixel values, so this is a conservative central focal zone: logo, name,
  // slogan and anything to read stay inside; edges carry background only.
  "feature-graphic": { x: 160, y: 75, w: 704, h: 350 },
  // Google Play / Android TV banner 1280×720: "full logo, icon + text", kept in
  // the safe area with no border and nothing cropped.
  "tv-banner": { x: 160, y: 170, w: 960, h: 380 },
};

/** Which composition a safe-area canvas renders. */
export type CreativeVariant = "app-store" | "feature-graphic" | "tv-banner";

const APP_STORE_CREATIVE: ReadonlySet<Device> = new Set<Device>([
  "ios-universal",
  "ios-header-wide",
  "ios-search-3x2",
]);

export function creativeSafeArea(device: Device): SafeArea | undefined {
  return CREATIVE_SAFE_AREA[device];
}

/** App Store creative-asset decks (header / search results). */
export function isCreativeAssetDevice(device: Device): boolean {
  return APP_STORE_CREATIVE.has(device);
}

export function creativeVariant(device: Device): CreativeVariant {
  if (device === "feature-graphic") return "feature-graphic";
  if (device === "tv-banner") return "tv-banner";
  return "app-store";
}

export function isBrandOnlyDevice(device: Device): boolean {
  return BRAND_ONLY_DEVICES.has(device);
}

/** Brand-only Play graphics (feature graphic / TV banner): no per-slide device or layout. */
export function rendersBrandBanner(device: Device, _layout?: SlideLayout): boolean {
  return isBrandOnlyDevice(device);
}

/**
 * Store artwork with a crop-safe zone (App Store creative assets, Play feature
 * graphic, TV banner) always renders the safe-area composition, whatever layout
 * an older project saved — free-form layouts are what put copy outside the safe
 * area and got it cropped.
 */
export function rendersCreativeAsset(device: Device): boolean {
  return device in CREATIVE_SAFE_AREA;
}

export function allowsLayout(device: Device, layout: SlideLayout): boolean {
  if (isCreativeAssetDevice(device)) return layout === "creative-asset";
  if (layout === "creative-asset") return false;
  if (isBrandOnlyDevice(device)) return layout === "feature-graphic";
  if (layout === "feature-graphic") return false;
  return true;
}

export function defaultLayoutFor(device: Device): SlideLayout {
  if (isCreativeAssetDevice(device)) return "creative-asset";
  if (isBrandOnlyDevice(device)) return "feature-graphic";
  if (device === "apple-watch" || device === "wear-os") return "full-bleed";
  return "device-bottom";
}

export function supportsLandscape(device: Device): boolean {
  return device in EXPORT_SIZES_LANDSCAPE;
}

export function getExportSizes(device: Device, orientation: Orientation): ExportSize[] {
  if (orientation === "landscape") {
    return EXPORT_SIZES_LANDSCAPE[device] || EXPORT_SIZES[device];
  }
  return EXPORT_SIZES[device];
}

// ---------- Frame aspect ratios ----------
// Outer w/h of each frame in components/editor/device-frames.tsx (FRAME_ASPECT
// there derives them from the capture ratio + rail + bezel, so the screen
// opening matches the real screenshot). Keep these in step with it.
export const MK_RATIO = 0.47669; // iPhone 17 Pro Max (1206×2622 screen)
export const ANDROID_RATIO = 0.46963; // Pixel-style phone (1080×2400 screen)
export const TAB_P_RATIO = 0.64334; // Android tablet portrait (10:16 screen)
export const TAB_L_RATIO = 1.5544; // Android tablet landscape
export const IPAD_RATIO = 0.76923; // iPad Pro 13" (2064×2752 screen)
export const FOLD_P_RATIO = 0.71925; // iPhone Duo unfolded, portrait (2007×2853 screen)
export const FOLD_L_RATIO = 1.39033; // iPhone Duo unfolded, landscape
export const WATCH_RATIO = 0.84834; // Apple Watch Ultra (422×514 screen)
export const WEAR_RATIO = 1; // round Wear OS watch
export const TV_RATIO = 1.74978; // 16:9 panel + thin bezel

// ---------- Width formula helpers ----------
export function phoneW(cW: number, cH: number, clamp = 0.78) {
  return Math.min(clamp, 0.68 * (cH / cW) * MK_RATIO);
}
export function phoneWSmall(cW: number, cH: number) {
  return phoneW(cW, cH, 0.6);
}
export function tabletPW(cW: number, cH: number, clamp = 0.8) {
  return Math.min(clamp, 0.72 * (cH / cW) * TAB_P_RATIO);
}
export function tabletLW(cW: number, cH: number, clamp = 0.62) {
  return Math.min(clamp, 0.75 * (cH / cW) * TAB_L_RATIO);
}
export function ipadW(cW: number, cH: number, clamp = 0.75) {
  return Math.min(clamp, 0.72 * (cH / cW) * IPAD_RATIO);
}
export function foldPW(cW: number, cH: number, clamp = 0.8) {
  return Math.min(clamp, 0.72 * (cH / cW) * FOLD_P_RATIO);
}
export function foldLW(cW: number, cH: number, clamp = 0.62) {
  return Math.min(clamp, 0.75 * (cH / cW) * FOLD_L_RATIO);
}
export function watchW(cW: number, cH: number, clamp = 0.72) {
  return Math.min(clamp, 0.66 * (cH / cW) * WATCH_RATIO);
}
export function wearW(cW: number, cH: number, clamp = 0.72) {
  return Math.min(clamp, 0.66 * (cH / cW) * WEAR_RATIO);
}
export function tvW(cW: number, cH: number, clamp = 0.78) {
  return Math.min(clamp, 0.66 * (cH / cW) * TV_RATIO);
}

// ---------- Themes ----------
export const DEFAULT_THEME_ID: ThemeId = "munib-tracker";

export const THEMES: Record<string, Theme> = {
  // Product brand language (apps/app Brand hero + Forest accent): deep green
  // prayer-hero surfaces, cream type, forest green labels — matches in-app UI.
  "munib-tracker": {
    id: "munib-tracker",
    name: "Munib Tracker",
    bg: "#0B2A22",
    bgAlt: "#12463A",
    fg: "#F2EFE6",
    fgAlt: "#F2EFE6",
    accent: "#66BB6A",
    muted: "#A9C6BB",
  },
  // Marketing site Day Arc night (apps/marketing-web .day-arc-scope): night
  // teal, emerald #34d399 brand, cool silver muted copy.
  "munib-night": {
    id: "munib-night",
    name: "Munib Night",
    bg: "#0B2226",
    bgAlt: "#0A1830",
    fg: "#F2F6F8",
    fgAlt: "#F2F6F8",
    accent: "#34D399",
    muted: "#B0C4CE",
  },
  // App light mode (docs/design-system.md colour table): cream page, ink
  // text, forest accent; inverted slides use the brand hero green.
  "munib-light": {
    id: "munib-light",
    name: "Munib Light",
    bg: "#F5F0E6",
    bgAlt: "#12463A",
    fg: "#152921",
    fgAlt: "#F2EFE6",
    accent: "#1F7A63",
    muted: "#4A6157",
  },
  "clean-light": {
    id: "clean-light",
    name: "Clean Light",
    bg: "#F6F1EA",
    bgAlt: "#171717",
    fg: "#171717",
    fgAlt: "#F6F1EA",
    accent: "#5B7CFA",
    muted: "#6B7280",
  },
  "dark-bold": {
    id: "dark-bold",
    name: "Dark Bold",
    bg: "#0B1020",
    bgAlt: "#F8FAFC",
    fg: "#F8FAFC",
    fgAlt: "#0B1020",
    accent: "#8B5CF6",
    muted: "#94A3B8",
  },
  "warm-editorial": {
    id: "warm-editorial",
    name: "Warm Editorial",
    bg: "#F7E8DA",
    bgAlt: "#2B1D17",
    fg: "#2B1D17",
    fgAlt: "#F7E8DA",
    accent: "#D97706",
    muted: "#7C5A47",
  },
  "ocean-fresh": {
    id: "ocean-fresh",
    name: "Ocean Fresh",
    bg: "#E0F2FE",
    bgAlt: "#0C4A6E",
    fg: "#0C4A6E",
    fgAlt: "#E0F2FE",
    accent: "#0284C7",
    muted: "#475569",
  },
  "bloom-roast": {
    id: "bloom-roast",
    name: "Bloom Roast",
    bg: "#F2ECE2",
    bgAlt: "#24352F",
    fg: "#1D2420",
    fgAlt: "#FFF7EA",
    accent: "#B8794A",
    muted: "#65736B",
  },
};

export function themeById(themeId: string | undefined): Theme {
  return THEMES[themeId || ""] || THEMES[DEFAULT_THEME_ID];
}

export function hasTheme(themeId: string | undefined): boolean {
  return !!themeId && !!THEMES[themeId];
}

export const STORAGE_KEY = "app-store-screenshots:project:v1";
export const PROJECT_SCHEMA_VERSION = 2;

export const DEVICE_LABEL: Record<Device, string> = {
  iphone: "iPhone",
  "iphone-duo": "iPhone Duo",
  ipad: "iPad",
  "apple-watch": "Apple Watch Ultra",
  "apple-tv": "Apple TV",
  "ios-universal": "Universal (Header + Search)",
  "ios-header-wide": "Product Page Header (21:9)",
  "ios-search-3x2": "Search Results (3:2)",
  android: "Android Phone",
  "android-7": 'Android 7" Tablet',
  "android-10": 'Android 10" Tablet',
  "wear-os": "Wear OS",
  "android-tv": "Android TV",
  "tv-banner": "Android TV Banner",
  "feature-graphic": "Feature Graphic",
};

// Friendly labels for slide layouts (used in dropdowns)
export const LAYOUT_LABEL: Record<SlideLayout, string> = {
  hero: "Hero",
  "device-bottom": "Device bottom",
  "device-top": "Device top",
  "two-devices": "Two devices",
  "no-device": "No device",
  "split-landscape": "Split (landscape)",
  "full-bleed": "Full-bleed screenshot",
  "feature-graphic": "Brand banner",
  "creative-asset": "App Store creative",
  "bleed-bottom": "Docked (bleed)",
  tilted: "Tilted",
  "feature-list": "Feature list",
};

// Short description shown under each layout name
export const LAYOUT_HINT: Record<SlideLayout, string> = {
  hero: "Headline above, device at bottom",
  "device-bottom": "Headline top, device anchored below",
  "device-top": "Flipped — device on top",
  "two-devices": "Layered back + front phones",
  "no-device": "Big standalone headline",
  "split-landscape": "Caption left, device right",
  "full-bleed": "Raw app screenshot fills the canvas — no frame or caption",
  "feature-graphic":
    "Feature graphic: name + value phrase centred, pattern at the edges · TV banner: icon + name",
  "creative-asset":
    "Icon + short phrase inside Apple's art safe area; phones and pattern fill the auxiliary area",
  "bleed-bottom": "Fixed headline band, large device docked to the bottom edge and bleeding off it",
  tilted: "Headline band, device tilted 7° and bleeding off the corner (Mirror flips it)",
  "feature-list": "Headline, glass feature chips, docked device",
};
