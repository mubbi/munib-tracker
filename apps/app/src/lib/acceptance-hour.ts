/**
 * Friday "hour of acceptance" (ساعة الإجابة) — dua window after Asr until Maghrib.
 * Scholarly opinions differ on the exact minute; we treat the full Asr→Maghrib
 * span as the seekable window and nudge at Asr plus the midpoint.
 */

/** Learn-hub topic route for the hour-of-acceptance guide. */
export const ACCEPTANCE_HOUR_ROUTE = "/friday/hour-of-acceptance" as const;

/**
 * Fallback local window when prayer times are unavailable (default Makkah
 * coords / no city). Rough late-afternoon Friday heuristic only — not fiqh.
 */
export const ACCEPTANCE_HOUR_FALLBACK_START = { hour: 15, minute: 0 } as const;
export const ACCEPTANCE_HOUR_FALLBACK_END = { hour: 18, minute: 30 } as const;

/** True when `now` falls in [asr, maghrib). */
export function isAcceptanceHourWindow(now: Date, asr: Date, maghrib: Date): boolean {
  const t = now.getTime();
  return t >= asr.getTime() && t < maghrib.getTime() && maghrib.getTime() > asr.getTime();
}

/** Midpoint of the Asr→Maghrib span (second notification nudge). */
export function acceptanceHourMidpoint(asr: Date, maghrib: Date): Date {
  return new Date(asr.getTime() + (maghrib.getTime() - asr.getTime()) / 2);
}

/** Device-local fixed afternoon window for Fridays without accurate times. */
export function isAcceptanceHourFallbackWindow(now: Date): boolean {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const start = ACCEPTANCE_HOUR_FALLBACK_START.hour * 60 + ACCEPTANCE_HOUR_FALLBACK_START.minute;
  const end = ACCEPTANCE_HOUR_FALLBACK_END.hour * 60 + ACCEPTANCE_HOUR_FALLBACK_END.minute;
  return minutes >= start && minutes < end;
}
