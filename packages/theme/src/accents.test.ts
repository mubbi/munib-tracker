import { describe, expect, it } from "vitest";
import {
  accentColorIds,
  accentColors,
  defaultAccentColorId,
  resolveAccentColorId,
} from "./accents";
import { contrastRatio } from "./color";
import { resolveTheme } from "./resolve-theme";

describe("resolveAccentColorId", () => {
  it.each(accentColorIds)("returns known accent id %s unchanged", (id) => {
    expect(resolveAccentColorId(id)).toBe(id);
  });

  it.each([null, "", "ultraviolet"])("returns null for %j", (stored) => {
    expect(resolveAccentColorId(stored)).toBeNull();
  });

  it("includes the default accent among the known ids", () => {
    expect(accentColorIds).toContain(defaultAccentColorId);
  });
});

describe("preset accents as fills (WCAG 1.4.11 non-text ≥ 3:1)", () => {
  it("uses the darkened D-UX1 light shades for amber and lime", () => {
    expect(accentColors.amber.light).toBe("#B45309");
    expect(accentColors.lime.light).toBe("#4D7C0F");
  });

  it.each(accentColorIds)("light %s clears 3:1 on background, card and muted", (id) => {
    const t = resolveTheme("light", null, id);
    for (const surface of [t.background, t.card, t.muted]) {
      expect(contrastRatio(t.accent, surface)).toBeGreaterThanOrEqual(3);
    }
  });

  it.each(accentColorIds)("dark %s clears 3:1 on background and card", (id) => {
    const t = resolveTheme("dark", null, id);
    for (const surface of [t.background, t.card]) {
      expect(contrastRatio(t.accent, surface)).toBeGreaterThanOrEqual(3);
    }
  });
});
