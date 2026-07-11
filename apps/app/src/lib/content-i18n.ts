import {
  type ContentOverlay,
  type ContentOverlays,
  type DeepPartial,
  localizeContent,
  localizeContentList,
  type OverlayLocale,
} from "@munib-tracker/shared/content-i18n";
import { isAppLocale } from "@munib-tracker/shared/i18n";
import i18n from "@/i18n";
import { subscribeContentOverlays } from "@/lib/content-overlay-registry";

/**
 * Resolve Learn-content translation overlays against the active app locale.
 *
 * The English content in `@munib-tracker/shared/content` is the structural
 * source of truth; per-locale overlays carry only the translated text.
 * These helpers are called from the `lib/*` content accessors so screens keep
 * reading `topic.title` etc. unchanged. They read `i18n.language` at call time,
 * so accessors must be invoked inside a render that reacts to locale changes
 * (memoize on `i18n.language`) rather than at module scope.
 */

// When lazy overlays finish loading, nudge react-i18next subscribers so Learn
// screens that memoize on `i18n.language` re-read translated content.
subscribeContentOverlays(() => {
  void i18n.emit("languageChanged", i18n.language);
});

function activeOverlayLocale(): OverlayLocale | undefined {
  const lang = i18n.language?.split("-")[0];
  if (!lang || lang === "en" || !isAppLocale(lang)) return undefined;
  return lang as OverlayLocale;
}

function activeListOverlay<T>(overlays: ContentOverlays<T>): readonly DeepPartial<T>[] | undefined {
  const locale = activeOverlayLocale();
  return locale ? overlays[locale] : undefined;
}

/** Localize a list of content items for the active locale (English fallback). */
export function localizeList<T>(base: readonly T[], overlays: ContentOverlays<T>): T[] {
  return localizeContentList(base, activeListOverlay(overlays));
}

/** Localize a single content object for the active locale (English fallback). */
export function localizeObject<T>(base: T, overlays: ContentOverlay<T>): T {
  const locale = activeOverlayLocale();
  return localizeContent(base, locale ? overlays[locale] : undefined);
}
