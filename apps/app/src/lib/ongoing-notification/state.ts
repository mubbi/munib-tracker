import i18n from "@/i18n";
import type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";

/**
 * Payload handed to the Android ongoing "next Salah" notification (Phase 4).
 * Android counterpart to `LiveActivityState` — built from the same
 * {@link WidgetSnapshot} the home-screen widgets and the iOS Live Activity
 * read, so all surfaces agree. Kept flat and JSON-serializable so the native
 * Kotlin helper can decode it without a shared schema.
 */
export interface OngoingNotificationState {
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
  /** Mark-current action label shown on the notification's action button. */
  markLabel: string;
  /** Next-after-next Salah, so the boundary alarm can flip to it while offline. */
  followingName: string;
  followingTime: string;
  /** Localized Android notification channel name ("Next Salah countdown"). */
  channelName: string;
}

/**
 * Builds the Android ongoing-notification state from a widget snapshot.
 * Mirrors {@link import("@/lib/live-activity/state").buildLiveActivityState}
 * so the two platforms show the same next-prayer facts.
 */
export function buildOngoingNotificationState(
  snapshot: WidgetSnapshot,
  now: Date = new Date(),
): OngoingNotificationState {
  const { nextPrayer } = snapshot;
  const minutesUntil = Math.max(0, Math.round(nextPrayer.minutesUntil));
  const targetTimeMs =
    nextPrayer.targetTimeMs > 0 ? nextPrayer.targetTimeMs : now.getTime() + minutesUntil * 60_000;

  return {
    prayerId: nextPrayer.prayerId,
    title: nextPrayer.title,
    prayerName: nextPrayer.prayerName,
    prayerTimeLabel: nextPrayer.prayerTimeLabel,
    countdownLabel: nextPrayer.countdownLabel,
    remainingLabel: nextPrayer.remainingLabel,
    targetTimeMs,
    deepLink: nextPrayer.deepLink,
    markLabel: nextPrayer.markLabel,
    followingName: nextPrayer.followingName,
    followingTime: nextPrayer.followingTime,
    channelName: i18n.t("notif.channels.prayerOngoing"),
  };
}
