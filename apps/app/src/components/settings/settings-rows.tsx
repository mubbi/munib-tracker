import { SymbolView } from "expo-symbols";
import { Children, createContext, memo, type ReactNode, useContext } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { SwitchRow } from "@/components/ui/switch-row";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward, useIsRTL } from "@/lib/rtl";

import { SETTINGS_TWO_COLUMN_MIN_WIDTH } from "./settings-layout";

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
  accessory,
  showChevron = true,
  disabled,
  titleColor,
  leading,
  selected,
}: {
  icon?: AppIcon;
  /** Custom leading visual (e.g. the account avatar) in place of the icon well. */
  leading?: ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  onPress: () => void;
  /** TV: request initial D-pad focus on this row. */
  preferredFocus?: boolean;
  /** Small trailing-title adornment (e.g. the "This device" badge). */
  accessory?: ReactNode;
  /** Actions (preview, reset…) don't navigate, so they draw no chevron. */
  showChevron?: boolean;
  disabled?: boolean;
  /** Destructive rows tint the title. */
  titleColor?: string;
  /** List–detail: the row whose content the detail pane shows (spoken as selected). */
  selected?: boolean;
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
      // Screen readers hear the current value with the title ("Time format, 24-hour").
      accessibilityLabel={value ? `${title}, ${value}` : title}
      accessibilityState={
        disabled || selected
          ? { ...(disabled ? { disabled: true } : {}), ...(selected ? { selected: true } : {}) }
          : undefined
      }
      disabled={disabled}
      onPress={onPress}
      {...(preferredFocus && tv ? { hasTVPreferredFocus: true } : {})}
      style={[
        styles.row,
        tv && styles.rowTv,
        fill && styles.rowFill,
        { backgroundColor: colors.muted, opacity: disabled ? 0.5 : 1 },
      ]}
    >
      {leading ??
        (icon ? (
          <IconWell icon={icon} well={tv ? TV_WELL : undefined} size={tv ? 22 : undefined} />
        ) : null)}
      <View style={styles.body}>
        <View style={styles.titleLine}>
          <ThemedText
            type="small"
            style={[
              tv ? { fontSize: TvLayout.bodyFontSize } : undefined,
              titleColor ? { color: titleColor } : undefined,
            ]}
          >
            {title}
          </ThemedText>
          {accessory}
        </View>
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
          style={[styles.value, { textAlign: rtl ? "left" : "right" }, tv && styles.valueTv]}
        >
          {value}
        </ThemedText>
      ) : null}
      {showChevron ? (
        <SymbolView
          key={rtl ? "chevron-rtl" : "chevron-ltr"}
          name={chevron}
          size={tv ? 20 : 16}
          tintColor={colors.mutedForeground}
        />
      ) : null}
    </PressableScale>
  );
}

/**
 * Settings on/off row — renders the one `ui/SwitchRow` (D-15/D-16): the whole
 * row is a single pressable with role `switch`, so tapping the label toggles
 * it and web has one tab stop (no native `<input role=switch>` nested inside a
 * focusable row). Keeps the settings card look (muted fill) and the two-up
 * grid cell stretch.
 */
export const ToggleRow = memo(
  function ToggleRow({
    icon,
    title,
    subtitle,
    value,
    disabled,
    onValueChange,
    accessory,
  }: {
    icon?: AppIcon;
    title: string;
    subtitle?: string;
    value: boolean;
    disabled?: boolean;
    onValueChange: (value: boolean) => void;
    /** Small trailing-title adornment (e.g. the "This device" badge). */
    accessory?: ReactNode;
  }) {
    const fill = useContext(FillCellContext);
    const tv = isTV();
    // Same icon well as `SettingsRow`, so toggles and navigation rows line up.
    const leading = icon ? (
      <IconWell icon={icon} well={tv ? TV_WELL : undefined} size={tv ? 22 : undefined} />
    ) : undefined;
    const row = (
      <SwitchRow
        leading={leading}
        title={title}
        subtitle={subtitle}
        value={value}
        disabled={disabled}
        onValueChange={onValueChange}
        accessory={accessory}
        surface="filled"
      />
    );
    return fill ? <View style={styles.rowFill}>{row}</View> : row;
  },
  (prev, next) =>
    prev.value === next.value &&
    prev.disabled === next.disabled &&
    prev.title === next.title &&
    prev.subtitle === next.subtitle &&
    prev.icon === next.icon &&
    // Badges are static adornments; compare presence, not element identity.
    Boolean(prev.accessory) === Boolean(next.accessory),
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
    gap: Spacing.half,
    // Keep room for the title's longest word: a long trailing value (e.g. a
    // calculation-method name) otherwise squeezed it to ~80dp and Android broke
    // "Calculation" mid-word.
    minWidth: "40%",
  },
  titleLine: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  /** Trailing value shrinks and wraps instead of claiming its full text width. */
  value: {
    flexShrink: 1,
    maxWidth: "45%",
  },
  valueTv: {
    maxWidth: "40%",
  },
});
