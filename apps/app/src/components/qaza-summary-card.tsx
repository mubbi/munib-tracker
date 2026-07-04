import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { chevronForward } from "@/lib/rtl";

type QazaSummaryCardProps = {
  remaining: number;
  completed: number;
  onPress: () => void;
};

function formatCount(value: number, locale?: string): string {
  return value.toLocaleString(locale);
}

export function QazaSummaryCard({ remaining, completed, onPress }: QazaSummaryCardProps) {
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  const total = remaining + completed;
  if (total === 0) return null;

  const progress = completed / total;
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

      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: info.soft, borderColor: info.border }]}>
          <ThemedText type="header" style={[styles.statValue, { color: info.text }]}>
            {formatCount(remaining, locale)}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("stats.remaining")}
          </ThemedText>
        </View>
        <View
          style={[styles.statBox, { backgroundColor: success.soft, borderColor: success.border }]}
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
});
