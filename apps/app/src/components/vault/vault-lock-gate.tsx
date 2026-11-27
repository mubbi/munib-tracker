import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";
import { VerifyPinModal } from "@/features/pin-lock/components/verify-pin-modal";
import { usePinLock } from "@/features/pin-lock/providers/pin-lock-provider";
import {
  isVaultSessionUnlocked,
  markVaultUnlocked,
  shouldPromptVaultUnlock,
  useVaultLockJournals,
  useVaultLockPrefReady,
} from "@/lib/vault/vault-lock";

/**
 * `requireVaultUnlock()` for vault screens (plan §4.2 Lock). When "Lock private
 * journals" is on and the app PIN is set, it asks for the PIN (biometrics
 * first, when enrolled) and resolves `true` once verified; otherwise it
 * resolves `true` immediately. Render `unlockPrompt` somewhere in the screen.
 */
export function useRequireVaultUnlock(): {
  requireVaultUnlock: () => Promise<boolean>;
  unlockPrompt: ReactNode;
  /** Both the "Lock private journals" pref and the app PIN state have loaded. */
  ready: boolean;
} {
  const { t } = useTranslation();
  const lockJournals = useVaultLockJournals();
  const prefReady = useVaultLockPrefReady();
  const {
    isReady: pinReady,
    isPinEnabled,
    hasStoredPin,
    biometricsAvailable,
    unlock,
    unlockWithBiometrics,
  } = usePinLock();
  const [visible, setVisible] = useState(false);
  const pending = useRef<((ok: boolean) => void) | null>(null);

  const settle = useCallback((ok: boolean) => {
    if (ok) markVaultUnlocked();
    pending.current?.(ok);
    pending.current = null;
    setVisible(false);
  }, []);

  const requireVaultUnlock = useCallback(async (): Promise<boolean> => {
    const prompt = shouldPromptVaultUnlock({
      lockJournals,
      pinEnabled: isPinEnabled && hasStoredPin,
      sessionUnlocked: isVaultSessionUnlocked(),
    });
    if (!prompt) return true;
    if (biometricsAvailable && (await unlockWithBiometrics().catch(() => false))) {
      markVaultUnlocked();
      return true;
    }
    pending.current?.(false);
    return new Promise<boolean>((resolve) => {
      pending.current = resolve;
      setVisible(true);
    });
  }, [lockJournals, isPinEnabled, hasStoredPin, biometricsAvailable, unlockWithBiometrics]);

  const unlockPrompt = (
    <VerifyPinModal
      visible={visible}
      title={t("vault.lock.title")}
      subtitle={t("vault.lock.subtitle")}
      onClose={() => settle(false)}
      onVerify={async (pin) => {
        const ok = await unlock(pin);
        if (ok) settle(true);
        return ok;
      }}
    />
  );

  return { requireVaultUnlock, unlockPrompt, ready: prefReady && pinReady };
}

/**
 * Wraps a vault screen's content: renders children only after
 * `requireVaultUnlock()` succeeds, with a retry state if the user cancels.
 *
 * The decision waits until the lock pref and the PIN state have loaded (so the
 * content never flashes before a lock that is still loading), and runs once per
 * mount: later identity changes of the PIN callbacks must not unmount an open
 * screen mid-edit.
 */
export function VaultLockGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { requireVaultUnlock, unlockPrompt, ready } = useRequireVaultUnlock();
  const [state, setState] = useState<"checking" | "open" | "locked">("checking");
  const requireRef = useRef(requireVaultUnlock);
  requireRef.current = requireVaultUnlock;
  const started = useRef(false);

  const check = useCallback(() => {
    setState("checking");
    void requireRef.current().then((ok) => setState(ok ? "open" : "locked"));
  }, []);

  useEffect(() => {
    if (!ready || started.current) return;
    started.current = true;
    check();
  }, [ready, check]);

  if (state === "open") return <>{children}</>;
  return (
    <View style={styles.locked}>
      {state === "locked" ? (
        <>
          <ThemedText type="subtitle" heading={2} style={styles.center}>
            {t("vault.lock.lockedTitle")}
          </ThemedText>
          <ThemedText type="small" themeColor="mutedForeground" style={styles.center}>
            {t("vault.lock.lockedBody")}
          </ThemedText>
          <Button label={t("vault.lock.unlock")} onPress={check} preferredFocus />
        </>
      ) : null}
      {unlockPrompt}
    </View>
  );
}

const styles = StyleSheet.create({
  locked: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    padding: Spacing.four,
  },
  center: { textAlign: "center" },
});
