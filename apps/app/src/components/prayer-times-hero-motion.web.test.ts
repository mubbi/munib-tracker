import { heroMotionClasses } from "@/components/prayer-times-hero-motion.web";

// Jest has no CSS-module transform; stand in for the hashed class map.
jest.mock("@/components/prayer-times-hero-motion.module.css", () => ({
  __esModule: true,
  default: { baseDrift: "b", horizonDrift: "h", glowDrift: "g", glowBreath: "br", unused: "u" },
}));

describe("heroMotionClasses (web)", () => {
  it("exposes only the hero's animation classes", () => {
    expect(heroMotionClasses).toEqual({
      baseDrift: "b",
      horizonDrift: "h",
      glowDrift: "g",
      glowBreath: "br",
    });
  });
});
