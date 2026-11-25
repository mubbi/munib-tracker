import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { APP_DESCRIPTION, APP_NAME } from "@munib-tracker/shared/constants";
import { resolveTheme } from "@munib-tracker/theme/resolve";

import appJson from "../../app.json";
import publicManifest from "../../public/manifest.json";
import {
  PWA_SCREENSHOTS,
  PWA_SHORTCUTS,
  PWA_THEME_COLOR,
  PWA_THEME_COLOR_DARK,
  PWA_THEME_COLOR_LIGHT,
  pwaWebManifest,
  resolvePwaManifestForLocale,
} from "./pwa";

const LIGHT_BACKGROUND = resolveTheme("light", "light").background;

const APP_DIR = join(__dirname, "..", "app");
const PUBLIC_DIR = join(__dirname, "..", "..", "public");

/** Every URL the file-based router serves (group segments stripped, dynamic routes skipped). */
function staticRoutes(dir = APP_DIR, out = new Set<string>()): Set<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      staticRoutes(full, out);
      continue;
    }
    if (!/\.tsx$/.test(entry.name) || /^[_+]|\[|\.test\./.test(entry.name)) continue;
    const segments = relative(APP_DIR, full)
      .replace(/\.tsx$/, "")
      .split(sep)
      .filter((segment) => !/^\(.*\)$/.test(segment) && segment !== "index");
    if (segments.some((segment) => segment.startsWith("["))) continue;
    out.add(`/${segments.join("/")}`);
  }
  return out;
}

/** Pixel size of a PNG (IHDR) or baseline/progressive JPEG (SOF marker). */
function imageSize(file: string): { width: number; height: number } {
  const bytes = readFileSync(file);
  if (bytes.readUInt32BE(0) === 0x89504e47) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  let offset = 2;
  while (offset < bytes.length) {
    const marker = bytes[offset + 1];
    const length = bytes.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  throw new Error(`Unrecognised image: ${file}`);
}

/** Loads a fresh copy of the module against a substitute `app.json`. */
function loadWithAppJson(expo: Record<string, unknown>): typeof import("./pwa") {
  let mod!: typeof import("./pwa");
  jest.isolateModules(() => {
    jest.doMock("../../app.json", () => ({ expo }));
    mod = require("./pwa");
  });
  return mod;
}

describe("pwaWebManifest", () => {
  it("is built from the app's web config", () => {
    expect(pwaWebManifest).toMatchObject({
      name: "Munib Tracker",
      display: "standalone",
    });
  });

  it("takes its colours from the light theme base (no dark first paint)", () => {
    expect(pwaWebManifest.theme_color).toBe(LIGHT_BACKGROUND);
    expect(pwaWebManifest.background_color).toBe(LIGHT_BACKGROUND);
    expect(PWA_THEME_COLOR).toBe(LIGHT_BACKGROUND);
    expect(PWA_THEME_COLOR_LIGHT).toBe(LIGHT_BACKGROUND);
    expect(PWA_THEME_COLOR_DARK).toBe(resolveTheme("dark", "dark").background);
  });

  it("keeps app.json and the committed manifest in step with the theme", () => {
    // `scripts/sync-pwa-manifest.mjs` writes public/manifest.json from app.json.
    expect(appJson.expo.web).toMatchObject({
      themeColor: LIGHT_BACKGROUND,
      backgroundColor: LIGHT_BACKGROUND,
    });
    expect(publicManifest).toMatchObject({
      theme_color: LIGHT_BACKGROUND,
      background_color: LIGHT_BACKGROUND,
    });
  });

  it("commits exactly the manifest the config describes", () => {
    // `scripts/sync-pwa-manifest.mjs` mirrors these fields by hand — keep both in step.
    expect(publicManifest).toEqual(pwaWebManifest);
  });

  it("rotates freely on tablets and Chromebooks", () => {
    expect(pwaWebManifest.orientation).toBe("any");
  });

  it("ships a 512px maskable icon", () => {
    expect(pwaWebManifest.icons).toContainEqual(
      expect.objectContaining({ sizes: "512x512", purpose: "maskable" }),
    );
  });

  it("meets Chrome / Edge install criteria (web.dev install-criteria)", () => {
    const anySizes = pwaWebManifest.icons
      .filter((icon) => icon.purpose === "any")
      .map((icon) => icon.sizes);
    expect(anySizes).toEqual(expect.arrayContaining(["192x192", "512x512"]));
    expect(pwaWebManifest.short_name.length).toBeGreaterThan(0);
    expect(pwaWebManifest.start_url).toBe("/");
    expect(["fullscreen", "standalone", "minimal-ui"]).toContain(pwaWebManifest.display);
    expect(pwaWebManifest.prefer_related_applications).toBe(false);
  });

  it("keeps maskable icons separate from the full-bleed 'any' icons", () => {
    const maskable = pwaWebManifest.icons.filter((icon) => icon.purpose === "maskable");
    const anySrcs = new Set(
      pwaWebManifest.icons.filter((icon) => icon.purpose === "any").map((icon) => icon.src),
    );
    expect(maskable.map((icon) => icon.sizes)).toEqual(["192x192", "512x512"]);
    for (const icon of maskable) expect(anySrcs.has(icon.src)).toBe(false);
  });

  it("re-uses the open window for launches", () => {
    expect(pwaWebManifest.launch_handler).toEqual({ client_mode: ["navigate-existing", "auto"] });
  });

  it("has narrow and wide screenshots that fit Chrome's richer install UI", () => {
    for (const formFactor of ["narrow", "wide"]) {
      const shots = PWA_SCREENSHOTS.filter((shot) => shot.form_factor === formFactor);
      expect(shots.length).toBeGreaterThan(0);
      const ratios = new Set<string>();
      for (const shot of shots) {
        const [width, height] = shot.sizes.split("x").map(Number);
        // Declared size = real file size.
        expect(imageSize(join(PUBLIC_DIR, shot.src))).toEqual({ width, height });
        expect(Math.min(width, height)).toBeGreaterThanOrEqual(320);
        expect(Math.max(width, height)).toBeLessThanOrEqual(3840);
        expect(Math.max(width, height) / Math.min(width, height)).toBeLessThanOrEqual(2.3);
        expect(formFactor === "wide" ? width > height : height > width).toBe(true);
        expect(shot.label.length).toBeGreaterThan(0);
        ratios.add((width / height).toFixed(3));
      }
      // Same aspect ratio within a form factor.
      expect(ratios.size).toBe(1);
    }
    expect(PWA_SCREENSHOTS.length).toBeLessThanOrEqual(8);
  });

  it("offers Mark Salah, Qibla and Tasbeeh shortcuts to existing routes", () => {
    const routes = staticRoutes();
    expect(PWA_SHORTCUTS.map((shortcut) => shortcut.name)).toEqual([
      "Mark Salah",
      "Qibla",
      "Tasbeeh",
    ]);
    for (const shortcut of PWA_SHORTCUTS) {
      expect(routes).toContain(shortcut.url);
    }
  });

  it("serves every manifest image from public/", () => {
    const images = [
      ...pwaWebManifest.icons,
      ...PWA_SHORTCUTS.flatMap((shortcut) => shortcut.icons),
      ...PWA_SCREENSHOTS,
    ];
    for (const { src } of images) {
      expect(existsSync(join(PUBLIC_DIR, src))).toBe(true);
    }
  });

  it("falls back to the app name, theme colour and shared description", () => {
    const { pwaWebManifest: manifest } = loadWithAppJson({ name: "Fallback" });
    expect(manifest).toMatchObject({
      name: "Fallback",
      description: APP_DESCRIPTION,
      theme_color: LIGHT_BACKGROUND,
      background_color: LIGHT_BACKGROUND,
    });
  });

  it("uses the shared app name when Expo has none", () => {
    expect(loadWithAppJson({}).pwaWebManifest.short_name).toBe(APP_NAME);
  });
});

describe("resolvePwaManifestForLocale", () => {
  it("defaults to English left-to-right", () => {
    expect(resolvePwaManifestForLocale()).toMatchObject({ lang: "en", dir: "ltr" });
  });

  it("switches language and direction for Arabic", () => {
    expect(resolvePwaManifestForLocale("ar")).toMatchObject({
      dir: "rtl",
      lang: expect.stringMatching(/^ar/),
    });
  });
});
