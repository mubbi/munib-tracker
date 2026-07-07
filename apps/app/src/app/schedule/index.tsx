import { useRouter } from "expo-router";
import { goBackOrReplace } from "@/lib/navigation";
import { useTranslation } from "react-i18next";

import { PrayerScheduleCard } from "@/components/prayer-schedule-card";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { useHomeHero } from "@/hooks/use-home-hero";

export default function ScheduleScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const hero = useHomeHero();

  return (
    <ScreenLayout
      eyebrow={t("schedule.eyebrow")}
      title={t("home.scheduleTitle")}
      subtitle={t("schedule.subtitle")}
      onBack={() => (goBackOrReplace(router, "/"))}
    >
      <Seo path="/schedule" />
      <PrayerScheduleCard
        schedule={hero.schedule}
        nextIn={hero.nextIn}
        nextScheduleId={hero.nextScheduleId}
      />
    </ScreenLayout>
  );
}
