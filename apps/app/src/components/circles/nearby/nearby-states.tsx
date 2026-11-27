import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { IconWell } from "@/components/ui/icon-well";
import { Spacing } from "@/constants/theme";
import type { NearbyBlockReason } from "@/lib/nearby/machine";
import {
  nearbyScanNeedsLocationServices,
  openBluetoothSettings,
  openLocationSettings,
  openNearbyPermissionSettings,
} from "@/lib/nearby/permissions";

const BLUETOOTH_ICON = {
  ios: "antenna.radiowaves.left.and.right",
  android: "bluetooth",
  web: "bluetooth",
} as const;

/**
 * Explains Bluetooth BEFORE the system prompt (Apple HIG "Requesting
 * permission", Android "Request runtime permissions": show context first).
 */
export function NearbyRationale({
  mode,
  onContinue,
  onCancel,
}: {
  mode: "advertise" | "scan";
  onContinue: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.stack}>
      <View style={styles.header}>
        <IconWell icon={BLUETOOTH_ICON} />
        <ThemedText type="smallBold" style={styles.flex}>
          {t("nearby.rationale.title")}
        </ThemedText>
      </View>
      <ThemedText type="small" themeColor="mutedForeground">
        {t(mode === "advertise" ? "nearby.rationale.hostBody" : "nearby.rationale.joinBody")}
      </ThemedText>
      {mode === "scan" && nearbyScanNeedsLocationServices() ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("nearby.rationale.androidLocation")}
        </ThemedText>
      ) : null}
      <View style={styles.actions}>
        <Button label={t("nearby.rationale.continue")} onPress={onContinue} />
        <Button label={t("nearby.rationale.notNow")} variant="ghost" onPress={onCancel} />
      </View>
    </View>
  );
}

/** Bluetooth off / denied / unsupported — with the one action that fixes it. */
export function NearbyBlocked({
  reason,
  onRetry,
}: {
  reason: NearbyBlockReason;
  onRetry: () => void;
}) {
  const { t } = useTranslation();
  const body =
    reason === "bluetoothOff"
      ? t(
          Platform.OS === "ios"
            ? "nearby.blocked.bluetoothOff.bodyIos"
            : "nearby.blocked.bluetoothOff.bodyAndroid",
        )
      : t(`nearby.blocked.${reason}.body`);

  const fix =
    reason === "permissionBlocked"
      ? {
          label: t("nearby.blocked.openSettings"),
          run: () => void openNearbyPermissionSettings(),
        }
      : reason === "bluetoothOff" && Platform.OS === "android"
        ? { label: t("nearby.blocked.openBluetooth"), run: () => void openBluetoothSettings() }
        : reason === "locationOff"
          ? { label: t("nearby.blocked.openLocation"), run: () => void openLocationSettings() }
          : null;

  return (
    <View style={styles.stack} accessibilityLiveRegion="polite">
      <View style={styles.header}>
        <IconWell icon={BLUETOOTH_ICON} />
        <ThemedText type="smallBold" style={styles.flex}>
          {t(`nearby.blocked.${reason}.title`)}
        </ThemedText>
      </View>
      <ThemedText type="small" themeColor="mutedForeground">
        {body}
      </ThemedText>
      {reason === "unsupported" ? null : (
        <View style={styles.actions}>
          {fix ? <Button label={fix.label} onPress={fix.run} /> : null}
          <Button
            label={t("nearby.blocked.retry")}
            variant={fix ? "secondary" : "primary"}
            onPress={onRetry}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two },
  header: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
});
