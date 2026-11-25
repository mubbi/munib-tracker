import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { isRemoteEdition } from "@/api/quran-remote";
import { RECITE_ALONG_ICON } from "@/components/quran/recite-along-button";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { ContentState } from "@/components/ui/content-state";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import type { QuranBookmark } from "@/db/repositories/quran-repository";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import {
  getBundledEdition,
  getEditionById,
  getPageForAyah,
  getSurahAyahs,
  getSurahByNumber,
} from "@/lib/quran";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { resolvePrimaryEditionId } from "@/lib/quran-surah-reader";
import { arabicReadingLayout, resolveReadingFontSizes } from "@/lib/reading-typography";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { buildAyahSharePayload } from "@/lib/share";
import { resolveQuranEditionId } from "@/lib/translation-locale";
import { usePreferences } from "@/stores/preferences-store";
import {
  useQuranActions,
  useQuranBookmarks,
  useQuranPrefs,
  useQuranReady,
} from "@/stores/quran-store";

const FALLBACK_TRANSLATION = "en-pickthall";

/** Practice session on one bookmarked ayah (session default mode, reader as the source). */
function practiseBookmarkHref(surah: number, ayah: number) {
  return {
    pathname: "/quran/practice/session" as const,
    params: { surah: String(surah), from: String(ayah), to: String(ayah), source: "reader" },
  };
}

export default function QuranBookmarksScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { fontPrefs, translationLocale, locale } = usePreferences();
  const readingSizes = resolveReadingFontSizes("quran", fontPrefs);
  const prefs = useQuranPrefs();
  const ready = useQuranReady();
  const bookmarks = useQuranBookmarks();
  const { load, removeBookmark: removeStoredBookmark, restoreBookmark } = useQuranActions();
  // B-26: the store loads at start-up; if that load failed, the list would sit on
  // its skeleton forever. Load here too and offer Try again on failure.
  const [loadFailed, setLoadFailed] = useState(false);
  const retryLoad = useCallback(() => {
    setLoadFailed(false);
    load().catch(() => setLoadFailed(true));
  }, [load]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: load once when the store is not ready on mount
  useEffect(() => {
    if (!ready) retryLoad();
  }, []);
  const undoToast = useUndoToast();
  const { share, isSharing, isGesturePending, SnapshotHost } = useShareContentCard();
  const tv = isTV();
  // One-ayah practice session from a bookmark (D68); back returns to the reader.
  const practiceAvailable = isPracticeAvailable();
  // The reader's translation when it ships in the app; remote editions fall back
  // to the bundled English so the list never waits on the network.
  const preferredEdition = resolvePrimaryEditionId(
    prefs.preferredTranslationIds[0],
    resolveQuranEditionId({ translationLocale, locale }),
  );
  const editionId = isRemoteEdition(preferredEdition) ? FALLBACK_TRANSLATION : preferredEdition;
  const editionDir = getEditionById(editionId)?.direction ?? "ltr";

  const shareAyah = useCallback(
    (arabic: string, translation: string, surah: number, ayah: number) => {
      const surahMeta = getSurahByNumber(surah);
      void share({
        ...buildAyahSharePayload(arabic, translation, surah, ayah, {
          surahName: surahMeta?.nameTransliteration,
          sectionTitle: t("share.sectionQuran"),
        }),
        shareKey: `${surah}:${ayah}`,
      });
    },
    [share, t],
  );

  // Removal is instant and reversible: remove now, offer Undo (G-14).
  // Undo restores the exact record (same id + createdAt), not a fresh toggle.
  const removeBookmark = (bookmark: QuranBookmark) => {
    void undoToast.run({
      do: () => removeStoredBookmark(bookmark.surah, bookmark.ayah),
      undo: () => restoreBookmark(bookmark),
      messageKey: "quran.study.bookmarkRemoved",
    });
  };

  return (
    <ScreenLayout
      eyebrow={t("quran.title")}
      title={t("quran.bookmarksTitle")}
      subtitle={t("quran.bookmarksSubtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      {SnapshotHost}
      <Seo path="/quran/bookmarks" />
      {tv && undoToast.undoAvailable ? (
        <Button
          label={t("uiFeedback.undo")}
          variant="secondary"
          onPress={() => undoToast.undo()}
          icon={{ ios: "arrow.uturn.backward", android: "undo", web: "undo" }}
        />
      ) : null}
      {!ready && loadFailed ? (
        <ContentState status="error" onRetry={retryLoad} />
      ) : !ready ? (
        <SkeletonPlaceholder
          preset="card"
          count={3}
          accessibilityLabel={t("quran.study.loadingBookmarks")}
        />
      ) : bookmarks.length === 0 ? (
        <EmptyState
          icon={{ ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }}
          title={t("quran.bookmarkEmptyTitle")}
          description={tTv(t, "quran.bookmarkEmptyDesc", "quran.bookmarkEmptyDescTv")}
          actionLabel={t("quran.surahList")}
          onAction={() => router.push("/quran")}
        />
      ) : (
        <Stagger>
          {/* TV: one focus column. Tablet / desktop: 2–3 bookmark cards per row. */}
          <ResponsiveGrid gap={Spacing.two} maxColumns={3} columns={tv ? 1 : undefined}>
            {bookmarks.map((bm, index) => {
              const surah = getSurahByNumber(bm.surah);
              const arabic = getSurahAyahs(bm.surah)[bm.ayah - 1]?.arabic ?? "";
              const translation = getBundledEdition(editionId, bm.surah)[String(bm.ayah)] ?? "";
              const page = getPageForAyah(bm.surah, bm.ayah);
              const reference = `${bm.surah}:${bm.ayah}`;
              const sharePending = isGesturePending(reference);
              const openAyah = () =>
                router.push({
                  pathname: "/quran/[surah]",
                  params: { surah: String(bm.surah), ayah: String(bm.ayah) },
                });
              // One accessible element per bookmark (G-16): name, reference, page and
              // the translation. The Arabic stays visible (tagged `ar`) inside it.
              const label = [
                t("quran.study.bookmarkA11y", {
                  surah: surah?.nameTransliteration ?? "",
                  ref: reference,
                  page,
                }),
                translation,
              ]
                .filter(Boolean)
                .join(". ");

              return (
                <View key={bm.id} style={[styles.card, tv && styles.cardRowTv]}>
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    accessibilityHint={t("quran.study.bookmarkOpenHint")}
                    onPress={openAyah}
                    {...(tv && index === 0 ? { hasTVPreferredFocus: true } : {})}
                    scaleTo={0.99}
                    style={[styles.body, tv && styles.cardTv, { backgroundColor: colors.muted }]}
                  >
                    <View style={styles.meta}>
                      <View style={[styles.badge, { backgroundColor: tokens.accentSoft }]}>
                        <ThemedText type="caption" style={{ color: colors.accentText }}>
                          {reference} · {t("quran.pageN", { n: page })}
                        </ThemedText>
                      </View>
                      <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                        {surah?.nameTransliteration}
                      </ThemedText>
                    </View>
                    <ThemedText
                      type="arabic"
                      accessibilityLanguage="ar"
                      numberOfLines={tv ? 3 : 4}
                      style={arabicReadingLayout(readingSizes.arabic)}
                    >
                      {arabic}
                    </ThemedText>
                    {translation ? (
                      <ThemedText
                        type="small"
                        themeColor="mutedForeground"
                        numberOfLines={2}
                        style={[
                          { fontSize: readingSizes.translation },
                          editionDir === "rtl" ? styles.rtl : null,
                        ]}
                      >
                        {translation}
                      </ThemedText>
                    ) : null}
                  </PressableScale>
                  {/* Actions are siblings of the card body — never nested pressables. */}
                  <View style={[styles.actions, tv && styles.actionsTv]}>
                    {practiceAvailable && !tv ? (
                      <IconButton
                        name={RECITE_ALONG_ICON}
                        size={18}
                        tintColor={colors.mutedForeground}
                        accessibilityLabel={t("quranCompanion.entry.practiseAyah", {
                          n: reference,
                        })}
                        haptic={false}
                        onPress={() => router.push(practiseBookmarkHref(bm.surah, bm.ayah))}
                      />
                    ) : null}
                    {/* No system share sheet on TV. */}
                    {tv ? null : (
                      <IconButton
                        name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
                        size={18}
                        tintColor={colors.mutedForeground}
                        accessibilityLabel={
                          sharePending
                            ? tTv(t, "share.tapToShare", "share.selectToShare")
                            : t("quran.shareAyah")
                        }
                        loading={isSharing(reference)}
                        onPress={() => shareAyah(arabic, translation, bm.surah, bm.ayah)}
                      />
                    )}
                    <IconButton
                      name={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
                      size={tv ? 22 : 18}
                      tintColor={colors.accentText}
                      accessibilityLabel={t("quran.study.bookmarkRemoveA11y", { ref: reference })}
                      background={tv ? colors.muted : undefined}
                      hitTarget={tv ? TvLayout.minFocusTargetDp : undefined}
                      onPress={() => removeBookmark(bm)}
                    />
                  </View>
                </View>
              );
            })}
          </ResponsiveGrid>
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    gap: Spacing.one,
  },
  body: {
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  cardRowTv: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  cardTv: {
    flex: 1,
    minWidth: 0,
    minHeight: TvLayout.minFocusTarget,
  },
  meta: {
    flex: 1,
    gap: Spacing.half,
    minWidth: 0,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: Spacing.half,
  },
  actionsTv: { justifyContent: "flex-start" },
  rtl: { writingDirection: "rtl", textAlign: "right" },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/quran/bookmarks");
