import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

export type BarDatum = {
  label: string;
  /** 0..1 fill height. */
  value: number;
  caption?: string;
  /**
   * `highlight` = the current bar (today / this month), `muted` = no data to
   * judge (before tracking began, future), `excused` = an excused day (outlined,
   * never filled). Defaults to `default`.
   */
  tone?: "default" | "highlight" | "muted" | "excused";
  /** Localized screen-reader label; defaults to "<label>: <percent>%". */
  accessibilityLabel?: string;
};

type BarChartProps = {
  data: BarDatum[];
  color?: string;
  /** Plot height in px (labels sit below and do not count toward this). */
  height?: number;
  /** Shown when every bar is empty. */
  emptyLabel?: string;
  /** 0..1 — draws a dashed guide line at this level (e.g. the period average). */
  average?: number | null;
  /** Selected bar (draws a ring around it); pair with `onSelect`. */
  selectedIndex?: number | null;
  /** Makes bars pressable (phone / web — not on TV, where 30 stops would trap D-pad). */
  onSelect?: (index: number) => void;
};

const MIN_FILL_PCT = 8;

/** A dependency-free vertical bar chart built from Views — renders on iOS/Android/Web. */
export function BarChart({
  data,
  color,
  height = 112,
  emptyLabel,
  average,
  selectedIndex,
  onSelect,
}: BarChartProps) {
  const { colors, tokens } = useThemeTokens();
  const barColor = color ?? colors.accent;
  const pressable = onSelect != null && !isTV();
  const dense = data.length > 14;
  const gap = dense ? 2 : Spacing.one;
  const barWidth = dense ? "100%" : "72%";
  const allEmpty = data.length > 0 && data.every((d) => d.value <= 0);

  const axisTicks = data
    .map((datum, index) => ({ label: datum.label.trim(), index }))
    .filter((entry) => entry.label.length > 0);

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.plotShell,
          {
            height,
            backgroundColor: tokens.isDark ? tokens.surfaceRaised : colors.muted,
            borderColor: tokens.hairline,
          },
        ]}
      >
        {allEmpty && emptyLabel ? (
          <View style={styles.emptyOverlay}>
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.emptyText}>
              {emptyLabel}
            </ThemedText>
          </View>
        ) : null}

        <View style={[styles.plot, { gap }]}>
          {average != null && average > 0 && !allEmpty ? (
            <View
              style={[
                styles.averageLine,
                { bottom: `${Math.min(1, average) * 100}%`, borderColor: withAlpha(barColor, 0.7) },
              ]}
            />
          ) : null}
          {data.map((datum, index) => {
            const clamped = Math.max(0, Math.min(1, datum.value));
            const tone = datum.tone ?? "default";
            const hasValue = clamped > 0 && tone !== "excused";
            const fillPct = hasValue ? Math.max(clamped * 100, MIN_FILL_PCT) : 0;
            const selected = selectedIndex === index;
            const fillColor =
              tone === "muted"
                ? withAlpha(barColor, 0.35)
                : tone === "default" && selectedIndex != null && !selected
                  ? withAlpha(barColor, 0.55)
                  : barColor;
            const label =
              datum.accessibilityLabel ??
              `${datum.label || `Bar ${index + 1}`}: ${Math.round(clamped * 100)}%`;
            const track = (
              <View
                // biome-ignore lint/suspicious/noArrayIndexKey: chart labels are not unique
                key={`track-${index}`}
                accessibilityRole={pressable ? undefined : "image"}
                accessibilityLabel={pressable ? undefined : label}
                style={[
                  styles.track,
                  {
                    width: barWidth,
                    backgroundColor: tone === "excused" ? "transparent" : tokens.track,
                  },
                  tone === "excused"
                    ? [styles.excusedTrack, { borderColor: tokens.hairline }]
                    : null,
                  tone === "highlight" || selected
                    ? [
                        styles.highlightTrack,
                        { borderColor: withAlpha(barColor, selected ? 1 : 0.6) },
                      ]
                    : null,
                ]}
              >
                {hasValue ? (
                  <View
                    style={[
                      styles.fill,
                      {
                        height: `${fillPct}%`,
                        backgroundColor: fillColor,
                      },
                    ]}
                  />
                ) : null}
              </View>
            );
            return pressable ? (
              <Pressable
                // biome-ignore lint/suspicious/noArrayIndexKey: chart labels are not unique (repeated weekday/month initials)
                key={`${datum.label}-${index}`}
                style={styles.barColumn}
                onPress={() => onSelect?.(index)}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected }}
                hitSlop={{ top: 8, bottom: 8 }}
              >
                {track}
              </Pressable>
            ) : (
              // biome-ignore lint/suspicious/noArrayIndexKey: chart labels are not unique (repeated weekday/month initials)
              <View key={`${datum.label}-${index}`} style={styles.barColumn}>
                {track}
              </View>
            );
          })}
        </View>
      </View>

      {dense ? (
        <View style={styles.axisRow}>
          {axisTicks.map((entry) => (
            <ThemedText
              key={`${entry.label}-${entry.index}`}
              type="caption"
              themeColor="mutedForeground"
              numberOfLines={1}
              style={styles.axisLabel}
            >
              {entry.label}
            </ThemedText>
          ))}
        </View>
      ) : (
        <View style={[styles.labels, { gap }]}>
          {data.map((datum, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: chart labels are not unique (repeated weekday/month initials)
            <View key={`${datum.label}-label-${index}`} style={styles.labelColumn}>
              <ThemedText
                type={
                  datum.tone === "highlight" || selectedIndex === index ? "smallBold" : "caption"
                }
                themeColor={
                  datum.tone === "highlight" || selectedIndex === index
                    ? "foreground"
                    : "mutedForeground"
                }
                numberOfLines={1}
                style={styles.label}
              >
                {datum.label}
              </ThemedText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.one + 2,
  },
  plotShell: {
    position: "relative",
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    overflow: "hidden",
  },
  emptyOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.three,
    zIndex: 1,
    pointerEvents: "none",
  },
  emptyText: {
    textAlign: "center",
  },
  plot: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    position: "relative",
  },
  averageLine: {
    position: "absolute",
    start: 0,
    end: 0,
    borderTopWidth: 1,
    borderStyle: "dashed",
    zIndex: 2,
    pointerEvents: "none",
  },
  excusedTrack: {
    borderWidth: 1,
    borderStyle: "dashed",
  },
  highlightTrack: {
    borderWidth: 1.5,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
  },
  track: {
    flex: 1,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  fill: {
    width: "100%",
    minHeight: 6,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  labels: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.two,
  },
  labelColumn: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    textAlign: "center",
    fontSize: 11,
  },
  axisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.two,
    gap: Spacing.one,
    minHeight: 16,
  },
  axisLabel: {
    flexShrink: 1,
    fontSize: 11,
    fontVariant: ["tabular-nums"],
  },
});
