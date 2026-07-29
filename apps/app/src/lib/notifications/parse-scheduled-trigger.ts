/** Loose shape returned by `getAllScheduledNotificationsAsync` across platforms. */
export type RawScheduledTrigger = {
  type?: string;
  hour?: number;
  minute?: number;
  date?: number | string;
  timestamp?: number;
  /** Android `DateTrigger` serializes fire time here (milliseconds). */
  value?: number;
  seconds?: number;
  dateComponents?: {
    hour?: number;
    minute?: number;
    day?: number;
    month?: number;
    weekday?: number;
  };
  channelId?: string;
  repeats?: boolean;
} | null;

function coerceEpochToMs(raw: number | string | null | undefined): number | null {
  if (raw == null) return null;
  if (typeof raw === "string") {
    const ms = new Date(raw).getTime();
    return Number.isFinite(ms) ? ms : null;
  }
  if (typeof raw === "number" && Number.isFinite(raw)) {
    // Seconds since epoch are ~1e9 today; milliseconds are ~1e12+.
    return raw > 1e12 ? raw : raw * 1000;
  }
  return null;
}

/** Parses a native scheduled trigger into an absolute fire time (epoch ms), if possible. */
export function parseScheduledTriggerAtMs(
  trigger: RawScheduledTrigger,
  nowMs = Date.now(),
): number | null {
  if (!trigger || typeof trigger !== "object") return null;

  if (trigger.type === "timeInterval" && typeof trigger.seconds === "number") {
    const ms = nowMs + trigger.seconds * 1000;
    return Number.isFinite(ms) ? ms : null;
  }

  const instantRaw = trigger.value ?? trigger.timestamp ?? trigger.date;
  if (trigger.type === "date" || instantRaw != null) {
    return coerceEpochToMs(instantRaw as number | string);
  }

  const hour =
    typeof trigger.hour === "number"
      ? trigger.hour
      : typeof trigger.dateComponents?.hour === "number"
        ? trigger.dateComponents.hour
        : null;
  const minute =
    typeof trigger.minute === "number"
      ? trigger.minute
      : typeof trigger.dateComponents?.minute === "number"
        ? trigger.dateComponents.minute
        : 0;

  if (hour != null) {
    const next = new Date();
    next.setHours(hour, minute ?? 0, 0, 0);
    if (next.getTime() <= nowMs) next.setDate(next.getDate() + 1);
    const ms = next.getTime();
    return Number.isFinite(ms) ? ms : null;
  }

  return null;
}

/** ISO string for UI rows — never throws on out-of-range values. */
export function scheduledFireAtIso(ms: number): string | null {
  if (!Number.isFinite(ms) || ms < -8.64e15 || ms > 8.64e15) return null;
  try {
    return new Date(ms).toISOString();
  } catch {
    return null;
  }
}
