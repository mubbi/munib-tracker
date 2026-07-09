import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Platform, StyleSheet, TextInput, View } from "react-native";

import { LocaleFlag } from "@/components/locale-flag";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { localeSecondaryLabel } from "@/lib/locale-display";
import {
  getAllQuranTranslations,
  groupTranslationsByLanguage,
  languageForEditionId,
  type TranslationLanguageGroup,
} from "@/lib/quran-translation-options";
import { chevronBack, chevronForward } from "@/lib/rtl";

type TranslationPickerSheetProps = {
  visible: boolean;
  title: string;
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  /** When true, show a "None" row at the top of the language list (second translation). */
  allowNone?: boolean;
  /** Bias language ordering — typically `translationLocale` and app `locale`. */
  preferredLanguages?: string[];
};

type Step = "languages" | "editions";

const ALL_TRANSLATIONS = getAllQuranTranslations();

export function TranslationPickerSheet({
  visible,
  title,
  selectedId,
  onSelect,
  onClose,
  allowNone = false,
  preferredLanguages = [],
}: TranslationPickerSheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [step, setStep] = useState<Step>("languages");
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const languageGroups = useMemo(
    () => groupTranslationsByLanguage(ALL_TRANSLATIONS, preferredLanguages),
    [preferredLanguages],
  );

  const activeGroup = useMemo(
    () => languageGroups.find((group) => group.language === activeLanguage) ?? null,
    [languageGroups, activeLanguage],
  );

  useEffect(() => {
    if (!visible) {
      setSearch("");
      setStep("languages");
      setActiveLanguage(null);
      return;
    }

    if (selectedId) {
      const language = languageForEditionId(selectedId, ALL_TRANSLATIONS);
      if (language) {
        setActiveLanguage(language);
        setStep("editions");
      }
    }
  }, [visible, selectedId]);

  const filteredLanguages = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q || step !== "languages") return languageGroups;
    return languageGroups.filter((group) => {
      const haystack = `${group.language} ${group.name} ${group.english}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [languageGroups, search, step]);

  const filteredEditions = useMemo(() => {
    if (!activeGroup) return [];
    const q = search.trim().toLowerCase();
    if (!q || step !== "editions") return activeGroup.editions;
    return activeGroup.editions.filter((edition) => edition.name.toLowerCase().includes(q));
  }, [activeGroup, search, step]);

  const handleSelectEdition = (id: string) => {
    onSelect(id);
    onClose();
  };

  const handleSelectNone = () => {
    onSelect("");
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

  const headerTitle =
    step === "languages"
      ? title
      : t("quran.selectTranslator", { language: activeGroup?.name ?? "" });

  const searchPlaceholder =
    step === "languages" ? t("quran.searchTranslationLanguages") : t("quran.searchTranslators");

  const renderLanguageRow = ({ item }: { item: TranslationLanguageGroup }) => {
    const hasSelection = selectedId
      ? item.editions.some((edition) => edition.id === selectedId)
      : false;
    const secondary = item.locale
      ? localeSecondaryLabel(item.locale, item.english, item.name)
      : item.english;
    const countLabel = t("quran.translationCount", { count: item.editions.length });

    return (
      <PressableScale
        haptic="light"
        scaleTo={0.98}
        accessibilityRole="button"
        accessibilityState={{ selected: hasSelection }}
        onPress={() => openLanguage(item.language)}
        style={[
          styles.row,
          {
            backgroundColor: hasSelection ? tokens.accentSoft : colors.muted,
            borderColor: hasSelection ? tokens.accentBorder : "transparent",
          },
        ]}
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
            {countLabel}
          </ThemedText>
        </View>
        <SymbolView name={chevronForward()} size={16} tintColor={colors.mutedForeground} />
      </PressableScale>
    );
  };

  const renderEditionRow = ({ item }: { item: (typeof ALL_TRANSLATIONS)[number] }) => {
    const selected = item.id === selectedId;
    const subtitle = item.bundled ? t("quran.translationBundled") : t("quran.translationRemote");

    return (
      <PressableScale
        haptic="selection"
        scaleTo={0.98}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={() => handleSelectEdition(item.id)}
        style={[
          styles.row,
          {
            backgroundColor: selected ? tokens.accentSoft : colors.muted,
            borderColor: selected ? tokens.accentBorder : "transparent",
          },
        ]}
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
            {subtitle}
          </ThemedText>
        </View>
        {selected ? (
          <SymbolView
            name={{ ios: "checkmark", android: "check", web: "check" }}
            size={20}
            tintColor={colors.accent}
          />
        ) : (
          <View style={styles.checkSpacer} />
        )}
      </PressableScale>
    );
  };

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom" scrollable={false} solid>
      <View style={styles.header}>
        {step === "editions" ? (
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={t("quran.backToLanguages")}
            onPress={backToLanguages}
            style={styles.backRow}
          >
            <SymbolView name={chevronBack()} size={16} tintColor={colors.accent} />
            <ThemedText type="small" style={{ color: colors.accent }}>
              {t("quran.backToLanguages")}
            </ThemedText>
          </PressableScale>
        ) : null}
        <ThemedText type="subtitle">{headerTitle}</ThemedText>
        <View style={[styles.searchRow, { backgroundColor: colors.muted }]}>
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
        <FlatList
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
                onPress={handleSelectNone}
                style={[
                  styles.row,
                  styles.noneRow,
                  {
                    backgroundColor: selectedId === "" ? tokens.accentSoft : colors.muted,
                    borderColor: selectedId === "" ? tokens.accentBorder : "transparent",
                  },
                ]}
              >
                <View style={styles.rowText}>
                  <ThemedText type="small">{t("quran.secondTranslationNone")}</ThemedText>
                </View>
                {selectedId === "" ? (
                  <SymbolView
                    name={{ ios: "checkmark", android: "check", web: "check" }}
                    size={20}
                    tintColor={colors.accent}
                  />
                ) : (
                  <View style={styles.checkSpacer} />
                )}
              </PressableScale>
            ) : null
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.empty}>
              {t("languagePicker.noResults")}
            </ThemedText>
          }
          renderItem={renderLanguageRow}
        />
      ) : (
        <FlatList
          data={filteredEditions}
          keyExtractor={(item) => item.id}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.empty}>
              {t("languagePicker.noResults")}
            </ThemedText>
          }
          renderItem={renderEditionRow}
        />
      )}
    </Sheet>
  );
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
