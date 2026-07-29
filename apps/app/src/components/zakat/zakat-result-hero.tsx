import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MoneyText } from "@/components/money/money-text";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { ZakatCalculatorState } from "@/hooks/use-zakat-calculator";

type ZakatResultHeroProps = Pick<
  ZakatCalculatorState,
  | "result"
  | "money"
  | "hasInput"
  | "effectiveNisab"
  | "goldNisab"
  | "silverNisab"
  | "suggestedNisab"
  | "currencyCode"
>;

export function ZakatResultHero({
  result,
  money,
  hasInput,
  effectiveNisab,
  goldNisab,
  silverNisab,
  suggestedNisab,
  currencyCode,
}: ZakatResultHeroProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const success = tokens.status.success;
  const hasDue = hasInput && result.totalDue > 0;
  const palette = hasDue ? success : { color: colors.mutedForeground, soft: colors.muted };

  return (
    <Card
      padding="three"
      style={{
        backgroundColor: palette.soft,
        borderColor: hasDue ? withAlpha(success.color, 0.35) : tokens.hairline,
        borderWidth: StyleSheet.hairlineWidth,
      }}
    >
      <View style={styles.topRow}>
        <IconWell
          icon={{
            ios: hasDue ? "checkmark.seal.fill" : "scalemass.fill",
            android: hasDue ? "verified" : "balance",
            web: hasDue ? "verified" : "balance",
          }}
          tint={palette.color}
          background={withAlpha(palette.color, 0.14)}
          well={44}
          size={20}
        />
        <View style={styles.topCopy}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("zakat.heroEmpty")}
          </ThemedText>
          {hasInput ? (
            <MoneyText style={[styles.dueAmount, { color: palette.color }]}>
              {money(result.totalDue)}
            </MoneyText>
          ) : (
            <ThemedText type="header" style={{ color: palette.color }}>
              —
            </ThemedText>
          )}
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("zakat.currency.inCurrency", { code: currencyCode })}
          </ThemedText>
        </View>
      </View>

      {hasInput ? (
        <View style={styles.stats}>
          <View style={[styles.statTile, { backgroundColor: withAlpha(colors.foreground, 0.04) }]}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("zakat.netWealth")}
            </ThemedText>
            <MoneyText style={[styles.statValue, { color: colors.foreground }]}>
              {money(result.netWealth)}
            </MoneyText>
          </View>
          <View style={[styles.statTile, { backgroundColor: withAlpha(colors.foreground, 0.04) }]}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("zakat.field.nisab")}
            </ThemedText>
            <MoneyText style={[styles.statValue, { color: colors.foreground }]}>
              {effectiveNisab > 0 ? money(effectiveNisab) : "—"}
            </MoneyText>
          </View>
        </View>
      ) : null}

      {hasInput &&
      (result.wealthDue > 0 || result.agricultureDue > 0 || result.livestockCashEstimate > 0) ? (
        <View style={styles.breakdown}>
          {result.wealthDue > 0 ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("zakat.breakdown.wealth", { value: money(result.wealthDue) })}
            </ThemedText>
          ) : null}
          {result.agricultureDue > 0 ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("zakat.breakdown.agriculture", { value: money(result.agricultureDue) })}
            </ThemedText>
          ) : null}
          {result.livestockCashEstimate > 0 ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("zakat.breakdown.livestock", { value: money(result.livestockCashEstimate) })}
            </ThemedText>
          ) : null}
        </View>
      ) : null}

      <ThemedText type="small" themeColor="mutedForeground" style={styles.status}>
        {hasInput
          ? hasDue
            ? result.meetsNisab
              ? t("zakat.dueLabel")
              : t("zakat.dueLabelOther")
            : t("zakat.belowNisab")
          : t("zakat.heroHint")}
      </ThemedText>

      {hasInput && result.meetsNisab ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.hawl}>
          {t("zakat.hawlReminder")}
        </ThemedText>
      ) : null}

      {(goldNisab > 0 || silverNisab > 0) && hasInput ? (
        <View style={styles.pillRow}>
          {goldNisab > 0 ? (
            <Pill
              label={t("zakat.nisabGoldShort", { value: money(goldNisab) })}
              compact
              color={
                suggestedNisab === goldNisab && goldNisab > 0
                  ? success.color
                  : colors.mutedForeground
              }
              background={
                suggestedNisab === goldNisab && goldNisab > 0 ? success.soft : colors.card
              }
            />
          ) : null}
          {silverNisab > 0 ? (
            <Pill
              label={t("zakat.nisabSilverShort", { value: money(silverNisab) })}
              compact
              color={
                suggestedNisab === silverNisab && silverNisab > 0
                  ? success.color
                  : colors.mutedForeground
              }
              background={
                suggestedNisab === silverNisab && silverNisab > 0 ? success.soft : colors.card
              }
            />
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  topCopy: { flex: 1, gap: Spacing.half },
  dueAmount: { fontSize: 28, fontWeight: "700", lineHeight: 34 },
  stats: { flexDirection: "row", gap: Spacing.two, marginTop: Spacing.three },
  statTile: {
    flex: 1,
    gap: Spacing.half,
    padding: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  statValue: { fontSize: 14, fontWeight: "700" },
  breakdown: { marginTop: Spacing.two, gap: Spacing.half },
  status: { marginTop: Spacing.two, lineHeight: 20 },
  hawl: { marginTop: Spacing.two, lineHeight: 18 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.three },
});
