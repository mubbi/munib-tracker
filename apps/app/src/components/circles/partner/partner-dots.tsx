import type { CircleNudgeKind } from "@munib-tracker/shared/circles";
import { parseLocalDateString } from "@munib-tracker/shared/utils";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { PartnerMemberRow } from "@/lib/circles/partner";
import { formatDisplayDate } from "@/lib/time";

const DOT = 26;

/**
 * Today + the last 7 days per member, as dots only: "done" or "no signal".
 * No percentages, counts or streaks (NF-3.17) — and no red "missed" marks.
 */
export function PartnerDots({
  rows,
  readOnly,
  sentSlots,
  onNudge,
}: {
  rows: PartnerMemberRow[];
  readOnly?: boolean;
  /** `${memberId}|${kind}` already sent today from this device. */
  sentSlots: ReadonlySet<string>;
  onNudge: (memberId: string, kind: CircleNudgeKind) => void;
}) {
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  return (
    <Card style={styles.card}>
      <SectionHeader
        title={t("partnerCircle.dots.title")}
        subtitle={t("partnerCircle.dots.subtitle")}
        icon={{ ios: "circle.grid.3x3.fill", android: "grid_view", web: "grid_view" }}
      />
      {rows.map((row) => {
        const name = row.isMe
          ? t("partnerCircle.you")
          : (row.displayName ?? t("partnerCircle.unnamedMember"));
        const today = row.days[row.days.length - 1];
        return (
          <View key={row.memberId} style={styles.member} testID={`partner-row-${row.memberId}`}>
            <View style={styles.nameRow}>
              <ThemedText type="smallBold" numberOfLines={1} style={styles.name}>
                {name}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {row.paused
                  ? t("partnerCircle.dots.paused")
                  : today?.state === "done"
                    ? t("partnerCircle.dots.doneToday")
                    : t("partnerCircle.dots.noSignalToday")}
              </ThemedText>
            </View>
            <View style={styles.dots}>
              {row.days.map((day, index) => {
                const done = day.state === "done";
                const isToday = index === row.days.length - 1;
                const date = parseLocalDateString(day.date);
                const label = `${formatDisplayDate(date, i18n.language, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}: ${done ? t("partnerCircle.dots.done") : t("partnerCircle.dots.noSignal")}`;
                return (
                  <View key={day.date} style={styles.dayCell} accessible accessibilityLabel={label}>
                    <View
                      style={[
                        styles.dot,
                        {
                          backgroundColor: done ? tokens.status.success.soft : "transparent",
                          borderColor: done ? tokens.status.success.color : colors.border,
                          borderWidth: isToday ? 2 : 1,
                        },
                      ]}
                    >
                      {done ? (
                        <ThemedText
                          type="smallBold"
                          style={{ color: tokens.status.success.onSoft }}
                        >
                          ✓
                        </ThemedText>
                      ) : null}
                    </View>
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {formatDisplayDate(date, i18n.language, { weekday: "narrow" })}
                    </ThemedText>
                  </View>
                );
              })}
            </View>
            {!row.isMe && !readOnly ? (
              <View style={styles.actions}>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={{
                    ios: "hands.sparkles.fill",
                    android: "volunteer_activism",
                    web: "volunteer_activism",
                  }}
                  label={t("partnerCircle.nudge.makeDua")}
                  accessibilityHint={t("partnerCircle.nudge.makeDuaHint")}
                  disabled={sentSlots.has(`${row.memberId}|dua`)}
                  onPress={() => onNudge(row.memberId, "dua")}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  icon={{ ios: "bell", android: "notifications", web: "notifications" }}
                  label={t("partnerCircle.nudge.remind")}
                  accessibilityHint={t("partnerCircle.nudge.remindHint")}
                  disabled={row.paused || sentSlots.has(`${row.memberId}|reminder`)}
                  onPress={() => onNudge(row.memberId, "reminder")}
                />
              </View>
            ) : null}
          </View>
        );
      })}
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("partnerCircle.dots.legend")}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.three },
  member: { gap: Spacing.two },
  nameRow: { flexDirection: "row", alignItems: "baseline", gap: Spacing.two, flexWrap: "wrap" },
  name: { flexShrink: 1 },
  dots: { flexDirection: "row", gap: Spacing.two, flexWrap: "wrap" },
  dayCell: { alignItems: "center", gap: Spacing.half },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
});
