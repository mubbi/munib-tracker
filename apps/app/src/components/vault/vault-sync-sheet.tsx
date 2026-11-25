import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Sheet } from "@/components/ui/sheet";
import { isTV } from "@/lib/platform/is-tv";
import { vaultErrorI18nKey } from "@/lib/vault/errors";
import { VAULT_MIN_PASSPHRASE_LENGTH } from "@/lib/vault/keyring";
import { resumeVaultSync, setUpVaultSync } from "@/lib/vault/vault";
import { useVaultStatus } from "@/lib/vault/vault-store";

import { canSubmitNewPassphrase, NewPassphraseFields } from "./new-passphrase-fields";
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
  const status = useVaultStatus();
  const [step, setStep] = useState<Step>("intro");
  const [passphrase, setPassphrase] = useState("");
  const [confirm, setConfirm] = useState("");
  const [words, setWords] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissBlocked, setDismissBlocked] = useState(false);

  useEffect(() => {
    if (!visible) {
      setStep("intro");
      setPassphrase("");
      setConfirm("");
      setWords(null);
      setError(null);
      setBusy(false);
      setDismissBlocked(false);
    }
  }, [visible]);

  if (isTV()) return null;

  if (status?.syncAvailableFromOtherDevice || status?.state === "locked") {
    return (
      <VaultUnlockSheet visible={visible} onClose={onClose} enableSync onUnlocked={onEnabled} />
    );
  }

  const canResume = status?.hasKeyring === true && !status.syncEnabled;
  const canSubmit = canSubmitNewPassphrase(passphrase, confirm) && !busy;

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
    if (busy) return;
    // S-01: the one-time recovery code is on screen — closing would discard it
    // before it is saved. Only "Done" (after ticking "I've saved it") closes.
    if (step === "recovery" && words) {
      setDismissBlocked(true);
      return;
    }
    // Closing on the recovery step means the code was shown; sync is already on.
    if (step === "recovery") onEnabled?.();
    onClose();
  };

  return (
    <Sheet
      accessibilityLabel={t("vault.sync.title")}
      visible={visible}
      onClose={close}
      variant="bottom"
      solid
    >
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
          <Callout tone="warning" title={t("vault.sync.warningTitle")}>
            {t("vault.sync.warningBody")}
          </Callout>
          {error ? <Callout tone="danger">{error}</Callout> : null}
          {canResume ? (
            <Button
              label={t("vault.sync.resume")}
              fullWidth
              loading={busy}
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
            {t("vault.passphrase.body", { min: VAULT_MIN_PASSPHRASE_LENGTH })}
          </ThemedText>
          <NewPassphraseFields
            value={passphrase}
            onChangeText={setPassphrase}
            confirm={confirm}
            onChangeConfirm={setConfirm}
            autoFocus
            onSubmitEditing={submit}
          />
          {error ? <Callout tone="danger">{error}</Callout> : null}
          {busy ? (
            <ThemedText
              type="caption"
              themeColor="mutedForeground"
              accessibilityLiveRegion="polite"
            >
              {t("vault.passphrase.working")}
            </ThemedText>
          ) : null}
          <Button
            label={t("vault.passphrase.submit")}
            fullWidth
            loading={busy}
            disabled={!canSubmitNewPassphrase(passphrase, confirm)}
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
          dismissBlocked={dismissBlocked}
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
