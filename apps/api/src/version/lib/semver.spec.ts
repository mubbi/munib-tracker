import { describe, expect, it } from "vitest";
import { compareVersions, isVersionLessThan } from "./semver";

describe("compareVersions", () => {
  it("returns 0 for equal versions", () => {
    expect(compareVersions("1.2.3", "1.2.3")).toBe(0);
    expect(compareVersions("v1.2.3", "1.2.3")).toBe(0);
  });

  it("compares major versions", () => {
    expect(compareVersions("2.0.0", "1.9.9")).toBeGreaterThan(0);
    expect(compareVersions("1.0.0", "2.0.0")).toBeLessThan(0);
  });

  it("compares minor versions when major is equal", () => {
    expect(compareVersions("1.2.0", "1.1.9")).toBeGreaterThan(0);
    expect(compareVersions("1.1.0", "1.2.0")).toBeLessThan(0);
  });

  it("compares patch versions when major and minor are equal", () => {
    expect(compareVersions("1.2.3", "1.2.2")).toBeGreaterThan(0);
    expect(compareVersions("1.2.2", "1.2.3")).toBeLessThan(0);
  });

  it("treats missing parts as zero", () => {
    expect(compareVersions("1", "1.0.0")).toBe(0);
    expect(compareVersions("1.2", "1.2.0")).toBe(0);
    expect(compareVersions("1.2", "1.2.1")).toBeLessThan(0);
  });

  it("strips a leading v prefix", () => {
    expect(compareVersions("v2.0.0", "v1.9.9")).toBeGreaterThan(0);
  });
});

describe("isVersionLessThan", () => {
  it("returns true when current is below required", () => {
    expect(isVersionLessThan("1.0.0", "1.0.1")).toBe(true);
    expect(isVersionLessThan("v1.0.0", "1.1.0")).toBe(true);
  });

  it("returns false when current meets or exceeds required", () => {
    expect(isVersionLessThan("1.2.0", "1.1.0")).toBe(false);
    expect(isVersionLessThan("1.0.0", "1.0.0")).toBe(false);
  });
});
