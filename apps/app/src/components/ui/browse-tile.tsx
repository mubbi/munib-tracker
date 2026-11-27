import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon as AppIconView } from "@/components/ui/app-icon";
import { IconWell } from "@/components/ui/icon-well";
import { NewBadge } from "@/components/ui/new-badge";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { BorderWidth, IconSize, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";

import type { CategoryHue } from "./use-category-hue";

type BrowseTileProps = {
  icon: AppIcon;
  label: string;
  /** Localised count line, e.g. "23 supplications". */
  countLabel?: string;
  hue: CategoryHue;
  /**
   * Today's progress for trackable sets (adhkar): draws a bar under the label
   * and switches to a success check once everything is done.
   */
  progress?: { completed: number; total: number };
  onPress: () => void;
  /** Web: in-app route this opens — renders a crawlable `<a href>` (see `PressableScale`). */
  href?: string;
  preferredFocus?: boolean;
  /**
   * `card` (default): icon well on top-start, label + count below (category
   * grids). `compact`: a ~96pt square — centred icon well over a one/two-line
   * label, in the Home Explore (`QuickActionGrid`) visual language — for the
   * Library tab's primary destinations.
   */
  variant?: "card" | "compact";
  /** Show a "New" pill on the tile (compact variant). */
  isNew?: boolean;
  /** Accessibility label suffix for the badge, e.g. "New". */
  newLabel?: string;
};

/** Browse tile: hue-tinted icon well over the category name, its size, and optional progress. */
export function BrowseTile({
  icon,
  label,
  countLabel,
  hue,
  progress,
  onPress,
  href,
  preferredFocus,
  variant = "card",
  isNew,
  newLabel,
}: BrowseTileProps) {
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  if (variant === "compact") {
    return (
      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={[label, isNew ? newLabel : undefined, countLabel]
          .filter(Boolean)
          .join(", ")}
        onPress={onPress}
        href={href}
        scaleTo={0.95}
        {...(tv && preferredFocus ? { hasTVPreferredFocus: true } : {})}
        style={[styles.compact, tv && styles.compactTv]}
      >
        <View
          style={[
            styles.compactWell,
            tv && styles.compactWellTv,
            { backgroundColor: hue.soft, borderColor: hue.border },
          ]}
        >
          <AppIconView icon={icon} size={tv ? IconSize.xl : 22} tintColor={hue.icon} />
          {/* Anchored to the well so it stays attached to its icon at every width. */}
          {isNew ? <NewBadge style={styles.compactNew} /> : null}
        </View>
        <ThemedText
          type="caption"
          numberOfLines={2}
          android_hyphenationFrequency="normal"
          style={[styles.compactLabel, { color: colors.foreground }]}
        >
          {label}
        </ThemedText>
      </PressableScale>
    );
  }
  const done = progress != null && progress.total > 0 && progress.completed >= progress.total;

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={[label, countLabel].filter(Boolean).join(", ")}
      onPress={onPress}
      href={href}
      {...(tv && preferredFocus ? { hasTVPreferredFocus: true } : {})}
      style={[
        styles.tile,
        tv && styles.tileTv,
        { backgroundColor: colors.muted, borderColor: tokens.hairline },
      ]}
    >
      <View style={styles.topRow}>
        <IconWell
          icon={icon}
          tint={hue.icon}
          background={hue.soft}
          well={tv ? 52 : 42}
          size={tv ? 24 : 20}
          radius={Radius.md}
        />
        {done ? (
          <View style={[styles.doneBadge, { backgroundColor: tokens.status.success.soft }]}>
            <AppIconView
              icon={{ ios: "checkmark", android: "check", web: "check" }}
              size={tv ? 18 : 14}
              tintColor={tokens.status.success.color}
            />
          </View>
        ) : null}
      </View>
      <View style={styles.text}>
        <ThemedText type="smallBold" numberOfLines={2} android_hyphenationFrequency="normal">
          {label}
        </ThemedText>
        {countLabel ? (
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {countLabel}
          </ThemedText>
        ) : null}
      </View>
      {progress && progress.total > 0 ? (
        <ProgressBar
          value={progress.completed / progress.total}
          accessibilityLabel={label}
          height={tv ? 6 : 4}
          color={done ? tokens.status.success.color : hue.icon}
          style={styles.progress}
        />
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexGrow: 1,
    gap: Spacing.two,
    padding: Spacing.three,
    minHeight: tvDp(118),
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
  tileTv: {
    minHeight: TvLayout.minFocusTarget * 2,
    padding: Spacing.four,
  },
  text: { gap: Spacing.half },
  topRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  doneBadge: {
    width: tvDp(24),
    height: tvDp(24),
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  // Pin the bar to the bottom so tiles in a row line up whatever the label wraps to.
  progress: { marginTop: "auto" },
  compact: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    minHeight: tvDp(96),
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  compactTv: {
    minHeight: TvLayout.minFocusTarget * 2,
  },
  compactWell: {
    width: tvDp(48),
    height: tvDp(48),
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
    alignItems: "center",
    justifyContent: "center",
  },
  compactWellTv: {
    width: tvDp(56),
    height: tvDp(56),
  },
  compactNew: {
    position: "absolute",
    top: -Spacing.two,
    end: -Spacing.three,
    alignSelf: "auto",
  },
  compactLabel: {
    alignSelf: "stretch",
    textAlign: "center",
  },
});
