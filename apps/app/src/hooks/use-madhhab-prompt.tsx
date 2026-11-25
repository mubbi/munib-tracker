import { useIsFocused } from "expo-router";
import { type ReactNode, useCallback, useEffect, useState } from "react";

import { MadhhabPromptSheet } from "@/components/fiqh/madhhab-prompt-sheet";
import { useMadhhab } from "@/hooks/use-madhhab";
import { usePreferencesReady } from "@/stores/preferences-store";

/** At most one automatic prompt per app session, whichever fiqh screen opens first. */
let promptedThisSession = false;

/** Test hook: forget that the session already prompted. */
export function resetMadhhabPromptSessionForTests(): void {
  promptedThisSession = false;
}

export interface MadhhabPromptHandle {
  /** Render this somewhere in the screen tree (it's a modal sheet). */
  sheet: ReactNode;
  /** Open the sheet manually (e.g. a "Choose madhhab" link on a calculator). */
  open: () => void;
  /** Never asked — the caller may show an inline hint instead of auto-opening. */
  isUnset: boolean;
}

/**
 * Lazy "Which madhhab do you follow?" sheet for fiqh-dependent screens
 * (calculators, trackers) — plan §4.1.1 item 4. The first time such a screen
 * opens while `madhhab` is still `undefined`, the sheet opens once; dismissing
 * it records "Show all views" (`null`), so it never returns. Pass
 * `{ auto: false }` to only open it on demand.
 *
 *   const prompt = useMadhhabPrompt();
 *   return <ScreenLayout …>{prompt.sheet}…</ScreenLayout>;
 */
export function useMadhhabPrompt({ auto = true }: { auto?: boolean } = {}): MadhhabPromptHandle {
  const ready = usePreferencesReady();
  const { isUnset } = useMadhhab();
  const [visible, setVisible] = useState(false);
  // The sheet is a modal window, so it would float over any screen pushed on top of the
  // fiqh screen (deep link, notification tap, in-app link) while that screen stays mounted
  // underneath. Hide it while blurred; it comes back when the user returns.
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!auto || !ready || !isUnset || promptedThisSession) return;
    promptedThisSession = true;
    setVisible(true);
  }, [auto, ready, isUnset]);

  const open = useCallback(() => setVisible(true), []);
  const onDone = useCallback(() => setVisible(false), []);

  return {
    sheet: <MadhhabPromptSheet visible={visible && isFocused} onDone={onDone} reason="screen" />,
    open,
    isUnset,
  };
}
