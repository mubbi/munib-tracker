import { loadOnPlatform } from "@/test-support/platform";

import { TV_DENSITY, tvDp } from "./tv-density";

const load = (overrides: Parameters<typeof loadOnPlatform>[0]) =>
  loadOnPlatform(overrides, () => require("./tv-density") as typeof import("./tv-density"));

describe("tv density", () => {
  it("is the identity on phones", () => {
    expect(TV_DENSITY).toBe(1);
    expect(tvDp(16)).toBe(16);
  });

  it("doubles layout units on Apple TV", () => {
    const { TV_DENSITY: density, tvDp: scale } = load({ OS: "ios", isTV: true });
    expect(density).toBe(2);
    expect(scale(16)).toBe(32);
  });

  it("keeps Android TV at its native density", () => {
    expect(load({ OS: "android", isTV: true }).TV_DENSITY).toBe(1);
  });
});
