import { getLocalDateString, matchesEnabledKinds } from "@munib-tracker/shared/utils";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { FASTING_ICON } from "@/components/fasting/fasting-ui";
import {
  GoalReminderBanner,
  type GoalReminderModel,
} from "@/components/tracker/goal-reminder-banner";
import { useHijriAdjustment } from "@/hooks/use-hijri-adjustment";
import {
  classifyDate,
  fastingCalendarContext,
  headlineKind,
  voluntaryFastingHref,
} from "@/lib/voluntary-fasting";
import { usePreferences } from "@/stores/preferences-store";
import {
  useEnsureVoluntaryFastingLoaded,
  useVoluntaryFastEntry,
  useVoluntaryFastingEntries,
} from "@/stores/voluntary-fasting-store";

/** `hiddenHomeModules` id for this banner (Settings → Customize home). */
export const VOLUNTARY_FASTING_HOME_MODULE = "voluntary-fasting";

/**
 * Today's Goal reminder on a recommended fast day the user follows (NF-3.2) —
 * a model for the shared `GoalReminderStack` on Home. Hidden during an excused
 * period, on White Days (their own reminder covers them) and once today is logged.
 */
export function useVoluntaryFastGoalReminder(): GoalReminderModel | null {
  const router = useRouter();
  const { t } = useTranslation();
  const prefs = usePreferences();
  const hijriAdjustment = useHijriAdjustment();
  useEnsureVoluntaryFastingLoaded();
  const entries = useVoluntaryFastingEntries();
  const today = getLocalDateString();
  const todayEntry = useVoluntaryFastEntry(today);

  // biome-ignore lint/correctness/useExhaustiveDependencies: hijriAdjustment changes hijri.ts output.
  const ctx = useMemo(
    () => fastingCalendarContext(prefs, entries),
    [prefs, entries, hijriAdjustment],
  );
  const day = useMemo(() => classifyDate(today, ctx), [today, ctx]);

  if (prefs.hiddenHomeModules?.includes(VOLUNTARY_FASTING_HOME_MODULE)) return null;
  if (prefs.activeExcusedReason || todayEntry) return null;
  if (!matchesEnabledKinds(day, ctx.prefs)) return null;
  const kind = headlineKind(day.kinds);
  if (!kind || kind === "white_day") return null;

  const dayLabel = t(`voluntaryFasting.kind.${kind}`);
  return {
    id: "voluntary-fast",
    icon: FASTING_ICON,
    title: t("voluntaryFasting.goal.title", { day: dayLabel }),
    body: t("voluntaryFasting.goal.body"),
    tone: "accent",
    accessibilityLabel: t("voluntaryFasting.goal.a11y", { day: dayLabel }),
    onPress: () => router.push(voluntaryFastingHref(today) as Href),
  };
}

/** Standalone banner (Home stacks reminders via `GoalReminderStack`). */
export function VoluntaryFastGoalReminder() {
  const reminder = useVoluntaryFastGoalReminder();
  if (!reminder) return null;
  const { id: _id, ...props } = reminder;
  return <GoalReminderBanner {...props} />;
}
