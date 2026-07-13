import { SymbolView } from "expo-symbols";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { CurrencyGlyph } from "@/components/money/currency-glyph";
import { MoneyText } from "@/components/money/money-text";
import { ThemedText } from "@/components/themed-text";
import { GlassSurface, hasLiquidGlass } from "@/components/ui/glass-surface";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Durations } from "@/constants/motion";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useHorizontalWheelScroll } from "@/hooks/use-horizontal-wheel-scroll";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { ZakatCalculatorState } from "@/hooks/use-zakat-calculator";
import { NUMBER_FORMAT_OPTIONS } from "@/lib/format-currency";

type ZakatFiltersToolbarProps = Pick<
  ZakatCalculatorState,
  | "currencyCode"
  | "currency"
  | "numberFormat"
  | "money"
  | "market"
  | "pricesManual"
  | "applyLivePrices"
  | "effectiveNisab"
  | "result"
  | "hasInput"
> & {
  visible: boolean;
  onOpenCurrency: () => void;
  onOpenNumberFormat: () => void;
};

/**
 * Compact filter chips under the header once the user scrolls — currency,
 * number format, live metals, nisab, and due so key controls stay reachable.
 */
export function ZakatFiltersToolbar({
  visible,
  currencyCode,
  currency,
  numberFormat,
  money,
  market,
  pricesManual,
  applyLivePrices,
  effectiveNisab,
  result,
  hasInput,
  onOpenCurrency,
  onOpenNumberFormat,
}: ZakatFiltersToolbarProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const scrollRef = useHorizontalWheelScroll();
  const reveal = useSharedValue(visible ? 1 : 0);
  const marketReady = Boolean(market.data);
  const marketLoading = market.isLoading || market.isFetching;
  const formatLabel = NUMBER_FORMAT_OPTIONS.find((o) => o.id === numberFormat)?.label ?? "1,000.00";
  const success = tokens.status.success;
  const hasDue = hasInput && result.totalDue > 0;

  useEffect(() => {
    reveal.value = withTiming(visible ? 1 : 0, { duration: Durations.fast });
  }, [visible, reveal]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ translateY: (1 - reveal.value) * -8 }],
    display: reveal.value === 0 ? "none" : "flex",
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        { borderBottomColor: tokens.hairline, pointerEvents: visible ? "auto" : "none" },
        animatedStyle,
      ]}
    >
      <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
        <GlassSurface style={StyleSheet.absoluteFill} intensity={50} />
      </View>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            pointerEvents: "none",
            backgroundColor: withAlpha(
              colors.card,
              hasLiquidGlass ? (tokens.isDark ? 0.28 : 0.4) : tokens.isDark ? 0.5 : 0.62,
            ),
          },
        ]}
      />

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        keyboardShouldPersistTaps="handled"
      >
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("zakat.currency.changeA11y")}
          onPress={onOpenCurrency}
          style={[styles.chip, { backgroundColor: tokens.accentSoft }]}
        >
          {currency?.glyph ? (
            <CurrencyGlyph glyph={currency.glyph} size={14} color={colors.accent} />
          ) : (
            <SymbolView
              name={{
                ios: "dollarsign.circle.fill",
                android: "currency_exchange",
                web: "currency_exchange",
              }}
              size={14}
              tintColor={colors.accent}
            />
          )}
          <ThemedText type="smallBold" style={{ color: colors.accent }} numberOfLines={1}>
            {currencyCode}
          </ThemedText>
        </PressableScale>

        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("zakat.numberFormat.changeA11y")}
          onPress={onOpenNumberFormat}
          style={[styles.chip, { backgroundColor: colors.muted }]}
        >
          <SymbolView
            name={{ ios: "textformat.123", android: "dialpad", web: "dialpad" }}
            size={14}
            tintColor={colors.accent}
          />
          <ThemedText type="smallBold" style={{ color: colors.foreground }} numberOfLines={1}>
            {formatLabel}
          </ThemedText>
        </PressableScale>

        {marketReady ? (
          <>
            <View
              style={[styles.chip, { backgroundColor: colors.muted }]}
              accessibilityLabel={`${t("zakat.toolbar.gold")} ${money(market.data?.goldPerGram ?? 0)}`}
            >
              <SymbolView
                name={{ ios: "circle.fill", android: "circle", web: "circle" }}
                size={10}
                tintColor="#D4A017"
              />
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("zakat.toolbar.gold")}
              </ThemedText>
              <MoneyText style={[styles.chipValue, { color: colors.foreground }]}>
                {money(market.data?.goldPerGram ?? 0)}
              </MoneyText>
            </View>
            <View
              style={[styles.chip, { backgroundColor: colors.muted }]}
              accessibilityLabel={`${t("zakat.toolbar.silver")} ${money(market.data?.silverPerGram ?? 0)}`}
            >
              <SymbolView
                name={{ ios: "circle.fill", android: "circle", web: "circle" }}
                size={10}
                tintColor="#A8B0B8"
              />
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("zakat.toolbar.silver")}
              </ThemedText>
              <MoneyText style={[styles.chipValue, { color: colors.foreground }]}>
                {money(market.data?.silverPerGram ?? 0)}
              </MoneyText>
            </View>
          </>
        ) : null}

        {effectiveNisab > 0 ? (
          <View
            style={[styles.chip, { backgroundColor: colors.muted }]}
            accessibilityLabel={`${t("zakat.toolbar.nisab")} ${money(effectiveNisab)}`}
          >
            <SymbolView
              name={{ ios: "scalemass.fill", android: "balance", web: "balance" }}
              size={14}
              tintColor={colors.accent}
            />
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("zakat.toolbar.nisab")}
            </ThemedText>
            <MoneyText style={[styles.chipValue, { color: colors.foreground }]}>
              {money(effectiveNisab)}
            </MoneyText>
          </View>
        ) : null}

        {hasInput ? (
          <View
            style={[
              styles.chip,
              {
                backgroundColor: hasDue ? withAlpha(success.color, 0.14) : colors.muted,
              },
            ]}
            accessibilityLabel={`${t("zakat.toolbar.due")} ${money(result.totalDue)}`}
          >
            <SymbolView
              name={{
                ios: hasDue ? "checkmark.seal.fill" : "scalemass",
                android: hasDue ? "verified" : "balance",
                web: hasDue ? "verified" : "balance",
              }}
              size={14}
              tintColor={hasDue ? success.color : colors.mutedForeground}
            />
            <ThemedText
              type="caption"
              style={{ color: hasDue ? success.color : colors.mutedForeground }}
            >
              {t("zakat.toolbar.due")}
            </ThemedText>
            <MoneyText
              style={[styles.chipValue, { color: hasDue ? success.color : colors.mutedForeground }]}
            >
              {money(result.totalDue)}
            </MoneyText>
          </View>
        ) : null}

        <PressableScale
          haptic="selection"
          accessibilityRole="button"
          accessibilityLabel={
            pricesManual ? t("zakat.market.useLiveA11y") : t("zakat.market.refreshA11y")
          }
          onPress={applyLivePrices}
          disabled={marketLoading}
          style={[
            styles.chip,
            {
              backgroundColor: pricesManual ? tokens.accentSoft : colors.muted,
            },
          ]}
        >
          {marketLoading ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <SymbolView
              name={{ ios: "arrow.clockwise", android: "refresh", web: "refresh" }}
              size={14}
              tintColor={colors.accent}
            />
          )}
          <ThemedText type="smallBold" style={{ color: colors.accent }} numberOfLines={1}>
            {pricesManual ? t("zakat.market.useLive") : t("zakat.market.livePrice")}
          </ThemedText>
        </PressableScale>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.two,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  chipValue: { fontSize: 12, fontWeight: "700" },
});
