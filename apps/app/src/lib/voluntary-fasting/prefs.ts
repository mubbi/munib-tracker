import {
  DEFAULT_VOLUNTARY_FASTING_NOTIFICATION_PREFS,
  DEFAULT_VOLUNTARY_FASTING_PREFS,
  type NotificationPreferences,
  VOLUNTARY_FAST_KINDS,
  type VoluntaryFastingNotificationPrefs,
  type VoluntaryFastingPrefs,
  type VoluntaryFastKind,
} from "@munib-tracker/shared/types";

const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;
const ISHA_PLUS = /^isha\+(\d{1,3})$/;
const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

/** Kinds the user can follow (generic months / "other" are always shown; Dawud has its own toggle). */
export const FOLLOWABLE_FAST_KINDS: readonly VoluntaryFastKind[] = VOLUNTARY_FAST_KINDS.filter(
  (kind) => kind !== "other" && kind !== "dawud",
);

/** Intention-reminder choices offered in the hub and in Settings › Reminders › Fasting. */
export const FASTING_INTENT_TIMES = ["20:00", "21:00", "22:00", "isha+30"] as const;
export type FastingIntentTime = (typeof FASTING_INTENT_TIMES)[number];

/** The stored intent time as one of the offered choices (unknown values show as 21:00). */
export function intentTimeChoice(value: string): FastingIntentTime {
  return (FASTING_INTENT_TIMES as readonly string[]).includes(value)
    ? (value as FastingIntentTime)
    : "21:00";
}

/** Max minutes after Isha for an `isha+N` intent time. */
export const MAX_ISHA_OFFSET_MINUTES = 240;

/** Parses the intent time: a wall clock, or minutes after Isha (clamped). */
export function parseIntentTime(
  value: string | undefined,
): { kind: "clock"; hhmm: string } | { kind: "isha"; minutes: number } {
  if (value && HH_MM.test(value)) return { kind: "clock", hhmm: value };
  const isha = value ? ISHA_PLUS.exec(value) : null;
  if (isha) {
    return { kind: "isha", minutes: Math.min(MAX_ISHA_OFFSET_MINUTES, Number(isha[1])) };
  }
  return { kind: "clock", hhmm: DEFAULT_VOLUNTARY_FASTING_PREFS.intentReminderTime };
}

/** Valid, de-duplicated prefs from a possibly malformed (older / synced) value. */
export function resolveVoluntaryFastingPrefs(raw: unknown): VoluntaryFastingPrefs {
  const d = DEFAULT_VOLUNTARY_FASTING_PREFS;
  if (raw == null || typeof raw !== "object") return { ...d, enabledKinds: [...d.enabledKinds] };
  const v = raw as Partial<VoluntaryFastingPrefs>;
  const enabledKinds = Array.isArray(v.enabledKinds)
    ? VOLUNTARY_FAST_KINDS.filter((kind) => (v.enabledKinds as unknown[]).includes(kind))
    : [...d.enabledKinds];
  const start = v.dawudMode?.startDate;
  const intent = parseIntentTime(v.intentReminderTime);
  return {
    enabledKinds,
    dawudMode: typeof start === "string" && DATE_KEY.test(start) ? { startDate: start } : null,
    intentReminderTime: intent.kind === "clock" ? intent.hhmm : `isha+${intent.minutes}`,
    suhoorAlarm: v.suhoorAlarm === true,
    isPilgrimThisYear: v.isPilgrimThisYear === true,
    pilgrimHijriYear:
      typeof v.pilgrimHijriYear === "number" && Number.isInteger(v.pilgrimHijriYear)
        ? v.pilgrimHijriYear
        : null,
  };
}

/** `notificationPrefs.voluntaryFasting` with defaults (weekly off, seasonal on). */
export function resolveFastingNotificationPrefs(
  n: Pick<NotificationPreferences, "voluntaryFasting"> | undefined,
): VoluntaryFastingNotificationPrefs {
  const raw = n?.voluntaryFasting;
  return {
    weekly:
      typeof raw?.weekly === "boolean"
        ? raw.weekly
        : DEFAULT_VOLUNTARY_FASTING_NOTIFICATION_PREFS.weekly,
    seasonal:
      typeof raw?.seasonal === "boolean"
        ? raw.seasonal
        : DEFAULT_VOLUNTARY_FASTING_NOTIFICATION_PREFS.seasonal,
  };
}

/** Toggle one kind in the followed list (keeps the canonical order). */
export function toggleEnabledKind(
  prefs: VoluntaryFastingPrefs,
  kind: VoluntaryFastKind,
): VoluntaryFastingPrefs {
  const has = prefs.enabledKinds.includes(kind);
  const next = has
    ? prefs.enabledKinds.filter((k) => k !== kind)
    : VOLUNTARY_FAST_KINDS.filter((k) => k === kind || prefs.enabledKinds.includes(k));
  return { ...prefs, enabledKinds: next };
}
