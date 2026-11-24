import type { UserPreferences } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";

import i18n from "@/i18n";
import { debtReminderDates } from "@/lib/debts/debts";
import type { StoredLocation } from "@/lib/location";
import { wallClockInTimeZoneToDate } from "@/lib/time";
import { wasiyyahReviewReminderDates } from "@/lib/wasiyyah/review";

import type { BuiltReminder } from "./build-reminders";

/**
 * Reminders built from the encrypted vault (NF-3.8 debts due, NF-3.9 wasiyyah
 * review). Privacy (§2.4): titles and bodies are generic — never a name, an
 * amount or a count. The inputs are dates only, computed by
 * `vault-reminder-options.ts` while the app is unlocked.
 */
export interface VaultReminderOptions {
  /** Open records' due dates (YYYY-MM-DD). */
  debtDueDates?: string[];
  /** When the wasiyyah review is due (YYYY-MM-DD), or null/undefined without a saved will. */
  wasiyyahReviewDueOn?: string | null;
}

/** How far ahead vault reminders are armed (rescheduled on every foreground). */
export const VAULT_REMINDER_HORIZON_DAYS = 14;
const DEBTS_TIME = { hour: 9, minute: 0 };
const WASIYYAH_TIME = { hour: 10, minute: 0 };

function atLocal(day: string, time: { hour: number; minute: number }, tz?: string): Date {
  const [y, m, d] = day.split("-").map(Number) as [number, number, number];
  return wallClockInTimeZoneToDate(y, m, d, time.hour, time.minute, tz);
}

export function pushVaultRecordReminders(
  reminders: BuiltReminder[],
  input: {
    prefs: UserPreferences;
    location: StoredLocation;
    now: Date;
    options: VaultReminderOptions;
    priority: { debts: number; wasiyyahReview: number };
  },
): void {
  const { prefs, location, now, options, priority } = input;
  const n = prefs.notificationPrefs;
  const today = getLocalDateString(now);
  // D31: debt due dates are commitments to people, so they keep firing during excused
  // periods. §2.5 still pauses the wasiyyah review nudge below.
  const excused = Boolean(prefs.activeExcusedReason);

  if (n.debts !== false && options.debtDueDates?.length) {
    const days = debtReminderDates(
      options.debtDueDates.map((dueOn) => ({ status: "open" as const, dueOn })),
      today,
      VAULT_REMINDER_HORIZON_DAYS,
    );
    for (const day of days) {
      reminders.push({
        id: `debts:${day}`,
        fireAt: atLocal(day, DEBTS_TIME, location.timeZone),
        title: i18n.t("debts.notif.title"),
        body: i18n.t("debts.notif.body"),
        channelId: "zikr",
        repeat: "date",
        route: "/debts",
        priority: priority.debts,
      });
    }
  }

  if (!excused && n.wasiyyahReview !== false && options.wasiyyahReviewDueOn) {
    const days = wasiyyahReviewReminderDates(
      options.wasiyyahReviewDueOn,
      today,
      VAULT_REMINDER_HORIZON_DAYS,
    );
    for (const day of days) {
      reminders.push({
        id: `wasiyyahReview:${day}`,
        fireAt: atLocal(day, WASIYYAH_TIME, location.timeZone),
        title: i18n.t("wasiyyah.notif.title"),
        body: i18n.t("wasiyyah.notif.body"),
        channelId: "zikr",
        repeat: "date",
        route: "/wasiyyah",
        priority: priority.wasiyyahReview,
      });
    }
  }
}
