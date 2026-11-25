import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { MadhhabBadge } from "@/components/fiqh/madhhab-badge";
import { MoneyText } from "@/components/money/money-text";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { BorderWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
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
> &
  Partial<
    Pick<
      ZakatCalculatorState,
      | "zakatSchool"
      | "nisabBasis"
      | "nisabBasisCustom"
      | "basisRows"
      | "personalJewelleryValue"
      | "personalJewelleryCounted"
    >
  > & {
    /**
     * Wide two-pane layout: the docked summary bar (which owns Reset) is replaced
     * by this hero in the aside, so the hero hosts the reset action instead.
     */
    onReset?: () => void;
  };

export function ZakatResultHero({
  result,
  money,
  hasInput,
  effectiveNisab,
  goldNisab,
  silverNisab,
  suggestedNisab,
  currencyCode,
  onReset,
  zakatSchool = null,
  nisabBasis = "lower",
  nisabBasisCustom = false,
  basisRows = [],
  personalJewelleryValue = 0,
  personalJewelleryCounted = true,
}: ZakatResultHeroProps) {
  const { t } = useTranslation();
  const [confirmReset, setConfirmReset] = useState(false);
  const { colors, tokens } = useThemeTokens();
  const success = tokens.status.success;
  const hasDue = hasInput && result.totalDue > 0;
  const palette = hasDue
    ? success
    : { color: colors.mutedForeground, soft: colors.muted, onSoft: colors.mutedForeground };
  const separatePools = result.assessment?.combine === "separate" ? result.assessment.pools : [];
  const basisMetal = result.assessment?.basisMetal ?? "silver";

  return (
    <Card
      style={{
        backgroundColor: palette.soft,
        borderColor: hasDue ? withAlpha(success.color, 0.35) : tokens.hairline,
        borderWidth: BorderWidth.hairline,
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
            <MoneyText style={[styles.dueAmount, { color: palette.onSoft }]}>
              {money(result.totalDue)}
            </MoneyText>
          ) : (
            <ThemedText type="header" style={{ color: palette.onSoft }}>
              —
            </ThemedText>
          )}
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("zakat.currency.inCurrency", { code: currencyCode })}
          </ThemedText>
          <MadhhabBadge school={zakatSchool} custom={nisabBasisCustom} />
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

      {hasInput && separatePools.length > 0 ? (
        <View style={styles.breakdown}>
          {separatePools.map((pool) => (
            <ThemedText key={pool.pool} type="caption" themeColor="mutedForeground">
              {pool.pool === "basis"
                ? t(pool.meets ? "zakat.fiqh.poolBasisDue" : "zakat.fiqh.poolBasisBelow", {
                    metal: t(`zakat.fiqh.metal.${basisMetal}`),
                    value: money(pool.due),
                  })
                : t(pool.meets ? "zakat.fiqh.poolMetalDue" : "zakat.fiqh.poolMetalBelow", {
                    metal: t(`zakat.fiqh.metal.${pool.pool === "gold" ? "gold" : "silver"}`),
                    value: money(pool.due),
                  })}
            </ThemedText>
          ))}
        </View>
      ) : null}

      {hasInput && personalJewelleryValue > 0 && !personalJewelleryCounted ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.hawl}>
          {t("zakat.fiqh.jewelleryNotCounted", { value: money(personalJewelleryValue) })}
        </ThemedText>
      ) : null}

      {hasInput && zakatSchool == null && basisRows.length > 0 ? (
        <View style={[styles.rows, { borderTopColor: tokens.hairline }]}>
          <ThemedText type="smallBold">{t("zakat.fiqh.rowsTitle")}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("zakat.fiqh.allViewsHeadline", { basis: t(`zakat.fiqh.basis.${nisabBasis}`) })}
          </ThemedText>
          {basisRows.map((row) => (
            <View
              key={row.basis}
              accessible
              style={[
                styles.basisRow,
                {
                  backgroundColor: row.selected ? success.soft : withAlpha(colors.foreground, 0.04),
                },
              ]}
            >
              <View style={styles.basisRowTop}>
                <ThemedText weight="semibold" type="caption" style={styles.basisLabel}>
                  {t(`zakat.fiqh.basis.${row.basis}`)}
                </ThemedText>
                {row.selected ? <Pill label={t("zakat.fiqh.yourBasis")} compact /> : null}
                <MoneyText style={[styles.statValue, { color: colors.foreground }]}>
                  {row.meetsNisab || row.totalDue > 0
                    ? money(row.totalDue)
                    : t("zakat.fiqh.rowBelow")}
                </MoneyText>
              </View>
              {row.totalDueWithoutJewellery != null ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("zakat.fiqh.rowWithoutJewellery", {
                    value: money(row.totalDueWithoutJewellery),
                  })}
                </ThemedText>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

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

      {onReset ? (
        <>
          <Button
            label={t("zakat.reset.confirm")}
            variant="secondary"
            size="sm"
            icon={{ ios: "arrow.counterclockwise", android: "restart_alt", web: "restart_alt" }}
            disabled={!hasInput}
            accessibilityHint={t("zakat.reset.hint")}
            onPress={() => setConfirmReset(true)}
            style={styles.reset}
          />
          <ConfirmDialog
            visible={confirmReset}
            title={t("zakat.reset.title")}
            message={t("zakat.reset.message")}
            confirmLabel={t("zakat.reset.confirm")}
            destructive
            onConfirm={onReset}
            onClose={() => setConfirmReset(false)}
          />
        </>
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
    padding: Spacing.twoHalf,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  statValue: { fontSize: 14, fontWeight: "700" },
  breakdown: { marginTop: Spacing.two, gap: Spacing.half },
  status: { marginTop: Spacing.two, lineHeight: 20 },
  hawl: { marginTop: Spacing.two, lineHeight: 18 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.three },
  reset: { marginTop: Spacing.three, alignSelf: "flex-start" },
  rows: {
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.two,
    borderTopWidth: BorderWidth.hairline,
  },
  basisRow: {
    gap: Spacing.half,
    padding: Spacing.twoHalf,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  basisRowTop: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  basisLabel: { flex: 1 },
});
