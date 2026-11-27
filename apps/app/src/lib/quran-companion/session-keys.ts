/**
 * Desktop web shortcuts for the practice session (§9.2), the same bindings as
 * the surah reader: Space starts / stops the microphone (or Hear in a
 * listen-only session), ← / → move between ayahs (mirrored in an RTL UI).
 * Pure so the binding is unit-tested; the screen wires it through
 * `useWebScreenKeyHandler` (typing and focused buttons are skipped there).
 */
export type PracticeKeyAction = "primary" | "next" | "previous" | null;

export function practiceSessionKeyAction(
  key: string,
  options: {
    /** UI is right-to-left: → goes back. */
    rtl: boolean;
    /** The focused element already reacts to Space / Enter (a button, a link…). */
    interactiveTarget: boolean;
    /** Ayah navigation is allowed (more than one ayah, no take in progress). */
    canNavigate: boolean;
    shiftKey?: boolean;
  },
): PracticeKeyAction {
  if (key === " ") return options.interactiveTarget ? null : "primary";
  if ((key === "ArrowLeft" || key === "ArrowRight") && !options.shiftKey) {
    if (!options.canNavigate) return null;
    const forward = (key === "ArrowRight") !== options.rtl;
    return forward ? "next" : "previous";
  }
  return null;
}
