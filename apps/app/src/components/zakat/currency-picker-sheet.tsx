import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, TextInput, View } from "react-native";
import { CurrencyGlyph } from "@/components/money/currency-glyph";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { type CurrencyDef, getCurrencyInfo, SUPPORTED_CURRENCIES } from "@/constants/currencies";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ZAKAT_PINNED_CURRENCY_CODES } from "@/lib/format-currency";
import { createFuzzyIndex } from "@/lib/search";

type CurrencyPickerSheetProps = {
  visible: boolean;
  selectedCode: string;
  onSelect: (code: string) => void;
  onClose: () => void;
};

function sortCurrencies(selectedCode: string): CurrencyDef[] {
  const pinned = new Set<string>(ZAKAT_PINNED_CURRENCY_CODES);
  const selected = getCurrencyInfo(selectedCode);
  const rest = SUPPORTED_CURRENCIES.filter((c) => !pinned.has(c.code) && c.code !== selectedCode);
  const pinnedList = ZAKAT_PINNED_CURRENCY_CODES.map((code) => getCurrencyInfo(code)).filter(
    (c): c is CurrencyDef => c != null && c.code !== selectedCode,
  );
  return [
    ...(selected ? [selected] : []),
    ...pinnedList,
    ...rest.sort((a, b) => a.code.localeCompare(b.code)),
  ];
}

export function CurrencyPickerSheet({
  visible,
  selectedCode,
  onSelect,
  onClose,
}: CurrencyPickerSheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!visible) setSearch("");
  }, [visible]);

  const ordered = useMemo(() => sortCurrencies(selectedCode), [selectedCode]);
  const fuse = useMemo(
    () =>
      createFuzzyIndex(ordered, [
        { key: "code", weight: 2, get: (c) => c.code },
        { key: "name", weight: 1.5, get: (c) => c.name },
        { key: "symbol", weight: 0.8, get: (c) => c.symbol },
      ]),
    [ordered],
  );

  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return ordered;
    return fuse.search(q);
  }, [fuse, ordered, search]);

  const handleSelect = (code: string) => {
    onSelect(code);
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom" solid scrollable={false}>
      <ThemedText type="subtitle">{t("zakat.currency.pickerTitle")}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("zakat.currency.pickerHint", { count: SUPPORTED_CURRENCIES.length })}
      </ThemedText>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder={t("zakat.currency.searchPlaceholder")}
        placeholderTextColor={colors.mutedForeground}
        accessibilityLabel={t("zakat.currency.searchPlaceholder")}
        autoCorrect={false}
        autoCapitalize="characters"
        style={[
          styles.search,
          {
            backgroundColor: colors.muted,
            color: colors.foreground,
            textAlign: I18nManager.isRTL ? "right" : "left",
          },
        ]}
      />

      <TvFlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        keyboardShouldPersistTaps="handled"
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.one }} />}
        ListEmptyComponent={
          <ThemedText type="small" themeColor="mutedForeground" style={styles.empty}>
            {t("zakat.currency.noResults")}
          </ThemedText>
        }
        renderItem={({ item }) => {
          const selected = item.code === selectedCode;
          return (
            <PressableScale
              haptic="selection"
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${item.code} ${item.name}`}
              onPress={() => handleSelect(item.code)}
              style={[styles.row, { backgroundColor: selected ? tokens.accentSoft : colors.muted }]}
            >
              <View style={[styles.badge, { backgroundColor: tokens.accentSoft }]}>
                {item.glyph ? (
                  <CurrencyGlyph glyph={item.glyph} size={18} color={colors.accent} />
                ) : (
                  <ThemedText type="smallBold" style={{ color: colors.accent }}>
                    {item.symbol}
                  </ThemedText>
                )}
              </View>
              <View style={styles.meta}>
                <ThemedText type="smallBold">{item.code}</ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {item.name}
                </ThemedText>
              </View>
            </PressableScale>
          );
        }}
      />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.one, marginBottom: Spacing.three, lineHeight: 18 },
  search: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    fontSize: 16,
    marginBottom: Spacing.three,
  },
  list: { maxHeight: 420 },
  listContent: { paddingBottom: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  meta: { flex: 1, gap: 2 },
  empty: { textAlign: "center", paddingVertical: Spacing.four },
});
