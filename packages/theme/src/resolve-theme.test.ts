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

  it.each([null, undefined])("defaults to light when the system scheme is %s", (scheme) => {
    expect(resolveTheme("system", scheme)).toBe(resolveTheme("light", "light"));
  });

  it("falls back to the default accent for unknown ids", () => {
    expect(resolveTheme("light", null, "unknown" as never).accent).toBe(
      resolveTheme("light", null).accent,
    );
  });

  it("shares cached references between explicit and system-resolved schemes", () => {
    expect(resolveTheme("dark", null, "teal")).toBe(resolveTheme("system", "dark", "teal"));
  });
});
