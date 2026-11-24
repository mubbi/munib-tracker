import { createContext } from "react";

/**
 * TV follow-along bookkeeping (refs, never state — focus changes must not
 * re-render the ayah list). `focused` is the ayah card holding D-pad focus;
 * `prevPlaying` the ayah that was playing before the current track.
 */
export type AyahFocusTracker = { focused: number | null; prevPlaying: number | null };
export const AyahFocusTrackerContext = createContext<{ current: AyahFocusTracker } | null>(null);
