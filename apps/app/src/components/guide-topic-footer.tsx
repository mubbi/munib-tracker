import { usePathname } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { LessonCompleteButton } from "@/components/lesson-complete-button";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/config/seo";
import { Spacing } from "@/constants/theme";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { formatGuideShare } from "@/lib/share";

type GuideTopic = {
  id: string;
  title: string;
  summary?: string;
  body?: string[];
};

type GuideTopicFooterProps = {
  /** i18n namespace that owns the `markComplete` / `markIncomplete` labels. */
  ns: string;
  topic: GuideTopic;
  /** Translated section name shown on the share card (e.g. "Aqeedah"). */
  sectionTitle: string;
  completed?: boolean;
  onToggleComplete?: () => void;
  /** When false, only the share button is shown. */
  showComplete?: boolean;
};

/** Share + optional mark-complete actions at the bottom of learn-section topic pages. */
export function GuideTopicFooter({
  ns,
  topic,
  sectionTitle,
  completed = false,
  onToggleComplete,
  showComplete = true,
}: GuideTopicFooterProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const shareCard = useShareContentCard();
  const pageUrl = absoluteUrl(pathname);

  const onShare = async () => {
    await shareCard.share({
      message: formatGuideShare({
        title: topic.title,
        summary: topic.summary,
        path: pathname,
        bodyExcerpt: topic.body?.[0],
        readAtLabel: t("share.guideReadAt"),
      }),
      sectionTitle,
      contentLabel: topic.title,
      filenameSlug: "guide",
      shareKey: topic.id,
      content: {
        kind: "guide",
        title: topic.title,
        summary: topic.summary ?? "",
        excerpt: topic.body?.[0],
        url: pageUrl,
      },
    });
  };

  return (
    <>
      {shareCard.SnapshotHost}
      <View style={styles.actions}>
        <Button
          label={
            shareCard.isSharing(topic.id)
              ? t("share.preparing")
              : shareCard.isGesturePending(topic.id)
                ? t("share.tapToShare")
                : t("reading.share")
          }
          variant="secondary"
          fullWidth
          icon={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
          disabled={shareCard.isSharing(topic.id)}
          onPress={onShare}
        />
        {showComplete && onToggleComplete ? (
          <LessonCompleteButton ns={ns} completed={completed} onToggle={onToggleComplete} />
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: Spacing.two,
  },
});
