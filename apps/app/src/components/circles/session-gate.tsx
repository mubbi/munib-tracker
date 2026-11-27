import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useCircleAuth } from "@/lib/circles/hooks";

/**
 * Shown by circles screens (group khatm, joining a circle) while there is no
 * session yet. Guests need one to talk to the server; it is normally created at
 * boot, and re-tried on foreground / reconnect (`AuthProvider.ensureSession`).
 * Instead of a dead end this explains why a connection is needed, shows
 * "Connecting…" while a guest sign-in runs, and on failure says why (offline,
 * server unreachable, server error, too many attempts) with "Try again".
 * Renders nothing once a session exists.
 */
export function CircleSessionGate({ title, body }: { title?: string; body?: string }) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const { hasSession, isReady, sessionStatus, sessionError, ensureSession } = useCircleAuth();

  // Nothing has been tried yet (e.g. right after sign-out) — start now.
  useEffect(() => {
    if (isReady && !hasSession && sessionStatus === "idle") void ensureSession();
  }, [isReady, hasSession, sessionStatus, ensureSession]);

  if (hasSession) return null;
  const failed = isReady && sessionStatus === "error";
  const reason = sessionError ?? "network";

  return (
    <Card style={styles.card}>
      <ThemedText type="smallBold">{title ?? t("circles.session.title")}</ThemedText>
      <ThemedText type="small" themeColor="mutedForeground">
        {body ?? t("circles.session.body")}
      </ThemedText>
      {failed ? (
        <>
          <ThemedText type="small" accessibilityLiveRegion="polite" role="status">
            {t(`circles.session.error.${reason}`)}
          </ThemedText>
          <Button
            label={t("common.tryAgain")}
            variant="secondary"
            onPress={() => void ensureSession({ force: true })}
          />
        </>
      ) : (
        <View style={styles.connecting}>
          <ActivityIndicator color={colors.accent} />
          <ThemedText
            type="small"
            themeColor="mutedForeground"
            accessibilityLiveRegion="polite"
            role="status"
          >
            {t("circles.session.connecting")}
          </ThemedText>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  connecting: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
});
