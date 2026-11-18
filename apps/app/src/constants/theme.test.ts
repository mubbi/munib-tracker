import { loadOnPlatform, usePlatform } from "@/test-support/platform";

import { createShadow, withAlpha } from "./theme";

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
