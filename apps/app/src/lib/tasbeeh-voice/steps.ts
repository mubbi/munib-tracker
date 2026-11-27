/**
 * Hands-free counting across a run of zikr (D69): the guided adhkar session and
 * the after-Salah 33 / 33 / 34 sequence move from one zikr to the next by
 * themselves, so the microphone follows them. Pure: the hook
 * (`use-voice-tasbeeh-steps.ts`) feeds the state in and carries out the answer.
 *
 * The microphone is held only while a counting step is active: it is released
 * when a zikr reaches its target (the hook stops itself, "target"), between steps,
 * while the screen is covered, in the background and on unmount.
 */

/**
 * Longest zikr (in Arabic words) a guided session offers hands-free counting
 * for. Pause counting counts every separate spoken burst, so a long dua with a
 * breath in the middle would count twice, and teaching refuses a sample longer
 * than 8 s (`matcher.ts`). Twelve words covers every short repeated zikr
 * (tasbih, tahmid, takbir, istighfar, SubhanAllahi wa bihamdihi, hawqala …);
 * longer ones stay tap-counted.
 */
export const HANDS_FREE_MAX_WORDS = 12;

/** Wait after a step changes before the microphone opens again (lets the advance haptic land). */
export const VOICE_RESUME_DELAY_MS = 300;

const ARABIC_LETTER = /[\u0621-\u064A\u0671-\u06D3]/;

export function arabicWordCount(arabic: string): number {
  // Arabic letters only: punctuation such as the Arabic comma is not a word.
  return arabic.split(/\s+/).filter((word) => ARABIC_LETTER.test(word)).length;
}

/** Short enough to say in one breath: some Arabic, at most {@link HANDS_FREE_MAX_WORDS} words. */
export function isShortZikrText(arabic: string): boolean {
  const words = arabicWordCount(arabic);
  return words > 0 && words <= HANDS_FREE_MAX_WORDS;
}

/** A step can be counted hands-free: repeated (target > 1) and short enough to say in one breath. */
export function isHandsFreeStep(item: { arabic: string }, target: number): boolean {
  if (target <= 1) return false;
  return isShortZikrText(item.arabic);
}

/**
 * The same rule for a single counter (zikr, durood, dua, own adhkar): a long
 * item would pause-count once per breath, so the hands-free toggle is hidden and
 * it stays tap-counted. `target` 0 is an open-ended counter (repeated, no limit);
 * a single recitation (target 1) needs no counting. Text without Arabic (a custom
 * tasbeeh known by its title only) cannot be measured, so it stays offered.
 */
export function isHandsFreeCounter(item: { arabic?: string | null }, target: number): boolean {
  if (target === 1) return false;
  const arabic = item.arabic?.trim() ?? "";
  return arabic === "" || isShortZikrText(arabic);
}

export type StepVoiceInput = {
  /** The person switched hands-free on for this screen. */
  on: boolean;
  /** This step can be counted by voice (eligible + the platform can listen). */
  eligible: boolean;
  /** A counting step is on screen and focused (not advancing, not finished, not covered). */
  active: boolean;
  /** The step's target is reached. */
  atLimit: boolean;
  /** The step's zikr has a taught voice pattern on this device. */
  taught: boolean;
  /** "Skip — count every pause" was chosen on this screen: untaught zikr start at once. */
  pausePreferred: boolean;
  /** Listening or getting ready. */
  busy: boolean;
  /** Teaching samples are being recorded. */
  teaching: boolean;
  /** Listening was started for a different zikr (the step changed under it). */
  listeningOther: boolean;
  /** A sheet (permission / first use) is open and handles starting itself. */
  blocked: boolean;
};

export type StepVoiceDecision =
  /** Nothing to do. */
  | "none"
  /** Close the microphone. */
  | "stop"
  /** Drop teaching in progress. */
  | "cancel-teach"
  /** Untaught zikr, no preference yet: ask "teach it, or count every pause?" (D50). */
  | "choose"
  /** Start counting by the taught pattern. */
  | "start"
  /** Start counting by pauses (less accurate). */
  | "start-pause";

export function stepVoiceDecision(input: StepVoiceInput): StepVoiceDecision {
  const wanted = input.on && input.eligible && input.active;
  if (input.busy) return !wanted || input.listeningOther ? "stop" : "none";
  if (input.teaching) return wanted ? "none" : "cancel-teach";
  if (!wanted || input.atLimit || input.blocked) return "none";
  if (input.taught) return "start";
  if (input.pausePreferred) return "start-pause";
  return "choose";
}
