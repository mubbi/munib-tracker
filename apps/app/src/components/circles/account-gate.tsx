import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { isTV } from "@/lib/platform/is-tv";

/**
 * Family and partner circles need a linked account (guests can only join a
 * khatm group). Shown instead of the create / manage controls for guests.
 */
export function CircleAccountGate({ message }: { message?: string }) {
  const { t } = useTranslation();
  return (
    <Card style={styles.card}>
      <ThemedText type="subtitle">{t("circles.gate.title")}</ThemedText>
      <ThemedText type="small" themeColor="mutedForeground">
        {message ?? t("circles.gate.body")}
      </ThemedText>
      {isTV() ? (
        <ThemedText type="small" themeColor="mutedForeground">
          {t("circles.gate.tv")}
        </ThemedText>
      ) : (
        <SocialLoginButtons />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
});
