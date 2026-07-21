import i18n from "@/i18n";
import { buildAppUrl } from "@/lib/app-links";
import type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
import {
  actionForPhase,
  resolveSalahPhase,
  type SalahPhase,
  type SalahPhaseBoundary,
} from "@/lib/salah-phase";

/**
 * Payload handed to the Android ongoing / Live Update notification.
 * Android counterpart to `LiveActivityState` — built from the same
 * {@link WidgetSnapshot}. Kept flat and JSON-serializable for Kotlin.
 */
export interface OngoingNotificationState {
  sessionId: string;
  prayerId: string;
  title: string;
  prayerName: string;
  /** Localized "at {{time}}" line shown as the notification's content text. */
  prayerTimeLabel: string;
  countdownLabel: string;
  /** Localized caption above the countdown (e.g. "Remaining"). */
  remainingLabel: string;
  /** Epoch milliseconds of the next prayer instant, for the native chronometer. */
  targetTimeMs: number;
  deepLink: string;
  phase: SalahPhase;
  actionLabel: string;
  actionDeepLink: string;
  /**
   * Prepare action — opens before-Salah adhkar when phase is upcoming.
   */
  prepareLabel: string;
  /** Deep link for the Prepare action (`munib-tracker://zikr/before_prayer`). */
  prepareDeepLink: string;
  stopLabel: string;
  shortCriticalText: string;
  progressPercent: number;
  progressSegments: number[];
  progressPoints: number[];
  /** Request Android 16 Live Update promotion when true. */
  requestPromoted: boolean;
  /** Phase boundary alarms (ISO execute times + payloads for offline flips). */
  schedule: Array<{
    executeAtMs: number;
    phase: SalahPhase;
    prayerName: string;
    prayerTimeLabel: string;
    title: string;
    actionLabel: string;
    actionDeepLink: string;
    targetTimeMs: number;
    progressPercent: number;
    shortCriticalText: string;
  }>;
  /** Next-after-next Salah, so the boundary alarm can flip to it while offline. */
  followingName: string;
  followingTime: string;
  followingTargetTimeMs: number;
  /** Localized Android notification channel name ("Next Salah countdown"). */
  channelName: string;
}

export type BuildOngoingNotificationStateInput = {
  snapshot: WidgetSnapshot;
  sessionId?: string;
  boundaries?: SalahPhaseBoundary[];
  requestPromoted?: boolean;
  now?: Date;
};

/**
 * Builds the Android ongoing-notification / Live Update state from a widget
 * snapshot. Mirrors {@link import("@/lib/live-activity/state").buildLiveActivityState}
 * so the two platforms show the same next-prayer facts.
 */
export function buildOngoingNotificationState(
  snapshotOrInput: WidgetSnapshot | BuildOngoingNotificationStateInput,
  nowOrUnused?: Date,
): OngoingNotificationState {
  const input: BuildOngoingNotificationStateInput =
    "nextPrayer" in snapshotOrInput
      ? { snapshot: snapshotOrInput, now: nowOrUnused }
      : snapshotOrInput;
  const snapshot = input.snapshot;
  const now = input.now ?? new Date();
  const { nextPrayer } = snapshot;
  const minutesUntil = Math.max(0, Math.round(nextPrayer.minutesUntil));
  const targetTimeMs =
    nextPrayer.targetTimeMs > 0 ? nextPrayer.targetTimeMs : now.getTime() + minutesUntil * 60_000;
  const phase = resolveSalahPhase(snapshot, now);
  const action = actionForPhase(phase === "ended" ? "afterSalah" : phase, snapshot);
  const showingCurrent = phase !== "upcoming" && phase !== "ended";
  const boundary = input.boundaries?.[0];
  const progressPercent =
    boundary?.progressPercent ?? (phase === "upcoming" ? 20 : phase === "markSalah" ? 65 : 85);
  const progressSegments = boundary?.progressSegments ?? [60, 15, 30];
  const progressPoints = boundary?.progressPoints ?? [60, 75];
  const shortCriticalText =
    boundary?.shortCriticalText ??
    (phase === "upcoming"
      ? minutesUntil < 60
        ? `${minutesUntil}m`
        : `${Math.floor(minutesUntil / 60)}h`
      : phase === "markSalah"
        ? "Mark"
        : "Adhkar");

  const schedule = (input.boundaries ?? []).map((b) => ({
    executeAtMs: Date.parse(b.executeAt),
    phase: b.phase,
    prayerName: b.prayerName,
    prayerTimeLabel: b.prayerTimeLabel,
    title: b.title,
    actionLabel: b.actionLabel,
    actionDeepLink: b.actionDeepLink,
    targetTimeMs: b.targetTimeMs,
    progressPercent: b.progressPercent,
    shortCriticalText: b.shortCriticalText,
  }));

  return {
    sessionId: input.sessionId ?? "ambient",
    prayerId: showingCurrent ? nextPrayer.currentPrayerId : nextPrayer.prayerId,
    title: showingCurrent ? action.actionLabel : nextPrayer.title,
    prayerName: showingCurrent ? nextPrayer.currentPrayerName : nextPrayer.prayerName,
    prayerTimeLabel: showingCurrent
      ? nextPrayer.currentPrayerTimeLabel
      : nextPrayer.prayerTimeLabel,
    countdownLabel: nextPrayer.countdownLabel,
    remainingLabel: nextPrayer.remainingLabel,
    targetTimeMs,
    deepLink: showingCurrent ? action.actionDeepLink : nextPrayer.deepLink,
    phase,
    actionLabel: action.actionLabel,
    actionDeepLink: action.actionDeepLink,
    prepareLabel: i18n.t("widgets.prepareSalah"),
    prepareDeepLink: buildAppUrl("/zikr/before_prayer"),
    stopLabel: i18n.t("notif.trackSalah.stop"),
    shortCriticalText,
    progressPercent,
    progressSegments: [...progressSegments],
    progressPoints: [...progressPoints],
    requestPromoted: input.requestPromoted === true,
    schedule,
    followingName: nextPrayer.followingName,
    followingTime: nextPrayer.followingTime,
    followingTargetTimeMs: targetTimeMs + 2 * 60 * 60_000,
    channelName: i18n.t("notif.channels.prayerOngoing"),
  };
}
