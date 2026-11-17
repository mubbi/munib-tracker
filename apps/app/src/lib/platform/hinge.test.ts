jest.mock("expo-hinge", () => ({
  isAvailable: () => false,
  useHinge: () => null,
}));

import { postureFromHinge } from "./hinge";

describe("postureFromHinge", () => {
  it("returns null without a hinge", () => {
    expect(postureFromHinge(null)).toBeNull();
  });

  it("trusts explicit closed / fully-open statuses", () => {
    expect(postureFromHinge({ angle: 3, status: "closed" })).toBe("closed");
    expect(postureFromHinge({ angle: 179, status: "fullyOpen" })).toBe("flat");
  });

  it("treats a nearly flat partially-open hinge as flat", () => {
    expect(postureFromHinge({ angle: 170, status: "partiallyOpen" })).toBe("flat");
    expect(postureFromHinge({ angle: 95, status: "partiallyOpen" })).toBe("halfOpen");
  });

  it("derives posture from the angle when Android reports unknown", () => {
    expect(postureFromHinge({ angle: 5, status: "unknown" })).toBe("closed");
    expect(postureFromHinge({ angle: 110, status: "unknown" })).toBe("halfOpen");
    expect(postureFromHinge({ angle: 180, status: "unknown" })).toBe("flat");
    expect(postureFromHinge({ angle: Number.NaN, status: "unknown" })).toBeNull();
  });
});
