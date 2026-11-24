import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { PassphraseField } from "@/components/vault/passphrase-field";
import { PassphraseStrengthMeter } from "@/components/vault/passphrase-strength-meter";
import { RecoveryCodeDisplay } from "@/components/vault/recovery-code-display";
import { VaultSyncSheet } from "@/components/vault/vault-sync-sheet";
import { VaultUnlockSheet } from "@/components/vault/vault-unlock-sheet";
import { Spacing } from "@/constants/theme";
import { usePinLock } from "@/features/pin-lock";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { vaultErrorI18nKey } from "@/lib/vault/errors";
import { assessPassphrase } from "@/lib/vault/passphrase-strength";
import {
  changeVaultPassphrase,
  disableVaultSync,
  regenerateVaultRecoveryCode,
  verifyVaultPassphrase,
} from "@/lib/vault/vault";
import { useVaultLockActions, useVaultLockJournals } from "@/lib/vault/vault-lock";
import { useVaultStatus } from "@/lib/vault/vault-store";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";

import { SettingsRow, ToggleRow } from "../settings-rows";
import { ThisDeviceBadge } from "../this-device-badge";

/**
 * Privacy & security › Private journals › "Lock private journals" (§4.2 Lock).
 * Device-scoped; needs the app PIN, so it is disabled (with "Set up App lock
 * first") on web and while no PIN is set.
 */
export function VaultLockJournalsRow() {
  const { t } = useTranslation();
  const lockJournals = useVaultLockJournals();
  const { setLockJournals } = useVaultLockActions();
  const { isPinEnabled, hasStoredPin } = usePinLock();
  const pinReady = Platform.OS !== "web" && isPinEnabled && hasStoredPin;
  return (
    <ToggleRow
      icon={{ ios: "lock.doc.fill", android: "lock", web: "lock" }}
      title={t("vault.settings.lockJournals")}
      subtitle={t(pinReady ? "vault.settings.lockJournalsHint" : "vault.settings.lockNeedsPin")}
      accessory={<ThisDeviceBadge />}
      value={pinReady && lockJournals}
      disabled={!pinReady}
      onValueChange={(v) => void setLockJournals(v)}
    />
  );
}

/**
 * Encrypted sync (opt-in, §4.2): opens the opt-in / join sheet, or offers to
 * turn sync off. Hidden on TV (no passphrase entry) and for guests (nothing to
 * sync to). A vault locked on this device shows an Unlock row instead.
 */
export function VaultSyncRow() {
  const { t } = useTranslation();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const status = useVaultStatus();
  const [sheet, setSheet] = useState<"sync" | "unlock" | "off" | null>(null);
  if (isTV()) return null;

  const locked = status?.state === "locked";
  const rows = [];
  if (locked) {
    rows.push(
      <SettingsRow
        key="unlock"
        icon={{ ios: "lock.open.fill", android: "lock_open", web: "lock_open" }}
        title={t("vault.unlock.title")}
        subtitle={t("vault.errors.locked")}
        onPress={() => setSheet("unlock")}
      />,
    );
  }
  if (isAuthenticated && status?.state !== "unavailable") {
    const value = status?.syncEnabled ? t("common.on") : t("common.off");
    rows.push(
      <SettingsRow
        key="sync"
        icon={{ ios: "lock.icloud.fill", android: "cloud_sync", web: "cloud_sync" }}
        title={t("vault.settings.sync")}
        subtitle={
          status?.syncEnabled && status.heldDocs.length > 0
            ? t("vault.sync.paused")
            : t("vault.sync.howItWorks")
        }
        value={value}
        onPress={() => setSheet(status?.syncEnabled ? "off" : "sync")}
      />,
    );
  }
  if (rows.length === 0) return null;

  return (
    <View style={styles.block}>
      {rows}
      <VaultSyncSheet visible={sheet === "sync"} onClose={() => setSheet(null)} />
      <VaultUnlockSheet visible={sheet === "unlock"} onClose={() => setSheet(null)} />
      <Sheet visible={sheet === "off"} onClose={() => setSheet(null)} variant="bottom">
        <View style={styles.block}>
          <ThemedText type="subtitle">{t("vault.settings.sync")}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("settingsStep4.vault.turnOffBody")}
          </ThemedText>
          <Button
            label={t("settingsStep4.vault.turnOff")}
            variant="secondary"
            fullWidth
            onPress={() => {
              setSheet(null);
              void disableVaultSync().then(() => toast.success(t("settingsPanel.done")));
            }}
          />
          <Button
            label={t("common.cancel")}
            variant="ghost"
            fullWidth
            onPress={() => setSheet(null)}
          />
        </View>
      </Sheet>
    </View>
  );
}

type CredentialSheet = "passphrase" | "recovery" | null;

/**
 * Change passphrase + new recovery code. Only once a passphrase exists
 * (`hasKeyring`); hidden on TV. The current passphrase is checked first, and a
 * new recovery code is shown exactly once.
 */
export function VaultCredentialsRows() {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const toast = useToast();
  const status = useVaultStatus();
  const [sheet, setSheet] = useState<CredentialSheet>(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [words, setWords] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isTV() || !status?.hasKeyring || status.state !== "ready") return null;

  const close = () => {
    setSheet(null);
    setCurrent("");
    setNext("");
    setWords(null);
    setError(null);
    setBusy(false);
  };

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

  const changePassphrase = () =>
    run(async () => {
      if (!(await verifyVaultPassphrase(current))) {
        setError(t("vault.errors.wrongPassphrase"));
        return;
      }
      await changeVaultPassphrase(next);
      close();
      toast.success(t("settingsStep4.vault.passphraseChanged"));
    });

  const newRecoveryCode = () =>
    run(async () => {
      const result = await regenerateVaultRecoveryCode();
      setWords(result.recoveryWords);
    });

  return (
    <View style={styles.block}>
      <SettingsRow
        icon={{ ios: "key.fill", android: "vpn_key", web: "vpn_key" }}
        title={t("vault.settings.changePassphrase")}
        onPress={() => setSheet("passphrase")}
      />
      <SettingsRow
        icon={{ ios: "list.number", android: "format_list_numbered", web: "format_list_numbered" }}
        title={t("vault.settings.newRecoveryCode")}
        subtitle={t("vault.settings.newRecoveryCodeHint")}
        onPress={() => setSheet("recovery")}
      />
      <Sheet visible={sheet != null} onClose={busy ? () => {} : close} variant="bottom" solid>
        {sheet === "passphrase" ? (
          <View style={styles.block}>
            <ThemedText type="subtitle">{t("vault.settings.changePassphrase")}</ThemedText>
            <PassphraseField
              label={t("vault.passphrase.label")}
              value={current}
              onChangeText={setCurrent}
              purpose="password"
            />
            <PassphraseField
              label={t("vault.passphrase.newLabel")}
              value={next}
              onChangeText={setNext}
              purpose="newPassword"
            />
            <PassphraseStrengthMeter passphrase={next} />
            {error ? (
              <ThemedText type="caption" style={{ color: tokens.status.danger.text }}>
                {error}
              </ThemedText>
            ) : null}
            <Button
              label={t("vault.unlock.savePassphrase")}
              fullWidth
              disabled={busy || current.length === 0 || !assessPassphrase(next).meetsMinimum}
              onPress={() => void changePassphrase()}
            />
          </View>
        ) : sheet === "recovery" ? (
          <View style={styles.block}>
            <ThemedText type="subtitle">{t("vault.settings.newRecoveryCode")}</ThemedText>
            {words ? (
              <RecoveryCodeDisplay words={words} onConfirmed={close} />
            ) : (
              <>
                <ThemedText type="small" themeColor="mutedForeground">
                  {t("vault.settings.newRecoveryCodeHint")}
                </ThemedText>
                {error ? (
                  <ThemedText type="caption" style={{ color: tokens.status.danger.text }}>
                    {error}
                  </ThemedText>
                ) : null}
                <Button
                  label={t("vault.sync.continue")}
                  fullWidth
                  disabled={busy}
                  onPress={() => void newRecoveryCode()}
                />
              </>
            )}
          </View>
        ) : null}
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.two },
});
