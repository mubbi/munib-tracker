import type { MilestoneProgress } from "@munib-tracker/shared/achievements";
import i18n from "@/i18n";
import { milestoneDescription, milestoneTitle } from "@/lib/achievements-i18n";

/** Visible title lines in the notification center list row. */
export const IN_APP_NOTIFICATION_TITLE_LINES = 2;

/** Visible body lines in the notification center list row. */
export const IN_APP_NOTIFICATION_BODY_LINES = 3;

export function buildAchievementInAppNotification(milestone: MilestoneProgress): {
  title: string;
  body: string;
} {
  return {
    title: i18n.t("notif.reminders.achievementTitle"),
    body: i18n.t("achievements.inAppBody", {
      name: milestoneTitle(milestone),
      description: milestoneDescription(milestone),
    }),
  };
}
