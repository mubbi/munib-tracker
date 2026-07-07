import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { SetPinModal } from "@/features/pin-lock/components/set-pin-modal";
import { VerifyPinModal } from "@/features/pin-lock/components/verify-pin-modal";
import { LOCK_TIMEOUT_OPTIONS, usePinLock } from "@/features/pin-lock/providers/pin-lock-provider";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";
import { goBackOrReplace } from "@/lib/navigation";
import { isExpoGo } from "@/lib/notifications/platform";
import { useToast } from "@/providers/toast-provider";

export default function AppLockScreen() {
  const router = useRouter();
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

  if (!isNative) {
    return (
      <ScreenLayout
        eyebrow={t("settings.title")}
        title={t("pinLock.title")}
        subtitle={t("pinLock.webUnavailable")}
        onBack={() => goBackOrReplace(router, "/")}
      >
        <Seo path="/settings/app-lock" />
      </ScreenLayout>
    );
  }

  const openEnablePinModal = () => {
    triggerHaptic("selection");
    setPendingChangePin(null);
    setShowSetPinModal(true);
  };

  return (
    <ScreenLayout
      eyebrow={t("settings.title")}
      title={t("pinLock.title")}
      subtitle={t("pinLock.settingsSubtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/settings/app-lock" />
      <Stagger>
        {expoGo ? (
          <Card padding="three">
            <ThemedText type="small">{t("pinLock.expoGoTitle")}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.expoGoHint}>
              {t("pinLock.expoGoHint")}
            </ThemedText>
          </Card>
        ) : null}

        <Card padding="three">
          <SectionHeader
            title={t("pinLock.title")}
            icon={{ ios: "lock.fill", android: "lock", web: "lock" }}
          />

          {!isPinEnabled ? (
            <View style={styles.hero}>
              <View style={[styles.heroIcon, { backgroundColor: tokens.accentSoft }]}>
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
                <FeatureChip label={t("pinLock.heroFeaturePin")} />
                {biometricsAvailable ? (
                  <FeatureChip label={t("pinLock.heroFeatureBiometric")} />
                ) : null}
                <FeatureChip label={t("pinLock.heroFeatureAutoLock")} />
              </View>
              {!expoGo ? (
                <PressableScale
                  haptic="light"
                  onPress={openEnablePinModal}
                  style={[styles.enableBtn, { backgroundColor: colors.accent }]}
                >
                  <ThemedText type="small" style={{ color: colors.accentForeground }}>
                    {t("pinLock.enablePin")}
                  </ThemedText>
                </PressableScale>
              ) : null}
            </View>
          ) : (
            <View style={styles.enabledSection}>
              <View style={[styles.statusBadge, { backgroundColor: tokens.status.success.soft }]}>
                <SymbolView
                  name={{
                    ios: "checkmark.shield.fill",
                    android: "verified_user",
                    web: "verified_user",
                  }}
                  size={18}
                  tintColor={tokens.status.success.color}
                />
                <ThemedText type="caption" style={{ color: tokens.status.success.text }}>
                  {t("pinLock.statusProtected")}
                </ThemedText>
              </View>

              <PressableScale
                haptic="light"
                onPress={() => {
                  triggerHaptic("selection");
                  setPendingChangePin(null);
                  setVerifyPinPurpose("change");
                  setShowVerifyPinModal(true);
                }}
                style={[styles.actionRow, { backgroundColor: colors.muted }]}
              >
                <SymbolView
                  name={{ ios: "key.fill", android: "vpn_key", web: "vpn_key" }}
                  size={18}
                  tintColor={colors.accent}
                />
                <ThemedText type="small" style={styles.actionLabel}>
                  {t("pinLock.changePin")}
                </ThemedText>
                <SymbolView
                  name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
                  size={14}
                  tintColor={colors.mutedForeground}
                />
              </PressableScale>

              <View style={styles.timeoutSection}>
                <ThemedText type="small">{t("pinLock.lockTimeout")}</ThemedText>
                <View style={styles.timeoutBtns}>
                  {LOCK_TIMEOUT_OPTIONS.map((opt) => {
                    const selected = lockTimeoutMs === opt.value;
                    return (
                      <PressableScale
                        key={opt.value}
                        haptic="selection"
                        onPress={() => setLockTimeoutMs(opt.value)}
                        style={[
                          styles.timeoutBtn,
                          {
                            backgroundColor: selected ? tokens.accentSoft : colors.muted,
                            borderColor: selected ? colors.accent : colors.border,
                          },
                        ]}
                      >
                        <ThemedText
                          type="caption"
                          style={{ color: selected ? colors.accent : colors.mutedForeground }}
                          numberOfLines={2}
                        >
                          {t(opt.labelKey)}
                        </ThemedText>
                      </PressableScale>
                    );
                  })}
                </View>
              </View>

              <PressableScale
                haptic="light"
                onPress={() => {
                  triggerHaptic("selection");
                  setVerifyPinPurpose("disable");
                  setShowVerifyPinModal(true);
                }}
                style={[styles.actionRow, { backgroundColor: tokens.status.danger.soft }]}
              >
                <SymbolView
                  name={{ ios: "lock.open.fill", android: "lock_open", web: "lock_open" }}
                  size={18}
                  tintColor={tokens.status.danger.color}
                />
                <ThemedText
                  type="small"
                  style={[styles.actionLabel, { color: tokens.status.danger.text }]}
                >
                  {t("pinLock.disablePin")}
                </ThemedText>
              </PressableScale>
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
                toast.success(t("pinLock.changePin"), t("pinLock.pinSaved"));
              }
              return ok;
            }
            const ok = await enablePin(pin);
            if (ok) {
              setShowSetPinModal(false);
              setPendingChangePin(null);
              toast.success(t("pinLock.enablePin"), t("pinLock.pinSaved"));
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
        title={verifyPinPurpose === "disable" ? t("pinLock.disablePin") : t("pinLock.enterPin")}
        subtitle={t("pinLock.enterPinSubtitle")}
        onVerify={async (pin) => {
          if (verifyPinPurpose === "disable") {
            const ok = await disablePin(pin);
            if (ok) {
              setShowVerifyPinModal(false);
              setVerifyPinPurpose(null);
              setPendingChangePin(null);
              toast.success(t("pinLock.disablePin"));
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
    </ScreenLayout>
  );
}

function FeatureChip({ label }: { label: string }) {
  const { colors, tokens } = useThemeTokens();
  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: tokens.accentSoft, borderColor: tokens.accentBorder },
      ]}
    >
      <ThemedText type="caption" style={{ color: colors.accent }}>
        {label}
      </ThemedText>
    </View>
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
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  enableBtn: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    minWidth: 200,
    alignItems: "center",
  },
  enabledSection: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    minHeight: 52,
  },
  actionLabel: {
    flex: 1,
  },
  timeoutSection: {
    gap: Spacing.two,
    padding: Spacing.three,
  },
  timeoutBtns: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  timeoutBtn: {
    flex: 1,
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
  },
  expoGoHint: {
    marginTop: Spacing.two,
  },
  footer: {
    textAlign: "center",
  },
});
