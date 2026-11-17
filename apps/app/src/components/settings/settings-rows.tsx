import { SymbolView } from "expo-symbols";
import { Children, createContext, memo, type ReactNode, useContext } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward, useIsRTL } from "@/lib/rtl";

/** Window width at which settings row groups lay out in two columns (web / tablets). */
export const SETTINGS_TWO_COLUMN_MIN_WIDTH = 1024;

/** True inside a multi-column `SettingsRowGroup` — rows fill their grid cell. */
const FillCellContext = createContext(false);

/**
 * Stack of settings rows. Phones (and TV, which keeps its D-pad list) get the
 * original single column; wide windows lay the rows out two-up so a long
 * settings card doesn't stretch each row across a 1100px desktop column.
 */
export function SettingsRowGroup({
  children,
  gap = Spacing.two,
}: {
  children: ReactNode;
  gap?: number;
}) {
  const { width } = useWindowDimensions();
  const tv = isTV();
  const count = Children.toArray(children).length;
  const twoUp = !tv && width >= SETTINGS_TWO_COLUMN_MIN_WIDTH && count > 1;
  if (!twoUp) return <View style={{ gap }}>{children}</View>;
  return (
    <FillCellContext.Provider value>
      <ResponsiveGrid columns={2} gap={gap}>
        {children}
      </ResponsiveGrid>
    </FillCellContext.Provider>
  );
}

/** TV icon well — raw dp, so scale for tvOS density. */
// IconWell applies tvDp to `well` itself — pass dp here.
const TV_WELL = 48;

export function SettingsRow({
  icon,
  title,
  subtitle,
  value,
  onPress,
  preferredFocus,
}: {
  icon: AppIcon;
  title: string;
  subtitle?: string;
  value?: string;
  onPress: () => void;
  /** TV: request initial D-pad focus on this row. */
  preferredFocus?: boolean;
}) {
  const { colors } = useThemeTokens();
  const rtl = useIsRTL();
  const chevron = useChevronForward();
  const tv = isTV();
  const fill = useContext(FillCellContext);
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      {...(preferredFocus && tv ? { hasTVPreferredFocus: true } : {})}
      style={[
        styles.row,
        tv && styles.rowTv,
        fill && styles.rowFill,
        { backgroundColor: colors.muted },
      ]}
    >
      <IconWell icon={icon} well={tv ? TV_WELL : undefined} size={tv ? 22 : undefined} />
      <View style={styles.body}>
        <ThemedText type="small" style={tv ? { fontSize: TvLayout.bodyFontSize } : undefined}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {value ? (
        <ThemedText
          type={tv ? "small" : "caption"}
          themeColor="mutedForeground"
          numberOfLines={tv ? 1 : undefined}
          style={tv ? styles.valueTv : undefined}
        >
          {value}
        </ThemedText>
      ) : null}
      <SymbolView
        key={rtl ? "chevron-rtl" : "chevron-ltr"}
        name={chevron}
        size={tv ? 20 : 16}
        tintColor={colors.mutedForeground}
      />
    </PressableScale>
  );
}

export const ToggleRow = memo(
  function ToggleRow({
    icon,
    title,
    subtitle,
    value,
    disabled,
    onValueChange,
  }: {
    icon?: AppIcon;
    title: string;
    subtitle?: string;
    value: boolean;
    disabled?: boolean;
    onValueChange: (value: boolean) => void;
  }) {
    const { colors, tokens } = useThemeTokens();
    const tv = isTV();
    const fill = useContext(FillCellContext);

    if (tv) {
      // 10-foot: the whole row is the D-pad target and Select toggles it. A small
      // native Switch is a poor focus target (and UISwitch doesn't exist on tvOS),
      // so draw a non-focusable track/knob instead.
      return (
        <PressableScale
          accessibilityRole="switch"
          accessibilityLabel={title}
          accessibilityState={{ checked: value, disabled: !!disabled }}
          disabled={disabled}
          onPress={() => onValueChange(!value)}
          style={[
            styles.row,
            styles.rowTv,
            { backgroundColor: colors.muted, opacity: disabled ? 0.5 : 1 },
          ]}
        >
          {icon ? <IconWell icon={icon} well={TV_WELL} size={22} /> : null}
          <View style={styles.body}>
            <ThemedText type="small" style={{ fontSize: TvLayout.bodyFontSize }}>
              {title}
            </ThemedText>
            {subtitle ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {subtitle}
              </ThemedText>
            ) : null}
          </View>
          <View
            style={[
              styles.tvTrack,
              {
                backgroundColor: value ? colors.accent : tokens.track,
                alignItems: value ? "flex-end" : "flex-start",
              },
            ]}
          >
            <View style={[styles.tvKnob, { backgroundColor: colors.card }]} />
          </View>
        </PressableScale>
      );
    }

    return (
      <View
        style={[
          styles.row,
          fill && styles.rowFill,
          { backgroundColor: colors.muted, opacity: disabled ? 0.5 : 1 },
        ]}
      >
        {icon ? <IconWell icon={icon} /> : null}
        <View style={styles.body}>
          <ThemedText type="small">{title}</ThemedText>
          {subtitle ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {subtitle}
            </ThemedText>
          ) : null}
        </View>
        <ThemedSwitch
          value={value}
          disabled={disabled}
          onValueChange={onValueChange}
          accessibilityLabel={title}
        />
      </View>
    );
  },
  (prev, next) =>
    prev.value === next.value &&
    prev.disabled === next.disabled &&
    prev.title === next.title &&
    prev.subtitle === next.subtitle &&
    prev.icon === next.icon,
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    minHeight: 56,
  },
  /** Two-up grid cell: stretch so paired rows share one height. */
  rowFill: {
    flexGrow: 1,
  },
  rowTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.lg,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  valueTv: {
    maxWidth: "40%",
  },
  /** TV toggle visual (non-focusable; the row carries focus). Logical start/end. */
  tvTrack: {
    width: tvDp(56),
    height: tvDp(32),
    borderRadius: tvDp(16),
    padding: tvDp(3),
    // flex-start/flex-end follow layout direction, so "on" sits at the trailing
    // edge in both LTR and RTL.
    justifyContent: "center",
  },
  tvKnob: {
    width: tvDp(26),
    height: tvDp(26),
    borderRadius: tvDp(13),
  },
});
