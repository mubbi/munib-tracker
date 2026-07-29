import * as LocalAuthentication from "expo-local-authentication";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { AppState, type AppStateStatus, Platform } from "react-native";

import {
  type BiometricUnlockLabelKey,
  resolveBiometricUnlockLabelKey,
} from "@/features/pin-lock/lib/biometric-unlock-label";
import { hashPin, normalizePin, verifyPinHash } from "@/features/pin-lock/lib/pin-crypto";
import {
  shouldLockOnForeground,
  shouldRecordBackgroundTransition,
} from "@/features/pin-lock/lib/pin-lock-app-state";
import { shouldDeferActionsUntilPinUnlock } from "@/features/pin-lock/lib/pin-lock-defer-actions";
import {
  clearPinLockStorage,
  LOCK_TIMEOUT_STORAGE_KEY,
  PIN_ENABLED_KEY,
  PIN_FAILED_ATTEMPTS_KEY,
  PIN_LOCKOUT_UNTIL_KEY,
  PIN_STORE_KEY,
} from "@/features/pin-lock/lib/pin-lock-storage";
import {
  attemptsRemainingBeforeLockout,
  computeLockoutAfterFailure,
} from "@/features/pin-lock/lib/pin-lockout";
import { isExpoGo } from "@/lib/notifications/platform";
import { isTV } from "@/lib/platform/is-tv";
import { deleteSecureItem, getSecureItem, setSecureItem } from "@/lib/storage/safe-secure-store";

/** Lock after this many ms in background (0 = lock immediately). */
export const LOCK_TIMEOUT_OPTIONS = [
  { value: 0, labelKey: "pinLock.immediately" },
  { value: 60_000, labelKey: "pinLock.after1Min" },
  { value: 300_000, labelKey: "pinLock.after5Min" },
] as const;

async function getStoredPinHash(): Promise<string | null> {
  if (Platform.OS === "web") return null;
  return getSecureItem(PIN_STORE_KEY);
}

async function setStoredPinHash(hash: string | null): Promise<boolean> {
  if (Platform.OS === "web") return false;
  if (hash) return setSecureItem(PIN_STORE_KEY, hash);
  await deleteSecureItem(PIN_STORE_KEY);
  return true;
}

async function getPinEnabled(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const v = await getSecureItem(PIN_ENABLED_KEY);
  return v === "1";
}

async function setPinEnabled(enabled: boolean): Promise<boolean> {
  if (Platform.OS === "web") return false;
  return setSecureItem(PIN_ENABLED_KEY, enabled ? "1" : "0");
}

async function getLockoutUntil(): Promise<number | null> {
  if (Platform.OS === "web") return null;
  const v = await getSecureItem(PIN_LOCKOUT_UNTIL_KEY);
  if (v == null) return null;
  const ts = Number.parseInt(v, 10);
  return Number.isNaN(ts) ? null : ts;
}

async function persistLockoutUntil(ts: number | null): Promise<void> {
  if (Platform.OS === "web") return;
  if (ts != null) await setSecureItem(PIN_LOCKOUT_UNTIL_KEY, String(ts));
  else await deleteSecureItem(PIN_LOCKOUT_UNTIL_KEY);
}

async function getFailedAttempts(): Promise<number> {
  if (Platform.OS === "web") return 0;
  const v = await getSecureItem(PIN_FAILED_ATTEMPTS_KEY);
  if (v == null) return 0;
  const n = Number.parseInt(v, 10);
  return Number.isNaN(n) || n < 0 ? 0 : n;
}

async function setFailedAttempts(n: number): Promise<void> {
  if (Platform.OS === "web") return;
  if (n > 0) await setSecureItem(PIN_FAILED_ATTEMPTS_KEY, String(n));
  else await deleteSecureItem(PIN_FAILED_ATTEMPTS_KEY);
}

export interface PinLockContextValue {
  isPinEnabled: boolean;
  hasStoredPin: boolean;
  isLocked: boolean;
  isReady: boolean;
  pinSetupRequired: boolean;
  deferActionsUntilPinUnlock: boolean;
  unlockError: string | null;
  unlockErrorParams: Record<string, number> | null;
  biometricsAvailable: boolean;
  biometricUnlockLabelKey: BiometricUnlockLabelKey;
  isLockedOut: boolean;
  lockoutRemainingMs: number;
  clearUnlockError: () => void;
  lockTimeoutMs: number;
  setLockTimeoutMs: (ms: number) => void;
  enablePin: (pin: string) => Promise<boolean>;
  disablePin: (currentPin: string) => Promise<boolean>;
  setPin: (currentPin: string, newPin: string) => Promise<boolean>;
  unlock: (pin: string) => Promise<boolean>;
  unlockWithBiometrics: () => Promise<boolean>;
  lock: () => void;
  factoryResetPinLock: () => Promise<void>;
}

const PinLockContext = createContext<PinLockContextValue | null>(null);

export function PinLockProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [isPinEnabled, setIsPinEnabled] = useState(false);
  const [hasStoredPin, setHasStoredPin] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlockErrorParams, setUnlockErrorParams] = useState<Record<string, number> | null>(null);
  const [lockTimeoutMs, setLockTimeoutMsState] = useState(0);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [biometricUnlockLabelKey, setBiometricUnlockLabelKey] = useState<BiometricUnlockLabelKey>(
    "pinLock.unlockWithBiometrics",
  );
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutRemainingMs, setLockoutRemainingMs] = useState(0);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const backgroundedAtRef = useRef<number | null>(null);
  const wasBackgroundedRef = useRef(false);
  const biometricAuthInProgressRef = useRef(false);

  const clearUnlockError = useCallback(() => {
    setUnlockError(null);
    setUnlockErrorParams(null);
  }, []);

  const setLockTimeoutMs = useCallback((ms: number) => {
    setLockTimeoutMsState(ms);
    if (Platform.OS !== "web") {
      setSecureItem(LOCK_TIMEOUT_STORAGE_KEY, String(ms)).catch(() => {});
    }
  }, []);

  const lock = useCallback(() => {
    setIsLocked(true);
  }, []);

  const resetPinLockState = useCallback(() => {
    setUnlockError(null);
    setUnlockErrorParams(null);
    setLockoutUntil(null);
    setLockoutRemainingMs(0);
    setIsPinEnabled(false);
    setHasStoredPin(false);
    setIsLocked(false);
    setLockTimeoutMsState(0);
  }, []);

  const factoryResetPinLock = useCallback(async () => {
    resetPinLockState();
    await clearPinLockStorage();
  }, [resetPinLockState]);

  const unlock = useCallback(
    async (pin: string): Promise<boolean> => {
      const now = Date.now();
      const until = lockoutUntil ?? (await getLockoutUntil());
      if (until != null && now < until) {
        setUnlockError("pinLock.lockedOut");
        return false;
      }
      const stored = await getStoredPinHash();
      if (!stored) {
        if (isPinEnabled) return false;
        await setFailedAttempts(0);
        await persistLockoutUntil(null);
        setLockoutUntil(null);
        setLockoutRemainingMs(0);
        setIsLocked(false);
        return true;
      }
      if (await verifyPinHash(pin, stored)) {
        setUnlockError(null);
        setUnlockErrorParams(null);
        await setFailedAttempts(0);
        await persistLockoutUntil(null);
        setLockoutUntil(null);
        setLockoutRemainingMs(0);
        setIsLocked(false);
        return true;
      }
      const attempts = (await getFailedAttempts()) + 1;
      await setFailedAttempts(attempts);
      const lockout = computeLockoutAfterFailure(attempts, now);
      if (lockout) {
        await persistLockoutUntil(lockout.until);
        setLockoutUntil(lockout.until);
        setLockoutRemainingMs(lockout.durationMs);
        setUnlockErrorParams(null);
        setUnlockError("pinLock.lockedOut");
      } else {
        const remaining = attemptsRemainingBeforeLockout(attempts);
        if (remaining > 0) {
          setUnlockErrorParams({ count: remaining });
          setUnlockError("pinLock.wrongPinAttemptsRemaining");
        } else {
          setUnlockErrorParams(null);
          setUnlockError("pinLock.wrongPin");
        }
      }
      return false;
    },
    [lockoutUntil, isPinEnabled],
  );

  const unlockWithBiometrics = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === "web") return false;
    biometricAuthInProgressRef.current = true;
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        setUnlockError("pinLock.usePinToUnlock");
        return false;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t("pinLock.biometricUnlockPrompt"),
        fallbackLabel: Platform.OS === "ios" ? "" : "Use PIN",
        disableDeviceFallback: true,
      });
      if (result.success) {
        setUnlockError(null);
        setUnlockErrorParams(null);
        await setFailedAttempts(0);
        await persistLockoutUntil(null);
        setLockoutUntil(null);
        setLockoutRemainingMs(0);
        backgroundedAtRef.current = null;
        setIsLocked(false);
        return true;
      }
      setUnlockError("pinLock.usePinToUnlock");
      return false;
    } catch {
      setUnlockError("pinLock.usePinToUnlock");
      return false;
    } finally {
      biometricAuthInProgressRef.current = false;
    }
  }, [t]);

  const enablePin = useCallback(async (pin: string): Promise<boolean> => {
    if (Platform.OS === "web") return false;
    const digits = normalizePin(pin);
    if (!digits) return false;
    try {
      const hash = await hashPin(digits);
      const hashWritten = await setStoredPinHash(hash);
      if (!hashWritten) return false;
      const enabledWritten = await setPinEnabled(true);
      if (!enabledWritten) {
        await setStoredPinHash(null).catch(() => {});
        return false;
      }
      setHasStoredPin(true);
      setIsPinEnabled(true);
      setIsLocked(false);
      return true;
    } catch {
      return false;
    }
  }, []);

  const disablePin = useCallback(
    async (currentPin: string): Promise<boolean> => {
      const ok = await unlock(currentPin);
      if (!ok) return false;
      await setStoredPinHash(null);
      await setPinEnabled(false);
      setHasStoredPin(false);
      setIsPinEnabled(false);
      setIsLocked(false);
      return true;
    },
    [unlock],
  );

  const setPin = useCallback(
    async (currentPin: string, newPin: string): Promise<boolean> => {
      const nextDigits = normalizePin(newPin);
      if (!nextDigits) return false;
      const stored = await getStoredPinHash();
      if (stored) {
        const currentDigits = normalizePin(currentPin);
        if (!currentDigits) return false;
        const ok = await unlock(currentDigits);
        if (!ok) return false;
      }
      try {
        const hash = await hashPin(nextDigits);
        const written = await setStoredPinHash(hash);
        if (!written) return false;
        setHasStoredPin(true);
        return true;
      } catch {
        return false;
      }
    },
    [unlock],
  );

  useEffect(() => {
    void (async () => {
      if (Platform.OS === "web" || isExpoGo() || isTV()) {
        setIsReady(true);
        return;
      }
      try {
        const [enabled, hash, timeoutStr, lockoutUntilTs, hasHardware, isEnrolled, authTypes] =
          await Promise.all([
            getPinEnabled(),
            getStoredPinHash(),
            getSecureItem(LOCK_TIMEOUT_STORAGE_KEY),
            getLockoutUntil(),
            LocalAuthentication.hasHardwareAsync(),
            LocalAuthentication.isEnrolledAsync(),
            LocalAuthentication.supportedAuthenticationTypesAsync(),
          ]);
        setIsPinEnabled(enabled);
        const pinIsStored = !!(hash && hash.length > 0);
        setHasStoredPin(pinIsStored);
        const biometricsReady = hasHardware && isEnrolled;
        setBiometricsAvailable(biometricsReady);
        if (biometricsReady) {
          setBiometricUnlockLabelKey(resolveBiometricUnlockLabelKey(authTypes));
        } else {
          setBiometricUnlockLabelKey("pinLock.unlockWithBiometrics");
        }
        if (typeof timeoutStr === "string") {
          const ms = Number.parseInt(timeoutStr, 10);
          if (!Number.isNaN(ms)) setLockTimeoutMsState(ms);
        }
        const now = Date.now();
        if (lockoutUntilTs != null && now < lockoutUntilTs) {
          setLockoutUntil(lockoutUntilTs);
          setLockoutRemainingMs(lockoutUntilTs - now);
        } else if (lockoutUntilTs != null) {
          setLockoutUntil(null);
          setLockoutRemainingMs(0);
          persistLockoutUntil(null).catch(() => {});
        }
        if (enabled && pinIsStored) {
          setIsLocked(true);
        }
      } catch {
        // On any init error, stay unlocked so app remains usable
      }
      setIsReady(true);
    })();
  }, []);

  useEffect(() => {
    if (lockoutUntil == null) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, lockoutUntil - now);
      setLockoutRemainingMs(remaining);
      if (remaining === 0) {
        setLockoutUntil(null);
        setUnlockError(null);
        setUnlockErrorParams(null);
        persistLockoutUntil(null).catch(() => {});
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  useEffect(() => {
    if (Platform.OS === "web" || !isPinEnabled || !hasStoredPin) return;

    const sub = AppState.addEventListener("change", (nextState) => {
      if (shouldRecordBackgroundTransition(nextState) && !biometricAuthInProgressRef.current) {
        wasBackgroundedRef.current = true;
        backgroundedAtRef.current = Date.now();
      }
      if (nextState === "active") {
        if (biometricAuthInProgressRef.current) {
          wasBackgroundedRef.current = false;
          backgroundedAtRef.current = null;
          appStateRef.current = nextState;
          return;
        }
        if (
          shouldLockOnForeground({
            wasBackgrounded: wasBackgroundedRef.current,
            backgroundedAt: backgroundedAtRef.current,
            lockTimeoutMs,
          })
        ) {
          setIsLocked(true);
        }
        wasBackgroundedRef.current = false;
        backgroundedAtRef.current = null;
        appStateRef.current = nextState;
      }
    });
    return () => sub.remove();
  }, [isPinEnabled, hasStoredPin, lockTimeoutMs]);

  const deferActionsUntilPinUnlock = shouldDeferActionsUntilPinUnlock(isReady, isLocked);
  const pinSetupRequired = Platform.OS !== "web" && isReady && isPinEnabled && !hasStoredPin;

  const value = useMemo<PinLockContextValue>(
    () => ({
      isPinEnabled,
      hasStoredPin,
      isLocked,
      isReady,
      pinSetupRequired,
      deferActionsUntilPinUnlock,
      unlockError,
      unlockErrorParams,
      biometricsAvailable,
      biometricUnlockLabelKey,
      isLockedOut: lockoutRemainingMs > 0,
      lockoutRemainingMs,
      clearUnlockError,
      lockTimeoutMs,
      setLockTimeoutMs,
      enablePin,
      disablePin,
      setPin,
      unlock,
      unlockWithBiometrics,
      lock,
      factoryResetPinLock,
    }),
    [
      isPinEnabled,
      hasStoredPin,
      isLocked,
      isReady,
      pinSetupRequired,
      deferActionsUntilPinUnlock,
      unlockError,
      unlockErrorParams,
      biometricsAvailable,
      biometricUnlockLabelKey,
      lockoutRemainingMs,
      clearUnlockError,
      lockTimeoutMs,
      setLockTimeoutMs,
      enablePin,
      disablePin,
      setPin,
      unlock,
      unlockWithBiometrics,
      lock,
      factoryResetPinLock,
    ],
  );

  return <PinLockContext.Provider value={value}>{children}</PinLockContext.Provider>;
}

export function usePinLock() {
  const ctx = useContext(PinLockContext);
  if (!ctx) throw new Error("usePinLock must be used within PinLockProvider");
  return ctx;
}
