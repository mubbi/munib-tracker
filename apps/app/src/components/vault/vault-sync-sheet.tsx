import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { vaultErrorI18nKey } from "@/lib/vault/errors";
import { assessPassphrase } from "@/lib/vault/passphrase-strength";
import { resumeVaultSync, setUpVaultSync } from "@/lib/vault/vault";
import { useVaultStatus } from "@/lib/vault/vault-store";

import { PassphraseField } from "./passphrase-field";
import { PassphraseStrengthMeter } from "./passphrase-strength-meter";
import { RecoveryCodeDisplay } from "./recovery-code-display";
import { VaultUnlockSheet } from "./vault-unlock-sheet";

type Step = "intro" | "passphrase" | "recovery";

type VaultSyncSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** Sync is on (after the recovery code was confirmed, or after joining / resuming). */
  onEnabled?: () => void;
};

/**
 * Opt-in to end-to-end-encrypted sync for private journals (plan §4.2, D2):
 * plain-language explanation → passphrase (min 10, strength meter, confirm) →
 * the 24-word recovery code, shown once. When another device already synced a
 * vault for this account, the sheet becomes "enter that passphrase" instead.
 * Hidden on TV (no text entry; vault sync is phone/web only).
 */
export function VaultSyncSheet({ visible, onClose, onEnabled }: VaultSyncSheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const status = useVaultStatus();
  const [step, setStep] = useState<Step>("intro");
  const [passphrase, setPassphrase] = useState("");
  const [confirm, setConfirm] = useState("");
  const [words, setWords] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setStep("intro");
      setPassphrase("");
      setConfirm("");
      setWords(null);
      setError(null);
      setBusy(false);
    }
  }, [visible]);

  if (isTV()) return null;

  if (status?.syncAvailableFromOtherDevice || status?.state === "locked") {
    return (
      <VaultUnlockSheet visible={visible} onClose={onClose} enableSync onUnlocked={onEnabled} />
    );
  }

  const canResume = status?.hasKeyring === true && !status.syncEnabled;
  const assessment = assessPassphrase(passphrase);
  const mismatch = confirm.length > 0 && confirm !== passphrase;
  const canSubmit = assessment.meetsMinimum && confirm === passphrase && !busy;

  const run = async (task: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await task();
    } catch (e) {
      setError(t(vaultErrorI18nKey(e)));
    } finally {
      setBusy(false);
    }
  };

  const submit = () => {
    if (!canSubmit) return;
    void run(async () => {
      const result = await setUpVaultSync(passphrase);
      setPassphrase("");
      setConfirm("");
      setWords(result.recoveryWords);
      setStep("recovery");
    });
  };

  const close = () => {
    // Closing on the recovery step means the code was shown; sync is already on.
    if (step === "recovery") onEnabled?.();
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={busy ? () => {} : close} variant="bottom" solid>
      {step === "intro" ? (
        <>
          <ThemedText type="subtitle" heading={2}>
            {t("vault.sync.title")}
          </ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("vault.sync.body")}
          </ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("vault.sync.howItWorks")}
          </ThemedText>
          <View
            style={[
              styles.warning,
              {
                backgroundColor: tokens.status.warning.soft,
                borderColor: tokens.status.warning.border,
              },
            ]}
            accessibilityRole="alert"
          >
            <ThemedText type="smallBold" style={{ color: tokens.status.warning.text }}>
              {t("vault.sync.warningTitle")}
            </ThemedText>
            <ThemedText type="small" style={{ color: colors.foreground }}>
              {t("vault.sync.warningBody")}
            </ThemedText>
          </View>
          {error ? (
            <ThemedText
              type="small"
              accessibilityRole="alert"
              style={{ color: tokens.status.danger.text }}
            >
              {error}
            </ThemedText>
          ) : null}
          {canResume ? (
            <Button
              label={t("vault.sync.resume")}
              fullWidth
              disabled={busy}
              onPress={() =>
                void run(async () => {
                  await resumeVaultSync();
                  onEnabled?.();
                  onClose();
                })
              }
            />
          ) : (
            <Button
              label={t("vault.sync.continue")}
              fullWidth
              onPress={() => setStep("passphrase")}
            />
          )}
          <Button label={t("vault.sync.notNow")} variant="ghost" fullWidth onPress={onClose} />
        </>
      ) : step === "passphrase" ? (
        <>
          <ThemedText type="subtitle" heading={2}>
            {t("vault.passphrase.title")}
          </ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("vault.passphrase.body", { min: 10 })}
          </ThemedText>
          <PassphraseField
            label={t("vault.passphrase.label")}
            value={passphrase}
            onChangeText={setPassphrase}
            purpose="newPassword"
            autoFocus
          />
          <PassphraseStrengthMeter passphrase={passphrase} />
          <PassphraseField
            label={t("vault.passphrase.confirmLabel")}
            value={confirm}
            onChangeText={setConfirm}
            purpose="newPassword"
            onSubmitEditing={submit}
          />
          {mismatch ? (
            <ThemedText type="caption" style={{ color: tokens.status.danger.text }}>
              {t("vault.passphrase.mismatch")}
            </ThemedText>
          ) : null}
          {error ? (
            <ThemedText
              type="small"
              accessibilityRole="alert"
              style={{ color: tokens.status.danger.text }}
            >
              {error}
            </ThemedText>
          ) : null}
          {busy ? (
            <View style={styles.busy} accessibilityLiveRegion="polite">
              <ActivityIndicator />
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("vault.passphrase.working")}
              </ThemedText>
            </View>
          ) : null}
          <Button
            label={t("vault.passphrase.submit")}
            fullWidth
            disabled={!canSubmit}
            onPress={submit}
          />
          <Button
            label={t("common.back")}
            variant="ghost"
            fullWidth
            disabled={busy}
            onPress={() => setStep("intro")}
          />
        </>
      ) : words ? (
        <RecoveryCodeDisplay
          words={words}
          onConfirmed={() => {
            setWords(null);
            onEnabled?.();
            onClose();
          }}
        />
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  warning: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  busy: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
});
