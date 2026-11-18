import { renderHook } from "@testing-library/react-native";

import { usePlatform } from "@/test-support/platform";

const mockHinge = { available: (): boolean => false, current: null as unknown };
jest.mock("expo-hinge", () => ({
  isAvailable: () => mockHinge.available(),
  useHinge: () => mockHinge.current,
}));

import { isHingeSupported, postureFromHinge, useHingePosture } from "./hinge";

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

describe("isHingeSupported", () => {
  afterEach(() => {
    mockHinge.available = () => false;
  });

  it("asks the native module", () => {
    mockHinge.available = () => true;
    expect(isHingeSupported()).toBe(true);
  });

  it("treats a throwing module as unsupported", () => {
    mockHinge.available = () => {
      throw new Error("missing");
    };
    expect(isHingeSupported()).toBe(false);
  });

  describe.each([
    ["web", { OS: "web" as const }],
    ["TV", { isTV: true }],
  ])("on %s", (_name, platform) => {
    usePlatform(platform);

    it("is unsupported", () => {
      mockHinge.available = () => true;
      expect(isHingeSupported()).toBe(false);
    });
  });
});

describe("useHingePosture", () => {
  afterEach(() => {
    mockHinge.current = null;
  });

  it("maps the live hinge to a posture", async () => {
    mockHinge.current = { angle: 90, status: "partiallyOpen" };
    const { result } = await renderHook(() => useHingePosture());
    expect(result.current).toBe("halfOpen");
  });

  it("is null without a hinge", async () => {
    const { result } = await renderHook(() => useHingePosture());
    expect(result.current).toBeNull();
  });
});
