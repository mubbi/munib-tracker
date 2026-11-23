import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon as AppIconView } from "@/components/ui/app-icon";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Radius, Spacing } from "@/constants/theme";
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
  preferredFocus?: boolean;
};

/** Browse tile: hue-tinted icon well over the category name, its size, and optional progress. */
export function BrowseTile({
  icon,
  label,
  countLabel,
  hue,
  progress,
  onPress,
  preferredFocus,
}: BrowseTileProps) {
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const done = progress != null && progress.total > 0 && progress.completed >= progress.total;

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={[label, countLabel].filter(Boolean).join(", ")}
      onPress={onPress}
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
    borderWidth: 1,
  },
  tileTv: {
    minHeight: TvLayout.minFocusTarget * 2,
    padding: Spacing.four,
  },
  text: { gap: 2 },
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
});
