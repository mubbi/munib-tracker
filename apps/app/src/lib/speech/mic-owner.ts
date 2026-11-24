/**
 * One owner of the microphone at a time (NF-3.20 / NF-3.24). An on-device
 * listener claims the mic before it starts capture; a new claim stops the
 * previous owner first (Qur'an practice, pronunciation checks, voice tasbeeh,
 * dictation), so two features never record at once.
 */

export type MicOwnerId = "tasbeeh-voice" | "quran-practice" | "pronunciation" | "dictation";

type Owner = { id: MicOwnerId; release: () => Promise<void> | void };

let current: Owner | null = null;

/** Claim the mic for `id`; the previous owner's `release` runs (and is awaited) first. */
export async function claimMicrophone(
  id: MicOwnerId,
  release: () => Promise<void> | void,
): Promise<void> {
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
export function releaseMicrophone(release: () => Promise<void> | void): void {
  if (current?.release === release) current = null;
}

export function microphoneOwner(): MicOwnerId | null {
  return current?.id ?? null;
}
