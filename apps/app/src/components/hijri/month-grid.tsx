import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type { MutableRefObject, ReactNode, Ref } from "react";
import { StyleSheet, View, type ViewInstance } from "react-native";

import { MARKER_GLYPH, type MonthGridMarker } from "@/components/fasting/fasting-ui";
import { ThemedText } from "@/components/themed-text";
import { Chip } from "@/components/ui/chip";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import {
  BorderWidth,
  Control,
  IconSize,
  Radius,
  Spacing,
  type StatusKey,
  withAlpha,
} from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { CalendarDay } from "@/lib/calendar";
import { isTV } from "@/lib/platform/is-tv";

export type { MonthGridMarker };

/** Discrete fill: 0 none · 1 a little · 2 most · 3 complete (also draws a check). */
export type MonthGridFill = 0 | 1 | 2 | 3;

/** What one day cell shows — decided by the screen, drawn by `MonthGrid`. */
export type MonthGridCell = {
  fill?: MonthGridFill;
  /** At most two glyph markers are drawn. */
  markers?: readonly MonthGridMarker[];
  /** Short text under the number (e.g. a make-up count). */
  badge?: string;
  /** Full spoken name: date + status + ruling. */
  accessibilityLabel?: string;
  disabled?: boolean;
  selected?: boolean;
};

const FILL_ALPHA: Record<MonthGridFill, number> = { 0: 0, 1: 0.2, 2: 0.4, 3: 0.62 };

/** Glyph size of the day markers (pt) — at least 6 so they read without colour. */
const MARKER_SIZE = 8;

const CHECK_GLYPH: SymbolViewProps["name"] = {
  ios: "checkmark",
  android: "check",
  web: "check",
};

/** One marker glyph; tone resolves through the status tokens. */
export function MarkerGlyph({
  kind,
  size = MARKER_SIZE,
}: {
  kind: MonthGridMarker;
  size?: number;
}) {
  const { tokens } = useThemeTokens();
  const glyph = MARKER_GLYPH[kind];
  const tone: StatusKey = glyph.tone;
  return <SymbolView name={glyph.icon} size={size} tintColor={tokens.status[tone].color} />;
}

type MonthGridProps = {
  weeks: CalendarDay[][];
  weekdays: { key: string; label: string }[];
  /** Describes one day. Called for every cell on each render — keep it cheap. */
  cell: (day: CalendarDay) => MonthGridCell;
  onPressDay: (day: CalendarDay) => void;
  /** Desktop: bigger tiles. */
  wide?: boolean;
  /** TV row-wrap plumbing (see the calendar screen). */
  cellRefs?: MutableRefObject<Map<string, ViewInstance | null>>;
  rowStartGuides?: MutableRefObject<(ViewInstance | null)[]>;
  rowEndGuides?: MutableRefObject<(ViewInstance | null)[]>;
  guideDestinations?: ViewInstance[];
};

/**
 * The one month grid (Calendar, Qaza history). Day cells are real 44pt targets;
 * status is carried by three fill levels plus a check for "complete" and by
 * glyph markers (dot = missed, star = recommended fast, slash = no fasting) —
 * never by hue alone. Pair it with `MonthGridLegend` so every glyph is explained.
 */
export function MonthGrid({
  weeks,
  weekdays,
  cell,
  onPressDay,
  wide = false,
  cellRefs,
  rowStartGuides,
  rowEndGuides,
  guideDestinations,
}: MonthGridProps) {
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();

  return (
    <View>
      <View style={styles.weekRow}>
        {weekdays.map((weekday) => (
          <View key={weekday.key} style={styles.cell}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {weekday.label}
            </ThemedText>
          </View>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={week[0]?.date} style={styles.weekRow}>
          {tv && rowStartGuides ? (
            <TvFocusGuide
              ref={(node) => {
                rowStartGuides.current[weekIndex] = node;
              }}
              destinations={guideDestinations ?? []}
              style={[styles.rowEdgeGuide, styles.rowEdgeGuideStart]}
            />
          ) : null}
          {week.map((day) => {
            const info = cell(day);
            const fill = info.fill ?? 0;
            const markers = (info.markers ?? []).slice(0, 2);
            const disabled = info.disabled ?? !day.inMonth;
            return (
              <View key={day.date} style={styles.cell}>
                <PressableScale
                  ref={
                    tv && cellRefs
                      ? (node: ViewInstance | null) => {
                          cellRefs.current.set(day.date, node);
                        }
                      : undefined
                  }
                  // TV: start on today so the D-pad begins where the user is.
                  {...(tv && day.isToday && !disabled ? { hasTVPreferredFocus: true } : {})}
                  haptic="light"
                  disabled={disabled}
                  accessibilityRole="button"
                  accessibilityLabel={info.accessibilityLabel}
                  accessibilityState={{ disabled, selected: info.selected ?? false }}
                  onPress={() => onPressDay(day)}
                  style={[
                    styles.day,
                    wide && styles.dayWide,
                    tv && styles.dayTv,
                    {
                      backgroundColor:
                        fill > 0
                          ? withAlpha(tokens.status.success.color, FILL_ALPHA[fill])
                          : "transparent",
                    },
                    // TV keeps the accent ring for D-pad focus only.
                    day.isToday &&
                      !tv && { borderColor: colors.accent, borderWidth: BorderWidth.thick },
                    info.selected && {
                      borderColor: colors.foreground,
                      borderWidth: BorderWidth.thick,
                    },
                  ]}
                >
                  {tv && day.isToday ? (
                    <View style={[styles.todayRingTv, { borderColor: colors.foreground }]} />
                  ) : null}
                  <View style={styles.numberRow}>
                    <ThemedText
                      type={(tv && day.isToday) || info.selected ? "smallBold" : "small"}
                      style={{
                        color: day.inMonth ? colors.foreground : colors.mutedForeground,
                      }}
                    >
                      {day.day}
                    </ThemedText>
                    {fill === 3 ? (
                      <SymbolView
                        name={CHECK_GLYPH}
                        size={IconSize.xs}
                        tintColor={colors.foreground}
                      />
                    ) : null}
                  </View>
                  {info.badge ? (
                    <ThemedText type="caption" style={{ color: colors.accentText }}>
                      {info.badge}
                    </ThemedText>
                  ) : null}
                  {markers.length > 0 ? (
                    <View style={styles.markers}>
                      {markers.map((kind) => (
                        <MarkerGlyph key={kind} kind={kind} />
                      ))}
                    </View>
                  ) : null}
                </PressableScale>
              </View>
            );
          })}
          {tv && rowEndGuides ? (
            <TvFocusGuide
              ref={(node) => {
                rowEndGuides.current[weekIndex] = node;
              }}
              destinations={guideDestinations ?? []}
              style={[styles.rowEdgeGuide, styles.rowEdgeGuideEnd]}
            />
          ) : null}
        </View>
      ))}
    </View>
  );
}

type MonthGridHeaderProps = {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onPick: () => void;
  prevLabel: string;
  nextLabel: string;
  pickLabel: string;
  prevIcon: SymbolViewProps["name"];
  nextIcon: SymbolViewProps["name"];
  /** Shown when the visible month is not the current one. */
  todayLabel?: string;
  onToday?: () => void;
  /** Extra content under the nav row (e.g. the Hijri adjust link). */
  children?: ReactNode;
};

/** Month navigation: 44pt prev / next `IconButton`s, a picker button and a "Today" chip. */
export function MonthGridHeader({
  label,
  onPrev,
  onNext,
  onPick,
  prevLabel,
  nextLabel,
  pickLabel,
  prevIcon,
  nextIcon,
  todayLabel,
  onToday,
  children,
}: MonthGridHeaderProps) {
  const { colors, tokens } = useThemeTokens();
  return (
    <View style={styles.headerBlock}>
      <View style={styles.header}>
        <IconButton
          name={prevIcon}
          accessibilityLabel={prevLabel}
          onPress={onPrev}
          tintColor={colors.accent}
          background={tokens.accentSoft}
        />
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={`${pickLabel}, ${label}`}
          onPress={onPick}
          style={styles.monthLabelButton}
        >
          <ThemedText type="subtitle" style={styles.monthLabelText}>
            {label}
          </ThemedText>
          <SymbolView
            name={{
              ios: "chevron.down",
              android: "keyboard_arrow_down",
              web: "keyboard_arrow_down",
            }}
            size={IconSize.sm}
            tintColor={colors.mutedForeground}
          />
        </PressableScale>
        <IconButton
          name={nextIcon}
          accessibilityLabel={nextLabel}
          onPress={onNext}
          tintColor={colors.accent}
          background={tokens.accentSoft}
        />
      </View>
      {todayLabel && onToday ? (
        <View style={styles.todayRow}>
          <Chip label={todayLabel} selected={false} onPress={onToday} />
        </View>
      ) : null}
      {children}
    </View>
  );
}

export type MonthGridLegendItem = {
  key: string;
  label: string;
  /** Marker glyph, or a fill swatch (`fills`) — one of the two. */
  marker?: MonthGridMarker;
  fills?: readonly MonthGridFill[];
};

/** Legend with the same glyphs and swatches the grid draws. */
export function MonthGridLegend({ items }: { items: readonly MonthGridLegendItem[] }) {
  const { colors, tokens } = useThemeTokens();
  return (
    <View style={styles.legend}>
      {items.map((item) => (
        <View key={item.key} style={styles.legendItem}>
          {item.marker ? <MarkerGlyph kind={item.marker} size={IconSize.sm} /> : null}
          {item.fills?.map((fill) => (
            <View
              key={fill}
              style={[
                styles.legendSwatch,
                fill > 0 && {
                  backgroundColor: withAlpha(tokens.status.success.color, FILL_ALPHA[fill]),
                },
              ]}
            >
              {fill === 3 ? (
                <SymbolView name={CHECK_GLYPH} size={IconSize.xs} tintColor={colors.foreground} />
              ) : null}
            </View>
          ))}
          <ThemedText type="caption" themeColor="mutedForeground">
            {item.label}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

/** Ref type re-exported so screens can type their TV plumbing without importing RN. */
export type MonthGridNodeRef = Ref<ViewInstance>;

const styles = StyleSheet.create({
  weekRow: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.half,
  },
  day: {
    width: "100%",
    minHeight: Control.minTouch,
    paddingVertical: Spacing.half,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  dayWide: {
    maxWidth: 96,
    minHeight: 64,
  },
  dayTv: {
    minHeight: TvLayout.minFocusTarget,
  },
  numberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.half,
  },
  markers: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.half,
    minHeight: MARKER_SIZE,
  },
  /** Invisible TV focus guides at each week's edges (row wrap). */
  rowEdgeGuide: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
  },
  rowEdgeGuideStart: {
    start: 0,
  },
  rowEdgeGuideEnd: {
    end: 0,
  },
  todayRingTv: {
    position: "absolute",
    top: 4,
    bottom: 4,
    start: 4,
    end: 4,
    borderRadius: Radius.md,
    borderWidth: BorderWidth.thick,
    pointerEvents: "none",
  },
  headerBlock: {
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  monthLabelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.one,
    minHeight: Control.minTouch,
    minWidth: 0,
  },
  monthLabelText: {
    flexShrink: 1,
    textAlign: "center",
  },
  todayRow: {
    alignItems: "center",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.oneHalf,
  },
  legendSwatch: {
    width: 16,
    height: 16,
    borderRadius: Radius.xs,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: BorderWidth.hairline,
    borderColor: "transparent",
  },
});
