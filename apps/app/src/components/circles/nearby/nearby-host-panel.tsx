import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { NearbyRequest } from "@/lib/circles/api";
import { nearbyDecisionErrorKey, useNearbyHost } from "@/lib/nearby/use-nearby-host";
import { formatDisplayTime } from "@/lib/time";
import { useToast } from "@/providers/toast-provider";
import { usePreferences } from "@/stores/preferences-store";

import { MatchCode } from "./match-code";
import { NearbyBlocked, NearbyRationale } from "./nearby-states";

/**
 * NF-3.25 host side (D41–D44): "Make visible" advertises this circle to phones
 * right next to you while this panel is on screen; the 4-digit code is shown
 * large so the joiner can compare it; every "Asking to join" request needs an
 * explicit Accept. Leaving the screen, backgrounding the app, Bluetooth off or
 * 10 minutes all stop it. Rendered only where `isNearbyAvailable()` (never on
 * web / TV).
 */
export function NearbyHostPanel({
  circleId,
  role,
  childId,
}: {
  circleId: string;
  role?: "parent" | "member";
  childId?: string;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const prefs = usePreferences();
  const { tokens } = useThemeTokens();
  const host = useNearbyHost({ circleId, role, childId });
  const { state, stop } = host;
  const [deciding, setDeciding] = useState<string | null>(null);
  const isChild = Boolean(childId);

  // Blur (another screen pushed / tab switched) ends advertising, like unmount.
  useFocusEffect(useCallback(() => () => stop(), [stop]));

  const decide = async (request: NearbyRequest, decision: "accept" | "decline") => {
    setDeciding(request.id);
    try {
      await host.decide(request.id, decision);
      if (decision === "accept") {
        toast.success(t(isChild ? "nearby.host.linkedToast" : "nearby.host.acceptedToast"));
      }
    } catch (error) {
      toast.error(t(nearbyDecisionErrorKey(error)));
    } finally {
      setDeciding(null);
    }
  };

  if (state.kind === "rationale") {
    return (
      <NearbyRationale mode="advertise" onContinue={() => void host.grant()} onCancel={host.stop} />
    );
  }
  if (state.kind === "blocked") {
    return <NearbyBlocked reason={state.reason} onRetry={() => void host.start()} />;
  }

  if (state.kind !== "visible") {
    const stoppedKey = state.kind === "stopped" ? `nearby.host.stopped.${state.reason}` : null;
    return (
      <View style={styles.stack}>
        <ThemedText type="smallBold">
          {t(isChild ? "nearby.host.childTitle" : "nearby.host.title")}
        </ThemedText>
        <ThemedText type="small" themeColor="mutedForeground">
          {t(isChild ? "nearby.host.childBody" : "nearby.host.body")}
        </ThemedText>
        {stoppedKey ? (
          <ThemedText type="small" accessibilityLiveRegion="polite">
            {t(stoppedKey)}
          </ThemedText>
        ) : null}
        <Button
          label={
            state.kind === "starting"
              ? t("nearby.host.starting")
              : t(state.kind === "stopped" ? "nearby.host.again" : "nearby.host.start")
          }
          icon={{
            ios: "antenna.radiowaves.left.and.right",
            android: "bluetooth",
            web: "bluetooth",
          }}
          disabled={state.kind === "starting"}
          onPress={() => void host.start()}
        />
      </View>
    );
  }

  const { session } = state;
  return (
    <View style={styles.stack}>
      <View style={styles.statusRow} accessibilityLiveRegion="polite">
        <View style={[styles.dot, { backgroundColor: tokens.status.success.color }]} />
        <View style={styles.flex}>
          <ThemedText type="smallBold">{t("nearby.host.visible")}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("nearby.host.stopsAt", {
              time: formatDisplayTime(new Date(session.expiresAt), prefs.timeFormat),
            })}
          </ThemedText>
        </View>
        <Button label={t("nearby.host.stop")} variant="secondary" onPress={stop} />
      </View>

      <ThemedText type="caption" themeColor="mutedForeground" style={styles.center}>
        {t("nearby.host.codeLabel")}
      </ThemedText>
      <MatchCode code={session.matchCode} />

      <ThemedText type="smallBold" accessibilityRole="header">
        {t("nearby.host.asking")}
      </ThemedText>
      {host.requests.length === 0 ? (
        <ThemedText type="small" themeColor="mutedForeground">
          {t("nearby.host.noneYet")}
        </ThemedText>
      ) : (
        <View style={styles.list}>
          {host.requests.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              busy={deciding === request.id}
              onDecide={(decision) => void decide(request, decision)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function RequestRow({
  request,
  busy,
  onDecide,
}: {
  request: NearbyRequest;
  busy: boolean;
  onDecide: (decision: "accept" | "decline") => void;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const name =
    request.requester === "device"
      ? t("nearby.host.childDevice")
      : (request.displayName ?? t("nearby.host.someone"));
  return (
    <View style={[styles.row, { borderColor: colors.border }]}>
      <View style={styles.flex}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {name}
        </ThemedText>
        {request.requester === "guest" ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("nearby.host.guest")}
          </ThemedText>
        ) : null}
      </View>
      {request.status === "pending" ? (
        <View style={styles.rowActions}>
          <Button
            label={t("nearby.host.decline")}
            variant="secondary"
            disabled={busy}
            accessibilityHint={t("nearby.host.declineA11y", { name })}
            onPress={() => onDecide("decline")}
          />
          <Button
            label={t("nearby.host.accept")}
            disabled={busy}
            accessibilityHint={t("nearby.host.acceptA11y", { name })}
            onPress={() => onDecide("accept")}
          />
        </View>
      ) : (
        <Pill label={t(`nearby.host.status.${request.status}`)} compact />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two },
  statusRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  dot: { width: 10, height: 10, borderRadius: Radius.pill },
  flex: { flex: 1, minWidth: 120 },
  center: { textAlign: "center" },
  list: { gap: Spacing.one },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    borderTopWidth: BorderWidth.hairline,
  },
  rowActions: { flexDirection: "row", gap: Spacing.one },
});
