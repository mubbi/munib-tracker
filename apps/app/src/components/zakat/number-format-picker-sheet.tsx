import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { CurrencyGlyph } from "@/components/money/currency-glyph";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { NUMBER_FORMAT_OPTIONS, type NumberFormatStyle } from "@/lib/format-currency";

type NumberFormatPickerSheetProps = {
  visible: boolean;
  selected: NumberFormatStyle;
  currencySymbol?: string;
  currencyGlyph?: "AED" | "SAR";
  onSelect: (style: NumberFormatStyle) => void;
  onClose: () => void;
};

export function NumberFormatPickerSheet({
  visible,
  selected,
  currencySymbol,
  currencyGlyph,
  onSelect,
  onClose,
}: NumberFormatPickerSheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom" solid>
      <ThemedText type="subtitle">{t("zakat.numberFormat.pickerTitle")}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("zakat.numberFormat.pickerHint")}
      </ThemedText>

      <View style={styles.list}>
        {NUMBER_FORMAT_OPTIONS.map((opt) => {
          const isSelected = opt.id === selected;
          return (
            <PressableScale
              key={opt.id}
              haptic="selection"
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${opt.label} ${opt.example}`}
              onPress={() => {
                onSelect(opt.id);
                onClose();
              }}
              style={[
                styles.row,
                { backgroundColor: isSelected ? tokens.accentSoft : colors.muted },
              ]}
            >
              <View style={styles.meta}>
                <ThemedText
                  type="smallBold"
                  style={{ color: isSelected ? colors.accent : colors.foreground }}
                >
                  {opt.label}
                </ThemedText>
                <View style={styles.exampleRow}>
                  {currencyGlyph ? (
                    <CurrencyGlyph glyph={currencyGlyph} size={12} color={colors.mutedForeground} />
                  ) : currencySymbol ? (
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {currencySymbol}
                    </ThemedText>
                  ) : null}
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {opt.example}
                  </ThemedText>
                </View>
              </View>
              {isSelected ? (
                <SymbolView
                  name={{
                    ios: "checkmark.circle.fill",
                    android: "check_circle",
                    web: "check_circle",
                  }}
                  size={22}
                  tintColor={colors.accent}
                />
              ) : null}
            </PressableScale>
          );
        })}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.one, marginBottom: Spacing.three, lineHeight: 18 },
  list: { gap: Spacing.one },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  meta: { flex: 1, gap: 2 },
  exampleRow: { flexDirection: "row", alignItems: "center", gap: 2 },
});
