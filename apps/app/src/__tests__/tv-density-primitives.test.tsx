import { loadOnPlatform } from "@/test-support/platform";

/**
 * P10-04: tvOS lays out at 2x units, so every token a primitive reads must
 * already be scaled exactly once (never bare, never twice). Loaded in an
 * isolated registry on `ios + isTV` so `TV_DENSITY === 2`.
 */
const tvOS = () =>
  loadOnPlatform({ OS: "ios", isTV: true }, () => ({
    density: require("@/constants/tv-density") as typeof import("@/constants/tv-density"),
    theme: require("@/constants/theme") as typeof import("@/constants/theme"),
    layout: require("@/constants/tv-layout") as typeof import("@/constants/tv-layout"),
    button: require("@/components/ui/button") as typeof import("@/components/ui/button"),
  }));

describe("TV_DENSITY = 2 (tvOS)", () => {
  it("doubles layout tokens exactly once", () => {
    const { density, theme, layout } = tvOS();
    expect(density.TV_DENSITY).toBe(2);
    expect(theme.Control.md).toBe(88);
    expect(theme.Control.sm).toBe(72);
    expect(theme.Control.lg).toBe(104);
    expect(theme.Control.row).toBe(104);
    expect(theme.Control.field).toBe(100);
    expect(theme.BorderWidth.thin).toBe(2);
    expect(layout.TvLayout.minFocusTarget).toBe(128);
    expect(layout.TvLayout.chipMinHeight).toBe(96);
    expect(layout.TvLayout.contentPaddingX).toBe(96);
    expect(layout.TvLayout.focusRingWidth).toBe(6);
  });

  it("keeps the unscaled escape hatches raw", () => {
    const { theme, layout } = tvOS();
    // APIs that apply tvDp() themselves take the raw dp (IconButton hitTarget).
    expect(layout.TvLayout.minFocusTargetDp).toBe(64);
    // ThemedText multiplies fonts; the token must not.
    expect(layout.TvLayout.bodyFontSize).toBe(18);
    // Icon sizes are raw dp: the SymbolView shim scales them.
    expect(theme.IconSize.md).toBeLessThan(40);
    expect(theme.Control.minTouch).toBe(44);
  });

  it("scales every Spacing and Radius step by 2 relative to Android TV", () => {
    const tv = tvOS();
    const android = loadOnPlatform({ OS: "android", isTV: true }, () => ({
      theme: require("@/constants/theme") as typeof import("@/constants/theme"),
    }));
    for (const [key, value] of Object.entries(android.theme.Spacing)) {
      expect((tv.theme.Spacing as Record<string, number>)[key]).toBe(value * 2);
    }
    for (const [key, value] of Object.entries(android.theme.Radius)) {
      if (typeof value !== "number" || value >= 999) continue;
      expect((tv.theme.Radius as Record<string, number>)[key]).toBe(value * 2);
    }
  });

  it("button min heights match the token ladder", () => {
    const { button, density } = tvOS();
    expect(button.buttonMinHeight("md", true)).toBe(density.tvDp(64));
  });
});
