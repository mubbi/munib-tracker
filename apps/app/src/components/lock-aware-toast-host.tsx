import { usePinLock } from "@/features/pin-lock";
import { ToastHost } from "@/providers/toast-provider";

/** True while `PinLockGate` covers the app (unlock screen or forced PIN setup). */
export function usePinGateActive(): boolean {
  const { isReady, isLocked, hasStoredPin, pinSetupRequired } = usePinLock();
  return isReady && ((isLocked && hasStoredPin) || pinSetupRequired);
}

/**
 * Root toast host that never draws over the PIN lock (G-92). Mounted BELOW
 * `PinLockGate` in the root overlays (and `ZIndex.toast` < `ZIndex.gate`), and
 * unmounted while the gate is up so a toast can neither show content over the
 * lock screen nor reach the accessibility tree above it. Queued toasts stay in
 * the controller and appear after unlock if they have not expired.
 */
export function LockAwareToastHost() {
  return usePinGateActive() ? null : <ToastHost />;
}
