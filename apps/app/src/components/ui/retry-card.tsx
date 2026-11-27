import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconSize, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type RetryCardProps = {
  /** "Couldn't load {object}. {cause}" — defaults to a generic (or offline) line. */
  message?: string;
  /** Defaults to "Try again". */
  retryLabel?: string;
  onRetry: () => void;
  /** The failure is a lost connection: wifi glyph + the offline line by default. */
  offline?: boolean;
  /** Cached content is still shown below/above — adds "Showing saved copy". */
  showingSavedCopy?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * A recoverable load failure: one calm sentence + a "Try again" button inside a
 * card. Replaces the copy-pasted offline/retry cards across Circles, Family,
 * Kids and Partner screens. A failed load is never an empty state (F-10).
 *
 * The message is a polite live region so screen readers announce the failure
 * when it replaces a loading line (WAI-ARIA `status`, not `alert` — it is not
 * urgent); the retry stays a normal, focusable button.
 */
export function RetryCard({
  message,
  retryLabel,
  onRetry,
  offline = false,
  showingSavedCopy = false,
  style,
}: RetryCardProps) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const text = message ?? t(offline ? "uiFeedback.offline" : "uiFeedback.loadFailed");

  return (
    <Card style={[styles.card, style]}>
      <View style={styles.messageRow}>
        {offline ? (
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <SymbolView
              name={{ ios: "wifi.slash", android: "wifi_off", web: "wifi_off" }}
              size={IconSize.md}
              tintColor={colors.mutedForeground}
            />
          </View>
        ) : null}
        <View style={styles.messageText}>
          <ThemedText
            type="small"
            themeColor="mutedForeground"
            accessibilityLiveRegion="polite"
            role="status"
          >
            {text}
          </ThemedText>
          {showingSavedCopy ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("uiFeedback.showingSavedCopy")}
            </ThemedText>
          ) : null}
        </View>
      </View>
      <Button label={retryLabel ?? t("common.tryAgain")} variant="secondary" onPress={onRetry} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  messageRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.two },
  messageText: { flex: 1, minWidth: 0, gap: Spacing.half },
});
