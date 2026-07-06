import { useCallback, useEffect, useRef } from "react";

/** Proceed with capture if QR layout callbacks never arrive (e.g. clipped off-screen host). */
export const SHARE_PROOF_QR_READY_TIMEOUT_MS = 4_000;

/** Waits until all share-footer QR codes report ready (or were already ready). */
export function useShareProofQrReadyGate(expectedCount: number) {
  const readyCountRef = useRef(0);
  const pendingResolveRef = useRef<(() => void) | null>(null);

  const reset = useCallback(() => {
    readyCountRef.current = 0;
    pendingResolveRef.current = null;
  }, []);

  const markQrReady = useCallback(() => {
    if (readyCountRef.current >= expectedCount) return;
    readyCountRef.current += 1;
    if (readyCountRef.current >= expectedCount && pendingResolveRef.current != null) {
      pendingResolveRef.current();
      pendingResolveRef.current = null;
    }
  }, [expectedCount]);

  const waitForQrCodes = useCallback((): Promise<void> => {
    if (readyCountRef.current >= expectedCount) return Promise.resolve();
    return new Promise<void>((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        pendingResolveRef.current = null;
        resolve();
      };
      const timeoutId = setTimeout(finish, SHARE_PROOF_QR_READY_TIMEOUT_MS);
      pendingResolveRef.current = finish;
    });
  }, [expectedCount]);

  useEffect(() => {
    reset();
  }, [reset]);

  return { markQrReady, waitForQrCodes, reset };
}
