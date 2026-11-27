import { StyleSheet } from "react-native";
import { loadOnPlatform, usePlatform } from "@/test-support/platform";

import {
  BorderWidth,
  Breakpoints,
  Control,
  createShadow,
  HeroSky,
  IconSize,
  Metal,
  Opacity,
  Radius,
  Spacing,
  withAlpha,
  ZIndex,
} from "./theme";

describe("withAlpha", () => {
  it.each([
    ["#112233", 0.5, "#11223380"],
    ["#112233", 2, "#112233ff"],
    ["#112233", -1, "#11223300"],
    ["#123", 0.5, "#123"],
  ])("withAlpha(%p, %p) is %p", (hex, alpha, expected) => {
    expect(withAlpha(hex, alpha)).toBe(expected);
  });
});

describe("createShadow on iOS", () => {
  usePlatform({ OS: "ios" });

  it("uses native shadow props with defaults", () => {
    expect(createShadow("#000000")).toEqual({
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    });
  });
});

describe("createShadow on Android", () => {
  usePlatform({ OS: "android" });

  it("derives elevation from the blur", () => {
    expect(createShadow("#000000", { blur: 12 })).toEqual({ elevation: 4 });
  });

  it("honours an explicit elevation", () => {
    expect(createShadow("#000000", { elevation: 9 })).toEqual({ elevation: 9 });
  });
});

describe("createShadow on web", () => {
  usePlatform({ OS: "web" });

  it("emits a CSS box-shadow with the colour's alpha", () => {
    expect(createShadow("#000000", { offsetX: 1, offsetY: 3, blur: 4, opacity: 0.5 })).toEqual({
      boxShadow: "1px 3px 4px #00000080",
    });
  });
});

describe("platform constants", () => {
  it.each([
    ["ios", 84, "system-ui"],
    ["android", 72, "normal"],
    ["web", 72, "var(--font-display)"],
  ] as const)("on %s the tab inset is %p and sans font %p", (os, inset, sans) => {
    const theme = loadOnPlatform({ OS: os }, () => require("./theme") as typeof import("./theme"));
    expect(theme.BottomTabInset).toBe(inset);
    expect(theme.Fonts?.sans).toBe(sans);
  });
});

describe("layout and geometry tokens", () => {
  it("matches the spacing and radius scale", () => {
    expect(Spacing).toEqual({
      half: 2,
      one: 4,
      oneHalf: 6,
      two: 8,
      twoHalf: 10,
      three: 16,
      four: 24,
      five: 32,
      six: 64,
    });
    expect(Radius).toEqual({ xs: 6, sm: 10, md: 14, lg: 20, xl: 28, pill: 999 });
  });

  it("matches the border, control, icon, z-index, opacity and breakpoint tables", () => {
    expect(BorderWidth).toEqual({ hairline: StyleSheet.hairlineWidth, thin: 1, thick: 2 });
    expect(Control).toEqual({ sm: 36, md: 44, lg: 52, row: 52, field: 50, minTouch: 44 });
    expect(IconSize).toEqual({ xs: 12, sm: 14, md: 16, lg: 20, xl: 24, hero: 28 });
    expect(ZIndex).toEqual({
      base: 0,
      raised: 1,
      sticky: 10,
      header: 20,
      overlay: 1000,
      modal: 2000,
      toast: 3000,
      gate: 4000,
    });
    expect(Opacity).toEqual({ disabled: 0.5, pressed: 0.88 });
    expect(Breakpoints).toEqual({ tablet: 768, listDetail: 900, wide: 1024, xwide: 1600 });
    expect(Metal).toEqual({ gold: "#D4A017", silver: "#A8B0B8" });
  });

  it("uses the 48dp touch floor on Android", () => {
    const theme = loadOnPlatform(
      { OS: "android" },
      () => require("./theme") as typeof import("./theme"),
    );
    expect(theme.Control.minTouch).toBe(48);
  });

  it("scales layout tokens on Apple TV but never icon sizes or the touch floor", () => {
    const theme = loadOnPlatform(
      { OS: "ios", isTV: true },
      () => require("./theme") as typeof import("./theme"),
    );
    expect(theme.Spacing.oneHalf).toBe(12);
    expect(theme.Spacing.twoHalf).toBe(20);
    expect(theme.Radius.xs).toBe(12);
    expect(theme.Control.md).toBe(88);
    expect(theme.BorderWidth.thin).toBe(2);
    expect(theme.BorderWidth.hairline).toBe(StyleSheet.hairlineWidth);
    // `IconSize` is raw dp: the expo-symbols TV shim applies TV_DENSITY itself.
    expect(theme.IconSize.md).toBe(16);
    expect(theme.Control.minTouch).toBe(44);
    expect(theme.ZIndex.toast).toBe(3000);
    expect(theme.Breakpoints.tablet).toBe(768);
  });
});

describe("HeroSky", () => {
  it("holds every raw hero colour as a constant string", () => {
    for (const value of Object.values(HeroSky)) {
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    }
    expect(HeroSky.sunCore).toMatch(/^#/);
  });
});
