import { accentColorIds } from "@munib-tracker/theme/accents";
import { type ContrastPair, compositeOver, contrastMatrix } from "@munib-tracker/theme/color";
import { resolveTheme } from "@munib-tracker/theme/resolve";
import {
  Brand,
  CelebrationPalette,
  DangerFillPalette,
  Mushaf,
  type StatusKey,
  StatusPalette,
  withAlpha,
} from "@/constants/theme";
import { computeThemeTokens } from "@/lib/theme-tokens";

describe("computeThemeTokens", () => {
  it("derives light tokens from light colors", () => {
    const colors = resolveTheme("light", "light");
    const tokens = computeThemeTokens(colors, "light");
    expect(tokens.isDark).toBe(false);
    expect(tokens.accentSoft).toBe(withAlpha(colors.accent, 0.18));
    expect(tokens.accentBorder).toBe(withAlpha(colors.accent, 0.36));
    expect(tokens.hairline).toBe(withAlpha(colors.foreground, 0.12));
    expect(tokens.surfaceRaised).toBe(colors.card);
    expect(tokens.segmentThumb).toBe(colors.card);
    expect(tokens.inputSurface).toEqual({
      backgroundColor: colors.input,
      borderColor: colors.inputBorder,
      borderWidth: 1,
    });
    expect(tokens.inputSurfaceFocused.borderColor).toBe(colors.accent);
    expect(tokens.hero).toBe(Brand);
    expect(tokens.mushaf.paper).toBe(Mushaf.paperLight);
    expect(tokens.mushaf.frame).toBe(Mushaf.goldLight);
    expect(tokens.mushaf.ink).toBe(Mushaf.inkLight);
    expect(Object.keys(tokens.status)).toEqual(Object.keys(StatusPalette));
    const [key] = Object.keys(StatusPalette) as (keyof typeof StatusPalette)[];
    expect(tokens.status[key].color).toBe(StatusPalette[key]);
    expect(tokens.status[key].soft).toBe(withAlpha(StatusPalette[key], 0.14));
    expect(tokens.status[key].text).toMatch(/^#/);
  });

  it("derives dark tokens from dark colors", () => {
    const colors = resolveTheme("dark", "dark");
    const tokens = computeThemeTokens(colors, "dark");
    expect(tokens.isDark).toBe(true);
    expect(tokens.surfaceRaised).toBe(colors.muted);
    expect(tokens.segmentThumb).toBe(withAlpha(colors.foreground, 0.22));
    expect(tokens.mushaf.paper).toBe(colors.card);
    expect(tokens.mushaf.frame).toBe(Mushaf.goldDark);
    expect(tokens.mushaf.frameSoft).toBe(Mushaf.goldSoftDark);
    expect(tokens.mushaf.highlight).toBe(withAlpha(Mushaf.inkDark, 0.24));
    const [key] = Object.keys(StatusPalette) as (keyof typeof StatusPalette)[];
    expect(tokens.status[key].border).toBe(withAlpha(StatusPalette[key], 0.4));
  });

  it("exposes the constant celebration palette in both schemes", () => {
    const light = computeThemeTokens(resolveTheme("light", "light", "ocean"), "light");
    const dark = computeThemeTokens(resolveTheme("dark", "dark", "rose"), "dark");
    expect(light.celebration).toEqual(["#D4AF37", "#4CAF7D", "#5AA9E6", "#F2C94C"]);
    expect(light.celebration).toBe(CelebrationPalette);
    expect(dark.celebration).toBe(CelebrationPalette);
  });

  it("caches per colors object and recomputes when the scheme flips", () => {
    const colors = resolveTheme("light", "light");
    const a = computeThemeTokens(colors, "light");
    expect(computeThemeTokens(colors, "light")).toBe(a);
    const b = computeThemeTokens(colors, "dark");
    expect(b).not.toBe(a);
    expect(b.isDark).toBe(true);
    expect(computeThemeTokens(colors, "dark")).toBe(b);
  });
});

describe("derived tokens", () => {
  it("defines the light derived tokens from the spec", () => {
    const colors = resolveTheme("light", "light");
    const tokens = computeThemeTokens(colors, "light");
    expect(tokens.focusRing).toBe(colors.accentText);
    expect(tokens.switchTrackOff).toBe(colors.inputBorder);
    expect(tokens.hover).toBe(withAlpha(colors.foreground, 0.04));
    expect(tokens.scrimStrong).toBe("#000000b3");
    expect(tokens.onScrim).toBe("#FFFFFF");
    expect(tokens.inputSurfaceError).toEqual({
      backgroundColor: colors.input,
      borderColor: tokens.status.danger.text,
      borderWidth: 1,
    });
    expect(tokens.status.danger.fill).toBe(DangerFillPalette.fillLight);
    expect(tokens.status.danger.onFill).toBe("#FFFFFF");
    expect(tokens.accentOnSoft).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("defines the dark derived tokens from the spec", () => {
    const colors = resolveTheme("dark", "dark");
    const tokens = computeThemeTokens(colors, "dark");
    expect(tokens.hover).toBe(withAlpha(colors.foreground, 0.06));
    expect(tokens.status.danger.fill).toBe("#E57A68");
    expect(tokens.status.danger.onFill).toBe("#152921");
    expect(tokens.status.success).not.toHaveProperty("fill");
  });
});

/**
 * Contrast matrix (P1-03): every preset accent × scheme, translucent tints
 * composited over the real surface they sit on.
 */
describe.each(["light", "dark"] as const)("contrast matrix (%s)", (scheme) => {
  const isDark = scheme === "dark";
  const softAlpha = isDark ? 0.24 : 0.18;
  const secondaryAlpha = isDark ? 0.28 : 0.2;
  const statusSoftAlpha = isDark ? 0.22 : 0.14;

  it.each(accentColorIds)("%s accent tokens meet their targets", (accentId) => {
    const colors = resolveTheme(scheme, scheme, accentId);
    const tokens = computeThemeTokens(colors, scheme);
    const ladder = { background: colors.background, card: colors.card, muted: colors.muted };
    const pairs: ContrastPair[] = [];

    for (const [name, surface] of Object.entries(ladder)) {
      pairs.push(
        {
          label: `accentOnSoft on ${name}`,
          foreground: tokens.accentOnSoft,
          background: surface,
          min: 4.5,
        },
        {
          label: `accentOnSoft on accentSoft/${name}`,
          foreground: tokens.accentOnSoft,
          background: compositeOver(colors.accent, softAlpha, surface),
          min: 4.5,
        },
        {
          label: `accentOnSoft on secondary tint/${name}`,
          foreground: tokens.accentOnSoft,
          background: compositeOver(colors.accent, secondaryAlpha, surface),
          min: 4.5,
        },
        {
          label: `focusRing on ${name}`,
          foreground: tokens.focusRing,
          background: surface,
          min: 3,
        },
      );
    }
    pairs.push(
      {
        label: "accent fill vs background",
        foreground: colors.accent,
        background: colors.background,
        min: 3,
      },
      {
        label: "switchTrackOff vs card",
        foreground: tokens.switchTrackOff,
        background: colors.card,
        min: 3,
      },
      {
        label: "switchTrackOff vs background",
        foreground: tokens.switchTrackOff,
        background: colors.background,
        min: 3,
      },
    );

    expect(contrastMatrix(pairs)).toEqual([]);
  });

  it.each(Object.keys(StatusPalette) as StatusKey[])(
    "%s status tokens meet their targets",
    (key) => {
      const colors = resolveTheme(scheme, scheme);
      const tokens = computeThemeTokens(colors, scheme);
      const hue = StatusPalette[key];
      const pairs: ContrastPair[] = [colors.background, colors.card, colors.muted].flatMap(
        (surface) => [
          {
            label: `${key}.onSoft on soft/${surface}`,
            foreground: tokens.status[key].onSoft,
            background: compositeOver(hue, statusSoftAlpha, surface),
            min: 4.5,
          },
          {
            label: `${key}.onSoft on ${surface}`,
            foreground: tokens.status[key].onSoft,
            background: surface,
            min: 4.5,
          },
        ],
      );
      const textSurface = isDark ? colors.card : colors.background;
      pairs.push({
        label: `${key}.text`,
        foreground: tokens.status[key].text,
        background: textSurface,
        min: 4.5,
      });

      expect(contrastMatrix(pairs)).toEqual([]);
    },
  );

  it("destructive fill, field error and media scrim meet their targets", () => {
    const colors = resolveTheme(scheme, scheme);
    const tokens = computeThemeTokens(colors, scheme);
    const { danger } = tokens.status;
    const pairs: ContrastPair[] = [
      {
        label: "danger.onFill on fill",
        foreground: danger.onFill,
        background: danger.fill,
        min: 4.5,
      },
      ...[colors.background, colors.card, colors.muted].map((surface) => ({
        label: `danger.fill vs ${surface}`,
        foreground: danger.fill,
        background: surface,
        min: 3,
      })),
      ...[colors.input, colors.card, colors.background].map((surface) => ({
        label: `inputSurfaceError border vs ${surface}`,
        foreground: tokens.inputSurfaceError.borderColor,
        background: surface,
        min: 3,
      })),
      {
        // Worst case: the strong scrim over a pure-white page or photo.
        label: "onScrim on scrimStrong",
        foreground: tokens.onScrim,
        background: compositeOver("#000000", 0.7, "#FFFFFF"),
        min: 7,
      },
    ];

    expect(contrastMatrix(pairs)).toEqual([]);
  });
});
