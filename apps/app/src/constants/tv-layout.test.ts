import { loadOnPlatform } from "@/test-support/platform";

import { tvDp } from "./tv-density";
import { TvLayout, TvType } from "./tv-layout";

const loadOnTvOS = () =>
  loadOnPlatform({ OS: "ios", isTV: true }, () => ({
    layout: require("./tv-layout") as typeof import("./tv-layout"),
    density: require("./tv-density") as typeof import("./tv-density"),
  }));

describe("TvLayout", () => {
  it("insets 30dp vertically for overscan", () => {
    expect(TvLayout.overscanY).toBe(tvDp(30));
  });

  it("clears the tvOS 60pt vertical safe area", () => {
    const { layout, density } = loadOnTvOS();
    expect(layout.TvLayout.overscanY).toBe(density.tvDp(30));
    expect(layout.TvLayout.overscanY).toBe(60);
  });
});

describe("TvType", () => {
  it("adds the 10-foot rows for the new variants (pre-density dp)", () => {
    expect(TvType.bodyLarge).toEqual({ fontSize: 20, lineHeight: 30 });
    expect(TvType.button).toEqual({ fontSize: 18, lineHeight: 24 });
    expect(TvType.footnote).toEqual({ fontSize: 14, lineHeight: 20 });
  });

  it("is not density-scaled on tvOS (ThemedText applies TV_DENSITY)", () => {
    expect(loadOnTvOS().layout.TvType.bodyLarge.fontSize).toBe(20);
  });

  it("drops the removed link variant", () => {
    expect(TvType).not.toHaveProperty("link");
  });
});
