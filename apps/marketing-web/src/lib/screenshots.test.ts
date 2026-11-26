import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LOCALES } from "@/i18n/routing";
import { SCREENSHOT_MANIFEST } from "@/lib/screenshot-manifest.generated";
import { capture, type Device, getScreenshot } from "@/lib/screenshots";

describe("screenshot registry", () => {
  it("every manifest entry exists in /public", () => {
    for (const [device, entry] of Object.entries(SCREENSHOT_MANIFEST)) {
      for (const file of entry.files) {
        const path = join(process.cwd(), "public/screenshots", device, `${file}.webp`);
        expect(existsSync(path), path).toBe(true);
      }
    }
  });

  it("shows handheld screens in the page language", () => {
    for (const locale of LOCALES) {
      for (const device of ["iphone", "android", "ipad", "android-tablet", "tv"] as Device[]) {
        expect(capture(device, "home", locale).src).toBe(
          `/screenshots/${device}/${locale}/dark/home.webp`,
        );
      }
    }
  });

  it("falls back to English and to the dark theme", () => {
    expect(capture("watch", "schedule", "ar").locale).toBe("en");
    expect(capture("android", "home", "ur", "light").src).toBe(
      "/screenshots/android/ur/dark/home.webp",
    );
  });

  it("maps content keys and swaps devices", () => {
    expect(getScreenshot("qaza", "ur").src).toBe("/screenshots/iphone/ur/dark/qaza.webp");
    expect(getScreenshot("qaza", "ur", "android").frame).toBe("android");
    expect(getScreenshot("home-light", "ar").src).toBe("/screenshots/iphone/ar/light/home.webp");
    // TV has no qaza scene: stays on the key's own device.
    expect(getScreenshot("qaza", "en", "tv").device).toBe("iphone");
    expect(getScreenshot("tv-home", "ar").frame).toBe("tv");
  });
});
