import { getLocaleDefinition } from "@munib-tracker/shared/i18n";
import type { AppLocale } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { LocaleFlag } from "@/components/locale-flag";
import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SearchField } from "@/components/ui/search-field";
import { Sheet } from "@/components/ui/sheet";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { BorderWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { APP_LOCALES, localeSecondaryLabel, matchesLocaleSearch } from "@/lib/locale-display";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward, useIsRTL } from "@/lib/rtl";

/** TV: 24 locales fit a 3-column grid on a landscape screen — no text entry needed. */
const TV_COLUMNS = 3;
/** Wide windows: the sheet is a centered ~640px panel — two language columns fit. */
const WIDE_COLUMNS = 2;
const WIDE_MIN_WIDTH = 768;

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
      style={[styles.trigger, isTV() && styles.triggerTv, { backgroundColor: colors.muted }]}
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
  const tv = isTV();
  const { width } = useWindowDimensions();
  const columns = tv ? TV_COLUMNS : width >= WIDE_MIN_WIDTH ? WIDE_COLUMNS : 1;

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

  const countLabel = t("languagePicker.matchCount", {
    filtered: filtered.length,
    total: APP_LOCALES.length,
  });

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      variant="bottom"
      scrollable={false}
      solid
      title={t("languagePicker.selectLanguage")}
    >
      <TvFlatList
        // numColumns can't change on a mounted FlatList — remount per column count.
        key={columns}
        data={filtered}
        keyExtractor={(item) => item.code}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator
        numColumns={columns}
        columnWrapperStyle={
          tv ? styles.columnWrapTv : columns > 1 ? styles.columnWrapWide : undefined
        }
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Live count so screen readers hear the filter result (P9-05). */}
            <ThemedText
              type="caption"
              themeColor="mutedForeground"
              accessibilityLiveRegion="polite"
              aria-live="polite"
            >
              {countLabel}
            </ThemedText>
            {/* TV: browse the grid with the D-pad instead of typing on the remote. */}
            {tv ? null : (
              <SearchField
                value={search}
                onChangeText={setSearch}
                placeholder={t("languagePicker.searchLanguages")}
              />
            )}
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
            title={t("languagePicker.noResults")}
            actionLabel={t("search.clear")}
            onAction={() => setSearch("")}
            style={styles.empty}
          />
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
              // Single choice (P6-06): announced as a radio with its checked state.
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => handleSelect(code)}
              {...(tv && selected ? { hasTVPreferredFocus: true } : {})}
              style={[
                styles.row,
                tv ? styles.rowTv : columns > 1 ? styles.rowWide : null,
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
                  style={{ color: selected ? colors.accentText : colors.foreground }}
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
  triggerTv: {
    minHeight: TvLayout.minFocusTarget,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
    minHeight: 52,
  },
  rowTv: {
    flex: 1,
    minHeight: TvLayout.minFocusTarget,
    // Selected = soft fill + hairline; the D-pad ring is drawn by PressableScale.
    borderWidth: BorderWidth.hairline,
  },
  columnWrapTv: {
    gap: Spacing.three,
  },
  columnWrapWide: {
    gap: Spacing.two,
  },
  /** Wide two-column grid: equal-width cells (the last odd cell keeps half width). */
  rowWide: {
    flex: 1,
    maxWidth: "50%",
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half,
  },
  checkSpacer: {
    width: 20,
  },
  separator: {
    height: 6,
  },
  empty: {
    paddingVertical: Spacing.four,
  },
});
