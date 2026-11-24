/**
 * Which counting method hands-free tasbeeh ships with (NF-3.20, D24).
 *
 * - "spotter": the on-device FastConformer model listens for the counter's
 *   catalog phrase (CTC keyword spotting). Ships when spikes S1/S2 meet the
 *   release gate.
 * - "pause": the documented fallback when they do not — every separate spoken
 *   burst counts once ("Counts each pause — less accurate"); no model, no
 *   download, no phrase check.
 *
 * The decision and the numbers behind it are in docs/proofs/hands-free-tasbeeh.md.
 */
export type VoiceCountingMode = "spotter" | "pause";

/**
 * 2026-11-24: spike S2 missed the release gate (over-count ≥ 0.84% at the
 * strictest threshold vs ≤ 0.5%; missed counts 14% normal / 30% fast vs 5% / 10%,
 * measured on reference + synthetic audio), so per D24 the pause-count fallback
 * ships. Flip back to "spotter" only after a re-run of `tasbeeh-voice:eval` passes.
 */
export const VOICE_COUNTING_MODE: VoiceCountingMode = "pause";

export function usesModel(mode: VoiceCountingMode = VOICE_COUNTING_MODE): boolean {
  return mode === "spotter";
}
