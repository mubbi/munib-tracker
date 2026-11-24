import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, TextInput, View } from "react-native";
import { LocaleFlag } from "@/components/locale-flag";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { localeSecondaryLabel } from "@/lib/locale-display";
import type { EditionLanguageGroup } from "@/lib/quran-edition-groups";
import { useChevronBack, useChevronForward } from "@/lib/rtl";

/** One selectable edition (a translation or a tafsir). */
export type PickerEdition = { id: string; name: string };

/** Feature copy (already translated by the wrapper). */
export type EditionPickerCopy = {
  /** Header on the editions step for `language` (the group's display name). */
  selectEdition: (language: string) => string;
  searchLanguages: string;
  searchEditions: string;
  /** "3 translations" / "3 tafsirs". */
  editionCount: (count: number) => string;
  /** Label of the optional "None" row. */
  none: string;
};

export type EditionPickerSheetProps<E extends PickerEdition> = {
  visible: boolean;
  title: string;
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  /** Show a "None" row (selects `""`) at the top of the language list. */
  allowNone: boolean;
  groups: readonly EditionLanguageGroup<E>[];
  /** Language of an edition id, to open straight on the selected edition's language. */
  languageOf: (editionId: string) => string | undefined;
  /** Edition-step search (`query` is trimmed + lowercased). */
  matchesEdition: (edition: E, query: string) => boolean;
  /** Second line of an edition row. */
  editionSubtitle: (edition: E) => string;
  copy: EditionPickerCopy;
};

type Step = "languages" | "editions";

const CHECKMARK = { ios: "checkmark", android: "check", web: "check" } as const;

/**
 * Two-step language → edition picker shared by the Qur'an translation and tafsir
 * sheets: search per step, flags for app locales, an optional "None" row, and
 * the selected edition's language opened directly.
 */
export function EditionPickerSheet<E extends PickerEdition>({
  visible,
  title,
  selectedId,
  onSelect,
  onClose,
  allowNone,
  groups,
  languageOf,
  matchesEdition,
  editionSubtitle,
  copy,
}: EditionPickerSheetProps<E>) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronBack = useChevronBack();
  const chevronForward = useChevronForward();
  const [step, setStep] = useState<Step>("languages");
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const activeGroup = useMemo(
    () => groups.find((group) => group.language === activeLanguage) ?? null,
    [groups, activeLanguage],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-sync only when opened or the selection changes
  useEffect(() => {
    if (!visible) {
      setSearch("");
      setStep("languages");
      setActiveLanguage(null);
      return;
    }

    if (selectedId) {
      const language = languageOf(selectedId);
      if (language) {
        setActiveLanguage(language);
        setStep("editions");
      }
    }
  }, [visible, selectedId]);

  const filteredLanguages = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q || step !== "languages") return groups;
    return groups.filter((group) => {
      const haystack = `${group.language} ${group.name} ${group.english}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [groups, search, step]);

  const filteredEditions = useMemo(() => {
    if (!activeGroup) return [];
    const q = search.trim().toLowerCase();
    if (!q || step !== "editions") return activeGroup.editions;
    return activeGroup.editions.filter((edition) => matchesEdition(edition, q));
  }, [activeGroup, matchesEdition, search, step]);

  const choose = (id: string) => {
    onSelect(id);
    onClose();
  };

  const openLanguage = (language: string) => {
    setActiveLanguage(language);
    setSearch("");
    setStep("editions");
  };

  const backToLanguages = () => {
    setStep("languages");
    setSearch("");
  };

  const headerTitle = step === "languages" ? title : copy.selectEdition(activeGroup?.name ?? "");
  const searchPlaceholder = step === "languages" ? copy.searchLanguages : copy.searchEditions;

  const rowColors = (selected: boolean) => ({
    backgroundColor: selected ? tokens.accentSoft : colors.muted,
    borderColor: selected ? tokens.accentBorder : "transparent",
  });

  const selectionMark = (selected: boolean) =>
    selected ? (
      <SymbolView name={CHECKMARK} size={20} tintColor={colors.accent} />
    ) : (
      <View style={styles.checkSpacer} />
    );

  const renderLanguageRow = ({ item }: { item: EditionLanguageGroup<E> }) => {
    const hasSelection = selectedId
      ? item.editions.some((edition) => edition.id === selectedId)
      : false;
    const secondary = item.locale
      ? localeSecondaryLabel(item.locale, item.english, item.name)
      : item.english;

    return (
      <PressableScale
        haptic="light"
        scaleTo={0.98}
        accessibilityRole="button"
        accessibilityState={{ selected: hasSelection }}
        onPress={() => openLanguage(item.language)}
        style={[styles.row, rowColors(hasSelection)]}
      >
        {item.locale ? (
          <LocaleFlag
            locale={item.locale}
            size="sm"
            active={hasSelection}
            activeBackgroundColor={withAlpha(colors.accent, 0.2)}
            activeRingColor={withAlpha(colors.accent, 0.4)}
            backgroundColor={colors.card}
            borderColor={colors.border}
          />
        ) : (
          <View style={[styles.flagFallback, { backgroundColor: colors.card }]} />
        )}
        <View style={styles.rowText}>
          <ThemedText
            type="small"
            style={{ color: hasSelection ? colors.accent : colors.foreground }}
            numberOfLines={1}
          >
            {item.name}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {secondary}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {copy.editionCount(item.editions.length)}
          </ThemedText>
        </View>
        <SymbolView name={chevronForward} size={16} tintColor={colors.mutedForeground} />
      </PressableScale>
    );
  };

  const renderEditionRow = ({ item }: { item: E }) => {
    const selected = item.id === selectedId;
    return (
      <PressableScale
        haptic="selection"
        scaleTo={0.98}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={() => choose(item.id)}
        style={[styles.row, rowColors(selected)]}
      >
        <View style={styles.rowText}>
          <ThemedText
            type="small"
            style={{ color: selected ? colors.accent : colors.foreground }}
            numberOfLines={2}
          >
            {item.name}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {editionSubtitle(item)}
          </ThemedText>
        </View>
        {selectionMark(selected)}
      </PressableScale>
    );
  };

  const emptyList = (
    <ThemedText type="caption" themeColor="mutedForeground" style={styles.empty}>
      {t("languagePicker.noResults")}
    </ThemedText>
  );

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom" scrollable={false}>
      <View style={styles.header}>
        {step === "editions" ? (
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={t("quran.backToLanguages")}
            onPress={backToLanguages}
            style={styles.backRow}
          >
            <SymbolView name={chevronBack} size={16} tintColor={colors.accent} />
            <ThemedText type="small" style={{ color: colors.accentText }}>
              {t("quran.backToLanguages")}
            </ThemedText>
          </PressableScale>
        ) : null}
        <ThemedText type="subtitle">{headerTitle}</ThemedText>
        <View style={[styles.searchRow, tokens.inputSurface]}>
          <SymbolView
            name={{ ios: "magnifyingglass", android: "search", web: "search" }}
            size={16}
            tintColor={colors.mutedForeground}
          />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {search.length > 0 ? (
            <PressableScale
              haptic="light"
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={t("search.clear")}
              onPress={() => setSearch("")}
            >
              <SymbolView
                name={{ ios: "xmark.circle.fill", android: "cancel", web: "cancel" }}
                size={16}
                tintColor={colors.mutedForeground}
              />
            </PressableScale>
          ) : null}
        </View>
      </View>

      {step === "languages" ? (
        <TvFlatList
          data={filteredLanguages}
          keyExtractor={(item) => item.language}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator
          ListHeaderComponent={
            allowNone ? (
              <PressableScale
                haptic="selection"
                accessibilityRole="button"
                accessibilityState={{ selected: selectedId === "" }}
                onPress={() => choose("")}
                style={[styles.row, styles.noneRow, rowColors(selectedId === "")]}
              >
                <View style={styles.rowText}>
                  <ThemedText type="small">{copy.none}</ThemedText>
                </View>
                {selectionMark(selectedId === "")}
              </PressableScale>
            ) : undefined
          }
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={emptyList}
          renderItem={renderLanguageRow}
        />
      ) : (
        <TvFlatList
          data={filteredEditions}
          keyExtractor={(item) => item.id}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={emptyList}
          renderItem={renderEditionRow}
        />
      )}
    </Sheet>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    alignSelf: "flex-start",
    paddingVertical: Spacing.one,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Platform.OS === "web" ? Spacing.two : Spacing.one,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  searchInput: {
    flex: 1,
    fontSize: Platform.OS === "web" ? 16 : 15,
    paddingVertical: Spacing.two,
  },
  list: {
    flexGrow: 0,
    flexShrink: 1,
    minHeight: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
    minHeight: 52,
  },
  noneRow: {
    marginBottom: Spacing.two,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  flagFallback: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  checkSpacer: {
    width: 20,
  },
  separator: {
    height: 6,
  },
  empty: {
    textAlign: "center",
    paddingVertical: Spacing.four,
  },
});
