import { heroMotionClasses } from "@/components/prayer-times-hero-motion";

describe("heroMotionClasses (native)", () => {
  it("has no CSS classes off web", () => {
    expect(Object.values(heroMotionClasses).every((value) => value === undefined)).toBe(true);
  });
});
