import { buildAppUrl } from "@/lib/app-links";
import type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
import {
  actionForPhase,
  resolveSalahPhase,
  SALAH_PHASE_AFTER_WINDOW_MS,
  SALAH_PHASE_MARK_WINDOW_MS,
  type SalahPhase,
} from "@/lib/salah-phase";

export type LiveActivityPhase = Exclude<SalahPhase, "ended">;

export const LIVE_ACTIVITY_MARK_WINDOW_MS = SALAH_PHASE_MARK_WINDOW_MS;
export const LIVE_ACTIVITY_AFTER_SALAH_WINDOW_MS = SALAH_PHASE_AFTER_WINDOW_MS;

/**
 * Flat content state handed to the iOS Live Activity (NF-1.19). Mirrors the
 * `PrayerActivityContentState` Swift struct field-for-field so the native
 * ActivityKit target can decode it directly. Derived from the same
 * {@link WidgetSnapshot} the home-screen widgets read, so the Live Activity, the
 * widgets, and the in-app hero can never disagree.
 */
export interface LiveActivityState {
  prayerId: string;
  prayerName: string;
  prayerTime: string;
  /** Localized "at {{time}}" for the prayer clock (user time format). */
  prayerTimeLabel: string;
  countdownLabel: string;
  /** Localized caption above the live countdown. */
  remainingLabel: string;
  /** Native action labels resolved from the app-selected locale. */
  prepareLabel: string;
  actionLabel: string;
  actionDeepLink: string;
  phase: LiveActivityPhase;
  qiblaLabel: string;
  locale: string;
  isRtl: boolean;
  minutesUntil: number;
  /** Epoch milliseconds of the next prayer instant, for a native live countdown. */
  targetTimeMs: number;
  displayDate: string;
  location: string;
  progressLabel: string;
  progressPercent: number;
  locationDenied: boolean;
  title: string;
  deepLink: string;
  /** Theme (hex) so the activity matches the app's light/dark accent. */
  isDark: boolean;
  primary: string;
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  updatedAt: string;
  /** Today's obligatory Salah in order, for the Lock Screen / island dot row. */
  daySalah: LiveActivityDaySalah[];
  /** Caption shown while ActivityKit marks the activity stale. */
  staleLabel: string;
  /** "Done" badge, shown when the displayed Salah is already marked. */
  confirmationLabel: string;
  /**
   * Precomputed after-Mark content for the in-place **Mark Salah** button
   * (`MarkSalahLiveActivityIntent`). Empty strings outside the `markSalah` phase,
   * which also hides the in-place button (native falls back to a deep link).
   */
  markedActionLabel: string;
  markedActionDeepLink: string;
  markedProgressLabel: string;
  markedProgressPercent: number;
}

/** One obligatory Salah in the Live Activity status row. */
export interface LiveActivityDaySalah {
  id: string;
  done: boolean;
}

/** Today's progress label once one more Salah is marked (matches `progress.progressLabel`). */
function markedProgress(completed: number, total: number): { label: string; percent: number } {
  const next = Math.min(total, completed + 1);
  return {
    label: `${next}/${total}`,
    percent: total > 0 ? Math.round((next / total) * 100) : 0,
  };
}

/**
 * Builds the Live Activity content state from a widget snapshot. Prefers the
 * snapshot's exact `targetTimeMs` (from the adhan engine + user method/madhab
 * adjustments) so the native `Text(timerInterval:)` matches displayed salah
 * times; falls back to whole-minute reconstruction when absent.
 */
export function buildLiveActivityState(
  snapshot: WidgetSnapshot,
  now: Date = new Date(),
): LiveActivityState {
  const { nextPrayer, progress, theme } = snapshot;
  const minutesUntil = Math.max(0, Math.round(nextPrayer.minutesUntil));
  const targetTimeMs =
    nextPrayer.targetTimeMs > 0 ? nextPrayer.targetTimeMs : now.getTime() + minutesUntil * 60_000;
  const phase = resolveSalahPhase(snapshot, now);
  const livePhase: LiveActivityPhase = phase === "ended" ? "afterSalah" : phase;
  const showingCurrentPrayer = livePhase !== "upcoming";
  const action = actionForPhase(livePhase, snapshot);
  const daySalah: LiveActivityDaySalah[] = (snapshot.schedule?.rows ?? []).map((row) => ({
    id: row.id,
    done: row.status === "completed",
  }));
  const canMark = livePhase === "markSalah";
  const afterMark = canMark ? actionForPhase("afterSalah", snapshot) : null;
  const marked = markedProgress(progress.completed, progress.total);

  return {
    prayerId: showingCurrentPrayer ? nextPrayer.currentPrayerId : nextPrayer.prayerId,
    prayerName: showingCurrentPrayer ? nextPrayer.currentPrayerName : nextPrayer.prayerName,
    prayerTime: showingCurrentPrayer ? nextPrayer.currentPrayerTime : nextPrayer.prayerTime,
    prayerTimeLabel: showingCurrentPrayer
      ? nextPrayer.currentPrayerTimeLabel
      : nextPrayer.prayerTimeLabel,
    countdownLabel: nextPrayer.countdownLabel,
    remainingLabel: nextPrayer.remainingLabel,
    prepareLabel: snapshot.strings.prepareSalah,
    actionLabel: action.actionLabel,
    actionDeepLink: action.actionDeepLink,
    phase: livePhase,
    qiblaLabel: snapshot.strings.qibla,
    locale: snapshot.locale,
    isRtl: snapshot.isRtl,
    minutesUntil,
    targetTimeMs,
    displayDate: nextPrayer.displayDate,
    location: nextPrayer.location,
    progressLabel: progress.progressLabel,
    progressPercent: progress.progressPercent,
    locationDenied: snapshot.locationDenied,
    title: showingCurrentPrayer ? action.actionLabel : nextPrayer.title,
    deepLink: showingCurrentPrayer ? action.actionDeepLink : nextPrayer.deepLink,
    isDark: theme.isDark,
    primary: theme.primary,
    background: theme.background,
    cardBackground: theme.cardBackground,
    textPrimary: theme.textPrimary,
    textSecondary: theme.textSecondary,
    updatedAt: snapshot.updatedAt,
    daySalah,
    staleLabel: snapshot.strings.staleData,
    confirmationLabel: snapshot.strings.done,
    markedActionLabel: afterMark?.actionLabel ?? "",
    markedActionDeepLink: afterMark?.actionDeepLink ?? "",
    markedProgressLabel: canMark ? marked.label : "",
    markedProgressPercent: canMark ? marked.percent : 0,
  };
}

/** @deprecated Prefer buildAppUrl — kept for call sites that imported via state. */
export function liveActivityDeepLink(path: string): string {
  return buildAppUrl(path);
}
