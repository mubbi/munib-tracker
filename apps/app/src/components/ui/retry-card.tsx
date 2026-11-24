import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";

/**
 * A recoverable load failure: one calm sentence + a "Try again" button inside a
 * card. Replaces the copy-pasted offline/retry cards across Circles, Family,
 * Kids and Partner screens.
 *
 * The message is a polite live region so screen readers announce the failure
 * when it replaces a loading line (WAI-ARIA `status`, not `alert` — it is not
 * urgent); the retry stays a normal, focusable button.
 */
export function RetryCard({
  message,
  retryLabel,
  onRetry,
  style,
}: {
  message: string;
  retryLabel: string;
  onRetry: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Card padding="three" style={[styles.card, style]}>
      <ThemedText
        type="small"
        themeColor="mutedForeground"
        accessibilityLiveRegion="polite"
        role="status"
      >
        {message}
      </ThemedText>
      <Button label={retryLabel} variant="secondary" onPress={onRetry} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
});
