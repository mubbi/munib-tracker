import { describe, expect, it } from "vitest";
import { resolveTheme } from "./resolve-theme";

describe.concurrent("resolveTheme", () => {
  it("returns light theme colors", () => {
    const colors = resolveTheme("light", "light", "forest");
    expect(colors.background).toBe("#F5F0E6");
    expect(colors.accent).toBe("#2E7D32");
  });

  it("returns dark theme colors", () => {
    const colors = resolveTheme("dark", "light", "forest");
    expect(colors.background).toBe("#152921");
    expect(colors.accent).toBe("#66BB6A");
  });

  it("follows system scheme when mode is system", () => {
    const dark = resolveTheme("system", "dark", "teal");
    expect(dark.background).toBe("#152921");
    expect(dark.accent).toBe("#2DD4BF");
  });

  it("returns stable object references for repeated calls", () => {
    const first = resolveTheme("light", "light", "forest");
    const second = resolveTheme("light", "light", "forest");
    expect(first).toBe(second);
  });
});
