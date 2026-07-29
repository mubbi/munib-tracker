import type { MilestoneProgress } from "@munib-tracker/shared/achievements";
import i18n from "@/i18n";

/**
 * `MilestoneProgress.titleKey`/`descriptionKey` are i18n keys, not display text
 * — `packages/shared/achievements` has no i18n runtime of its own. Resolve them
 * here at display time (screens, notifications, share cards, widgets).
 */
export function milestoneTitle(
  milestone: Pick<MilestoneProgress, "titleKey" | "titleParams">,
): string {
  return i18n.t(milestone.titleKey, milestone.titleParams);
}

export function milestoneDescription(
  milestone: Pick<MilestoneProgress, "descriptionKey" | "descriptionParams">,
): string {
  return i18n.t(milestone.descriptionKey, milestone.descriptionParams);
}
