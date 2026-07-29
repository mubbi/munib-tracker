import type { AppLocale } from "../../i18n/app-locale";
import type { DeepPartial } from "./localize";

/** Every locale with a Learn-content overlay (all except English). */
export type OverlayLocale = Exclude<AppLocale, "en">;

/** Per-locale overlay map for a list of content items. */
export type ContentOverlays<T> = Partial<Record<OverlayLocale, readonly DeepPartial<T>[]>>;

/** Per-locale overlay map for a single content object. */
export type ContentOverlay<T> = Partial<Record<OverlayLocale, DeepPartial<T>>>;

/** Suffix used in overlay export names, e.g. `AQEDAH_TOPICS_ID`. */
export function overlayExportSuffix(locale: OverlayLocale): string {
  return locale.toUpperCase();
}

/** Parses `FOO_ID` / `FOO_AR` overlay export names back to base key + locale. */
export function parseOverlayExportName(
  exportName: string,
): { baseKey: string; locale: OverlayLocale } | null {
  const match = exportName.match(/^(.+)_([A-Z]{2})$/);
  if (!match?.[1] || !match[2]) return null;
  const code = match[2].toLowerCase();
  if (code === "en") return null;
  const locale = code as OverlayLocale;
  return { baseKey: match[1], locale };
}
