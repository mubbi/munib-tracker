import type { MuhasabahConfig } from "@munib-tracker/shared/types";

import type { MuhasabahSalahRecap } from "./logic";

/** Bundled Sayyid al-Istighfar (Hisnul Muslim, Bukhari 6306) — rendered by id, never typed. */
export const SAYYID_AL_ISTIGHFAR_ZIKR_ID = "morning-sayyid-al-istighfar";

/** The nightly review's five screens, in order (NF-3.6). */
export const MUHASABAH_STEPS = ["salah", "prompts", "gratitude", "repent", "intention"] as const;
export type MuhasabahStep = (typeof MUHASABAH_STEPS)[number];

/** The step `delta` screens away, clamped to the first / last screen. */
export function adjacentMuhasabahStep(step: MuhasabahStep, delta: number): MuhasabahStep {
  const index = MUHASABAH_STEPS.indexOf(step) + delta;
  const clamped = Math.max(0, Math.min(MUHASABAH_STEPS.length - 1, index));
  return MUHASABAH_STEPS[clamped] ?? "salah";
}

/**
 * Offer the nightly reminder once: after the first completed review, until the
 * offer is answered, and only while the reminder is still off.
 */
export function shouldOfferMuhasabahReminder(
  config: Pick<MuhasabahConfig, "firstCompletedAt" | "reminderOfferAnswered">,
  reminderOn: boolean,
): boolean {
  return Boolean(config.firstCompletedAt) && !config.reminderOfferAnswered && !reminderOn;
}

/** Some fard is still unlogged tonight — the recap adds a gentle (no-blame) line. */
export function hasUnloggedFard(recap: MuhasabahSalahRecap): boolean {
  return recap.fardOnTime + recap.fardLate < recap.fardTotal;
}
