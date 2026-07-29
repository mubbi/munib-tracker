import type { HadithItem } from "@munib-tracker/shared/types";

import { MIN_TOKEN_LENGTH, normalize, tokenize } from "@/lib/search-fuse";
import { resolveHadithTranslation } from "@/lib/translation-locale";
import { preferencesStore } from "@/stores/preferences-store";

export type { BundledHadithCollection } from "./hadith-bundled";
export {
  ensureBundledCollection,
  ensureBundledCollectionData,
  getBundledCollection,
  getBundledCollectionData,
  getBundledCollections,
  isBundledCollection,
} from "./hadith-bundled";

/**
 * Lightweight in-memory hadith filter (normalized substring AND). Prefer
 * {@link createHadithSearch} from `@/lib/search` for screen search bars — that
 * path adds typo-tolerant Fuse fallback and caches the haystack index.
 */
export function searchHadiths(items: HadithItem[], query: string): HadithItem[] {
  const trimmed = query.trim();
  if (!trimmed) return items;
  const tokens = tokenize(trimmed).filter((token) => token.length >= MIN_TOKEN_LENGTH);
  if (tokens.length === 0) return [];
  const prefs = preferencesStore.getState().prefs;
  return items.filter((h) => {
    const haystack = normalize(
      [
        h.english,
        resolveHadithTranslation(h, prefs),
        h.narrator,
        h.reference,
        h.book,
        h.number,
        h.arabic,
      ]
        .filter(Boolean)
        .join(" "),
    );
    return tokens.every((token) => haystack.includes(token));
  });
}
