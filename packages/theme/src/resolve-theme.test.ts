import { describe, expect, it } from "vitest";
import { resolveTheme } from "./resolve-theme";

describe("resolveTheme", () => {
  it("returns light theme colors", () => {
    const colors = resolveTheme("light", "light", "gold");
    expect(colors.background).toBe("#F5F0E6");
    expect(colors.accent).toBe("#B8956A");
  });

  it("returns dark theme colors", () => {
    const colors = resolveTheme("dark", "light", "gold");
    expect(colors.background).toBe("#152921");
    expect(colors.accent).toBe("#D4C5A0");
  });

  it("follows system scheme when mode is system", () => {
    const dark = resolveTheme("system", "dark", "teal");
    expect(dark.background).toBe("#152921");
    expect(dark.accent).toBe("#2dd4bf");
  });
});
