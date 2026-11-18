import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "react-native";
import { PrayerScheduleCard } from "@/components/prayer-schedule-card";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { useHomeHero } from "@/hooks/use-home-hero";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { formatScheduleShare } from "@/lib/share";

const SHARE_KEY = "today-schedule";

export default function ScheduleScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const hero = useHomeHero();
  const { width } = useWindowDimensions();
  // Wide web / tablets (never TV): fixed + flexible timings side by side in a
  // moderate column rather than one list stretched across the canvas.
  const wide = !isTV() && width >= 1024;
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
      maxContentWidth={wide ? 960 : undefined}
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
        layout={wide ? "split" : "stack"}
      />
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/schedule");
