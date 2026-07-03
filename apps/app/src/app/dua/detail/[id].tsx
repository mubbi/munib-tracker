import { getDuaById } from "@munib-tracker/shared/content";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Platform, Share } from "react-native";

import { ReadingCard } from "@/components/content/reading-card";
import { ScreenLayout } from "@/components/screen-layout";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { formatReadingShare } from "@/lib/share";

export default function DuaDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id: string }>();
  const item = params.id ? getDuaById(params.id) : undefined;

  if (!item) {
    return (
      <ScreenLayout
        title={t("dua.detailEyebrow")}
        onBack={router.canGoBack() ? () => router.back() : undefined}
      >
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("dua.notFoundTitle")}
          description={t("dua.notFoundDesc")}
        />
      </ScreenLayout>
    );
  }

  const onShare = async () => {
    if (Platform.OS === "web") return;
    try {
      await Share.share({ message: formatReadingShare(item) });
    } catch {
      // cancelled
    }
  };

  return (
    <ScreenLayout
      eyebrow={t("dua.detailEyebrow")}
      title={item.title}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <ReadingCard item={item} />
        {Platform.OS !== "web" ? (
          <Button
            label={t("dua.share")}
            variant="secondary"
            icon={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
            fullWidth
            onPress={onShare}
          />
        ) : null}
      </Stagger>
    </ScreenLayout>
  );
}
