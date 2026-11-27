import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/**
 * Themed interim state while an OAuth return route finishes the code exchange
 * (D-32). The blocking spinner is allowlisted (P8-04): there is nothing else to
 * show until the session lands or the route redirects back to sign-in.
 */
export function OAuthReturnPending() {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={t("oauth.signingIn")}
        accessibilityState={{ busy: true }}
        accessibilityLiveRegion="polite"
        style={styles.body}
      >
        <ActivityIndicator size="large" color={colors.accent} />
        <ThemedText type="small" themeColor="mutedForeground">
          {t("oauth.signingIn")}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
  },
  body: {
    alignItems: "center",
    gap: Spacing.three,
  },
});
