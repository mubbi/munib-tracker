import type { UserPreferences } from "@munib-tracker/shared/types";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import i18n from "@/i18n";
import { nativeEnqueueCommand } from "@/lib/external-commands/native-bridge";
import type { StoredLocation } from "@/lib/location";
import {
  adhanChannelId,
  adhanNotificationSound,
  isAdhanChannelId,
} from "@/lib/notifications/adhan-sounds";
import {
  type BuiltReminder,
  buildReminders,
  type ScheduledReminderRow,
  summarizeReminders,
} from "@/lib/notifications/build-reminders";
import {
  parseScheduledTriggerAtMs,
  type RawScheduledTrigger,
  scheduledFireAtIso,
} from "@/lib/notifications/parse-scheduled-trigger";
import {
  readNotificationPermissionUiState,
  requestNotificationPermission,
} from "@/lib/notifications/permissions";
import { isLocalNotificationSupported } from "@/lib/notifications/platform";
import {
  MARK_ACTION_IDENTIFIER,
  markCommandFromReminderData,
  PRAYER_NOW_CATEGORY,
  type ReminderActionData,
  SNOOZE_ACTION_IDENTIFIER,
  SNOOZE_ID_PREFIX,
  SNOOZE_MINUTES,
} from "@/lib/notifications/reminder-actions";
import { JUST_MISSED_WINDOW_MS } from "@/lib/notifications/reminder-clock";
import { collectReminderOptions } from "@/lib/notifications/reminder-options";
import { captureAppException } from "@/lib/sentry";
import { formatDisplayHhMm } from "@/lib/time";

export { MARK_ACTION_IDENTIFIER, PRAYER_NOW_CATEGORY, SNOOZE_ACTION_IDENTIFIER };

/** Serializes reschedule passes so overlapping calls cannot stack duplicate OS notifications. */
let rescheduleTail: Promise<void> = Promise.resolve();

function enqueueReschedule(task: () => Promise<void>): Promise<void> {
  const run = rescheduleTail.then(task, task);
  rescheduleTail = run.catch((error) => {
    captureAppException(error, { tags: { area: "notifications", phase: "reschedule" } });
  });
  return run;
}

type ChannelId = BuiltReminder["channelId"];

/**
 * Channels created up front. The adhan channel is per style (`adhan-<styleId>`,
 * see `lib/notifications/adhan-sounds.ts`) and is synced by {@link syncAdhanChannel}.
 * https://developer.android.com/develop/ui/views/notifications/channels
 */
const STATIC_CHANNEL_IDS: Exclude<ChannelId, "prayerAdhan">[] = ["prayer", "zikr", "qaza"];

/** Android channel currently carrying the adhan sound (selected style). */
let activeAdhanChannelId = adhanChannelId(undefined);
/** `${channelId}|${locale}` last synced, so reschedules skip redundant channel work. */
let syncedAdhanChannelKey: string | null = null;

/**
 * OS (Android) channel for a reminder: an explicit per-style override first, then
 * the logical id — with the logical `prayerAdhan` mapped to the active style channel
 * (covers snoozes scheduled before per-style channels existed).
 */
function osChannelId(channelId: ChannelId, androidChannelId?: string): string {
  if (androidChannelId) return androidChannelId;
  return channelId === "prayerAdhan" ? activeAdhanChannelId : channelId;
}

/** The OS channel recorded in a scheduled / delivered reminder's `data`. */
function osChannelIdFromData(data: Record<string, unknown> | null | undefined): string {
  const { channelId, androidChannelId } = (data ?? {}) as {
    channelId?: ChannelId;
    androidChannelId?: string;
  };
  return osChannelId(channelId ?? "prayer", androidChannelId);
}

/**
 * Android: make sure the selected adhan style's channel exists with that style's
 * sound (HIGH importance so it isn't silenced) and delete every other adhan
 * channel — a channel's sound can't be changed after it is created, so switching
 * style switches channel (B2). Callers reschedule afterwards so pending adhan
 * reminders move to the new channel. No-op elsewhere.
 * https://developer.android.com/develop/ui/views/notifications/channels#UpdateChannel
 */
export async function syncAdhanChannel(adhanStyleId?: string | null): Promise<void> {
  if (Platform.OS !== "android" || !isLocalNotificationSupported()) return;
  const channelId = adhanChannelId(adhanStyleId);
  const key = `${channelId}|${i18n.language}`;
  activeAdhanChannelId = channelId;
  if (syncedAdhanChannelKey === key) return;
  await Notifications.setNotificationChannelAsync(channelId, {
    name: i18n.t("notif.channels.prayerAdhan"),
    importance: Notifications.AndroidImportance.HIGH,
    sound: adhanNotificationSound(adhanStyleId),
  });
  try {
    const existing = await Notifications.getNotificationChannelsAsync();
    for (const channel of existing) {
      if (channel.id !== channelId && isAdhanChannelId(channel.id)) {
        await Notifications.deleteNotificationChannelAsync(channel.id);
      }
    }
  } catch (error) {
    captureAppException(error, { tags: { area: "notifications", phase: "adhan-channel" } });
  }
  syncedAdhanChannelKey = key;
}

/**
 * Expo iOS DATE triggers become `UNTimeIntervalNotificationTrigger(timeIntervalSinceNow)`
 * with the timestamp truncated to whole seconds. Intervals ≤ 0 throw
 * `ERR_NOTIFICATIONS_FAILED_TO_SCHEDULE` (native reason often just "undefined reason").
 * Keep a 2s lead so truncation and scheduling latency cannot go non-positive.
 */
export const MIN_DATE_TRIGGER_LEAD_MS = 2_000;

type SnoozeSource = { title: string | null; body: string | null; data?: Record<string, unknown> };

/**
 * A snoozed reminder: the original text and data, re-armed in `seconds`. Snooze
 * is only offered on prayer-time-now reminders, so it keeps Mark + Snooze. No
 * explicit sound — the OS default (iOS) or the channel's sound (Android); the
 * delivered content only reports a custom sound as the literal `"custom"`, which
 * is not a file name and must never be scheduled back.
 */
function snoozeRequest(
  identifier: string,
  source: SnoozeSource,
  seconds: number,
): Notifications.NotificationRequestInput {
  const data = source.data ?? {};
  return {
    identifier,
    content: {
      title: source.title ?? i18n.t("notif.defaultTitle"),
      body: source.body ?? "",
      categoryIdentifier: PRAYER_NOW_CATEGORY,
      ...(typeof data.channelId === "string" ? { threadIdentifier: data.channelId } : {}),
      data,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      channelId: osChannelIdFromData(data),
      repeats: false,
    },
  };
}

/** Pending snoozes, captured before a reschedule pass cancels everything. */
function collectPendingSnoozes(
  scheduled: Notifications.NotificationRequest[],
): Notifications.NotificationRequestInput[] {
  const now = Date.now();
  const out: Notifications.NotificationRequestInput[] = [];
  for (const item of scheduled) {
    if (!item.identifier.startsWith(SNOOZE_ID_PREFIX)) continue;
    const fireAtMs = parseScheduledTriggerAtMs(item.trigger as RawScheduledTrigger);
    if (fireAtMs == null || fireAtMs <= now) continue;
    const seconds = Math.max(1, Math.round((fireAtMs - now) / 1000));
    out.push(snoozeRequest(item.identifier, item.content, seconds));
  }
  return out;
}

/** What the OS holds right before a reschedule pass cancels everything. */
type PendingOsState = {
  snoozes: Notifications.NotificationRequestInput[];
  /** Identifiers still waiting to fire (not delivered yet). */
  pendingIds: ReadonlySet<string>;
  /** Identifiers already shown in the tray / notification centre. */
  deliveredIds: ReadonlySet<string>;
};

async function readPendingOsState(): Promise<PendingOsState> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  let presented: Notifications.Notification[] = [];
  try {
    presented = (await Notifications.getPresentedNotificationsAsync()) ?? [];
  } catch (error) {
    // Best effort — the pending set alone already stops the re-fire.
    captureAppException(error, { tags: { area: "notifications", phase: "read-presented" } });
  }
  return {
    snoozes: collectPendingSnoozes(scheduled),
    pendingIds: new Set(scheduled.map((item) => item.identifier)),
    deliveredIds: new Set(presented.map((item) => item.request.identifier)),
  };
}

/**
 * Whether a reschedule pass may (re-)arm `reminder`. A one-off reminder whose
 * fire time has already arrived (it sits in the just-missed window) is only
 * re-armed when the OS still had it pending and has not shown it — otherwise
 * the pass right after it fires (tapping it foregrounds the app, which
 * reschedules) would turn it into a 1-second trigger and deliver it twice.
 */
export function shouldArmReminder(
  reminder: BuiltReminder,
  state: Pick<PendingOsState, "pendingIds" | "deliveredIds">,
  nowMs = Date.now(),
): boolean {
  if (reminder.repeat !== "date") return true;
  if (reminder.fireAt.getTime() > nowMs) return true;
  return state.pendingIds.has(reminder.id) && !state.deliveredIds.has(reminder.id);
}

async function restoreSnoozes(snoozes: Notifications.NotificationRequestInput[]): Promise<void> {
  for (const snooze of snoozes) {
    try {
      await Notifications.scheduleNotificationAsync(snooze);
    } catch (error) {
      captureAppException(error, {
        tags: { area: "notifications", phase: "restore-snooze" },
        extra: { identifier: snooze.identifier },
      });
    }
  }
}

/** Stable extras for Sentry — never throws on Invalid Date. */
function reminderScheduleExtra(reminder: BuiltReminder): Record<string, string> {
  const fireAtMs = reminder.fireAt.getTime();
  return {
    reminderId: reminder.id,
    repeat: reminder.repeat,
    fireAt: Number.isFinite(fireAtMs) ? new Date(fireAtMs).toISOString() : "invalid",
  };
}

export type ReminderTriggerOptions = {
  /**
   * "Precise Adhan timing" (Android): schedule Adhan-channel reminders with
   * `delivery: "alarmClock"` (AlarmManager.setAlarmClock) so battery optimisation
   * can't defer them. Without the exact-alarm permission Expo falls back to
   * best-effort delivery on its own.
   * https://developer.android.com/develop/background-work/services/alarms/schedule#exact
   */
  preciseAdhan?: boolean;
};

/**
 * Native trigger for one reminder. Returns `null` when the OS would reject it
 * (invalid clock, or DATE more than a minute in the past).
 */
export function osTriggerForReminder(
  reminder: BuiltReminder,
  nowMs = Date.now(),
  { preciseAdhan = false }: ReminderTriggerOptions = {},
): Notifications.NotificationTriggerInput | null {
  const fireAtMs = reminder.fireAt.getTime();
  if (!Number.isFinite(fireAtMs)) return null;
  const channelId = osChannelId(reminder.channelId, reminder.androidChannelId);
  const alarmClock =
    preciseAdhan && Platform.OS === "android" && reminder.channelId === "prayerAdhan"
      ? ({ delivery: "alarmClock" } as const)
      : null;

  if (reminder.repeat === "daily") {
    const hour = reminder.fireAt.getHours();
    const minute = reminder.fireAt.getMinutes();
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) return null;
    if (!Number.isInteger(minute) || minute < 0 || minute > 59) return null;
    return {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId,
      ...alarmClock,
    };
  }

  const delayMs = fireAtMs - nowMs;
  if (delayMs < MIN_DATE_TRIGGER_LEAD_MS) {
    if (delayMs < -JUST_MISSED_WINDOW_MS) return null;
    return {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
      channelId,
      repeats: false,
    };
  }

  return {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date: reminder.fireAt,
    channelId,
    ...alarmClock,
  };
}

/**
 * Sets the foreground handler and Android channels. Call at startup and on locale
 * change (channel names are localised). `adhanStyleId` picks the adhan channel.
 */
export async function configureNotifications(adhanStyleId?: string | null): Promise<void> {
  if (!isLocalNotificationSupported()) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  await Notifications.setNotificationCategoryAsync(PRAYER_NOW_CATEGORY, [
    {
      identifier: MARK_ACTION_IDENTIFIER,
      buttonTitle: i18n.t("notif.markPrayed"),
      options: { opensAppToForeground: false },
    },
    {
      identifier: SNOOZE_ACTION_IDENTIFIER,
      buttonTitle: i18n.t("notif.snooze", { minutes: SNOOZE_MINUTES }),
      options: { opensAppToForeground: false },
    },
  ]);
  if (Platform.OS === "android") {
    // Non-adhan channels keep the default notification tone.
    for (const id of STATIC_CHANNEL_IDS) {
      await Notifications.setNotificationChannelAsync(id, {
        name: i18n.t(`notif.channels.${id}`),
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    // The adhan channel carries the selected style's call-to-prayer sound
    // (Android plays channel-level sounds). Force a resync so it's renamed too.
    syncedAdhanChannelKey = null;
    await syncAdhanChannel(adhanStyleId);
  }
}

export async function getPermissionStatus(): Promise<"granted" | "denied" | "undetermined"> {
  return readNotificationPermissionUiState();
}

export { requestNotificationPermission as requestPermission };

export async function cancelAll(): Promise<void> {
  if (!isLocalNotificationSupported()) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

async function scheduleReminder(
  reminder: BuiltReminder,
  options: ReminderTriggerOptions = {},
): Promise<void> {
  const trigger = osTriggerForReminder(reminder, Date.now(), options);
  if (!trigger) return;

  // Mark + Snooze only when this is a fard prayer-time reminder (has prayerId).
  const isPrayerNow = Boolean(reminder.prayerId && reminder.prayerDateKey);
  const content = {
    title: reminder.title,
    body: reminder.body,
    ...(isPrayerNow ? { categoryIdentifier: PRAYER_NOW_CATEGORY } : {}),
    // Stack related reminders (Salah / Adhan / Zikr / Qaza) together: Android group
    // key and iOS notification-centre thread (expo-notifications 58).
    threadIdentifier: reminder.channelId,
    // iOS plays the per-notification sound; Android takes it from the channel.
    ...(reminder.sound ? { sound: reminder.sound } : {}),
    data: {
      channelId: reminder.channelId,
      ...(reminder.androidChannelId ? { androidChannelId: reminder.androidChannelId } : {}),
      reminderId: reminder.id,
      route: reminder.route,
      ...(reminder.prayerId ? { prayerId: reminder.prayerId } : {}),
      ...(reminder.prayerDateKey ? { prayerDate: reminder.prayerDateKey } : {}),
    },
  };

  await Notifications.scheduleNotificationAsync({
    identifier: reminder.id,
    content,
    trigger,
  });
}

/**
 * Cancels existing reminders and schedules the set implied by preferences + location.
 * Prefer `rescheduleReminders()` (`lib/notifications/reschedule.ts`), which reads
 * both from the stores; only the notification lifecycle calls this directly.
 */
export async function rescheduleAll(
  prefs: UserPreferences,
  location: StoredLocation,
): Promise<void> {
  if (!isLocalNotificationSupported()) return;
  return enqueueReschedule(async () => {
    // Select (or create) the chosen adhan style's channel before arming reminders.
    await syncAdhanChannel(prefs.adhanStyleId).catch((error) => {
      captureAppException(error, { tags: { area: "notifications", phase: "adhan-channel" } });
    });
    // Preserve snoozes across cancel/rebuild so a foreground reschedule doesn't
    // erase an intentional deferral.
    const pending = await readPendingOsState();
    const now = new Date();
    const nextReminders =
      prefs.notificationPrefs.masterEnabled && (await getPermissionStatus()) === "granted"
        ? buildReminders(prefs, location, now, await collectReminderOptions())
        : [];
    const preciseAdhan = prefs.notificationPrefs.preciseAdhan === true;

    // Cancel only after we know what to arm. Schedule each reminder independently —
    // one iOS DATE reject must not leave the user with an empty pending set.
    // (`buildReminders` already dropped anything past the just-missed window;
    // `shouldArmReminder` skips the ones that window holds but the OS already showed.)
    await cancelAll();
    const nowMs = Date.now();
    for (const reminder of nextReminders) {
      if (!shouldArmReminder(reminder, pending, nowMs)) continue;
      try {
        await scheduleReminder(reminder, { preciseAdhan });
      } catch (error) {
        captureAppException(error, {
          tags: { area: "notifications", phase: "schedule" },
          extra: reminderScheduleExtra(reminder),
        });
      }
    }
    await restoreSnoozes(pending.snoozes);
  });
}

/**
 * Re-fires a reminder `SNOOZE_MINUTES` from now. Called when the user taps the
 * notification's Snooze action.
 */
export async function snoozeNotification(
  response: Notifications.NotificationResponse,
): Promise<void> {
  if (!isLocalNotificationSupported()) return;
  const { content } = response.notification.request;
  const data = content.data ?? {};
  const baseId =
    (data.reminderId as string | undefined) ?? (data.prayerId as string | undefined) ?? "prayer";
  await Notifications.scheduleNotificationAsync(
    snoozeRequest(`${SNOOZE_ID_PREFIX}${baseId}`, content, SNOOZE_MINUTES * 60),
  );
}

/**
 * Enqueues a mark command from the notification Mark action (no UI navigation).
 * Prefer named `mark-prayer` when the reminder carried prayerId + date.
 */
export async function markFromNotification(
  response: Notifications.NotificationResponse,
): Promise<void> {
  if (!isLocalNotificationSupported()) return;
  const data = response.notification.request.content.data as ReminderActionData | undefined;
  await nativeEnqueueCommand(markCommandFromReminderData(data));
}

/** Centre rows for what the OS actually has pending, one per title + body, soonest first. */
function rowsFromPending(
  scheduled: Notifications.NotificationRequest[],
  prefs: UserPreferences,
): ScheduledReminderRow[] {
  const now = Date.now();
  const parsed: (ScheduledReminderRow & { atMs: number })[] = [];
  for (const item of scheduled) {
    const atMs = parseScheduledTriggerAtMs(item.trigger as RawScheduledTrigger, now);
    if (atMs == null) continue;
    const fireAt = scheduledFireAtIso(atMs);
    if (!fireAt) continue;
    const date = new Date(atMs);
    parsed.push({
      id: item.identifier,
      title: item.content.title ?? i18n.t("notif.defaultTitle"),
      body: item.content.body ?? "",
      time: formatDisplayHhMm(date.getHours(), date.getMinutes(), prefs.timeFormat),
      route: (item.content.data as { route?: string } | undefined)?.route,
      fireAt,
      atMs,
    });
  }
  parsed.sort((a, b) => a.atMs - b.atMs);

  const seen = new Set<string>();
  const rows: ScheduledReminderRow[] = [];
  for (const { atMs: _atMs, ...row } of parsed) {
    const dedupeKey = `${row.title}\0${row.body}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    rows.push(row);
  }
  return rows.sort((a, b) => a.fireAt.localeCompare(b.fireAt));
}

/**
 * The notification centre's "upcoming" list: what the OS has pending, or — when
 * nothing is pending yet (fresh install, unsupported build) — what a reschedule
 * would arm.
 */
export async function listScheduled(
  prefs: UserPreferences,
  location: StoredLocation,
): Promise<ScheduledReminderRow[]> {
  if (isLocalNotificationSupported()) {
    const rows = rowsFromPending(await Notifications.getAllScheduledNotificationsAsync(), prefs);
    if (rows.length > 0) return rows;
  }
  if (!prefs.notificationPrefs.masterEnabled) return [];
  const now = new Date();
  return summarizeReminders(
    buildReminders(prefs, location, now, await collectReminderOptions()),
    prefs.timeFormat,
    now,
    location.timeZone,
  );
}
