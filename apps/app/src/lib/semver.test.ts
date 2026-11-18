import { compareVersions, isVersionLessThan } from "@/lib/semver";

describe("compareVersions", () => {
  it.each([
    ["1.2.3", "1.2.3", 0],
    ["v1.2.3", "1.2.3", 0],
    ["1.2", "1.2.0", 0],
    ["1.10.0", "1.9.9", 1],
    ["2.0.0", "10.0.0", -8],
    ["1.0.x", "1.0.0", 0],
    ["", "0.0.0", 0],
  ])("compare(%s, %s) → %p", (a, b, expected) => {
    expect(Math.sign(compareVersions(a, b))).toBe(Math.sign(expected));
  });
});

describe("isVersionLessThan", () => {
  it.each([
    ["1.4.9", "1.5.0", true],
    ["1.5.0", "1.5.0", false],
    ["2.0.0", "1.5.0", false],
  ])("%s < %s → %p", (current, required, expected) => {
    expect(isVersionLessThan(current, required)).toBe(expected);
  });
});
