import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

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
>;

export function ZakatResultHero({
  result,
  money,
  hasInput,
  effectiveNisab,
  goldNisab,
  silverNisab,
  suggestedNisab,
}: ZakatResultHeroProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const success = tokens.status.success;
  const palette = result.meetsNisab
    ? success
    : { color: colors.mutedForeground, soft: colors.muted };

  return (
    <Card
      padding="three"
      style={{
        backgroundColor: palette.soft,
        borderColor: result.meetsNisab ? withAlpha(success.color, 0.35) : tokens.hairline,
        borderWidth: StyleSheet.hairlineWidth,
      }}
    >
      <View style={styles.topRow}>
        <IconWell
          icon={{
            ios: result.meetsNisab ? "checkmark.seal.fill" : "scalemass.fill",
            android: result.meetsNisab ? "verified" : "balance",
            web: result.meetsNisab ? "verified" : "balance",
          }}
          tint={palette.color}
          background={withAlpha(palette.color, 0.14)}
          well={44}
          size={20}
        />
        <View style={styles.topCopy}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {hasInput ? t("zakat.netWealth") : t("zakat.heroEmpty")}
          </ThemedText>
          <ThemedText type="header" style={{ color: palette.color }}>
            {hasInput ? money(result.due) : "—"}
          </ThemedText>
        </View>
      </View>

      {hasInput ? (
        <View style={styles.stats}>
          <View style={[styles.statTile, { backgroundColor: withAlpha(colors.foreground, 0.04) }]}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("zakat.netWealth")}
            </ThemedText>
            <ThemedText type="smallBold">{money(result.netWealth)}</ThemedText>
          </View>
          <View style={[styles.statTile, { backgroundColor: withAlpha(colors.foreground, 0.04) }]}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("zakat.field.nisab")}
            </ThemedText>
            <ThemedText type="smallBold">
              {effectiveNisab > 0 ? money(effectiveNisab) : "—"}
            </ThemedText>
          </View>
        </View>
      ) : null}

      <ThemedText type="small" themeColor="mutedForeground" style={styles.status}>
        {hasInput
          ? result.meetsNisab
            ? t("zakat.dueLabel")
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
  stats: { flexDirection: "row", gap: Spacing.two, marginTop: Spacing.three },
  statTile: {
    flex: 1,
    gap: Spacing.half,
    padding: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  status: { marginTop: Spacing.two, lineHeight: 20 },
  hawl: { marginTop: Spacing.two, lineHeight: 18 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.three },
});
