import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { type LayoutChangeEvent, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { MoneyText } from "@/components/money/money-text";
import { ThemedText } from "@/components/themed-text";
import { GlassSurface, hasLiquidGlass } from "@/components/ui/glass-surface";
import { IconButton } from "@/components/ui/icon-button";
import { MaxContentWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { ZakatCalculatorState } from "@/hooks/use-zakat-calculator";

type ZakatSummaryBarProps = Pick<
  ZakatCalculatorState,
  "result" | "money" | "hasInput" | "effectiveNisab" | "currencyCode" | "resetForm"
> & {
  onHeightChange?: (height: number) => void;
};

/**
 * Sticky bottom chrome so zakat due stays visible while the user scrolls the
 * long calculator form — same glass material language as the app header / mini-player.
 */
export function ZakatSummaryBar({
  result,
  money,
  hasInput,
  effectiveNisab,
  currencyCode,
  resetForm,
  onHeightChange,
}: ZakatSummaryBarProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const insets = useSafeAreaInsets();
  const [confirmReset, setConfirmReset] = useState(false);
  const success = tokens.status.success;
  const hasDue = hasInput && result.totalDue > 0;
  const accent = hasDue ? success.color : colors.mutedForeground;

  const onLayout = (event: LayoutChangeEvent) => {
    onHeightChange?.(event.nativeEvent.layout.height);
  };

  return (
    <>
      <View
        onLayout={onLayout}
        accessibilityRole="text"
        style={[
          styles.shell,
          {
            borderTopColor: tokens.hairline,
            paddingBottom: Math.max(insets.bottom, Spacing.two),
          },
        ]}
      >
        <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
          <GlassSurface style={StyleSheet.absoluteFill} intensity={50} backdropCapture />
        </View>
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              pointerEvents: "none",
              backgroundColor: withAlpha(
                colors.card,
                hasLiquidGlass ? (tokens.isDark ? 0.28 : 0.4) : tokens.isDark ? 0.55 : 0.7,
              ),
            },
          ]}
        />

        <View style={styles.inner}>
          <View style={[styles.iconWell, { backgroundColor: withAlpha(accent, 0.14) }]}>
            <SymbolView
              name={{
                ios: hasDue ? "checkmark.seal.fill" : "scalemass.fill",
                android: hasDue ? "verified" : "balance",
                web: hasDue ? "verified" : "balance",
              }}
              size={18}
              tintColor={accent}
            />
          </View>

          <View style={styles.copy}>
            <View style={styles.dueRow}>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("zakat.heroEmpty")}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {currencyCode}
              </ThemedText>
            </View>
            {hasInput ? (
              <MoneyText style={[styles.dueAmount, { color: accent }]}>
                {money(result.totalDue)}
              </MoneyText>
            ) : (
              <ThemedText type="smallBold" style={{ color: accent }}>
                —
              </ThemedText>
            )}
            <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
              {hasInput
                ? hasDue
                  ? result.meetsNisab
                    ? t("zakat.bar.meetsNisab", {
                        wealth: money(result.netWealth),
                        nisab: money(effectiveNisab),
                      })
                    : t("zakat.bar.hasOtherDue", {
                        wealth: money(result.netWealth),
                      })
                  : t("zakat.bar.belowNisab", {
                      wealth: money(result.netWealth),
                      nisab: effectiveNisab > 0 ? money(effectiveNisab) : "—",
                    })
                : t("zakat.heroHint")}
            </ThemedText>
          </View>

          <IconButton
            name={{
              ios: "arrow.counterclockwise",
              android: "restart_alt",
              web: "restart_alt",
            }}
            size={18}
            hitTarget={44}
            tintColor={hasInput ? tokens.status.danger.color : colors.mutedForeground}
            background={
              hasInput
                ? withAlpha(tokens.status.danger.color, 0.12)
                : withAlpha(colors.mutedForeground, 0.08)
            }
            disabled={!hasInput}
            accessibilityLabel={t("zakat.reset.a11y")}
            accessibilityHint={t("zakat.reset.hint")}
            onPress={() => setConfirmReset(true)}
          />
        </View>
      </View>

      <ConfirmDialog
        visible={confirmReset}
        title={t("zakat.reset.title")}
        message={t("zakat.reset.message")}
        confirmLabel={t("zakat.reset.confirm")}
        destructive
        onConfirm={resetForm}
        onClose={() => setConfirmReset(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.two + 2,
    paddingHorizontal: Spacing.four,
  },
  inner: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  iconWell: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1, minWidth: 0, gap: 2 },
  dueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  dueAmount: { fontSize: 22, fontWeight: "700", lineHeight: 28 },
});
