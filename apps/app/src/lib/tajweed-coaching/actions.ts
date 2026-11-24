import type { TajweedDrillHeadId, TajweedListenCategory } from "@munib-tracker/shared/types";

import type { DrillVerdict } from "@/lib/quran-companion/pronunciation/judge";
import { requestReminderReschedule } from "@/lib/quran-companion/reschedule";
import { quranCompanionPrefsStore } from "@/stores/quran-companion-prefs-store";
import { tajweedCoachingStore } from "@/stores/tajweed-coaching-store";

import { type RefreshOutcome, refreshCoachingPlan } from "./refresh";

/**
 * UI entry points for tajweed coaching. Each change can move the optional
 * tajweed line of the revision reminder, so reminders are rebuilt when the
 * reminder is on.
 */
function rescheduleIfReminderOn(): void {
  const prefs = quranCompanionPrefsStore.getState().prefs;
  if (prefs.revisionReminder && prefs.tajweedInRevisionReminder !== false) {
    requestReminderReschedule();
  }
}

export async function recordCoachingDrill(
  head: TajweedDrillHeadId,
  verdict: DrillVerdict,
): Promise<void> {
  await tajweedCoachingStore.getState().recordDrill(head, verdict);
  rescheduleIfReminderOn();
}

export async function recordCoachingListen(category: TajweedListenCategory): Promise<void> {
  await tajweedCoachingStore.getState().recordListen(category);
  rescheduleIfReminderOn();
}

export async function rebuildCoachingPlan(language?: string): Promise<RefreshOutcome> {
  const { outcome } = await refreshCoachingPlan({ language });
  rescheduleIfReminderOn();
  return outcome;
}
