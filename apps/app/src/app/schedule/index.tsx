import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { PrayerScheduleCard } from "@/components/prayer-schedule-card";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { useHomeHero } from "@/hooks/use-home-hero";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { goBackOrReplace } from "@/lib/navigation";
import { formatScheduleShare } from "@/lib/share";

const SHARE_KEY = "today-schedule";

export default function ScheduleScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const hero = useHomeHero();
  const { share, isSharing, isGesturePending, SnapshotHost } = useShareContentCard();

  const onShare = async () => {
    const dateLabel = hero.displayDates.primary;
    const locationLabel = hero.location || undefined;
    const items = hero.schedule.map((item) => ({
      id: item.id,
      name: item.name,
      time: item.time,
      kind: item.kind,
      status: item.status,
    }));

    await share({
      message: formatScheduleShare({
        dateLabel,
        locationLabel,
        items,
        nextScheduleId: hero.nextScheduleId,
        nextIn: hero.nextIn,
      }),
      sectionTitle: t("share.sectionSchedule"),
      contentLabel: locationLabel ? `${dateLabel} · ${locationLabel}` : dateLabel,
      filenameSlug: "schedule",
      shareKey: SHARE_KEY,
      content: {
        kind: "schedule",
        dateLabel,
        locationLabel,
        items,
        nextScheduleId: hero.nextScheduleId,
        nextIn: hero.nextIn,
      },
    });
  };

  return (
    <ScreenLayout
      eyebrow={t("schedule.eyebrow")}
      title={t("home.scheduleTitle")}
      subtitle={t("schedule.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      {SnapshotHost}
      <Seo path="/schedule" />
      <PrayerScheduleCard
        schedule={hero.schedule}
        nextIn={hero.nextIn}
        nextScheduleId={hero.nextScheduleId}
        onShare={onShare}
        shareLoading={isSharing(SHARE_KEY)}
        shareGesturePending={isGesturePending(SHARE_KEY)}
      />
    </ScreenLayout>
  );
}
