/**
 * One owner of the microphone at a time (NF-3.20 / NF-3.24). An on-device
 * listener claims the mic before it starts capture; a new claim stops the
 * previous owner first (Qur'an practice, pronunciation checks, voice tasbeeh,
 * dictation), so two features never record at once.
 *
 * `release` is the owner's *preemption* handler: it must stop capture and tell
 * the owning screen (so its UI leaves "listening"). Owners give the mic back with
 * `releaseMicrophone(sameFunction)` when they stop on their own — keep the
 * function identity stable for the whole take.
 */

export type MicOwnerId =
  | "tasbeeh-voice"
  | "quran-practice"
  | "recite-to-find"
  | "pronunciation"
  | "dictation";

export type MicRelease = () => Promise<void> | void;

type Owner = { id: MicOwnerId; release: MicRelease };

let current: Owner | null = null;

/** Claim the mic for `id`; the previous owner's `release` runs (and is awaited) first. */
export async function claimMicrophone(id: MicOwnerId, release: MicRelease): Promise<void> {
  const previous = current;
  current = { id, release };
  if (previous && previous.release !== release) {
    try {
      await previous.release();
    } catch {
      // The previous owner is going away either way.
    }
  }
}

/** Give the mic back (only if `release` is still the owner). */
export function releaseMicrophone(release: MicRelease): void {
  if (current?.release === release) current = null;
}

export function microphoneOwner(): MicOwnerId | null {
  return current?.id ?? null;
}
