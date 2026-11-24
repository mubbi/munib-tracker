import { useEffect, useState } from "react";
import { Platform } from "react-native";

const FINE_HOVER_QUERY = "(hover: hover) and (pointer: fine)";

/** True on web with a mouse / trackpad (hover-capable fine pointer). Pure read, no subscription. */
export function hasFinePointerHover(): boolean {
  if (Platform.OS !== "web" || typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(FINE_HOVER_QUERY).matches;
}

/**
 * Desktop web with a fine pointer — use hover affordances (tooltips, hover
 * cards); otherwise (touch web, native, TV) use tap. Live: follows a tablet
 * docking a trackpad / an external mouse being connected.
 */
export function useFinePointerHover(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    const mq = window.matchMedia(FINE_HOVER_QUERY);
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);
  return fine;
}
