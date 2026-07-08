import {
  type ContentOverlay,
  type ContentOverlays,
  type DeepPartial,
  localizeContent,
  localizeContentList,
} from "@munib-tracker/shared/content-i18n";
import i18n from "@/i18n";

/**
 * Resolve Learn-content translation overlays against the active app locale.
 *
 * The English content in `@munib-tracker/shared/content` is the structural
 * source of truth; per-locale overlays (ur/ar) carry only the translated text.
 * These helpers are called from the `lib/*` content accessors so screens keep
 * reading `topic.title` etc. unchanged. They read `i18n.language` at call time,
 * so accessors must be invoked inside a render that reacts to locale changes
 * (memoize on `i18n.language`) rather than at module scope.
 */

function activeListOverlay<T>(overlays: ContentOverlays<T>): readonly DeepPartial<T>[] | undefined {
  if (i18n.language === "ur") return overlays.ur;
  if (i18n.language === "ar") return overlays.ar;
  return undefined;
}

/** Localize a list of content items for the active locale (English fallback). */
export function localizeList<T>(base: readonly T[], overlays: ContentOverlays<T>): T[] {
  return localizeContentList(base, activeListOverlay(overlays));
}

/** Localize a single content object for the active locale (English fallback). */
export function localizeObject<T>(base: T, overlays: ContentOverlay<T>): T {
  const overlay =
    i18n.language === "ur" ? overlays.ur : i18n.language === "ar" ? overlays.ar : undefined;
  return localizeContent(base, overlay);
}
