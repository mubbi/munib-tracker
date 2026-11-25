import { type MirathHeirShare, toFractionString } from "@munib-tracker/shared/mirath";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useRecordFormat } from "@/hooks/use-record-format";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { explainHeir, heirCountLabel } from "@/lib/mirath/explain";
import { heirAmountLine, heirBarWidthPercent } from "@/lib/mirath/results-view";

/** The heir's money line (total, total + each, or total + per-head range). */
function HeirAmount({ heir, currency }: { heir: MirathHeirShare; currency: string }) {
  const { t } = useTranslation();
  const { money } = useRecordFormat();
  const line = heirAmountLine(heir);
  if (!line) return null;
  const amount = money(line.amount, currency);
  return (
    <ThemedText type="small">
      {line.kind === "range"
        ? t("mirath.result.amountEachRange", {
            amount,
            low: money(line.low, currency),
            high: money(line.high, currency),
          })
        : line.kind === "each"
          ? t("mirath.result.amountEach", { amount, each: money(line.each, currency) })
          : amount}
    </ThemedText>
  );
}

/** One heir row: label, fraction, percentage bar, amount and a "Why?" disclosure. */
export function MirathHeirRow({
  heir,
  currency,
  highlight,
}: {
  heir: MirathHeirShare;
  currency?: string;
  highlight: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [open, setOpen] = useState(false);
  const label = heirCountLabel(t, heir.heir, heir.count);
  const fraction = toFractionString(heir.share);
  const why = explainHeir(t, heir);
  return (
    <View
      style={[
        styles.row,
        { borderColor: highlight ? tokens.accentBorder : tokens.hairline },
        highlight && { backgroundColor: tokens.accentSoft },
      ]}
    >
      <View style={styles.rowHead}>
        <View style={styles.rowLabel}>
          <ThemedText type="smallBold">{label}</ThemedText>
          {heir.inherits ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {heir.count > 1
                ? t("mirath.result.perHead", { fraction: toFractionString(heir.perHead) })
                : t(`mirath.basis.${heir.basis}`)}
            </ThemedText>
          ) : (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("mirath.result.noShare")}
            </ThemedText>
          )}
        </View>
        <View style={styles.rowValue}>
          <ThemedText
            type="smallBold"
            accessibilityLabel={t("mirath.result.fractionA11y", { fraction })}
          >
            {heir.inherits ? fraction : "—"}
          </ThemedText>
          {heir.inherits ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("mirath.result.percent", { percent: heir.percent })}
            </ThemedText>
          ) : null}
        </View>
      </View>
      {heir.inherits ? (
        // Bars fill from the reading edge: flex layout flips in RTL by itself.
        <View style={[styles.track, { backgroundColor: colors.muted }]}>
          <View
            style={[
              styles.fill,
              {
                width: `${heirBarWidthPercent(heir.percent)}%`,
                backgroundColor: colors.accent,
              },
            ]}
          />
        </View>
      ) : null}
      {currency ? <HeirAmount heir={heir} currency={currency} /> : null}
      <PressableScale
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={t("mirath.result.whyA11y", { heir: label })}
        onPress={() => setOpen((o) => !o)}
        scaleTo={0.98}
        style={styles.why}
      >
        <ThemedText type="label" style={{ color: colors.accentText }}>
          {open ? t("mirath.result.hideWhy") : t("mirath.result.why")}
        </ThemedText>
      </PressableScale>
      {open ? (
        <View style={styles.whyList}>
          {why.map((line) => (
            <ThemedText key={line} type="small" themeColor="mutedForeground">
              {`• ${line}`}
            </ThemedText>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: BorderWidth.thin,
    borderRadius: Radius.md,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  rowHead: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.two },
  rowLabel: { flex: 1, minWidth: 0, gap: Spacing.half },
  rowValue: { alignItems: "flex-end", gap: Spacing.half },
  track: { height: 6, borderRadius: 3, overflow: "hidden", flexDirection: "row" },
  fill: { height: 6, borderRadius: 3 },
  // 44pt touch target without making the row taller than the label needs.
  why: { alignSelf: "flex-start", minHeight: 44, justifyContent: "center" },
  whyList: { gap: Spacing.one },
});
