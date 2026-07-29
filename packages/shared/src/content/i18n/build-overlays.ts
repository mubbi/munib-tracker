import type { ContentOverlays, DeepPartial } from "./localize";
import type { OverlayLocale } from "./overlay-locale";
import { parseOverlayExportName } from "./overlay-locale";

/**
 * Collects every `{BASE}_{LOCALE}` export from the content-i18n barrel into a
 * {@link ContentOverlays} map for a single English base export name.
 */
export function buildContentOverlays<T>(
  baseKey: string,
  exportsBag: Record<string, unknown>,
): ContentOverlays<T> {
  const result: Partial<Record<OverlayLocale, readonly DeepPartial<T>[]>> = {};
  for (const [exportName, value] of Object.entries(exportsBag)) {
    const parsed = parseOverlayExportName(exportName);
    if (!parsed || parsed.baseKey !== baseKey) continue;
    result[parsed.locale] = value as readonly DeepPartial<T>[];
  }
  return result;
}

/** Same as {@link buildContentOverlays} for a single-object overlay export. */
export function buildContentOverlay<T>(
  baseKey: string,
  exportsBag: Record<string, unknown>,
): Partial<Record<OverlayLocale, DeepPartial<T>>> {
  const result: Partial<Record<OverlayLocale, DeepPartial<T>>> = {};
  for (const [exportName, value] of Object.entries(exportsBag)) {
    const parsed = parseOverlayExportName(exportName);
    if (!parsed || parsed.baseKey !== baseKey) continue;
    result[parsed.locale] = value as DeepPartial<T>;
  }
  return result;
}
