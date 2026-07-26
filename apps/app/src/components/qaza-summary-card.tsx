import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useChevronForward } from "@/lib/rtl";

type QazaSummaryCardProps = {
  remaining: number;
  completed: number;
  /** Remaining make-up fasts (roza), shown as a second debt line (NF-1.17). */
  rozaRemaining?: number;
  onPress: () => void;
};

function formatCount(value: number, locale?: string): string {
  return value.toLocaleString(locale);
}

export function QazaSummaryCard({
  remaining,
  completed,
  rozaRemaining = 0,
  onPress,
}: QazaSummaryCardProps) {
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();

  const total = remaining + completed;
  // Unified debt view: render only while some prayer OR fasting debt is still outstanding.
  if (remaining === 0 && rozaRemaining === 0) return null;

  const progress = total > 0 ? completed / total : 0;
  const progressPct = Math.round(progress * 100);
  const locale = i18n.language?.split("-")[0];
  const info = tokens.status.info;
  const success = tokens.status.success;
  const warning = tokens.status.warning;

  return (
    <Card
      padding="three"
      onPress={onPress}
      accessibilityLabel={t("home.qazaA11y", {
        remaining,
        completed,
        pct: progressPct,
      })}
      style={[
        styles.card,
        {
          backgroundColor: warning.soft,
          borderColor: warning.border,
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.header}>
        <IconWell
          icon={{ ios: "clock.arrow.circlepath", android: "history", web: "history" }}
          tint={warning.color}
          background={warning.soft}
          well={44}
          size={22}
        />
        <View style={styles.headerCopy}>
          <ThemedText type="smallBold">{t("home.qazaRemaining")}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("home.qazaMeta", { completed })}
          </ThemedText>
        </View>
        <SymbolView name={chevronForward} size={14} tintColor={colors.mutedForeground} />
      </View>

      {total > 0 ? (
        <>
          <View style={styles.statsRow}>
            <View
              style={[styles.statBox, { backgroundColor: info.soft, borderColor: info.border }]}
            >
              <ThemedText type="header" style={[styles.statValue, { color: info.text }]}>
                {formatCount(remaining, locale)}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("stats.remaining")}
              </ThemedText>
            </View>
            <View
              style={[
                styles.statBox,
                { backgroundColor: success.soft, borderColor: success.border },
              ]}
            >
              <ThemedText type="header" style={[styles.statValue, { color: success.text }]}>
                {formatCount(completed, locale)}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("stats.madeUp")}
              </ThemedText>
            </View>
          </View>

          <View style={styles.progressBlock}>
            <View style={styles.progressLabels}>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("home.qazaProgress", { pct: progressPct })}
              </ThemedText>
            </View>
            <ProgressBar value={progress} height={6} color={success.color} />
          </View>
        </>
      ) : null}

      {rozaRemaining > 0 ? (
        <View style={[styles.rozaRow, { borderTopColor: warning.border }]}>
          <SymbolView
            name={{ ios: "moon.stars.fill", android: "nightlight", web: "nightlight" }}
            size={16}
            tintColor={warning.color}
          />
          <ThemedText type="small" style={styles.rozaLabel}>
            {t("home.rozaRemaining")}
          </ThemedText>
          <ThemedText type="smallBold" style={{ color: warning.color }}>
            {formatCount(rozaRemaining, locale)}
          </ThemedText>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  statValue: {
    fontVariant: ["tabular-nums"],
  },
  progressBlock: {
    gap: Spacing.one + 2,
  },
  progressLabels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rozaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rozaLabel: { flex: 1 },
});
