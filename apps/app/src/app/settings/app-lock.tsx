import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import { BiometricUnlockRow } from "@/components/settings/editors/link-rows";
import { SettingsRow, SettingsRowGroup } from "@/components/settings/settings-rows";
import { SettingsDetailScreen } from "@/components/settings/settings-screen";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { SetPinModal } from "@/features/pin-lock/components/set-pin-modal";
import { VerifyPinModal } from "@/features/pin-lock/components/verify-pin-modal";
import { LOCK_TIMEOUT_OPTIONS, usePinLock } from "@/features/pin-lock/providers/pin-lock-provider";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";
import { isExpoGo } from "@/lib/notifications/platform";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useToast } from "@/providers/toast-provider";

/** Short segment labels; the full phrase stays the accessible name. */
const TIMEOUT_SHORT_LABEL: Record<number, string> = {
  0: "pinLock.immediately",
  60000: "pinLock.after1MinShort",
  300000: "pinLock.after5MinShort",
};

export default function AppLockScreen() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const toast = useToast();
  const {
    isPinEnabled,
    enablePin,
    disablePin,
    setPin,
    unlock,
    lockTimeoutMs,
    setLockTimeoutMs,
    biometricsAvailable,
  } = usePinLock();

  const [showSetPinModal, setShowSetPinModal] = useState(false);
  const [showVerifyPinModal, setShowVerifyPinModal] = useState(false);
  const [verifyPinPurpose, setVerifyPinPurpose] = useState<"disable" | "change" | null>(null);
  const [pendingChangePin, setPendingChangePin] = useState<string | null>(null);

  const expoGo = isExpoGo();
  const isNative = Platform.OS === "ios" || Platform.OS === "android";

  // TV has no PIN pad and web has no secure storage: the route bounces to Privacy.
  if (isTV() || !isNative) {
    return (
      <SettingsDetailScreen
        parent="privacy"
        path="/settings/app-lock"
        title={t("pinLock.title")}
        available={false}
      />
    );
  }

  const openEnablePinModal = () => {
    triggerHaptic("selection");
    setPendingChangePin(null);
    setShowSetPinModal(true);
  };

  const openVerify = (purpose: "disable" | "change") => {
    if (purpose === "change") setPendingChangePin(null);
    setVerifyPinPurpose(purpose);
    setShowVerifyPinModal(true);
  };

  const timeoutOptions = LOCK_TIMEOUT_OPTIONS.map((opt) => ({
    id: String(opt.value),
    label: t(TIMEOUT_SHORT_LABEL[opt.value] ?? opt.labelKey),
    accessibilityLabel: t(opt.labelKey),
  }));

  return (
    <SettingsDetailScreen
      parent="privacy"
      path="/settings/app-lock"
      title={t("pinLock.title")}
      subtitle={t("pinLock.settingsSubtitle")}
    >
      <Stagger>
        {expoGo ? (
          <Callout tone="info" title={t("pinLock.expoGoTitle")}>
            {t("pinLock.expoGoHint")}
          </Callout>
        ) : null}

        <Card>
          <SectionHeader
            title={t("pinLock.title")}
            icon={{ ios: "lock.fill", android: "lock", web: "lock" }}
          />

          {!isPinEnabled ? (
            <View style={styles.hero}>
              <View
                style={[styles.heroIcon, { backgroundColor: tokens.accentSoft }]}
                accessible={false}
                importantForAccessibility="no-hide-descendants"
              >
                <SymbolView
                  name={{ ios: "lock.shield.fill", android: "shield", web: "shield" }}
                  size={28}
                  tintColor={colors.accent}
                />
              </View>
              <ThemedText type="small" style={styles.heroTitle}>
                {t("pinLock.enablePin")}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.heroDesc}>
                {t("pinLock.enablePinDesc")}
              </ThemedText>
              <View style={styles.featureChips}>
                <Pill tone="accent" label={t("pinLock.heroFeaturePin")} />
                {biometricsAvailable ? (
                  <Pill tone="accent" label={t("pinLock.heroFeatureBiometric")} />
                ) : null}
                <Pill tone="accent" label={t("pinLock.heroFeatureAutoLock")} />
              </View>
              {!expoGo ? (
                <Button
                  label={t("pinLock.enablePin")}
                  icon={{ ios: "lock.fill", android: "lock", web: "lock" }}
                  fullWidth
                  onPress={openEnablePinModal}
                />
              ) : null}
            </View>
          ) : (
            <View style={styles.enabledSection}>
              <Pill
                tone="success"
                icon={{
                  ios: "checkmark.shield.fill",
                  android: "verified_user",
                  web: "verified_user",
                }}
                label={t("pinLock.statusProtected")}
                style={styles.status}
              />

              <SettingsRowGroup>
                <SettingsRow
                  icon={{ ios: "key.fill", android: "vpn_key", web: "vpn_key" }}
                  title={t("pinLock.changePin")}
                  onPress={() => openVerify("change")}
                />
                <BiometricUnlockRow />
              </SettingsRowGroup>

              <View style={styles.timeoutSection}>
                <ThemedText type="small">{t("pinLock.lockTimeout")}</ThemedText>
                <SegmentedControl
                  accessibilityLabel={t("pinLock.lockTimeout")}
                  options={timeoutOptions}
                  value={String(lockTimeoutMs)}
                  onChange={(id) => setLockTimeoutMs(Number(id))}
                />
              </View>

              <SettingsRow
                icon={{ ios: "lock.open.fill", android: "lock_open", web: "lock_open" }}
                title={t("pinLock.turnOff")}
                subtitle={t("pinLock.turnOffHint")}
                showChevron={false}
                titleColor={tokens.status.danger.text}
                onPress={() => openVerify("disable")}
              />
            </View>
          )}
        </Card>

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.footer}>
          {t("pinLock.footer")}
        </ThemedText>
      </Stagger>

      <SetPinModal
        visible={showSetPinModal}
        onClose={() => {
          setShowSetPinModal(false);
          setPendingChangePin(null);
        }}
        onSetPin={async (pin) => {
          try {
            if (isPinEnabled && pendingChangePin !== null) {
              const ok = await setPin(pendingChangePin, pin);
              if (ok) {
                setShowSetPinModal(false);
                setPendingChangePin(null);
                toast.success(t("pinLock.toastChanged"));
              }
              return ok;
            }
            const ok = await enablePin(pin);
            if (ok) {
              setShowSetPinModal(false);
              setPendingChangePin(null);
              toast.success(t("pinLock.toastEnabled"));
            }
            return ok;
          } catch {
            return false;
          }
        }}
      />

      <VerifyPinModal
        visible={showVerifyPinModal}
        onClose={() => {
          setShowVerifyPinModal(false);
          setVerifyPinPurpose(null);
        }}
        title={verifyPinPurpose === "disable" ? t("pinLock.turnOff") : t("pinLock.enterPin")}
        subtitle={
          verifyPinPurpose === "change"
            ? t("pinLock.changePinVerifySubtitle")
            : t("pinLock.enterPinSubtitle")
        }
        onVerify={async (pin) => {
          if (verifyPinPurpose === "disable") {
            const ok = await disablePin(pin);
            if (ok) {
              setShowVerifyPinModal(false);
              setVerifyPinPurpose(null);
              setPendingChangePin(null);
              toast.success(t("pinLock.toastDisabled"));
            }
            return ok;
          }
          if (verifyPinPurpose === "change") {
            const ok = await unlock(pin);
            if (!ok) return false;
            setPendingChangePin(pin);
            setShowVerifyPinModal(false);
            setVerifyPinPurpose(null);
            setShowSetPinModal(true);
            return true;
          }
          return false;
        }}
      />
    </SettingsDetailScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  heroTitle: {
    textAlign: "center",
  },
  heroDesc: {
    textAlign: "center",
  },
  featureChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.two,
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  enabledSection: {
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  status: {
    alignSelf: "flex-start",
  },
  timeoutSection: {
    gap: Spacing.two,
  },
  footer: {
    textAlign: "center",
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/settings/app-lock");
