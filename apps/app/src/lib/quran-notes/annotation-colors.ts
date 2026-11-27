import { ANNOTATION_COLOR_IDS, type AnnotationColorId } from "@munib-tracker/shared/types";
import { accentOnSurface } from "@munib-tracker/theme/color";

import { CategoryHues, withAlpha } from "@/constants/theme";
import { hexToRgb, normalizeHex } from "@/lib/color";

/**
 * NF-3.21 highlight colours. Built on the app's single palette of soft hues
 * (`CategoryHues`): gold → dawn, green → sage, blue → sky, rose → rose,
 * violet → violet. They never follow the user's accent, so a note keeps its
 * colour when the theme changes.
 */
export const ANNOTATION_HUES: Record<AnnotationColorId, string> = {
  gold: CategoryHues.dawn,
  green: CategoryHues.sage,
  blue: CategoryHues.sky,
  rose: CategoryHues.rose,
  violet: CategoryHues.violet,
};

/** Low-alpha fill behind highlighted Arabic. Dark mode needs a little more to read. */
export const ANNOTATION_TINT_ALPHA = { light: 0.2, dark: 0.26 } as const;

export { ANNOTATION_COLOR_IDS };

/** Background tint for a highlighted ayah / word span (8-digit hex). */
export function annotationTint(color: AnnotationColorId, isDark: boolean): string {
  return withAlpha(
    ANNOTATION_HUES[color],
    isDark ? ANNOTATION_TINT_ALPHA.dark : ANNOTATION_TINT_ALPHA.light,
  );
}

/** Solid swatch / note-glyph tone with ≥3:1 against `surface` (non-text contrast). */
export function annotationSwatch(color: AnnotationColorId, surface: string): string {
  return accentOnSurface(ANNOTATION_HUES[color], surface, 3);
}

/** The opaque colour the eye sees: `#RRGGBBAA` tint composited over an opaque surface. */
export function compositeOver(tint: string, surface: string): string {
  const body = tint.replace("#", "");
  const alpha = body.length === 8 ? Number.parseInt(body.slice(6, 8), 16) / 255 : 1;
  const fg = hexToRgb(body.slice(0, 6));
  const bg = hexToRgb(surface);
  if (!fg || !bg) return surface;
  const mix = (a: number, b: number) => Math.round(a * alpha + b * (1 - alpha));
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return (
    normalizeHex(`#${toHex(mix(fg.r, bg.r))}${toHex(mix(fg.g, bg.g))}${toHex(mix(fg.b, bg.b))}`) ??
    surface
  );
}
