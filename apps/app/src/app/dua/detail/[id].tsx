import { getDuaById } from "@munib-tracker/shared/content";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Share, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { ReadingCard } from "@/components/content/reading-card";
import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildDuaActivity } from "@/lib/continue-activity";
import { formatReadingShare } from "@/lib/share";
import { recordContinueActivity } from "@/stores/continue-store";
import {
  useDuaFavoritesActions,
  useEnsureDuaFavoritesLoaded,
  useIsFavoriteDua,
} from "@/stores/dua-favorites-store";

export default function DuaDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const params = useLocalSearchParams<{ id: string }>();
  const item = params.id ? getDuaById(params.id) : undefined;
  useEnsureDuaFavoritesLoaded();
  const isFavorite = useIsFavoriteDua(item?.id ?? "");
  const { toggle } = useDuaFavoritesActions();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (item) recordContinueActivity(buildDuaActivity(item));
  }, [item]);

  if (!item) {
    return (
      <ScreenLayout
        title={t("dua.detailEyebrow")}
        onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      >
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("dua.notFoundTitle")}
          description={t("dua.notFoundDesc")}
        />
      </ScreenLayout>
    );
  }

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const onShare = async () => {
    const message = formatReadingShare(item);
    if (Platform.OS === "web") {
      const nav = typeof navigator !== "undefined" ? navigator : undefined;
      try {
        if (nav?.share) {
          await nav.share({ text: message });
        } else if (nav?.clipboard?.writeText) {
          await nav.clipboard.writeText(message);
          showToast(t("reading.copied"));
        }
      } catch {
        // user cancelled or share/clipboard unavailable
      }
      return;
    }
    try {
      await Share.share({ message });
    } catch {
      // user cancelled or share unavailable
    }
  };

  return (
    <ScreenLayout
      eyebrow={t("dua.detailEyebrow")}
      title={item.title}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Stagger>
        <ReadingCard
          item={item}
          sourceHref={`/dua/detail/${item.id}`}
          isFavorite={isFavorite}
          onToggleFavorite={() => toggle(item.id)}
        />
        <Button
          label={t("dua.share")}
          variant="secondary"
          icon={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
          fullWidth
          onPress={onShare}
        />
        {toast ? (
          <Animated.View
            entering={FadeIn.duration(160)}
            style={[styles.toast, { backgroundColor: colors.foreground }]}
          >
            <ThemedText type="small" style={{ color: colors.background }}>
              {toast}
            </ThemedText>
          </Animated.View>
        ) : null}
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  toast: {
    alignSelf: "center",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: 999,
    borderCurve: "continuous",
  },
});
