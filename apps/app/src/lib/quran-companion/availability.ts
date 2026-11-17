import { isTV } from "@/lib/platform/is-tv";

/**
 * One place every entry point asks before showing Qur'an practice (§19
 * Availability). TV builds have no microphone path, so practice — the hub, the
 * mic, the settings row and the model download — is hidden there.
 */
export function isPracticeAvailable(): boolean {
  return !isTV();
}
