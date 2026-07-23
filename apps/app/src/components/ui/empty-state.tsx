import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

type EmptyStateProps = {
  icon: SymbolViewProps["name"];
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

/**
 * A calm, encouraging empty state — never a dead end. Used when a list has no
 * items yet (e.g. no qadha logged), it invites the next small step rather than
 * signalling absence.
 */
export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();

  return (
    <Animated.View entering={FadeIn.duration(320)} style={[styles.root, tv && styles.rootTv]}>
      <View
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
            style={[styles.description, tv && { fontSize: TvLayout.bodyFontSize, maxWidth: 420 }]}
          >
            {description}
          </ThemedText>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Button label={actionLabel} variant="secondary" onPress={onAction} />
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWellTv: {
    width: 96,
    height: 96,
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
    maxWidth: 280,
  },
});
