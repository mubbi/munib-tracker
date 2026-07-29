import { useEffect, useState } from "react";

import {
  getContentOverlaysReadyVersion,
  subscribeContentOverlays,
} from "@/lib/content-overlay-registry";

/**
 * Epoch that advances when Learn overlays for the active locale finish loading.
 * Include in `useMemo` deps alongside `i18n.language` so screens refresh after
 * the English fallback is replaced by translated overlays.
 */
export function useContentOverlayEpoch(): number {
  const [epoch, setEpoch] = useState(getContentOverlaysReadyVersion);
  useEffect(() => subscribeContentOverlays(() => setEpoch(getContentOverlaysReadyVersion())), []);
  return epoch;
}
