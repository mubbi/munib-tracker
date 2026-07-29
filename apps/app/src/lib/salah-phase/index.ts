export {
  actionForPhase,
  buildSalahPhaseSchedule,
  isSalahImminent,
  resolveSalahPhase,
  SALAH_ACTIVITY_HORIZON_MS,
  SALAH_FOLLOWING_FALLBACK_MS,
  SALAH_PHASE_AFTER_WINDOW_MS,
  SALAH_PHASE_MARK_WINDOW_MS,
  SALAH_WEB_PUSH_HORIZON_MS,
  snapshotForNextPrayerArrival,
} from "@/lib/salah-phase/schedule";
export {
  createSalahTrackingSession,
  endSalahTrackingSession,
  shouldPromoteSession,
} from "@/lib/salah-phase/session";
export type {
  SalahPhase,
  SalahPhaseBoundary,
  SalahTrackingSession,
} from "@/lib/salah-phase/types";
