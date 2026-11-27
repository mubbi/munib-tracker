import { type ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { EmptyState } from "@/components/ui/empty-state";
import { SearchField } from "@/components/ui/search-field";
import { Spacing } from "@/constants/theme";
import { createFuzzyIndex } from "@/lib/search";

export type GlossaryTerm = {
  id: string;
  term: string;
  transliteration?: string;
  definition: string;
};

const NO_MATCH_ICON = { ios: "magnifyingglass", android: "search", web: "search" } as const;

/**
 * Alphabetical, searchable Learn glossary (G-44): terms sorted with the UI
 * locale's collation, filtered through the shared Fuse defaults
 * (`createFuzzyIndex`), with the app's one no-results pattern.
 */
export function useGlossaryFilter<T extends GlossaryTerm>(terms: readonly T[]) {
  const { i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const sorted = useMemo(
    () =>
      [...terms].sort((a, b) =>
        a.term.localeCompare(b.term, i18n.language, { sensitivity: "base" }),
      ),
    [terms, i18n.language],
  );
  const index = useMemo(
    () =>
      createFuzzyIndex(sorted, [
        { key: "term", weight: 3, get: (item) => item.term },
        { key: "transliteration", weight: 2, get: (item) => item.transliteration },
        { key: "definition", weight: 1, get: (item) => item.definition },
      ]),
    [sorted],
  );
  const trimmed = query.trim();
  const visible = useMemo(() => {
    if (!trimmed) return sorted;
    // Keep alphabetical order among the matches.
    const hits = new Set(index.search(trimmed));
    return sorted.filter((item) => hits.has(item));
  }, [index, sorted, trimmed]);
  return { query, setQuery, visible, filtering: trimmed.length > 0 };
}

/** Search box for a glossary list. */
export function GlossarySearchField({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <SearchField
      value={value}
      onChangeText={onChangeText}
      placeholder={t("learnKit.glossarySearchPlaceholder")}
      accessibilityLabel={t("learnKit.glossarySearchPlaceholder")}
      style={styles.search}
    />
  );
}

/** "No matches" with a one-tap reset. */
export function GlossaryNoMatches({ onClear }: { onClear: () => void }): ReactNode {
  const { t } = useTranslation();
  return (
    <EmptyState
      icon={NO_MATCH_ICON}
      title={t("search.noResultsTitle")}
      description={t("search.noResultsDesc")}
      actionLabel={t("learnKit.glossaryClearSearch")}
      onAction={onClear}
    />
  );
}

const styles = StyleSheet.create({
  search: { marginTop: Spacing.three },
});
