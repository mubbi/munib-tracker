import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Sheet } from "@/components/ui/sheet";
import { vaultErrorI18nKey } from "@/lib/vault/errors";
import { isRecoveryCodeWellFormed } from "@/lib/vault/keyring";
import {
  changeVaultPassphrase,
  resetVaultOnDevice,
  retryVaultKeyAccess,
  unlockVault,
} from "@/lib/vault/vault";
import { useVaultStatus } from "@/lib/vault/vault-store";

import { canSubmitNewPassphrase, NewPassphraseFields } from "./new-passphrase-fields";
import { PassphraseField } from "./passphrase-field";
import { RecoveryCodeEntry } from "./recovery-code-entry";

type Mode = "passphrase" | "recovery" | "newPassphrase";

type VaultUnlockSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** Turn sync on as part of the unlock (joining another device's synced vault). */
  enableSync?: boolean;
  onUnlocked?: () => void;
};

/**
 * New-device / locked-vault unlock: the sync passphrase (or the 24-word code)
 * unwraps the data key, then local documents are re-encrypted and merged.
 * After a recovery-code unlock the user is offered a new passphrase. When no
 * keyring exists at all, the only way forward is "start fresh on this device".
 */
export function VaultUnlockSheet({
  visible,
  onClose,
  enableSync,
  onUnlocked,
}: VaultUnlockSheetProps) {
  const { t } = useTranslation();
  const status = useVaultStatus();
  const [mode, setMode] = useState<Mode>("passphrase");
  const [passphrase, setPassphrase] = useState("");
  const [code, setCode] = useState("");
  const [newPassphrase, setNewPassphrase] = useState("");
  const [newConfirm, setNewConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!visible) {
      setMode("passphrase");
      setPassphrase("");
      setCode("");
      setNewPassphrase("");
      setNewConfirm("");
      setError(null);
      setBusy(false);
    }
  }, [visible]);

  const canUnlock = status?.canUnlock !== false;
  const keyUnavailable = status?.lockReason === "key-unavailable";

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

  const finish = () => {
    onUnlocked?.();
    onClose();
  };

  const submit = () => {
    if (busy) return;
    if (mode === "passphrase") {
      if (!passphrase) return;
      void run(async () => {
        await unlockVault({ passphrase }, { enableSync });
        finish();
      });
    } else if (mode === "recovery") {
      if (!isRecoveryCodeWellFormed(code)) return;
      void run(async () => {
        await unlockVault({ recoveryCode: code }, { enableSync });
        setMode("newPassphrase");
      });
    } else {
      if (!canSubmitNewPassphrase(newPassphrase, newConfirm)) return;
      void run(async () => {
        await changeVaultPassphrase(newPassphrase);
        finish();
      });
    }
  };

  // Busy is shown by the button's spinner (it ignores presses while loading).
  const submitDisabled =
    (mode === "passphrase" && passphrase.length === 0) ||
    (mode === "recovery" && !isRecoveryCodeWellFormed(code)) ||
    (mode === "newPassphrase" && !canSubmitNewPassphrase(newPassphrase, newConfirm));

  return (
    <>
      <Sheet
        accessibilityLabel={
          mode === "newPassphrase" ? t("vault.unlock.newPassphraseTitle") : t("vault.unlock.title")
        }
        visible={visible}
        onClose={busy ? () => {} : onClose}
        variant="bottom"
        solid
      >
        <ThemedText type="subtitle" heading={2}>
          {mode === "newPassphrase"
            ? t("vault.unlock.newPassphraseTitle")
            : t("vault.unlock.title")}
        </ThemedText>

        {keyUnavailable ? (
          // M5: a locked Keychain is transient. Offer a retry, never "Start fresh".
          <>
            <ThemedText type="small" themeColor="mutedForeground">
              {t("vault.unlock.keyUnavailable")}
            </ThemedText>
            <Button
              label={t("vault.unlock.tryAgain")}
              variant="secondary"
              fullWidth
              onPress={retryVaultKeyAccess}
            />
          </>
        ) : !canUnlock ? (
          <>
            <ThemedText type="small" themeColor="mutedForeground">
              {t("vault.unlock.noKeyring")}
            </ThemedText>
            <Button
              label={t("vault.unlock.startFresh")}
              variant="secondary"
              fullWidth
              onPress={() => setConfirmReset(true)}
            />
          </>
        ) : (
          <>
            <ThemedText type="small" themeColor="mutedForeground">
              {mode === "passphrase"
                ? t(enableSync ? "vault.unlock.bodyJoin" : "vault.unlock.body")
                : mode === "recovery"
                  ? t("vault.unlock.recoveryBody")
                  : t("vault.unlock.newPassphraseBody")}
            </ThemedText>

            {mode === "passphrase" ? (
              <PassphraseField
                label={t("vault.passphrase.label")}
                value={passphrase}
                onChangeText={setPassphrase}
                autoFocus
                onSubmitEditing={submit}
              />
            ) : mode === "recovery" ? (
              <RecoveryCodeEntry value={code} onChangeText={setCode} />
            ) : (
              <NewPassphraseFields
                label={t("vault.passphrase.newLabel")}
                value={newPassphrase}
                onChangeText={setNewPassphrase}
                confirm={newConfirm}
                onChangeConfirm={setNewConfirm}
                autoFocus
                onSubmitEditing={submit}
              />
            )}

            {error ? <Callout tone="danger">{error}</Callout> : null}
            {busy ? (
              <ThemedText
                type="caption"
                themeColor="mutedForeground"
                accessibilityLiveRegion="polite"
              >
                {t("vault.unlock.working")}
              </ThemedText>
            ) : null}

            <Button
              label={
                mode === "newPassphrase"
                  ? t("vault.unlock.savePassphrase")
                  : t("vault.unlock.unlock")
              }
              fullWidth
              loading={busy}
              disabled={submitDisabled}
              onPress={submit}
            />
            {mode === "passphrase" ? (
              <Button
                label={t("vault.unlock.useRecoveryCode")}
                variant="ghost"
                fullWidth
                disabled={busy}
                onPress={() => {
                  setError(null);
                  setMode("recovery");
                }}
              />
            ) : mode === "recovery" ? (
              <Button
                label={t("vault.unlock.usePassphrase")}
                variant="ghost"
                fullWidth
                disabled={busy}
                onPress={() => {
                  setError(null);
                  setMode("passphrase");
                }}
              />
            ) : (
              <Button label={t("vault.unlock.skip")} variant="ghost" fullWidth onPress={finish} />
            )}
            {mode !== "newPassphrase" ? (
              <Button
                label={t("vault.unlock.forgotBoth")}
                variant="ghost"
                size="sm"
                disabled={busy}
                onPress={() => setConfirmReset(true)}
              />
            ) : null}
          </>
        )}
      </Sheet>
      <ConfirmDialog
        visible={confirmReset}
        title={t("vault.unlock.startFreshTitle")}
        message={t("vault.unlock.startFreshBody")}
        confirmLabel={t("vault.unlock.startFresh")}
        destructive
        onConfirm={() => {
          void run(async () => {
            await resetVaultOnDevice();
            finish();
          });
        }}
        onClose={() => setConfirmReset(false)}
      />
    </>
  );
}
