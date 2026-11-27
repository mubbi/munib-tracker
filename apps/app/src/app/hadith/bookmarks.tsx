import type { HadithItem } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { ContentState } from "@/components/ui/content-state";
import { EmptyState } from "@/components/ui/empty-state";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { Stagger } from "@/components/ui/stagger";
import { TvUndoButton } from "@/components/ui/tv-undo-button";
import { Radius, Spacing } from "@/constants/theme";
import { HadithRepository } from "@/db";
import type { BookmarkedHadith } from "@/db/repositories/hadith-repository";
import { useHadithTranslation } from "@/hooks/use-hadith-translation";
import { useProgressiveList } from "@/hooks/use-progressive-list";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { arabicReadingLayout } from "@/lib/reading-typography";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { buildHadithSharePayload } from "@/lib/share";
import { resolveHadithTranslation } from "@/lib/translation-locale";

import { usePreferences } from "@/stores/preferences-store";

function BookmarkHadithPreview({ item }: { item: HadithItem }) {
  const displayTranslation = useHadithTranslation(item);
  return (
    <ThemedText type="small" themeColor="mutedForeground" numberOfLines={2}>
      {displayTranslation}
    </ThemedText>
  );
}

export default function HadithBookmarksScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { fontPrefs, translationLocale } = usePreferences();
  const arabicSize = fontPrefs.arabic.size;
  const { share, isSharing, isGesturePending, SnapshotHost } = useShareContentCard();
  const tv = isTV();

  const [entries, setEntries] = useState<BookmarkedHadith[]>([]);
  const shownEntries = useProgressiveList(entries, { initial: 10, batch: 10 });
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const undoToast = useUndoToast();

  // A failed load shows Try again instead of a skeleton that never resolves (B-26).
  // biome-ignore lint/correctness/useExhaustiveDependencies: `attempt` re-runs the load on retry
  useEffect(() => {
    let active = true;
    setStatus("loading");
    HadithRepository.getBookmarkedHadiths().then(
      (list) => {
        if (!active) return;
        setEntries(list);
        setStatus("ready");
      },
      () => {
        if (active) setStatus("error");
      },
    );
    return () => {
      active = false;
    };
  }, [attempt]);

  // Un-save is instant with Undo; Undo puts back the exact record and its place.
  const remove = (entry: BookmarkedHadith) => {
    const hadithId = entry.bookmark.hadithId;
    let removed: BookmarkedHadith["bookmark"] | null = null;
    let index = -1;
    void undoToast.run({
      do: async () => {
        removed = await HadithRepository.removeBookmark(hadithId);
        setEntries((prev) => {
          index = prev.findIndex((e) => e.bookmark.hadithId === hadithId);
          return prev.filter((e) => e.bookmark.hadithId !== hadithId);
        });
      },
      undo: async () => {
        if (!removed || !(await HadithRepository.restoreBookmark(removed))) return;
        setEntries((prev) => {
          if (prev.some((e) => e.bookmark.hadithId === hadithId)) return prev;
          const next = [...prev];
          next.splice(index < 0 ? next.length : Math.min(index, next.length), 0, entry);
          return next;
        });
      },
      messageKey: "hadith.removedFromSaved",
    });
  };

  const shareEntry = useCallback(
    (entry: BookmarkedHadith) => {
      const { arabic, reference } = entry.item;
      const translation = resolveHadithTranslation(entry.item, { translationLocale });
      void share({
        ...buildHadithSharePayload(arabic, translation, reference, {
          sectionTitle: t("share.sectionHadith"),
          contentLabel: reference,
        }),
        shareKey: entry.item.id,
      });
    },
    [share, t, translationLocale],
  );

  const open = (entry: BookmarkedHadith) =>
    router.push({
      pathname: "/hadith/[collection]",
      params: { collection: entry.item.collection, q: entry.item.reference },
    });

  return (
    <ScreenLayout
      eyebrow={t("hadith.title")}
      title={t("hadith.bookmarks")}
      subtitle={t("hadith.bookmarksSubtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      {SnapshotHost}
      <Seo path="/hadith/bookmarks" />
      <TvUndoButton controller={undoToast} preferredFocus />
      {status === "loading" ? (
        <ContentState status="loading" skeleton="rows" />
      ) : status === "error" ? (
        <ContentState status="error" onRetry={() => setAttempt((n) => n + 1)} />
      ) : entries.length === 0 ? (
        <EmptyState
          icon={{ ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }}
          title={t("hadith.bookmarksEmpty")}
          actionLabel={t("hadith.title")}
          onAction={() => router.push("/hadith")}
        />
      ) : (
        <Card>
          <Stagger>
            {/* Wide web / tablets: saved hadith in two columns (TV keeps one). */}
            <ResponsiveGrid columns={tv ? 1 : undefined} maxColumns={2} gap={Spacing.two}>
              {shownEntries.map((entry) => (
                <View
                  key={entry.bookmark.id}
                  style={[styles.row, { backgroundColor: colors.muted }]}
                >
                  <PressableScale
                    haptic="light"
                    accessibilityRole="button"
                    accessibilityLabel={entry.item.reference}
                    onPress={() => open(entry)}
                    style={styles.rowContent}
                  >
                    <ThemedText
                      type="smallBold"
                      style={{ color: tokens.accentOnSoft }}
                      numberOfLines={1}
                    >
                      {entry.item.reference}
                    </ThemedText>
                    {entry.item.arabic ? (
                      <ThemedText
                        type="arabic"
                        accessibilityLanguage="ar"
                        numberOfLines={2}
                        style={[styles.arabic, arabicSize ? arabicReadingLayout(arabicSize) : null]}
                      >
                        {entry.item.arabic}
                      </ThemedText>
                    ) : null}
                    <BookmarkHadithPreview item={entry.item} />
                  </PressableScale>
                  <View style={styles.actions}>
                    {/* No share sheet on TV (phone-only capability). */}
                    {tv ? null : (
                      <LabeledIconButton
                        name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
                        label={
                          isGesturePending(entry.item.id)
                            ? t("share.tapToShare")
                            : t("common.share")
                        }
                        iconSize={18}
                        tintColor={colors.mutedForeground}
                        accessibilityLabel={t("hadith.share")}
                        loading={isSharing(entry.item.id)}
                        loadingLabel={t("share.preparing")}
                        onPress={() => shareEntry(entry)}
                      />
                    )}
                    <LabeledIconButton
                      name={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
                      label={t("quran.actionBookmarked")}
                      iconSize={18}
                      tintColor={colors.accentText}
                      labelColor={colors.accentText}
                      accessibilityLabel={t("hadith.bookmarkRemove")}
                      accessibilityState={{ selected: true }}
                      onPress={() => remove(entry)}
                    />
                  </View>
                </View>
              ))}
            </ResponsiveGrid>
          </Stagger>
        </Card>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowContent: {
    flex: 1,
    gap: Spacing.one,
  },
  arabic: {},
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/hadith/bookmarks");
