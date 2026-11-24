import type { CoachGoalTemplate, CoachInsight } from "@munib-tracker/shared/types";
import type { Href } from "expo-router";
import type { TFunction } from "i18next";

import type { EvidenceRef } from "@/components/self-review/evidence-links";
import { settingHref } from "@/lib/settings/routes";

export { COACH_HOME_MODULE, COACH_ROUTE } from "./constants";

/** Routes that belong on a personal device (vault screens, focus lock) — no action button on TV. */
const PHONE_ONLY_ROUTES = new Set(["/family-ties", "/muhasabah", "/focus-lock"]);

/** Where an insight's action goes; a few map onto settings rows. */
export function coachActionHref(insight: CoachInsight): Href | null {
  const action = insight.action;
  if (!action) return null;
  if (action.route === "/settings/reminder-offsets") {
    const prayer = typeof insight.params.prayer === "string" ? insight.params.prayer : "fajr";
    return settingHref(`notifications.salah.offset.${prayer}`) as Href;
  }
  if (action.route === "/settings/bedtime")
    return settingHref("notifications.zikr.bedtime") as Href;
  return action.route as Href;
}

export function isCoachActionAvailable(insight: CoachInsight, tv: boolean): boolean {
  return insight.action != null && !(tv && PHONE_ONLY_ROUTES.has(insight.action.route));
}

/** A corpus id (`bukhari:6464`) as an evidence link (by reference — no text typed). */
export function coachEvidenceRef(id: string): EvidenceRef | null {
  const [collection, number] = id.split(":");
  if (!collection || !number) return null;
  return {
    kind: "hadith",
    collection,
    number,
    labelKey: `coach.evidenceRef.${collection}${number}`,
  };
}

function weekdayName(weekday: number, locale: string): string {
  // 2024-01-07 was a Sunday.
  return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(
    new Date(2024, 0, 7 + weekday),
  );
}

function formatDate(date: string, locale: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1),
  );
}

/**
 * Interpolation values for an insight's copy: prayer and weekday ids become
 * localized names, dates are formatted, habit ids resolve through `habitTitle`.
 */
export function coachCopyParams(
  params: CoachInsight["params"],
  t: TFunction,
  locale: string,
  habitTitle: (id: string) => string,
): Record<string, string | number> {
  const out: Record<string, string | number> = { ...params };
  if (typeof params.prayer === "string") out.prayer = t(`prayers.${params.prayer}`);
  if (typeof params.weekday === "number") out.weekday = weekdayName(params.weekday, locale);
  if (typeof params.date === "string") out.date = formatDate(params.date, locale);
  if (typeof params.habit === "string") out.habit = habitTitle(params.habit);
  return out;
}

type CopyValues = Record<string, string | number>;

export function coachInsightTitle(insight: CoachInsight, t: TFunction, values: CopyValues): string {
  const key: string = `${insight.copyKey}.title`;
  return t(key, values);
}

export function coachInsightBody(insight: CoachInsight, t: TFunction, values: CopyValues): string {
  const key: string = insight.variant
    ? `${insight.copyKey}.body.${insight.variant}`
    : `${insight.copyKey}.body`;
  return t(key, values);
}

/** "All five on time — 4 of 7 days" style line for a micro-goal. */
export function coachGoalLabel(goal: CoachGoalTemplate, t: TFunction): string {
  return t(`coach.goal.kind.${goal.kind}`, {
    target: goal.target,
    prayer: goal.prayerId ? t(`prayers.${goal.prayerId}`) : "",
  });
}

export function coachWeekdayName(weekday: number, locale: string): string {
  return weekdayName(weekday, locale);
}

export function coachDateLabel(date: string, locale: string): string {
  return formatDate(date, locale);
}
