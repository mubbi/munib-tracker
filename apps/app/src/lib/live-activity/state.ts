import { buildAppUrl } from "@/lib/app-links";
import type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";

export type LiveActivityPhase = "upcoming" | "markSalah" | "afterSalah";

export const LIVE_ACTIVITY_MARK_WINDOW_MS = 15 * 60_000;
export const LIVE_ACTIVITY_AFTER_SALAH_WINDOW_MS = 30 * 60_000;

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
  const elapsedSinceCurrent = now.getTime() - nextPrayer.currentPrayerAtMs;
  const currentPrayerIsRecent =
    nextPrayer.currentPrayerAtMs > 0 &&
    elapsedSinceCurrent >= 0 &&
    elapsedSinceCurrent < LIVE_ACTIVITY_AFTER_SALAH_WINDOW_MS;
  const currentPrayerCompleted =
    snapshot.schedule.rows.find((row) => row.id === nextPrayer.currentPrayerId)?.status ===
    "completed";
  const phase: LiveActivityPhase = !currentPrayerIsRecent
    ? "upcoming"
    : currentPrayerCompleted || elapsedSinceCurrent >= LIVE_ACTIVITY_MARK_WINDOW_MS
      ? "afterSalah"
      : "markSalah";
  const showingCurrentPrayer = phase !== "upcoming";
  const actionLabel =
    phase === "markSalah"
      ? snapshot.strings.markSalah
      : phase === "afterSalah"
        ? snapshot.strings.afterSalahAdhkar
        : snapshot.strings.prepareSalah;
  const actionDeepLink =
    phase === "markSalah"
      ? buildAppUrl("/mark-current")
      : phase === "afterSalah"
        ? buildAppUrl(`/zikr/after_prayer?prayer=${nextPrayer.currentPrayerId}`)
        : buildAppUrl("/zikr/before_prayer");

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
    actionLabel,
    actionDeepLink,
    phase,
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
    title: showingCurrentPrayer ? actionLabel : nextPrayer.title,
    deepLink: showingCurrentPrayer ? actionDeepLink : nextPrayer.deepLink,
    isDark: theme.isDark,
    primary: theme.primary,
    background: theme.background,
    cardBackground: theme.cardBackground,
    textPrimary: theme.textPrimary,
    textSecondary: theme.textSecondary,
    updatedAt: snapshot.updatedAt,
  };
}
