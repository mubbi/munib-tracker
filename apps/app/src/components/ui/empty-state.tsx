import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Durations } from "@/constants/motion";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

type EmptyStateProps = {
  icon: SymbolViewProps["name"];
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** TV: the action takes initial D-pad focus (a screen is never a focus dead end). */
  actionPreferredFocus?: boolean;
  /** Optional second, quieter next step (ghost button under the main action). */
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * A calm, encouraging empty state — never a dead end. Used when a list has no
 * items yet (e.g. no qadha logged), it invites the next small step rather than
 * signalling absence.
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionPreferredFocus,
  secondaryActionLabel,
  onSecondaryAction,
  style,
}: EmptyStateProps) {
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();

  return (
    <Animated.View
      entering={FadeIn.duration(Durations.base)}
      style={[styles.root, tv && styles.rootTv, style]}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.iconWell, tv && styles.iconWellTv, { backgroundColor: tokens.accentSoft }]}
      >
        <SymbolView name={icon} size={tv ? 36 : 28} tintColor={colors.accent} />
      </View>
      <View style={[styles.text, tv && styles.textTv]}>
        <ThemedText
          type="subtitle"
          style={[styles.title, tv && { fontSize: TvLayout.titleFontSize }]}
        >
          {title}
        </ThemedText>
        {description ? (
          <ThemedText
            type="small"
            themeColor="mutedForeground"
            style={[
              styles.description,
              tv && { fontSize: TvLayout.bodyFontSize, maxWidth: tvDp(420) },
            ]}
          >
            {description}
          </ThemedText>
        ) : null}
      </View>
      {(actionLabel && onAction) || (secondaryActionLabel && onSecondaryAction) ? (
        <View style={styles.actions}>
          {actionLabel && onAction ? (
            // Button pins itself to flex-start unless fullWidth — centre it under
            // the centred copy (it sat flush-left in every empty state).
            <Button
              label={actionLabel}
              variant="secondary"
              onPress={onAction}
              preferredFocus={actionPreferredFocus}
              style={styles.action}
            />
          ) : null}
          {secondaryActionLabel && onSecondaryAction ? (
            <Button
              label={secondaryActionLabel}
              variant="ghost"
              onPress={onSecondaryAction}
              preferredFocus={actionPreferredFocus && !(actionLabel && onAction)}
              style={styles.action}
            />
          ) : null}
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  action: { alignSelf: "center" },
  actions: { alignItems: "center", gap: Spacing.two },
  root: {
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.four,
  },
  rootTv: {
    gap: Spacing.four,
    paddingVertical: TvLayout.contentPaddingY,
    paddingHorizontal: TvLayout.contentPaddingX,
  },
  iconWell: {
    width: tvDp(72),
    height: tvDp(72),
    borderRadius: Radius.xl,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWellTv: {
    width: tvDp(96),
    height: tvDp(96),
  },
  text: {
    alignItems: "center",
    gap: Spacing.one,
  },
  textTv: {
    gap: Spacing.two,
  },
  title: {
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    maxWidth: tvDp(280),
  },
});
