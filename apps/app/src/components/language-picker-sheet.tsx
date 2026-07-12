import { getLocaleDefinition } from "@munib-tracker/shared/i18n";
import type { AppLocale } from "@munib-tracker/shared/types";
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
import { APP_LOCALES, localeSecondaryLabel, matchesLocaleSearch } from "@/lib/locale-display";
import { useChevronForward, useIsRTL } from "@/lib/rtl";

type LanguagePickerSheetProps = {
  visible: boolean;
  value: AppLocale;
  onSelect: (locale: AppLocale) => void;
  onClose: () => void;
  /** When true, annotate rows with bundled scripture availability (translation picker). */
  showScriptureStatus?: boolean;
};

type LanguageSelectRowProps = {
  locale: AppLocale;
  onPress: () => void;
  accessibilityLabel: string;
};

/** Tappable field that opens the language sheet — shows flag + native name + chevron. */
export function LanguageSelectRow({ locale, onPress, accessibilityLabel }: LanguageSelectRowProps) {
  const { colors } = useThemeTokens();
  const rtl = useIsRTL();
  const chevron = useChevronForward();
  const { name } = APP_LOCALES.find((entry) => entry.code === locale) ?? APP_LOCALES[0];

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[styles.trigger, { backgroundColor: colors.muted }]}
    >
      <LocaleFlag
        locale={locale}
        size="sm"
        backgroundColor={colors.card}
        borderColor={colors.border}
      />
      <View style={styles.triggerLabelWrap}>
        <ThemedText type="small" numberOfLines={1}>
          {name}
        </ThemedText>
      </View>
      <SymbolView
        key={rtl ? "chevron-rtl" : "chevron-ltr"}
        name={chevron}
        size={14}
        tintColor={colors.mutedForeground}
      />
    </PressableScale>
  );
}

export function LanguagePickerSheet({
  visible,
  value,
  onSelect,
  onClose,
  showScriptureStatus = false,
}: LanguagePickerSheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!visible) setSearch("");
  }, [visible]);

  const filtered = useMemo(
    () => APP_LOCALES.filter((entry) => matchesLocaleSearch(search, entry)),
    [search],
  );

  const handleSelect = (code: AppLocale) => {
    onSelect(code);
    onClose();
  };

  const title = search
    ? t("languagePicker.selectLanguageWithCount", {
        filtered: filtered.length,
        total: APP_LOCALES.length,
      })
    : t("languagePicker.selectLanguageWithCount", {
        filtered: APP_LOCALES.length,
        total: APP_LOCALES.length,
      });

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom" scrollable={false} solid>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText type="subtitle">{title}</ThemedText>
            <View style={[styles.searchRow, { backgroundColor: colors.muted }]}>
              <SymbolView
                name={{ ios: "magnifyingglass", android: "search", web: "search" }}
                size={16}
                tintColor={colors.mutedForeground}
              />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={t("languagePicker.searchLanguages")}
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
                    name={{
                      ios: "xmark.circle.fill",
                      android: "cancel",
                      web: "cancel",
                    }}
                    size={16}
                    tintColor={colors.mutedForeground}
                  />
                </PressableScale>
              ) : null}
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.empty}>
            {t("languagePicker.noResults")}
          </ThemedText>
        }
        renderItem={({ item }) => {
          const { code, name, english } = item;
          const selected = value === code;
          const secondary = localeSecondaryLabel(code, english, name);
          const scriptureNote = showScriptureStatus
            ? getLocaleDefinition(code).scriptureSupported
              ? t("language.scriptureAvailable")
              : t("language.scriptureUnavailable")
            : null;

          return (
            <PressableScale
              haptic="selection"
              scaleTo={0.98}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => handleSelect(code)}
              style={[
                styles.row,
                {
                  backgroundColor: selected ? tokens.accentSoft : colors.muted,
                  borderColor: selected ? tokens.accentBorder : "transparent",
                },
              ]}
            >
              <LocaleFlag
                locale={code}
                active={selected}
                activeBackgroundColor={withAlpha(colors.accent, 0.2)}
                activeRingColor={withAlpha(colors.accent, 0.4)}
                backgroundColor={colors.card}
                borderColor={colors.border}
              />
              <View style={styles.rowText}>
                <ThemedText
                  type="small"
                  style={{ color: selected ? colors.accent : colors.foreground }}
                  numberOfLines={1}
                >
                  {name}
                </ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                  {secondary}
                </ThemedText>
                {scriptureNote ? (
                  <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={2}>
                    {scriptureNote}
                  </ThemedText>
                ) : null}
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
        }}
      />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    minHeight: 52,
    marginTop: Spacing.three,
  },
  triggerLabelWrap: {
    flex: 1,
    minWidth: 0,
  },
  list: {
    flexGrow: 0,
    flexShrink: 1,
    minHeight: 0,
  },
  header: {
    gap: Spacing.two,
    marginBottom: Spacing.two,
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
  rowText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
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
