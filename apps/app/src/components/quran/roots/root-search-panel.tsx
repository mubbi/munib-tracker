import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SearchField } from "@/components/ui/search-field";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import {
  createRootSuggestionIndex,
  lemmaCount,
  listRoots,
  rootCount,
  rootToArabic,
  searchRoots,
  suggestRoots,
} from "@/lib/quran-roots";
import { useChevronForward } from "@/lib/rtl";
import { pushRecentSearch } from "@/lib/search-history";
import { useRootIndex } from "@/stores/quran-roots-store";

import { RootDataGate } from "./root-data-gate";
import { RootLetterPicker } from "./root-letter-picker";

const DEBOUNCE_MS = 200;

/** The Root tab of `/quran/search` (NF-3.22). */
export function RootSearchPanel({
  initialQuery = "",
  onSearchText,
}: {
  initialQuery?: string;
  /** Switch to the Text tab with this query (offered when no root matches). */
  onSearchText: (query: string) => void;
}) {
  const { t } = useTranslation();
  const tv = isTV();
  const [query, setQuery] = useState(initialQuery);
  const [debounced, setDebounced] = useState(initialQuery.trim());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [picked, setPicked] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <View style={styles.stack}>
      <Card>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quranRoots.guardrail")}
        </ThemedText>
      </Card>
      <RootDataGate>
        <Card>
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder={t("quranRoots.search.placeholder")}
            accessibilityLabel={t("quranRoots.search.placeholder")}
            autoFocus={!tv}
          />
          <View style={styles.hintRow}>
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
              {t("quranRoots.search.hint")}
            </ThemedText>
            <Button
              label={t("quranRoots.picker.open")}
              variant="secondary"
              size="sm"
              icon={{ ios: "character.textbox", android: "keyboard", web: "keyboard" }}
              onPress={() => {
                setPicked("");
                setPickerOpen(true);
              }}
            />
          </View>
        </Card>
        <RootResults query={debounced} onSearchText={onSearchText} onPickSuggestion={setQuery} />
        <RootLetterPicker
          visible={pickerOpen}
          value={picked}
          onChange={setPicked}
          onClose={() => setPickerOpen(false)}
          onDone={() => {
            setPickerOpen(false);
            setQuery(rootToArabic(picked));
          }}
        />
      </RootDataGate>
    </View>
  );
}

function RootResults({
  query,
  onSearchText,
  onPickSuggestion,
}: {
  query: string;
  onSearchText: (query: string) => void;
  onPickSuggestion: (query: string) => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const chevron = useChevronForward();
  const index = useRootIndex();
  const suggestionIndex = useMemo(
    () => (index ? createRootSuggestionIndex(listRoots(index)) : null),
    [index],
  );
  const lookup = useMemo(() => (index && query ? searchRoots(index, query) : null), [index, query]);
  const suggestions = useMemo(
    () =>
      index && suggestionIndex && lookup?.kind === "none"
        ? suggestRoots(index, suggestionIndex, query)
        : [],
    [index, suggestionIndex, lookup, query],
  );

  if (!index || !lookup) return null;

  const openRoot = (root: string) => {
    void pushRecentSearch(query);
    router.push({ pathname: "/quran/roots/[root]", params: { root } });
  };

  if (lookup.kind === "rootless") {
    return (
      <Card>
        <ThemedText type="small">{t("quranRoots.search.rootless")}</ThemedText>
      </Card>
    );
  }

  if (lookup.kind === "none") {
    return (
      <Card>
        <EmptyState
          icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
          title={t("quranRoots.search.noRoot")}
          description={t("quranRoots.search.noRootBody")}
          actionLabel={t("quranRoots.search.searchText")}
          onAction={() => onSearchText(query)}
        />
        {suggestions.length ? (
          <View style={styles.suggestions}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("quranRoots.search.didYouMean")}
            </ThemedText>
            <View style={styles.chips}>
              {suggestions.map((root) => (
                <PressableScale
                  key={root}
                  accessibilityRole="button"
                  accessibilityLabel={rootToArabic(root)}
                  onPress={() => onPickSuggestion(rootToArabic(root))}
                  style={[styles.chip, { backgroundColor: tokens.accentSoft }]}
                >
                  <ThemedText type="arabic" accessibilityLanguage="ar" style={styles.chipText}>
                    {rootToArabic(root)}
                  </ThemedText>
                </PressableScale>
              ))}
            </View>
          </View>
        ) : null}
      </Card>
    );
  }

  return (
    <View style={styles.stack}>
      {lookup.roots.length > 1 ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quranRoots.search.candidates")}
        </ThemedText>
      ) : null}
      {lookup.via === "word" ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quranRoots.search.viaWord")}
        </ThemedText>
      ) : null}
      {lookup.roots.map((root, i) => (
        <PressableScale
          key={root}
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("quranRoots.search.resultA11y", {
            root: rootToArabic(root),
            total: rootCount(index, root),
          })}
          hasTVPreferredFocus={isTV() && i === 0}
          onPress={() => openRoot(root)}
          style={[styles.result, { backgroundColor: colors.muted }]}
        >
          <ThemedText type="arabic" accessibilityLanguage="ar" style={styles.resultRoot}>
            {rootToArabic(root)}
          </ThemedText>
          <View style={styles.resultMeta}>
            <Pill
              label={t("quranRoots.occurrences", { count: rootCount(index, root) })}
              color={colors.accent}
              background={tokens.accentSoft}
            />
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("quranRoots.lemmaCount", { count: lemmaCount(index, root) })}
            </ThemedText>
          </View>
          {/* Decorative: the whole row opens the root. A nested IconButton
              rendered <button> inside <button> on web (invalid HTML). */}
          <SymbolView
            name={chevron}
            size={16}
            tintColor={colors.mutedForeground}
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        </PressableScale>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  hint: { flex: 1, minWidth: 160 },
  suggestions: { gap: Spacing.two, marginTop: Spacing.two },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
  chipText: { fontSize: 20, lineHeight: 32 },
  result: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    minHeight: TvLayout.minFocusTarget,
  },
  resultRoot: { fontSize: 28, lineHeight: 42, minWidth: 96, textAlign: "center" },
  resultMeta: { flex: 1, gap: Spacing.one, alignItems: "flex-start" },
});
