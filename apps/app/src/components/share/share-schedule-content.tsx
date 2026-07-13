import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Pill } from "@/components/ui/pill";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { ScheduleKind } from "@/lib/prayer-times";
import type { ScheduleEntryStatus } from "@/lib/schedule-ui";
import {
  groupScheduleItemsInOrder,
  SCHEDULE_GROUP_LABEL_KEY,
  scheduleGroupFor,
} from "@/lib/schedule-ui";

export type ShareScheduleEntry = {
  id: string;
  name: string;
  time: string;
  kind: ScheduleKind;
  status: ScheduleEntryStatus;
};

type ShareScheduleContentProps = {
  dateLabel: string;
  locationLabel?: string;
  items: ShareScheduleEntry[];
  nextScheduleId: string | null;
  nextIn?: string;
};

function kindRailColor(
  kind: ScheduleKind,
  colors: ReturnType<typeof useThemeTokens>["colors"],
  tokens: ReturnType<typeof useThemeTokens>["tokens"],
): string {
  if (kind === "obligatory") return tokens.status.info.color;
  if (kind === "optional") return tokens.status.warning.color;
  return colors.border;
}

export function ShareScheduleContent({
  dateLabel,
  locationLabel,
  items,
  nextScheduleId,
  nextIn,
}: ShareScheduleContentProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  const groups = groupScheduleItemsInOrder(items, (id) =>
    scheduleGroupFor(id as Parameters<typeof scheduleGroupFor>[0]),
  );

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.meta}>
        <ThemedText type="smallBold">{dateLabel}</ThemedText>
        {locationLabel ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {locationLabel}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: tokens.status.info.color }]} />
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("home.scheduleObligatory")}
          </ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: tokens.status.warning.color }]} />
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("home.scheduleOptional")}
          </ThemedText>
        </View>
      </View>

      <View style={styles.groups}>
        {groups.map((group) => (
          <View key={group.group} style={styles.group}>
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.groupLabel}>
              {t(SCHEDULE_GROUP_LABEL_KEY[group.group]).toUpperCase()}
            </ThemedText>
            {group.items.map((item) => {
              const isCurrent = item.status === "active";
              const isNext = nextScheduleId !== null && item.id === nextScheduleId;
              const emphasized = isCurrent || isNext;
              const rail = kindRailColor(item.kind, colors, tokens);

              return (
                <View
                  key={item.id}
                  style={[
                    styles.row,
                    {
                      backgroundColor: isCurrent ? tokens.accentSoft : "transparent",
                      borderColor: isCurrent ? colors.accent : "transparent",
                      opacity: item.status === "past" && !isCurrent ? 0.6 : 1,
                    },
                  ]}
                >
                  <View style={[styles.kindBar, { backgroundColor: rail }]} />
                  <View style={styles.rowBody}>
                    <View style={styles.nameRow}>
                      <ThemedText
                        type={emphasized ? "smallBold" : "small"}
                        style={isCurrent || isNext ? { color: colors.accentText } : undefined}
                        themeColor={isCurrent || isNext ? undefined : "foreground"}
                        numberOfLines={1}
                      >
                        {item.name}
                      </ThemedText>
                      {isCurrent ? (
                        <Pill
                          label={t("home.scheduleCurrent")}
                          color={colors.accentForeground}
                          background={colors.accent}
                          style={styles.statePill}
                        />
                      ) : null}
                      {isNext ? (
                        <Pill
                          label={t("home.scheduleNext")}
                          color={colors.accentForeground}
                          background={colors.accent}
                          style={styles.statePill}
                        />
                      ) : null}
                    </View>
                    {isNext && nextIn ? (
                      <ThemedText type="caption" style={{ color: colors.accent }}>
                        {nextIn}
                      </ThemedText>
                    ) : null}
                  </View>
                  <ThemedText
                    type={emphasized ? "smallBold" : "small"}
                    style={[
                      styles.time,
                      isCurrent || isNext ? { color: colors.accentText } : undefined,
                    ]}
                    themeColor={isCurrent || isNext ? undefined : "foreground"}
                  >
                    {item.time}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  meta: {
    gap: Spacing.half,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
  },
  groups: {
    gap: Spacing.two,
  },
  group: {
    gap: Spacing.half,
  },
  groupLabel: {
    letterSpacing: 0.8,
    marginBottom: Spacing.half,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.one + 2,
    paddingEnd: Spacing.two,
    paddingStart: Spacing.one,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  kindBar: {
    width: 3,
    alignSelf: "stretch",
    borderRadius: Radius.pill,
    minHeight: 22,
  },
  rowBody: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.one + 2,
  },
  statePill: {
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.one + 2,
  },
  time: {
    fontVariant: ["tabular-nums"],
  },
});
