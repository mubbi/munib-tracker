import type { PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { shouldRemindAfterSalahAdhkar } from "@/lib/after-salah-adhkar-reminder";
import { useToast } from "@/providers/toast-provider";

export function useAfterSalahAdhkarReminder() {
  const toast = useToast();
  const { t } = useTranslation();

  return useCallback(
    (prayerId: PrayerId, previous: PrayerStatus, next: PrayerStatus) => {
      if (!shouldRemindAfterSalahAdhkar(prayerId, previous, next)) return;
      toast.info(
        t("tracker.afterSalahAdhkarReminderTitle", { prayer: t(`prayers.${prayerId}`) }),
        t("tracker.afterSalahAdhkarReminderBody"),
      );
    },
    [t, toast],
  );
}
