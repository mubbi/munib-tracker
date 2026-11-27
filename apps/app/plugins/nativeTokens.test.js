const fs = require("node:fs");
const path = require("node:path");

const { nativeTokens } = require("@munib-tracker/theme/native-tokens");
const { OUTPUTS, renderAll } = require("../scripts/lib/native-tokens-render.cjs");
const { StatusPalette } = require("../src/constants/theme");

/**
 * Drift guard for lane N-A: every committed native palette must equal
 * `packages/theme/src/native-tokens.ts`. Fix with `pnpm --filter app generate:native-tokens`.
 */
const APP_ROOT = path.join(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(APP_ROOT, rel), "utf8");
const hex = (s) => s.toLowerCase();

describe("native token drift", () => {
  for (const [rel, expected] of Object.entries(renderAll(nativeTokens))) {
    it(`${rel} is up to date`, () => {
      expect(read(rel)).toBe(expected);
    });
  }

  it("status hues mirror the app StatusPalette", () => {
    expect(nativeTokens.status).toEqual({ ...StatusPalette });
  });

  const { light, dark, defaultAccent, status } = nativeTokens;
  const accent = hex(defaultAccent.light);

  it("Swift WidgetPalette reads MunibTokens (no inline hex palette)", () => {
    const swift = read("targets/_shared/WidgetSnapshotStore.swift");
    expect(swift).toMatch(/lightCard = MunibTokens\.lightCard/);
    expect(swift).toMatch(/darkSecondary = MunibTokens\.darkTextSecondary/);
    expect(swift).toContain(`"primary":"${defaultAccent.light}"`);
  });

  it("Swift module payload defaults mirror the light palette", () => {
    const live = read("modules/munib-live-activity/ios/MunibLiveActivityModule.swift");
    expect(live).toContain(`var primary: String = "${defaultAccent.light}"`);
    expect(live).toContain(`var background: String = "${light.background}"`);
    expect(live).toContain(`var cardBackground: String = "${light.card}"`);
    expect(live).toContain(`var textPrimary: String = "${light.text}"`);
    expect(live).toContain(`var textSecondary: String = "${light.textSecondary}"`);
    const focus = read("modules/munib-focus-lock/ios/MunibFocusLockModule.swift");
    expect(focus).toContain(`var accent: String = "${defaultAccent.light}"`);
    expect(focus).toContain(`var background: String = "${light.background}"`);
    expect(focus).toContain(`var foreground: String = "${light.text}"`);
    expect(focus).toContain(`var muted: String = "${light.textSecondary}"`);
  });

  it("expo-target configs and plugins read the generated JSON", () => {
    for (const rel of [
      "targets/munib-tracker-widgets/expo-target.config.js",
      "targets/munib-tracker-watch-widgets/expo-target.config.js",
    ]) {
      const src = read(rel);
      expect(src).toContain("plugins/generated/native-tokens.json");
      expect(src).not.toMatch(/#[0-9A-Fa-f]{6}\b/);
    }
    expect(read("plugins/homeScreenSurfaces.cjs")).toContain("generated/native-tokens.json");
    const gallery = read("plugins/withAndroidWidgetGallery.cjs");
    expect(gallery).toContain("generated/native-tokens.json");
    expect(gallery).not.toMatch(/#(059669|FFFDF9|152921|4A5F56)/i);
  });

  it("no stale emerald default accent remains in native palette sources", () => {
    const files = [
      "src/lib/appSurfaces/widgets/widgetTokens.ts",
      "src/lib/appSurfaces/widgets/types.ts",
      "plugins/homeScreenSurfaces.cjs",
      "plugins/withAndroidWidgetGallery.cjs",
      "scripts/screenshots/lib/watch-scenes.mjs",
      "plugins/wear-os/src/main/java/expo/modules/munibwear/WearShared.kt",
    ];
    for (const rel of files) expect(read(rel)).not.toMatch(/#059669|0xFF10B981/i);
    expect(accent).toBe("#2e7d32");
  });

  it("Wear colours come from the generated tokens (dark set)", () => {
    const wear = read("plugins/wear-os/src/main/java/expo/modules/munibwear/WearShared.kt");
    expect(wear).toContain("const val TEXT = WearTokens.TEXT");
    const gen = read(OUTPUTS.wear);
    expect(gen.toUpperCase()).toContain(dark.text.slice(1).toUpperCase());
    expect(gen.toUpperCase()).toContain(status.warning.slice(1).toUpperCase());
  });
});
