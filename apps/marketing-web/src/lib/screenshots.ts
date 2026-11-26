import { APP_NAME } from "@munib-tracker/shared/constants";
import { useLocale, useTranslations } from "next-intl";
import type { ScreenshotKey } from "@/content/types";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { SCREENSHOT_MANIFEST } from "@/lib/screenshot-manifest.generated";

/**
 * Real captures of the shipping app — per device, per locale, per theme —
 * synced from `apps/app/store-assets/captures-native/**` by
 * `pnpm --filter marketing-web sync:screenshots` (see the generated manifest).
 * Never add mock-ups here; only screens the app actually renders.
 *
 * A visitor sees the app in their language: every lookup takes the page
 * locale and falls back to English where a device has no capture in it
 * (Apple Watch, Wear OS).
 */

/** Devices with real captures. */
export type Device = keyof typeof SCREENSHOT_MANIFEST;

/** Frame drawn around a capture. */
export type Frame = "phone" | "android" | "tablet" | "tablet-landscape" | "tv" | "watch" | "round";

export const DEVICE_FRAME: Record<Device, Frame> = {
  iphone: "phone",
  android: "android",
  ipad: "tablet",
  "android-tablet": "tablet-landscape",
  tv: "tv",
  watch: "watch",
  wear: "round",
};

/** Phone/tablet scenes captured on every handheld device. */
export type HandheldScene =
  | "home"
  | "tracker"
  | "qaza"
  | "zikr"
  | "tasbeeh"
  | "quran"
  | "qibla"
  | "names";

export type Theme = "dark" | "light";

/** Image facts for one capture. */
export type Screenshot = {
  src: string;
  width: number;
  height: number;
  frame: Frame;
  device: Device;
  /** Locale of the capture itself (English when the page locale has none). */
  locale: Locale;
};

/** A screenshot plus its translated alt text. */
export type LocalizedScreenshot = Screenshot & { alt: string };

type Capture = { device: Device; scene: string; theme?: Theme };

/** Content keys (`ScreenshotSlot.key`) → the capture they show by default. */
const KEYS: Record<Exclude<ScreenshotKey, "offline-data">, Capture> = {
  home: { device: "iphone", scene: "home" },
  "home-light": { device: "iphone", scene: "home", theme: "light" },
  tracker: { device: "iphone", scene: "tracker" },
  "tracker-light": { device: "iphone", scene: "tracker", theme: "light" },
  qaza: { device: "iphone", scene: "qaza" },
  zikr: { device: "iphone", scene: "zikr" },
  "zikr-light": { device: "iphone", scene: "zikr", theme: "light" },
  tasbeeh: { device: "iphone", scene: "tasbeeh" },
  quran: { device: "iphone", scene: "quran" },
  "quran-light": { device: "iphone", scene: "quran", theme: "light" },
  qibla: { device: "iphone", scene: "qibla" },
  names: { device: "iphone", scene: "names" },
  "watch-schedule": { device: "watch", scene: "schedule" },
  "wear-salah-tile": { device: "wear", scene: "salah-tile" },
  "wear-tasbeeh-tile": { device: "wear", scene: "tasbeeh-tile" },
  "tv-home": { device: "tv", scene: "home" },
};

/** Settings → Offline data: a single English capture outside the device matrix. */
const OFFLINE_DATA: Screenshot = {
  src: "/screenshots/offline-data.webp",
  width: 960,
  height: 2133,
  frame: "phone",
  device: "iphone",
  locale: DEFAULT_LOCALE,
};

function has(device: Device, path: string): boolean {
  return (SCREENSHOT_MANIFEST[device].files as readonly string[]).includes(path);
}

/** True when `device` has a capture of `scene` (in any locale). */
export function hasScene(device: Device, scene: string): boolean {
  return has(device, `${DEFAULT_LOCALE}/dark/${scene}`);
}

/**
 * The capture of `scene` on `device` in `locale` — falling back to English,
 * then to the dark theme. Throws for a scene the device never captured.
 */
export function capture(
  device: Device,
  scene: string,
  locale: Locale = DEFAULT_LOCALE,
  theme: Theme = "dark",
): Screenshot {
  const candidates: [Locale, Theme][] = [
    [locale, theme],
    [DEFAULT_LOCALE, theme],
    [locale, "dark"],
    [DEFAULT_LOCALE, "dark"],
  ];
  const hit = candidates.find(([l, t]) => has(device, `${l}/${t}/${scene}`));
  if (!hit) throw new Error(`No ${device} capture of "${scene}"`);
  const [l, t] = hit;
  const { width, height } = SCREENSHOT_MANIFEST[device];
  return {
    src: `/screenshots/${device}/${l}/${t}/${scene}.webp`,
    width,
    height,
    frame: DEVICE_FRAME[device],
    device,
    locale: l,
  };
}

/**
 * Image facts for a content key in `locale`. `device` swaps a phone key onto
 * another handheld (e.g. `{ device: "android" }` or `"ipad"`) when that
 * device captured the same scene.
 */
export function getScreenshot(
  key: ScreenshotKey,
  locale: Locale = DEFAULT_LOCALE,
  device?: Device,
): Screenshot {
  if (key === "offline-data") return OFFLINE_DATA;
  const base = KEYS[key];
  const target = device && hasScene(device, base.scene) ? device : base.device;
  return capture(target, base.scene, locale, base.theme);
}

type ScreenshotsT = ReturnType<typeof useTranslations<"screenshots">>;

/**
 * Translated alt text for `key`, given a `screenshots` translator — for async
 * code: `screenshotAlt(await getTranslations("screenshots"), key)`.
 */
export function screenshotAlt(t: ScreenshotsT, key: ScreenshotKey): string {
  return t(`alt.${key}`, { appName: APP_NAME });
}

/** `getScreenshot(key)` in the page locale, plus its translated alt (non-async components). */
export function useScreenshot(
  key: ScreenshotKey,
  options: { device?: Device } = {},
): LocalizedScreenshot {
  const t = useTranslations("screenshots");
  const locale = useLocale();
  return { ...getScreenshot(key, locale, options.device), alt: screenshotAlt(t, key) };
}

type CaptureT = ReturnType<typeof useTranslations<"screenshots">>;

/** Translated alt for any capture: "{appName} on {device}: {scene}". */
export function captureAlt(t: CaptureT, device: Device, scene: string): string {
  const sceneKey = `scenes.${scene}` as Parameters<CaptureT>[0];
  return t("captureAlt", {
    appName: APP_NAME,
    device: t(`devices.${device}`),
    scene: t.has(sceneKey) ? t(sceneKey) : scene,
  });
}

/**
 * Any capture (device × scene) in the page locale with translated alt text —
 * for device showcases beyond the content keys:
 *   const tv = useCapture("tv", "home");  <DeviceScreen shot={tv} />
 */
export function useCapture(
  device: Device,
  scene: string,
  theme: Theme = "dark",
): LocalizedScreenshot {
  const t = useTranslations("screenshots");
  const locale = useLocale();
  return { ...capture(device, scene, locale, theme), alt: captureAlt(t, device, scene) };
}
