import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { PrayerInfoButton } from "@/components/prayer-info-button";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { Radius, Spacing } from "@/constants/theme";
import type { ScheduleItem } from "@/hooks/use-home-hero";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { PrayerInfoId } from "@/lib/prayer-info";
import type { ScheduleKind } from "@/lib/prayer-times";
import {
  groupScheduleItems,
  kindBadgeKey,
  SCHEDULE_GROUP_LABEL_KEY,
  type ScheduleEntryStatus,
  scheduleEntryIcon,
  scheduleGroupFor,
} from "@/lib/schedule-ui";

type PrayerScheduleCardProps = {
  schedule: ScheduleItem[];
  nextIn: string;
  nextScheduleId: string | null;
};

type RowVisuals = {
  iconTint: string;
  iconBg: string;
  nameColor: string | undefined;
  timeColor: string | undefined;
  rowBg: string;
  borderColor: string;
  opacity: number;
};

function rowVisuals(
  status: ScheduleEntryStatus,
  kind: ScheduleKind,
  colors: ReturnType<typeof useThemeTokens>["colors"],
  tokens: ReturnType<typeof useThemeTokens>["tokens"],
): RowVisuals {
  if (status === "active") {
    return {
      iconTint: colors.accent,
      iconBg: tokens.accentSoft,
      nameColor: colors.accentText,
      timeColor: colors.accentText,
      rowBg: tokens.accentSoft,
      borderColor: colors.accent,
      opacity: 1,
    };
  }

  if (status === "past") {
    return {
      iconTint: colors.mutedForeground,
      iconBg: colors.muted,
      nameColor: undefined,
      timeColor: undefined,
      rowBg: "transparent",
      borderColor: "transparent",
      opacity: 0.55,
    };
  }

  const tone =
    kind === "obligatory" ? tokens.status.info : kind === "optional" ? tokens.status.warning : null;

  return {
    iconTint: tone?.color ?? colors.mutedForeground,
    iconBg: tone?.soft ?? colors.muted,
    nameColor: undefined,
    timeColor: undefined,
    rowBg: "transparent",
    borderColor: "transparent",
    opacity: 1,
  };
}

function ScheduleLegend() {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();

  return (
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
  );
}

function ScheduleTimelineRow({
  item,
  nextIn,
  isNext,
  isLastInGroup,
}: {
  item: ScheduleItem;
  nextIn?: string;
  isNext: boolean;
  isLastInGroup: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const isCurrent = item.active;
  const visuals = rowVisuals(item.status, item.kind, colors, tokens);
  const badgeKey = kindBadgeKey(item.kind);
  const icon = scheduleEntryIcon(item.id as Parameters<typeof scheduleEntryIcon>[0]);

  return (
    <View style={[styles.rowWrap, { opacity: visuals.opacity }]}>
      <View style={styles.rail}>
        <View
          style={[
            styles.railDot,
            {
              backgroundColor: isCurrent ? colors.accent : isNext ? colors.border : colors.border,
              borderColor: isCurrent ? colors.accent : isNext ? colors.accent : colors.border,
            },
          ]}
        />
        {!isLastInGroup ? (
          <View style={[styles.railLine, { backgroundColor: colors.border }]} />
        ) : null}
      </View>

      <View
        accessibilityRole="text"
        accessibilityLabel={t(
          isCurrent
            ? "hero.prayerItemActive"
            : isNext
              ? "home.scheduleNextA11y"
              : "hero.prayerItem",
          isNext
            ? { name: item.name, time: item.time, countdown: nextIn ?? "" }
            : { name: item.name, time: item.time },
        )}
        style={[
          styles.row,
          {
            backgroundColor: visuals.rowBg,
            borderColor: visuals.borderColor,
          },
        ]}
      >
        <IconWell
          icon={icon}
          size={16}
          well={36}
          radius={Radius.sm}
          tint={visuals.iconTint}
          background={visuals.iconBg}
        />

        <View style={styles.rowBody}>
          <View style={styles.nameRow}>
            <ThemedText
              type={isCurrent ? "smallBold" : "small"}
              style={visuals.nameColor ? { color: visuals.nameColor } : undefined}
              themeColor={visuals.nameColor ? undefined : "foreground"}
              numberOfLines={1}
            >
              {item.name}
            </ThemedText>
            {badgeKey ? (
              <View
                style={[
                  styles.kindChip,
                  {
                    backgroundColor:
                      item.kind === "obligatory"
                        ? tokens.status.info.soft
                        : tokens.status.warning.soft,
                  },
                ]}
              >
                <ThemedText
                  type="caption"
                  style={{
                    color:
                      item.kind === "obligatory"
                        ? tokens.status.info.color
                        : tokens.status.warning.color,
                    fontSize: 10,
                    lineHeight: 12,
                  }}
                >
                  {t(badgeKey)}
                </ThemedText>
              </View>
            ) : null}
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
          {item.status === "flexible" ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("home.scheduleFlexibleHint")}
            </ThemedText>
          ) : null}
        </View>

        <View style={styles.timeCol}>
          {isNext && nextIn ? (
            <ThemedText type="caption" style={{ color: colors.accent }}>
              {nextIn}
            </ThemedText>
          ) : null}
          <ThemedText
            type={isCurrent ? "smallBold" : "small"}
            style={[styles.time, visuals.timeColor ? { color: visuals.timeColor } : undefined]}
            themeColor={visuals.timeColor ? undefined : "foreground"}
          >
            {item.time}
          </ThemedText>
          <PrayerInfoButton
            prayerId={item.id as PrayerInfoId}
            tintColor={visuals.iconTint}
            showLabel
          />
        </View>
      </View>
    </View>
  );
}

export function PrayerScheduleCard({ schedule, nextIn, nextScheduleId }: PrayerScheduleCardProps) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const groups = groupScheduleItems(schedule, (id) =>
    scheduleGroupFor(id as Parameters<typeof scheduleGroupFor>[0]),
  );

  return (
    <Card padding="three">
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <SymbolView
            name={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }}
            size={18}
            tintColor={colors.accent}
          />
          <ThemedText type="subtitle">{t("home.scheduleTitle")}</ThemedText>
        </View>
        <ScheduleLegend />
      </View>

      <View style={styles.groups}>
        {groups.map((group) => (
          <View key={group.group} style={styles.group}>
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.groupLabel}>
              {t(SCHEDULE_GROUP_LABEL_KEY[group.group]).toUpperCase()}
            </ThemedText>
            {group.items.map((item, index) => (
              <ScheduleTimelineRow
                key={item.id}
                item={item}
                isNext={nextScheduleId !== null && item.id === nextScheduleId}
                nextIn={nextScheduleId !== null && item.id === nextScheduleId ? nextIn : undefined}
                isLastInGroup={index === group.items.length - 1}
              />
            ))}
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
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
    gap: Spacing.three,
  },
  group: {
    gap: Spacing.half,
  },
  groupLabel: {
    letterSpacing: 0.8,
    marginBottom: Spacing.one,
    paddingLeft: Spacing.one,
  },
  rowWrap: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  rail: {
    width: 12,
    alignItems: "center",
    paddingTop: 18,
  },
  railDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
    borderWidth: 2,
  },
  railLine: {
    flex: 1,
    width: 2,
    marginTop: Spacing.half,
    borderRadius: Radius.pill,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two + 2,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
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
  kindChip: {
    paddingHorizontal: Spacing.one + 2,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  statePill: {
    paddingVertical: Spacing.half + 1,
    paddingHorizontal: Spacing.two,
  },
  timeCol: {
    alignItems: "flex-end",
    gap: 2,
    minWidth: 72,
  },
  time: {
    fontVariant: ["tabular-nums"],
  },
});
