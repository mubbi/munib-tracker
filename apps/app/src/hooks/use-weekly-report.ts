import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import {
  buildWeeklyReport,
  getLocalDateString,
  shouldDeliverWeeklyReport,
} from "@munib-tracker/shared/utils";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { PrayerRepository, QazaRepository, ZikrRepository } from "@/db";
import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { maybeDeliverReviewReactivation } from "@/features/reviews/lib/maybeDeliverReviewReactivation";
import { scheduleReviewTriggerFromWake } from "@/features/reviews/lib/reviewPendingTrigger";
import { useInAppNotifications } from "@/providers/in-app-notifications-provider";

/**
 * Delivers an in-app weekly worship report (NF-1.6) at most once every 7 days.
 * Runs from the home screen; skips empty weeks so new users aren't nagged. The
 * report deep-links to the statistics screen.
 */
export function useWeeklyReport(): void {
  const { deliver } = useInAppNotifications();
  const { t } = useTranslation();

  useEffect(() => {
    let active = true;
    void (async () => {
      const lastAt = await readJSON<string | undefined>(DB_KEYS.weeklyReportAt, undefined);
      const today = getLocalDateString();
      if (!shouldDeliverWeeklyReport(lastAt, today)) return;

      const [prayerLogs, zikrProgress, qazaDailyProgress] = await Promise.all([
        PrayerRepository.getAll(),
        ZikrRepository.getAll(),
        QazaRepository.getAllDailyProgress(),
      ]);
      const report = buildWeeklyReport({ today, prayerLogs, zikrProgress, qazaDailyProgress });

      const hasActivity =
        report.prayersCompleted > 0 || report.zikrSessions > 0 || report.qazaCleared > 0;
      // Mark as handled regardless so an inactive week doesn't re-check every mount.
      await writeJSON(DB_KEYS.weeklyReportAt, new Date().toISOString());
      if (!active || !hasActivity) return;

      await deliver({
        kind: "system",
        id: `weekly-${today}`,
        title: t("weeklyReport.title"),
        body: t("weeklyReport.body", {
          prayers: report.prayersCompleted,
          perfect: report.perfectDays,
          qaza: report.qazaCleared,
          zikr: report.zikrSessions,
        }),
        route: "/statistics",
      });
      void scheduleReviewTriggerFromWake(APP_FEEDBACK_TRIGGER_IDS.weekly_report);
      void maybeDeliverReviewReactivation(APP_FEEDBACK_TRIGGER_IDS.weekly_report);
    })();
    return () => {
      active = false;
    };
  }, [deliver, t]);
}
