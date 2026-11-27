import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { RetryCard } from "@/components/ui/retry-card";
import { Sheet } from "@/components/ui/sheet";
import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type TafsirAyahSheetProps = {
  visible: boolean;
  onClose: () => void;
  surah: number;
  ayah: number;
  editionName: string;
  author: string;
  text: string | null | undefined;
  direction: "ltr" | "rtl";
  loading: boolean;
  /** The tafsir download failed (offline or a CDN error) and nothing is cached. */
  offline: boolean;
  /** Re-runs the tafsir download — shown as "Try again" on a failed load (C-02). */
  onRetry?: () => void;
};

export function TafsirAyahSheet({
  visible,
  onClose,
  surah,
  ayah,
  editionName,
  author,
  text,
  direction,
  loading,
  offline,
  onRetry,
}: TafsirAyahSheetProps) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const trimmed = text?.trim() ?? "";
  const empty = !loading && !offline && trimmed.length === 0;

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      variant="bottom"
      scrollable={false}
      solid
      title={t("quran.tafsir")}
    >
      <View style={styles.header}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quran.ayahRef", { surah, ayah })}
        </ThemedText>
        <ThemedText type="small" numberOfLines={2}>
          {editionName}
        </ThemedText>
        {author ? (
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {author}
          </ThemedText>
        ) : null}
      </View>

      <TvScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator
      >
        {loading ? (
          <SkeletonGroup accessibilityLabel={t("quran.tafsirLoading")} style={styles.skeleton}>
            <Skeleton height={14} />
            <Skeleton height={14} />
            <Skeleton height={14} width="85%" />
            <Skeleton height={14} width="60%" />
          </SkeletonGroup>
        ) : offline ? (
          onRetry ? (
            <RetryCard message={t("quran.tafsirOffline")} offline onRetry={onRetry} />
          ) : (
            <ThemedText type="default" themeColor="mutedForeground" style={styles.message}>
              {t("quran.tafsirOffline")}
            </ThemedText>
          )
        ) : empty ? (
          <ThemedText type="default" themeColor="mutedForeground" style={styles.message}>
            {t("quran.tafsirEmpty")}
          </ThemedText>
        ) : (
          <ThemedText
            type="default"
            style={[
              styles.text,
              direction === "rtl" ? styles.rtl : null,
              { color: colors.foreground },
            ]}
          >
            {trimmed}
          </ThemedText>
        )}
      </TvScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
    marginBottom: Spacing.three,
  },
  body: {
    maxHeight: 420,
  },
  bodyContent: {
    paddingBottom: Spacing.four,
  },
  skeleton: {
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  message: {
    lineHeight: 22,
    paddingVertical: Spacing.two,
  },
  text: {
    lineHeight: 26,
  },
  rtl: {
    writingDirection: "rtl",
    textAlign: "right",
  },
});
