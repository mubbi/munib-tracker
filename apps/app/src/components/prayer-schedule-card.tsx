import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { PrayerInfoButton } from "@/components/prayer-info-button";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import type { ScheduleItem } from "@/hooks/use-home-hero";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { PrayerInfoId } from "@/lib/prayer-info";
import type { ScheduleKind } from "@/lib/prayer-times";
import {
  buildScheduleTimelineSegments,
  computeScheduleFocusWindow,
  groupScheduleItemsInOrder,
  SCHEDULE_GROUP_LABEL_KEY,
  type ScheduleEntryStatus,
  type ScheduleGroupId,
  type ScheduleTimelineSegment,
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

function kindRailColor(
  kind: ScheduleKind,
  colors: ReturnType<typeof useThemeTokens>["colors"],
  tokens: ReturnType<typeof useThemeTokens>["tokens"],
): string {
  if (kind === "obligatory") return tokens.status.info.color;
  if (kind === "optional") return tokens.status.warning.color;
  return colors.border;
}

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

function ScheduleCollapseBar({
  count,
  variant,
  expanded,
  onPress,
}: {
  count: number;
  variant: "past" | "future";
  expanded: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const isPast = variant === "past";

  const title = expanded
    ? isPast
      ? t("home.scheduleHidePast")
      : t("home.scheduleHideLater")
    : isPast
      ? t("home.scheduleShowPast", { count })
      : t("home.scheduleShowLater", { count });

  const hint = expanded
    ? undefined
    : isPast
      ? t("home.scheduleShowPastHint")
      : t("home.scheduleShowLaterHint");

  const accessibilityLabel = expanded
    ? isPast
      ? t("home.scheduleHidePastA11y")
      : t("home.scheduleHideLaterA11y")
    : isPast
      ? t("home.scheduleShowPastA11y", { count })
      : t("home.scheduleShowLaterA11y", { count });

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={hint}
      accessibilityState={{ expanded }}
      scaleTo={0.985}
      onPress={onPress}
      style={[
        styles.collapseBar,
        {
          backgroundColor: expanded ? colors.muted : tokens.accentSoft,
          borderColor: expanded ? colors.border : colors.accent,
        },
      ]}
    >
      <View style={[styles.collapseIconWrap, { backgroundColor: colors.background }]}>
        <SymbolView
          name={{
            ios: expanded ? "chevron.up.circle.fill" : "ellipsis.circle.fill",
            android: expanded ? "expand_less" : "more_horiz",
            web: expanded ? "expand_less" : "more_horiz",
          }}
          size={18}
          tintColor={expanded ? colors.mutedForeground : colors.accent}
        />
      </View>

      <View style={styles.collapseCopy}>
        <ThemedText type="smallBold" themeColor={expanded ? "foreground" : "foreground"}>
          {title}
        </ThemedText>
        {hint ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {hint}
          </ThemedText>
        ) : null}
      </View>

      {!expanded ? (
        <View style={[styles.collapseAction, { backgroundColor: colors.accent }]}>
          <ThemedText type="caption" style={{ color: colors.accentForeground, fontWeight: "600" }}>
            {t("common.show")}
          </ThemedText>
          <SymbolView
            name={{
              ios: "chevron.down",
              android: "keyboard_arrow_down",
              web: "keyboard_arrow_down",
            }}
            size={12}
            tintColor={colors.accentForeground}
          />
        </View>
      ) : (
        <SymbolView
          name={{ ios: "chevron.up", android: "keyboard_arrow_up", web: "keyboard_arrow_up" }}
          size={16}
          tintColor={colors.mutedForeground}
        />
      )}
    </PressableScale>
  );
}

function ScheduleTimelineRow({
  item,
  nextIn,
  isNext,
  isLastInTimeline,
  compact = false,
}: {
  item: ScheduleItem;
  nextIn?: string;
  isNext: boolean;
  isLastInTimeline: boolean;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const isCurrent = item.active;
  const emphasized = isCurrent || isNext;
  const visuals = rowVisuals(item.status, item.kind, colors, tokens);
  const icon = scheduleEntryIcon(item.id as Parameters<typeof scheduleEntryIcon>[0]);
  const railColor = kindRailColor(item.kind, colors, tokens);

  return (
    <View style={[styles.rowWrap, { opacity: visuals.opacity }]}>
      <View style={[styles.rail, compact ? styles.railCompact : null]}>
        <View
          style={[
            styles.railDot,
            compact ? styles.railDotCompact : null,
            {
              backgroundColor: isCurrent ? colors.accent : colors.background,
              borderColor: isCurrent ? colors.accent : isNext ? colors.accent : railColor,
            },
          ]}
        />
        {!isLastInTimeline ? (
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
          compact ? styles.rowCompact : null,
          emphasized ? styles.rowEmphasized : null,
          {
            backgroundColor: visuals.rowBg,
            borderColor: visuals.borderColor,
          },
        ]}
      >
        <IconWell
          icon={icon}
          size={compact && !emphasized ? 14 : 16}
          well={compact && !emphasized ? 30 : 36}
          radius={Radius.sm}
          tint={visuals.iconTint}
          background={visuals.iconBg}
        />

        <View style={styles.rowBody}>
          <View style={styles.nameRow}>
            <ThemedText
              type={emphasized ? "smallBold" : "small"}
              style={visuals.nameColor ? { color: visuals.nameColor } : undefined}
              themeColor={visuals.nameColor ? undefined : "foreground"}
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
            type={emphasized ? "smallBold" : "small"}
            style={[styles.time, visuals.timeColor ? { color: visuals.timeColor } : undefined]}
            themeColor={visuals.timeColor ? undefined : "foreground"}
          >
            {item.time}
          </ThemedText>
          <PrayerInfoButton
            prayerId={item.id as PrayerInfoId}
            tintColor={visuals.iconTint}
            hitTarget={compact && !emphasized ? 30 : 36}
            showLabel
          />
        </View>
      </View>
    </View>
  );
}

function isLastTimelineItem(
  segments: ScheduleTimelineSegment<ScheduleItem>[],
  index: number,
): boolean {
  for (let i = index + 1; i < segments.length; i++) {
    if (segments[i]?.type === "item") return false;
  }
  return true;
}

function ScheduleTimeline({
  segments,
  nextScheduleId,
  nextIn,
  pastExpanded,
  futureExpanded,
  onTogglePast,
  onToggleFuture,
}: {
  segments: ScheduleTimelineSegment<ScheduleItem>[];
  nextScheduleId: string | null;
  nextIn: string;
  pastExpanded: boolean;
  futureExpanded: boolean;
  onTogglePast: () => void;
  onToggleFuture: () => void;
}) {
  const { t } = useTranslation();
  let lastGroup: ScheduleGroupId | null = null;

  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type === "collapse-past") {
          lastGroup = null;
          return (
            <ScheduleCollapseBar
              key="collapse-past"
              count={segment.count}
              variant="past"
              expanded={pastExpanded}
              onPress={onTogglePast}
            />
          );
        }

        if (segment.type === "collapse-future") {
          lastGroup = null;
          return (
            <ScheduleCollapseBar
              key="collapse-future"
              count={segment.count}
              variant="future"
              expanded={futureExpanded}
              onPress={onToggleFuture}
            />
          );
        }

        const group = scheduleGroupFor(segment.item.id as Parameters<typeof scheduleGroupFor>[0]);
        const showHeader = group !== lastGroup;
        lastGroup = group;
        const compact = segment.item.status === "past" && !segment.item.active;
        const isLastInTimeline = isLastTimelineItem(segments, index);

        return (
          <View key={segment.item.id}>
            {showHeader ? (
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.groupLabel}>
                {t(SCHEDULE_GROUP_LABEL_KEY[group]).toUpperCase()}
              </ThemedText>
            ) : null}
            <ScheduleTimelineRow
              item={segment.item}
              compact={compact || group === "flexible"}
              isNext={nextScheduleId !== null && segment.item.id === nextScheduleId}
              nextIn={
                nextScheduleId !== null && segment.item.id === nextScheduleId ? nextIn : undefined
              }
              isLastInTimeline={isLastInTimeline}
            />
          </View>
        );
      })}
    </>
  );
}

function ScheduleFlexibleBlock({
  items,
  nextScheduleId,
  nextIn,
}: {
  items: ScheduleItem[];
  nextScheduleId: string | null;
  nextIn: string;
}) {
  const { t } = useTranslation();
  const groups = groupScheduleItemsInOrder(items, (id) =>
    scheduleGroupFor(id as Parameters<typeof scheduleGroupFor>[0]),
  );

  return (
    <>
      {groups.map((group) => (
        <View key={group.group} style={styles.group}>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.groupLabel}>
            {t(SCHEDULE_GROUP_LABEL_KEY[group.group]).toUpperCase()}
          </ThemedText>
          {group.items.map((item, index) => (
            <ScheduleTimelineRow
              key={item.id}
              item={item}
              compact
              isNext={nextScheduleId !== null && item.id === nextScheduleId}
              nextIn={nextScheduleId !== null && item.id === nextScheduleId ? nextIn : undefined}
              isLastInTimeline={index === group.items.length - 1}
            />
          ))}
        </View>
      ))}
    </>
  );
}

export function PrayerScheduleCard({ schedule, nextIn, nextScheduleId }: PrayerScheduleCardProps) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const [pastExpanded, setPastExpanded] = useState(false);
  const [futureExpanded, setFutureExpanded] = useState(false);

  const window = useMemo(
    () => computeScheduleFocusWindow(schedule, nextScheduleId),
    [schedule, nextScheduleId],
  );

  const segments = useMemo(
    () =>
      buildScheduleTimelineSegments(schedule, window, {
        pastExpanded,
        futureExpanded,
      }),
    [schedule, window, pastExpanded, futureExpanded],
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
        <ScheduleTimeline
          segments={segments}
          nextScheduleId={nextScheduleId}
          nextIn={nextIn}
          pastExpanded={pastExpanded}
          futureExpanded={futureExpanded}
          onTogglePast={() => setPastExpanded((value) => !value)}
          onToggleFuture={() => setFutureExpanded((value) => !value)}
        />

        {window.flexible.length > 0 ? (
          <ScheduleFlexibleBlock
            items={window.flexible}
            nextScheduleId={nextScheduleId}
            nextIn={nextIn}
          />
        ) : null}
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
    gap: Spacing.half,
  },
  group: {
    gap: Spacing.half,
  },
  groupLabel: {
    letterSpacing: 0.8,
    marginBottom: Spacing.one,
    paddingStart: Spacing.one,
    marginTop: Spacing.one,
  },
  collapseBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth * 2,
    marginVertical: Spacing.one,
  },
  collapseIconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  collapseCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  collapseAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.half,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  rowWrap: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  rail: {
    width: 12,
    alignItems: "center",
    alignSelf: "stretch",
    paddingTop: 18,
  },
  railCompact: {
    paddingTop: 14,
  },
  railDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
    borderWidth: 2,
  },
  railDotCompact: {
    width: 7,
    height: 7,
  },
  railLine: {
    flex: 1,
    width: 2,
    minHeight: Spacing.three,
    marginTop: Spacing.half,
    borderRadius: Radius.pill,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  rowCompact: {
    paddingVertical: Spacing.one + 2,
    gap: Spacing.one + 2,
  },
  rowEmphasized: {
    paddingVertical: Spacing.two,
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
