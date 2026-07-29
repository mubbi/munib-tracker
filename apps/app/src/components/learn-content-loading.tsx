import { createContext, type ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/**
 * When true, nested {@link Stagger} skips opacity-0 entrances so learn body
 * content is fully visible on the first visit (not only after remount).
 */
const LearnBodyReadyContext = createContext(false);

/** True when rendering inside a ready {@link LearnContentGate}. */
export function useLearnBodyReady(): boolean {
  return useContext(LearnBodyReadyContext);
}

/**
 * Inline body placeholder while a learn corpus finishes lazy-loading.
 * Keeps ScreenLayout chrome (title / back) mounted so navigation stays usable.
 */
export function LearnContentLoading() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const title = t("common.loadingContent");
  const hint = t("common.loadingContentHint");

  return (
    <View
      style={styles.root}
      accessibilityRole="progressbar"
      accessibilityLabel={title}
      accessibilityLiveRegion="polite"
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: tokens.hairline,
          },
        ]}
      >
        <View style={[styles.well, { backgroundColor: tokens.accentSoft }]}>
          <ActivityIndicator color={colors.accent} />
        </View>
        <View style={styles.copy}>
          <ThemedText type="smallBold">{title}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {hint}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

/**
 * Renders a loader until `ready`, then children — use for learn body content.
 * Once ready, children mount with the corpus already warm (prefer sync imports
 * in `lib/*` learn modules) and nested Stagger skips opacity-0 entrances so the
 * first visit paints the full hub.
 */
export function LearnContentGate({ ready, children }: { ready: boolean; children: ReactNode }) {
  if (!ready) return <LearnContentLoading />;
  return <LearnBodyReadyContext.Provider value={true}>{children}</LearnBodyReadyContext.Provider>;
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    paddingTop: Spacing.two,
    alignItems: "center",
  },
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: "continuous",
  },
  well: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
  copy: {
    flex: 1,
    gap: Spacing.half,
  },
});
