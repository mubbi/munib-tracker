import type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";

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
  countdownLabel: string;
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
 * Builds the Live Activity content state from a widget snapshot. `now` is used
 * to derive the absolute next-prayer instant from the snapshot's whole-minute
 * countdown so the native `Text(timerInterval:)` ticks down on its own.
 */
export function buildLiveActivityState(
  snapshot: WidgetSnapshot,
  now: Date = new Date(),
): LiveActivityState {
  const { nextPrayer, progress, theme } = snapshot;
  const minutesUntil = Math.max(0, Math.round(nextPrayer.minutesUntil));
  const targetTimeMs = now.getTime() + minutesUntil * 60_000;

  return {
    prayerId: nextPrayer.prayerId,
    prayerName: nextPrayer.prayerName,
    prayerTime: nextPrayer.prayerTime,
    countdownLabel: nextPrayer.countdownLabel,
    minutesUntil,
    targetTimeMs,
    displayDate: nextPrayer.displayDate,
    location: nextPrayer.location,
    progressLabel: progress.progressLabel,
    progressPercent: progress.progressPercent,
    locationDenied: snapshot.locationDenied,
    title: nextPrayer.title,
    deepLink: nextPrayer.deepLink,
    isDark: theme.isDark,
    primary: theme.primary,
    background: theme.background,
    cardBackground: theme.cardBackground,
    textPrimary: theme.textPrimary,
    textSecondary: theme.textSecondary,
    updatedAt: snapshot.updatedAt,
  };
}
