import { getDuaById } from "@munib-tracker/shared/content";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Platform, Share } from "react-native";

import { ReadingCard } from "@/components/content/reading-card";
import { ScreenLayout } from "@/components/screen-layout";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";

export default function DuaDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const item = params.id ? getDuaById(params.id) : undefined;

  if (!item) {
    return (
      <ScreenLayout title="Dua" onBack={router.canGoBack() ? () => router.back() : undefined}>
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title="Dua not found"
          description="This item may have been removed."
        />
      </ScreenLayout>
    );
  }

  const onShare = async () => {
    if (Platform.OS === "web") return;
    try {
      await Share.share({
        message: `${item.title}\n\n${item.arabic}\n\n${item.transliteration}\n\n${item.translation}${item.reference ? `\n\n— ${item.reference}` : ""}`,
      });
    } catch {
      // cancelled
    }
  };

  return (
    <ScreenLayout
      eyebrow="Dua"
      title={item.title}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <ReadingCard item={item} />
        {Platform.OS !== "web" ? (
          <Button
            label="Share"
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
