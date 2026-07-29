import type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
import {
  isSalahImminent,
  resolveSalahPhase,
  SALAH_PHASE_AFTER_WINDOW_MS,
} from "@/lib/salah-phase/schedule";
import type { SalahTrackingSession } from "@/lib/salah-phase/types";

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `salah-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Creates a new explicit tracking session for the next (or current) Salah.
 * Promotion may be deferred until the Salah is imminent.
 */
export function createSalahTrackingSession(
  snapshot: WidgetSnapshot,
  now: Date = new Date(),
): SalahTrackingSession {
  const phase = resolveSalahPhase(snapshot, now);
  const showingCurrent = phase !== "upcoming";
  const prayerId = showingCurrent
    ? snapshot.nextPrayer.currentPrayerId
    : snapshot.nextPrayer.prayerId;
  const prayerName = showingCurrent
    ? snapshot.nextPrayer.currentPrayerName
    : snapshot.nextPrayer.prayerName;
  const promoteAt = isSalahImminent(snapshot, now)
    ? now
    : new Date(Math.max(now.getTime(), snapshot.nextPrayer.targetTimeMs - 30 * 60_000));
  const endsAtMs =
    phase === "upcoming"
      ? snapshot.nextPrayer.targetTimeMs + SALAH_PHASE_AFTER_WINDOW_MS
      : snapshot.nextPrayer.currentPrayerAtMs + SALAH_PHASE_AFTER_WINDOW_MS;

  return {
    sessionId: randomId(),
    prayerId,
    prayerName,
    startedAt: now.toISOString(),
    promoteAt: promoteAt.toISOString(),
    endsAt: new Date(Math.max(endsAtMs, now.getTime() + 60_000)).toISOString(),
    dismissed: false,
    status: "active",
  };
}

export function endSalahTrackingSession(
  session: SalahTrackingSession,
  reason: "ended" | "dismissed" = "ended",
): SalahTrackingSession {
  return {
    ...session,
    status: reason,
    dismissed: reason === "dismissed" ? true : session.dismissed,
    endsAt: new Date().toISOString(),
  };
}

export function shouldPromoteSession(
  session: SalahTrackingSession | null | undefined,
  snapshot: WidgetSnapshot,
  now: Date = new Date(),
): boolean {
  if (session?.status !== "active" || session.dismissed) return false;
  if (Date.parse(session.endsAt) <= now.getTime()) return false;
  if (Date.parse(session.promoteAt) > now.getTime()) return false;
  return isSalahImminent(snapshot, now) || resolveSalahPhase(snapshot, now) !== "upcoming";
}
