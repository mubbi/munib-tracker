import { coachReminderOptions } from "@/lib/coach/reminder-options";
import { familyTiesReminderOptions } from "@/lib/family-ties/reminder-options";
import { iqamahReminderOptions } from "@/lib/masjid/iqamah-reminder-options";
import { muhasabahReminderOptions } from "@/lib/muhasabah/reminder-options";
import {
  type BuildRemindersOptions,
  hasOutstandingQazaDebt,
} from "@/lib/notifications/build-reminders";
import { dhulHijjahReminderOptions } from "@/lib/notifications/dhul-hijjah-reminder-options";
import { sunnahHabitsReminderOptions } from "@/lib/notifications/sunnah-habits-reminder-options";
import { vaultReminderOptions } from "@/lib/notifications/vault-reminder-options";
import { quranRevisionReminderOptions } from "@/lib/quran-companion/reminder-options";
import { rawatibNudgeOptions } from "@/lib/rawatib-nudge";
import { captureAppException } from "@/lib/sentry";
import { voluntaryFastingReminderOptions } from "@/lib/voluntary-fasting/reminder-options";
import { trackerStore } from "@/stores/tracker-store";

/**
 * One feature's input failed to load: report it and build without that feature,
 * so a storage hiccup in (say) the habits log never stops the Salah reminders
 * from being re-armed.
 */
async function orEmpty<T>(source: string, load: () => Promise<T>): Promise<T | undefined> {
  try {
    return await load();
  } catch (error) {
    captureAppException(error, { tags: { area: "notifications", phase: "options", source } });
    return undefined;
  }
}

/**
 * Everything `buildReminders` needs beyond preferences + location, shared by the
 * native and web schedulers. The feature stores are lazy and usually not loaded
 * at launch, so each source reads its own repository / vault document; they are
 * independent, so they load in parallel.
 */
export async function collectReminderOptions(): Promise<BuildRemindersOptions> {
  const { qazaCounters, roza } = trackerStore.getState();
  const [
    quranRevision,
    voluntaryFasting,
    sunnahHabits,
    dhulHijjah,
    rawatib,
    iqamah,
    muhasabah,
    familyTies,
    coach,
    vaultRecords,
  ] = await Promise.all([
    orEmpty("quranRevision", () => quranRevisionReminderOptions()),
    orEmpty("voluntaryFasting", voluntaryFastingReminderOptions),
    // NF-3.5 habits (selected / bedtime counts) + NF-3.3 udhiyah intention flags.
    orEmpty("sunnahHabits", sunnahHabitsReminderOptions),
    orEmpty("dhulHijjah", dhulHijjahReminderOptions),
    // NF-3.1 opt-in after-fard rawatib nudge (today's unlogged after-rows).
    orEmpty("rawatib", () => rawatibNudgeOptions()),
    // NF-3.11 home-masjid iqamah reminders (private/public times only).
    orEmpty("iqamah", () => iqamahReminderOptions()),
    orEmpty("muhasabah", muhasabahReminderOptions),
    orEmpty("familyTies", familyTiesReminderOptions),
    // NF-3.14 weekly coach (recent-activity flag only).
    orEmpty("coach", () => coachReminderOptions()),
    // NF-3.8 / NF-3.9: debts due + wasiyyah review (vault dates only).
    orEmpty("vault", vaultReminderOptions),
  ]);
  return {
    hasQazaDebt: hasOutstandingQazaDebt(qazaCounters, roza),
    ...quranRevision,
    ...voluntaryFasting,
    ...sunnahHabits,
    ...dhulHijjah,
    ...rawatib,
    ...iqamah,
    muhasabah,
    familyTies,
    ...coach,
    ...vaultRecords,
  };
}
